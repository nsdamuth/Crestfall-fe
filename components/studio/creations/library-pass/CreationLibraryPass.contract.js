export const CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION =
  "creation_library_pass.presentation.v1";

export const CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK = 4;

function normalizeInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function formatCoins(value) {
  return `${normalizeInteger(value).toLocaleString()} coins`;
}

function normalizeMessageTone(value) {
  const normalized =
    typeof value === "string" ? value.trim().toUpperCase() : "";

  if (normalized === "SUCCESS") return "SUCCESS";
  if (normalized === "ERROR") return "ERROR";
  return "";
}

export function projectCreationLibraryPassMediaAccess({
  media,
  libraryPassState,
  loadStatus = "idle",
  publicPreviewFallback = CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK,
} = {}) {
  const items = Array.isArray(media) ? media : [];
  const previewCount = normalizeInteger(
    libraryPassState?.publicPreviewCount,
    publicPreviewFallback
  );
  const hasFullAccess = Boolean(libraryPassState?.canViewFullLibrary);
  const passRequired = Boolean(
    libraryPassState?.passRequired ??
      (
        libraryPassState?.creationIsPublicLive &&
        normalizeInteger(libraryPassState?.eligibleImageCount) > previewCount
      )
  );
  const stateResolved = loadStatus === "loaded";
  const shouldProtect = stateResolved
    ? passRequired && !hasFullAccess
    : items.length > previewCount;

  let fullAccessState = "PUBLIC_PREVIEW";
  if (libraryPassState?.isOwner) fullAccessState = "OWNER_ACCESS";
  else if (libraryPassState?.hasActiveEntitlement) {
    fullAccessState = "PASS_ACCESS";
  }

  return items.map((item, index) => {
    const locked = shouldProtect && index >= previewCount;

    return {
      ...item,
      locked,
      libraryPassAccessState: locked
        ? "LOCKED"
        : hasFullAccess
          ? fullAccessState
          : "PUBLIC_PREVIEW",
    };
  });
}

export function getCreationLibraryPassPurchaseUnavailableMessage({
  libraryPassState,
  viewerSignedIn = false,
  loadStatus = "idle",
} = {}) {
  if (loadStatus !== "loaded") {
    return "Library Pass status is temporarily unavailable. Please try again after the page finishes loading.";
  }

  if (!libraryPassState?.passRequired) {
    return "This creation does not currently have extended media to unlock.";
  }

  if (!libraryPassState?.salesEnabled) {
    return "New Library Pass sales are currently paused. Existing purchasers retain access.";
  }

  if (!viewerSignedIn) {
    return "Sign in to purchase this Library Pass.";
  }

  if (libraryPassState?.isOwner) {
    return "The creation owner already has full library access.";
  }

  if (libraryPassState?.hasActiveEntitlement) {
    return "This Library Pass is already active on your account.";
  }

  return "This Library Pass cannot be purchased right now.";
}

