"use client";

import { useEffect, useState } from "react";

import NarratorModulesSectionView from "@/components/studio/my-creations/edit/sections/narrators/narrator-modules-section/NarratorModulesSection.view";
import {
  narratorModulesSectionDefaultFixture,
  narratorModulesSectionEmptyFixture,
  narratorModulesSectionEnsembleFixture,
  narratorModulesSectionLongContentFixture,
  narratorModulesSectionMissingCallbacksFixture,
  narratorModulesSectionNarratorPrimaryFixture,
  narratorModulesSectionNoActiveModulesFixture,
} from "@/components/studio/my-creations/edit/sections/narrators/narrator-modules-section/NarratorModulesSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: narratorModulesSectionDefaultFixture,
  },
  narratorPrimary: {
    label: "Narrator Primary",
    props: narratorModulesSectionNarratorPrimaryFixture,
  },
  ensemble: {
    label: "Ensemble",
    props: narratorModulesSectionEnsembleFixture,
  },
  noActiveModules: {
    label: "No Active Modules",
    props: narratorModulesSectionNoActiveModulesFixture,
  },
  longContent: {
    label: "Long Content",
    props: narratorModulesSectionLongContentFixture,
  },
  empty: {
    label: "Empty Groups",
    props: narratorModulesSectionEmptyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: narratorModulesSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function updateActiveOption(groups, groupId, value) {
  return (Array.isArray(groups) ? groups : []).map((group) => {
    if (group?.id !== groupId) return group;

    return {
      ...group,
      options: (Array.isArray(group?.options) ? group.options : []).map(
        (option) => ({
          ...option,
          active: option?.value === value,
        })
      ),
    };
  });
}

function updateActiveModule(groups, groupId, moduleId) {
  return (Array.isArray(groups) ? groups : []).map((group) => {
    if (group?.id !== groupId) return group;

    return {
      ...group,
      modules: (Array.isArray(group?.modules) ? group.modules : []).map(
        (module) => ({
          ...module,
          active: module?.id === moduleId,
        })
      ),
    };
  });
}

export default function NarratorModulesSectionPreviewClient() {
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
  const moduleSelector = viewProps.moduleSelector || {};

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Narrator Modules Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Narrator edit section and its
            validated module-selector View directly from contract-shaped
            fixtures. Selections update preview-local state only.
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
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <NarratorModulesSectionView
              {...viewProps}
              moduleSelector={{
                ...moduleSelector,
                onSelectResponseDirection: callbacksEnabled
                  ? (groupId, value) => {
                      setViewProps((current) => {
                        const currentSelector = current.moduleSelector || {};
                        const nextGroups = updateActiveOption(
                          currentSelector.responseDirectionGroups,
                          groupId,
                          value
                        );
                        const nextPortrayalMode =
                          groupId === "portrayal_mode"
                            ? value
                            : nextGroups
                                .find((group) => group.id === "portrayal_mode")
                                ?.options.find((option) => option.active)?.value;

                        return {
                          ...current,
                          moduleSelector: {
                            ...currentSelector,
                            responseDirectionGroups: nextGroups,
                            showEnsembleLimit:
                              nextPortrayalMode === "ENSEMBLE",
                          },
                        };
                      });
                      setFeedback(
                        `Response direction changed: ${groupId} = ${String(value)}`
                      );
                    }
                  : null,
                onSelectEnsembleCharacterLimit: callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        moduleSelector: {
                          ...(current.moduleSelector || {}),
                          ensembleLimitOptions: (
                            Array.isArray(
                              current.moduleSelector?.ensembleLimitOptions
                            )
                              ? current.moduleSelector.ensembleLimitOptions
                              : []
                          ).map((option) => ({
                            ...option,
                            active: option.value === value,
                          })),
                        },
                      }));
                      setFeedback(
                        `Ensemble character limit changed: ${String(value)}`
                      );
                    }
                  : null,
                onSelectModule: callbacksEnabled
                  ? (groupId, moduleId) => {
                      setViewProps((current) => ({
                        ...current,
                        moduleSelector: {
                          ...(current.moduleSelector || {}),
                          moduleGroups: updateActiveModule(
                            current.moduleSelector?.moduleGroups,
                            groupId,
                            moduleId
                          ),
                        },
                      }));
                      setFeedback(
                        `Module changed: ${groupId} = ${moduleId}`
                      );
                    }
                  : null,
              }}
            />
          </div>

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
              Fixtures contain only the edit-section heading and a direct
              Narrator Module Selector View contract. Raw forms, legacy JSON
              field names, default merging, saving, and persistence remain
              application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
