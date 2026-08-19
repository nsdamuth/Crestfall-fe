import {
  CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION,
} from "../CreationImageLibraryPage.contract.js";

import {
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  projectCreationLibraryPassOwnerPresentation,
} from "../../../../creations/library-pass/CreationLibraryPass.contract.js";

export const CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION =
  "creation_image_library_library_pass_owner_binding_v1";

export const CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_CALLBACK_KEYS =
  Object.freeze([
    "onToggleLibraryPassSales",
  ]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function projectCreationImageLibraryLibraryPassOwnerBinding({
  libraryPassState = null,
  loadStatus = "idle",
  message = "",
  messageTone = "info",
  actionBusy = false,
  callbacks = {},
} = {}) {
  const callbackSource = object(callbacks);

  const ownerPresentation =
    projectCreationLibraryPassOwnerPresentation({
      libraryPassState,
      loadStatus,
      message: text(message),
      messageTone: text(messageTone),
      actionBusy,
    });

  const ready =
    ownerPresentation.loadStatus === "ready";
  const loading =
    ownerPresentation.isLoading;

  const panel = {
    ...ownerPresentation,

    eyebrow: "Library Pass",
    heading: "Extended Image Library",

    helper:
      `The ${ownerPresentation.publicPreviewCount} most recent eligible images remain visible to everyone. ` +
      "Extended media is protected automatically. A Library Pass unlocks the complete eligible library" +
      (
        ownerPresentation.includesFutureAdditions
          ? " and future additions for that purchaser. "
          : " for that purchaser. "
      ) +
      "Pausing sales does not remove the lock.",

    metrics: ready
      ? [
          {
            id: "current-price",
            label: "Current price",
            value: ownerPresentation.currentPriceLabel,
          },
          {
            id: "eligible-images",
            label: "Eligible images",
            value: String(
              ownerPresentation.eligibleImageCount
            ),
          },
          {
            id: "public-previews",
            label: "Public previews",
            value: String(
              ownerPresentation.publicPreviewCount
            ),
          },
          {
            id: "creator-reward",
            label: "Creator reward per sale",
            value: ownerPresentation.creatorRewardLabel,
          },
        ]
      : [],

    tierSummary: ready
      ? `Current tier: ${ownerPresentation.currentTier}. Expanded pricing begins at ${ownerPresentation.expandedThreshold} eligible images.`
      : "",

    expandedTierMessage:
      ready &&
      ownerPresentation.currentTier === "EXPANDED"
        ? "Expanded pricing is active and does not automatically downgrade."
        : "",

    salesPausedMessage:
      ready &&
      !ownerPresentation.salesEnabled
        ? "Pausing blocks new purchases only. Existing purchasers keep access."
        : "",

    publicLiveWarning:
      ready &&
      !ownerPresentation.creationIsPublicLive
        ? "This creation must be public and approved before Library Pass sales can be enabled."
        : "",

    loadingMessage:
      loading
        ? "Loading Library Pass settings..."
        : "",

    actionLabel:
      ownerPresentation.isBusy
        ? "Saving..."
        : ownerPresentation.actionLabel,

    actionIntent:
      ownerPresentation.salesEnabled
        ? "PAUSE_NEW_SALES"
        : "RESUME_LIBRARY_PASS_SALES",

    actionTone:
      ownerPresentation.salesEnabled
        ? "CAUTION"
        : "PRIMARY",
  };

  return {
    bindingContractVersion:
      CREATION_IMAGE_LIBRARY_LIBRARY_PASS_OWNER_BINDING_CONTRACT_VERSION,

    creationImageLibraryViewContractVersion:
      CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION,

    libraryPassPresentationContractVersion:
      CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,

    creationImageLibraryProps: {
      libraryPassPanel: panel,
      onToggleLibraryPassSales:
        callbackSource.onToggleLibraryPassSales || null,
    },

    panel,

    functionalWiringStatus: {
      ownerLibraryPassStateLoading: "WIRED",
      ownerLibraryPassProjection: "WIRED",
      salesPauseResumeMutation: "WIRED",
      postMutationRefresh: "WIRED",
      ownerPanelVisualComposition: "WIRED",
    },

    architecture: {
      libraryPassStateLoadingOwnedByChassis: true,
      eligibleImageComputationOwnedByChassis: true,
      currentTierOwnedByChassis: true,
      priceAndRewardOwnedByChassis: true,
      salesMutationOwnedByChassis: true,
      postMutationRefreshOwnedByChassis: true,
      ownerPanelVisualCompositionOwnedByFe: true,
    },
  };
}
