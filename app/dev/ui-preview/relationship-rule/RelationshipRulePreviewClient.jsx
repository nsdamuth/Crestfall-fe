"use client";

import { useState } from "react";

import RelationshipModalView from "@/components/studio/create/npc-registry/relationship-rule/RelationshipModal.view";
import {
  relationshipDirectionalFixture,
  relationshipEmptyFixture,
  relationshipLongContentFixture,
  relationshipNoEntriesFixture,
  relationshipPopulatedFixture,
} from "@/components/studio/create/npc-registry/relationship-rule/RelationshipModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: relationshipPopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: relationshipEmptyFixture,
  },
  directional: {
    label: "Directional",
    props: relationshipDirectionalFixture,
  },
  noEntries: {
    label: "No NPC Entries",
    props: relationshipNoEntriesFixture,
  },
  longContent: {
    label: "Long Content",
    props: relationshipLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    identityOptions: (fixture.identityOptions || []).map((option) => ({
      ...option,
    })),
    directionOptions: (fixture.directionOptions || []).map((option) => ({
      ...option,
    })),
    strengthOptions: (fixture.strengthOptions || []).map((option) => ({
      ...option,
    })),
  };
}

export default function RelationshipRulePreviewClient() {
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

  function chooseSourceIdentity(identityId) {
    setPreviewProps((current) => ({
      ...current,
      selectedSourceIdentityId: identityId,
    }));
    setLastAction("Changed the fixture source NPC. Nothing was saved.");
  }

  function chooseTargetIdentity(identityId) {
    setPreviewProps((current) => ({
      ...current,
      selectedTargetIdentityId: identityId,
    }));
    setLastAction("Changed the fixture target NPC. Nothing was saved.");
  }

  function changeRelationshipType(value) {
    setPreviewProps((current) => ({
      ...current,
      relationshipTypeValue: value,
    }));
    setLastAction("Changed the fixture relationship type. Nothing was saved.");
  }

  function chooseDirection(directionId) {
    setPreviewProps((current) => ({
      ...current,
      selectedDirectionId: directionId,
    }));
    setLastAction(`Selected ${directionId}. This changed fixture state only.`);
  }

  function chooseStrength(strengthId) {
    setPreviewProps((current) => ({
      ...current,
      selectedStrengthId: strengthId,
    }));
    setLastAction(`Selected ${strengthId}. This changed fixture state only.`);
  }

  function changeRelationshipRule(value) {
    setPreviewProps((current) => ({ ...current, ruleValue: value }));
    setLastAction("Changed the fixture relationship rule. Nothing was saved.");
  }

  function savePreview() {
    setLastAction(
      `Simulated saving ${previewProps?.relationshipTypeValue || "a relationship"}. No application data changed.`
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
          <h1 className="mt-2 font-display text-4xl">
            Relationship Rule Modal
          </h1>
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
            The View receives display-ready identities, direction and strength
            choices, and semantic actions. NPC registry draft keys and save
            behavior remain in the ViewModel and its live callers.
          </p>
        </section>
      </div>

      {previewProps ? (
        <RelationshipModalView
          {...previewProps}
          onClose={closePreview}
          onChooseSourceIdentity={chooseSourceIdentity}
          onChooseTargetIdentity={chooseTargetIdentity}
          onChangeRelationshipType={changeRelationshipType}
          onChooseDirection={chooseDirection}
          onChooseStrength={chooseStrength}
          onChangeRelationshipRule={changeRelationshipRule}
          onSave={savePreview}
        />
      ) : null}
    </main>
  );
}
