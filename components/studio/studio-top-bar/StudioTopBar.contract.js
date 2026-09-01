export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v7";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the Studio global search field, a quiet notifications button and single recent-activity modal, account utilities, and the Eggshell/Night presentation toggle at every breakpoint, without owning search state, notification retrieval, modal state, account context, theme persistence, or shared mobile-drawer state.",
  inputs: Object.freeze([
    "searchValue",
    "searchPlaceholder",
    "searchAutoFocus",
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
  ]),
  callbacks: Object.freeze([
    "onSearchChange",
    "onOpenNotifications",
    "onCloseNotifications",
    "onToggleTheme",
    "onOpenMenu",
  ]),
  applicationOwnedDependencies: Object.freeze([]),
  behavior: Object.freeze({
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
