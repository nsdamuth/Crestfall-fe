"use client";

import { useState } from "react";

import NpcRegistryBuilderView from "@/components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.view";
import {
  npcRegistryBuilderAliasesFixture,
  npcRegistryBuilderEntriesFixture,
  npcRegistryBuilderErrorFixture,
  npcRegistryBuilderKnowledgeFixture,
  npcRegistryBuilderOverviewFixture,
  npcRegistryBuilderRelationshipsFixture,
  npcRegistryBuilderSavingFixture,
} from "@/components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.fixtures";

const STATES = [
  ["Overview", npcRegistryBuilderOverviewFixture],
  ["Entries", npcRegistryBuilderEntriesFixture],
  ["Relationships", npcRegistryBuilderRelationshipsFixture],
  ["Knowledge", npcRegistryBuilderKnowledgeFixture],
  ["Aliases", npcRegistryBuilderAliasesFixture],
  ["Saving", npcRegistryBuilderSavingFixture],
  ["Error", npcRegistryBuilderErrorFixture],
];

function ModalPlaceholder({ title }) {
  return (
    <div className="fixed inset-x-6 bottom-6 z-10 mx-auto max-w-xl rounded-2xl border border-[var(--muted-gold)]/35 bg-black/95 p-5 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Application-owned slot
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">{title}</p>
    </div>
  );
}

export default function NpcRegistryBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeTab, setActiveTab] = useState(STATES[0][1].activeTab);
  const [modalTitle, setModalTitle] = useState("");
  const fixture = STATES[selectedState][1];

  function selectFixture(index) {
    setSelectedState(index);
    setActiveTab(STATES[index][1].activeTab);
    setModalTitle("");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development-only LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">NPC Registry Builder</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture-driven portable View. No creation API, database, Character
            catalogue, or saved NPC Registry is connected.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFixture(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <NpcRegistryBuilderView
          {...fixture}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onUpdateField={() => {}}
          onSaveRegistry={() => {}}
          onAddEntry={() => setModalTitle("NPC Entry Modal")}
          onEditEntry={() => setModalTitle("NPC Entry Modal")}
          onDeleteEntry={() => {}}
          onAddRelationship={() => setModalTitle("Relationship Modal")}
          onEditRelationship={() => setModalTitle("Relationship Modal")}
          onDeleteRelationship={() => {}}
          onAddKnowledgeRule={() => setModalTitle("Knowledge Rule Modal")}
          onEditKnowledgeRule={() => setModalTitle("Knowledge Rule Modal")}
          onDeleteKnowledgeRule={() => {}}
          onAddAliasRule={() => setModalTitle("Alias Rule Modal")}
          onEditAliasRule={() => setModalTitle("Alias Rule Modal")}
          onDeleteAliasRule={() => {}}
          entryModalContent={
            modalTitle ? <ModalPlaceholder title={modalTitle} /> : null
          }
        />
      </div>
    </main>
  );
}
