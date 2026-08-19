import {
  STUDIO_SHELL_VIEW_CONTRACT_VERSION,
} from "../StudioShell.contract.js";

import {
  PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
  projectPublicStudioAccessPresentation,
} from "../../creations/public-access/PublicStudioAnonymousAccess.contract.js";

export const STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION =
  "studio_shell_public_access_binding_v1";

export const STUDIO_SHELL_PUBLIC_ACCESS_CALLBACK_KEYS = Object.freeze([
  "onNavigateCommunity",
  "onSignIn",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function projectStudioShellPublicAccessBinding({
  authenticated = false,
  surface = null,
  callbacks = {},
} = {}) {
  const callbackSource = object(callbacks);

  const access = projectPublicStudioAccessPresentation({
    authenticated,
    surface,
  });

  const publicHeader = access.shell.showPublicStudioHeader
    ? {
        eyebrow: access.shell.publicBrandEyebrow,
        title: access.shell.publicBrandTitle,
        navItems: access.shell.publicNavItems.map((item) => ({
          ...item,
          action:
            item.id === "community"
              ? "NAVIGATE_COMMUNITY"
              : item.id === "sign-in"
                ? "SIGN_IN"
                : null,
        })),
      }
    : null;

  const slotPolicy = {
    sidebar: access.shell.showStudioSidebar
      ? "AUTHENTICATED_SIDEBAR_SLOT"
      : "HIDDEN",

    mobileNav: access.shell.showStudioMobileNav
      ? "AUTHENTICATED_MOBILE_NAV_SLOT"
      : "HIDDEN",

    topBar: access.shell.showStudioTopBar
      ? "AUTHENTICATED_TOP_BAR_SLOT"
      : access.shell.showPublicStudioHeader
        ? "PUBLIC_STUDIO_HEADER_SLOT"
        : "HIDDEN",
  };

  const anonymousPublicLayout =
    access.shellMode === "ANONYMOUS_PUBLIC_STUDIO";

  return {
    bindingContractVersion:
      STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION,

    studioShellViewContractVersion:
      STUDIO_SHELL_VIEW_CONTRACT_VERSION,

    publicStudioAccessPresentationContractVersion:
      PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,

    shellMode: access.shellMode,
    authenticated: access.authenticated,
    anonymous: access.anonymous,
    publicSurface: access.publicSurface,
    surface: access.surface,
    surfaceLabel: access.surfaceLabel,

    slotPolicy,
    publicHeader,

    studioShellProps: {
      sidebarSlotKind: slotPolicy.sidebar,
      mobileNavSlotKind: slotPolicy.mobileNav,
      topBarSlotKind: slotPolicy.topBar,
    },

    signIn: {
      ...access.signIn,
      callback:
        callbackSource.onSignIn || null,
    },

    communityNavigation: {
      visible:
        Boolean(publicHeader),
      href: "/studio/community",
      callback:
        callbackSource.onNavigateCommunity || null,
    },

    access: {
      ...access.access,
    },

    layout: {
      variant:
        anonymousPublicLayout
          ? "ANONYMOUS_PUBLIC"
          : "AUTHENTICATED_STUDIO",
      currentStudioShellSupportsVariant: false,
      pendingFeVisualExtension:
        anonymousPublicLayout,
      authenticatedLayoutIntent:
        "Standard Studio canvas with private navigation chrome.",
      anonymousPublicLayoutIntent:
        "Centered public canvas with a wider content cap, compact top spacing, and no private Studio navigation chrome.",
    },

    architecture: {
      routeGroupingOwnedByChassis: true,
      routeProtectionOwnedByChassis: true,
      sessionLookupOwnedByChassis: true,
      accountProviderEnablementOwnedByChassis: true,
      publicMediaVisibilityOwnedByServices: true,
      shellSlotCompositionOwnedByChassisBindingShell: true,
      publicHeaderVisualCompositionOwnedByFe: true,
      anonymousLayoutVisualCompositionOwnedByFe: true,
    },
  };
}
