"use client";

import { useState } from "react";

import EditorHeaderView from "@/components/studio/my-creations/editor-header/EditorHeader.view";
import {
  editorHeaderCanonFixture,
  editorHeaderDefaultFixture,
  editorHeaderDirtySwitchConfirmFixture,
  editorHeaderLongestFixture,
  editorHeaderNoArtFixture,
} from "@/components/studio/my-creations/editor-header/EditorHeader.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: editorHeaderDefaultFixture },
  noArt: { label: "No art", props: editorHeaderNoArtFixture },
  canon: { label: "Canon", props: editorHeaderCanonFixture },
  dirtySwitch: {
    label: "Dirty switch confirm (click switcher)",
    props: editorHeaderDirtySwitchConfirmFixture,
  },
  longest: { label: "Longest", props: editorHeaderLongestFixture },
};

export default function EditorHeaderPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [note, setNote] = useState("");
  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Editor Header"
      description="Asset art thumb, title, type eyebrow, visibility chip, and the switcher trigger. The dirty-switch state arms a Keep editing / Discard and switch confirm on the switcher's own click, not on load."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={note}
    >
      <EditorHeaderView
        {...active.props}
        onOpenSwitcher={() => setNote("Switcher opened (would mount CreationPicker).")}
      />
    </KitPreviewShell>
  );
}
