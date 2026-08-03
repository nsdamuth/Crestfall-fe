export const STUDIO_ACCOUNT_COINS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} StudioAccountCoinsViewStatItem
 * @property {string} id
 * @property {string} value
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Studio Account Coins View.
 *
 * The View must not load account data, parse profile payloads, or know which
 * client/API path owns the coin balance. It receives display-ready wallet
 * content and emits semantic open/close intent only.
 *
 * @typedef {Object} StudioAccountCoinsViewProps
 * @property {string} balanceLabel
 * @property {string} balanceErrorMessage
 * @property {StudioAccountCoinsViewStatItem[]} statItems
 * @property {boolean} purchaseInfoOpen
 * @property {(() => void)|null} onOpenPurchaseInfo
 * @property {(() => void)|null} onClosePurchaseInfo
 */

export {};
