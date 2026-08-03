export const PROFILE_SHARE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the public-profile share action.
 *
 * The View owns only button presentation and safe invocation of semantic share
 * intent. It does not receive a username, construct a profile URL, access
 * browser clipboard APIs, own transient copy status, or persist application
 * state.
 *
 * @typedef {Object} ProfileShareButtonViewProps
 * @property {string} buttonLabel Display-ready action/status label.
 * @property {null|(() => void)} onShare Semantic profile-share intent.
 */

export {};
