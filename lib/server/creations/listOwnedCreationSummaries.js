import { toCreationSummary } from "@/lib/server/services/creations/toCreationSummary";

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

  return {
    data: (data || []).map(toCreationSummary),
    error: null,
  };
}