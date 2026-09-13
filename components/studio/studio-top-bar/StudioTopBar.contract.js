export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v9";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the Studio global search (KitGlobalSearch, fed by the top bar adapter), a quiet notifications button and single recent-activity modal, account utilities, and the Eggshell/Night presentation toggle at every breakpoint, without owning search data, notification retrieval, modal state, account context, theme persistence, or shared mobile-drawer state.",
  inputs: Object.freeze([
    "globalSearch",
    "notifications",
    "notificationsStatus",
    "notificationsLoadError",
    "notificationsLabel",
    "notificationsView",
    "bellRef",
    "themeMode",
    "themeToggleAriaLabel",
    "accountHref",
    "accountAriaLabel",
    "accountInitial",
    "accountLinkSlot",
    "openMenuAriaLabel",
    "hiddenBelowMd",
  ]),
  callbacks: Object.freeze([
    "onOpenNotifications",
    "onCloseNotifications",
    "onToggleTheme",
    "onOpenMenu",
  ]),
  applicationOwnedDependencies: Object.freeze([]),
  behavior: Object.freeze({
    hiddenBelowMd:
      "v9 (fe/chat-studio item 1, 12 Sep 2026), additive: a route-driven boolean the Binding Shell sets from isStoryChatPath. True stamps data-studio-top-bar-hidden-below-md on the header, and app/design-system.css hides the bar under md so the story chat page's own 44px bar is the only chrome there. The bar stays at md and up on every route, and on every other route at every width.",
    globalSearch:
      "v8 (FE/GLOBAL-SEARCH, 10 Sep 2026): the bare search input is replaced by KitGlobalSearch. `globalSearch` is the prop bag the top bar adapter (useGlobalSearchAdapter) produces: { own, community, onRequestData, onNavigate }, plus any KitGlobalSearch prop. The View spreads it onto the Kit and owns no search state; searchValue, searchPlaceholder, searchAutoFocus, and onSearchChange (v7) are retired.",
    quietBell:
      "The bell never displays an unread count, red badge, pulse, or content-dependent emphasis. It is a stable button that opens the feed on demand.",
    notificationScope:
      "Initial feed contains only followed-creator publication events and Coins received. Drafts, saves, edits, unlisted/private work, comments, image-generation completion, and generic engagement noise are excluded.",
    notificationsView:
      "ViewModel-owned: null | 'compact'. One modal shows the recent feed; there is no clear-all, dismiss-per-row, unread state, or separate notification center in this foundation slice.",
    focusReturn:
      "bellRef is ViewModel-owned; onCloseNotifications refocuses it after closing.",
    notificationShape:
      "{ id, type, title, body?, supportingLine, href? } projected by the ViewModel from the services notification feed.",
    themeToggle:
      "ViewModel-owned callback with Shell-owned persistence. Dark mode shows a Sun action icon; Eggshell mode shows a Moon action icon.",
    accountInitial:
      "ViewModel-owned single uppercase account-email initial, '?' when unknown.",
  }),
});
