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
  "Fixture-only. The surrounding padded wrapper stands in for the studio shell's own section gutter (--space-5/8/10); the rail's scrollport and fade terminate flush with that gutter at every width, matching every other page component's edge. Arrows appear from 700px up.";

export default function KitRailPreviewClient() {
  const [activeKey, setActiveKey] = useState("topRated");

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Rail"
      description="Horizontally scrolling rail that holds existing cards. Native scroll everywhere, gold arrows from 700px up, no card-level changes."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={activeKey === "empty" ? EMPTY_NOTE : DEFAULT_NOTE}
    >
      <div className="relative -m-[var(--space-6)] overflow-hidden">
        <div className="px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
          <KitRailView {...active.props} />
        </div>
      </div>
    </KitPreviewShell>
  );
}
