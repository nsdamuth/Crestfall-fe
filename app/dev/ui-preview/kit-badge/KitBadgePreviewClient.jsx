"use client";

import { useState } from "react";

import KitBadgeView from "@/components/kit/badge/KitBadge.view";
import {
  kitBadgeCanonArtFixture,
  kitBadgeCanonCanvasFixture,
  kitBadgeLongestLabelFixture,
  kitBadgeMetaFixture,
  kitBadgeStatusArtFixture,
  kitBadgeStatusCanvasFixture,
} from "@/components/kit/badge/KitBadge.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  canonCanvas: { label: "Canon, canvas", props: kitBadgeCanonCanvasFixture },
  canonArt: { label: "Canon, over art", props: kitBadgeCanonArtFixture },
  statusCanvas: { label: "Status, canvas", props: kitBadgeStatusCanvasFixture },
  statusArt: { label: "Status, over art", props: kitBadgeStatusArtFixture },
  meta: { label: "Meta", props: kitBadgeMetaFixture },
  longest: { label: "Longest label", props: kitBadgeLongestLabelFixture },
};

export default function KitBadgePreviewClient() {
  const [activeKey, setActiveKey] = useState("canonCanvas");
  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Badge"
      description="The constrained badge set: Canon is the only gold badge, every other category reads through the quiet ink family. Surface toggles between canvas and over-art recipes."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note="Badges are non-interactive labels. Rest state only, by shape law."
    >
      <div
        className={`flex min-h-[var(--space-20)] items-center justify-center rounded-[var(--radius-md)] p-[var(--space-8)] ${
          active.props.surface === "art"
            ? "bg-[image:var(--cat-canon)]"
            : "bg-[var(--surface-2)]"
        }`}
      >
        <KitBadgeView {...active.props} />
      </div>
    </KitPreviewShell>
  );
}
