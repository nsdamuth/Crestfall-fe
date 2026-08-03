"use client";

import { useEffect, useState } from "react";

import LocationIdentitySectionView from "@/components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view";
import {
  locationIdentityFallbackFixture,
  locationIdentityInheritanceOverrideFixture,
  locationIdentityNoParentFixture,
  locationIdentitySelectedParentFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.fixtures";

const PREVIEW_STATES = {
  selectedParent: {
    label: "Selected Parent",
    props: locationIdentitySelectedParentFixture,
  },
  noParent: {
    label: "No Parent",
    props: locationIdentityNoParentFixture,
  },
  inheritanceOverride: {
    label: "Inheritance Overrides",
    props: locationIdentityInheritanceOverrideFixture,
  },
  fallbacks: {
    label: "Fallback Values",
    props: locationIdentityFallbackFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationIdentitySectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("selectedParent");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.selectedParent.props)
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

  function simulateParentSelection() {
    setViewProps((current) => ({
      ...current,
      parentLocation: {
        id: "preview-parent-location-id",
        title: "Preview Parent District",
        imageUrl: "/images/placeholder-card.jpg",
        scale: "DISTRICT",
        spaceType: "CITY",
      },
    }));
    setFeedback("Simulated parent selection from the application picker.");
  }

  function clearParentLocation() {
    setViewProps((current) => ({
      ...current,
      parentLocation: {
        id: "",
        title: "",
        imageUrl: "",
        scale: "",
        spaceType: "",
      },
    }));
    setFeedback("Cleared parent location.");
  }

  function updateInheritance(key, checked) {
    setViewProps((current) => ({
      ...current,
      inheritanceItems: current.inheritanceItems.map((item) =>
        item.key === key ? { ...item, checked } : item
      ),
    }));
    setFeedback(`${key}: ${checked ? "enabled" : "disabled"}`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Identity Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Location identity form without
            loading the saved-Location parent picker or persisting Creation
            data.
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
            <LocationIdentitySectionView
              {...viewProps}
              onChangeLocationName={(value) =>
                updateValue("locationNameValue", value, "Location name")
              }
              onChangeLocationCategory={(value) =>
                updateValue(
                  "locationCategoryValue",
                  value,
                  "Location category"
                )
              }
              onChangeSpaceType={(value) =>
                updateValue("spaceTypeValue", value, "Space type")
              }
              onChangeLocationScale={(value) =>
                updateValue("locationScaleValue", value, "Location scale")
              }
              onOpenParentPicker={simulateParentSelection}
              onClearParentLocation={clearParentLocation}
              onChangeIntendedUse={(value) =>
                updateValue("intendedUseValue", value, "Intended use")
              }
              onChangeTags={(value) =>
                updateValue("tagsValue", value, "Tags")
              }
              onChangeInheritance={updateInheritance}
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <button
              type="button"
              onClick={simulateParentSelection}
              className="mt-5 w-full rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
            >
              Simulate Parent Selection
            </button>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain only display-ready values. Form normalization,
              legacy key compatibility, picker state, parent selection, JSONB
              mapping, saving, and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
