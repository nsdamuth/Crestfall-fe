export const STUDIO_ECONOMY_WIDGET_VIEW_CONTRACT_VERSION = "1.1.0";

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
 *
 * 1.1.0, 23 Aug 2026 (build-0823 pass 4, sidebar refinement, RULED):
 * the "expanded" and "collapsed" layoutMode renderings drop their
 * Notifications control entirely (notifications live in the top bar
 * bell only) and the "expanded" mode's coins area becomes one compact
 * row (coin glyph plus count, a small "Buy Coins" chip) replacing the
 * boxed section with stacked full-width buttons. No prop removed:
 * notificationsInfoOpen / onOpenNotificationsInfo /
 * onCloseNotificationsInfo remain for the "mobileHeader" mode, which
 * is unchanged.
 */

export {};
