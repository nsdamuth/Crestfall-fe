export const IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION =
  "image_reassignment.presentation.v1";

export const IMAGE_REASSIGNMENT_TRANSACTION_VERSION =
  "image_reassignment_transaction_v0";

export const IMAGE_REASSIGNMENT_DEFAULT_COIN_COST = 1;

export const IMAGE_REASSIGNMENT_CALLBACK_KEYS = Object.freeze([
  "onOpenReassign",
  "onCloseReassign",
  "onDestinationChange",
  "onSubmitReassign",
]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : fallback;
}

function normalizeCreation(value = {}) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};

  return {
    id: text(source.id),
    type: text(source.type) || "CREATION",
    title:
      text(source.title) ||
      text(source?.data?.name) ||
      "Untitled Creation",
    status: text(source.status) || null,
    visibility: text(source.visibility) || null,
    contentRating:
      text(
        source.contentRating ||
          source.content_rating
      ) || "SFW",
  };
}

export function normalizeImageReassignmentContext(
  context = null
) {
  const source =
    context &&
    typeof context === "object" &&
    !Array.isArray(context)
      ? context
      : {};

  const sourceCreation = source.sourceCreation
    ? normalizeCreation(source.sourceCreation)
    : null;

  const sourceCreationId = sourceCreation?.id || "";

  const targets = (Array.isArray(source.targets)
    ? source.targets
    : []
  )
    .map(normalizeCreation)
    .filter(
      (target) =>
        target.id &&
        target.id !== sourceCreationId
    );

  return {
    version:
      text(source.version) ||
      IMAGE_REASSIGNMENT_TRANSACTION_VERSION,
    coinCost: integer(
      source.coinCost,
      IMAGE_REASSIGNMENT_DEFAULT_COIN_COST
    ),
    imageOutputId: text(source.imageOutputId),
    libraryEntryId:
      text(source.libraryEntryId) || null,
    sourceCreation,
    targets,
  };
}

export function canShowImageReassignmentAction({
  canReassign = false,
  imageOutputId = "",
  sourceCreationId = "",
} = {}) {
  return Boolean(
    canReassign &&
      text(imageOutputId) &&
      text(sourceCreationId)
  );
}

function getStatusPresentation(
  status,
  message,
  destinationTitle
) {
  switch (status) {
    case "loading":
      return {
        tone: "PROGRESS",
        statusLabel: "Loading your eligible assets...",
        message: "",
      };

    case "submitting":
      return {
        tone: "PROGRESS",
        statusLabel: "Reassigning...",
        message: "",
      };

    case "success":
      return {
        tone: "SUCCESS",
        statusLabel: "Image reassigned",
        message:
          text(message) ||
          (destinationTitle
            ? `Image reassigned to ${destinationTitle}. 1 Coin used.`
            : "Image reassigned. 1 Coin used."),
      };

    case "error":
      return {
        tone: "ERROR",
        statusLabel: "Reassignment unavailable",
        message:
          text(message) ||
          "Image could not be reassigned.",
      };

    default:
      return {
        tone: "QUIET",
        statusLabel: "",
        message: text(message),
      };
  }
}

export function projectImageReassignmentPresentation({
  open = false,
  status = "idle",
  message = "",
  canReassign = false,
  imageOutputId = "",
  sourceCreationId = "",
  context = null,
  destinationCreationId = "",
  result = null,
} = {}) {
  const normalizedContext =
    normalizeImageReassignmentContext(context);
  const normalizedDestinationId =
    text(destinationCreationId);
  const destination = normalizedContext.targets.find(
    (target) =>
      target.id === normalizedDestinationId
  );
  const resultDestinationTitle = text(
    result?.destinationTitle
  );
  const statusPresentation =
    getStatusPresentation(
      status,
      message,
      resultDestinationTitle ||
        destination?.title ||
        ""
    );

  const isLoading = status === "loading";
  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";
  const hasTargets =
    normalizedContext.targets.length > 0;
  const selectedDestinationIsEligible =
    Boolean(destination);
  const canSubmit =
    Boolean(open) &&
    !isLoading &&
    !isSubmitting &&
    !isSuccess &&
    hasTargets &&
    selectedDestinationIsEligible;

  const coinCost = normalizedContext.coinCost;

  return {
    contractVersion:
      IMAGE_REASSIGNMENT_PRESENTATION_CONTRACT_VERSION,
    transactionVersion:
      normalizedContext.version,
    showAction:
      canShowImageReassignmentAction({
        canReassign,
        imageOutputId,
        sourceCreationId,
      }),
    actionLabel: "Reassign Asset",
    dialog: {
      open: Boolean(open),
      eyebrow: "Reassign Image",
      title: "Move to another asset",
      ownershipMessage:
        "Only images you created can be moved, and both the current and destination assets must belong to you.",
      sourceCreation:
        normalizedContext.sourceCreation,
      destinationCreationId:
        normalizedDestinationId,
      targets:
        normalizedContext.targets,
      hasTargets,
      emptyTargetLabel:
        "No other owned assets available",
      destinationLabel:
        "Destination asset",
      coinCost,
      costLabel: `Cost: ${coinCost} ${
        coinCost === 1 ? "Coin" : "Coins"
      }`,
      moveSemanticsMessage:
        "Reassignment moves the same image. It does not duplicate the file. If this image is featured or selected as a visual reference on the current asset, those source references are cleared automatically.",
      status,
      statusTone:
        statusPresentation.tone,
      statusLabel:
        statusPresentation.statusLabel,
      message:
        statusPresentation.message,
      isLoading,
      isSubmitting,
      isSuccess,
      canSubmit,
      submitLabel: isSubmitting
        ? "Reassigning..."
        : `Reassign for ${coinCost} ${
            coinCost === 1 ? "Coin" : "Coins"
          }`,
      closeLabel: isSuccess
        ? "Close"
        : "Cancel",
    },
  };
}
