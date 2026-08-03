export const PROFILE_AVATAR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable profile-avatar primitive.
 *
 * The View owns avatar presentation, supported visual sizes, image rendering,
 * accessible image text, and fallback-initial presentation. It does not own
 * profile loading, media upload, image persistence, permissions, navigation,
 * API calls, or profile editing.
 *
 * @typedef {Object} ProfileAvatarViewProps
 * @property {string} displayName
 * @property {string|null} avatarUrl
 * @property {"sm"|"md"|"lg"} size
 */

export {};
