import assert from "node:assert/strict";
import fs from "node:fs";

import {
  IMAGE_REASSIGNMENT_CALLBACK_KEYS,
  IMAGE_REASSIGNMENT_DEFAULT_COIN_COST,
  IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
  IMAGE_REASSIGNMENT_TRANSACTION_VERSION,
  canShowImageReassignmentAction,
  normalizeImageReassignmentContext,
  projectImageReassignmentPresentation,
} from "./ImageReassignmentPresentation.contract.js";

import {
  imageReassignmentErrorFixture,
  imageReassignmentLoadingFixture,
  imageReassignmentNoTargetsFixture,
  imageReassignmentOwnedContextFixture,
  imageReassignmentReadyFixture,
  imageReassignmentSubmittingFixture,
  imageReassignmentSuccessFixture,
} from "./ImageReassignmentPresentation.fixtures.js";

assert.equal(
  IMAGE_REASSIGNMENT_DEFAULT_COIN_COST,
  1
);
assert.equal(
  IMAGE_REASSIGNMENT_TRANSACTION_VERSION,
  "image_reassignment_transaction_v0"
);

const normalizedContext =
  normalizeImageReassignmentContext(
    imageReassignmentOwnedContextFixture
  );

assert.equal(
  normalizedContext.version,
  IMAGE_REASSIGNMENT_TRANSACTION_VERSION
);
assert.equal(normalizedContext.coinCost, 1);
assert.equal(
  normalizedContext.sourceCreation.title,
  "Kessa Cindervell"
);
assert.equal(normalizedContext.targets.length, 2);
assert.equal(
  normalizedContext.targets[1].contentRating,
  "TEEN"
);

assert.equal(
  canShowImageReassignmentAction({
    canReassign: true,
    imageOutputId: "image-1",
    sourceCreationId: "creation-1",
  }),
  true
);
assert.equal(
  canShowImageReassignmentAction({
    canReassign: false,
    imageOutputId: "image-1",
    sourceCreationId: "creation-1",
  }),
  false
);
assert.equal(
  canShowImageReassignmentAction({
    canReassign: true,
    imageOutputId: "image-1",
    sourceCreationId: "",
  }),
  false
);

const ready =
  projectImageReassignmentPresentation(
    imageReassignmentReadyFixture
  );

assert.equal(
  ready.contractVersion,
  IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  ready.transactionVersion,
  IMAGE_REASSIGNMENT_TRANSACTION_VERSION
);
assert.equal(ready.showAction, true);
assert.equal(ready.actionLabel, "Reassign Asset");
assert.equal(
  ready.dialog.title,
  "Move to another asset"
);
assert.match(
  ready.dialog.ownershipMessage,
  /images you created.*both the current and destination assets must belong to you/is
);
assert.equal(
  ready.dialog.sourceCreation.title,
  "Kessa Cindervell"
);
assert.equal(ready.dialog.targets.length, 2);
assert.equal(
  ready.dialog.destinationCreationId,
  "44444444-4444-4444-8444-444444444444"
);
assert.equal(ready.dialog.coinCost, 1);
assert.equal(ready.dialog.costLabel, "Cost: 1 Coin");
assert.equal(
  ready.dialog.submitLabel,
  "Reassign for 1 Coin"
);
assert.equal(ready.dialog.canSubmit, true);
assert.match(
  ready.dialog.moveSemanticsMessage,
  /moves the same image.*does not duplicate the file/is
);
assert.match(
  ready.dialog.moveSemanticsMessage,
  /featured or selected as a visual reference.*cleared automatically/is
);

const loading =
  projectImageReassignmentPresentation(
    imageReassignmentLoadingFixture
  );
assert.equal(loading.dialog.isLoading, true);
assert.equal(loading.dialog.canSubmit, false);
assert.equal(
  loading.dialog.statusLabel,
  "Loading your eligible assets..."
);

const submitting =
  projectImageReassignmentPresentation(
    imageReassignmentSubmittingFixture
  );
assert.equal(submitting.dialog.isSubmitting, true);
assert.equal(submitting.dialog.canSubmit, false);
assert.equal(
  submitting.dialog.submitLabel,
  "Reassigning..."
);

const success =
  projectImageReassignmentPresentation(
    imageReassignmentSuccessFixture
  );
assert.equal(success.dialog.isSuccess, true);
assert.equal(success.dialog.canSubmit, false);
assert.equal(success.dialog.closeLabel, "Close");
assert.equal(
  success.dialog.message,
  "Image reassigned to Brasswhisker Workshop. 1 Coin used."
);

const noTargets =
  projectImageReassignmentPresentation(
    imageReassignmentNoTargetsFixture
  );
assert.equal(noTargets.dialog.hasTargets, false);
assert.equal(noTargets.dialog.canSubmit, false);
assert.equal(
  noTargets.dialog.emptyTargetLabel,
  "No other owned assets available"
);

const error =
  projectImageReassignmentPresentation(
    imageReassignmentErrorFixture
  );
assert.equal(error.dialog.statusTone, "ERROR");
assert.match(
  error.dialog.message,
  /no longer assigned.*Refresh and try again/is
);

const sameSourceTargetContext =
  normalizeImageReassignmentContext({
    ...imageReassignmentOwnedContextFixture,
    targets: [
      imageReassignmentOwnedContextFixture.sourceCreation,
      ...imageReassignmentOwnedContextFixture.targets,
    ],
  });
assert.equal(
  sameSourceTargetContext.targets.some(
    (target) =>
      target.id ===
      imageReassignmentOwnedContextFixture.sourceCreation.id
  ),
  false
);

assert.deepEqual(
  IMAGE_REASSIGNMENT_CALLBACK_KEYS,
  [
    "onOpenReassign",
    "onCloseReassign",
    "onDestinationChange",
    "onSubmitReassign",
  ]
);

const source = fs.readFileSync(
  new URL(
    "./ImageReassignmentPresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "reassignImageOutput",
  "fetchImageReassignmentContext",
  "crestfallApiRequest",
  "postgraphileRequest",
  "reassignOwnedImageOutputJsonAsActor",
  "spendProfileCoins",
  "supabase",
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
    "image_reassignment_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
  transactionVersion:
    IMAGE_REASSIGNMENT_TRANSACTION_VERSION,
  coinCost:
    IMAGE_REASSIGNMENT_DEFAULT_COIN_COST,
  closedOwnershipPresentationCovered: true,
  sourceDestinationExclusionCovered: true,
  moveNotDuplicateCopyCovered: true,
  sourceFeaturedReferenceClearCopyCovered: true,
  successAndErrorStatesCovered: true,
  transactionMutationExcluded: true,
}, null, 2));
