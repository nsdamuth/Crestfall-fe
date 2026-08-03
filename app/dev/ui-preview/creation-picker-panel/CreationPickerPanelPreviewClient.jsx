"use client";

import { useState } from "react";

import CreationPickerPanelView from "@/components/studio/creations/pickers/creation-picker-panel/CreationPickerPanel.view";
import {
  creationPickerPanelCustomGridFixture,
  creationPickerPanelDefaultFixture,
  creationPickerPanelEmptyFixture,
  creationPickerPanelImageFixture,
  creationPickerPanelLongContentFixture,
  creationPickerPanelSearchStressFixture,
  creationPickerPanelWithActionsFixture,
} from "@/components/studio/creations/pickers/creation-picker-panel/CreationPickerPanel.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: creationPickerPanelDefaultFixture,
  },
  withActions: {
    label: "Action Slot",
    props: creationPickerPanelWithActionsFixture,
  },
  image: {
    label: "Image Card",
    props: creationPickerPanelImageFixture,
  },
  searchStress: {
    label: "Search Stress",
    props: creationPickerPanelSearchStressFixture,
  },
  empty: {
    label: "Empty",
    props: creationPickerPanelEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: creationPickerPanelLongContentFixture,
  },
  customGrid: {
    label: "Custom Grid",
    props: creationPickerPanelCustomGridFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    items: fixture.items.map((item) => ({ ...item })),
    selectedIds: [...fixture.selectedIds],
    disabledIds: [...fixture.disabledIds],
    recommendedIds: [...fixture.recommendedIds],
  };
}

export default function CreationPickerPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [panelProps, setPanelProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No creation workflow is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];
    const nextProps = cloneFixture(nextState.props);

    if (stateKey === "withActions") {
      nextProps.actions = (
        <button
          type="button"
          onClick={() => setLastAction("Triggered the local action slot.")}
          className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]"
        >
          Preview Action
        </button>
      );
    }

    setActiveStateKey(stateKey);
    setPanelProps(nextProps);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function chooseItem(item) {
    if (!item?.id) return;

    setPanelProps((current) => {
      const selected = new Set(current.selectedIds);

      if (selected.has(item.id)) selected.delete(item.id);
      else selected.add(item.id);

      return {
        ...current,
        selectedIds: [...selected],
      };
    });
    setLastAction(`Toggled ${item.title || item.id} in local preview state.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Creation Picker Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the shared portable View directly from
            contract-shaped fixtures. Search, selection, and action-slot
            behavior is local only; no Story, registry, ingredient, or creation
            workflow is connected.
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
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
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
          <CreationPickerPanelView
            {...panelProps}
            onSelect={chooseItem}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain generic display items, visual status IDs, optional
            action-slot content, layout classes, and semantic selection intent.
            Picker ownership, registry mutations, Image Studio behavior, APIs,
            permissions, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
