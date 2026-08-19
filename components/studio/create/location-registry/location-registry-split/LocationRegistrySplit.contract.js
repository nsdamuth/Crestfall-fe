export const LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION =
  "location_registry_split.presentation.v1";

export const LOCATION_REGISTRY_SPLIT_CALLBACK_KEYS = Object.freeze([
  "onClose",
  "onToggleCandidate",
  "onPreparePlan",
  "onChangeCreatorConfirmation",
  "onCommitPlan",
]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function projectCandidate(candidate = {}, selectedIds = new Set()) {
  const id = text(candidate.id);
  const selected = selectedIds.has(id);
  const overlappingCandidateIds = list(candidate.overlappingCandidateIds);
  const blockedBySelectedOverlap =
    !selected &&
    overlappingCandidateIds.some((candidateId) =>
      selectedIds.has(text(candidateId))
    );
  const previewReady = candidate.status === "PREVIEW_READY";

  return {
    id,
    status: text(candidate.status) || "UNKNOWN",
    selectable: previewReady,
    selected,
    disabled: !previewReady || blockedBySelectedOverlap,
    overlapBlocked: blockedBySelectedOverlap,
    scopeEntryId: text(candidate.scopeEntryId),
    scopeName: text(candidate.scopeName) || "Unnamed Location Scope",
    suggestedChildTitle:
      text(candidate.suggestedChildTitle) || "Nested Location Registry",
    retainedScopeEntryId: text(candidate.retainedScopeEntryId),
    movedEntryIds: list(candidate.movedEntryIds).map(text).filter(Boolean),
    movedEntryNames: list(candidate.movedEntryNames).map(text).filter(Boolean),
    entryCount: integer(candidate.entryCount),
    internalConnectionCount: integer(candidate.internalConnectionCount),
    boundaryConnectionCount: integer(candidate.boundaryConnectionCount),
    presenceBindingCount: integer(candidate.presenceBindingCount),
    weatherScopeCount: integer(candidate.weatherScopeCount),
    nestedChildReferenceRewriteCount: integer(
      candidate.nestedChildReferenceRewriteCount
    ),
    storedChildIndexRefreshCount: integer(
      candidate.storedChildIndexRefreshCount
    ),
    stableEntryIdsPreserved: candidate.stableEntryIdsPreserved !== false,
    existingChildRegistryCreationId: text(
      candidate.existingChildRegistryCreationId
    ),
    overlappingCandidateIds: overlappingCandidateIds
      .map(text)
      .filter(Boolean),
  };
}

function projectIntegrity(integrity = {}) {
  const before = integrity.before || {};
  const after = integrity.after || {};

  return {
    status: text(integrity.status) || "UNKNOWN",
    before: {
      entries: integer(before.entries),
      connections: integer(before.connections),
      presenceBindings: integer(before.presenceBindings),
    },
    after: {
      entries: integer(after.entries),
      connections: integer(after.connections),
      presenceBindings: integer(after.presenceBindings),
    },
    preserved:
      text(integrity.status) === "PASS" &&
      integer(before.entries) === integer(after.entries) &&
      integer(before.connections) === integer(after.connections) &&
      integer(before.presenceBindings) === integer(after.presenceBindings),
  };
}

function getAnalysisStatusCopy(status) {
  switch (status) {
    case "BLOCKED_SOURCE_INTEGRITY":
      return {
        tone: "ERROR",
        title: "Source integrity must be repaired",
        message:
          "This Registry has source-integrity errors. Correct them before proposing a split.",
      };
    case "PREVIEW_READY":
      return {
        tone: "SUCCESS",
        title: "Split candidates are ready to review",
        message:
          "Choose one or more non-overlapping authored containment scopes, then request a fresh server-authoritative plan.",
      };
    case "NO_NEW_SPLIT_CANDIDATES":
      return {
        tone: "QUIET",
        title: "No new split candidates",
        message:
          "Authored containment exists, but every deterministic scope is already represented by a child Registry.",
      };
    case "NO_AUTHORED_CONTAINMENT_CANDIDATES":
      return {
        tone: "QUIET",
        title: "No authored containment candidates",
        message:
          "No deterministic split can be proposed until the Registry contains authored parent/child containment.",
      };
    default:
      return {
        tone: "QUIET",
        title: "Split analysis unavailable",
        message: "A deterministic split analysis is not available yet.",
      };
  }
}

function getPlanStatusCopy(planStatus) {
  switch (planStatus) {
    case "planning":
      return {
        tone: "PROGRESS",
        label: "Validating selected split...",
      };
    case "ready":
      return {
        tone: "SUCCESS",
        label: "Server validation passed",
      };
    case "blocked":
      return {
        tone: "ERROR",
        label: "Server plan is blocked",
      };
    case "error":
      return {
        tone: "ERROR",
        label: "Split validation failed",
      };
    case "committing":
      return {
        tone: "PROGRESS",
        label: "Applying atomic split...",
      };
    case "committed":
      return {
        tone: "SUCCESS",
        label: "Split applied",
      };
    default:
      return {
        tone: "QUIET",
        label: "Not yet validated",
      };
  }
}

export function projectLocationRegistrySplitPresentation({
  analysis = {},
  execution = {},
} = {}) {
  const selectedCandidateIds = list(execution.selectedCandidateIds)
    .map(text)
    .filter(Boolean);
  const selectedIds = new Set(selectedCandidateIds);
  const candidates = list(analysis.candidates).map((candidate) =>
    projectCandidate(candidate, selectedIds)
  );
  const selectedCandidates = candidates.filter(
    (candidate) => candidate.selected
  );
  const issues = list(analysis.issues).map((issue) => ({
    severity: text(issue.severity) || "ERROR",
    code: text(issue.code) || "UNKNOWN_ISSUE",
    referenceId: text(issue.referenceId),
    message: text(issue.message) || "Unknown split-analysis issue.",
  }));
  const source = analysis.source || {};
  const serverPlan = execution.serverPlan || null;
  const executionGate = serverPlan?.executionGate || {};
  const blockers = list(executionGate.blockers).map((blocker) => {
    if (typeof blocker === "string") {
      return { code: "", message: blocker };
    }

    return {
      code: text(blocker?.code),
      message:
        text(blocker?.message) ||
        text(blocker?.reason) ||
        "The server-authoritative plan reported a blocker.",
    };
  });
  const planStatus = text(execution.planStatus) || "idle";
  const busy =
    Boolean(execution.busy) ||
    planStatus === "planning" ||
    planStatus === "committing";
  const commitReady = Boolean(executionGate.commitReady);
  const creatorConfirmed = Boolean(execution.creatorConfirmed);
  const analysisStatus = text(analysis.status);
  const analysisCopy = getAnalysisStatusCopy(analysisStatus);
  const planCopy = getPlanStatusCopy(planStatus);
  const planIntegrity = projectIntegrity(serverPlan?.integrity);
  const hasFingerprints = Boolean(
    text(serverPlan?.source?.sourceFingerprint) &&
      text(serverPlan?.planFingerprint)
  );

  return {
    contractVersion: LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
    destructiveSourceMutation: true,
    source: {
      title: text(source.title) || "Location Registry",
      entryCount: integer(source.entryCount),
      connectionCount: integer(source.connectionCount),
      presenceBindingCount: integer(source.presenceBindingCount),
      weatherScopeCount: integer(source.weatherScopeCount),
      childRegistryReferenceCount: integer(
        source.childRegistryReferenceCount
      ),
    },
    analysis: {
      status: analysisStatus || "UNKNOWN",
      blocked: analysisStatus === "BLOCKED_SOURCE_INTEGRITY",
      statusTone: analysisCopy.tone,
      statusTitle: analysisCopy.title,
      statusMessage: analysisCopy.message,
      issues,
      errorCount: integer(analysis.errorCount),
      candidateCount: integer(analysis.candidateCount),
      previewReadyCount: integer(analysis.previewReadyCount),
      candidates,
      safeguards: {
        sourceMutationAllowed:
          analysis?.safeguards?.sourceMutationAllowed === true,
        childCreationAllowed:
          analysis?.safeguards?.childCreationAllowed === true,
        stableIdsMustBePreserved:
          analysis?.safeguards?.stableIdsMustBePreserved !== false,
        externalReferenceValidation:
          text(analysis?.safeguards?.externalReferenceValidation) ||
          "REQUIRED_BEFORE_EXECUTION",
        servicesSideRevalidation:
          text(analysis?.safeguards?.servicesSideRevalidation) ||
          "REQUIRED_BEFORE_EXECUTION",
        rollbackGuarantee:
          text(analysis?.safeguards?.rollbackGuarantee) ||
          "REQUIRED_BEFORE_EXECUTION",
        creatorConfirmation:
          text(analysis?.safeguards?.creatorConfirmation) ||
          "REQUIRED_BEFORE_EXECUTION",
      },
    },
    selection: {
      selectedCandidateIds,
      selectedCount: selectedCandidates.length,
      canRequestPlan:
        analysisStatus === "PREVIEW_READY" &&
        selectedCandidates.length > 0 &&
        !busy,
      overlapConflict:
        candidates.some((candidate) => candidate.overlapBlocked),
    },
    execution: {
      planStatus,
      planStatusTone: planCopy.tone,
      planStatusLabel: planCopy.label,
      planMessage: text(execution.planMessage),
      busy,
      hasServerPlan: Boolean(serverPlan),
      planVersion: text(serverPlan?.planVersion),
      hasFingerprints,
      sourceFingerprintPresent: Boolean(
        text(serverPlan?.source?.sourceFingerprint)
      ),
      planFingerprintPresent: Boolean(text(serverPlan?.planFingerprint)),
      commitReady,
      blockers,
      integrity: planIntegrity,
      creatorConfirmed,
      canConfirmAndExecute:
        commitReady &&
        creatorConfirmed &&
        hasFingerprints &&
        !busy,
      confirmLabel:
        planStatus === "committing"
          ? "Applying Atomic Split..."
          : "Confirm & Execute Split",
      destructiveConfirmation:
        "I confirm this reviewed split. Crestfall may create the selected child Location Registries and rewrite the source Registry relationships in one atomic transaction.",
    },
  };
}
