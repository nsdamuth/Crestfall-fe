export const LORE_PARCHMENT_BACKGROUNDS = Object.freeze(
  Array.from({ length: 10 }, (_, index) =>
    Object.freeze({
      id: `parchment-${String(index + 1).padStart(2, "0")}`,
      src: `/images/parchments/${index + 1}.png`,
      index,
    })
  )
);

function normalizeSeed(value) {
  const normalized = String(value ?? "").trim();
  return normalized || "crestfall-lore";
}

export function hashLoreParchmentSeed(value) {
  const seed = normalizeSeed(value);
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function parchmentAt(index) {
  const count = LORE_PARCHMENT_BACKGROUNDS.length;
  const normalizedIndex = ((Number(index) || 0) % count + count) % count;
  return LORE_PARCHMENT_BACKGROUNDS[normalizedIndex];
}

export function resolveLoreParchmentBackground(seed) {
  return parchmentAt(hashLoreParchmentSeed(seed));
}

export function buildLoreParchmentPresentation({
  seed = "",
  chapterIds = [],
} = {}) {
  const stableSeed = normalizeSeed(seed);
  const cover = resolveLoreParchmentBackground(`${stableSeed}:cover`);
  let previousIndex = cover.index;

  const chapters = (Array.isArray(chapterIds) ? chapterIds : []).map(
    (chapterId, chapterIndex) => {
      const chapterSeed = `${stableSeed}:chapter:${chapterId || chapterIndex + 1}`;
      let background = resolveLoreParchmentBackground(chapterSeed);

      // Keep the visual rhythm varied without giving up deterministic selection.
      if (background.index === previousIndex && LORE_PARCHMENT_BACKGROUNDS.length > 1) {
        background = parchmentAt(background.index + 1 + (chapterIndex % 2));
      }

      previousIndex = background.index;
      return background;
    }
  );

  return {
    seed: stableSeed,
    cover,
    chapters,
  };
}
