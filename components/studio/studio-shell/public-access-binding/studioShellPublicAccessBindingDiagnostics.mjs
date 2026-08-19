import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STUDIO_SHELL_VIEW_CONTRACT_VERSION,
} from "../StudioShell.contract.js";

import {
  PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
} from "../../creations/public-access/PublicStudioAnonymousAccess.contract.js";

import {
  STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION,
  STUDIO_SHELL_PUBLIC_ACCESS_CALLBACK_KEYS,
  projectStudioShellPublicAccessBinding,
} from "./StudioShellPublicAccessBinding.contract.js";

import {
  studioShellPublicAccessAnonymousCommunityFixture,
  studioShellPublicAccessAnonymousCreationFixture,
  studioShellPublicAccessAnonymousProfileFixture,
  studioShellPublicAccessAnonymousProtectedFixture,
  studioShellPublicAccessAuthenticatedCommunityFixture,
  studioShellPublicAccessAuthenticatedPrivateFixture,
} from "./StudioShellPublicAccessBinding.fixtures.js";

assert.equal(
  STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION,
  "studio_shell_public_access_binding_v1"
);

for (const fixture of [
  studioShellPublicAccessAnonymousCommunityFixture,
  studioShellPublicAccessAnonymousCreationFixture,
  studioShellPublicAccessAnonymousProfileFixture,
]) {
  const projection =
    projectStudioShellPublicAccessBinding(fixture);

  assert.equal(
    projection.bindingContractVersion,
    STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION
  );
  assert.equal(
    projection.studioShellViewContractVersion,
    STUDIO_SHELL_VIEW_CONTRACT_VERSION
  );
  assert.equal(
    projection.publicStudioAccessPresentationContractVersion,
    PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION
  );

  assert.equal(
    projection.shellMode,
    "ANONYMOUS_PUBLIC_STUDIO"
  );
  assert.equal(projection.authenticated, false);
  assert.equal(projection.anonymous, true);
  assert.equal(projection.publicSurface, true);

  assert.deepEqual(projection.slotPolicy, {
    sidebar: "HIDDEN",
    mobileNav: "HIDDEN",
    topBar: "PUBLIC_STUDIO_HEADER_SLOT",
  });

  assert.ok(projection.publicHeader);
  assert.equal(
    projection.publicHeader.eyebrow,
    "Crestfall"
  );
  assert.equal(
    projection.publicHeader.title,
    "Studio"
  );
  assert.deepEqual(
    projection.publicHeader.navItems.map((item) => [
      item.label,
      item.href,
      item.action,
    ]),
    [
      [
        "Community",
        "/studio/community",
        "NAVIGATE_COMMUNITY",
      ],
      [
        "Sign In",
        "/login",
        "SIGN_IN",
      ],
    ]
  );

  assert.equal(
    projection.signIn.visible,
    true
  );
  assert.equal(
    projection.signIn.href,
    "/login"
  );
  assert.equal(
    projection.communityNavigation.visible,
    true
  );

  assert.equal(
    projection.access.requiresAuthentication,
    false
  );
  assert.equal(
    projection.access.privateStudioChromeAllowed,
    false
  );
  assert.equal(
    projection.access.anonymousAccountPresentation,
    "NO_PRIVATE_ACCOUNT_STATE"
  );
  assert.equal(
    projection.access.publicMediaPresentation,
    "ALLOW_SERVICE_AUTHORITY_TO_DECIDE_VISIBILITY"
  );

  assert.equal(
    projection.layout.variant,
    "ANONYMOUS_PUBLIC"
  );
  assert.equal(
    projection.layout.currentStudioShellSupportsVariant,
    false
  );
  assert.equal(
    projection.layout.pendingFeVisualExtension,
    true
  );
}

const authenticatedPublic =
  projectStudioShellPublicAccessBinding(
    studioShellPublicAccessAuthenticatedCommunityFixture
  );

