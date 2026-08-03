"use client";

import { useEffect, useMemo, useState } from "react";

import NpcRegistryFieldsSectionView from "@/components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view";
import {
  npcRegistryFieldsAliasesFixture,
  npcRegistryFieldsBlockedRelationshipFixture,
  npcRegistryFieldsEmptyFixture,
  npcRegistryFieldsEntriesFixture,
  npcRegistryFieldsKnowledgeFixture,
  npcRegistryFieldsLoadErrorFixture,
  npcRegistryFieldsOverviewFixture,
  npcRegistryFieldsRelationshipsFixture,
} from "@/components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.fixtures";

const PREVIEW_STATES = {
  overview: { label: "Overview", props: npcRegistryFieldsOverviewFixture },
  entries: { label: "Entries", props: npcRegistryFieldsEntriesFixture },
  relationships: {
    label: "Relationships",
    props: npcRegistryFieldsRelationshipsFixture,
  },
  knowledge: {
    label: "Knowledge",
    props: npcRegistryFieldsKnowledgeFixture,
  },
  aliases: { label: "Aliases", props: npcRegistryFieldsAliasesFixture },
  empty: { label: "Empty", props: npcRegistryFieldsEmptyFixture },
  blocked: {
    label: "Blocked Action",
    props: npcRegistryFieldsBlockedRelationshipFixture,
  },
  loadError: {
    label: "Load Error",
    props: npcRegistryFieldsLoadErrorFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    cards: fixture.cards.map((card) => ({ ...card })),
  };
}

export default function NpcRegistryFieldsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("overview");
  const activeState = PREVIEW_STATES[activeStateKey];
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.overview.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const interactiveProps = useMemo(() => {
    const updateField = (fieldName, label) => (value) => {
      setViewProps((current) => ({ ...current, [fieldName]: value }));
      setFeedback(`${label} updated.`);
    };

    return {
      ...viewProps,
      cards: viewProps.cards.map((card) => ({
        ...card,
        onEdit: () => setFeedback(`Edit ${card.title}.`),
        onDelete: () => setFeedback(`Delete ${card.title}.`),
      })),
      onChangeRegistryTitle: updateField(
        "registryTitleValue",
        "Registry title"
      ),
      onChangeScope: updateField("scopeValue", "Scope"),
      onChangeDescription: updateField("descriptionValue", "Description"),
      onPrimaryAction: () =>
        setFeedback(`${viewProps.primaryActionLabel || "Action"} selected.`),
    };
  }, [viewProps]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            NPC Registry Fields Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable NPC Registry edit tabs without
            loading Creations, opening application modals, or mutating a saved
            registry.
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
                onClick={() => setActiveStateKey(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {feedback}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
          <NpcRegistryFieldsSectionView {...interactiveProps} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain normalized metadata, cards, counts, disabled
            states, and semantic callbacks. Registry storage and modal state
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
