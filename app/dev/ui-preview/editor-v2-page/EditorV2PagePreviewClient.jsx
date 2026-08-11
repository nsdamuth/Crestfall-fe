"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import Editor from "@/app/studio/v2/editor/Editor";
import { MOCK_SAVED_CREATION_IDS } from "@/app/studio/v2/editor/editor/editorSavedCreations.mock";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar (collapsed/expanded) plus this
// page's own fixture-id switcher, byte-for-byte the pattern of the
// other v2 page preview clients (Studio, Lore, Adventures, Home).
const FIXTURE_OPTIONS = [
  { id: MOCK_SAVED_CREATION_IDS.characterDefault, label: "Character (default)" },
  { id: MOCK_SAVED_CREATION_IDS.nonCharacterType, label: "Lore (non-Character)" },
  { id: MOCK_SAVED_CREATION_IDS.emptySections, label: "Empty sections" },
  { id: MOCK_SAVED_CREATION_IDS.longestContent, label: "Longest content" },
];

export default function EditorV2PagePreviewClient() {
  const [creationId, setCreationId] = useState(FIXTURE_OPTIONS[0].id);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarFixture = {
    ...studioSidebarPreviewFixture,
    collapsed,
    collapseAriaLabel: collapsed ? "Expand sidebar" : "Collapse sidebar",
  };

  const harnessSlot = (
    <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Fixture creation
      </span>
      {FIXTURE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={creationId === option.id}
          onClick={() => setCreationId(option.id)}
          className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
            creationId === option.id
              ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
              : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <StudioShellView
      sidebarSlot={
        <StudioSidebarView
          {...sidebarFixture}
          onToggleCollapsed={() => setCollapsed((current) => !current)}
        />
      }
      topBarSlot={<StudioTopBar />}
    >
      <Editor creationId={creationId} harnessSlot={harnessSlot} />
    </StudioShellView>
  );
}
