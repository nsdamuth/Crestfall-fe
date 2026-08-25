import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("live Adventures Build an Adventure routes to the full Storyline builder", () => {
  const live = read("app/studio/v2/adventures/AdventuresLive.jsx");

  assert.match(live, /ctaLabel:\s*"Build an Adventure"/);
  assert.match(live, /router\.push\("\/studio\/create\/storyline"\)/);
  assert.doesNotMatch(live, /setBuilderOpen\(true\)/);
  assert.doesNotMatch(live, /isBuilderOpen=\{builderOpen\}/);
});

test("the canonical Storyline builder page remains available", () => {
  const builderPage = read("app/studio/create/storyline/page.js");
  assert.match(builderPage, /Storyline|storyline/i);
});

test("fixture Adventures may retain its modal-only design harness", () => {
  const view = read("app/studio/v2/adventures/adventures/Adventures.view.jsx");
  const fixtureVm = read("app/studio/v2/adventures/adventures/useAdventuresViewModel.js");

  assert.match(view, /StorylineBuilderShell/);
  assert.match(fixtureVm, /setIsBuilderOpen\(true\)/);
});
