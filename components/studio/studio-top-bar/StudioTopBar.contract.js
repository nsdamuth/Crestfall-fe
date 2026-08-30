export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v6";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the Studio global search field, the notifications bell, its two floating panels (compact and full notification center), account utilities, and the Eggshell/Night presentation toggle at every breakpoint, without owning search state, notification data, panel open state, account context, theme persistence, or the shared drawer-open state its mobile hamburger trigger reports to.",
  inputs: Object.freeze([
    "searchValue",
    "searchPlaceholder",
    "searchAutoFocus",
    "notifications",
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
    "onOpenNotificationCenter",
    "onCloseNotifications",
    "onDismissNotification",
    "onClearAllNotifications",
    "onToggleTheme",
    "onOpenMenu",
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
    themeToggle:
      "ViewModel-owned callback with Shell-owned persistence. Dark mode shows a Sun action icon; Eggshell mode shows a Moon action icon, matching the 30 Aug 2026 Home proof direction.",
    accountInitial:
      "ViewModel-owned single uppercase character (account email initial, '?' when unknown), rendered in the same circular avatar recipe as the sidebar's signed-in footer (surface-3 fill, --line border, gold-ornament initial), sized to the top bar's control-md icon button.",
    renderedAtEveryBreakpoint:
      "8 Aug 2026 ruling (Review Mode / mobile nav restyle brief item 7): the header is no longer hidden below lg. A hamburger trigger (onOpenMenu) renders lg:hidden, matching the proof's mobile studio-home topbar; the account avatar renders hidden lg:flex, since mobile account access moves to the drawer's signed-in footer (StudioMobileNav). onOpenMenu is a ViewModel-owned passthrough; the actual open/closed drawer state is owned by StudioShell.jsx (the Binding Shell one level up), the only place both StudioTopBar and StudioMobileNav are composed together.",
  }),
});
