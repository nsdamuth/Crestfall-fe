export const PROFILE_BACK_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for profile back navigation.
 *
 * The View owns only the circular back-button presentation and safe invocation
 * of semantic navigation intent. It does not inspect browser history, use the
 * Next.js router, choose a fallback route, or own profile-page navigation.
 *
 * @typedef {Object} ProfileBackButtonViewProps
 * @property {string} ariaLabel Accessible label for the icon-only control.
 * @property {null|(() => void)} onGoBack Semantic back-navigation intent.
 */

export {};
