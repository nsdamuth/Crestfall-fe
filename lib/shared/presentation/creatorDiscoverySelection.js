function normalizeLimit(value, fallback = 4) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.trunc(parsed));
}

/**
 * Pick up to `limit` creator-discovery items without mutating the caller's
 * source array. The caller owns popup-lifetime stability by memoizing the
 * returned selection for the currently opened Creation.
 */
export function pickRandomCreatorDiscoveryItems(
  items = [],
  limit = 4,
  random = Math.random
) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const safeLimit = normalizeLimit(limit);

  if (safeLimit === 0 || safeItems.length === 0) return [];
  if (safeItems.length <= safeLimit) return [...safeItems];

  const shuffled = [...safeItems];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const draw = Math.min(Math.max(Number(random()), 0), 0.9999999999999999);
    const swapIndex = Math.floor(draw * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, safeLimit);
}
