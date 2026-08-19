"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import {
  createLibraryPassPurchaseIdempotencyKey,
  fetchCreationLibraryPassState,
  purchaseCreationLibraryPass,
} from "@/lib/client/studio/creations/libraryPassClient";

export const CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK = 4;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function formatCoins(value) {
  return `${normalizeInteger(value).toLocaleString()} coins`;
}

export function projectCreationProfileLibraryPassAccess({
  media,
  libraryPassState,
  loadStatus = "idle",
} = {}) {
  const items = Array.isArray(media) ? media : [];
  const previewCount = normalizeInteger(
    libraryPassState?.publicPreviewCount,
    CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK
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

function getPurchaseUnavailableMessage({
  libraryPassState,
  viewerSignedIn,
  loadStatus,
}) {
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

export function useCreationLibraryPassPublicViewModel({
  creationId,
  loadLibraryPassState = fetchCreationLibraryPassState,
  purchaseLibraryPass = purchaseCreationLibraryPass,
  createPurchaseKey = createLibraryPassPurchaseIdempotencyKey,
} = {}) {
  const normalizedCreationId = normalizeString(creationId);
  const {
    accountProfile,
    coinBalance,
    accountStatus,
    refreshAccount,
    setCoinBalanceFromServer,
  } = useStudioAccount();

  const [libraryPassState, setLibraryPassState] = useState(null);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [loadError, setLoadError] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("idle");
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseMessageTone, setPurchaseMessageTone] = useState("");
  const [purchaseIdempotencyKey, setPurchaseIdempotencyKey] = useState("");

  const refreshLibraryPassState = useCallback(async () => {
    if (!normalizedCreationId) {
      setLibraryPassState(null);
      setLoadStatus("idle");
      setLoadError("");
      return null;
    }

    setLoadStatus("loading");
    setLoadError("");

    try {
      const nextState = await loadLibraryPassState(normalizedCreationId);
      setLibraryPassState(nextState);
      setLoadStatus("loaded");
      return nextState;
    } catch (error) {
      setLibraryPassState(null);
      setLoadStatus("error");
      setLoadError(
        error?.message || "Library Pass status could not be loaded."
      );
      return null;
    }
  }, [loadLibraryPassState, normalizedCreationId]);

  useEffect(() => {
    let cancelled = false;

    if (!normalizedCreationId) {
      setLibraryPassState(null);
      setLoadStatus("idle");
      setLoadError("");
      return undefined;
    }

    setLoadStatus("loading");
    setLoadError("");

    loadLibraryPassState(normalizedCreationId)
      .then((nextState) => {
        if (cancelled) return;
        setLibraryPassState(nextState);
        setLoadStatus("loaded");
      })
      .catch((error) => {
        if (cancelled) return;
        setLibraryPassState(null);
        setLoadStatus("error");
        setLoadError(
          error?.message || "Library Pass status could not be loaded."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [loadLibraryPassState, normalizedCreationId]);

  const viewerSignedIn = Boolean(
    accountProfile?.id ||
      libraryPassState?.canPurchase ||
      libraryPassState?.isOwner ||
      libraryPassState?.hasActiveEntitlement
  );
  const priceCoins = normalizeInteger(libraryPassState?.currentPriceCoins);
  const previewCount = normalizeInteger(
    libraryPassState?.publicPreviewCount,
    CREATION_LIBRARY_PASS_PUBLIC_PREVIEW_FALLBACK
  );
  const eligibleImageCount = normalizeInteger(
    libraryPassState?.eligibleImageCount
  );
  const canPurchase = Boolean(libraryPassState?.canPurchase);
  const isBusy =
    purchaseStatus === "loading_balance" || purchaseStatus === "submitting";
  const knownInsufficientBalance =
    accountStatus === "loaded" && coinBalance < priceCoins;
  const purchaseUnavailableMessage = getPurchaseUnavailableMessage({
    libraryPassState,
    viewerSignedIn,
    loadStatus,
  });

  const openPurchase = useCallback(() => {
    setPurchaseOpen(true);
    setPurchaseMessage("");
    setPurchaseMessageTone("");

    if (canPurchase) {
      try {
        const nextPurchaseKey = createPurchaseKey();
        setPurchaseIdempotencyKey((current) => current || nextPurchaseKey);
      } catch (error) {
        setPurchaseStatus("error");
        setPurchaseMessage(
          error?.message || "A secure purchase key could not be created."
        );
        setPurchaseMessageTone("ERROR");
        return;
      }

      setPurchaseStatus("loading_balance");
      refreshAccount()
        .then(() => {
          setPurchaseStatus("idle");
        })
        .catch((error) => {
          setPurchaseStatus("error");
          setPurchaseMessage(
            error?.message || "Your current coin balance could not be loaded."
          );
          setPurchaseMessageTone("ERROR");
        });
    }
  }, [canPurchase, createPurchaseKey, refreshAccount]);

  const closePurchase = useCallback(() => {
    if (isBusy) return;
    setPurchaseOpen(false);
    setPurchaseStatus("idle");
    setPurchaseMessage("");
    setPurchaseMessageTone("");
    setPurchaseIdempotencyKey("");
  }, [isBusy]);

  const submitPurchase = useCallback(async () => {
    if (!canPurchase) {
      setPurchaseStatus("error");
      setPurchaseMessage(purchaseUnavailableMessage);
      setPurchaseMessageTone("ERROR");
      return;
    }

    if (knownInsufficientBalance) {
      setPurchaseStatus("error");
      setPurchaseMessage(
        `You need ${formatCoins(priceCoins)}, but your current balance is ${formatCoins(
          coinBalance
        )}.`
      );
      setPurchaseMessageTone("ERROR");
      return;
    }

    let idempotencyKey = purchaseIdempotencyKey;
    if (!idempotencyKey) {
      try {
        idempotencyKey = createPurchaseKey();
        setPurchaseIdempotencyKey(idempotencyKey);
      } catch (error) {
        setPurchaseStatus("error");
        setPurchaseMessage(
          error?.message || "A secure purchase key could not be created."
        );
        setPurchaseMessageTone("ERROR");
        return;
      }
    }

    setPurchaseStatus("submitting");
    setPurchaseMessage("");
    setPurchaseMessageTone("");

    try {
      const result = await purchaseLibraryPass(
        normalizedCreationId,
        idempotencyKey
      );
      const nextState = result?.libraryPass || null;
      const buyerBalance = result?.purchase?.buyerBalance;

      if (nextState) setLibraryPassState(nextState);
      if (!setCoinBalanceFromServer(buyerBalance)) {
        refreshAccount().catch(() => {});
      }

      setPurchaseStatus("success");
      setPurchaseMessage(
        result?.purchase?.charged === false
          ? "Your existing Library Pass has been restored."
          : "Library Pass unlocked. The complete eligible library and future additions are now available."
      );
      setPurchaseMessageTone("SUCCESS");
      setPurchaseOpen(false);
      setPurchaseIdempotencyKey("");
    } catch (error) {
      const details = error?.details || {};
      const serverBalance =
        details?.coinBalance ?? details?.coin_balance ?? null;
      if (serverBalance !== null) {
        setCoinBalanceFromServer(serverBalance);
      }

      setPurchaseStatus("error");
      setPurchaseMessage(
        error?.code === "INSUFFICIENT_COINS"
          ? "You do not have enough coins to purchase this Library Pass."
          : error?.message || "Library Pass purchase could not be completed."
      );
      setPurchaseMessageTone("ERROR");
    }
  }, [
    canPurchase,
    coinBalance,
    createPurchaseKey,
    knownInsufficientBalance,
    normalizedCreationId,
    priceCoins,
    purchaseIdempotencyKey,
    purchaseLibraryPass,
    purchaseUnavailableMessage,
    refreshAccount,
    setCoinBalanceFromServer,
  ]);

  return useMemo(() => {
    const passRequired = Boolean(libraryPassState?.passRequired);
    const salesEnabled = Boolean(libraryPassState?.salesEnabled);
    const hasFullAccess = Boolean(libraryPassState?.canViewFullLibrary);
    const hasEntitlement = Boolean(libraryPassState?.hasActiveEntitlement);
    const isOwner = Boolean(libraryPassState?.isOwner);
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

    return {
      state: libraryPassState,
      loadStatus,
      loadError,
      previewCount,
      panel: {
        shouldShow:
          passRequired ||
          hasEntitlement ||
          loadStatus === "error",
        loading: loadStatus === "loading",
        loadError,
        statusLabel,
        priceLabel: formatCoins(priceCoins),
        eligibleImageCount,
        publicPreviewCount: previewCount,
        includesFutureAdditions: Boolean(
          libraryPassState?.includesFutureAdditions
        ),
        hasFullAccess,
        showAction: passRequired && !hasFullAccess,
        actionLabel,
        actionDisabled: false,
        salesEnabled,
      },
      modal: {
        isOpen: purchaseOpen,
        title: "Unlock the Extended Image Library",
        priceCoins,
        priceLabel: formatCoins(priceCoins),
        balanceLabel:
          accountStatus === "loading" || purchaseStatus === "loading_balance"
            ? "Loading..."
            : formatCoins(coinBalance),
        eligibleImageCount,
        publicPreviewCount: previewCount,
        includesFutureAdditions: Boolean(
          libraryPassState?.includesFutureAdditions
        ),
        isBusy,
        canConfirm: canPurchase && !isBusy && !knownInsufficientBalance,
        confirmLabel:
          purchaseStatus === "submitting"
            ? "Unlocking..."
            : !canPurchase
              ? actionLabel
              : `Unlock for ${formatCoins(priceCoins)}`,
        unavailableMessage: !canPurchase
          ? purchaseUnavailableMessage
          : knownInsufficientBalance
            ? `You need ${formatCoins(priceCoins)}, but your current balance is ${formatCoins(
                coinBalance
              )}.`
            : "",
        statusMessage: purchaseOpen ? purchaseMessage : "",
        statusTone: purchaseMessageTone,
      },
      message: purchaseOpen ? "" : purchaseMessage,
      messageTone: purchaseMessageTone,
      onOpenPurchase: openPurchase,
      onClosePurchase: closePurchase,
      onConfirmPurchase: submitPurchase,
      onRefreshState: refreshLibraryPassState,
    };
  }, [
    accountStatus,
    canPurchase,
    closePurchase,
    coinBalance,
    eligibleImageCount,
    isBusy,
    knownInsufficientBalance,
    libraryPassState,
    loadError,
    loadStatus,
    openPurchase,
    previewCount,
    priceCoins,
    purchaseMessage,
    purchaseMessageTone,
    purchaseOpen,
    purchaseStatus,
    purchaseUnavailableMessage,
    refreshLibraryPassState,
    submitPurchase,
    viewerSignedIn,
  ]);
}
