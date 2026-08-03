import { toCreationSummary } from "@/lib/server/services/creations/toCreationSummary";
import { attachFeaturedImageSlotsToCreationRows } from "@/lib/server/services/creations/attachFeaturedImageSlotsToCreationRows";

import {
  applyOwnerAttribution,
  getOwnerAttributionById,
} from "@/lib/server/services/creations/ownerAttribution";
import { attachInteractionStatsToCreationRows } from "@/lib/server/services/creations/attachInteractionStatsToCreationRows";

export async function listOwnedCreationSummaries({
  creationRepository,
  ownerId,
  filters = {},
}) {
  const { data, error } = await creationRepository.listOwned({
    ownerId,
    type: filters.type ?? null,
    status: filters.status ?? null,
  });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const rows = data || [];

  const {
    data: attributionByOwnerId,
    error: attributionError,
  } = await getOwnerAttributionById({
    creationRepository,
    ownerIds: rows.map((row) => row.owner_id),
  });

  if (attributionError) {
    return {
      data: null,
      error: attributionError,
    };
  }

  const attributedRows = rows.map((row) =>
    applyOwnerAttribution(row, attributionByOwnerId)
  );

  const {
    data: rowsWithFeaturedMedia,
    error: featuredMediaError,
  } = await attachFeaturedImageSlotsToCreationRows({
    creationRepository,
    rows: attributedRows,
  });

  if (featuredMediaError) {
    return {
      data: null,
      error: featuredMediaError,
    };
  }

  const {
    data: rowsWithInteractionStats,
    error: interactionStatsError,
  } = await attachInteractionStatsToCreationRows({
    creationRepository,
    rows: rowsWithFeaturedMedia || [],
  });

  if (interactionStatsError) {
    return {
      data: null,
      error: interactionStatsError,
    };
  }

  return {
    data: (rowsWithInteractionStats || []).map((row) =>
      toCreationSummary(row, {
        includeData: true,
      })
    ),
    error: null,
  };
}