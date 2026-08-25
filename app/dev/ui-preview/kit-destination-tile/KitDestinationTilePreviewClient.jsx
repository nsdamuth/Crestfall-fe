"use client";

import { useState } from "react";

import KitDestinationTileView from "@/components/kit/destination-tile/KitDestinationTile.view";
import {
  KIT_DESTINATION_TILE_HOME_SET,
  kitDestinationTileLongestLabelFixture,
  kitDestinationTileLongestLineFixture,
  kitDestinationTileNoArtFixture,
} from "@/components/kit/destination-tile/KitDestinationTile.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const GRID_CLASSES =
  "grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4 min-[1100px]:gap-[var(--space-5)]";

const STATES = {
  allEight: { label: "All eight (Home set)" },
  noArt: { label: "No-art fallback" },
  longestLabel: { label: "Longest label" },
  longestLine: { label: "Longest supporting line" },
};

const NOTES = {
  allEight:
    "The full eight-tile Home set, one tile per non-Home section, in the same responsive grid Home will use: 2 per row under 700px, 3 at 700px, 4 at 1100px and up.",
  noArt:
    "No tile-specific art exists yet for any section; this is the no-art fallback surface (--surface-2), matching the creation-card no-art rule.",
  longestLabel:
    "Confirms a long section name truncates to one line without pushing the supporting line or breaking the tile.",
  longestLine:
    "Confirms a long supporting line clamps to two lines without overflowing the tile.",
};

const SINGLE_TILE_FIXTURE = {
  noArt: kitDestinationTileNoArtFixture,
  longestLabel: kitDestinationTileLongestLabelFixture,
  longestLine: kitDestinationTileLongestLineFixture,
};

export default function KitDestinationTilePreviewClient() {
  const [activeKey, setActiveKey] = useState("allEight");

  const tiles = activeKey === "allEight" ? KIT_DESTINATION_TILE_HOME_SET : [SINGLE_TILE_FIXTURE[activeKey]];

  return (
    <KitPreviewShell
      title="Kit Destination Tile"
      description="Compact picture tile carrying a section name and one short supporting line, routing outward on tap. Eight per Home, one per non-Home section."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={NOTES[activeKey]}
    >
      <div className={GRID_CLASSES}>
        {tiles.map((fixture) => (
          <KitDestinationTileView key={fixture.label} {...fixture} />
        ))}
      </div>
    </KitPreviewShell>
  );
}
