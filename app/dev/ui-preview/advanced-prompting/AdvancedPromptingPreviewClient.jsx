"use client";

import { useState } from "react";

import AdvancedPromptingEditorView from "@/components/studio/characters/advanced-prompting/advanced-prompting/AdvancedPromptingEditor.view";
import {
  advancedPromptingApprovedFixture,
  advancedPromptingBlockedFixture,
  advancedPromptingDisabledFixture,
  advancedPromptingEnabledEmptyFixture,
  advancedPromptingNearLimitFixture,
  advancedPromptingNeedsRescanFixture,
  advancedPromptingReviewRequiredFixture,
  advancedPromptingSanitizedFixture,
} from "@/components/studio/characters/advanced-prompting/advanced-prompting/AdvancedPromptingEditor.fixtures";

const PREVIEW_STATES = {
  disabled: {
    label: "Disabled",
    props: advancedPromptingDisabledFixture,
  },
  enabledEmpty: {
    label: "Enabled Empty",
    props: advancedPromptingEnabledEmptyFixture,
  },
  approved: {
    label: "Approved",
    props: advancedPromptingApprovedFixture,
  },
  needsRescan: {
    label: "Needs Rescan",
    props: advancedPromptingNeedsRescanFixture,
  },
  sanitized: {
    label: "Sanitized",
    props: advancedPromptingSanitizedFixture,
  },
  reviewRequired: {
    label: "Review Required",
    props: advancedPromptingReviewRequiredFixture,
  },
  blocked: {
    label: "Blocked",
    props: advancedPromptingBlockedFixture,
  },
  nearLimit: {
    label: "Near Limit",
    props: advancedPromptingNearLimitFixture,
  },
};

function cloneFixture(fixture) {
  return {
    ...fixture,
    sections: Array.isArray(fixture.sections)
      ? fixture.sections.map((section) => ({ ...section }))
      : [],
  };
}

function countCharacters(sections) {
  return sections.reduce(
    (total, section) => total + Number(section.characterCount || 0),
    0
  );
}

export default function AdvancedPromptingPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("disabled");
  const [previewProps, setPreviewProps] = useState(() =>
    cloneFixture(advancedPromptingDisabledFixture)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No character or creation data is connected."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPreviewProps(cloneFixture(state.props));
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function setEnabled(enabled) {
    setPreviewProps((current) => ({
      ...current,
      enabled,
      securityStatus:
        enabled && current.totalCharacters > 0 ? "NEEDS_RESCAN" : "INACTIVE",
      sanitizedFragmentCount: 0,
    }));
    setLastAction(
      enabled
        ? "Advanced Prompting enabled locally. No character was updated."
        : "Advanced Prompting disabled locally. No character was updated."
    );
  }

  function toggleSection(sectionId) {
    setPreviewProps((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      ),
    }));
    setLastAction(`Toggled the ${sectionId} section locally.`);
  }

  function updateSection(sectionId, nextText) {
    setPreviewProps((current) => {
      const targetSection = current.sections.find(
        (section) => section.id === sectionId
      );

      if (!targetSection) return current;

      const otherCharacters =
        current.totalCharacters - Number(targetSection.characterCount || 0);
      const allowedByTotal = Math.max(
        0,
        Number(current.totalLimit || 0) - otherCharacters
      );
      const allowedLength = Math.min(
        Number(targetSection.maxLength || 0),
        allowedByTotal
      );
      const safeText = String(nextText || "").slice(0, allowedLength);
      const sections = current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              value: safeText,
              characterCount: safeText.length,
            }
          : section
      );

      return {
        ...current,
        enabled: true,
        sections,
        totalCharacters: countCharacters(sections),
        securityStatus: safeText || otherCharacters ? "NEEDS_RESCAN" : "INACTIVE",
        sanitizedFragmentCount: 0,
      };
    });
    setLastAction(
      `Updated the ${sectionId} fixture text locally. No data was saved.`
    );
  }

  function clearSection(sectionId) {
    updateSection(sectionId, "");
    setLastAction(`Cleared the ${sectionId} fixture text locally.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Advanced Prompting Editor
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. It does not authenticate a user, load a character, run a
            security scan, compile directives, or persist changes.
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

        <AdvancedPromptingEditorView
          {...previewProps}
          onSetEnabled={setEnabled}
          onToggleSection={toggleSection}
          onUpdateSection={updateSection}
          onClearSection={clearSection}
        />

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain only display-ready sections, character budgets,
            security presentation state, and semantic callbacks. Stored creator
            directives, compilation output, security storage keys, parent form
            fields, and persistence remain outside the View.
          </p>
        </section>
      </div>
    </main>
  );
}
