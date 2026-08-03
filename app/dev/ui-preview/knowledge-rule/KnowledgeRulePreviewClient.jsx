"use client";

import { useState } from "react";

import KnowledgeRuleModalView from "@/components/studio/create/npc-registry/knowledge-rule/KnowledgeRuleModal.view";
import {
  knowledgeRuleEmptyFixture,
  knowledgeRuleFalseBeliefFixture,
  knowledgeRuleLongContentFixture,
  knowledgeRuleNoEntriesFixture,
  knowledgeRulePopulatedFixture,
} from "@/components/studio/create/npc-registry/knowledge-rule/KnowledgeRuleModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: knowledgeRulePopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: knowledgeRuleEmptyFixture,
  },
  noEntries: {
    label: "No NPC Entries",
    props: knowledgeRuleNoEntriesFixture,
  },
  falseBelief: {
    label: "False Belief",
    props: knowledgeRuleFalseBeliefFixture,
  },
  longContent: {
    label: "Long Content",
    props: knowledgeRuleLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    knowledgeLevelOptions: (fixture.knowledgeLevelOptions || []).map(
      (option) => ({ ...option })
    ),
    identityOptions: (fixture.identityOptions || []).map((option) => ({
      ...option,
    })),
    knownByIdentityIds: [...(fixture.knownByIdentityIds || [])],
    suspectedByIdentityIds: [...(fixture.suspectedByIdentityIds || [])],
  };
}

function toggleId(ids, identityId) {
  return ids.includes(identityId)
    ? ids.filter((id) => id !== identityId)
    : [...ids, identityId];
}

export default function KnowledgeRulePreviewClient() {
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

  function changeKnowledgeTopic(value) {
    setPreviewProps((current) => ({ ...current, knowledgeTopicValue: value }));
    setLastAction("Changed the fixture subject. Nothing was saved.");
  }

  function chooseDefaultKnowledge(knowledgeLevelId) {
    setPreviewProps((current) => ({
      ...current,
      selectedKnowledgeLevelId: knowledgeLevelId,
    }));
    setLastAction(
      `Selected ${knowledgeLevelId}. This changed fixture state only.`
    );
  }

  function toggleKnownIdentity(identityId) {
    setPreviewProps((current) => ({
      ...current,
      knownByIdentityIds: toggleId(
        current.knownByIdentityIds || [],
        identityId
      ),
    }));
    setLastAction("Toggled a Known By identity. Nothing was saved.");
  }

  function toggleSuspectedIdentity(identityId) {
    setPreviewProps((current) => ({
      ...current,
      suspectedByIdentityIds: toggleId(
        current.suspectedByIdentityIds || [],
        identityId
      ),
    }));
    setLastAction("Toggled a Suspected By identity. Nothing was saved.");
  }

  function changeFalseBeliefNotes(value) {
    setPreviewProps((current) => ({
      ...current,
      falseBeliefValue: value,
    }));
    setLastAction("Changed the fixture false-belief notes. Nothing was saved.");
  }

  function changeKnowledgeNotes(value) {
    setPreviewProps((current) => ({ ...current, notesValue: value }));
    setLastAction("Changed the fixture knowledge notes. Nothing was saved.");
  }

  function savePreview() {
    setLastAction(
      `Simulated saving ${previewProps?.knowledgeTopicValue || "a knowledge rule"}. No application data changed.`
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
            Knowledge Rule Modal
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
            The View receives display-ready identity and knowledge-level
            options with semantic actions. NPC registry draft keys and save
            behavior remain in the ViewModel and its live callers.
          </p>
        </section>
      </div>

      {previewProps ? (
        <KnowledgeRuleModalView
          {...previewProps}
          onClose={closePreview}
          onChangeKnowledgeTopic={changeKnowledgeTopic}
          onChooseDefaultKnowledge={chooseDefaultKnowledge}
          onToggleKnownIdentity={toggleKnownIdentity}
          onToggleSuspectedIdentity={toggleSuspectedIdentity}
          onChangeFalseBeliefNotes={changeFalseBeliefNotes}
          onChangeKnowledgeNotes={changeKnowledgeNotes}
          onSave={savePreview}
        />
      ) : null}
    </main>
  );
}
