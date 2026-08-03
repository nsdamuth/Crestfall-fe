export const PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_CONTRACT_VERSION = "1.0.0";

export const PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS = Object.freeze({
  CREATION: "CREATION",
  DONATION: "DONATION",
});

/**
 * Portable View contract.
 *
 * events: Array<{
 *   id: string,
 *   kind: "CREATION" | "DONATION",
 *   occurredLabel: string,
 *
 *   // Creation event fields
 *   username?: string,
 *   actionLabel?: string,
 *   typeLabel?: string,
 *   href?: string,
 *   imageUrl?: string | null,
 *   title?: string,
 *   description?: string,
 *
 *   // Donation event fields
 *   amountNet?: number | string,
 *   senderLabel?: string,
 *   message?: string,
 * }>
 *
 * emptyTitle: string
 * emptyBody: string
 */
export const PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS = Object.freeze({
  events: [],
  emptyTitle: "No activity yet",
  emptyBody:
    "Public releases, creator updates, and support activity will appear here.",
});
