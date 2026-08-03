import { toCreationSummary } from "@/lib/server/services/creations/toCreationSummary";
import { attachFeaturedImageSlotsToCreationRows } from "@/lib/server/services/creations/attachFeaturedImageSlotsToCreationRows";
import { attachInteractionStatsToCreationRows } from "@/lib/server/services/creations/attachInteractionStatsToCreationRows";

export async function listPublicCreationSummariesByOwner({
  creationRepository,
  ownerId,
  filters = {},
}) {
  const { data, error } = await creationRepository.listPublicByOwner({
    ownerId,
    type: filters.type ?? null,
    contentRating: filters.contentRating ?? null,
  });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const {
    data: rowsWithFeaturedMedia,
    error: featuredMediaError,
  } = await attachFeaturedImageSlotsToCreationRows({
    creationRepository,
    rows: data || [],
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
    data: (rowsWithInteractionStats || []).map(toCreationSummary),
    error: null,
  };
}