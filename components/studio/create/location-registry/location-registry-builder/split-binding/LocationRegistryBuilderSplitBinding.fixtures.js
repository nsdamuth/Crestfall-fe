export const locationRegistryBuilderSplitPreviewAnalysisFixture =
  Object.freeze({
    version: "location_registry_split_analysis_v1",
    status: "PREVIEW_READY",
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
        scopeEntryId: "trade",
        scopeName: "Trade District",
        suggestedChildTitle: "Trade District Registry",
        retainedScopeEntryId: "trade",
        movedEntryIds: ["workshop", "jewelers"],
        movedEntryNames: [
          "Brasswhisker Workshop",
          "Jewelers' Row",
        ],
        entryCount: 2,
        internalConnectionCount: 1,
        boundaryConnectionCount: 1,
        presenceBindingCount: 1,
        weatherScopeCount: 1,
        nestedChildReferenceRewriteCount: 0,
        storedChildIndexRefreshCount: 0,
        stableEntryIdsPreserved: true,
        existingChildRegistryCreationId: "",
        overlappingCandidateIds: [
          "split_candidate:workshop",
        ],
      },
      {
        id: "split_candidate:workshop",
        status: "PREVIEW_READY",
        scopeEntryId: "workshop",
        scopeName: "Brasswhisker Workshop",
        suggestedChildTitle:
          "Brasswhisker Workshop Registry",
        retainedScopeEntryId: "workshop",
        movedEntryIds: ["forge", "showroom"],
        movedEntryNames: ["Forge Room", "Showroom"],
        entryCount: 2,
        internalConnectionCount: 1,
        boundaryConnectionCount: 1,
        presenceBindingCount: 1,
        weatherScopeCount: 0,
        nestedChildReferenceRewriteCount: 0,
        storedChildIndexRefreshCount: 0,
        stableEntryIdsPreserved: true,
        existingChildRegistryCreationId: "",
        overlappingCandidateIds: [
          "split_candidate:trade",
        ],
      },
    ],
    safeguards: {
      sourceMutationAllowed: false,
      childCreationAllowed: false,
      stableIdsMustBePreserved: true,
      externalReferenceValidation:
        "REQUIRED_BEFORE_EXECUTION",
      servicesSideRevalidation:
        "REQUIRED_BEFORE_EXECUTION",
      rollbackGuarantee:
        "REQUIRED_BEFORE_EXECUTION",
      creatorConfirmation:
        "REQUIRED_BEFORE_EXECUTION",
    },
  });

export const locationRegistryBuilderSplitUnavailableFixture =
  Object.freeze({
    mode: "create",
    currentCreationId: "",
    splitPreview: {
      available: false,
      open: false,
      analysis:
        locationRegistryBuilderSplitPreviewAnalysisFixture,
      selectedCandidateIds: [],
      planStatus: "idle",
      planMessage: "",
      serverPlan: null,
      creatorConfirmed: false,
      busy: false,
    },
  });

export const locationRegistryBuilderSplitReadyFixture =
  Object.freeze({
    mode: "edit",
    currentCreationId:
      "11111111-1111-4111-8111-111111111111",
    splitPreview: {
      available: true,
      open: false,
      analysis:
        locationRegistryBuilderSplitPreviewAnalysisFixture,
      selectedCandidateIds: [],
      planStatus: "idle",
      planMessage: "",
      serverPlan: null,
      creatorConfirmed: false,
      busy: false,
    },
  });

export const locationRegistryBuilderSplitOpenFixture =
  Object.freeze({
    ...locationRegistryBuilderSplitReadyFixture,
    splitPreview: {
      ...locationRegistryBuilderSplitReadyFixture.splitPreview,
      open: true,
      selectedCandidateIds: [
        "split_candidate:trade",
      ],
    },
  });

export const locationRegistryBuilderSplitPlanningFixture =
  Object.freeze({
    ...locationRegistryBuilderSplitOpenFixture,
    splitPreview: {
      ...locationRegistryBuilderSplitOpenFixture.splitPreview,
      planStatus: "planning",
      planMessage:
        "Validating the selected split against the saved Registry...",
      busy: true,
    },
  });

export const locationRegistryBuilderSplitCommitReadyFixture =
  Object.freeze({
    ...locationRegistryBuilderSplitOpenFixture,
    splitPreview: {
      ...locationRegistryBuilderSplitOpenFixture.splitPreview,
      planStatus: "ready",
      planMessage:
        "Server validation passed. Review the preservation checks and confirm only if this is the split you intend to apply.",
      serverPlan: {
        status: "PLANNED",
        planVersion:
          "location_registry_split_plan_v2",
        source: {
          creationId:
            "11111111-1111-4111-8111-111111111111",
          title: "Old Crescent Location Registry",
          sourceFingerprint: "a".repeat(64),
        },
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

export const locationRegistryBuilderSplitCommittingFixture =
  Object.freeze({
    ...locationRegistryBuilderSplitCommitReadyFixture,
    splitPreview: {
      ...locationRegistryBuilderSplitCommitReadyFixture.splitPreview,
      planStatus: "committing",
      busy: true,
    },
  });

export const locationRegistryBuilderSplitBlockedSourceFixture =
  Object.freeze({
    ...locationRegistryBuilderSplitReadyFixture,
    splitPreview: {
      ...locationRegistryBuilderSplitReadyFixture.splitPreview,
      open: true,
      analysis: {
        ...locationRegistryBuilderSplitPreviewAnalysisFixture,
        status: "BLOCKED_SOURCE_INTEGRITY",
        issues: [
          {
            severity: "ERROR",
            code: "LOCAL_PARENT_NOT_FOUND",
            referenceId: "workshop",
            message:
              "Brasswhisker Workshop references a missing local parent.",
          },
        ],
        errorCount: 1,
        previewReadyCount: 0,
      },
    },
  });
