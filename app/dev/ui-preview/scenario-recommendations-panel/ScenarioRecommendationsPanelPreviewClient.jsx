"use client";

import { useState } from "react";

import ScenarioRecommendationsPanelView from "@/components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.view";
import {
  scenarioRecommendationsCharactersOnlyFixture,
  scenarioRecommendationsCompleteFixture,
  scenarioRecommendationsEmptyFixture,
  scenarioRecommendationsLongContentFixture,
  scenarioRecommendationsNpcRegistriesOnlyFixture,
  scenarioRecommendationsSettingOnlyFixture,
} from "@/components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete",
    props: scenarioRecommendationsCompleteFixture,
  },
  empty: {
    label: "No Recommendations",
    props: scenarioRecommendationsEmptyFixture,
  },
  charactersOnly: {
    label: "Characters Only",
    props: scenarioRecommendationsCharactersOnlyFixture,
  },
  settingOnly: {
    label: "Location + Narrator",
    props: scenarioRecommendationsSettingOnlyFixture,
  },
  npcRegistriesOnly: {
    label: "NPC Registries",
    props: scenarioRecommendationsNpcRegistriesOnlyFixture,
  },
  longContent: {
    label: "Long Content",
    props: scenarioRecommendationsLongContentFixture,
  },
};

export default function ScenarioRecommendationsPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Story package or Scenario is connected."
  );

  const activeState = PREVIEW_STATES[activeStateKey];

  function openState(stateKey) {
    setActiveStateKey(stateKey);
    setLastAction(`Opened the ${PREVIEW_STATES[stateKey].label} fixture.`);
  }

  function recordAction(message) {
    setLastAction(`${message} No application data was changed.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Scenario Recommendations Panel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. It does not load a Scenario, update a Story package,
            attach NPC Registries, dismiss recommendations, or save data.
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

        <ScenarioRecommendationsPanelView
          {...activeState.props}
          onApplyAll={() => recordAction("Applied every recommendation locally.")}
          onApplyRequiredCharacters={() =>
            recordAction("Applied required characters locally.")
          }
          onApplyOptionalCharacters={() =>
            recordAction("Applied optional characters locally.")
          }
          onApplySuggestedLocation={() =>
            recordAction("Applied the suggested location locally.")
          }
          onApplySuggestedNarrator={() =>
            recordAction("Applied the suggested narrator locally.")
          }
          onApplySuggestedNpcRegistries={() =>
            recordAction("Applied suggested NPC Registries locally.")
          }
          onSkipRecommendations={() =>
            recordAction("Skipped the recommendations locally.")
          }
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready recommendation titles, action
            availability, and semantic callbacks. Scenario payload parsing,
            reference selection, registry attachment, dismissal state, and
            persistence remain owned by the Story create and edit workflows.
          </p>
        </section>
      </div>
    </main>
  );
}
