export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v4";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the Studio global search field, the notifications bell, its two floating panels (compact and full notification center), and account utilities, without owning search state, notification data, panel open state, or account context.",
  inputs: Object.freeze([
    "searchValue",
    "searchPlaceholder",
    "searchAutoFocus",
    "notifications",
    "notificationsLabel",
    "notificationsView",
    "bellRef",
    "accountHref",
    "accountAriaLabel",
    "accountInitial",
    "accountLinkSlot",
  ]),
  callbacks: Object.freeze([
    "onSearchChange",
    "onOpenNotifications",
    "onOpenNotificationCenter",
    "onCloseNotifications",
    "onDismissNotification",
    "onClearAllNotifications",
  ]),
  applicationOwnedDependencies: Object.freeze([]),
  behavior: Object.freeze({
    hasNotifications: "derived as notifications.length > 0",
    notificationsView:
      "ViewModel-owned: null | 'compact' | 'full'. The View renders the shared ModalShell primitive (components/ui/ModalShell) for either panel, unmodified from its 12 other callers.",
    focusReturn:
      "bellRef is a ViewModel-owned ref; onCloseNotifications refocuses it after closing.",
    notificationShape: "{ id, title, supportingLine, group: 'today' | 'earlier' }",
    compactPanelRowLimit:
      "The compact panel shows the first 3 items of notifications (a quick view); the full center groups the complete list under TODAY/EARLIER. Presentation-only slicing, same data and same handlers.",
    accountInitial:
      "ViewModel-owned single uppercase character (account email initial, '?' when unknown), rendered in the same circular avatar recipe as the sidebar's signed-in footer (surface-3 fill, --line border, gold-ornament initial), sized to the top bar's control-md icon button.",
    desktopBreakpoint: "lg",
  }),
});
