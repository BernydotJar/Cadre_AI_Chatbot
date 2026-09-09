import { ProviderError } from "@/provider/types";

export type Clock = {
  now(): number;
  setTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(timer: ReturnType<typeof setTimeout>): void;
};

export const systemClock: Clock = {
  now: () => Date.now(),
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timer) => clearTimeout(timer),
};

/** One deadline covers fetch, response streams, preflight, and retry delay. */
export function deadline(milliseconds: number, parent: AbortSignal | undefined, clock = systemClock) {
  const controller = new AbortController();
  const cancel = () => controller.abort(
    parent?.reason instanceof ProviderError ? parent.reason : new ProviderError("cancelled"),
  );
  const timer = clock.setTimeout(() => controller.abort(new ProviderError("timeout")), milliseconds);
  parent?.addEventListener("abort", cancel, { once: true });
  if (parent?.aborted) cancel();
  return {
    signal: controller.signal,
    dispose() {
      clock.clearTimeout(timer);
      parent?.removeEventListener("abort", cancel);
    },
  };
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw signal.reason instanceof ProviderError ? signal.reason : new ProviderError("cancelled");
  }
}

/** Also bounds a mock/transport that ignores AbortSignal. */
export function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const cancel = () => reject(
      signal.reason instanceof ProviderError ? signal.reason : new ProviderError("cancelled"),
    );
    signal.addEventListener("abort", cancel, { once: true });
    if (signal.aborted) cancel();
    work.then(resolve, reject).finally(() => signal.removeEventListener("abort", cancel));
  });
}

export function delay(ms: number, signal: AbortSignal, clock: Clock): Promise<void> {
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    const cancel = () => {
      clock.clearTimeout(timer);
      reject(signal.reason instanceof ProviderError ? signal.reason : new ProviderError("cancelled"));
    };
    const timer = clock.setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, ms);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

export class BodyError extends Error {
  constructor(public readonly code: "too_large" | "invalid_json" | "unreadable") {
    super(code);
  }
}

export function cancelBody(body: ReadableStream<Uint8Array> | null): void {
  if (body && !body.locked) void body.cancel().catch(() => undefined);
}

/** Check actual UTF-8 bytes while streaming, before buffering/JSON parsing. */
export async function readBoundedJson(
  source: Request | Response,
  maximumBytes: number,
  signal: AbortSignal,
): Promise<unknown> {
  throwIfAborted(signal);
  const declared = source.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || !Number.isSafeInteger(Number(declared)))) {
    cancelBody(source.body);
    throw new BodyError("unreadable");
  }
  if (declared !== null && Number(declared) > maximumBytes) {
    cancelBody(source.body);
    throw new BodyError("too_large");
  }
  const reader = source.body?.getReader();
  if (!reader) throw new BodyError("invalid_json");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const parts: string[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await abortable(reader.read(), signal);
      throwIfAborted(signal);
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maximumBytes) throw new BodyError("too_large");
      parts.push(decoder.decode(part.value, { stream: true }));
    }
    parts.push(decoder.decode());
    try {
      return JSON.parse(parts.join("")) as unknown;
    } catch {
      throw new BodyError("invalid_json");
    }
  } catch (error) {
    void reader.cancel().catch(() => undefined);
    if (error instanceof BodyError || error instanceof ProviderError) throw error;
    throw new BodyError("unreadable");
  } finally {
    reader.releaseLock();
  }
}
