import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

const isRateLimitConfigured = Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);

const ratelimit = isRateLimitConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: env.UPSTASH_REDIS_REST_URL!,
        token: env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
    })
  : null;

/**
 * Retourne `success: true` si Upstash n'est pas configuré (mode démo, cf. .env.example) :
 * le rate limiting est câblé mais desactivé tant que les clés ne sont pas fournies.
 */
export async function checkRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!ratelimit) return { success: true };
  const { success } = await ratelimit.limit(identifier);
  return { success };
}
