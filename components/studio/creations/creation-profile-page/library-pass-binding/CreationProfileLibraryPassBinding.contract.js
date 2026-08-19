import {
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
} from "../CreationProfilePage.contract.js";

import {
  CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
  CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK,
  projectCreationLibraryPassMediaAccess,
  projectCreationLibraryPassPublicPresentation,
} from "../../library-pass/CreationLibraryPass.contract.js";

export const CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION =
  "creation_profile_library_pass_binding_v1";

export const CREATION_PROFILE_LIBRARY_PASS_CALLBACK_KEYS = Object.freeze([
  "onOpenLibraryPassPurchase",
  "onCloseLibraryPassPurchase",
  "onConfirmLibraryPassPurchase",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : fallback;
}

export function projectCreationProfileLibraryPassBinding({
  filteredMedia = [],
  visibleCount = 12,
  libraryPassState = null,
  libraryPassLoadStatus = "idle",
  libraryPassLoadError = "",
  viewerSignedIn = false,
  accountStatus = "idle",
  coinBalance = 0,
  purchaseOpen = false,
  purchaseStatus = "idle",
  purchaseMessage = "",
  purchaseMessageTone = "",
  activePreviewId = "",
  callbacks = {},
} = {}) {
  const safeFilteredMedia = array(filteredMedia);
  const callbackSource = object(callbacks);

  const accessControlledMedia =
    projectCreationLibraryPassMediaAccess({
      media: safeFilteredMedia,
      libraryPassState,
      loadStatus: libraryPassLoadStatus,
    });

  const publicPresentation =
    projectCreationLibraryPassPublicPresentation({
      libraryPassState,
      loadStatus: libraryPassLoadStatus,
      loadError: text(libraryPassLoadError),
      viewerSignedIn,
      accountStatus,
      coinBalance,
      purchaseOpen,
      purchaseStatus,
      purchaseMessage,
      purchaseMessageTone,
    });

  const previewCount = integer(
    publicPresentation.previewCount,
    CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK
  );

  const lockedMediaCount = accessControlledMedia.filter(
    (item) => item.locked
  ).length;

  const normalizedVisibleCount = integer(visibleCount, 12);

  const visibleMedia = accessControlledMedia
    .slice(0, normalizedVisibleCount)
    .map((item, index) => ({
      ...item,
      priority:
        !item.locked && index < previewCount,
      lockedAction:
        item.locked
          ? "OPEN_LIBRARY_PASS_PURCHASE"
          : null,
      lockedAriaLabel:
        item.locked
          ? "Unlock this extended library image"
          : "",
      lockedEyebrow:
        item.locked ? "Library Pass" : "",
      lockedLabel:
        item.locked ? "Unlock extended media" : "",
    }));

  const lightboxMedia = accessControlledMedia.filter(
    (item) => !item.locked
  );

  const normalizedActivePreviewId =
    text(activePreviewId);

  const activePreviewItem =
    normalizedActivePreviewId
      ? lightboxMedia.find(
          (item) =>
            String(item.id) === normalizedActivePreviewId
        ) || null
      : null;

  const panelShouldShow =
    publicPresentation.panel.shouldShow ||
    (
      libraryPassLoadStatus !== "loaded" &&
      accessControlledMedia.length > previewCount
    );

  const panel = {
    ...publicPresentation.panel,
    shouldShow: panelShouldShow,
    lockedMediaCount,
    loadError: text(libraryPassLoadError),
    eyebrow: "Extended Image Library",
    heading:
      publicPresentation.panel.hasFullAccess
        ? "Complete library access is active"
        : `${lockedMediaCount} extended ${
            lockedMediaCount === 1 ? "image" : "images"
          } available`,
    helper:
      `The ${previewCount} most recent eligible results remain visible to everyone. ` +
      `A Library Pass unlocks the complete eligible library${
        publicPresentation.panel.includesFutureAdditions
          ? " and future additions."
          : "."
      }`,
    eligibleCountLabel:
      `${publicPresentation.panel.eligibleImageCount} eligible images`,
    previewCountLabel:
      `${previewCount} public previews`,
    loadErrorTitle:
      "Library Pass Unavailable",
    loadErrorHelper:
      text(libraryPassLoadError)
        ? `${text(libraryPassLoadError)} Extended media is temporarily limited to the public previews.`
        : "",
  };

  const modal = {
    ...publicPresentation.modal,
    eyebrow: "Library Pass",
    body:
      `Unlock all ${publicPresentation.modal.eligibleImageCount} currently eligible images${
        publicPresentation.modal.includesFutureAdditions
          ? " and every eligible image added later"
          : ""
      }.`,
    priceFieldLabel: "Pass Price",
    balanceFieldLabel: "Your Balance",
    publicPreviewHelper:
      `${publicPresentation.modal.publicPreviewCount} recent results remain publicly visible.`,
    oneTimePurchaseHelper:
      "This is a one-time purchase for this creation.",
    futureAdditionsHelper:
      publicPresentation.modal.includesFutureAdditions
        ? "Future eligible additions are included automatically."
        : "",
    closeAriaLabel:
      "Close Library Pass dialog",
  };

  return {
    bindingContractVersion:
      CREATION_PROFILE_LIBRARY_PASS_BINDING_CONTRACT_VERSION,
    creationProfileViewContractVersion:
      CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
    libraryPassPresentationContractVersion:
      CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,

    media: {
      accessControlledMedia,
      visibleMedia,
      lightboxMedia,
      activePreviewItem,
      lockedMediaCount,
      filteredMediaCount: accessControlledMedia.length,
      hasLockedMedia: lockedMediaCount > 0,
    },

    creationProfileProps: {
      visibleMedia,
      filteredMedia: accessControlledMedia,
      lightboxMedia,
      activePreviewItem,
      libraryPassPanel: panel,
      libraryPassModal: modal,
      libraryPassMessage:
        publicPresentation.message,
      libraryPassMessageTone:
        publicPresentation.messageTone,
      onOpenLibraryPassPurchase:
        callbackSource.onOpenLibraryPassPurchase || null,
      onCloseLibraryPassPurchase:
        callbackSource.onCloseLibraryPassPurchase || null,
      onConfirmLibraryPassPurchase:
        callbackSource.onConfirmLibraryPassPurchase || null,
    },

    functionalWiringStatus: {
      libraryPassStateLoading: "WIRED",
      mediaAccessProjection: "WIRED",
      lockedMediaPurchaseRouting: "WIRED",
      purchaseMutation: "WIRED",
      entitlementRefresh: "WIRED",
      accountBalanceIntegration: "WIRED",
      creationProfileVisualComposition: "WIRED",
    },

    interaction: {
      lockedMediaAction:
        "OPEN_LIBRARY_PASS_PURCHASE",
      unlockedMediaAction:
        "OPEN_MEDIA_LIGHTBOX",
      resolveMediaOpenAction(itemId) {
        const item = accessControlledMedia.find(
          (candidate) =>
            String(candidate.id) === String(itemId)
        );

        if (!item) return "NO_ACTION";

        return item.locked
          ? "OPEN_LIBRARY_PASS_PURCHASE"
          : "OPEN_MEDIA_LIGHTBOX";
      },
    },

    architecture: {
      filteredMediaInputOwnedByChassis: true,
      libraryPassStateLoadingOwnedByChassis: true,
      accountBalanceOwnedByChassis: true,
      purchaseMutationOwnedByChassis: true,
      entitlementRefreshOwnedByChassis: true,
      mediaAccessPresentationOwnedByFe: true,
      creationProfileVisualCompositionOwnedByFe: true,
    },
  };
}
