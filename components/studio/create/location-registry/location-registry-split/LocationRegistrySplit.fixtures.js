const splitAnalysisBase = Object.freeze({
  version: "location_registry_split_analysis_v1",
  status: "PREVIEW_READY",
  mutationPerformed: false,
  currentCreationId: "fixture-registry-old-crescent",
  source: {
    title: "Old Crescent Location Registry",
    entryCount: 6,
    connectionCount: 4,
    presenceBindingCount: 2,
    weatherScopeCount: 1,
    childRegistryReferenceCount: 0,
  },
  issues: [],
  errorCount: 0,
  candidateCount: 2,
  previewReadyCount: 2,
  candidates: [
    {
      id: "split_candidate:trade",
      status: "PREVIEW_READY",
      executable: false,
      scopeEntryId: "trade",
      scopeEntryCreationId: "fixture-location-trade",
      scopeName: "Trade District",
      suggestedChildTitle: "Trade District Registry",
      retainedScopeEntryId: "trade",
      movedEntryIds: ["workshop", "jewelers"],
      movedEntryNames: ["Brasswhisker Workshop", "Jewelers' Row"],
      entryCount: 2,
      internalConnectionIds: ["inside-trade"],
      internalConnectionCount: 1,
      boundaryConnectionIds: ["trade-boundary"],
      boundaryConnectionCount: 1,
      presenceBindingIds: ["presence-kessa"],
      presenceBindingCount: 1,
      weatherScopeIds: ["weather-old-crescent"],
      weatherScopeCount: 1,
      nestedChildRegistryCreationIds: [],
      nestedChildReferenceRewriteCount: 0,
      storedChildIndexRefreshCount: 0,
      existingChildRegistryCreationId: "",
      stableEntryIdsPreserved: true,
      overlappingCandidateIds: ["split_candidate:workshop"],
      overlapCount: 1,
    },
    {
      id: "split_candidate:workshop",
      status: "PREVIEW_READY",
      executable: false,
      scopeEntryId: "workshop",
      scopeEntryCreationId: "fixture-location-workshop",
      scopeName: "Brasswhisker Workshop",
      suggestedChildTitle: "Brasswhisker Workshop Registry",
      retainedScopeEntryId: "workshop",
      movedEntryIds: ["forge", "showroom"],
      movedEntryNames: ["Forge Room", "Showroom"],
      entryCount: 2,
      internalConnectionIds: ["inside-workshop"],
      internalConnectionCount: 1,
      boundaryConnectionIds: ["workshop-boundary"],
      boundaryConnectionCount: 1,
      presenceBindingIds: ["presence-apprentice"],
      presenceBindingCount: 1,
      weatherScopeIds: [],
      weatherScopeCount: 0,
      nestedChildRegistryCreationIds: [],
      nestedChildReferenceRewriteCount: 0,
      storedChildIndexRefreshCount: 0,
      existingChildRegistryCreationId: "",
      stableEntryIdsPreserved: true,
      overlappingCandidateIds: ["split_candidate:trade"],
      overlapCount: 1,
    },
  ],
  safeguards: {
    sourceMutationAllowed: false,
    childCreationAllowed: false,
    stableIdsMustBePreserved: true,
    externalReferenceValidation: "REQUIRED_BEFORE_EXECUTION",
    servicesSideRevalidation: "REQUIRED_BEFORE_EXECUTION",
    rollbackGuarantee: "REQUIRED_BEFORE_EXECUTION",
    creatorConfirmation: "REQUIRED_BEFORE_EXECUTION",
  },
});

export const locationRegistrySplitPreviewFixture = Object.freeze({
  analysis: splitAnalysisBase,
  execution: {
    selectedCandidateIds: [],
    planStatus: "idle",
    planMessage: "",
    serverPlan: null,
    creatorConfirmed: false,
    busy: false,
  },
});

