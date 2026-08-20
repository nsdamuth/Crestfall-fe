import {
  LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../LocationRegistryBuilder.contract.js";

import {
  LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,
  projectLocationRegistrySplitPresentation,
} from "../../location-registry-split/LocationRegistrySplit.contract.js";

export const LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION =
  "location_registry_builder_split_binding_v1";

export const LOCATION_REGISTRY_BUILDER_SPLIT_CALLBACK_KEYS = Object.freeze([
  "onOpenSplitPreview",
  "onCloseSplitPreview",
  "onToggleSplitCandidate",
  "onPrepareSplitPlan",
  "onChangeSplitCreatorConfirmation",
  "onCommitSplitPlan",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function projectLocationRegistryBuilderSplitBinding({
  mode = "create",
  currentCreationId = "",
  splitPreview = {},
  callbacks = {},
} = {}) {
  const state = object(splitPreview);
  const callbackSource = object(callbacks);

  const presentation =
    projectLocationRegistrySplitPresentation({
      analysis: state.analysis || {},
      execution: {
        selectedCandidateIds:
          state.selectedCandidateIds || [],
        planStatus:
          text(state.planStatus) || "idle",
        planMessage:
          text(state.planMessage),
        serverPlan:
          state.serverPlan || null,
        creatorConfirmed:
          state.creatorConfirmed === true,
        busy:
          state.busy === true,
      },
    });

  const available =
    state.available === true;

  const open =
    available &&
    state.open === true;

  return {
    bindingContractVersion:
      LOCATION_REGISTRY_BUILDER_SPLIT_BINDING_CONTRACT_VERSION,

    locationRegistryBuilderViewContractVersion:
      LOCATION_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,

    splitPresentationContractVersion:
      LOCATION_REGISTRY_SPLIT_PRESENTATION_CONTRACT_VERSION,

    action: {
      visible: available,
      label: "Analyze Split",
      disabled:
        !available ||
        presentation.execution.busy,
      intent: "OPEN_SPLIT_PREVIEW",
    },

    splitDialog: {
      open,
      presentation,
      canClose:
        presentation.execution.planStatus !== "committing",
    },

    locationRegistryBuilderProps: {
      splitAction: {
        visible: available,
        label: "Analyze Split",
        disabled:
          !available ||
          presentation.execution.busy,
      },
      splitDialog: {
        open,
        presentation,
      },

      onOpenSplitPreview:
        callbackSource.onOpenSplitPreview || null,
      onCloseSplitPreview:
        callbackSource.onCloseSplitPreview || null,
      onToggleSplitCandidate:
        callbackSource.onToggleSplitCandidate || null,
      onPrepareSplitPlan:
        callbackSource.onPrepareSplitPlan || null,
      onChangeSplitCreatorConfirmation:
        callbackSource.onChangeSplitCreatorConfirmation || null,
      onCommitSplitPlan:
        callbackSource.onCommitSplitPlan || null,
    },

    context: {
      mode: text(mode) || "create",
      hasSavedCreationId:
        Boolean(text(currentCreationId)),
      availabilityOwnedByChassis: true,
    },

    applicationWiringStatus: {
      sharedLocationRegistryFoundation: "WIRED",
      splitAnalysisPlanCommitViewModel: "WIRED",
      splitClientApiProxyPath: "WIRED",
      editCreationIdBridge: "WIRED",
      splitVisualComposition: "WIRED",
    },

    architecture: {
      splitAnalysisOwnedByChassis: true,
      splitSelectionStateOwnedByChassis: true,
      serverPlanningOwnedByChassis: true,
      fingerprintValidationOwnedByChassis: true,
      creatorConfirmationStateOwnedByChassis: true,
      atomicCommitOwnedByChassis: true,
      postCommitRefreshOwnedByChassis: true,
      splitVisualCompositionOwnedByFe: true,
    },
  };
}