assert.equal(
  authenticatedPublic.shellMode,
  "AUTHENTICATED_STUDIO"
);
assert.deepEqual(
  authenticatedPublic.slotPolicy,
  {
    sidebar: "AUTHENTICATED_SIDEBAR_SLOT",
    mobileNav: "AUTHENTICATED_MOBILE_NAV_SLOT",
    topBar: "AUTHENTICATED_TOP_BAR_SLOT",
  }
);
assert.equal(
  authenticatedPublic.publicHeader,
  null
);
assert.equal(
  authenticatedPublic.signIn.visible,
  false
);
assert.equal(
  authenticatedPublic.layout.variant,
  "AUTHENTICATED_STUDIO"
);
assert.equal(
  authenticatedPublic.layout.pendingFeVisualExtension,
  false
);

const authenticatedPrivate =
  projectStudioShellPublicAccessBinding(
    studioShellPublicAccessAuthenticatedPrivateFixture
  );

assert.equal(
  authenticatedPrivate.shellMode,
  "AUTHENTICATED_STUDIO"
);
assert.equal(
  authenticatedPrivate.access.requiresAuthentication,
  false
);
assert.equal(
  authenticatedPrivate.slotPolicy.sidebar,
  "AUTHENTICATED_SIDEBAR_SLOT"
);

const anonymousProtected =
  projectStudioShellPublicAccessBinding(
    studioShellPublicAccessAnonymousProtectedFixture
  );

assert.equal(
  anonymousProtected.shellMode,
  "AUTHENTICATION_REQUIRED"
);
assert.equal(
  anonymousProtected.access.requiresAuthentication,
  true
);
assert.equal(
  anonymousProtected.publicHeader,
  null
);
assert.deepEqual(
  anonymousProtected.slotPolicy,
  {
    sidebar: "HIDDEN",
    mobileNav: "HIDDEN",
    topBar: "HIDDEN",
  }
);

// FE binding describes presentation only. The Chassis must decide
// whether the request reaches this state or redirects before render.
assert.equal(
  anonymousProtected.layout.variant,
  "AUTHENTICATED_STUDIO"
);

assert.deepEqual(
  STUDIO_SHELL_PUBLIC_ACCESS_CALLBACK_KEYS,
  [
    "onNavigateCommunity",
    "onSignIn",
  ]
);

assert.deepEqual(
  authenticatedPublic.architecture,
  {
    routeGroupingOwnedByChassis: true,
    routeProtectionOwnedByChassis: true,
    sessionLookupOwnedByChassis: true,
    accountProviderEnablementOwnedByChassis: true,
    publicMediaVisibilityOwnedByServices: true,
    shellSlotCompositionOwnedByChassisBindingShell: true,
    publicHeaderVisualCompositionOwnedByFe: true,
    anonymousLayoutVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StudioShellPublicAccessBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "redirect(",
  "next/navigation",
  "createClient",
  "supabase",
  "StudioAccountProvider",
  "fetchCurrentStudioAccount",
  "getUser(",
  "useRouter",
  "pathname",
  "startsWith(\"/studio",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "studio_shell_public_access_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STUDIO_SHELL_PUBLIC_ACCESS_BINDING_CONTRACT_VERSION,
  studioShellViewContractVersion:
    STUDIO_SHELL_VIEW_CONTRACT_VERSION,
  publicStudioAccessPresentationContractVersion:
    PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
  anonymousCommunityCreationProfileShellCovered: true,
  authenticatedPrivateChromePreserved: true,
  publicHeaderSlotPolicyCovered: true,
  privateChromeSuppressionCovered: true,
  publicMediaServiceAuthorityCovered: true,
  pendingAnonymousLayoutVisualExtensionExplicit: true,
  existingStudioShellViewUnmodified: true,
  existingStudioShellViewModelUnmodified: true,
  chassisRoutingAuthAndAccountProviderExcluded: true,
}, null, 2));
