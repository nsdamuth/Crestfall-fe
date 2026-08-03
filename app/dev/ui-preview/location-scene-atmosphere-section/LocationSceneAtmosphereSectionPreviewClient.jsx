"use client";

import { useEffect, useState } from "react";

import LocationSceneAtmosphereSectionView from "@/components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.view";
import {
  locationSceneAtmosphereCompleteFixture,
  locationSceneAtmosphereEmptyFixture,
  locationSceneAtmosphereLegacyFixture,
  locationSceneAtmosphereSparseFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.fixtures";
import LocationSensoryEnvironmentFieldsView from "@/components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view";
import { locationSensoryEnvironmentCompleteFixture } from "@/components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Atmosphere",
    props: locationSceneAtmosphereCompleteFixture,
  },
  legacy: {
    label: "Legacy Fallbacks",
    props: locationSceneAtmosphereLegacyFixture,
  },
  sparse: {
    label: "Sparse Atmosphere",
    props: locationSceneAtmosphereSparseFixture,
  },
  empty: {
    label: "Empty Atmosphere",
    props: locationSceneAtmosphereEmptyFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationSceneAtmosphereSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.complete.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  function updateField(field, value, label) {
    setViewProps((current) => ({ ...current, [field]: value }));
    setFeedback(`${label} updated.`);
  }

  const sensoryEnvironmentSlot = (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/20 p-5">
      <LocationSensoryEnvironmentFieldsView
        {...locationSensoryEnvironmentCompleteFixture}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Scene / Atmosphere Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable atmosphere Skin with a fixture-driven
            sensory editor slot. It does not hydrate or persist a saved Creation.
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
                onClick={() => setActiveStateKey(stateKey)}
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
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
            <LocationSceneAtmosphereSectionView
              {...viewProps}
              sensoryEnvironmentSlot={sensoryEnvironmentSlot}
              onChangeMood={(value) =>
                updateField("moodValue", value, "Mood / Atmosphere")
              }
              onChangeLighting={(value) =>
                updateField("lightingValue", value, "Lighting")
              }
              onChangeTimeOfDay={(value) =>
                updateField("timeOfDayValue", value, "Time of Day")
              }
              onChangeWeather={(value) =>
                updateField("weatherValue", value, "Weather / Conditions")
              }
              onChangeActivityLevel={(value) =>
                updateField("activityLevelValue", value, "Activity Level")
              }
              onChangePopulationPresence={(value) =>
                updateField(
                  "populationPresenceValue",
                  value,
                  "Population / Presence"
                )
              }
              onChangeSensoryNotes={(value) =>
                updateField("sensoryNotesValue", value, "Sensory Notes")
              }
            />
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>
            <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
              Active fixture: {activeState.label}
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
