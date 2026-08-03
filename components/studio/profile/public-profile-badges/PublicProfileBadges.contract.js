export const PUBLIC_PROFILE_BADGES_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable View contract.
 *
 * badges: Array<{
 *   id: string,
 *   slug: string,
 *   label: string,
 *   description: string,
 *   category: string,
 *   categoryLabel: string,
 *   imageUrl: string | null,
 *   awardedAt: string | null,
 *   sortOrder: number,
 * }>
 *
 * emptyTitle: string
 * emptyBody: string
 */
export const PUBLIC_PROFILE_BADGES_VIEW_DEFAULTS = Object.freeze({
  badges: [],
  emptyTitle: "No badges yet",
  emptyBody:
    "Crestfall badges earned by this creator will appear here.",
});
