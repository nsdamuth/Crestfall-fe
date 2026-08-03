export const PROFILE_FOLLOW_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the profile-connections follow button.
 *
 * The View owns only button presentation. It does not receive a username,
 * inspect authentication or profile records, call the follow API, refresh the
 * route, interpret response payloads, or own persisted follow state.
 *
 * @typedef {Object} ProfileFollowButtonViewProps
 * @property {boolean} isVisible
 * @property {boolean} isFollowing
 * @property {boolean} isSaving
 * @property {null|(() => void)} onToggleFollow
 */

export {};
