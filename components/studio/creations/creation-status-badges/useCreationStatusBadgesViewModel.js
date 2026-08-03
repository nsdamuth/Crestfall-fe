function normalizeBadge(id, value) {
  if (!value) return null;

  return {
    id,
    value: String(value),
  };
}

export function useCreationStatusBadgesViewModel({
  creation = {},
  compact = false,
} = {}) {
  const isPublicOrCanon =
    creation?.visibility === "PUBLIC" || creation?.canonStatus === "ACCEPTED";

  const badges = [
    normalizeBadge("type", creation?.typeLabel || creation?.type),
    normalizeBadge("visibility", creation?.visibility),
    normalizeBadge(
      "status",
      isPublicOrCanon && creation?.status === "APPROVED"
        ? null
        : creation?.status
    ),
    normalizeBadge(
      "canon-status",
      creation?.canonStatus === "ACCEPTED" ? "CANON" : null
    ),
    normalizeBadge("content-rating", creation?.contentRating),
  ].filter(Boolean);

  return {
    badges,
    compact: Boolean(compact),
  };
}
