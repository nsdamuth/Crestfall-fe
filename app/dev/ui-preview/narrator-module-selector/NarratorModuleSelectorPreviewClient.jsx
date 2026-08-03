"use client";

import { useEffect, useState } from "react";

import NarratorModuleSelectorView from "@/components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.view";
import {
  narratorModuleSelectorDefaultFixture,
  narratorModuleSelectorEmptyFixture,
  narratorModuleSelectorEnsembleFixture,
  narratorModuleSelectorLongContentFixture,
  narratorModuleSelectorMissingCallbacksFixture,
  narratorModuleSelectorNarratorPrimaryFixture,
  narratorModuleSelectorNoActiveModulesFixture,
} from "@/components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: narratorModuleSelectorDefaultFixture,
  },
  narratorPrimary: {
    label: "Narrator Primary",
    props: narratorModuleSelectorNarratorPrimaryFixture,
  },
  ensemble: {
    label: "Ensemble",
    props: narratorModuleSelectorEnsembleFixture,
  },
  noActiveModules: {
    label: "No Active Modules",
    props: narratorModuleSelectorNoActiveModulesFixture,
  },
  longContent: {
    label: "Long Content",
    props: narratorModuleSelectorLongContentFixture,
  },
  empty: {
    label: "Empty",
    props: narratorModuleSelectorEmptyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: narratorModuleSelectorMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function selectResponseOption(current, groupId, value) {
  const responseDirectionGroups = current.responseDirectionGroups.map(
    (group) =>
      group.id === groupId
        ? {
            ...group,
            options: group.options.map((option) => ({
              ...option,
              active: option.value === value,
            })),
          }
        : group
  );

  return {
    ...current,
    responseDirectionGroups,
    showEnsembleLimit:
      groupId === "portrayal_mode"
        ? value === "ENSEMBLE"
        : current.showEnsembleLimit,
  };
}

function selectEnsembleLimit(current, value) {
  return {
    ...current,
    ensembleLimitOptions: current.ensembleLimitOptions.map((option) => ({
      ...option,
      active: option.value === value,
    })),
  };
}

function selectModule(current, groupId, moduleId) {
  return {
    ...current,
    moduleGroups: current.moduleGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            modules: group.modules.map((module) => ({
              ...module,
              active: module.id === moduleId,
            })),
          }
        : group
    ),
  };
}

export default function NarratorModuleSelectorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Narrator Module Selector
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable response-direction and starter-module
            selector directly from contract-shaped fixtures. Selections update
            local preview state only.
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

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <NarratorModuleSelectorView
            {...viewProps}
            onSelectResponseDirection={
              callbacksEnabled
                ? (groupId, value) => {
                    setViewProps((current) =>
                      selectResponseOption(current, groupId, value)
                    );
                    setFeedback(
                      `Response direction selected: ${groupId} → ${String(value)}`
                    );
                  }
                : null
            }
            onSelectEnsembleCharacterLimit={
              callbacksEnabled
                ? (value) => {
                    setViewProps((current) =>
                      selectEnsembleLimit(current, value)
                    );
                    setFeedback(
                      `Ensemble character limit selected: ${String(value)}`
                    );
                  }
                : null
            }
            onSelectModule={
              callbacksEnabled
                ? (groupId, moduleId) => {
                    setViewProps((current) =>
                      selectModule(current, groupId, moduleId)
                    );
                    setFeedback(
                      `Narrator module selected: ${groupId} → ${moduleId}`
                    );
                  }
                : null
            }
          />

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 2xl:sticky 2xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain only display-ready option and module groups. Raw
              Narrator draft data, preset imports, default merging, creation
              payloads, and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