export function projectCreationLibraryPassPublicPresentation({
  libraryPassState,
  loadStatus = "idle",
  loadError = "",
  viewerSignedIn = false,
  accountStatus = "idle",
  coinBalance = 0,
  purchaseOpen = false,
  purchaseStatus = "idle",
  purchaseMessage = "",
  purchaseMessageTone = "",
  publicPreviewFallback = CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK,
} = {}) {
  const state = libraryPassState || {};
  const passRequired = Boolean(state.passRequired);
  const salesEnabled = Boolean(state.salesEnabled);
  const hasFullAccess = Boolean(state.canViewFullLibrary);
  const hasEntitlement = Boolean(state.hasActiveEntitlement);
  const isOwner = Boolean(state.isOwner);
  const canPurchase = Boolean(state.canPurchase);
  const priceCoins = normalizeInteger(state.currentPriceCoins);
  const previewCount = normalizeInteger(
    state.publicPreviewCount,
    publicPreviewFallback
  );
  const eligibleImageCount = normalizeInteger(state.eligibleImageCount);
  const normalizedCoinBalance = normalizeInteger(coinBalance);
  const isBusy =
    purchaseStatus === "loading_balance" || purchaseStatus === "submitting";
  const knownInsufficientBalance =
    accountStatus === "loaded" && normalizedCoinBalance < priceCoins;

  const statusLabel = isOwner
    ? "Owner Access"
    : hasEntitlement
      ? "Library Pass Active"
      : salesEnabled
        ? "Library Pass"
        : "Sales Paused";

  const actionLabel = hasFullAccess
    ? hasEntitlement
      ? "Library Unlocked"
      : "Owner Access"
    : !salesEnabled
      ? "Sales Paused"
      : !viewerSignedIn
        ? "Sign In Required"
        : `Unlock for ${formatCoins(priceCoins)}`;

  const purchaseUnavailableMessage =
    getCreationLibraryPassPurchaseUnavailableMessage({
      libraryPassState: state,
      viewerSignedIn,
      loadStatus,
    });

  const unavailableMessage = !canPurchase
    ? purchaseUnavailableMessage
    : knownInsufficientBalance
      ? `You need ${formatCoins(priceCoins)}, but your current balance is ${formatCoins(
          normalizedCoinBalance
        )}.`
      : "";

  const tone = normalizeMessageTone(purchaseMessageTone);

  return {
    contractVersion: CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
    previewCount,
    panel: {
      shouldShow:
        passRequired ||
        hasEntitlement ||
        loadStatus === "error",
      loading: loadStatus === "loading",
      loadError,
      statusLabel,
      priceCoins,
      priceLabel: formatCoins(priceCoins),
      eligibleImageCount,
      publicPreviewCount: previewCount,
      includesFutureAdditions: Boolean(state.includesFutureAdditions),
      hasFullAccess,
      showAction: passRequired && !hasFullAccess,
      actionLabel,
      salesEnabled,
    },
    modal: {
      isOpen: Boolean(purchaseOpen),
      title: "Unlock the Extended Image Library",
      priceCoins,
      priceLabel: formatCoins(priceCoins),
      balanceCoins: normalizedCoinBalance,
      balanceLabel:
        accountStatus === "loading" || purchaseStatus === "loading_balance"
          ? "Loading..."
          : formatCoins(normalizedCoinBalance),
      eligibleImageCount,
      publicPreviewCount: previewCount,
      includesFutureAdditions: Boolean(state.includesFutureAdditions),
      isBusy,
      canConfirm: canPurchase && !isBusy && !knownInsufficientBalance,
      confirmLabel:
        purchaseStatus === "submitting"
          ? "Unlocking..."
          : !canPurchase
            ? actionLabel
            : `Unlock for ${formatCoins(priceCoins)}`,
      unavailableMessage,
      statusMessage: purchaseOpen ? purchaseMessage : "",
      statusTone: tone,
    },
    message: purchaseOpen ? "" : purchaseMessage,
    messageTone: tone,
  };
}

export function projectCreationLibraryPassOwnerPresentation({
  libraryPassState,
  loadStatus = "idle",
  message = "",
  messageTone = "",
  actionBusy = false,
  publicPreviewFallback = CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK,
} = {}) {
  const state = libraryPassState || {};
  const currentTier = state.currentTier || "STANDARD";
  const salesEnabled = Boolean(state.salesEnabled);
  const currentPriceCoins = normalizeInteger(state.currentPriceCoins);
  const creatorRewardCoins = normalizeInteger(state.creatorRewardCoins);
  const eligibleImageCount = normalizeInteger(state.eligibleImageCount);
  const publicPreviewCount = normalizeInteger(
    state.publicPreviewCount,
    publicPreviewFallback
  );
  const expandedThreshold = normalizeInteger(state.expandedThreshold);

  return {
    contractVersion: CREATION_LIBRARY_PASS_PRESENTATION_CONTRACT_VERSION,
    loadStatus,
    message,
    messageTone:
      typeof messageTone === "string" ? messageTone.trim().toLowerCase() : "",
    isLoading: loadStatus === "loading",
    isBusy: Boolean(actionBusy),
    offerExists: Boolean(state.offerExists),
    salesEnabled,
    creationIsPublicLive: Boolean(state.creationIsPublicLive),
    currentTier,
    currentPriceCoins,
    currentPriceLabel: formatCoins(currentPriceCoins),
    creatorRewardCoins,
    creatorRewardLabel: formatCoins(creatorRewardCoins),
    eligibleImageCount,
    publicPreviewCount,
    expandedThreshold,
    includesFutureAdditions: state.includesFutureAdditions !== false,
    statusLabel: salesEnabled ? "Sales active" : "Sales paused",
    actionLabel: salesEnabled
      ? "Pause New Sales"
      : "Resume Library Pass Sales",
    actionDisabled:
      loadStatus !== "ready" ||
      actionBusy ||
      !state.creationIsPublicLive ||
      !state.isOwner,
  };
}
