export const KIT_BADGE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared badge kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.10).
 *
 * The View receives only a label, a constrained variant, and the
 * surface it sits on. It does not know visibility enum values,
 * category data, or any product record; the caller resolves those
 * into a label and a variant before this component ever sees them.
 *
 * Badges are non-interactive labels (shape law: pill shapes are
 * reserved for tags and icon buttons, never a clickable control).
 * A dismissible or clickable badge is not a badge; it is a chip
 * (KitFilterChip).
 *
 * @typedef {Object} KitBadgeViewProps
 * @property {string} label
 * @property {"canon"|"status"|"meta"} variant
 * @property {"canvas"|"art"} surface
 */

export {};
