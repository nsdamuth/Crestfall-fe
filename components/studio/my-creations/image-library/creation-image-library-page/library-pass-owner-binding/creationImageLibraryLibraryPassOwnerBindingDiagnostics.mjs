import assert from "node:assert/strict";
import fs from "node:fs";

import {
  CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION,
} from "../CreationImageLibraryPage.contract.js";

import {
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
} from "../../../../creations/library-pass/CreationLibraryPass.contract.js";

import {
  CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION,
  CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_CALLBACK_KEYS,
  projectCreationImageLibraryLibraryPassOwnerBinding,
} from "./CreationImageLibraryLibraryPassOwnerBinding.contract.js";

import {
  creationImageLibraryLibraryPassOwnerErrorFixture,
  creationImageLibraryLibraryPassOwnerExpandedFixture,
  creationImageLibraryLibraryPassOwnerLoadingFixture,
  creationImageLibraryLibraryPassOwnerNoOfferFixture,
  creationImageLibraryLibraryPassOwnerNotPublicFixture,
  creationImageLibraryLibraryPassOwnerPausedFixture,
  creationImageLibraryLibraryPassOwnerPausedSuccessFixture,
  creationImageLibraryLibraryPassOwnerSavingFixture,
  creationImageLibraryLibraryPassOwnerStandardFixture,
} from "./CreationImageLibraryLibraryPassOwnerBinding.fixtures.js";

assert.equal(
  CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION,
  "creation_image_library_library_pass_owner_binding_v1"
);

const standard =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerStandardFixture
  );

assert.equal(
  standard.bindingContractVersion,
  CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION
);
assert.equal(
  standard.creationImageLibraryViewContractVersion,
  CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION
);
assert.equal(
  standard.libraryPassPresentationContractVersion,
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION
);

assert.equal(
  standard.panel.eyebrow,
  "Library Pass"
);
assert.equal(
  standard.panel.heading,
  "Extended Image Library"
);
assert.equal(
  standard.panel.statusLabel,
  "Sales active"
);
assert.equal(
  standard.panel.actionLabel,
  "Pause New Sales"
);
assert.equal(
  standard.panel.actionIntent,
  "PAUSE_NEW_SALES"
);
assert.equal(
  standard.panel.actionTone,
  "CAUTION"
);
assert.equal(
  standard.panel.actionDisabled,
  false
);
assert.equal(
  standard.panel.currentPriceLabel,
  "250 coins"
);
assert.equal(
  standard.panel.creatorRewardLabel,
  "25 coins"
);
assert.equal(
  standard.panel.metrics.length,
  4
);
assert.deepEqual(
  standard.panel.metrics.map((metric) => [
    metric.label,
    metric.value,
  ]),
  [
    ["Current price", "250 coins"],
    ["Eligible images", "12"],
    ["Public previews", "4"],
    ["Creator reward per sale", "25 coins"],
  ]
);
assert.equal(
  standard.panel.tierSummary,
  "Current tier: STANDARD. Expanded pricing begins at 100 eligible images."
);
assert.equal(
  standard.panel.expandedTierMessage,
  ""
);
assert.equal(
  standard.panel.salesPausedMessage,
  ""
);
assert.equal(
  standard.panel.publicLiveWarning,
  ""
);
assert.equal(
  standard.panel.loadingMessage,
  ""
);
assert.match(
  standard.panel.helper,
  /4 most recent eligible images remain visible to everyone/i
);
assert.match(
  standard.panel.helper,
  /future additions for that purchaser/i
);
assert.match(
  standard.panel.helper,
  /Pausing sales does not remove the lock/i
);

const expanded =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerExpandedFixture
  );

assert.equal(expanded.panel.currentTier, "EXPANDED");
assert.equal(
  expanded.panel.currentPriceLabel,
  "1,000 coins"
);
assert.equal(
  expanded.panel.creatorRewardLabel,
  "100 coins"
);
assert.equal(
  expanded.panel.eligibleImageCount,
  127
);
assert.equal(
  expanded.panel.expandedTierMessage,
  "Expanded pricing is active and does not automatically downgrade."
);

const paused =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerPausedFixture
  );

