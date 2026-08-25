import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const panels = read("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

test("live V2 Guided Build MilestoneCard owns visible full-card artwork", () => {
  assert.match(
    panels,
    /function MilestoneCard[\s\S]*const art = getGuidedMilestoneArt\(asset\)[\s\S]*<img[\s\S]*src=\{art\}/
  );
  assert.match(panels, /min-h-\[11\.5rem\]/);
  assert.match(panels, /absolute inset-0 h-full w-full object-cover object-center opacity-80/);
  assert.match(panels, /bg-gradient-to-r from-\[var\(--canvas\)\]/);
});

test("live milestone art has verified defaults for representative Guided Build tools", () => {
  for (const token of [
    '"Player Character": "/assets/characters/crestfall/sun-hee/profile.png"',
    '"Outfit / Clothing": "/assets/covers/crestfall-cloak-cover.png"',
    'Pose: "/assets/covers/crestfall-ballerina-cover.png"',
    'Narrator: "/assets/covers/crestfall-scrolls-cover.png"',
    '"Location Registry": "/assets/locations/aethelgard/amphitheater/profile.png"',
    '"Mechanics Module": "/assets/covers/crestfall-sundial-cover.png"',
  ]) {
    assert.equal(panels.includes(token), true, `missing default art mapping: ${token}`);
  }
});

test("Guided milestone artwork change targets the V2 renderer rather than legacy CreationStudio.view", () => {
  assert.match(panels, /function GuidedChapter[\s\S]*<MilestoneCard/);
  assert.match(panels, /export function StudioGuidedModeView/);
  assert.doesNotMatch(panels, /fetch\(|supabase|PostGraphile|services-api/i);
});
