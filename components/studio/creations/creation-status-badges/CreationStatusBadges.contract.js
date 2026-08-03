export const CREATION_STATUS_BADGES_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Creation Status Badges portable View.
 *
 * The View owns badge presentation, label formatting, and visual tone mapping.
 * It does not receive a raw creation record and does not interpret creation
 * visibility, lifecycle, canon, publication, moderation, or persistence rules.
 *
 * @typedef {Object} CreationStatusBadgeViewItem
 * @property {string} id Stable semantic rendering key.
 * @property {string} value Display value used for label and visual tone.
 *
 * @typedef {Object} CreationStatusBadgesViewProps
 * @property {CreationStatusBadgeViewItem[]} badges
 * @property {boolean} compact
 */

export {};
