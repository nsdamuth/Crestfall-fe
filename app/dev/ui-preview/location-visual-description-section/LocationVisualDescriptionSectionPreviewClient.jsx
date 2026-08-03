"use client";

import { useEffect, useState } from "react";

import LocationVisualDescriptionSectionView from "@/components/studio/my-creations/edit/sections/locations/location-visual-description-section/LocationVisualDescriptionSection.view";
import {
  locationVisualDescriptionCompleteFixture,
  locationVisualDescriptionEmptyFixture,
  locationVisualDescriptionLegacyFixture,
  locationVisualDescriptionSparseFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-visual-description-section/LocationVisualDescriptionSection.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Location",
    props: locationVisualDescriptionCompleteFixture,
  },
  legacy: {
    label: "Legacy Fallbacks",
    props: locationVisualDescriptionLegacyFixture,
  },
  sparse: {
    label: "Sparse Location",
    props: locationVisualDescriptionSparseFixture,
  },
  empty: {
    label: "Empty Location",
    props: locationVisualDescriptionEmptyFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationVisualDescriptionSectionPreviewClient() {
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
    setFeedback(`${label}: ${value || "(empty)"}`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Visual Description Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Location visual-description form
            without hydrating or persisting a saved Creation.
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
            <LocationVisualDescriptionSectionView
              {...viewProps}
              onChangeArchitecture={(value) =>
                updateValue("architectureValue", value, "Architecture")
              }
              onChangeMaterials={(value) =>
                updateValue("materialsValue", value, "Materials")
              }
              onChangeVisualMotifs={(value) =>
                updateValue("visualMotifsValue", value, "Visual motifs")
              }
              onChangeLandmarks={(value) =>
                updateValue("landmarksValue", value, "Landmarks")
              }
              onChangeLayout={(value) =>
                updateValue("layoutValue", value, "Layout")
              }
              onChangeDesignNotes={(value) =>
                updateValue("designNotesValue", value, "Design notes")
              }
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
              Fixtures contain display-ready values only. Legacy key fallback,
              canonical JSONB mapping, Creation save orchestration, and
              persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
