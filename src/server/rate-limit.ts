import { isIP } from "node:net";
import type { ProviderEnvironment } from "@/provider/config";

export const RATE_LIMIT = { requests: 10, windowMs: 60_000, maxClients: 1024 } as const;

/**
 * Process-local fixed windows: best effort, reset on restart, not coordinated
 * across serverless instances. Header trust requires an ingress that strips
 * user-supplied values and sets its own. Opt-in alone is not proof of identity.
 */
export class RateLimiter {
  private readonly clients = new Map<string, { start: number; count: number }>();
  private overflow = { start: 0, count: 0 };

  take(client: string, now: number): { allowed: boolean; retryAfter: number } {
    for (const [key, window] of this.clients) {
      if (now - window.start >= RATE_LIMIT.windowMs) this.clients.delete(key);
    }
    let window = this.clients.get(client);
    if (!window) {
      if (this.clients.size >= RATE_LIMIT.maxClients) {
        if (now - this.overflow.start >= RATE_LIMIT.windowMs) this.overflow = { start: now, count: 0 };
        window = this.overflow;
      } else {
        window = { start: now, count: 0 };
        this.clients.set(client, window);
      }
    }
    if (window.count >= RATE_LIMIT.requests) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((window.start + RATE_LIMIT.windowMs - now) / 1000)) };
    }
    window.count += 1;
    return { allowed: true, retryAfter: 0 };
  }

  get size(): number { return this.clients.size; }
}

export function clientKey(request: Request, env: ProviderEnvironment): string {
  const trusted = env.CHAT_TRUSTED_PROXY_IP_HEADER;
  if (trusted !== "x-forwarded-for" && trusted !== "x-real-ip") return "global";
  const value = request.headers.get(trusted);
  // A single IP is intentional: ambiguous chains cannot establish which proxy
  // supplied which address. Without verified ingress, leave this opt-in unset.
  return value && value.length <= 45 && isIP(value.trim()) ? `ip:${value.trim()}` : "global";
}
