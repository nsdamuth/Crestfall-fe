import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const adapter = read("app/studio/v2/images/images-live/useImagesV2LiveViewModel.js");
const view = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");
const contract = read("components/kit/image-creator-panel/KitImageCreatorPanel.contract.js");
const fixtures = read("components/kit/image-creator-panel/KitImageCreatorPanel.fixtures.js");

test("live V2 adapter projects the existing Creation image into selected slot state", () => {
  assert.match(adapter, /imageSrc:\s*String\(value\.imageUrl \|\| value\.image_url \|\| ""\)/);
});

test("Kit creator contract carries a display-ready image without adding transport ownership", () => {
  assert.match(contract, /imageSrc\?: string/);
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|postgraphile|\/api\//i);
});

test("filled visual ingredients render their image as the dominant slot treatment", () => {
  assert.match(view, /const imageSrc = String\(state\.selection\?\.imageSrc/);
  assert.match(view, /<img[\s\S]*src=\{imageSrc\}[\s\S]*object-cover/);
  assert.match(view, /bg-gradient-to-t/);
});

test("visual slot remains editable and removable", () => {
  assert.match(view, /aria-label=\{`\$\{hasSelection \? "Change" : "Select"\} \$\{def\.label\}/);
  assert.match(view, /ClearButton(?:\s+overlay)?\s+label=\{`Clear \$\{def\.label\}`\}/);
});

test("fixture coverage includes visual Character and Location selections", () => {
  assert.match(fixtures, /Vesper Ash[\s\S]{0,160}imageSrc:/);
  assert.match(fixtures, /Harborfront at Dusk[\s\S]{0,180}imageSrc:/);
});
