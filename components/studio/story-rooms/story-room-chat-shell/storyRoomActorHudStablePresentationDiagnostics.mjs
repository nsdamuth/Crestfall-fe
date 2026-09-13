import assert from "node:assert/strict";

import { buildStoryRoomStatusSurfacePresentation } from "./storyRoomStatusSurfacePresentation.js";

function surface({ hpStatus = "UNAVAILABLE", hpValue = "Unavailable", strengthStatus = "UNAVAILABLE", strengthValue = "Unavailable" } = {}) {
  return {
    id: "system_actor_mechanics",
    title: "Stable Hero",
    systemGenerated: true,
    variant: "ACTOR_MECHANICS",
    presentation: { host: "INLINE", placement: "BOTTOM" },
    subject: { actorCreationId: "pc-1", actorTitle: "Stable Hero" },
    readouts: [
      {
        id: "progression:progression:level",
        label: "Level",
        status: "RESOLVED",
        displayValue: "1",
        source: { domain: "PROGRESSION", kind: "POOL" },
        playerReadoutVisibility: "PRIMARY",
      },
      {
        id: "pool:stats:hp",
        label: "HP",
        status: hpStatus,
        displayValue: hpValue,
        source: { domain: "STATS_POOLS", kind: "POOL" },
        playerReadoutVisibility: "PRIMARY",
      },
      {
        id: "stat:stats:strength",
        label: "Strength",
        status: strengthStatus,
        displayValue: strengthValue,
        source: { domain: "STATS_POOLS", kind: "STAT" },
        playerReadoutVisibility: "PRIMARY",
      },
      {
        id: "stat:stats:hidden_formula",
        label: "Hidden Formula",
        status: "UNAVAILABLE",
        displayValue: "Unavailable",
        source: { domain: "STATS_POOLS", kind: "STAT" },
        playerReadoutVisibility: "HIDDEN",
      },
    ],
  };
}

const unavailable = buildStoryRoomStatusSurfacePresentation(surface());
const resolved = buildStoryRoomStatusSurfacePresentation(
  surface({
    hpStatus: "RESOLVED",
    hpValue: "25 / 25",
    strengthStatus: "RESOLVED",
    strengthValue: "10",
  })
);

assert.equal(unavailable.variant, "ACTOR_MECHANICS");
assert.equal(unavailable.pools.length, 1);
assert.equal(unavailable.primaryStats.length, 1);
assert.equal(unavailable.pools[0].id, resolved.pools[0].id);
assert.equal(unavailable.primaryStats[0].id, resolved.primaryStats[0].id);
assert.equal(unavailable.pools[0].isUnavailable, true);
assert.equal(resolved.pools[0].isUnavailable, false);
assert.equal(resolved.pools[0].displayValue, "25 / 25");
assert.equal(
  unavailable.readouts.some((entry) => entry.label === "Hidden Formula"),
  true,
  "Raw actor readouts retain hidden entries until visibility classification."
);
assert.equal(
  [...unavailable.pools, ...unavailable.primaryStats, ...unavailable.details].some(
    (entry) => entry.label === "Hidden Formula"
  ),
  false,
  "Hidden readouts must never enter visible HUD sections."
);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_actor_hud_stable_presentation_v1",
      status: "PASSED",
      unavailableValuesKeepStableVisibleSlots: true,
      stableReadoutKeysPreservedAcrossRefresh: true,
      valueResolutionUpdatesExistingSlots: true,
      hiddenReadoutsRemainHidden: true,
      gameSpecificHardcodingIntroduced: false,
    },
    null,
    2
  )
);
