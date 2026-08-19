import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
} from "../CreationProfilePage.contract.js";

import {
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
} from "../../library-pass/CreationLibraryPass.contract.js";

import {
  CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION,
  CREATION_PROFILE_LIBRARY_PASS_CALLBACK_KEYS,
  projectCreationProfileLibraryPassBinding,
} from "./CreationProfileLibraryPassBinding.contract.js";

import {
  creationProfileLibraryPassEntitledFixture,
  creationProfileLibraryPassInsufficientBalanceFixture,
  creationProfileLibraryPassLoadErrorFixture,
  creationProfileLibraryPassLockedFixture,
  creationProfileLibraryPassOwnerFixture,
  creationProfileLibraryPassPurchaseOpenFixture,
  creationProfileLibraryPassSalesPausedFixture,
  creationProfileLibraryPassUnresolvedFixture,
} from "./CreationProfileLibraryPassBinding.fixtures.js";

assert.equal(
  CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION,
  "creation_profile_library_pass_binding_v1"
);

const locked =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassLockedFixture
  );

assert.equal(
  locked.bindingContractVersion,
  CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION
);
assert.equal(
  locked.creationProfileViewContractVersion,
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION
);
assert.equal(
  locked.libraryPassPresentationContractVersion,
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION
);

assert.equal(
  locked.media.accessControlledMedia.length,
  8
);
assert.equal(
  locked.media.visibleMedia.length,
  8
);
assert.equal(
  locked.media.lockedMediaCount,
  4
);
assert.equal(
  locked.media.lightboxMedia.length,
  4
);
assert.equal(
  locked.media.hasLockedMedia,
  true
);

assert.deepEqual(
  locked.media.visibleMedia.map(
    (item) => item.locked
  ),
  [
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
  ]
);

assert.equal(
  locked.media.visibleMedia[0].priority,
  true
);
assert.equal(
  locked.media.visibleMedia[3].priority,
  true
);
assert.equal(
  locked.media.visibleMedia[4].priority,
  false
);

assert.equal(
  locked.media.visibleMedia[4].lockedAction,
  "OPEN_LIBRARY_PASS_PURCHASE"
);
assert.equal(
  locked.media.visibleMedia[4].lockedAriaLabel,
  "Unlock this extended library image"
);
assert.equal(
  locked.media.visibleMedia[4].lockedEyebrow,
  "Library Pass"
);
assert.equal(
  locked.media.visibleMedia[4].lockedLabel,
  "Unlock extended media"
);

assert.equal(
  locked.interaction.resolveMediaOpenAction(
    "profile-media-2"
  ),
  "OPEN_MEDIA_LIGHTBOX"
);
assert.equal(
  locked.interaction.resolveMediaOpenAction(
    "profile-media-7"
  ),
  "OPEN_LIBRARY_PASS_PURCHASE"
);
assert.equal(
  locked.interaction.resolveMediaOpenAction(
    "missing"
  ),
  "NO_ACTION"
);

assert.equal(
  locked.creationProfileProps.activePreviewItem.id,
  "profile-media-2"
);

const lockedActive =
  projectCreationProfileLibraryPassBinding({
    ...creationProfileLibraryPassLockedFixture,
    activePreviewId: "profile-media-7",
  });

assert.equal(
  lockedActive.creationProfileProps.activePreviewItem,
  null
);

assert.equal(
  locked.creationProfileProps.libraryPassPanel.shouldShow,
  true
);
assert.equal(
  locked.creationProfileProps.libraryPassPanel.eyebrow,
  "Extended Image Library"
);
assert.equal(
  locked.creationProfileProps.libraryPassPanel.heading,
  "4 extended images available"
);
assert.match(
  locked.creationProfileProps.libraryPassPanel.helper,
  /4 most recent eligible results remain visible to everyone/i
);
assert.match(
  locked.creationProfileProps.libraryPassPanel.helper,
  /future additions/i
);
assert.equal(
  locked.creationProfileProps.libraryPassPanel.eligibleCountLabel,
  "8 eligible images"
);
assert.equal(
  locked.creationProfileProps.libraryPassPanel.previewCountLabel,
  "4 public previews"
);

const purchaseOpen =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassPurchaseOpenFixture
  );

assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.isOpen,
  true
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.eyebrow,
  "Library Pass"
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.priceFieldLabel,
  "Pass Price"
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.balanceFieldLabel,
  "Your Balance"
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.priceLabel,
  "250 coins"
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.balanceLabel,
  "997,310 coins"
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.canConfirm,
  true
);
assert.match(
  purchaseOpen.creationProfileProps.libraryPassModal.body,
  /Unlock all 8 currently eligible images and every eligible image added later/i
);
assert.equal(
  purchaseOpen.creationProfileProps.libraryPassModal.oneTimePurchaseHelper,
  "This is a one-time purchase for this creation."
);

