"use client";

import { useState } from "react";

import StoryRoomRuntimeMechanicsPanelView from "@/components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.view";
import {
  storyRoomRuntimeMechanicsAttachedFixture,
  storyRoomRuntimeMechanicsBindingOwnerFixture,
  storyRoomRuntimeMechanicsEmptyFixture,
  storyRoomRuntimeMechanicsErrorFixture,
  storyRoomRuntimeMechanicsSavedFixture,
  storyRoomRuntimeMechanicsSavingFixture,
} from "@/components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.fixtures";

const PREVIEW_STATES = {
  empty: {
    label: "Empty",
    props: storyRoomRuntimeMechanicsEmptyFixture,
  },
  attached: {
    label: "Attached",
    props: storyRoomRuntimeMechanicsAttachedFixture,
  },
  bindingOwner: {
    label: "Binding Owner",
    props: storyRoomRuntimeMechanicsBindingOwnerFixture,
  },
  saving: {
    label: "Saving",
    props: storyRoomRuntimeMechanicsSavingFixture,
  },
  saved: {
    label: "Saved",
    props: storyRoomRuntimeMechanicsSavedFixture,
  },
  error: {
    label: "Error",
    props: storyRoomRuntimeMechanicsErrorFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    binding: fixture.binding ? { ...fixture.binding } : null,
  };
}

function PreviewPicker({ onAttach, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="runtime-mechanics-preview-picker-title"
        className="w-full max-w-lg rounded-2xl border border-[var(--muted-gold)]/35 bg-[#080706] p-5 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Preview Adapter
        </p>
        <h2
          id="runtime-mechanics-preview-picker-title"
          className="mt-2 font-display text-2xl"
        >
          Attach Runtime Mechanics
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          This fixture picker changes local preview state only. It does not load
          Creations or persist a Story Room binding.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={onAttach}
            className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-left text-sm text-[var(--foreground)]"
          >
            Heroic Progression · core.trackers.v1
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryRoomRuntimeMechanicsPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("attached");
  const [panelProps, setPanelProps] = useState(() =>
    cloneFixture(storyRoomRuntimeMechanicsAttachedFixture)
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story Room or persistence client is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelProps(cloneFixture(nextState.props));
    setPickerOpen(false);
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function updateBinding(patch) {
    setPanelProps((current) => ({
      ...current,
      binding: current.binding
        ? { ...current.binding, ...patch }
        : current.binding,
      statusMessage: "Runtime mechanics saved locally in preview.",
      errorMessage: "",
    }));
  }

  function attachFixture() {
    setPanelProps(
      cloneFixture({
        ...storyRoomRuntimeMechanicsAttachedFixture,
        statusMessage: "Runtime mechanics saved locally in preview.",
      })
    );
    setPickerOpen(false);
    setLastAction("Attached the fixture module locally.");
  }

  function removeFixture() {
    setPanelProps(
      cloneFixture({
        ...storyRoomRuntimeMechanicsEmptyFixture,
        statusMessage: "Runtime mechanics removed locally in preview.",
      })
    );
    setLastAction("Removed the fixture module locally.");
  }

  const pickerContent = pickerOpen ? (
    <PreviewPicker
      onAttach={attachFixture}
      onClose={() => setPickerOpen(false)}
    />
  ) : null;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room Runtime Mechanics Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This protected route renders the portable View from contract-shaped
            fixtures. Attach, replace, remove, enable, scope, and priority
            actions affect local preview state only.
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

        <div className="max-w-sm rounded-2xl border border-white/5 bg-black/20 p-1">
          <StoryRoomRuntimeMechanicsPanelView
            {...panelProps}
            pickerContent={pickerContent}
            onOpenPicker={() => {
              setPickerOpen(true);
              setLastAction("Opened the fixture picker.");
            }}
            onRemove={removeFixture}
            onToggleEnabled={(enabled) => {
              updateBinding({ enabled });
              setLastAction(`Set Enabled to ${enabled}.`);
            }}
            onChangeScopeMode={(scopeMode) => {
              updateBinding({ scopeMode });
              setLastAction(`Changed scope to ${scopeMode}.`);
            }}
            onChangePriority={(priority) => {
              updateBinding({ priority: Number(priority) || 100 });
              setLastAction(`Changed priority to ${priority || 100}.`);
            }}
          />
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives only display-ready binding information and
            semantic callbacks. Raw room JSONB compatibility, Mechanics Module
            Creation selection, binding payload composition, Story Room client
            calls, and room reload orchestration remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
