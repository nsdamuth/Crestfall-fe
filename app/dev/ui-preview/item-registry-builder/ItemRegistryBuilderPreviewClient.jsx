"use client";

import { useState } from "react";

import ItemRegistryBuilderView from "@/components/studio/create/item-registry/item-registry-builder/ItemRegistryBuilder.view";
import {
  itemRegistryBuilderAssociationsFixture,
  itemRegistryBuilderEntriesFixture,
  itemRegistryBuilderErrorFixture,
  itemRegistryBuilderOverviewFixture,
  itemRegistryBuilderPromptFixture,
  itemRegistryBuilderReviewFixture,
  itemRegistryBuilderSavingFixture,
  itemRegistryBuilderTrackingFixture,
} from "@/components/studio/create/item-registry/item-registry-builder/ItemRegistryBuilder.fixtures";

const STATES = [
  ["Overview", itemRegistryBuilderOverviewFixture],
  ["Entries", itemRegistryBuilderEntriesFixture],
  ["Associations", itemRegistryBuilderAssociationsFixture],
  ["Tracking", itemRegistryBuilderTrackingFixture],
  ["Prompt", itemRegistryBuilderPromptFixture],
  ["Review", itemRegistryBuilderReviewFixture],
  ["Saving", itemRegistryBuilderSavingFixture],
  ["Error", itemRegistryBuilderErrorFixture],
];

function AssignmentPlaceholder() {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-[var(--muted-gold)]/25 bg-black/25 p-4 text-sm text-[var(--muted)]">
      Application-owned starting holder and placement editor slot.
    </div>
  );
}

export default function ItemRegistryBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeTab, setActiveTab] = useState(STATES[0][1].activeTab);
  const fixture = STATES[selectedState][1];

  function selectFixture(index) {
    setSelectedState(index);
    setActiveTab(STATES[index][1].activeTab);
  }

  const assignmentSlots = Object.fromEntries(
    fixture.entries.map((entry) => [entry.id, <AssignmentPlaceholder key={entry.id} />])
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development-only LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Item Registry Builder</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture-driven portable View. No creation API, database, linked
            creation catalogue, or saved Item Registry is connected.
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

        <ItemRegistryBuilderView
          {...fixture}
          activeTab={activeTab}
          tabs={fixture.tabs.map((tab) => ({
            ...tab,
            active: tab.id === activeTab,
          }))}
          startingAssignmentContentByEntryId={assignmentSlots}
          onTitleChange={() => {}}
          onDescriptionChange={() => {}}
          onScopeChange={() => {}}
          onSelectTab={setActiveTab}
          onSelectEntry={() => {}}
          onAddEntry={() => {}}
          onUpdateEntry={() => {}}
          onUpdateEntryAliases={() => {}}
          onDeleteEntry={() => {}}
          onPromptGuidanceChange={() => {}}
          onSave={() => {}}
        />
      </div>
    </main>
  );
}
