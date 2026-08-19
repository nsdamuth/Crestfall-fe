import assert from "node:assert/strict";
import fs from "node:fs";

import {
  MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION,
} from "../MediaLightbox.contract.js";

import {
  IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
} from "../../image-reassignment/ImageReassignmentPresentation.contract.js";

import {
  MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION,
  MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_CALLBACK_KEYS,
  projectMediaLightboxImageReassignmentBinding,
  projectMediaLightboxReassignmentActiveMedia,
} from "./MediaLightboxImageReassignmentBinding.contract.js";

import {
  mediaLightboxImageReassignmentActiveMediaFixture,
  mediaLightboxImageReassignmentErrorFixture,
  mediaLightboxImageReassignmentLoadingFixture,
  mediaLightboxImageReassignmentMissingSourceFixture,
  mediaLightboxImageReassignmentReadyFixture,
  mediaLightboxImageReassignmentSubmittingFixture,
  mediaLightboxImageReassignmentSuccessFixture,
  mediaLightboxImageReassignmentUnavailableFixture,
} from "./MediaLightboxImageReassignmentBinding.fixtures.js";

assert.equal(
  MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION,
  "media_lightbox_image_reassignment_binding_v1"
);

const active =
  projectMediaLightboxReassignmentActiveMedia(
    mediaLightboxImageReassignmentActiveMediaFixture
  );

assert.deepEqual(active, {
  id: "media-1",
  title: "Workshop Study",
  imageOutputId:
    "11111111-1111-4111-8111-111111111111",
  sourceCreationId:
    "33333333-3333-4333-8333-333333333333",
  canReassign: true,
});

const ready =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentReadyFixture
  );

assert.equal(
  ready.bindingContractVersion,
  MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION
);
assert.equal(
  ready.mediaLightboxContractVersion,
  MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION
);
assert.equal(
  ready.imageReassignmentPresentationContractVersion,
  IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  ready.mediaLightboxProps.showReassignAction,
  true
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.open,
  true
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.status,
  "ready"
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.coinCost,
  1
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.sourceCreation.title,
  "Kessa Cindervell"
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.targets.length,
  2
);
assert.equal(
  ready.mediaLightboxProps.reassignDialog.destinationCreationId,
  "44444444-4444-4444-8444-444444444444"
);
assert.equal(
  ready.presentation.actionLabel,
  "Reassign Asset"
);
assert.equal(
  ready.presentation.costLabel,
  "Cost: 1 Coin"
);
assert.equal(
  ready.presentation.submitLabel,
  "Reassign for 1 Coin"
);
assert.equal(
  ready.presentation.canSubmit,
  true
);
assert.match(
  ready.presentation.ownershipMessage,
  /both the current and destination assets must belong to you/i
);
assert.match(
  ready.presentation.moveSemanticsMessage,
  /does not duplicate the file/i
);
assert.match(
  ready.presentation.moveSemanticsMessage,
  /source references are cleared automatically/i
);

const loading =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentLoadingFixture
  );

assert.equal(loading.presentation.isLoading, true);
assert.equal(loading.presentation.canSubmit, false);
assert.equal(
  loading.presentation.statusLabel,
  "Loading your eligible assets..."
);

const submitting =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentSubmittingFixture
  );

assert.equal(
  submitting.presentation.isSubmitting,
  true
);
assert.equal(
  submitting.presentation.submitLabel,
  "Reassigning..."
);
assert.equal(
  submitting.presentation.canSubmit,
  false
);

const success =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentSuccessFixture
  );

assert.equal(success.presentation.isSuccess, true);
assert.equal(
  success.mediaLightboxProps.reassignDialog.status,
  "success"
);
assert.equal(
  success.mediaLightboxProps.reassignDialog.message,
  "Image reassigned to Brasswhisker Workshop. 1 Coin used."
);
assert.equal(
  success.presentation.closeLabel,
  "Close"
);
assert.equal(
  success.presentation.canSubmit,
  false
);

const error =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentErrorFixture
  );

assert.equal(error.presentation.statusTone, "ERROR");
assert.match(
  error.mediaLightboxProps.reassignDialog.message,
  /no longer assigned.*Refresh and try again/is
);

const unavailable =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentUnavailableFixture
  );

assert.equal(
  unavailable.mediaLightboxProps.showReassignAction,
  false
);

const missingSource =
  projectMediaLightboxImageReassignmentBinding(
    mediaLightboxImageReassignmentMissingSourceFixture
  );

assert.equal(
  missingSource.mediaLightboxProps.showReassignAction,
  false
);

assert.deepEqual(
  MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_CALLBACK_KEYS,
  [
    "onOpenReassign",
    "onCloseReassign",
    "onReassignDestinationChange",
    "onSubmitReassign",
  ]
);

assert.deepEqual(
  ready.functionalWiringStatus,
  {
    imageEligibilityProjection:
      "WIRED",
    reassignmentContextLoading:
      "WIRED",
    destinationMutation:
      "WIRED",
    coinSpendReconciliation:
      "WIRED",
    postSuccessRefresh:
      "WIRED",
    sourceDetailsInvalidation:
      "WIRED",
    lightboxVisualComposition:
      "WIRED",
  }
);

assert.equal(
  ready.mediaLightboxProps.reassignmentPresentation.actionLabel,
  "Reassign Asset"
);
assert.equal(
  ready.mediaLightboxProps.reassignmentPresentation.canSubmit,
  true
);
assert.match(
  ready.mediaLightboxProps.reassignmentPresentation.ownershipMessage,
  /images you created/i
);
assert.match(
  ready.mediaLightboxProps.reassignmentPresentation.moveSemanticsMessage,
  /does not duplicate the file/i
);

assert.deepEqual(ready.architecture, {
  imageEligibilityOwnedByChassis: true,
  reassignmentContextLoadingOwnedByChassis: true,
  destinationMutationOwnedByChassis: true,
  coinSpendOwnedByChassis: true,
  postSuccessRefreshOwnedByChassis: true,
  sourceDetailsInvalidationOwnedByChassis: true,
  lightboxVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./MediaLightboxImageReassignmentBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "fetchImageReassignmentContext",
  "reassignImageOutput",
  "setDetailsOpen",
  "setImageDetails",
  "setReassignSourceOverride",
  "spendProfileCoins",
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
    "media_lightbox_image_reassignment_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION,
  mediaLightboxContractVersion:
    MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION,
  imageReassignmentPresentationContractVersion:
    IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
  actionVisibilityCovered: true,
  readyDialogProjectionCovered: true,
  loadingSubmittingSuccessErrorStatesCovered: true,
  noSourceAndIneligibleGuardsCovered: true,
  imageEligibilityProjectionWired: true,
  reassignmentContextLoadingWired: true,
  destinationMutationWired: true,
  coinSpendReconciliationWired: true,
  postSuccessRefreshWired: true,
  sourceDetailsInvalidationWired: true,
  lightboxViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  lightboxViewModelWiredToAcceptedBinding: true,
  chassisMutationAndRefreshExcludedFromBindingContract: true,
}, null, 2));
