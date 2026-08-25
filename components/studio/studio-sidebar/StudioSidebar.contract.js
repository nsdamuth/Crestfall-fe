export const STUDIO_SIDEBAR_VIEW_CONTRACT_VERSION = "studio-sidebar.view.v2";

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
    "previewEnabled",
    "previewGroups",
    "legacyLabel",
    "legacyOpen",
  ]),
  callbacks: Object.freeze(["onToggleCollapsed", "onToggleSocial", "onToggleLegacy"]),
  applicationOwnedDependencies: Object.freeze([
    "next/link",
    "next/navigation usePathname",
    "StudioEconomyWidget",
    "lib/shared/flags/sidebarV2Preview.isSidebarV2PreviewEnabled",
  ]),
  chromeNote:
    "previewEnabled, previewGroups, legacyLabel, legacyOpen, onToggleLegacy are additive optional props (compatible, no version bump) gating the flagged nine-destination preview nav (docs/FRONTEND-SOP.md flag doc, CRESTFALL-PRODUCT-MODEL-UXUI.md section 2). Flag off: identical output to pre-flag markup. previewGroups items carry isBuilt; unbuilt items render quiet (no href, no navigation), never a real contract. v2, RULED 23 Aug 2026 (build-0823 pass 4, sidebar refinement): preview mode no longer renders the Legacy group (legacyLabel/legacyOpen/onToggleLegacy remain accepted props, simply unused when previewEnabled is true); preview-mode nav density tightens; the signed-in row gains inline Discord/Settings icons with Log out beneath; the Vault preview entry's iconKey reverts castle to archive. Flag off is byte-identical to v1.",
  behavior: Object.freeze({
    desktopBreakpoint: "lg",
    expandedWidth: "w-56",
    collapsedWidth: "w-16",
    activeStudioRootExactMatch: true,
    nestedRoutePrefixMatch: true,
    externalLinksOpenInNewTab: true,
  }),
});
