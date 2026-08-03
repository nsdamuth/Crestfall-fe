"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchCurrentStudioAccount } from "@/lib/client/studio/profile/studioAccountClient";

export function normalizeStudioCoinBalance(value) {
  const balance = Number.parseInt(value, 10);

  return Number.isFinite(balance) ? Math.max(0, balance) : null;
}

export function getStudioAccountSnapshotProfile(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return {};
  }

  if (
    snapshot.profile &&
    typeof snapshot.profile === "object" &&
    !Array.isArray(snapshot.profile)
  ) {
    return snapshot.profile;
  }

  return snapshot;
}

export function getStudioAccountSnapshotCoinBalance(snapshot) {
  const profile = getStudioAccountSnapshotProfile(snapshot);

  return normalizeStudioCoinBalance(
    snapshot?.coinBalance ??
      snapshot?.coin_balance ??
      profile.coinBalance ??
      profile.coin_balance
  );
}

export function useStudioAccountProviderViewModel({
  loadAccount = fetchCurrentStudioAccount,
} = {}) {
  const [accountProfile, setAccountProfile] = useState(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const [accountStatus, setAccountStatus] = useState("idle");
  const [accountError, setAccountError] = useState("");

  const setCoinBalanceFromServer = useCallback((value) => {
    const normalizedBalance = normalizeStudioCoinBalance(value);

    if (normalizedBalance === null) return false;

    setCoinBalance(normalizedBalance);
    setAccountProfile((current) => ({
      ...(current || {}),
      coin_balance: normalizedBalance,
      coinBalance: normalizedBalance,
    }));

    return true;
  }, []);

  const mergeAccountSnapshot = useCallback((snapshot) => {
    const nextProfile = getStudioAccountSnapshotProfile(snapshot);
    const nextBalance = getStudioAccountSnapshotCoinBalance(snapshot);

    if (Object.keys(nextProfile).length) {
      setAccountProfile((current) => ({
        ...(current || {}),
        ...nextProfile,
      }));
    }

    if (nextBalance !== null) {
      setCoinBalance(nextBalance);
    }
  }, []);

  const refreshAccount = useCallback(async () => {
    setAccountStatus("loading");
    setAccountError("");

    try {
      const account = await loadAccount();

      setAccountProfile(account.profile || {});
      setCoinBalance(normalizeStudioCoinBalance(account.coinBalance) ?? 0);
      setAccountStatus("loaded");

      return account;
    } catch (error) {
      setAccountStatus("error");
      setAccountError(error?.message || "Studio account could not be loaded.");
      throw error;
    }
  }, [loadAccount]);

  useEffect(() => {
    refreshAccount().catch(() => {});
  }, [refreshAccount]);

  return useMemo(
    () => ({
      accountProfile,
      coinBalance,
      accountStatus,
      accountError,
      refreshAccount,
      mergeAccountSnapshot,
      setCoinBalanceFromServer,
    }),
    [
      accountProfile,
      coinBalance,
      accountStatus,
      accountError,
      refreshAccount,
      mergeAccountSnapshot,
      setCoinBalanceFromServer,
    ]
  );
}
