import { buildCreationCardMetrics } from "@/lib/shared/presentation/creationCardMetrics";

export function useCreationStatsRowViewModel({
  creationType = null,
  usageMetrics = null,
  stats = {},
  compact = false,
} = {}) {
  return {
    items: buildCreationCardMetrics({
      creationType,
      usageMetrics,
      fallbackStats: stats,
    }),
    compact: Boolean(compact),
  };
}
