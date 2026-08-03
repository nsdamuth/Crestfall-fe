export const STUDIO_MOBILE_NAV_VIEW_CONTRACT_VERSION =
  "studio-mobile-nav.view.v1";

export const studioMobileNavViewContract = Object.freeze({
  version: STUDIO_MOBILE_NAV_VIEW_CONTRACT_VERSION,
  purpose:
    "Render mobile Studio header, drawer, and bottom navigation without owning Next.js routing, pathname interpretation, account data, or economy context.",
  inputs: Object.freeze([
    "brandLabel",
    "brandHref",
    "drawerEyebrow",
    "drawerTitle",
    "communityLinksLabel",
    "signedInLabel",
    "signedInEmail",
    "logoutLabel",
    "logoutHref",
    "accountHref",
    "accountAriaLabel",
    "openMenuAriaLabel",
    "closeMenuAriaLabel",
    "closeOverlayAriaLabel",
    "open",
    "socialOpen",
    "primaryLinks",
    "utilityLinks",
    "socialLinks",
    "bottomLinks",
    "InternalLinkComponent",
    "headerEconomySlot",
    "drawerEconomySlot",
  ]),
  callbacks: Object.freeze([
    "onOpenMenu",
    "onCloseMenu",
    "onToggleSocial",
    "onNavigate",
  ]),
  applicationOwnedDependencies: Object.freeze([
    "next/link",
    "next/navigation usePathname",
    "StudioEconomyWidget mobileHeader",
    "StudioEconomyWidget drawer",
  ]),
  behavior: Object.freeze({
    mobileBreakpoint: "hidden at lg and above",
    activeStudioRootExactMatch: true,
    nestedRoutePrefixMatch: true,
    drawerOverlayDismisses: true,
    internalNavigationClosesDrawer: true,
    externalLinksOpenInNewTab: true,
    fixedBottomNavigationCount: 5,
  }),
});
