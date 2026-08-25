import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  projectCreationToStoryStartable,
  projectStoryRoomToContinueItem,
} from "../../lib/shared/presentation/storiesPresentation.js";

function read(path) {
  return fs.readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

test("Story room projection preserves live Continue state and detects Storyline-backed Adventures", () => {
  const projected = projectStoryRoomToContinueItem({
    id: "room-1",
    title: "The Long Road",
    status: "ACTIVE",
    visibility: "PRIVATE",
    contentRating: "MATURE",
    lastActive: "2026-08-24T12:00:00.000Z",
    room: {
      data: {
        source: { type: "ROOM_TEMPLATE", templateId: "story-1" },
        openingHeroImage: { displayUrl: "/hero.png" },
      },
    },
    state: {
      state: {
        storyRuntime: {
          storylineRuntime: {
            storylineInstance: { storylineId: "adventure-1", status: "ACTIVE" },
          },
        },
      },
    },
  });

  assert.equal(projected.kind, "adventure");
  assert.equal(projected.sourceCreationId, "adventure-1");
  assert.equal(projected.imageSrc, "/hero.png");
  assert.equal(projected.ratingTier, "TEEN");
  assert.equal(projected.roomId, "room-1");
});

test("Story startable projection admits Character, Story, and Adventure while gating unsupported direct Adventure launch", () => {
  const character = projectCreationToStoryStartable({
    id: "character-1",
    type: "CHARACTER",
    title: "Mara",
    visibility: "PRIVATE",
    status: "APPROVED",
  });
  const story = projectCreationToStoryStartable({
    id: "story-1",
    type: "ROOM_TEMPLATE",
    title: "Lantern District",
    visibility: "PUBLIC",
    status: "APPROVED",
  });
  const adventure = projectCreationToStoryStartable({
    id: "adventure-1",
    type: "STORYLINE",
    title: "The Exile Cycle",
    visibility: "PUBLIC",
    status: "APPROVED",
  });

  assert.equal(character.kind, "character");
  assert.equal(character.playableNow, true);
  assert.equal(story.kind, "story");
  assert.equal(story.playableNow, true);
  assert.equal(adventure.kind, "adventure");
  assert.equal(adventure.playableNow, false);
});

test("V2 Stories route is server-backed and fuses live rooms, owned creations, and Community source data", () => {
  const page = read("app/studio/v2/stories/page.jsx");
  const data = read("lib/server/studio/getStoriesPageData.js");

  assert.match(page, /getStoriesPageData/);
  assert.match(page, /StoriesV2Live/);
  assert.doesNotMatch(page, /StoriesV2Mockup/);
  assert.match(data, /\/api\/studio\/story-rooms/);
  assert.match(data, /getMyCreationsPageData/);
  assert.match(data, /getCommunityCreationsPageData/);
});

test("V2 Stories uses canonical live room continuation, persisted layout, real deletion, and launch requirements", () => {
  const live = read("app/studio/v2/stories/StoriesV2Live.jsx");
  const controller = read("components/studio/story-rooms/hooks/useStoryLaunchController.js");
  const picker = read("app/studio/v2/stories/StoryLaunchRequirementsSheet.jsx");

  assert.match(live, /usePersistentViewMode/);
  assert.match(live, /cf\.stories\.viewMode/);
  assert.match(live, /\/studio\/story-rooms\//);
  assert.doesNotMatch(live, /router\.push\(`\/studio\/v2\/stories\/\$\{encodeURIComponent\(item\.roomId\)\}`\)/);
  assert.match(live, /deleteStoryRoom/);
  assert.match(live, /useStoryLaunchController/);
  assert.match(live, /item\.playableNow/);

  assert.match(controller, /prepareStoryCreationForLaunch/);
  assert.match(controller, /getStoryOpeningLocationStartConfig/);
  assert.match(controller, /getStoryPlayerCharacterStartConfig/);
  assert.match(controller, /getStoryImageStyleLaunchStartConfig/);
  assert.match(controller, /startStoryFromCreation/);
  assert.match(controller, /resolveStoryPostCreateNavigationHref/);

  assert.match(picker, /Starting location/);
  assert.match(picker, /Player character/);
  assert.match(picker, /Image style/);
  assert.match(picker, /Create temporary Story character/);
});

test("V2 Adventures is a live public Storyline catalogue with real engagement", () => {
  const page = read("app/studio/v2/adventures/page.jsx");
  const live = read("app/studio/v2/adventures/AdventuresLive.jsx");

  assert.match(page, /getCommunityCreationsPageData/);
  assert.match(page, /AdventuresLive/);
  assert.match(live, /projectCommunityCreations/);
  assert.match(live, /STORYLINE/);
  assert.match(live, /useCreationEngagementState/);
  assert.match(live, /toggleCreationLike/);
  assert.match(live, /toggleCreationBookmark/);
  assert.match(live, /\/studio\/creations\//);
});

test("Adventure catalogue does not fabricate a user-facing Storyline launch contract that the current runtime does not expose", () => {
  const live = read("app/studio/v2/adventures/AdventuresLive.jsx");
  const projection = read("lib/shared/presentation/storiesPresentation.js");

  assert.doesNotMatch(live, /startStoryFromCreation\s*\(/);
  assert.doesNotMatch(live, /onPlay\s*:/);
  assert.match(live, /Direct Storyline\/Adventure launch is intentionally withheld/);
  assert.match(projection, /playableNow:\s*type === "CHARACTER" \|\| type === "ROOM_TEMPLATE"/);
});

test("Stories retains a real authoring path while Adventures retains the real Storyline builder", () => {
  const stories = read("app/studio/v2/stories/StoriesV2Live.jsx");
  const adventures = read("app/studio/v2/adventures/AdventuresLive.jsx");
  const view = read("app/studio/v2/adventures/adventures/Adventures.view.jsx");

  assert.match(stories, /\/studio\/create\/room-template/);
  assert.match(adventures, /setBuilderOpen\(true\)/);
  assert.match(view, /StorylineBuilderShell|AdventureBuilder/);
});

test("W2E ownership stays out of the parallel Images and Account lanes", () => {
  const w2eOwnedFiles = [
    "app/studio/v2/adventures/adventures/Adventures.contract.js",
    "app/studio/v2/adventures/AdventuresLive.jsx",
    "app/studio/v2/adventures/page.jsx",
    "app/studio/v2/stories/StoriesV2Live.jsx",
    "app/studio/v2/stories/StoryLaunchRequirementsSheet.jsx",
    "app/studio/v2/stories/page.jsx",
    "components/studio/story-rooms/hooks/useStoryLaunchController.js",
    "lib/server/studio/getStoriesPageData.js",
    "lib/shared/presentation/storiesPresentation.js",
    "integration/crestfall-v2-convergence-w2/v2StoriesAdventuresLiveDiagnostics.mjs",
  ];

  assert.equal(w2eOwnedFiles.some((path) => path.includes("/images/")), false);
  assert.equal(w2eOwnedFiles.some((path) => path.includes("image-studio")), false);
  assert.equal(w2eOwnedFiles.some((path) => path.includes("/account/")), false);
});
