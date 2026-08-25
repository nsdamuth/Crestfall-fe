import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const viewPath = path.join(
  repoRoot,
  "components/studio/create/creation-studio/CreationStudio.view.jsx"
);
const view = fs.readFileSync(viewPath, "utf8");

const expectedArt = [
  "/assets/characters/crestfall/lux/profile.png",
  "/assets/characters/crestfall/sun-hee/profile.png",
  "/assets/locations/aethelgard/amphitheater/profile.png",
  "/assets/covers/crestfall-cloak-cover.png",
  "/assets/covers/crestfall-ballerina-cover.png",
  "/assets/covers/crestfall-scrolls-cover.png",
  "/assets/covers/crestfall-book-cover.png",
  "/assets/covers/crestfall-compass-cover.png",
];

test("Guided milestone artwork renders through a real full-bleed img element", () => {
  assert.match(
    view,
    /function GuidedMilestoneArtwork[\s\S]*<img[\s\S]*src=\{image\}[\s\S]*h-full w-full object-cover/
  );
  assert.doesNotMatch(
    view,
    /function GuidedMilestoneArtwork[\s\S]{0,1200}backgroundImage:/
  );
});

test("Guided milestone artwork is intentionally visible under a readable overlay", () => {
  assert.match(view, /opacity-82 saturate-85/);
  assert.match(view, /opacity-90 saturate-95/);
  assert.match(view, /bg-gradient-to-r from-black\/88 via-black\/58 to-black\/18/);
});

test("verified milestone art files exist in the public tree", () => {
  for (const url of expectedArt) {
    const diskPath = path.join(repoRoot, "public", url.replace(/^\//, ""));
    assert.equal(fs.existsSync(diskPath), true, `missing guided artwork: ${url}`);
  }
});
