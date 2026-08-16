"use client";

import { useState } from "react";

import EditorHeaderView from "@/components/studio/my-creations/editor-header/EditorHeader.view";
import {
  editorHeaderCanonFixture,
  editorHeaderDefaultFixture,
  editorHeaderLongestFixture,
  editorHeaderNoActionsFixture,
  editorHeaderNoArtFixture,
} from "@/components/studio/my-creations/editor-header/EditorHeader.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: editorHeaderDefaultFixture },
  noArt: { label: "No art", props: editorHeaderNoArtFixture },
  canon: { label: "Canon", props: editorHeaderCanonFixture },
  noActions: { label: "No actions", props: editorHeaderNoActionsFixture },
  longest: { label: "Longest", props: editorHeaderLongestFixture },
};

export default function EditorHeaderPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [note, setNote] = useState("");
  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Editor Artwork Hero"
      description="ED1C (contract 3.0.0): the artwork hero. Primary art large, the other featured slots beside it, type eyebrow, title, visibility chip, and the Replace / Generate more / Image library actions. The switcher and save state live in the page's ToC rail, not here."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={note}
    >
      <EditorHeaderView
        {...active.props}
        onSelectSlot={(index) => setNote(`Slot ${index + 1} selected as primary.`)}
        onReplaceActiveSlot={
          active.props.onReplaceActiveSlot
            ? () => setNote("Replace image fired (would open the featured image picker).")
            : null
        }
      />
    </KitPreviewShell>
  );
}
