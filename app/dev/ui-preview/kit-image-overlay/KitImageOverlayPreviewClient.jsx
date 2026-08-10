"use client";

import { useState } from "react";

import KitImageOverlayView from "@/components/kit/image-overlay/KitImageOverlay.view";
import {
  kitImageOverlayDefaultFixture,
  kitImageOverlayLongestTitleFixture,
  kitImageOverlayLovedFixture,
  kitImageOverlaySavedFixture,
} from "@/components/kit/image-overlay/KitImageOverlay.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitImageOverlayDefaultFixture },
  loved: { label: "Loved", props: kitImageOverlayLovedFixture },
  saved: { label: "Saved", props: kitImageOverlaySavedFixture },
  longest: { label: "Longest title", props: kitImageOverlayLongestTitleFixture },
};

export default function KitImageOverlayPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [localProps, setLocalProps] = useState(STATES.default.props);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. Interim shape, converts to the unified modal frame in batch 2."
  );

  function openState(key) {
    setActiveKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  return (
    <KitPreviewShell
      title="Kit Image Overlay (interim)"
      description="Full image, love, save, share. Converts to the unified modal frame in batch 2; do not extend this shape."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="mx-auto max-w-sm">
        <KitImageOverlayView
          {...localProps}
          onLove={() =>
            setLocalProps((current) => ({ ...current, isLoved: !current.isLoved }))
          }
          onSave={() =>
            setLocalProps((current) => ({ ...current, isSaved: !current.isSaved }))
          }
          onShare={() => setLastAction("Shared (local preview only).")}
          onClose={() => setLastAction("Closed (local preview only).")}
        />
      </div>
    </KitPreviewShell>
  );
}
