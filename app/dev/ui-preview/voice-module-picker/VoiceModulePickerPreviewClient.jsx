"use client";

import { useState } from "react";

import VoiceModulePickerModalView from "@/components/studio/create/character/voice-module-picker/VoiceModulePickerModal.view";
import {
  voiceModulePickerClosedFixture,
  voiceModulePickerEmptySelectionFixture,
  voiceModulePickerLongContentFixture,
  voiceModulePickerNoOptionsFixture,
  voiceModulePickerSelectedFixture,
} from "@/components/studio/create/character/voice-module-picker/VoiceModulePickerModal.fixtures";

const PREVIEW_STATES = {
  closed: {
    label: "Closed Trigger",
    props: voiceModulePickerClosedFixture,
  },
  selected: {
    label: "Selected Modules",
    props: voiceModulePickerSelectedFixture,
  },
  empty: {
    label: "No Selection",
    props: voiceModulePickerEmptySelectionFixture,
  },
  noOptions: {
    label: "No Options",
    props: voiceModulePickerNoOptionsFixture,
  },
  longContent: {
    label: "Long Content",
    props: voiceModulePickerLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    selectedItems: (fixture.selectedItems || []).map((item) => ({ ...item })),
    selectedIds: [...(fixture.selectedIds || [])],
    optionGroups: (fixture.optionGroups || []).map((group) => ({
      ...group,
      options: (group.options || []).map((option) => ({ ...option })),
    })),
  };
}

function findOption(optionGroups, moduleId) {
  for (const group of optionGroups) {
    const option = (group.options || []).find((item) => item.id === moduleId);
    if (option) return option;
  }

  return null;
}

export default function VoiceModulePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("closed");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(voiceModulePickerClosedFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall character is connected."
  );

  function loadState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Loaded the ${state.label} fixture.`);
  }

  function openPreview() {
    setPreviewProps((current) => ({ ...current, open: true }));
    setLastAction("Opened the fixture-only voice-module picker.");
  }

  function closePreview() {
    setPreviewProps((current) => ({ ...current, open: false }));
    setLastAction("Closed the fixture-only picker. No character data changed.");
  }

  function toggleModule(moduleId) {
    setPreviewProps((current) => {
      const selectedIds = new Set(current.selectedIds || []);

      if (selectedIds.has(moduleId)) {
        selectedIds.delete(moduleId);
      } else {
        selectedIds.add(moduleId);
      }

      const nextSelectedIds = [...selectedIds];
      const nextSelectedItems = nextSelectedIds.map((selectedId) => {
        const option = findOption(current.optionGroups, selectedId);

        return {
          id: selectedId,
          label: option?.label || selectedId,
        };
      });

      return {
        ...current,
        selectedIds: nextSelectedIds,
        selectedItems: nextSelectedItems,
        canClear: nextSelectedIds.length > 0,
      };
    });

    setLastAction(`Toggled ${moduleId}. This changed fixture state only.`);
  }

  function clearAll() {
    setPreviewProps((current) => ({
      ...current,
      selectedIds: [],
      selectedItems: [],
      canClear: false,
    }));
    setLastAction("Cleared fixture selections. No character data changed.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Voice Module Picker Modal
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract fixtures.
            It does not load or update a character.
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
                onClick={() => loadState(stateKey)}
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
            Interactive Trigger
          </p>
          <div className="mt-4 max-w-5xl">
            <VoiceModulePickerModalView
              {...previewProps}
              onOpen={openPreview}
              onClose={closePreview}
              onToggleModule={toggleModule}
              onClearAll={clearAll}
              onDone={closePreview}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready option groups, selected labels, and
            semantic actions. Crestfall voice-module constants, selected-ID
            normalization, and character form persistence remain outside the View.
          </p>
        </section>
      </div>
    </main>
  );
}
