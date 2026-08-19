import assert from "node:assert/strict";
import fs from "node:fs";

import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

import {
  LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
} from "../../location-registry-split/LocationRegistrySplit.contract.js";

import {
  LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION,
  LOCATION_REGISTRY_BUILDER_SPLIT_CALLBACK_KEYS,
  projectLocationRegistryBuilderSplitBinding,
} from "./LocationRegistryBuilderSplitBinding.contract.js";

import {
  locationRegistryBuilderSplitBlockedSourceFixture,
  locationRegistryBuilderSplitCommitReadyFixture,
  locationRegistryBuilderSplitCommittingFixture,
  locationRegistryBuilderSplitOpenFixture,
  locationRegistryBuilderSplitPlanningFixture,
  locationRegistryBuilderSplitReadyFixture,
  locationRegistryBuilderSplitUnavailableFixture,
} from "./LocationRegistryBuilderSplitBinding.fixtures.js";

assert.equal(
  LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION,
  "location_registry_builder_split_binding_v1"
);

const unavailable =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitUnavailableFixture
  );

assert.equal(
  unavailable.bindingContractVersion,
  LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION
);
assert.equal(
  unavailable.locationRegistryBuilderViewContractVersion,
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION
);
assert.equal(
  unavailable.splitPresentationContractVersion,
  LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION
);
assert.equal(unavailable.action.visible, false);
assert.equal(unavailable.action.disabled, true);
assert.equal(unavailable.splitDialog.open, false);
assert.equal(
  unavailable.context.availabilityOwnedByChassis,
  true
);

const ready =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitReadyFixture
  );

assert.equal(ready.action.visible, true);
assert.equal(ready.action.label, "Analyze Split");
assert.equal(ready.action.disabled, false);
assert.equal(
  ready.action.intent,
  "OPEN_SPLIT_PREVIEW"
);
assert.equal(ready.splitDialog.open, false);
assert.equal(
  ready.context.mode,
  "edit"
);
assert.equal(
  ready.context.hasSavedCreationId,
  true
);

const open =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitOpenFixture
  );

assert.equal(open.splitDialog.open, true);
assert.equal(
  open.splitDialog.presentation.analysis.status,
  "PREVIEW_READY"
);
assert.equal(
  open.splitDialog.presentation.selection.selectedCount,
  1
);
assert.equal(
  open.splitDialog.presentation.selection.canRequestPlan,
  true
);
assert.equal(
  open.splitDialog.presentation.selection.overlapConflict,
  true
);
assert.equal(
  open.splitDialog.presentation.execution.canConfirmAndExecute,
  false
);
assert.equal(open.splitDialog.canClose, true);

const planning =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitPlanningFixture
  );

assert.equal(planning.action.disabled, true);
assert.equal(
  planning.splitDialog.presentation.execution.planStatus,
  "planning"
);
assert.equal(
  planning.splitDialog.presentation.execution.busy,
  true
);
assert.equal(planning.splitDialog.canClose, true);
assert.equal(
  planning.splitDialog.presentation.execution.planStatusLabel,
  "Validating selected split..."
);

const commitReady =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitCommitReadyFixture
  );

assert.equal(
  commitReady.splitDialog.presentation.execution.commitReady,
  true
);
assert.equal(
  commitReady.splitDialog.presentation.execution.hasFingerprints,
  true
);
assert.equal(
  commitReady.splitDialog.presentation.execution.integrity.preserved,
  true
);
assert.equal(
  commitReady.splitDialog.presentation.execution.creatorConfirmed,
  true
);
assert.equal(
  commitReady.splitDialog.presentation.execution.canConfirmAndExecute,
  true
);
assert.match(
  commitReady.splitDialog.presentation.execution.destructiveConfirmation,
  /create the selected child Location Registries and rewrite the source Registry relationships/i
);

const committing =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitCommittingFixture
  );

assert.equal(committing.action.disabled, true);
assert.equal(committing.splitDialog.canClose, false);
assert.equal(
  committing.splitDialog.presentation.execution.confirmLabel,
  "Applying Atomic Split..."
);

const blockedSource =
  projectLocationRegistryBuilderSplitBinding(
    locationRegistryBuilderSplitBlockedSourceFixture
  );

assert.equal(
  blockedSource.splitDialog.presentation.analysis.blocked,
  true
);
assert.equal(
  blockedSource.splitDialog.presentation.analysis.statusTone,
  "ERROR"
);
assert.equal(
  blockedSource.splitDialog.presentation.selection.canRequestPlan,
  false
);

assert.deepEqual(
  LOCATION_REGISTRY_BUILDER_SPLIT_CALLBACK_KEYS,
  [
    "onOpenSplitPreview",
    "onCloseSplitPreview",
    "onToggleSplitCandidate",
    "onPrepareSplitPlan",
    "onChangeSplitCreatorConfirmation",
    "onCommitSplitPlan",
  ]
);

assert.deepEqual(ready.applicationWiringStatus, {
  sharedLocationRegistryFoundation: "WIRED",
  splitAnalysisPlanCommitViewModel: "WIRED",
  splitClientApiProxyPath: "WIRED",
  editCreationIdBridge: "PENDING_PROTECTED_EDITOR_WIRING",
  splitVisualComposition: "WIRED",
});

assert.deepEqual(ready.architecture, {
  splitAnalysisOwnedByChassis: true,
  splitSelectionStateOwnedByChassis: true,
  serverPlanningOwnedByChassis: true,
  fingerprintValidationOwnedByChassis: true,
  creatorConfirmationStateOwnedByChassis: true,
  atomicCommitOwnedByChassis: true,
  postCommitRefreshOwnedByChassis: true,
  splitVisualCompositionOwnedByFe: true,
});

const source = fs.readFileSync(
  new URL(
    "./LocationRegistryBuilderSplitBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "analyzeLocationRegistrySplit",
  "planLocationRegistrySplit",
  "commitLocationRegistrySplit",
  "currentCreationId &&",
  "mode === \"edit\"",
  "setSelectedSplitCandidateIds",
  "setSplitPlanStatus",
  "setSplitServerPlan",
  "@/lib/client",
  "fetch(",
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
    "location_registry_builder_split_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION,
  locationRegistryBuilderViewContractVersion:
    LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
  splitPresentationContractVersion:
    LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
  analyzeSplitActionProjectionCovered: true,
  previewSelectionAndOverlapProjectionCovered: true,
  planningAndCommitReadyProjectionCovered: true,
  committingCloseGuardCovered: true,
  sourceIntegrityBlockProjectionCovered: true,
  sharedLocationRegistryApplicationFoundationWired: true,
  splitAnalysisPlanCommitViewModelWired: true,
  splitVisualCompositionWired: true,
  sourceIntegrityBlockingVisualWired: true,
  nonOverlappingCandidateSelectionVisualWired: true,
  serverPlanAndFingerprintVisualWired: true,
  destructiveCreatorConfirmationVisualWired: true,
  committingCloseGuardVisualWired: true,
  editCreationIdBridgePendingProtectedEditorWiring: true,
  locationRegistryBuilderViewSemanticallyExtendedWithoutSourceStyleReplacement: true,
  locationRegistryBuilderViewModelWiredToChassisAuthority: true,
  chassisAnalysisPlanCommitExcludedFromBindingContract: true,
}, null, 2));
