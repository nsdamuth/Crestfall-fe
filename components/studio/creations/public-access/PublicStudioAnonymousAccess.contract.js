export const PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION =
  "public_studio_access.presentation.v1";

export const PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION =
  "public_studio_anonymous_access_v0";

export const PUBLIC_STUDIO_SURFACES = Object.freeze({
  COMMUNITY: "COMMUNITY",
  CREATION: "CREATION",
  PROFILE: "PROFILE",
});

export const PUBLIC_STUDIO_SURFACE_OPTIONS = Object.freeze([
  Object.freeze({
    value: PUBLIC_STUDIO_SURFACES.COMMUNITY,
    label: "Community",
  }),
  Object.freeze({
    value: PUBLIC_STUDIO_SURFACES.CREATION,
    label: "Creation",
  }),
  Object.freeze({
    value: PUBLIC_STUDIO_SURFACES.PROFILE,
    label: "Creator Profile",
  }),
]);

export const PUBLIC_STUDIO_ANONYMOUS_NAV_ITEMS = Object.freeze([
  Object.freeze({
    id: "community",
    label: "Community",
    href: "/studio/community",
  }),
  Object.freeze({
    id: "sign-in",
    label: "Sign In",
    href: "/login",
  }),
]);

export const PUBLIC_STUDIO_ACCESS_CALLBACK_KEYS = Object.freeze([
  "onNavigateCommunity",
  "onSignIn",
]);

function normalizeUpper(value) {
  return typeof value === "string"
    ? value.trim().toUpperCase()
    : "";
}

function normalizeSurface(value) {
  const normalized = normalizeUpper(value);

  return Object.values(PUBLIC_STUDIO_SURFACES).includes(normalized)
    ? normalized
    : null;
}

export function isPublicStudioSurface(value) {
  return Boolean(normalizeSurface(value));
}

export function projectPublicStudioAccessPresentation({
  authenticated = false,
  surface = null,
} = {}) {
  const normalizedSurface = normalizeSurface(surface);
  const publicSurface = Boolean(normalizedSurface);
  const anonymous = !authenticated;

  const shellMode = authenticated
    ? "AUTHENTICATED_STUDIO"
    : publicSurface
      ? "ANONYMOUS_PUBLIC_STUDIO"
      : "AUTHENTICATION_REQUIRED";

  const surfaceOption = PUBLIC_STUDIO_SURFACE_OPTIONS.find(
    (option) => option.value === normalizedSurface
  );

  return {
    contractVersion:
      PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
    anonymousAccessContractVersion:
      PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION,
    authenticated: Boolean(authenticated),
    anonymous,
    publicSurface,
    surface: normalizedSurface,
    surfaceLabel: surfaceOption?.label || "",
    shellMode,

    shell: {
      showPrivateStudioChrome: Boolean(authenticated),
      showPublicStudioHeader: anonymous && publicSurface,
      showStudioSidebar: Boolean(authenticated),
      showStudioMobileNav: Boolean(authenticated),
      showStudioTopBar: Boolean(authenticated),
      showSignInAction: anonymous,
      publicBrandEyebrow: "Crestfall",
      publicBrandTitle: "Studio",
      publicNavItems: anonymous && publicSurface
        ? PUBLIC_STUDIO_ANONYMOUS_NAV_ITEMS.map((item) => ({
            ...item,
          }))
        : [],
    },

    access: {
      requiresAuthentication: anonymous && !publicSurface,
      canRenderPublicSurface: publicSurface,
      privateStudioChromeAllowed: Boolean(authenticated),
      anonymousAccountPresentation: anonymous
        ? "NO_PRIVATE_ACCOUNT_STATE"
        : "AUTHENTICATED_ACCOUNT_STATE",
      publicMediaPresentation:
        publicSurface
          ? "ALLOW_SERVICE_AUTHORITY_TO_DECIDE_VISIBILITY"
          : "NOT_APPLICABLE",
    },

    signIn: {
      visible: anonymous,
      label: "Sign In",
      href: "/login",
    },
  };
}
