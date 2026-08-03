"use client";

import { useState } from "react";

import StructuredRegistryBuilderView from "@/components/studio/create/structured-registry/structured-registry-builder/StructuredRegistryBuilder.view";
import {
  structuredRegistryBuilderEditFixture,
  structuredRegistryBuilderEntriesFixture,
  structuredRegistryBuilderErrorFixture,
  structuredRegistryBuilderOverviewFixture,
  structuredRegistryBuilderPromptFixture,
  structuredRegistryBuilderRelationshipsFixture,
  structuredRegistryBuilderReviewFixture,
  structuredRegistryBuilderRulesFixture,
  structuredRegistryBuilderSavingFixture,
} from "@/components/studio/create/structured-registry/structured-registry-builder/StructuredRegistryBuilder.fixtures";

const STATES = [
  ["Overview", structuredRegistryBuilderOverviewFixture],
  ["Entries", structuredRegistryBuilderEntriesFixture],
  ["Relationships", structuredRegistryBuilderRelationshipsFixture],
  ["Rules", structuredRegistryBuilderRulesFixture],
  ["Prompt", structuredRegistryBuilderPromptFixture],
  ["Review", structuredRegistryBuilderReviewFixture],
  ["Edit Mode", structuredRegistryBuilderEditFixture],
  ["Saving", structuredRegistryBuilderSavingFixture],
  ["Error", structuredRegistryBuilderErrorFixture],
];

export default function StructuredRegistryBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeTab, setActiveTab] = useState(STATES[0][1].activeTab);
  const fixture = STATES[selectedState][1];

  function selectFixture(index) {
    setSelectedState(index);
    setActiveTab(STATES[index][1].activeTab);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development-only LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Structured Registry Builder
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture-driven Event Registry View. No creation API, router,
            database, or linked-creation catalogue is connected.
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

        <StructuredRegistryBuilderView
          {...fixture}
          activeTab={activeTab}
          tabs={fixture.tabs.map((tab) => ({
            ...tab,
            active: tab.id === activeTab,
          }))}
          onTitleChange={() => {}}
          onDescriptionChange={() => {}}
          onScopeChange={() => {}}
          onSelectTab={setActiveTab}
          onSelectEntry={() => {}}
          onAddEntry={() => {}}
          onUpdateEntry={() => {}}
          onEntryAliasesTextChange={() => {}}
          onDeleteEntry={() => {}}
          onOpenLinkPicker={() => {}}
          onRemoveLinkedCreation={() => {}}
          onLinkedCreationNotesChange={() => {}}
          onPromptGuidanceChange={() => {}}
          onSave={() => {}}
        />
      </div>
    </main>
  );
}
