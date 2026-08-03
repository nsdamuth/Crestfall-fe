export const CREATION_SHARE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the creation-share action.
 *
 * The View owns only button presentation and safe invocation of semantic share
 * intent. It does not receive a creation URL, construct an absolute URL, access
 * browser clipboard APIs, own transient copy status, or persist application
 * state.
 *
 * @typedef {Object} CreationShareButtonViewProps
 * @property {string} buttonLabel Display-ready action/status label.
 * @property {boolean} disabled Whether the action is unavailable.
 * @property {null|(() => void)} onShare Semantic share intent.
 */

export {};
