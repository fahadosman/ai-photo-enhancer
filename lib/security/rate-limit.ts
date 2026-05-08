type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  maxRequests = 60,
  windowMs = 60_000
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.expiresAt) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= maxRequests) {
    return { ok: false, retryAfterMs: bucket.expiresAt - now };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return { ok: true };
}
