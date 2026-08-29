import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC,
  projectStoryRoomToContinueItem,
  resolveStoryContinueImageSrc,
} from "../../../../../lib/shared/presentation/storiesPresentation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("assigned source Story media outranks the room opening-scene image", () => {
  const continueItem = { imageSrc: "/location/opening-scene.webp" };
  const sourceCreation = {
    id: "story-1",
    type: "ROOM_TEMPLATE",
    featuredMedia: [
      { imageUrl: "/story/primary.webp", label: "Primary", isPlaceholder: false },
      { imageUrl: "/story/alt.webp", label: "Alt 1", isPlaceholder: false },
    ],
  };

  assert.equal(
    resolveStoryContinueImageSrc(continueItem, sourceCreation),
    "/story/primary.webp"
  );
});

test("room opening-scene image remains the fallback when the Story has no assigned media", () => {
  const continueItem = { imageSrc: "/location/opening-scene.webp" };
  const sourceCreation = {
    id: "story-2",
    type: "ROOM_TEMPLATE",
    data: {},
  };

  assert.equal(
    resolveStoryContinueImageSrc(continueItem, sourceCreation),
    "/location/opening-scene.webp"
  );
});

test("image-less Story rooms use the shared Crestfall default hero", () => {
  const continueItem = { imageSrc: null };
  const sourceCreation = {
    id: "story-no-image",
    type: "ROOM_TEMPLATE",
    data: {},
  };

  assert.equal(
    resolveStoryContinueImageSrc(continueItem, sourceCreation),
    STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC
  );
  assert.equal(
    STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC,
    "/assets/covers/banner.png"
  );
  assert.equal(
    fs.existsSync(
      path.join(
        repoRoot,
        "public",
        STORY_CONTINUE_DEFAULT_HERO_IMAGE_SRC.replace(/^\//, "")
      )
    ),
    true
  );
});

test("placeholder Story media does not outrank a real opening-scene image", () => {
  const continueItem = { imageSrc: "/location/opening-scene.webp" };
  const sourceCreation = {
    id: "story-3",
    type: "ROOM_TEMPLATE",
    featuredMedia: [
      {
        imageUrl: "/assets/covers/crestfall-statue-cover.png",
        label: "Primary",
        isPlaceholder: true,
      },
    ],
  };

  assert.equal(
    resolveStoryContinueImageSrc(continueItem, sourceCreation),
    "/location/opening-scene.webp"
  );
});

test("raw creation media remains available through a projected Story source", () => {
  const continueItem = { imageSrc: "/location/opening-scene.webp" };
  const sourceCreation = {
    id: "story-4",
    imageSrc: "/assets/covers/crestfall-statue-cover.png",
    rawCreation: {
      id: "story-4",
      type: "ROOM_TEMPLATE",
      title: "Kessa's Test Story Template",
      data: {
        featured_media: [{ image_url: "/story/assigned.webp" }],
      },
    },
  };

  assert.equal(
    resolveStoryContinueImageSrc(continueItem, sourceCreation),
    "/story/assigned.webp"
  );
});

test("Home carries owned Story creations into its ViewModel image-authority join", () => {
  const serverData = read("lib/server/studio/getHomePageData.js");
  const viewModel = read("app/studio/v2/home/home/useHomeViewModel.js");

  assert.match(serverData, /ownedCreations: stories\.ownedCreations \|\| \[\]/);
  assert.match(viewModel, /ownedCreations = \[\]/);
  assert.match(viewModel, /storySourceCreationById/);
  assert.match(viewModel, /projectCreationsToStoryStartables\(ownedCreations/);
  assert.match(viewModel, /resolveStoryContinueImageSrc\(item, sourceCreation\)/);
});

test("Stories Continue cards use the shared source-Story image precedence", () => {
  const storiesView = read("app/studio/v2/stories/StoriesV2Live.jsx");

  assert.match(storiesView, /resolveStoryContinueImageSrc/);
  assert.match(
    storiesView,
    /imageSrc=\{resolveStoryContinueImageSrc\(item, sourceCreation\)\}/
  );
});
