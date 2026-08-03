export const PUBLIC_PROFILE_ENGAGEMENT_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the public-profile engagement action surface.
 *
 * The View owns the error-message presentation, wrapper layout, and composition
 * of the portable creator-engagement actions View. It does not receive the raw
 * profile record and does not own engagement state, authentication, API calls,
 * optimistic updates, profile refreshes, or persistence.
 *
 * @typedef {Object} PublicProfileEngagementActionsViewProps
 * @property {boolean} isVisible
 * @property {string} className
 * @property {string} errorMessage
 * @property {Object} engagementActions
 */

export {};
