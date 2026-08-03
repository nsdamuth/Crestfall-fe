"use client";

import { useState } from "react";

import RulesCodexEditorView from "@/components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.view";
import {
  rulesCodexDisabledFixture,
  rulesCodexEconomyFixture,
  rulesCodexEmptyFixture,
  rulesCodexExplicitOnlyFixture,
  rulesCodexNearLimitFixture,
  rulesCodexStatInterpretationFixture,
  rulesCodexValidationFixture,
} from "@/components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.fixtures";

const PREVIEW_STATES = {
  empty: { label: "Empty", props: rulesCodexEmptyFixture },
  stats: { label: "Stats", props: rulesCodexStatInterpretationFixture },
  economy: { label: "Economy", props: rulesCodexEconomyFixture },
  explicitOnly: { label: "Explicit Only", props: rulesCodexExplicitOnlyFixture },
  validation: { label: "Validation", props: rulesCodexValidationFixture },
  nearLimit: { label: "Near Limit", props: rulesCodexNearLimitFixture },
  disabled: { label: "Disabled", props: rulesCodexDisabledFixture },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    sections: Array.isArray(fixture.sections)
      ? fixture.sections.map((section) => ({
          ...section,
          activationInputs: { ...section.activationInputs },
          issues: Array.isArray(section.issues)
            ? section.issues.map((issue) => ({ ...issue }))
            : [],
        }))
      : [],
    globalIssues: Array.isArray(fixture.globalIssues)
      ? fixture.globalIssues.map((issue) => ({ ...issue }))
      : [],
  };
}

function countBodyCharacters(sections) {
  return sections.reduce(
    (total, section) => total + String(section.body || "").length,
    0
  );
}

function nextPreviewSectionId(sections) {
  const ids = new Set(sections.map((section) => section.id));
  let index = 1;
  let candidate = "new-section";

  while (ids.has(candidate)) {
    index += 1;
    candidate = `new-section-${index}`;
  }

  return candidate;
}

export default function RulesCodexEditorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("empty");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(rulesCodexEmptyFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Creation, attachment, or runtime system is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];
    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateSections(updater, action) {
    setPreviewProps((current) => {
      const sections = updater(current.sections).map((section, order) => ({
        ...section,
        order,
        bodyCharacterCount: String(section.body || "").length,
      }));

      return {
        ...current,
        sections,
        sectionCount: sections.length,
        totalBodyCharacters: countBodyCharacters(sections),
      };
    });
    setLastAction(action);
  }

  function setEnabled(enabled) {
    setPreviewProps((current) => ({ ...current, enabled }));
    setLastAction(
      enabled
        ? "Enabled the fixture locally. No runtime selection changed."
        : "Disabled the fixture locally. No runtime selection changed."
    );
  }

  function updateSummary(summary) {
    setPreviewProps((current) => ({
      ...current,
      summary: String(summary || "").slice(0, current.summaryCharacterLimit),
      summaryCharacterCount: String(summary || "").slice(
        0,
        current.summaryCharacterLimit
      ).length,
    }));
    setLastAction("Updated the summary locally. No data was saved.");
  }

  function updateSelectionPolicy(field, value) {
    setPreviewProps((current) => ({
      ...current,
      [field]: Number(value),
    }));
    setLastAction(`Updated ${field} locally.`);
  }

  function addSection() {
    updateSections(
      (sections) => [
        ...sections,
        {
          id: nextPreviewSectionId(sections),
          title: "",
          body: "",
          enabled: true,
          priority: 50,
          authorityLabel: "INTERPRETATION_ONLY",
          activationMode: "CONTEXTUAL",
          matchMode: "ANY",
          activationInputs: Object.fromEntries(
            previewProps.activationSignalFields.map((field) => [field.key, ""])
          ),
          bodyCharacterCount: 0,
          bodyCharacterLimit: 8000,
          expanded: true,
          issues: [],
        },
      ],
      "Added a local fixture section."
    );
  }

  function removeSection(sectionId) {
    updateSections(
      (sections) => sections.filter((section) => section.id !== sectionId),
      `Removed ${sectionId} locally.`
    );
  }

  function moveSection(sectionId, direction) {
    updateSections(
      (sections) => {
        const index = sections.findIndex((section) => section.id === sectionId);
        const target = direction === "UP" ? index - 1 : index + 1;

        if (index < 0 || target < 0 || target >= sections.length) {
          return sections;
        }

        const next = [...sections];
        const [section] = next.splice(index, 1);
        next.splice(target, 0, section);
        return next;
      },
      `Moved ${sectionId} ${direction.toLowerCase()} locally.`
    );
  }

  function toggleSection(sectionId) {
    updateSections(
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? { ...section, expanded: !section.expanded }
            : section
        ),
      `Toggled ${sectionId} locally.`
    );
  }

  function updateSection(sectionId, field, value) {
    updateSections(
      (sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;

          if (field === "activationMode") {
            return { ...section, activationMode: value };
          }

          if (field === "matchMode") {
            return { ...section, matchMode: value };
          }

          if (field === "id") {
            return { ...section, id: String(value || "").toLowerCase() };
          }

          if (field === "enabled") {
            return { ...section, enabled: value === true };
          }

          if (field === "priority") {
            return { ...section, priority: Number(value) };
          }

          if (field === "body") {
            return {
              ...section,
              body: String(value || "").slice(0, section.bodyCharacterLimit),
            };
          }

          return { ...section, [field]: value };
        }),
      `Updated ${field} for ${sectionId} locally.`
    );
  }

  function updateActivationInput(sectionId, field, value) {
    updateSections(
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                activationInputs: {
                  ...section.activationInputs,
                  [field]: String(value || "").toUpperCase(),
                },
              }
            : section
        ),
      `Updated ${field} for ${sectionId} locally.`
    );
  }

  function clearSection(sectionId) {
    updateSections(
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                title: "",
                body: "",
                activationMode: "CONTEXTUAL",
                matchMode: "ANY",
                activationInputs: Object.fromEntries(
                  previewProps.activationSignalFields.map((field) => [
                    field.key,
                    "",
                  ])
                ),
              }
            : section
        ),
      `Cleared ${sectionId} locally.`
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Rules Codex Editor</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View from contract-shaped fixtures.
            It does not authenticate, load a Creation, save JSONB, attach a
            Codex, select runtime sections, execute mechanics, or call an AI.
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

        <RulesCodexEditorView
          {...previewProps}
          onSetEnabled={setEnabled}
          onUpdateSummary={updateSummary}
          onUpdateSelectionPolicy={updateSelectionPolicy}
          onAddSection={addSection}
          onRemoveSection={removeSection}
          onMoveSection={moveSection}
          onToggleSection={toggleSection}
          onUpdateSection={updateSection}
          onUpdateActivationInput={updateActivationInput}
          onClearSection={clearSection}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready Codex fields, section state,
            validation presentation, budgets, and semantic callbacks. Creation
            storage, API routes, attachment scopes, runtime selection, and
            provider context remain outside the portable View.
          </p>
        </section>
      </div>
    </main>
  );
}
