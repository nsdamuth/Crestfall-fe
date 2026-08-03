export const STUDIO_SIDEBAR_VIEW_CONTRACT_VERSION = "studio-sidebar.view.v1";

export const studioSidebarViewContract = Object.freeze({
  version: STUDIO_SIDEBAR_VIEW_CONTRACT_VERSION,
  purpose:
    "Render desktop Studio navigation without owning Next.js routing, route matching, application account data, or economy context.",
  inputs: Object.freeze([
    "brandEyebrow",
    "brandTitle",
    "brandHref",
    "communityLinksLabel",
    "signedInLabel",
    "signedInEmail",
    "logoutLabel",
    "logoutHref",
    "collapseAriaLabel",
    "collapsed",
    "socialOpen",
    "primaryLinks",
    "utilityLinks",
    "socialLinks",
    "InternalLinkComponent",
    "economySlot",
  ]),
  callbacks: Object.freeze(["onToggleCollapsed", "onToggleSocial"]),
  applicationOwnedDependencies: Object.freeze([
    "next/link",
    "next/navigation usePathname",
    "StudioEconomyWidget",
  ]),
  behavior: Object.freeze({
    desktopBreakpoint: "lg",
    expandedWidth: "w-56",
    collapsedWidth: "w-16",
    activeStudioRootExactMatch: true,
    nestedRoutePrefixMatch: true,
    externalLinksOpenInNewTab: true,
  }),
});
