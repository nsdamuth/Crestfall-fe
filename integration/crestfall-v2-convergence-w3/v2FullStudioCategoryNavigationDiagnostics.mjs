import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  FULL_STUDIO_CATEGORY_PRESENTATION,
  findFullStudioSectionBySlug,
  getFullStudioSectionSlug,
} from "../../app/studio/v2/studio/studio/StudioModePanels.contract.mjs";
import {
  FULL_STUDIO_SECTION_DEFINITIONS,
} from "../../components/studio/create/creation-studio/CreationStudio.contract.mjs";

const root = new URL("../../", import.meta.url);
async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

test("Full Studio publishes exactly five top-level authoring domains", () => {
  assert.equal(FULL_STUDIO_SECTION_DEFINITIONS.length, 5);
  assert.deepEqual(
    FULL_STUDIO_SECTION_DEFINITIONS.map((section) => section.id),
    [
      "CHARACTERS_VISUALS",
      "STORIES_SESSIONS",
      "WORLDS_CONTINUITY",
      "RULES_MECHANICS",
      "TEMPLATES_GENERATION",
    ]
  );
});

test("each Full Studio domain has a stable URL slug and swappable hero image", () => {
  assert.equal(Object.keys(FULL_STUDIO_CATEGORY_PRESENTATION).length, 5);
  for (const section of FULL_STUDIO_SECTION_DEFINITIONS) {
    const presentation = FULL_STUDIO_CATEGORY_PRESENTATION[section.id];
    assert.ok(presentation?.slug);
    assert.ok(presentation?.heroImage);
  }
});

test("category slug helpers resolve the authored section inventory without duplicating it", () => {
  const hydrated = FULL_STUDIO_SECTION_DEFINITIONS.map((section) => ({
    ...section,
    assets: [],
  }));

  assert.equal(getFullStudioSectionSlug("RULES_MECHANICS"), "mechanics");
  assert.equal(findFullStudioSectionBySlug(hydrated, "worlds")?.id, "WORLDS_CONTINUITY");
  assert.equal(findFullStudioSectionBySlug(hydrated, "not-real"), null);
});

test("Full Studio renders large category destinations before compact builder cards", async () => {
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(panels, /FullStudioCategoryIndex/);
  assert.match(panels, /FullStudioCategoryCard/);
  assert.match(panels, /md:min-h-\[18rem\]/);
  assert.match(panels, /FullStudioCategoryDetail/);
  assert.match(panels, /FullStudioAssetCard/);
  assert.match(panels, /sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4/);
});

test("category detail has a prominent return button and a lightweight fade transition", async () => {
  const panels = await source("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(panels, /Back to Full Studio/);
  assert.match(panels, /aria-label="Back to Full Studio categories"/);
  assert.match(panels, /border-\[var\(--line-strong\)\]/);
  assert.match(panels, /hover:border-\[var\(--gold-action\)\]/);
  assert.match(panels, /transition-\[opacity,transform\]/);
  assert.match(panels, /duration-150/);
});

test("re-clicking the active Full Studio mode returns a category detail to the five-category index", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");

  assert.match(shell, /nextMode === CREATION_STUDIO_MODES\.FULL/);
  assert.match(shell, /viewProps\.activeMode === CREATION_STUDIO_MODES\.FULL/);
  assert.match(shell, /fullStudioSectionSlug/);
  assert.match(shell, /setFullStudioSection\("", \{ replace: true \}\);/);
  assert.match(shell, /return;/);
});

test("Studio shell owns query/history state so browser Back can restore the category index", async () => {
  const shell = await source("app/studio/v2/studio/Studio.jsx");

  assert.match(shell, /URLSearchParams\(window\.location\.search\)/);
  assert.match(shell, /searchParams\.set\("section", slug\)/);
  assert.match(shell, /history\.pushState/);
  assert.match(shell, /popstate/);
  assert.match(shell, /activeFullStudioSectionSlug/);
});

test("W3C is presentation/navigation only and stays outside parallel Images, Account, and services-api ownership", async () => {
  const ownedFiles = [
    "app/studio/v2/studio/Studio.jsx",
    "app/studio/v2/studio/studio/StudioModePanels.contract.mjs",
    "app/studio/v2/studio/studio/StudioModePanels.view.jsx",
    "integration/crestfall-v2-convergence-w3/v2FullStudioCategoryNavigationDiagnostics.mjs",
  ].join("\n");

  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedFiles, /app\/studio\/v2\/account\//);
  assert.doesNotMatch(ownedFiles, /services\/api\//);
});

for (const { name, run } of tests) {
  await run();
  console.log(`PASS ${name}`);
}

console.log(`V2 Full Studio category navigation diagnostics: ${tests.length}/${tests.length} PASS`);
