"use client";

import { useEffect, useState } from "react";

import LocationRuntimeModulesSectionView from "@/components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view";
import {
  locationRuntimeModulesBoundFixture,
  locationRuntimeModulesDisabledFixture,
  locationRuntimeModulesInheritedFixture,
  locationRuntimeModulesUnboundFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.fixtures";

const PREVIEW_STATES = {
  override: {
    label: "Local Override",
    props: locationRuntimeModulesBoundFixture,
  },
  inherited: {
    label: "Parent Inheritance",
    props: locationRuntimeModulesInheritedFixture,
  },
  disabled: {
    label: "Bound but Disabled",
    props: locationRuntimeModulesDisabledFixture,
  },
  unbound: {
    label: "Not Bound",
    props: locationRuntimeModulesUnboundFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewSlot({ eyebrow, title, body }) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function LocationRuntimeModulesSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("override");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.override.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  function updateProfile(field, value, label) {
    setViewProps((current) => ({
      ...current,
      timeCalendarProfile: {
        ...current.timeCalendarProfile,
        [field]: value,
      },
    }));
    setFeedback(`${label} updated.`);
  }

  function updateWeatherEnabled(enabled) {
    setViewProps((current) => ({
      ...current,
      hasWeatherBinding: true,
      weatherEnabled: enabled,
      weatherStatusLabel: enabled
        ? "Bound and enabled"
        : "Bound but disabled",
    }));
    setFeedback(enabled ? "Weather enabled." : "Weather disabled.");
  }

  function updateEnabled(enabled) {
    setViewProps((current) => ({
      ...current,
      timeCalendarEnabled: enabled,
      statusLabel: enabled ? "Bound and enabled" : "Bound but disabled",
    }));
    setFeedback(
      enabled ? "Time / Calendar enabled." : "Time / Calendar disabled."
    );
  }

  function updateInheritanceMode(inheritanceMode) {
    setViewProps((current) => ({
      ...current,
      timeCalendarEnabled: true,
      inheritanceMode,
      statusLabel: "Bound and enabled",
      runtimeBehaviorLabel:
        inheritanceMode === "OVERRIDE"
          ? "This location overrides parent calendar rules."
          : "Parent calendar authority may take precedence.",
    }));
    setFeedback(`Inheritance mode changed to ${inheritanceMode}.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Runtime Modules Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable runtime-module Skin with visible
            Weather and Time / Calendar controls plus inert Mechanics and
            Registry composition slots. It does not load or save a Creation or
            open application-owned module editors.
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
            <LocationRuntimeModulesSectionView
              {...viewProps}
              runtimeMechanicsSlot={
                <PreviewSlot
                  eyebrow="Mechanics Modules"
                  title="Attached Runtime Mechanics"
                  body="Fixture stand-in for the application-owned Mechanics attachment editor."
                />
              }
              registryAttachmentsSlot={
                <PreviewSlot
                  eyebrow="Registry Attachments"
                  title="Attached Registries"
                  body="Fixture stand-in for the seven application-owned registry attachment groups."
                />
              }
              onOpenWeatherConfig={() =>
                setFeedback("Configure Weather requested from the portable View.")
              }
              onToggleWeather={updateWeatherEnabled}
              onToggleTimeCalendar={updateEnabled}
              onChangeInheritanceMode={updateInheritanceMode}
              onChangeTurnAdvance={(value) =>
                updateProfile(
                  "defaultTurnAdvanceMinutes",
                  value,
                  "Default turn advance"
                )
              }
              onChangeDayLength={(value) =>
                updateProfile("dayLengthMinutes", value, "Day length")
              }
              onChangeYearLength={(value) =>
                updateProfile("yearLengthDays", value, "Year length")
              }
              onChangeStartDay={(value) =>
                updateProfile("startDay", value, "Start day")
              }
              onChangeStartMinutes={(value) =>
                updateProfile("startMinutes", value, "Start minutes")
              }
              onChangeDayLabelPrefix={(value) =>
                updateProfile("dayLabelPrefix", value, "Day label prefix")
              }
              onChangeExactClockVisibility={(value) =>
                updateProfile(
                  "showExactClockToComposer",
                  value,
                  "Exact clock visibility"
                )
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
