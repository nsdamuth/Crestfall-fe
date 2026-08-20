import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("./useRoomTemplateOpeningSectionViewModel.js", import.meta.url),
  "utf8"
);

assert.match(source, /payload\?\.data\?\.imageLibrary\?\.images/);
assert.doesNotMatch(source, /payload\?\.data\?\.images/);
assert.match(source, /image\?\.canUseAsFeatured/);
assert.match(source, /image\?\.displayUrl/);

console.log("storyOpeningHeroImagePicker diagnostics passed");
