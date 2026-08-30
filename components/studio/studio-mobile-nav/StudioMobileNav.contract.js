export const STUDIO_MOBILE_NAV_VIEW_CONTRACT_VERSION =
  "studio-mobile-nav.view.v3";

export const studioMobileNavViewContract = Object.freeze({
  version: STUDIO_MOBILE_NAV_VIEW_CONTRACT_VERSION,
  purpose:
    "Render the mobile Studio drawer and bottom navigation without owning Next.js routing, pathname interpretation, account data, or economy context. The mobile header row (hamburger, search, bell) moved to StudioTopBar 8 Aug 2026 (mobile nav restyle brief item 7); this package no longer renders a header of its own and no longer owns the drawer's open/closed state, only what happens once it is open.",
  inputs: Object.freeze([
    "brandHref",
    "drawerEyebrow",
    "drawerTitle",
    "communityLinksLabel",
    "signedInLabel",
    "signedInUsername",
    "logoutLabel",
    "logoutHref",
    "accountHref",
    "accountAriaLabel",
    "closeMenuAriaLabel",
    "closeOverlayAriaLabel",
    "open",
    "socialOpen",
    "primaryLinks",
    "utilityLinks",
    "socialLinks",
    "bottomLinks",
    "InternalLinkComponent",
    "drawerEconomySlot",
  ]),
  callbacks: Object.freeze([
    "onCloseMenu",
    "onToggleSocial",
    "onNavigate",
  ]),
  applicationOwnedDependencies: Object.freeze([
    "next/link",
    "next/navigation usePathname",
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
    openStateOwnership:
      "`open` and the trigger that sets it true are owned by StudioShell.jsx (shared with StudioTopBar's mobile hamburger); this package owns only onCloseMenu and everything the drawer does once open.",
    drawerRowRecipe:
      "Rows, brand header, and signed-in footer mirror StudioSidebar.view.jsx's classes verbatim (8 Aug 2026 ruling): same .cf-nav-link recipe, same avatar-initial signed-in block, same divider. v3 presents the public profile username instead of the private login email and never falls back to email. The drawer keeps its own content order (unchanged from before this ruling), only the per-row visual treatment changed.",
    dockRecipe:
      "Bottom dock matches the proof's .dock recipe (docs/_legacy-reference/design-system/proof/shell.css): icon over label, color-only active state via .cf-dock-link, chrome-blur frosted bar, tokens throughout.",
  }),
});
