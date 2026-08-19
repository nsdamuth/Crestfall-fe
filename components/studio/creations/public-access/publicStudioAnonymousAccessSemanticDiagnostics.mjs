import assert from "node:assert/strict";
import fs from "node:fs";

import {
  PUBLIC_STUDIO_ACCESS_CALLBACK_KEYS,
  PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
  PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION,
  PUBLIC_STUDIO_ANONYMOUS_NAV_ITEMS,
  PUBLIC_STUDIO_SURFACES,
  isPublicStudioSurface,
  projectPublicStudioAccessPresentation,
} from "./PublicStudioAnonymousAccess.contract.js";

import {
  publicStudioAnonymousCommunityFixture,
  publicStudioAnonymousCreationFixture,
  publicStudioAnonymousProfileFixture,
  publicStudioAnonymousProtectedFixture,
  publicStudioAuthenticatedCommunityFixture,
  publicStudioAuthenticatedPrivateFixture,
} from "./PublicStudioAnonymousAccess.fixtures.js";

assert.deepEqual(PUBLIC_STUDIO_SURFACES, {
  COMMUNITY: "COMMUNITY",
  CREATION: "CREATION",
  PROFILE: "PROFILE",
});

assert.equal(
  PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION,
  "public_studio_anonymous_access_v0"
);

assert.deepEqual(
  PUBLIC_STUDIO_ANONYMOUS_NAV_ITEMS.map((item) => [
    item.label,
    item.href,
  ]),
  [
    ["Community", "/studio/community"],
    ["Sign In", "/login"],
  ]
);

assert.equal(isPublicStudioSurface("community"), true);
assert.equal(isPublicStudioSurface("creation"), true);
assert.equal(isPublicStudioSurface("profile"), true);
assert.equal(isPublicStudioSurface("editor"), false);

for (const fixture of [
  publicStudioAnonymousCommunityFixture,
  publicStudioAnonymousCreationFixture,
  publicStudioAnonymousProfileFixture,
]) {
  const projection =
    projectPublicStudioAccessPresentation(fixture);

  assert.equal(
    projection.contractVersion,
    PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION
  );
  assert.equal(
    projection.anonymousAccessContractVersion,
    PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION
  );
  assert.equal(projection.authenticated, false);
  assert.equal(projection.anonymous, true);
  assert.equal(projection.publicSurface, true);
  assert.equal(
    projection.shellMode,
    "ANONYMOUS_PUBLIC_STUDIO"
  );
  assert.equal(
    projection.shell.showPrivateStudioChrome,
    false
  );
  assert.equal(
    projection.shell.showPublicStudioHeader,
    true
  );
  assert.equal(projection.shell.showStudioSidebar, false);
  assert.equal(projection.shell.showStudioMobileNav, false);
  assert.equal(projection.shell.showStudioTopBar, false);
  assert.equal(projection.shell.showSignInAction, true);
  assert.equal(
    projection.access.requiresAuthentication,
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
  assert.equal(projection.signIn.visible, true);
  assert.equal(projection.signIn.href, "/login");
}

const authenticatedPublic =
  projectPublicStudioAccessPresentation(
    publicStudioAuthenticatedCommunityFixture
  );

assert.equal(authenticatedPublic.authenticated, true);
assert.equal(authenticatedPublic.anonymous, false);
assert.equal(
  authenticatedPublic.shellMode,
  "AUTHENTICATED_STUDIO"
);
assert.equal(
  authenticatedPublic.shell.showPrivateStudioChrome,
  true
);
assert.equal(
  authenticatedPublic.shell.showPublicStudioHeader,
  false
);
assert.equal(
  authenticatedPublic.shell.showStudioSidebar,
  true
);
assert.equal(
  authenticatedPublic.shell.showStudioMobileNav,
  true
);
assert.equal(
  authenticatedPublic.shell.showStudioTopBar,
  true
);
assert.equal(
  authenticatedPublic.shell.showSignInAction,
  false
);
assert.equal(
  authenticatedPublic.access.requiresAuthentication,
  false
);

const anonymousProtected =
  projectPublicStudioAccessPresentation(
    publicStudioAnonymousProtectedFixture
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
  anonymousProtected.access.canRenderPublicSurface,
  false
);
assert.equal(
  anonymousProtected.shell.showPrivateStudioChrome,
  false
);
assert.equal(
  anonymousProtected.shell.showPublicStudioHeader,
  false
);
assert.equal(
  anonymousProtected.signIn.visible,
  true
);

const authenticatedPrivate =
  projectPublicStudioAccessPresentation(
    publicStudioAuthenticatedPrivateFixture
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
  authenticatedPrivate.shell.showPrivateStudioChrome,
  true
);

assert.deepEqual(PUBLIC_STUDIO_ACCESS_CALLBACK_KEYS, [
  "onNavigateCommunity",
  "onSignIn",
]);

const source = fs.readFileSync(
  new URL(
    "./PublicStudioAnonymousAccess.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "redirect(",
  "next/navigation",
  "createClient",
  "supabase",
  "fetch(",
  "@/lib/client",
  "StudioAccountProvider",
  "fetchCurrentStudioAccount",
  "getViewableImageOutput",
  "services/api",
  "PostGraphile",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "public_studio_anonymous_access_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    PUBLIC_STUDIO_ACCESS_PRESENTATION_CONTRACT_VERSION,
  anonymousAccessContractVersion:
    PUBLIC_STUDIO_ANONYMOUS_ACCESS_CONTRACT_VERSION,
  anonymousPublicSurfaceCount:
    Object.keys(PUBLIC_STUDIO_SURFACES).length,
  anonymousPublicShellCovered: true,
  privateStudioChromeSuppressionCovered: true,
  signInPresentationCovered: true,
  privateAccountStateExcludedFromAnonymousPresentation: true,
  publicMediaServiceAuthorityPreserved: true,
  routingAuthorityExcluded: true,
  authSessionImplementationExcluded: true,
}, null, 2));
