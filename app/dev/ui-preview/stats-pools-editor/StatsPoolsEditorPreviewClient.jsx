"use client";

import { useState } from "react";

import StatsPoolsEditor from "@/components/studio/create/stats-pools/StatsPoolsEditor";
import {
  statsPoolsBeyondScaleViewFixture,
  statsPoolsDisabledViewFixture,
  statsPoolsEmptyViewFixture,
  statsPoolsFullAdventurerViewFixture,
  statsPoolsValidationViewFixture,
} from "@/components/studio/create/stats-pools/stats-pools-editor/StatsPoolsEditor.fixtures";

const FIXTURES = {
  empty: { label: "Empty", fixture: statsPoolsEmptyViewFixture },
  full: { label: "Full Adventurer", fixture: statsPoolsFullAdventurerViewFixture },
  beyond: { label: "Beyond Scale", fixture: statsPoolsBeyondScaleViewFixture },
  validation: { label: "Validation", fixture: statsPoolsValidationViewFixture },
  disabled: { label: "Disabled", fixture: statsPoolsDisabledViewFixture },
};

function stripDefinition(definition) {
  const {
    expanded,
    issues,
    tagsInput,
    modifierDefinitionIdsInput,
    ...rest
  } = definition;
  return JSON.parse(JSON.stringify(rest));
}

function fixtureToValue(fixture) {
  return {
    contractVersion: "stats_pools_profile_contract_v0",
    title: fixture.title,
    description: fixture.description,
    enabled: fixture.enabled,
    profileMode: fixture.profileMode,
    capabilityPolicy: JSON.parse(JSON.stringify(fixture.capabilityPolicy)),
    statDefinitions: fixture.stats.map(stripDefinition),
    poolDefinitions: fixture.pools.map(stripDefinition),
    modifierDefinitions: fixture.modifiers.map(stripDefinition),
    conditionDefinitions: fixture.conditions.map(stripDefinition),
    metadata: {},
  };
}

export default function StatsPoolsEditorPreviewClient() {
  const [activeKey, setActiveKey] = useState("full");
  const [value, setValue] = useState(() =>
    fixtureToValue(FIXTURES.full.fixture)
  );
  const [lastAction, setLastAction] = useState(
    "Loaded the Full Adventurer fixture. No creation, actor state, or runtime service is connected."
  );

  function openFixture(key) {
    const selected = FIXTURES[key];
    setActiveKey(key);
    setValue(fixtureToValue(selected.fixture));
    setLastAction(`Loaded the ${selected.label} fixture.`);
  }

  function handleChange(nextValue) {
    setValue(nextValue);
    setLastAction(
      "Updated the controlled profile locally. No persistent or runtime state changed."
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Development-only LOOM preview
          </p>
          <h1 className="mt-2 font-display text-3xl">Stats and Pools Editor</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            This preview exercises the controlled Binding Shell and ViewModel.
            It has no API, database, Actor Mechanics Profile, or runtime connection.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(FIXTURES).map(([key, fixture]) => (
              <button
                key={key}
                type="button"
                onClick={() => openFixture(key)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                  activeKey === key
                    ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15"
                    : "border-white/10 bg-black/25 text-[var(--muted)]"
                }`}
              >
                {fixture.label}
              </button>
            ))}
          </div>

          <p className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
            {lastAction}
          </p>
        </div>

        <StatsPoolsEditor
          value={value}
          onChange={handleChange}
          disabled={activeKey === "disabled"}
        />
      </div>
    </main>
  );
}
