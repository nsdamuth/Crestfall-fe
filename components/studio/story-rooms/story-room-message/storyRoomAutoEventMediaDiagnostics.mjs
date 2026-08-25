import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("Story message contract exposes automatic event media", () => {
  const contract = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.contract.js"
  );
  assert.match(contract, /AUTO_EVENT_MEDIA/);
  assert.match(contract, /CHARACTER_EVENT_IMAGE/);
  assert.match(contract, /LOCATION_EVENT_IMAGE/);
  assert.match(contract, /MEDIA: "MEDIA"/);
});

test("Story message projection consumes persisted autoEventMedia metadata", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );
  assert.match(vm, /metadata\?\.autoEventMedia/);
  assert.match(vm, /media\.displayUrl/);
  assert.match(vm, /contentType: autoEventMedia/);
  assert.match(vm, /media: autoEventMedia/);
});

test("automatic media suppresses placeholder text presentation", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );
  assert.match(vm, /const presentation = autoEventMedia \? null : getValidatedPresentation/);
  assert.match(view, /return <AutoEventMediaMessage media=\{media\} \/>/);
});

test("automatic event image renders the live display URL", () => {
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );
  assert.match(view, /src=\{media\.displayUrl\}/);
  assert.match(view, /alt=\{media\.altText \|\| "Story image"\}/);
  assert.match(view, /maxHeight: "26rem"/);
});

test("location media keeps its location caption while character media stays image-first", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );
  assert.match(vm, /Establishing image for/);
  assert.match(vm, /Character image for/);
  assert.match(view, /isLocation && media\.caption/);
});
