import {
  MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION,
} from "../MediaLightbox.contract.js";

import {
  IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
  projectImageReassignmentPresentation,
} from "../../image-reassignment/ImageReassignmentPresentation.contract.js";

export const MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION =
  "media_lightbox_image_reassignment_binding_v1";

export const MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_CALLBACK_KEYS = Object.freeze([
  "onOpenReassign",
  "onCloseReassign",
  "onReassignDestinationChange",
  "onSubmitReassign",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function projectMediaLightboxReassignmentActiveMedia(
  activeMedia = null
) {
  const source = object(activeMedia);

  if (!text(source.id)) return null;

  return {
    id: text(source.id),
    title:
      text(source.title) ||
      text(source.label) ||
      text(source.type) ||
      "Image",
    imageOutputId: text(source.imageOutputId),
    sourceCreationId: text(source.sourceCreationId),
    canReassign: source.canReassign === true,
  };
}

export function projectMediaLightboxImageReassignmentBinding({
  activeMedia = null,
  reassignment = {},
  callbacks = {},
} = {}) {
  const projectedActiveMedia =
    projectMediaLightboxReassignmentActiveMedia(activeMedia);
  const state = object(reassignment);
  const callbackSource = object(callbacks);

  const presentation = projectImageReassignmentPresentation({
    open: state.open === true,
    status: text(state.status) || "idle",
    message: text(state.message),
    canReassign:
      projectedActiveMedia?.canReassign === true,
    imageOutputId:
      projectedActiveMedia?.imageOutputId || "",
    sourceCreationId:
      projectedActiveMedia?.sourceCreationId || "",
    context: state.context || null,
    destinationCreationId:
      text(state.destinationCreationId),
    result: state.result || null,
  });

  return {
    bindingContractVersion:
      MEDIA_LIGHTBOX_IMAGE_REASSIGNMENT_BINDING_CONTRACT_VERSION,
    mediaLightboxContractVersion:
      MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION,
    imageReassignmentPresentationContractVersion:
      IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,

    activeMedia: projectedActiveMedia,

    mediaLightboxProps: {
      showReassignAction:
        presentation.showAction,
      reassignDialog: {
        open: presentation.dialog.open,
        status: presentation.dialog.status,
        message: presentation.dialog.message,
        coinCost: presentation.dialog.coinCost,
        sourceCreation:
          presentation.dialog.sourceCreation,
        targets: presentation.dialog.targets,
        destinationCreationId:
          presentation.dialog.destinationCreationId,
      },
      reassignmentPresentation: {
        actionLabel:
          presentation.actionLabel,
        ownershipMessage:
          presentation.dialog.ownershipMessage,
        moveSemanticsMessage:
          presentation.dialog.moveSemanticsMessage,
        costLabel:
          presentation.dialog.costLabel,
        submitLabel:
          presentation.dialog.submitLabel,
        closeLabel:
          presentation.dialog.closeLabel,
        emptyTargetLabel:
          presentation.dialog.emptyTargetLabel,
        statusTone:
          presentation.dialog.statusTone,
        statusLabel:
          presentation.dialog.statusLabel,
        isLoading:
          presentation.dialog.isLoading,
        isSubmitting:
          presentation.dialog.isSubmitting,
        isSuccess:
          presentation.dialog.isSuccess,
        canSubmit:
          presentation.dialog.canSubmit,
      },
      onOpenReassign:
        callbackSource.onOpenReassign || null,
      onCloseReassign:
        callbackSource.onCloseReassign || null,
      onReassignDestinationChange:
        callbackSource.onReassignDestinationChange || null,
      onSubmitReassign:
        callbackSource.onSubmitReassign || null,
    },

    presentation: {
      actionLabel:
        presentation.actionLabel,
      ownershipMessage:
        presentation.dialog.ownershipMessage,
      moveSemanticsMessage:
        presentation.dialog.moveSemanticsMessage,
      costLabel:
        presentation.dialog.costLabel,
      submitLabel:
        presentation.dialog.submitLabel,
      closeLabel:
        presentation.dialog.closeLabel,
      emptyTargetLabel:
        presentation.dialog.emptyTargetLabel,
      statusTone:
        presentation.dialog.statusTone,
      statusLabel:
        presentation.dialog.statusLabel,
      isLoading:
        presentation.dialog.isLoading,
      isSubmitting:
        presentation.dialog.isSubmitting,
      isSuccess:
        presentation.dialog.isSuccess,
      canSubmit:
        presentation.dialog.canSubmit,
    },

    functionalWiringStatus: {
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
    },

    architecture: {
      imageEligibilityOwnedByChassis: true,
      reassignmentContextLoadingOwnedByChassis: true,
      destinationMutationOwnedByChassis: true,
      coinSpendOwnedByChassis: true,
      postSuccessRefreshOwnedByChassis: true,
      sourceDetailsInvalidationOwnedByChassis: true,
      lightboxVisualCompositionOwnedByFe: true,
    },
  };
}
