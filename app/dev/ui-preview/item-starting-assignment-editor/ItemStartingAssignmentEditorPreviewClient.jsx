"use client";

import { useState } from "react";

import ItemStartingAssignmentEditorView from "@/components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.view";
import {
  itemStartingAssignmentCharacterFixture,
  itemStartingAssignmentLegacyFixture,
  itemStartingAssignmentPickerFixtures,
  itemStartingAssignmentStoryFixture,
  itemStartingAssignmentUnassignedFixture,
} from "@/components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.fixtures";
import { useItemStartingAssignmentEditorViewModel } from "@/components/studio/registries/item-starting-assignment-editor/useItemStartingAssignmentEditorViewModel";

const PREVIEW_STATES = Object.freeze({
  unassigned: {
    label: "Unassigned",
    entry: itemStartingAssignmentUnassignedFixture,
  },
  story: {
    label: "Story Inventory",
    entry: itemStartingAssignmentStoryFixture,
  },
  character: {
    label: "Character + Placement",
    entry: itemStartingAssignmentCharacterFixture,
  },
  legacy: {
    label: "Legacy Location",
    entry: itemStartingAssignmentLegacyFixture,
  },
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function PreviewHolderPicker({
  allowedTypes = [],
  selectedCreationIds = [],
  onSelect = null,
  onClose = null,
} = {}) {
  const options = allowedTypes.flatMap(
    (type) => itemStartingAssignmentPickerFixtures[type] || []
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--muted-gold)]/25 bg-[#0d0b09] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Holder Picker
            </p>
            <h2 className="mt-2 font-display text-3xl">Fixture Creations</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              This local picker exercises the Chassis selection contract without
              loading production Creations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {options.map((creation) => {
            const selected = selectedCreationIds.includes(creation.id);
            return (
              <button
                key={creation.id}
                type="button"
                onClick={() => onSelect?.(creation)}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-[var(--muted-gold)]/35"
              >
                <span>
                  <span className="block font-display text-2xl">
                    {creation.title}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {creation.type.replaceAll("_", " ")}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                  {selected ? "Selected" : "Choose"}
                </span>
              </button>
            );
          })}

          {!options.length ? (
            <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-[var(--muted)]">
              Change the holder type to Character, Player Character, or Location
              before opening the picker.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PreviewEditor({ entry, onChange }) {
  const { viewProps, applicationContentProps } =
    useItemStartingAssignmentEditorViewModel({ entry, onChange });

  const pickerSlot = applicationContentProps.isPickerOpen ? (
    <PreviewHolderPicker
      allowedTypes={applicationContentProps.pickerAllowedTypes}
      selectedCreationIds={applicationContentProps.selectedCreationIds}
      onSelect={applicationContentProps.onSelectCreation}
      onClose={applicationContentProps.onClosePicker}
    />
  ) : null;

  return (
    <ItemStartingAssignmentEditorView
      {...viewProps}
      pickerSlot={pickerSlot}
    />
  );
}

export default function ItemStartingAssignmentEditorPreviewClient() {
  const [activeKey, setActiveKey] = useState("character");
  const [entry, setEntry] = useState(() =>
    clone(PREVIEW_STATES.character.entry)
  );
  const [lastPayload, setLastPayload] = useState(null);

  function selectState(nextKey) {
    const safeKey = PREVIEW_STATES[nextKey] ? nextKey : "character";
    setActiveKey(safeKey);
    setEntry(clone(PREVIEW_STATES[safeKey].entry));
    setLastPayload(null);
  }

  function handleChange(startingAssignment) {
    setEntry((current) => ({
      ...current,
      startingAssignment,
    }));
    setLastPayload(startingAssignment);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Item Starting Assignment Editor
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercise holder changes, local Creation selection, explicit nested
            placement, ordering, blank-row cleanup, and legacy normalization
            without fetching or persisting Item Registry data.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview State
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([key, state]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectState(key)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeKey === key
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                Item Entry
              </p>
              <h2 className="mt-2 font-display text-3xl">{entry.name}</h2>
            </div>

            <PreviewEditor entry={entry} onChange={handleChange} />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Last normalized assignment
            </p>
            <pre className="mt-4 max-h-[700px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[var(--muted)]">
              {lastPayload
                ? JSON.stringify(lastPayload, null, 2)
                : "Change the holder or placement settings to inspect the normalized startingAssignment payload."}
            </pre>
          </aside>
        </section>
      </div>
    </main>
  );
}
