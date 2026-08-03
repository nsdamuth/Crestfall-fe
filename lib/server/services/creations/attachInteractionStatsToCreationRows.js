function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function getRowId(row) {
  return row?.id || row?.creation_id || row?.row_id || null;
}

export async function attachInteractionStatsToCreationRows({
  creationRepository,
  rows = [],
}) {
  const creationIds = [...new Set(rows.map(getRowId).filter(Boolean))];

  if (!creationIds.length) {
    return {
      data: rows,
      error: null,
    };
  }

  const { data: rollups, error } =
    await creationRepository.listInteractionRollupsByCreationIds({
      creationIds,
    });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const rollupByCreationId = new Map(
    (rollups || []).map((rollup) => [rollup.creation_id, rollup])
  );

  return {
    data: rows.map((row) => {
      const rollup = rollupByCreationId.get(getRowId(row));
      const currentData =
        row.data && typeof row.data === "object" && !Array.isArray(row.data)
          ? row.data
          : {};

      const currentStats =
        currentData.stats &&
        typeof currentData.stats === "object" &&
        !Array.isArray(currentData.stats)
          ? currentData.stats
          : {};

      const interactionCount = toNumber(rollup?.total_interaction_count, 0);

      return {
        ...row,
        interaction_count: interactionCount,
        data: {
          ...currentData,
          stats: {
            ...currentStats,
            messages: interactionCount,
            interactions: interactionCount,
          },
        },
      };
    }),
    error: null,
  };
}