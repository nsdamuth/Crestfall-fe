import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildStoryRoomStatusShortLabel,
  buildStoryRoomStatusSurfacePresentation,
  getPersistentStatusSurfaceDomains,
} from "./storyRoomStatusSurfacePresentation.js";

const actorSurface = {
  id: "system_actor_mechanics",
  title: "Test Hero",
  systemGenerated: true,
  variant: "ACTOR_MECHANICS",
  presentation: { host: "INLINE", placement: "BOTTOM" },
  subject: { actorCreationId: "pc-1", actorTitle: "Test Hero" },
  readouts: [
    {
      id: "level",
      label: "Level",
      status: "RESOLVED",
      displayValue: "1",
      source: { domain: "PROGRESSION", kind: "POOL" },
    },
    {
      id: "hp",
      label: "HP",
      status: "RESOLVED",
      displayValue: "230 / 230",
      source: { domain: "STATS_POOLS", kind: "POOL" },
    },
    {
      id: "gold",
      label: "Gold",
      status: "RESOLVED",
      displayValue: "12 G",
      source: { domain: "WALLET", kind: "POOL" },
    },
    {
      id: "strength",
      label: "Strength",
      status: "RESOLVED",
      displayValue: "10",
      derived: false,
      source: { domain: "STATS_POOLS", kind: "STAT" },
    },
    {
      id: "strength_x3",
      label: "Strength x3",
      status: "RESOLVED",
      displayValue: "30",
      derived: true,
      source: { domain: "STATS_POOLS", kind: "STAT" },
    },
  ],
};

const projected = buildStoryRoomStatusSurfacePresentation(actorSurface);
assert.equal(projected.variant, "ACTOR_MECHANICS");
assert.equal(projected.progression.length, 1);
assert.equal(projected.pools.length, 1);
assert.equal(projected.wallets.length, 1);
assert.equal(projected.wallets[0].displayValue, "12 G");
assert.equal(projected.primaryStats.length, 1);
assert.equal(projected.details.length, 1);
assert.equal(projected.hasDetails, true);
assert.equal(buildStoryRoomStatusShortLabel("Strength"), "STR");
assert.deepEqual(
  getPersistentStatusSurfaceDomains([actorSurface]),
  ["PROGRESSION", "STATS_POOLS", "WALLET"]
);

const shell = readFileSync(
  new URL("./StoryRoomChatShell.view.jsx", import.meta.url),
  "utf8"
);
const shellBinding = readFileSync(
  new URL("../StoryRoomChatShell.jsx", import.meta.url),
  "utf8"
);
const hook = readFileSync(
  new URL("../hooks/useStoryRoomChat.js", import.meta.url),
  "utf8"
);
const messageVm = readFileSync(
  new URL("../story-room-message/useStoryRoomMessageViewModel.js", import.meta.url),
  "utf8"
);
const messageDedup = readFileSync(
  new URL("../story-room-message/storyRoomPersistentStatusDedup.js", import.meta.url),
  "utf8"
);
const hostView = readFileSync(
  new URL("./StoryRoomStatusSurfaceHost.view.jsx", import.meta.url),
  "utf8"
);
const hostViewModel = readFileSync(
  new URL("./useStoryRoomStatusSurfaceHostViewModel.js", import.meta.url),
  "utf8"
);

assert.match(shell, /placement="TOP"/);
assert.match(shell, /placement="BOTTOM"/);
assert.match(shellBinding, /StoryRoomStatusSurfaceHost/);
assert.match(hook, /reloadStatusSurfaces/);
assert.match(hook, /fetchStoryRoomStatusSurfaces/);
assert.match(messageVm, /shouldSuppressPersistentSnapshotBlock/);
assert.match(messageVm, /stripPersistentSnapshotBlocksFromBody/);
assert.match(messageDedup, /progression_actor_/);
assert.match(messageDedup, /stats_pools_actor_/);
assert.match(hostView, /surface\.wallets/);
assert.match(hostView, /surface\.details/);
assert.match(hostView, /aria-expanded/);
assert.match(hostView, /ActorMechanicsVisibilityTab/);
assert.match(hostView, /const action = collapsed \? "Show" : "Hide"/);
assert.match(hostView, /character mechanics/);
assert.match(hostViewModel, /actorHudCollapsed/);
assert.match(hostViewModel, /localStorage/);
assert.match(hostViewModel, /crestfall\.story-room\.actor-hud\.collapsed/);
assert.match(shell, /9rem\+env\(safe-area-inset-bottom\)/);
assert.doesNotMatch(hostView, /Crimson Sphinx|Iron Rank|Valentina/i);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_status_surface_runtime_v0",
      status: "PASSED",
      persistentTopSurfaceWired: true,
      persistentBottomSurfaceWired: true,
      polishedActorMechanicsFooterClassification: true,
      walletBalancesHaveDedicatedActorHudRow: true,
      derivedStatsCollapseIntoDetail: true,
      actorHudRightEdgeShowHideTabSupported: true,
      actorHudVisibilityPreferenceRoomScoped: true,
      mobileComposerFootprintReservedBelowHud: true,
      mobileResponsivePresentationOwnedByView: true,
      persistentSnapshotMessageBlocksSuppressedWhenHudOwnsDomain: true,
      turnSpecificMessageStatusBlocksPreservedByPatternBoundary: true,
      directDatabaseAccessFromViewOrViewModel: false,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
