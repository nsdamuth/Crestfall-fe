"use client";

import { useState } from "react";

import LocationRegistryBuilderView from "@/components/studio/create/location-registry/location-registry-builder/LocationRegistryBuilder.view";
import {
  locationRegistryBuilderConnectionsFixture,
  locationRegistryBuilderEditFixture,
  locationRegistryBuilderEntriesFixture,
  locationRegistryBuilderErrorFixture,
  locationRegistryBuilderOverviewFixture,
  locationRegistryBuilderPresenceFixture,
  locationRegistryBuilderRuntimeFixture,
  locationRegistryBuilderSavingFixture,
  locationRegistryBuilderWeatherFixture,
} from "@/components/studio/create/location-registry/location-registry-builder/LocationRegistryBuilder.fixtures";

const STATES = [
  ["Overview", locationRegistryBuilderOverviewFixture],
  ["Locations", locationRegistryBuilderEntriesFixture],
  ["Connections", locationRegistryBuilderConnectionsFixture],
  ["Presence", locationRegistryBuilderPresenceFixture],
  ["Weather", locationRegistryBuilderWeatherFixture],
  ["Runtime", locationRegistryBuilderRuntimeFixture],
  ["Edit Mode", locationRegistryBuilderEditFixture],
  ["Saving", locationRegistryBuilderSavingFixture],
  ["Error", locationRegistryBuilderErrorFixture],
];

export default function LocationRegistryBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeTab, setActiveTab] = useState(STATES[0][1].currentTab);
  const fixture = STATES[selectedState][1];

  function selectFixture(index) {
    setSelectedState(index);
    setActiveTab(STATES[index][1].currentTab);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development-only LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Registry Builder
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixture-driven location graph, travel, presence, weather, and runtime states. No creation API, router, database, or owned-creation catalogue is connected.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFixture(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <LocationRegistryBuilderView
          {...fixture}
          currentTab={activeTab}
          tabs={fixture.tabs.map((tab) => ({
            ...tab,
            active: tab.id === activeTab,
          }))}
          onSelectTab={setActiveTab}
        />
      </div>
    </main>
  );
}
