import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS,
  createEmptyPoolDefinition,
  createEmptyStatDefinition,
} from "./StatsPoolsEditor.contract.js";
import {
  buildStoryRoomStatusSurfacePresentation,
} from "../../../story-rooms/story-room-chat-shell/storyRoomStatusSurfacePresentation.js";

const values = STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS.map(
  (entry) => entry.value
);
assert.deepEqual(values, ["PRIMARY", "DETAIL", "HIDDEN"]);
assert.equal(createEmptyStatDefinition().playerReadout.visibility, "PRIMARY");
assert.equal(createEmptyPoolDefinition().playerReadout.visibility, "PRIMARY");

const presentation = buildStoryRoomStatusSurfacePresentation({
  id: "system_actor_mechanics",
  title: "Test Hero",
  systemGenerated: true,
  variant: "ACTOR_MECHANICS",
  subject: { actorCreationId: "actor-1", actorTitle: "Test Hero" },
  readouts: [
    {
      id: "pool-primary",
      label: "Health",
      status: "RESOLVED",
      displayValue: "10 / 10",
      playerReadoutVisibility: "PRIMARY",
      source: { domain: "STATS_POOLS", kind: "POOL" },
    },
    {
      id: "stat-primary",
      label: "Strength",
      status: "RESOLVED",
      displayValue: "10",
      derived: false,
      playerReadoutVisibility: "PRIMARY",
      source: { domain: "STATS_POOLS", kind: "STAT" },
    },
    {
      id: "stat-detail",
      label: "Strength x3",
      status: "RESOLVED",
      displayValue: "30",
      derived: true,
      playerReadoutVisibility: "DETAIL",
      source: { domain: "STATS_POOLS", kind: "STAT" },
    },
    {
      id: "stat-hidden-defense",
      label: "Internal Formula",
      status: "RESOLVED",
      displayValue: "999",
      derived: true,
      playerReadoutVisibility: "HIDDEN",
      source: { domain: "STATS_POOLS", kind: "STAT" },
    },
  ],
});

assert.equal(presentation.pools.length, 1);
assert.equal(presentation.primaryStats.length, 1);
assert.equal(presentation.details.length, 1);
assert.equal(presentation.details[0].label, "Strength x3");
assert.equal(
  [...presentation.pools, ...presentation.primaryStats, ...presentation.details].some(
    (entry) => entry.label === "Internal Formula"
  ),
  false
);

const viewModelSource = fs.readFileSync(
  new URL("./useStatsPoolsEditorViewModel.js", import.meta.url),
  "utf8"
);
const viewSource = fs.readFileSync(
  new URL("./StatsPoolsEditor.view.jsx", import.meta.url),
  "utf8"
);
const jsonValidationSource = fs.readFileSync(
  new URL("../stats-pools-json-editor/statsPoolsJsonEditor.validation.js", import.meta.url),
  "utf8"
);

assert.match(
  viewModelSource,
  /derivedEnabled \? "DETAIL" : "PRIMARY"/
);
assert.match(viewModelSource, /playerReadout\.visibility/);
assert.match(viewSource, /Player Readout/);
assert.match(viewSource, /PlayerReadoutVisibilityField/);
assert.match(jsonValidationSource, /STATS_POOLS_PLAYER_READOUT_VISIBILITY_OPTIONS/);

console.log(
  JSON.stringify(
    {
      diagnostic: "stats_pools_player_readout_policy_cc7c4g",
      status: "PASSED",
      creatorVisibilityOptions: values,
      ordinaryStatDefaultPrimary: true,
      poolDefaultPrimary: true,
      derivedStatFallbackDetail: true,
      editorControlWired: true,
      jsonAuthoringValidationWired: true,
      footerUsesAuthoritativeDetailTier: true,
      footerDefensiveHiddenFilter: true,
    },
    null,
    2
  )
);
