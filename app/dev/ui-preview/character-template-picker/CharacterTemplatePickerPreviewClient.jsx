"use client";

import { useState } from "react";

import CharacterTemplateModalView from "@/components/studio/create/character/character-template-picker/CharacterTemplateModal.view";
import {
  characterTemplateModalCommunityFixture,
  characterTemplateModalEmptyFixture,
  characterTemplateModalFilteredFixture,
  characterTemplateModalLongContentFixture,
  characterTemplateModalMyTemplatesFixture,
  characterTemplateModalPopulatedFixture,
} from "@/components/studio/create/character/character-template-picker/CharacterTemplateModal.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: characterTemplateModalPopulatedFixture,
  },
  filtered: {
    label: "Filtered",
    props: characterTemplateModalFilteredFixture,
  },
  myTemplates: {
    label: "My Templates",
    props: characterTemplateModalMyTemplatesFixture,
  },
  community: {
    label: "Community",
    props: characterTemplateModalCommunityFixture,
  },
  empty: {
    label: "Empty",
    props: characterTemplateModalEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterTemplateModalLongContentFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    tabs: (fixture.tabs || []).map((tab) => ({ ...tab })),
    templates: (fixture.templates || []).map((template) => ({ ...template })),
  };
}

function futureTabTitle(tabId) {
  if (tabId === "MY_TEMPLATES") return "My Templates Soon";
  if (tabId === "COMMUNITY") return "Community Templates Soon";
  return "Templates Soon";
}

export default function CharacterTemplatePickerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState(null);
  const [previewProps, setPreviewProps] = useState(null);
  const [sourceTemplates, setSourceTemplates] = useState([]);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No character draft is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    const nextProps = cloneFixture(state.props);

    setActiveStateKey(stateKey);
    setPreviewProps(nextProps);
    setSourceTemplates(nextProps.templates);
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function closePreview() {
    setActiveStateKey(null);
    setPreviewProps(null);
    setSourceTemplates([]);
    setLastAction("Modal closed. No character draft data changed.");
  }

  function chooseTab(tabId) {
    setPreviewProps((current) => ({
      ...current,
      activeTabId: tabId,
      showTemplateGrid: tabId === "BUILT_IN",
      emptyStateTitle: futureTabTitle(tabId),
      templates: tabId === "BUILT_IN" ? sourceTemplates : [],
    }));
    setLastAction(`Switched to ${futureTabTitle(tabId).replace(" Soon", "")}.`);
  }

  function changeSearchQuery(value) {
    const normalizedQuery = String(value || "").trim().toLowerCase();
    const filteredTemplates = normalizedQuery
      ? sourceTemplates.filter(
          (template) =>
            template.title.toLowerCase().includes(normalizedQuery) ||
            template.categoryLabel.toLowerCase().includes(normalizedQuery) ||
            template.description.toLowerCase().includes(normalizedQuery)
        )
      : sourceTemplates;

    setPreviewProps((current) => ({
      ...current,
      searchQuery: value,
      templates:
        current.activeTabId === "BUILT_IN" ? filteredTemplates : [],
    }));
    setLastAction("Filtered fixture cards. No application data was loaded.");
  }

  function chooseTemplate(templateId) {
    const template = sourceTemplates.find((item) => item.id === templateId);

    setLastAction(
      `Simulated applying ${template?.title || "a template"}. No character fields changed.`
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
            Character Template Picker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract
            fixtures. It does not load, change, or save a Crestfall character.
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
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives display-ready template cards and semantic picker
            actions. Template field payloads and character-form mutation remain
            outside the View.
          </p>
        </section>
      </div>

      {previewProps ? (
        <CharacterTemplateModalView
          {...previewProps}
          onClose={closePreview}
          onChooseTab={chooseTab}
          onChangeSearchQuery={changeSearchQuery}
          onChooseTemplate={chooseTemplate}
        />
      ) : null}
    </main>
  );
}