const insufficient =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassInsufficientBalanceFixture
  );

assert.equal(
  insufficient.creationProfileProps.libraryPassModal.canConfirm,
  false
);
assert.match(
  insufficient.creationProfileProps.libraryPassModal.unavailableMessage,
  /need 250 coins.*current balance is 100 coins/i
);

const entitled =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassEntitledFixture
  );

assert.equal(
  entitled.media.lockedMediaCount,
  0
);
assert.equal(
  entitled.media.lightboxMedia.length,
  8
);
assert.equal(
  entitled.creationProfileProps.activePreviewItem.id,
  "profile-media-8"
);
assert.equal(
  entitled.creationProfileProps.libraryPassPanel.heading,
  "Complete library access is active"
);
assert.equal(
  entitled.creationProfileProps.libraryPassPanel.statusLabel,
  "Library Pass Active"
);

const owner =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassOwnerFixture
  );

assert.equal(owner.media.lockedMediaCount, 0);
assert.equal(
  owner.creationProfileProps.libraryPassPanel.statusLabel,
  "Owner Access"
);
assert.equal(
  owner.creationProfileProps.libraryPassPanel.heading,
  "Complete library access is active"
);

const paused =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassSalesPausedFixture
  );

assert.equal(
  paused.creationProfileProps.libraryPassPanel.statusLabel,
  "Sales Paused"
);
assert.equal(
  paused.creationProfileProps.libraryPassPanel.actionLabel,
  "Sales Paused"
);
assert.equal(
  paused.creationProfileProps.libraryPassModal.canConfirm,
  false
);

const unresolved =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassUnresolvedFixture
  );

assert.equal(
  unresolved.creationProfileProps.libraryPassPanel.shouldShow,
  true
);
assert.equal(
  unresolved.media.lockedMediaCount,
  4
);
assert.equal(
  unresolved.media.lightboxMedia.length,
  4
);

const loadError =
  projectCreationProfileLibraryPassBinding(
    creationProfileLibraryPassLoadErrorFixture
  );

assert.equal(
  loadError.creationProfileProps.libraryPassPanel.shouldShow,
  true
);
assert.equal(
  loadError.creationProfileProps.libraryPassPanel.loadErrorTitle,
  "Library Pass Unavailable"
);
assert.match(
  loadError.creationProfileProps.libraryPassPanel.loadErrorHelper,
  /Library Pass status request failed.*temporarily limited to the public previews/i
);

assert.deepEqual(
  CREATION_PROFILE_LIBRARY_PASS_CALLBACK_KEYS,
  [
    "onOpenLibraryPassPurchase",
    "onCloseLibraryPassPurchase",
    "onConfirmLibraryPassPurchase",
  ]
);

assert.deepEqual(
  locked.functionalWiringStatus,
  {
    libraryPassStateLoading: "WIRED",
    mediaAccessProjection: "WIRED",
    lockedMediaPurchaseRouting: "WIRED",
    purchaseMutation: "WIRED",
    entitlementRefresh: "WIRED",
    accountBalanceIntegration: "WIRED",
    creationProfileVisualComposition: "WIRED",
  }
);

assert.deepEqual(
  locked.architecture,
  {
    filteredMediaInputOwnedByChassis: true,
    libraryPassStateLoadingOwnedByChassis: true,
    accountBalanceOwnedByChassis: true,
    purchaseMutationOwnedByChassis: true,
    entitlementRefreshOwnedByChassis: true,
    mediaAccessPresentationOwnedByFe: true,
    creationProfileVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./CreationProfileLibraryPassBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "useCreationLibraryPassPublicViewModel",
  "fetchCreationLibraryPassState",
  "purchaseCreationLibraryPass",
  "useStudioAccount",
  "setActivePreviewId",
  "setVisibleCount",
  "services/api",
  "PostGraphile",
  "supabase",
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
    "creation_profile_library_pass_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION,
  creationProfileViewContractVersion:
    CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
  libraryPassPresentationContractVersion:
    CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  lockedGridProjectionCovered: true,
  lockedLightboxExclusionCovered: true,
  lockedTilePurchaseActionCovered: true,
  panelAndPurchaseModalProjectionCovered: true,
  entitledAndOwnerAccessCovered: true,
  unresolvedConservativePreviewGuardCovered: true,
  loadErrorDegradedStateCovered: true,
  creationProfileViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  creationProfileViewModelWiredWhilePreservingOpeningLocationBinding: true,
  chassisPurchaseAndRefreshExcluded: true,
}, null, 2));
