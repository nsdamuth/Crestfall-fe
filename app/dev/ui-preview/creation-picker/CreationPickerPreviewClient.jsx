"use client";

import { useState } from "react";

import CreationPickerView from "@/components/studio/creation-picker/creation-picker/CreationPicker.view";
import {
  creationPickerDefaultFixture,
  creationPickerEmptyFixture,
  creationPickerErrorFixture,
  creationPickerFilteredAdventuresFixture,
  creationPickerFilteredCharactersFixture,
  creationPickerFilteredLooksFixture,
  creationPickerFilteredMoreFixture,
  creationPickerFilteredStoriesFixture,
  creationPickerFilteredWorldsFixture,
  creationPickerLongestFixture,
  creationPickerNoResultsFixture,
  creationPickerSearchingFixture,
} from "@/components/studio/creation-picker/creation-picker/CreationPicker.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: creationPickerDefaultFixture },
  empty: { label: "Empty vault", props: creationPickerEmptyFixture },
  searching: { label: "Searching", props: creationPickerSearchingFixture },
  noResults: { label: "No results", props: creationPickerNoResultsFixture },
  error: { label: "Error", props: creationPickerErrorFixture },
  longest: { label: "Longest", props: creationPickerLongestFixture },
  characters: { label: "Filtered: Characters", props: creationPickerFilteredCharactersFixture },
  worlds: { label: "Filtered: Worlds", props: creationPickerFilteredWorldsFixture },
  looks: { label: "Filtered: Looks", props: creationPickerFilteredLooksFixture },
  stories: { label: "Filtered: Stories", props: creationPickerFilteredStoriesFixture },
  adventures: { label: "Filtered: Adventures", props: creationPickerFilteredAdventuresFixture },
  more: { label: "Filtered: More", props: creationPickerFilteredMoreFixture },
};

export default function CreationPickerPreviewClient() {
  const [openKey, setOpenKey] = useState(null);
  const [note, setNote] = useState("Choose a fixture to open the picker.");

  const active = openKey ? STATES[openKey] : null;

  function openState(key) {
    setOpenKey(key);
    setNote(`Opened the ${STATES[key].label} fixture.`);
  }

  function close() {
    setNote("Closed.");
    setOpenKey(null);
  }

  return (
    <KitPreviewShell
      title="Creation Picker"
      description="The mini-vault: search, five bucket chips plus More, a recency/A-Z sort chip, a tile grid of owned creations, single-select confirms on tap."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={openKey}
      onSelectState={openState}
      note={note}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {Object.entries(STATES).map(([key, state]) => (
          <button
            key={key}
            type="button"
            onClick={() => openState(key)}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            Open {state.label}
          </button>
        ))}
      </div>

      {active && (
        <CreationPickerView
          {...active.props}
          onToggleItem={(id) => {
            setNote(`Chose ${id}, confirmed and closed.`);
            setOpenKey(null);
          }}
          onConfirm={close}
          onClose={close}
          onCreateNew={() => {
            setNote("Create new fired from the empty state.");
            setOpenKey(null);
          }}
        />
      )}
    </KitPreviewShell>
  );
}