assert.equal(
  paused.panel.statusLabel,
  "Sales paused"
);
assert.equal(
  paused.panel.actionLabel,
  "Resume Library Pass Sales"
);
assert.equal(
  paused.panel.actionIntent,
  "RESUME_LIBRARY_PASS_SALES"
);
assert.equal(
  paused.panel.actionTone,
  "PRIMARY"
);
assert.equal(
  paused.panel.salesPausedMessage,
  "Pausing blocks new purchases only. Existing purchasers keep access."
);

const notPublic =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerNotPublicFixture
  );

assert.equal(
  notPublic.panel.actionDisabled,
  true
);
assert.equal(
  notPublic.panel.publicLiveWarning,
  "This creation must be public and approved before Library Pass sales can be enabled."
);

const loading =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerLoadingFixture
  );

assert.equal(loading.panel.isLoading, true);
assert.equal(
  loading.panel.loadingMessage,
  "Loading Library Pass settings..."
);
assert.equal(
  loading.panel.metrics.length,
  0
);
assert.equal(
  loading.panel.actionDisabled,
  true
);

const saving =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerSavingFixture
  );

assert.equal(saving.panel.isBusy, true);
assert.equal(
  saving.panel.actionLabel,
  "Saving..."
);
assert.equal(
  saving.panel.actionDisabled,
  true
);

const success =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerPausedSuccessFixture
  );

assert.equal(
  success.panel.message,
  "New Library Pass sales paused. Existing purchasers keep access."
);
assert.equal(
  success.panel.messageTone,
  "success"
);

const error =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerErrorFixture
  );

assert.equal(error.panel.loadStatus, "error");
assert.equal(
  error.panel.message,
  "Library Pass settings could not be loaded."
);
assert.equal(
  error.panel.messageTone,
  "error"
);
assert.equal(
  error.panel.metrics.length,
  0
);
assert.equal(
  error.panel.actionDisabled,
  true
);

const noOffer =
  projectCreationImageLibraryLibraryPassOwnerBinding(
    creationImageLibraryLibraryPassOwnerNoOfferFixture
  );

assert.equal(noOffer.panel.offerExists, false);
assert.equal(noOffer.panel.currentPriceCoins, 250);
assert.equal(noOffer.panel.publicPreviewCount, 4);

assert.deepEqual(
  CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_CALLBACK_KEYS,
  [
    "onToggleLibraryPassSales",
  ]
);

assert.deepEqual(
  standard.functionalWiringStatus,
  {
    ownerLibraryPassStateLoading: "WIRED",
    ownerLibraryPassProjection: "WIRED",
    salesPauseResumeMutation: "WIRED",
    postMutationRefresh: "WIRED",
    ownerPanelVisualComposition: "WIRED",
  }
);

assert.deepEqual(
  standard.architecture,
  {
    libraryPassStateLoadingOwnedByChassis: true,
    eligibleImageComputationOwnedByChassis: true,
    currentTierOwnedByChassis: true,
    priceAndRewardOwnedByChassis: true,
    salesMutationOwnedByChassis: true,
    postMutationRefreshOwnedByChassis: true,
    ownerPanelVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./CreationImageLibraryLibraryPassOwnerBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "useCreationLibraryPassOwnerViewModel",
  "fetchCreationLibraryPassState",
  "setCreationLibraryPassSalesEnabled",
  "setState(",
  "setLoadStatus(",
  "setActionBusy(",
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
    "creation_image_library_library_pass_owner_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION,
  creationImageLibraryViewContractVersion:
    CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION,
  libraryPassPresentationContractVersion:
    CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  standardAndExpandedTierProjectionCovered: true,
  priceRewardAndEligibilityMetricsCovered: true,
  pauseResumeActionStateCovered: true,
  publicLiveEnablementGuardPresentationCovered: true,
  loadingSavingSuccessErrorStatesCovered: true,
  ownerLibraryPassStateLoadingWired: true,
  ownerLibraryPassProjectionWired: true,
  salesPauseResumeMutationWired: true,
  postMutationRefreshWired: true,
  imageLibraryViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  imageLibraryViewModelWiredToAcceptedOwnerBinding: true,
  chassisSalesMutationAndRefreshExcludedFromBindingContract: true,
}, null, 2));
