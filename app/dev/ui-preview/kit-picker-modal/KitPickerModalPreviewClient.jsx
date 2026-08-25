"use client";

import { useState } from "react";

import KitPickerModal from "@/components/kit/KitPickerModal";
import {
  kitPickerModalEmptyFixture,
  kitPickerModalErrorFixture,
  kitPickerModalLoadingFixture,
  kitPickerModalLongestRowsFixture,
  kitPickerModalMultiSelectedFixture,
  kitPickerModalSearchingFixture,
  kitPickerModalSingleFixture,
} from "@/components/kit/picker-modal/KitPickerModal.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  single: { label: "Single select", props: kitPickerModalSingleFixture },
  multi: { label: "Multi with selections", props: kitPickerModalMultiSelectedFixture },
  searching: { label: "Searching", props: kitPickerModalSearchingFixture },
  empty: { label: "Empty", props: kitPickerModalEmptyFixture },
  loading: { label: "Loading (load more)", props: kitPickerModalLoadingFixture },
  error: { label: "Error", props: kitPickerModalErrorFixture },
  longest: { label: "Longest rows", props: kitPickerModalLongestRowsFixture },
};

export default function KitPickerModalPreviewClient() {
  const [openKey, setOpenKey] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [note, setNote] = useState("Choose a fixture to open the picker.");

  const active = openKey ? STATES[openKey] : null;

  function openState(key) {
    setOpenKey(key);
    setSelectedIds(STATES[key].props.selectedIds);
    setNote(`Opened the ${STATES[key].label} fixture.`);
  }

  function toggleItem(id) {
    if (!active?.props.isMultiSelect) {
      setNote(`Chose ${id}, confirmed and closed.`);
      setOpenKey(null);
      return;
    }
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  }

  function confirm() {
    setNote(`Confirmed with ${selectedIds.length} selected.`);
    setOpenKey(null);
  }

  function close() {
    setNote("Closed.");
    setOpenKey(null);
  }

  return (
    <KitPreviewShell
      title="Kit Picker Modal"
      description="The shared searchable picker: search field, optional filter chip row, rows or a tile grid, single and multi select, sticky footer with the count in words plus Confirm and Cancel."
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
            className="cf-btn cf-btn--secondary"
          >
            Open {state.label}
          </button>
        ))}
      </div>

      {active && (
        <KitPickerModal
          {...active.props}
          selectedIds={selectedIds}
          onToggleItem={toggleItem}
          onConfirm={confirm}
          onClose={close}
        />
      )}
    </KitPreviewShell>
  );
}
