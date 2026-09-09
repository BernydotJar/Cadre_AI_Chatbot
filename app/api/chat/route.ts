import { LIMITS } from "@/core/limits";
import { parseChatRequest } from "@/core/validate";

export async function POST(request: Request) {
  // Reject oversized payloads before JSON parsing. Content-Length gives a
  // fast path; chunked bodies without it are length-checked after reading.
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > LIMITS.maxBodyBytes) {
    return Response.json({ error: "request body is too large" }, { status: 413 });
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return Response.json({ error: "request body could not be read" }, { status: 400 });
  }
  if (text.length > LIMITS.maxBodyBytes) {
    return Response.json({ error: "request body is too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "request body must be valid JSON" }, { status: 400 });
  }

  const parsed = parseChatRequest(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const last = parsed.request.messages[parsed.request.messages.length - 1];
  return Response.json({
    reply: `Walking skeleton: received "${last?.content ?? ""}". The grounded chat pipeline arrives in the next increment.`,
    kind: "clarify",
  });
}
