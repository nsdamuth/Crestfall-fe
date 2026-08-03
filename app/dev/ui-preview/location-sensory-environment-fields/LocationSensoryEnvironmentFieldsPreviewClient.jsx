"use client";

import { useEffect, useState } from "react";

import LocationSensoryEnvironmentFieldsView from "@/components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view";
import {
  locationSensoryEnvironmentCompleteFixture,
  locationSensoryEnvironmentInheritedFixture,
  locationSensoryEnvironmentSparseFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Profile",
    props: locationSensoryEnvironmentCompleteFixture,
  },
  inherited: {
    label: "Inherited / Blank",
    props: locationSensoryEnvironmentInheritedFixture,
  },
  sparse: {
    label: "Sparse Profile",
    props: locationSensoryEnvironmentSparseFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationSensoryEnvironmentFieldsPreviewClient() {
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

  function updateValue(field, value, label) {
    setViewProps((current) => ({ ...current, [field]: value }));
    setFeedback(`${label}: ${value === "" ? "inherit" : value}`);
  }

  function updateNote(index, patch, label) {
    setViewProps((current) => ({
      ...current,
      scentNotes: current.scentNotes.map((note) =>
        note.loomRowIndex === index ? { ...note, ...patch } : note
      ),
    }));
    setFeedback(label);
  }

  function addTags(index) {
    const note = viewProps.scentNotes.find((entry) => entry.loomRowIndex === index);
    const additions = String(note?.tagDraft || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!additions.length) return;

    updateNote(
      index,
      {
        tags: Array.from(new Set([...(note?.tags || []), ...additions])),
        tagDraft: "",
        canAddTags: false,
      },
      `Added scent tags to note ${index + 1}.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Sensory Environment Fields
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable sensory-profile editor without
            hydrating or persisting a saved Creation.
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
            <LocationSensoryEnvironmentFieldsView
              {...viewProps}
              onChangeVisionLightLevel={(value) =>
                updateValue("visionLightLevelValue", value, "Light level")
              }
              onChangeVisionObstructionLevel={(value) =>
                updateValue(
                  "visionObstructionLevelValue",
                  value,
                  "Visual obstruction"
                )
              }
              onChangeVisionGlareLevel={(value) =>
                updateValue("visionGlareLevelValue", value, "Glare level")
              }
              onChangeHearingAmbientNoiseLevel={(value) =>
                updateValue(
                  "hearingAmbientNoiseLevelValue",
                  value,
                  "Ambient noise"
                )
              }
              onChangeHearingObstructionLevel={(value) =>
                updateValue(
                  "hearingObstructionLevelValue",
                  value,
                  "Sound obstruction"
                )
              }
              onChangeHearingEchoLevel={(value) =>
                updateValue("hearingEchoLevelValue", value, "Echo level")
              }
              onChangeScentMaskingLevel={(value) =>
                updateValue("scentMaskingLevelValue", value, "Scent masking")
              }
              onChangeScentDispersalLevel={(value) =>
                updateValue(
                  "scentDispersalLevelValue",
                  value,
                  "Scent dispersal"
                )
              }
              onChangeScentNoteLabel={(index, value) =>
                updateNote(index, { label: value }, `Edited scent note ${index + 1}.`)
              }
              onChangeScentNoteStrength={(index, value) =>
                updateNote(
                  index,
                  { strength: value },
                  `Changed scent strength ${index + 1}.`
                )
              }
              onChangeScentTagDraft={(index, value) =>
                updateNote(
                  index,
                  { tagDraft: value, canAddTags: Boolean(value.trim()) },
                  `Editing tags for scent note ${index + 1}.`
                )
              }
              onAddScentTags={addTags}
              onRemoveScentTag={(index, tag) => {
                const note = viewProps.scentNotes.find(
                  (entry) => entry.loomRowIndex === index
                );
                updateNote(
                  index,
                  { tags: (note?.tags || []).filter((entry) => entry !== tag) },
                  `Removed ${tag}.`
                );
              }}
              onAddScentNote={() => {
                setViewProps((current) => ({
                  ...current,
                  scentNotes: [
                    ...current.scentNotes,
                    {
                      loomViewId: `scent-note-${current.scentNotes.length}`,
                      loomRowIndex: current.scentNotes.length,
                      label: "",
                      strength: 5,
                      tags: [],
                      tagDraft: "",
                      canAddTags: false,
                    },
                  ],
                }));
                setFeedback("Added scent note.");
              }}
              onRemoveScentNote={(index) => {
                setViewProps((current) => ({
                  ...current,
                  scentNotes: current.scentNotes
                    .filter((note) => note.loomRowIndex !== index)
                    .map((note, nextIndex) => ({
                      ...note,
                      loomViewId: `scent-note-${nextIndex}`,
                      loomRowIndex: nextIndex,
                    })),
                }));
                setFeedback(`Removed scent note ${index + 1}.`);
              }}
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 break-words text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready scale values and scent rows only.
              Nested sensory-profile interpretation, legacy key handling, tag
              normalization, Creation save orchestration, and persistence remain
              application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
