"use client";

import { useState } from "react";

import KitRailView from "@/components/kit/rail/KitRail.view";
import {
  kitRailCreatorsToFollowFixture,
  kitRailEmptyFixture,
  kitRailFromTheCommunityFixture,
  kitRailLongestContentFixture,
  kitRailOneCardFixture,
  kitRailRecentlyAddedFixture,
  kitRailTopRatedFixture,
  kitRailTwoCardFixture,
} from "@/components/kit/rail/KitRail.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";
import KitRailVariantsPreview from "./KitRailVariantsPreview";

const STATES = {
  topRated: { label: "Top rated", props: kitRailTopRatedFixture },
  recentlyAdded: { label: "Recently added", props: kitRailRecentlyAddedFixture },
  fromTheCommunity: { label: "From the community", props: kitRailFromTheCommunityFixture },
  creatorsToFollow: { label: "Creators to follow", props: kitRailCreatorsToFollowFixture },
  oneCard: { label: "One card", props: kitRailOneCardFixture },
  twoCard: { label: "Two cards", props: kitRailTwoCardFixture },
  empty: { label: "Empty (renders nothing)", props: kitRailEmptyFixture },
  longest: { label: "Longest content", props: kitRailLongestContentFixture },
};

const EMPTY_NOTE =
  "This is the empty-rail state. By ruling, a rail with nothing in it renders nothing at all, head included. A blank panel below is the correct, expected render for this fixture, not a bug.";

const DEFAULT_NOTE =
  "Fixture-only. The surrounding padded wrapper stands in for the studio shell's own section gutter (--space-5/8/10) so the rail's edge-bleed scrollport cancels it the same way it will on a real page. Arrows appear from 700px up.";

const VARIANTS_NOTE =
  "Comparison surface for OPEN items 31, 33, and 34. Preview-local only: A, D, and G render the real, unmodified rail; the rest are static mockups built for this route. Nothing here changes the shipped rail package.";

const VIEW_MODES = [
  { key: "states", label: "Fixture states" },
  { key: "variants", label: "Variants (31, 33, 34)" },
];

export default function KitRailPreviewClient() {
  const [viewMode, setViewMode] = useState("states");
  const [activeKey, setActiveKey] = useState("topRated");

  const active = STATES[activeKey];
  const isVariants = viewMode === "variants";

  return (
    <KitPreviewShell
      title="Kit Rail"
      description="Horizontally scrolling rail that holds existing cards. Native scroll everywhere, gold arrows from 700px up, no card-level changes."
      states={
        isVariants
          ? []
          : Object.entries(STATES).map(([key, state]) => ({
              key,
              label: state.label,
            }))
      }
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={isVariants ? VARIANTS_NOTE : activeKey === "empty" ? EMPTY_NOTE : DEFAULT_NOTE}
    >
      <div className="mb-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => setViewMode(mode.key)}
            className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition-colors ${
              viewMode === mode.key
                ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {isVariants ? (
        <KitRailVariantsPreview />
      ) : (
        <div className="relative -m-[var(--space-6)] overflow-hidden">
          <div className="px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
            <KitRailView {...active.props} />
          </div>
        </div>
      )}
    </KitPreviewShell>
  );
}
