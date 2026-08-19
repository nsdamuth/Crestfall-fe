import assert from "node:assert/strict";
import fs from "node:fs";

import {
  LOCATION_REGISTRY_SPLIT_CALLBACK_KEYS,
  LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
  projectLocationRegistrySplitPresentation,
} from "./LocationRegistrySplit.contract.js";
import {
  locationRegistrySplitBlockedSourceFixture,
  locationRegistrySplitConfirmFixture,
  locationRegistrySplitNoContainmentFixture,
  locationRegistrySplitPreviewFixture,
  locationRegistrySplitSelectedFixture,
  locationRegistrySplitServerBlockedFixture,
} from "./LocationRegistrySplit.fixtures.js";

const preview = projectLocationRegistrySplitPresentation(
  locationRegistrySplitPreviewFixture
);

assert.equal(
  preview.contractVersion,
  LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION
);
assert.equal(preview.destructiveSourceMutation, true);
assert.equal(preview.analysis.status, "PREVIEW_READY");
assert.equal(preview.analysis.candidates.length, 2);
assert.equal(preview.selection.selectedCount, 0);
assert.equal(preview.selection.canRequestPlan, false);
assert.equal(preview.execution.canConfirmAndExecute, false);
assert.equal(preview.analysis.safeguards.stableIdsMustBePreserved, true);
assert.equal(
  preview.analysis.safeguards.servicesSideRevalidation,
  "REQUIRED_BEFORE_EXECUTION"
);

const selected = projectLocationRegistrySplitPresentation(
  locationRegistrySplitSelectedFixture
);
assert.equal(selected.selection.selectedCount, 1);
assert.equal(selected.selection.canRequestPlan, true);

const trade = selected.analysis.candidates.find(
  (candidate) => candidate.id === "split_candidate:trade"
);
const workshop = selected.analysis.candidates.find(
  (candidate) => candidate.id === "split_candidate:workshop"
);

assert.ok(trade);
assert.ok(workshop);
assert.equal(trade.selected, true);
assert.equal(workshop.overlapBlocked, true);
assert.equal(workshop.disabled, true);
assert.equal(trade.boundaryConnectionCount, 1);
assert.equal(trade.presenceBindingCount, 1);
assert.equal(trade.stableEntryIdsPreserved, true);

const confirm = projectLocationRegistrySplitPresentation(
  locationRegistrySplitConfirmFixture
);

assert.equal(confirm.execution.hasServerPlan, true);
assert.equal(confirm.execution.hasFingerprints, true);
assert.equal(confirm.execution.sourceFingerprintPresent, true);
assert.equal(confirm.execution.planFingerprintPresent, true);
assert.equal(confirm.execution.commitReady, true);
assert.equal(confirm.execution.integrity.status, "PASS");
assert.equal(confirm.execution.integrity.preserved, true);
assert.equal(confirm.execution.creatorConfirmed, true);
assert.equal(confirm.execution.canConfirmAndExecute, true);
assert.match(
  confirm.execution.destructiveConfirmation,
  /create the selected child Location Registries and rewrite the source Registry relationships/i
);

const blockedSource = projectLocationRegistrySplitPresentation(
  locationRegistrySplitBlockedSourceFixture
);
assert.equal(blockedSource.analysis.blocked, true);
assert.equal(blockedSource.analysis.statusTone, "ERROR");
assert.equal(blockedSource.analysis.issues.length, 1);
assert.equal(blockedSource.selection.canRequestPlan, false);

const serverBlocked = projectLocationRegistrySplitPresentation(
  locationRegistrySplitServerBlockedFixture
);
assert.equal(serverBlocked.execution.commitReady, false);
assert.equal(serverBlocked.execution.canConfirmAndExecute, false);
assert.equal(serverBlocked.execution.blockers.length, 1);
assert.equal(
  serverBlocked.execution.blockers[0].code,
  "INBOUND_REFERENCE_REVIEW_REQUIRED"
);

const noContainment = projectLocationRegistrySplitPresentation(
  locationRegistrySplitNoContainmentFixture
);
assert.equal(
  noContainment.analysis.status,
  "NO_AUTHORED_CONTAINMENT_CANDIDATES"
);
assert.match(
  noContainment.analysis.statusMessage,
  /authored parent\/child containment/i
);

assert.deepEqual(LOCATION_REGISTRY_SPLIT_CALLBACK_KEYS, [
  "onClose",
  "onToggleCandidate",
  "onPreparePlan",
  "onChangeCreatorConfirmation",
  "onCommitPlan",
]);

const source = fs.readFileSync(
  new URL("./LocationRegistrySplit.contract.js", import.meta.url),
  "utf8"
);

for (const forbidden of [
  "@/lib/client",
  "fetch(",
  "planLocationRegistrySplit",
  "commitLocationRegistrySplit",
  "useEffect(",
  "useState(",
  "crestfallApiRequest",
  "PostGraphile",
  "supabase",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic: "location_registry_split_fe_semantic_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
  candidateCount: preview.analysis.candidates.length,
  overlapGuardCovered: true,
  sourceIntegrityBlockCovered: true,
  serverExecutionGateCovered: true,
  fingerprintGuardPresentationCovered: true,
  destructiveConfirmationCovered: true,
  planningMutationExcluded: true,
  commitMutationExcluded: true,
}, null, 2));
