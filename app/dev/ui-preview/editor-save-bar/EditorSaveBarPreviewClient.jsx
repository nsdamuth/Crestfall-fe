"use client";

import { useState } from "react";

import EditorSaveBarView from "@/components/studio/my-creations/editor-save-bar/EditorSaveBar.view";
import {
  editorSaveBarErrorFixture,
  editorSaveBarHiddenFixture,
  editorSaveBarIdleFixture,
  editorSaveBarSavedFixture,
  editorSaveBarSavingFixture,
} from "@/components/studio/my-creations/editor-save-bar/EditorSaveBar.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  idle: { label: "Idle (dirty)", props: editorSaveBarIdleFixture },
  saving: { label: "Saving", props: editorSaveBarSavingFixture },
  saved: { label: "Saved", props: editorSaveBarSavedFixture },
  error: { label: "Error", props: editorSaveBarErrorFixture },
  hidden: { label: "Hidden (clean)", props: editorSaveBarHiddenFixture },
};

export default function EditorSaveBarPreviewClient() {
  const [activeKey, setActiveKey] = useState("idle");
  const [note, setNote] = useState("");
  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Editor Save Bar"
      description="N2: top-docked contextual save bar, visible only when dirty or mid-save-status. Save, Discard, status word."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={note}
    >
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] p-[var(--space-6)]">
        <p className="mb-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          Simulated editor header above
        </p>
        <EditorSaveBarView
          {...active.props}
          onSave={() => setNote("Save fired.")}
          onDiscard={() => setNote("Discard fired.")}
        />
        {activeKey === "hidden" ? (
          <p className="text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            (Bar renders nothing in this state, by design.)
          </p>
        ) : null}
      </div>
    </KitPreviewShell>
  );
}
