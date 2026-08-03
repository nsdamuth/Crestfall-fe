const CREATION_STAT_DEFINITIONS = [
  { id: "likes", sourceKey: "likes" },
  { id: "messages", sourceKey: "messages" },
  { id: "images", sourceKey: "images" },
  { id: "videos", sourceKey: "videos" },
];

function normalizePositiveNumber(value) {
  const number = Number(value || 0);

  return number > 0 ? number : null;
}

export function useCreationStatsRowViewModel({
  stats = {},
  compact = false,
} = {}) {
  const items = CREATION_STAT_DEFINITIONS.map(({ id, sourceKey }) => {
    const value = normalizePositiveNumber(stats?.[sourceKey]);

    return value === null ? null : { id, value };
  }).filter(Boolean);

  return {
    items,
    compact: Boolean(compact),
  };
}
