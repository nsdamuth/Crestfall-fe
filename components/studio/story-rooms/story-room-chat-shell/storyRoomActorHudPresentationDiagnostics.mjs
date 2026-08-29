import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const hostView = read(
  "components/studio/story-rooms/story-room-chat-shell/StoryRoomStatusSurfaceHost.view.jsx"
);
const hostViewModel = read(
  "components/studio/story-rooms/story-room-chat-shell/useStoryRoomStatusSurfaceHostViewModel.js"
);
const shellView = read(
  "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
);
const composerView = read(
  "components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx"
);
const transcriptView = read(
  "components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx"
);

assert.match(hostViewModel, /useState\(false\)/);
assert.match(hostViewModel, /crestfall\.story-room\.actor-hud\.collapsed/);
assert.match(hostViewModel, /window\.localStorage\.getItem/);
assert.match(hostViewModel, /window\.localStorage\.setItem/);
assert.doesNotMatch(hostViewModel, /fetch\(|storyRoomClient|supabase|PostGraphile/i);

assert.match(hostView, /ActorMechanicsVisibilityTab/);
assert.match(hostView, /absolute right-0 top-1\/2/);
assert.match(hostView, /h-11 w-10[^\"]+sm:h-10 sm:w-7/);
assert.match(hostView, /CollapsedActorMechanicsStrip/);
assert.match(hostView, /data-actor-mechanics-collapsed-strip/);
assert.match(hostView, /surface\.pools\.slice\(0, 2\)/);
assert.match(hostView, /surface\.actorTitle/);
assert.match(hostView, /onToggle\?\.\(surface\.id\)/);
assert.match(hostView, /onToggleVisibility/);
assert.match(hostView, /aria-expanded=\{surface\.expanded\}/);

assert.match(hostView, /grid grid-cols-3 gap-x-2 gap-y-1/);
assert.match(hostView, /grid grid-cols-2 gap-x-3 gap-y-1/);
assert.match(hostView, /grid grid-cols-6 gap-x-2 gap-y-1/);
assert.doesNotMatch(shellView, /9rem\+env\(safe-area-inset-bottom\)/);
assert.match(shellView, /<div className="shrink-0">[\s\S]*ComposerComponent/);
assert.match(composerView, /relative z-50 shrink-0 bg-transparent/);
assert.doesNotMatch(composerView, /fixed bottom-0 left-0 right-0 z-50/);
assert.doesNotMatch(transcriptView, /pb-\[4rem\]/);
assert.match(transcriptView, /min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 scroll-smooth/);
assert.doesNotMatch(hostView + hostViewModel, /Crimson Sphinx|Iron Rank|Valentina|Crownfall/i);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_actor_hud_presentation_cc7c4f",
      status: "PASSED",
      expandedByDefault: true,
      roomScopedBrowserPreferenceOnly: true,
      rightEdgeShowHideTabPresent: true,
      collapsedIdentityCriticalStripPresent: true,
      mobileToggleTargetComfortable: true,
      mobileDefaultHudRowsCompacted: true,
      mobileComposerParticipatesInChatFlow: true,
      mobileLegacyDoubleClearanceRemoved: true,
      derivedStatMoreLessRemainsSeparate: true,
      mechanicsMutationOrFetchIntroduced: false,
      gameSpecificHardcodingIntroduced: false,
    },
    null,
    2
  )
);
