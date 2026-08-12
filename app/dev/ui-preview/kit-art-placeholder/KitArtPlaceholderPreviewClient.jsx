"use client";

import { useState } from "react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";
import {
  kitArtPlaceholderLargeFixture,
  kitArtPlaceholderMediumFixture,
  kitArtPlaceholderSmallFixture,
} from "@/components/kit/art-placeholder/KitArtPlaceholder.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  sm: { label: "Small", fixture: kitArtPlaceholderSmallFixture },
  md: { label: "Medium", fixture: kitArtPlaceholderMediumFixture },
  lg: { label: "Large", fixture: kitArtPlaceholderLargeFixture },
};

const NOTES = {
  sm: "The reference-slot size: small tap targets, thumbnail-scale fallbacks.",
  md: "The default size: card and tile art fallbacks, quick-create preview slot.",
  lg: "The showcase size: the creator profile showcase empty state.",
};

export default function KitArtPlaceholderPreviewClient() {
  const [activeKey, setActiveKey] = useState("md");
  const state = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Art Placeholder"
      description="The shared empty-art-slot mark: a geometric gold line-art camellia, centered on the elevated surface token. Renders in place of a blank box anywhere an art slot has no art yet."
      states={Object.entries(STATES).map(([key, entry]) => ({ key, label: entry.label }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={NOTES[activeKey]}
    >
      <div className="aspect-square w-64 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
        <KitArtPlaceholderView {...state.fixture} />
      </div>
    </KitPreviewShell>
  );
}
