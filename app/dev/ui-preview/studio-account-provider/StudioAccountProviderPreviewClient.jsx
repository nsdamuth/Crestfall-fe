"use client";

import { useCallback, useState } from "react";

import {
  StudioAccountProvider,
  useStudioAccount,
} from "@/components/studio/StudioAccountProvider";
import {
  studioAccountErrorFixture,
  studioAccountLoadedFixture,
  studioAccountMergeFixture,
} from "@/components/studio/studio-account-provider/StudioAccountProvider.fixtures";

function AccountContextInspector() {
  const {
    accountProfile,
    coinBalance,
    accountStatus,
    accountError,
    refreshAccount,
    mergeAccountSnapshot,
    setCoinBalanceFromServer,
  } = useStudioAccount();

  return (
    <section className="space-y-5 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/70 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Status</p>
          <p className="mt-2 text-lg text-[var(--foreground)]">{accountStatus}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Coins</p>
          <p className="mt-2 text-lg text-[var(--foreground)]">
            {coinBalance.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Profile</p>
          <p className="mt-2 text-lg text-[var(--foreground)]">
            {accountProfile?.display_name || "No profile loaded"}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            @{accountProfile?.username || "unknown"}
          </p>
        </div>
      </div>

      {accountError ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {accountError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => refreshAccount().catch(() => {})}
          className="rounded-lg border border-[var(--muted-gold)]/40 px-4 py-2 text-sm text-[var(--foreground)]"
        >
          Refresh fixture
        </button>
        <button
          type="button"
          onClick={() => mergeAccountSnapshot(studioAccountMergeFixture)}
          className="rounded-lg border border-[var(--muted-gold)]/40 px-4 py-2 text-sm text-[var(--foreground)]"
        >
          Merge snapshot
        </button>
        <button
          type="button"
          onClick={() => setCoinBalanceFromServer(22000)}
          className="rounded-lg border border-[var(--muted-gold)]/40 px-4 py-2 text-sm text-[var(--foreground)]"
        >
          Apply server balance
        </button>
      </div>
    </section>
  );
}

export default function StudioAccountProviderPreviewClient() {
  const [mode, setMode] = useState("success");
  const [providerKey, setProviderKey] = useState(0);

  const loadAccount = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (mode === "error") {
      throw new Error(studioAccountErrorFixture.message);
    }

    return studioAccountLoadedFixture;
  }, [mode]);

  function selectMode(nextMode) {
    setMode(nextMode);
    setProviderKey((value) => value + 1);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Studio Account Provider</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Fixture-driven account loading, refresh, profile merge, balance sync,
            and error-state behavior through the production context API.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => selectMode("success")}
            className="rounded-lg border border-[var(--muted-gold)]/40 px-4 py-2 text-sm"
          >
            Loaded fixture
          </button>
          <button
            type="button"
            onClick={() => selectMode("error")}
            className="rounded-lg border border-[var(--muted-gold)]/40 px-4 py-2 text-sm"
          >
            Error fixture
          </button>
        </div>

        <StudioAccountProvider key={providerKey} loadAccount={loadAccount}>
          <AccountContextInspector />
        </StudioAccountProvider>
      </div>
    </main>
  );
}
