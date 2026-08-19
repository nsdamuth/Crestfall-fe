"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchCreationLibraryPassState,
  setCreationLibraryPassSalesEnabled,
} from "@/lib/client/studio/creations/libraryPassClient";

function formatCoinAmount(value) {
  const amount = Number.parseInt(value, 10);
  return new Intl.NumberFormat("en-US").format(
    Number.isFinite(amount) ? amount : 0
  );
}

export function projectCreationLibraryPassOwnerPanel({
  state,
  loadStatus = "idle",
  message = "",
  messageTone = "info",
  actionBusy = false,
  publicPreviewFallback = 4,
} = {}) {
  const normalizedState = state || {};
  const currentTier = normalizedState.currentTier || "STANDARD";
  const salesEnabled = Boolean(normalizedState.salesEnabled);
  const offerExists = Boolean(normalizedState.offerExists);
  const creationIsPublicLive = Boolean(
    normalizedState.creationIsPublicLive
  );
  const currentPriceCoins =
    Number.parseInt(normalizedState.currentPriceCoins, 10) || 0;
  const creatorRewardCoins =
    Number.parseInt(normalizedState.creatorRewardCoins, 10) || 0;
  const eligibleImageCount =
    Number.parseInt(normalizedState.eligibleImageCount, 10) || 0;
  const publicPreviewCount =
    Number.parseInt(normalizedState.publicPreviewCount, 10) ||
    publicPreviewFallback;
  const expandedThreshold =
    Number.parseInt(normalizedState.expandedThreshold, 10) || 0;

  return {
    loadStatus,
    message,
    messageTone,
    isLoading: loadStatus === "loading",
    isBusy: actionBusy,
    offerExists,
    salesEnabled,
    creationIsPublicLive,
    currentTier,
    currentPriceCoins,
    currentPriceLabel: `${formatCoinAmount(currentPriceCoins)} coins`,
    creatorRewardCoins,
    creatorRewardLabel: `${formatCoinAmount(creatorRewardCoins)} coins`,
    eligibleImageCount,
    publicPreviewCount,
    expandedThreshold,
    includesFutureAdditions:
      normalizedState.includesFutureAdditions !== false,
    statusLabel: salesEnabled
      ? "Sales active"
      : "Sales paused",
    actionLabel: salesEnabled
      ? "Pause New Sales"
      : "Resume Library Pass Sales",
    actionDisabled:
      loadStatus !== "ready" ||
      actionBusy ||
      !creationIsPublicLive ||
      !normalizedState.isOwner,
  };
}

export function useCreationLibraryPassOwnerViewModel({
  creationId,
  publicPreviewFallback = 4,
} = {}) {
  const [state, setState] = useState(null);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");
  const [actionBusy, setActionBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!creationId) {
      setState(null);
      setLoadStatus("idle");
      return null;
    }

    setLoadStatus("loading");
    setMessage("");
    setMessageTone("info");

    try {
      const nextState = await fetchCreationLibraryPassState(creationId);
      setState(nextState);
      setLoadStatus("ready");
      return nextState;
    } catch (error) {
      setLoadStatus("error");
      setMessageTone("error");
      setMessage(
        error?.message || "Library Pass settings could not be loaded."
      );
      return null;
    }
  }, [creationId]);

  useEffect(() => {
    let cancelled = false;

    if (!creationId) {
      setState(null);
      setLoadStatus("idle");
      return undefined;
    }

    setLoadStatus("loading");
    setMessage("");
    setMessageTone("info");

    fetchCreationLibraryPassState(creationId)
      .then((nextState) => {
        if (cancelled) return;
        setState(nextState);
        setLoadStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadStatus("error");
        setMessageTone("error");
        setMessage(
          error?.message || "Library Pass settings could not be loaded."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [creationId]);

  const onToggleSales = useCallback(async () => {
    if (!creationId || !state || actionBusy) return null;

    const nextSalesEnabled = !state.salesEnabled;
    setActionBusy(true);
    setMessage("");
    setMessageTone("info");

    try {
      const nextState = await setCreationLibraryPassSalesEnabled(
        creationId,
        nextSalesEnabled
      );

      setState(nextState);
      setLoadStatus("ready");
      setMessageTone("success");
      setMessage(
        nextSalesEnabled
          ? "Library Pass sales enabled."
          : "New Library Pass sales paused. Existing purchasers keep access."
      );
      return nextState;
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error?.message || "Library Pass sales could not be updated."
      );
      return null;
    } finally {
      setActionBusy(false);
    }
  }, [creationId, state, actionBusy]);

  const panel = useMemo(
    () =>
      projectCreationLibraryPassOwnerPanel({
        state,
        loadStatus,
        message,
        messageTone,
        actionBusy,
        publicPreviewFallback,
      }),
    [
      state,
      loadStatus,
      message,
      messageTone,
      actionBusy,
      publicPreviewFallback,
    ]
  );

  return {
    panel,
    reload,
    onToggleSales,
  };
}
