export const STUDIO_ECONOMY_WIDGET_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {"expanded"|"collapsed"|"mobileHeader"} StudioEconomyWidgetLayoutMode
 */

/**
 * Stable UI boundary for the portable Studio Economy Widget View.
 *
 * The View must not read account context, parse balances, or decide which host
 * layout variant is active. It receives display-ready wallet content and emits
 * semantic intent for its temporary information dialogs.
 *
 * @typedef {Object} StudioEconomyWidgetViewProps
 * @property {StudioEconomyWidgetLayoutMode} layoutMode
 * @property {string} balanceLabel
 * @property {boolean} buyInfoOpen
 * @property {boolean} notificationsInfoOpen
 * @property {(() => void)|null} onOpenBuyInfo
 * @property {(() => void)|null} onCloseBuyInfo
 * @property {(() => void)|null} onOpenNotificationsInfo
 * @property {(() => void)|null} onCloseNotificationsInfo
 */

export {};
