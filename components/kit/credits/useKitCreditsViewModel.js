function normalizeCredits(credits) {
  if (!Array.isArray(credits)) return [];

  return credits
    .filter((item) => item && item.creatorHandle)
    .map((item, index) => ({
      id: item.id || `credit-${index + 1}`,
      kindLabel: item.kindLabel || "",
      creatorHandle: item.creatorHandle,
      creatorHref: typeof item.creatorHref === "string" ? item.creatorHref : null,
      assetTitle: typeof item.assetTitle === "string" ? item.assetTitle : null,
    }));
}

export function useKitCreditsViewModel({
  credits = [],
  LinkComponent = "a",
  showHeading = true,
} = {}) {
  return {
    credits: normalizeCredits(credits),
    LinkComponent: LinkComponent || "a",
    showHeading: Boolean(showHeading),
  };
}
