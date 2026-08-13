"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import Editor from "@/app/studio/v2/editor/Editor";
import EditorIndexClient from "@/app/studio/v2/editor/EditorIndexClient";
import { MOCK_SAVED_CREATION_IDS } from "@/app/studio/v2/editor/editor/editorSavedCreations.mock";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar (collapsed/expanded) plus this
// page's own fixture-id switcher, byte-for-byte the pattern of the
// other v2 page preview clients (Studio, Lore, Adventures, Home).
const FIXTURE_OPTIONS = [
  { id: MOCK_SAVED_CREATION_IDS.characterDefault, label: "Character (default)" },
  { id: MOCK_SAVED_CREATION_IDS.nonCharacterType, label: "Lore (non-Character)" },
  { id: MOCK_SAVED_CREATION_IDS.story, label: "Story" },
  { id: MOCK_SAVED_CREATION_IDS.location, label: "Location" },
  { id: MOCK_SAVED_CREATION_IDS.npcRegistry, label: "NPC Registry" },
  { id: MOCK_SAVED_CREATION_IDS.emptySections, label: "Empty sections" },
  { id: MOCK_SAVED_CREATION_IDS.longestContent, label: "Longest content" },
  { id: "__empty-index__", label: "Empty index" },
];

// Origin states, RULED 11 Aug 2026: the three doors the back control
// must prove (Studio hub quick-create, Vault popup edit, no origin
// i.e. the Vault fallback). `originOverride` mirrors what a real
// `?origin=` query param would carry, without real navigation.
const ORIGIN_OPTIONS = [
  { id: "studio", label: "From Studio" },
  { id: "vault", label: "From Vault" },
  { id: null, label: "No origin (fallback)" },
];

// Loading / load-error / dirty harness, ED1B: same precedent as
// `originOverride`, preview-only simulation of states the
// fixture-first mock resolver never produces on its own (resolution
// is synchronous and read-only; a real async gap only exists on the
// unmodified live fallback path). "Dirty" forces the contextual
// save bar visible and arms the header's switch confirm.
const LOAD_STATE_OPTIONS = [
  { id: "ready", label: "Ready" },
  { id: "dirty", label: "Dirty (unsaved changes)" },
  { id: "loading", label: "Loading" },
  { id: "loadError", label: "Load error" },
];

export default function EditorV2PagePreviewClient() {
  const [creationId, setCreationId] = useState(FIXTURE_OPTIONS[0].id);
  const [origin, setOrigin] = useState(ORIGIN_OPTIONS[0].id);
  const [loadState, setLoadState] = useState(LOAD_STATE_OPTIONS[0].id);
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

  const originHarnessSlot = (
    <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Origin
      </span>
      {ORIGIN_OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={origin === option.id}
          onClick={() => setOrigin(option.id)}
          className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
            origin === option.id
              ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
              : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const loadStateHarnessSlot = (
    <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Load state
      </span>
      {LOAD_STATE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={loadState === option.id}
          onClick={() => setLoadState(option.id)}
          className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
            loadState === option.id
              ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
              : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
          }`}
        >
          {option.label}
        </button>
      ))}
      <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">
        Mobile: emulate 390 to see the compact header and the Sections trigger.
      </span>
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
      {creationId === "__empty-index__" ? (
        <div>
          <div className="mx-auto w-full max-w-3xl px-[var(--space-4)] pt-[var(--space-4)] sm:px-[var(--space-6)]">
            <div className="flex flex-col gap-[var(--space-2)]">{harnessSlot}</div>
          </div>
          <EditorIndexClient />
        </div>
      ) : (
        <Editor
          creationId={creationId}
          originOverride={origin}
          previewLoadingOverride={loadState === "loading"}
          previewLoadErrorOverride={
            loadState === "loadError"
              ? { label: "Load error", message: "This creation could not be loaded." }
              : null
          }
          previewDirtyOverride={loadState === "dirty"}
          harnessSlot={
            <div className="flex flex-col gap-[var(--space-2)]">
              {harnessSlot}
              {originHarnessSlot}
              {loadStateHarnessSlot}
            </div>
          }
        />
      )}
    </StudioShellView>
  );
}