export const locationRegistrySplitSelectedFixture = Object.freeze({
  analysis: splitAnalysisBase,
  execution: {
    selectedCandidateIds: ["split_candidate:trade"],
    planStatus: "idle",
    planMessage: "",
    serverPlan: null,
    creatorConfirmed: false,
    busy: false,
  },
});

export const locationRegistrySplitConfirmFixture = Object.freeze({
  analysis: splitAnalysisBase,
  execution: {
    selectedCandidateIds: ["split_candidate:trade"],
    planStatus: "ready",
    planMessage:
      "Server validation passed. Review the preservation checks and confirm only if this is the split you intend to apply.",
    serverPlan: {
      status: "PLANNED",
      planVersion: "location_registry_split_plan_v2",
      source: {
        creationId: "fixture-registry-old-crescent",
        title: "Old Crescent Location Registry",
        sourceFingerprint: "a".repeat(64),
      },
      selection: [
        {
          scopeLocationEntryId: "trade",
          movedLocationEntryIds: ["workshop", "jewelers"],
        },
      ],
      integrity: {
        status: "PASS",
        before: {
          entries: 6,
          connections: 4,
          presenceBindings: 2,
        },
        after: {
          entries: 6,
          connections: 4,
          presenceBindings: 2,
        },
      },
      planFingerprint: "b".repeat(64),
      executionGate: {
        commitReady: true,
        blockers: [],
      },
    },
    creatorConfirmed: true,
    busy: false,
  },
});

export const locationRegistrySplitBlockedSourceFixture = Object.freeze({
  analysis: {
    ...splitAnalysisBase,
    status: "BLOCKED_SOURCE_INTEGRITY",
    issues: [
      {
        severity: "ERROR",
        code: "LOCAL_PARENT_NOT_FOUND",
        referenceId: "workshop",
        message:
          "Brasswhisker Workshop references missing local parent trade-missing.",
      },
    ],
    errorCount: 1,
    previewReadyCount: 0,
  },
  execution: {
    selectedCandidateIds: [],
    planStatus: "idle",
    planMessage: "",
    serverPlan: null,
    creatorConfirmed: false,
    busy: false,
  },
});

export const locationRegistrySplitServerBlockedFixture = Object.freeze({
  analysis: splitAnalysisBase,
  execution: {
    selectedCandidateIds: ["split_candidate:trade"],
    planStatus: "blocked",
    planMessage:
      "The server-authoritative plan has blockers and cannot be committed.",
    serverPlan: {
      status: "PLANNED",
      planVersion: "location_registry_split_plan_v2",
      source: {
        creationId: "fixture-registry-old-crescent",
        title: "Old Crescent Location Registry",
        sourceFingerprint: "c".repeat(64),
      },
      selection: [
        {
          scopeLocationEntryId: "trade",
          movedLocationEntryIds: ["workshop", "jewelers"],
        },
      ],
      integrity: {
        status: "PASS",
        before: {
          entries: 6,
          connections: 4,
          presenceBindings: 2,
        },
        after: {
          entries: 6,
          connections: 4,
          presenceBindings: 2,
        },
      },
      planFingerprint: "d".repeat(64),
      executionGate: {
        commitReady: false,
        blockers: [
          {
            code: "INBOUND_REFERENCE_REVIEW_REQUIRED",
            message:
              "An external reference must be reviewed before this split can execute.",
          },
        ],
      },
    },
    creatorConfirmed: false,
    busy: false,
  },
});

export const locationRegistrySplitNoContainmentFixture = Object.freeze({
  analysis: {
    ...splitAnalysisBase,
    status: "NO_AUTHORED_CONTAINMENT_CANDIDATES",
    candidateCount: 0,
    previewReadyCount: 0,
    candidates: [],
  },
  execution: {
    selectedCandidateIds: [],
    planStatus: "idle",
    planMessage: "",
    serverPlan: null,
    creatorConfirmed: false,
    busy: false,
  },
});
