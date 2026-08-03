export const CREATION_CREDITS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Creation Credits View.
 *
 * The View receives display-ready attribution rows. It does not receive the
 * raw creation graph or know how Crestfall resolves creator attribution,
 * inherited assets, template sources, profile routes, or ownership data.
 *
 * @typedef {Object} CreationCreditViewItem
 * @property {string} id Stable rendering key.
 * @property {string} kindLabel Human-readable attribution kind.
 * @property {string} creatorHandle Display-ready creator handle.
 * @property {string|null} creatorHref Optional public creator-profile route.
 * @property {string|null} assetTitle Optional credited asset title.
 *
 * @typedef {Object} CreationCreditsViewProps
 * @property {CreationCreditViewItem[]} credits
 */

export {};
