export const STUDIO_ECONOMY_WIDGET_VIEW_CONTRACT_VERSION = "1.3.0";

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
 * @property {boolean} [lowBalance] True when the balance is below the cost of one standard generation (ViewModel-owned; the View never parses the balance).
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
 *
 * 1.2.0, 6 Sep 2026 (sidebar batch 1, item 6, RULED): the "expanded"
 * mode stacks the coin count above a full-width Buy Coins button
 * (the one-row form wrapped the button label beside a six-character
 * count at the sidebar width). balanceLabel is display-ready and now
 * follows the coin display law: full numbers with thousands
 * separators below 100,000 ("99,999"), compact from 100,000 ("100k",
 * "1.2M", "999.9M"), never longer than six characters. No prop added
 * or removed.
 *
 * 1.3.0, 6 Sep 2026 (sidebar batch 2, RULED with GO corrections): one
 * additive optional input, lowBalance. The "expanded" button is the
 * rail's one gold filled primary, full block width, label "Upgrade"
 * in every state, opening the existing purchase flow for now; the
 * balance row centers over it. Low balance switches the balance row
 * (glyph and number) to the warning amber text token; the button
 * stays gold. "collapsed" renders the balance as a small badge
 * centered above a gold Upgrade button (tooltip "Upgrade"); low
 * balance turns the badge number amber. No prop removed.
 */

export {};
