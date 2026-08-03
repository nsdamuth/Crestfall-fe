export const STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION = "studio-top-bar.view.v1";

export const studioTopBarViewContract = Object.freeze({
  version: STUDIO_TOP_BAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render Studio account utilities without owning account context, balance normalization, or utility-modal state.",
  inputs: Object.freeze([
    "eyebrow",
    "description",
    "formattedCoins",
    "buyCoinsLabel",
    "notificationsLabel",
    "accountHref",
    "accountAriaLabel",
    "accountLinkSlot",
    "utilityModal",
  ]),
  callbacks: Object.freeze([
    "onOpenBuyCoins",
    "onOpenNotifications",
    "onCloseUtility",
  ]),
  applicationOwnedDependencies: Object.freeze(["useStudioAccount"]),
  behavior: Object.freeze({
    accountStatusLoadingDisplay: "...",
    invalidBalanceDisplay: "0",
    utilityKinds: ["buy", "notifications"],
    desktopBreakpoint: "lg",
  }),
});
