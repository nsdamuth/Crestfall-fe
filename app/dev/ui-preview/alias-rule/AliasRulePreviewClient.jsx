"use client";

import { useState } from "react";

import AliasRuleModalView from "@/components/studio/create/npc-registry/alias-rule/AliasRuleModal.view";
import {
  aliasRuleEmptyFixture,
  aliasRuleLongContentFixture,
  aliasRuleNoEntriesFixture,
  aliasRulePopulatedFixture,
} from "@/components/studio/create/npc-registry/alias-rule/AliasRuleModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: aliasRulePopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: aliasRuleEmptyFixture,
  },
  noEntries: {
    label: "No NPC Entries",
    props: aliasRuleNoEntriesFixture,
  },
  longContent: {
    label: "Long Content",
    props: aliasRuleLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    identityOptions: (fixture.identityOptions || []).map((option) => ({
      ...option,
    })),
  };
}

export default function AliasRulePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [previewProps, setPreviewProps] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No NPC Registry is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function chooseTrueIdentity(identityId) {
    const identity = previewProps?.identityOptions?.find(
      (option) => option.id === identityId
    );

    setPreviewProps((current) => ({
      ...current,
      selectedIdentityId: identityId,
    }));
    setLastAction(
      `Selected ${identity?.label || "an NPC"}. This was fixture-only.`
    );
  }

  function changePublicIdentity(value) {
    setPreviewProps((current) => ({
      ...current,
      publicIdentityValue: value,
    }));
    setLastAction("Changed the fixture alias. Nothing was saved.");
  }

  function changeRule(value) {
    setPreviewProps((current) => ({
      ...current,
      ruleValue: value,
    }));
    setLastAction("Changed the fixture rule. Nothing was saved.");
  }

  function savePreview() {
    setLastAction(
      `Simulated saving ${previewProps?.publicIdentityValue || "an alias rule"}. No application data changed.`
    );
  }

  function closePreview() {
    setActiveStateKey(null);
    setPreviewProps(null);
    setLastAction("Modal closed. No NPC Registry data changed.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Alias Rule Modal</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load, change, or save an NPC Registry.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready identity options and semantic alias
            fields. NPC registry draft keys and save behavior remain in the
            ViewModel and its live callers.
          </p>
        </section>
      </div>

      {previewProps ? (
        <AliasRuleModalView
          {...previewProps}
          onClose={closePreview}
          onChooseTrueIdentity={chooseTrueIdentity}
          onChangePublicIdentity={changePublicIdentity}
          onChangeRule={changeRule}
          onSave={savePreview}
        />
      ) : null}
    </main>
  );
}
