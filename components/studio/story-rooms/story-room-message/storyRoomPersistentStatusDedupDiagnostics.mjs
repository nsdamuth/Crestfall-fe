import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  getPersistentSnapshotBlocks,
  shouldSuppressPersistentSnapshotBlock,
  stripPersistentSnapshotBlocksFromBody,
} from "./storyRoomPersistentStatusDedup.js";

const statsText = [
  "Valentina — Stats & Pools",
  "HP: 230 / 230",
  "Stamina: 180 / 180",
  "Mana: 230 / 230",
  "Strength: 10",
  "Agility: 10",
].join("\n");
const progressionText = [
  "Valentina — Progression",
  "Level: 1",
  "Experience: 0",
  "Tier: Novice",
].join("\n");
const mutationText = [
  "Skills — Advancement Result",
  "Skill: Appraisal",
  "Rank: 2",
].join("\n");

const presentation = {
  contractVersion: "chat.responsePresentation.v1",
  statusBlocks: [
    {
      id: "stats_pools_actor_1",
      slot: "stats_pools_actor_1",
      placement: "response_end",
      renderedText: statsText,
    },
    {
      id: "progression_actor_1",
      slot: "progression_actor_1",
      placement: "response_end",
      renderedText: progressionText,
    },
    {
      id: "skills_advancement_result",
      slot: "skills_advancement_result",
      placement: "response_end",
      renderedText: mutationText,
    },
  ],
};

assert.equal(
  shouldSuppressPersistentSnapshotBlock(
    presentation.statusBlocks[0],
    ["STATS_POOLS"]
  ),
  true
);
assert.equal(
  shouldSuppressPersistentSnapshotBlock(
    presentation.statusBlocks[1],
    ["PROGRESSION"]
  ),
  true
);
assert.equal(
  shouldSuppressPersistentSnapshotBlock(
    presentation.statusBlocks[2],
    ["STATS_POOLS", "PROGRESSION"]
  ),
  false,
  "mutation/result blocks must remain in transcript"
);
assert.equal(
  getPersistentSnapshotBlocks(presentation, ["STATS_POOLS", "PROGRESSION"])
    .length,
  2
);

const narrative = "The registrar closes the ledger and looks back to you.";
const legacyBody = `${narrative}\n\n${statsText}\n\n${progressionText}`;
assert.equal(
  stripPersistentSnapshotBlocksFromBody(
    legacyBody,
    presentation,
    ["STATS_POOLS", "PROGRESSION"]
  ),
  narrative,
  "persisted snapshot blocks must be removed from fallback/legacy body when HUD owns those domains"
);
assert.equal(
  stripPersistentSnapshotBlocksFromBody(
    `${narrative}\n\n${mutationText}`,
    {
      statusBlocks: [presentation.statusBlocks[2]],
    },
    ["STATS_POOLS", "PROGRESSION"]
  ),
  `${narrative}\n\n${mutationText}`,
  "deterministic action-result feedback is not a persistent snapshot duplicate"
);
assert.equal(
  stripPersistentSnapshotBlocksFromBody(
    `${narrative}\n\n${statsText}`,
    { statusBlocks: [presentation.statusBlocks[0]] },
    []
  ),
  `${narrative}\n\n${statsText}`,
  "snapshot remains visible when no persistent HUD owns its domain"
);

const headingOnlyIdentity = {
  id: "legacy_status_1",
  slot: "legacy_status_1",
  renderedText: statsText,
};
assert.equal(
  shouldSuppressPersistentSnapshotBlock(headingOnlyIdentity, ["STATS_POOLS"]),
  true,
  "known passive snapshot heading remains suppressible across older id shapes"
);

const messageVm = readFileSync(
  new URL("./useStoryRoomMessageViewModel.js", import.meta.url),
  "utf8"
);
const hostView = readFileSync(
  new URL("../story-room-chat-shell/StoryRoomStatusSurfaceHost.view.jsx", import.meta.url),
  "utf8"
);
assert.match(messageVm, /stripPersistentSnapshotBlocksFromBody/);
assert.match(hostView, /surface\.progression/);
assert.match(hostView, /surface\.pools/);
assert.match(hostView, /surface\.wallets/);
assert.match(hostView, /surface\.primaryStats/);
assert.match(hostView, /surface\.expanded[\s\S]*surface\.details/);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_persistent_status_snapshot_dedup_v1",
      status: "PASSED",
      passiveStatsSnapshotSuppressedWhenHudOwnsDomain: true,
      passiveProgressionSnapshotSuppressedWhenHudOwnsDomain: true,
      fallbackLegacyBodyExactSnapshotRemoved: true,
      deterministicMutationResultBlocksPreserved: true,
      snapshotsRemainWhenPersistentHudAbsent: true,
      olderSnapshotIdShapesCoveredByDeterministicHeading: true,
      compactActorHudOwnsProgressionPoolsWalletAndPrimaryStats: true,
      derivedStatsRemainExpandableOnly: true,
    },
    null,
    2
  )
);
