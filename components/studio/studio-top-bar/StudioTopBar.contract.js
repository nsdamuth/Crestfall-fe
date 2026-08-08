export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v2";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the Studio global search field and account utilities without owning search state, notification data, or account context.",
  inputs: Object.freeze([
    "searchValue",
    "searchPlaceholder",
    "searchAutoFocus",
    "notifications",
    "notificationsLabel",
    "initialNotificationsOpen",
    "accountHref",
    "accountAriaLabel",
    "accountLinkSlot",
  ]),
  callbacks: Object.freeze(["onSearchChange", "onOpenNotifications"]),
  applicationOwnedDependencies: Object.freeze([]),
  behavior: Object.freeze({
    hasNotifications: "derived as notifications.length > 0",
    notificationsPopupOpenState:
      "local to the view, presentation-only; initialNotificationsOpen only seeds the preview harness",
    desktopBreakpoint: "lg",
  }),
});
