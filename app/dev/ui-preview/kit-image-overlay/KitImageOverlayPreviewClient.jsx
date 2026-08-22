"use client";

import { useState } from "react";

import KitImageOverlay from "@/components/kit/KitImageOverlay";
import {
  kitImageOverlayDefaultFixture,
  kitImageOverlayLongestTitleFixture,
  kitImageOverlayLovedFixture,
  kitImageOverlayNoImageFixture,
  kitImageOverlaySavedFixture,
  kitImageOverlaySquareFixture,
  kitImageOverlayTallFixture,
  kitImageOverlayTinyFixture,
  kitImageOverlayWideFixture,
} from "@/components/kit/image-overlay/KitImageOverlay.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitImageOverlayDefaultFixture },
  loved: { label: "Loved", props: kitImageOverlayLovedFixture },
  saved: { label: "Saved", props: kitImageOverlaySavedFixture },
  longest: { label: "Longest title", props: kitImageOverlayLongestTitleFixture },
  noImage: { label: "No image", props: kitImageOverlayNoImageFixture },
  wide: { label: "Wide image", props: kitImageOverlayWideFixture },
  tall: { label: "Tall image", props: kitImageOverlayTallFixture },
  square: { label: "Square image", props: kitImageOverlaySquareFixture },
  tiny: { label: "Tiny image", props: kitImageOverlayTinyFixture },
};

export default function KitImageOverlayPreviewClient() {
  const [openKey, setOpenKey] = useState(null);
  const [localProps, setLocalProps] = useState(null);
  const [lastAction, setLastAction] = useState(
    "Choose a fixture to open the overlay, now composed on the unified modal frame."
  );

  function openState(key) {
    setOpenKey(key);
    setLocalProps(STATES[key].props);
    setLastAction(`Opened the ${STATES[key].label} fixture.`);
  }

  return (
    <KitPreviewShell
      title="Kit Image Overlay"
      description="Full image, the B7 six-icon header row, and the B7 bottom bar, composed on the unified modal frame (KitModalFrame). Backdrop click, Escape, and the close control all dismiss."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={openKey}
      onSelectState={openState}
      note={lastAction}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {Object.entries(STATES).map(([key, state]) => (
          <button
            key={key}
            type="button"
            onClick={() => openState(key)}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            Open {state.label}
          </button>
        ))}
      </div>

      {openKey && localProps && (
        <KitImageOverlay
          {...localProps}
          onLove={() =>
            setLocalProps((current) => ({ ...current, isLoved: !current.isLoved }))
          }
          onSave={() =>
            setLocalProps((current) => ({ ...current, isSaved: !current.isSaved }))
          }
          onShare={() => setLastAction("Shared (local preview only).")}
          onDelete={() => setLastAction("Deleted, past the confirm step (local preview only).")}
          onReport={() => setLastAction("Reported (local preview only).")}
          onDetails={() => setLastAction("Opened details (local preview only).")}
          onDownload={() => setLastAction("Downloaded (local preview only).")}
          onGenerateVariant={() => setLastAction("Generate Variant (local preview only).")}
          onClose={() => {
            setOpenKey(null);
            setLastAction("Closed (local preview only).");
          }}
        />
      )}
    </KitPreviewShell>
  );
}
