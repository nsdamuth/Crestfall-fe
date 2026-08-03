"use client";

import { useEffect, useState } from "react";

import LocationPromptGuidanceSectionView from "@/components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.view";
import {
  locationPromptGuidanceCompleteFixture,
  locationPromptGuidanceEmptyFixture,
  locationPromptGuidanceLegacyFixture,
  locationPromptGuidanceSparseFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Location",
    props: locationPromptGuidanceCompleteFixture,
  },
  legacy: {
    label: "Legacy Prompt Fallback",
    props: locationPromptGuidanceLegacyFixture,
  },
  sparse: {
    label: "Sparse Location",
    props: locationPromptGuidanceSparseFixture,
  },
  empty: {
    label: "Empty Location",
    props: locationPromptGuidanceEmptyFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationPromptGuidanceSectionPreviewClient() {
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

  function updateValue(field, value, label, maxLength = null) {
    const nextValue =
      Number.isFinite(maxLength) && maxLength > 0
        ? String(value || "").slice(0, maxLength)
        : value;

    setViewProps((current) => ({ ...current, [field]: nextValue }));
    setFeedback(
      `${label}: ${nextValue ? `${String(nextValue).length} characters` : "(empty)"}`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Prompt Guidance Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Location prompt-guidance form
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
            <LocationPromptGuidanceSectionView
              {...viewProps}
              onChangePromptGuidance={(value) =>
                updateValue("promptGuidanceValue", value, "Prompt guidance")
              }
              onChangeImagePrompt={(value) =>
                updateValue(
                  "imagePromptValue",
                  value,
                  "Standalone image prompt",
                  viewProps.imagePromptMaxLength
                )
              }
              onChangeNegativePrompt={(value) =>
                updateValue(
                  "negativePromptValue",
                  value,
                  "Negative prompt",
                  viewProps.negativePromptMaxLength
                )
              }
              onChangeUsageNotes={(value) =>
                updateValue("usageNotesValue", value, "Usage notes")
              }
              onChangeCompatibilityNotes={(value) =>
                updateValue(
                  "compatibilityNotesValue",
                  value,
                  "Compatibility notes"
                )
              }
              onChangeRegistryNotes={(value) =>
                updateValue("registryNotesValue", value, "Registry notes")
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
              Fixtures contain display-ready prompt strings only. Legacy
              fallback, prompt limits, canonical JSONB mapping, Creation save
              orchestration, and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
