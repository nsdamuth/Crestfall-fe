"use client";

import { useState } from "react";

import LocationBuilderView from "@/components/studio/create/location/location-builder/LocationBuilder.view";
import {
  locationBuilderConfiguredFixture,
  locationBuilderEmptyFixture,
  locationBuilderErrorFixture,
  locationBuilderLocalRuntimeFixture,
  locationBuilderSavedFixture,
  locationBuilderSavingFixture,
} from "@/components/studio/create/location/location-builder/LocationBuilder.fixtures";

const PREVIEW_STATES = {
  configured: { label: "Configured", props: locationBuilderConfiguredFixture },
  empty: { label: "Empty", props: locationBuilderEmptyFixture },
  local: { label: "Local Runtime", props: locationBuilderLocalRuntimeFixture },
  saving: { label: "Saving", props: locationBuilderSavingFixture },
  saved: { label: "Saved", props: locationBuilderSavedFixture },
  error: { label: "Error", props: locationBuilderErrorFixture },
};

function FixtureSlot({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--muted-gold)]/25 bg-black/25 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Application-owned slot
      </p>
      <p className="mt-2 font-display text-2xl">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function LocationBuilderPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("configured");
  const [viewProps, setViewProps] = useState({
    ...locationBuilderConfiguredFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local location fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...state.props });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateField(field, value) {
    setViewProps((current) => ({
      ...current,
      form: {
        ...current.form,
        [field]: value,
      },
    }));
    setLastAction(`Updated ${field} in preview-local state.`);
  }

  function updateLocationData(field, value) {
    setViewProps((current) => ({
      ...current,
      locationData: {
        ...current.locationData,
        [field]: value,
      },
    }));
    setLastAction(`Updated location ${field} in preview-local state.`);
  }

  function updateInheritance(field, value) {
    setViewProps((current) => ({
      ...current,
      locationData: {
        ...current.locationData,
        inheritance: {
          ...current.locationData.inheritance,
          [field]: value,
        },
      },
    }));
    setLastAction(`Updated ${field} inheritance in preview-local state.`);
  }

  const slots = {
    sensoryEnvironmentContent: (
      <FixtureSlot
        title="Sensory Environment"
        body="Sight, sound, scent, atmosphere, and intensity controls are supplied by the application Shell."
      />
    ),
    runtimeModulesContent: (
      <FixtureSlot
        title="Runtime Modules"
        body="Weather, time/calendar, tracker, and mechanics configuration remains disconnected in this preview."
      />
    ),
    registryAttachmentsContent: (
      <FixtureSlot
        title="Registry Attachments"
        body="Event, Quest, NPC, Item, Location, Faction, and Organization pickers are supplied by Crestfall."
      />
    ),
    parentPickerContent: null,
  };

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Location Builder</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable location skin directly. Creation
            persistence, registry queries, runtime modules, and parent-location
            lookup remain disconnected.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
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
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <LocationBuilderView
          {...viewProps}
          {...slots}
          onUpdateField={updateField}
          onUpdateLocationData={updateLocationData}
          onUpdateInheritance={updateInheritance}
          onSelectCover={(candidateId) => {
            setViewProps((current) => ({
              ...current,
              selectedCover: candidateId,
            }));
            setLastAction(`Selected ${candidateId} in preview-local state.`);
          }}
          onOpenParentPicker={() =>
            setLastAction("Requested the disconnected parent-location picker.")
          }
          onClearParentLocation={() => {
            setViewProps((current) => ({
              ...current,
              locationData: {
                ...current.locationData,
                parentLocationId: "",
                parentLocationTitle: "",
                parentLocationDescription: "",
                parentLocationImageUrl: "",
                parentLocationScale: "",
                parentLocationSpaceType: "",
              },
            }));
            setLastAction("Cleared the preview-local parent location.");
          }}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
