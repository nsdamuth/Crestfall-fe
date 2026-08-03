export const PROFILE_MEDIA_MANAGER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the profile-media manager.
 *
 * The View owns the Profile Media panel, avatar/banner composition, explanatory
 * copy, and disabled future-action presentation. It does not own profile
 * records, media selection, uploads, generation, storage, permissions,
 * moderation, API calls, or persistence.
 *
 * @typedef {Object} ProfileMediaManagerViewProps
 * @property {string} eyebrow
 * @property {string} description
 * @property {Object} avatar
 * @property {string} avatar.displayName
 * @property {string|null} avatar.avatarUrl
 * @property {"sm"|"md"|"lg"} avatar.size
 * @property {string} avatar.title
 * @property {string} avatar.description
 * @property {string} avatar.actionLabel
 * @property {Object} banner
 * @property {string|null} banner.bannerUrl
 * @property {string} banner.bannerTitle
 * @property {boolean} banner.compact
 * @property {string} banner.title
 * @property {string} banner.description
 * @property {string} banner.actionLabel
 */

export {};
