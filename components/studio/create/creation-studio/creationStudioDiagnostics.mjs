import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CREATION_STUDIO_EXPERIENCE_VERSION,
  CREATION_STUDIO_MODES,
  FULL_STUDIO_SECTION_DEFINITIONS,
  GUIDED_BUILD_CHAPTER_DEFINITIONS,
  GUIDED_BUILD_STEPS,
  QUICK_START_ASSET_TITLES,
  buildCreationTypeCounts,
  buildFullStudioSections,
  buildGuidedChapterStates,
  buildGuidedStepStates,
  getAssetsByTitle,
  getGuidedProgress,
  getRecommendedGuidedStep,
  normalizeCreationStudioMode,
} from "./CreationStudio.contract.mjs";
import {
  creationStudioCompleteGuidedCounts,
  creationStudioFixtureAssets,
  creationStudioFixtureRegistries,
} from "./CreationStudio.fixtures.mjs";

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

function coreCompleteCounts(overrides = {}) {
  return {
    CHARACTER: 1,
    LOCATION: 1,
    SCENARIO: 1,
    ROOM_TEMPLATE: 1,
    ...overrides,
  };
}

function flattenGuidedSteps(chapters) {
  return chapters.flatMap((chapter) => chapter.steps || []);
}

test("publishes the progressive guidance v2 contract", () => {
  assert.equal(CREATION_STUDIO_EXPERIENCE_VERSION, "creation_studio_experience_v2");
});

test("defaults unknown modes to Guided Build", () => {
  assert.equal(normalizeCreationStudioMode("UNKNOWN"), CREATION_STUDIO_MODES.GUIDED);
});

test("preserves every published mode", () => {
  Object.values(CREATION_STUDIO_MODES).forEach((mode) => {
    assert.equal(normalizeCreationStudioMode(mode), mode);
  });
});

test("Quick Start contains the exact four approved assets", () => {
  assert.deepEqual(QUICK_START_ASSET_TITLES, [
    "Character",
    "Player Character",
    "Location",
    "Outfit / Clothing",
  ]);
});

test("Quick Start resolves four real assets", () => {
  assert.equal(
    getAssetsByTitle(creationStudioFixtureAssets, QUICK_START_ASSET_TITLES).length,
    4
  );
});

test("creation counts normalize type values", () => {
  assert.deepEqual(
    buildCreationTypeCounts([
      { type: "CHARACTER" },
      { type: "character" },
      { data: { type: "LOCATION" } },
      { type: "ROOM_TEMPLATE" },
    ]),
    {
      CHARACTER: 2,
      LOCATION: 1,
      ROOM_TEMPLATE: 1,
    }
  );
});

test("only the Character core step is initially visible", () => {
  const states = buildGuidedStepStates({});
  assert.equal(states[0].visible, true);
  assert.equal(states[0].current, true);
  assert.equal(states.slice(1).every((step) => !step.visible), true);
});

test("Location appears after one Character exists", () => {
  const states = buildGuidedStepStates({ CHARACTER: 1 });
  assert.equal(states[0].complete, true);
  assert.equal(states[1].visible, true);
  assert.equal(states[1].current, true);
  assert.equal(states[2].visible, false);
});

test("Scenario appears after Character and Location exist", () => {
  const states = buildGuidedStepStates({ CHARACTER: 1, LOCATION: 1 });
  assert.equal(states[2].visible, true);
  assert.equal(states[2].current, true);
  assert.equal(states[3].visible, false);
});

test("Story appears after the first three guided assets exist", () => {
  const states = buildGuidedStepStates({
    CHARACTER: 1,
    LOCATION: 1,
    SCENARIO: 1,
  });
  assert.equal(states[3].visible, true);
  assert.equal(states[3].current, true);
});

test("the core path completes with one ROOM_TEMPLATE Story", () => {
  const states = buildGuidedStepStates(coreCompleteCounts());
  assert.equal(states.every((step) => step.complete), true);
});

test("guided core order remains Character, Location, Scenario, Story", () => {
  assert.deepEqual(
    GUIDED_BUILD_STEPS.map((step) => step.id),
    ["CHARACTER", "LOCATION", "SCENARIO", "STORY"]
  );
});

test("progressive guidance publishes six ordered chapters", () => {
  assert.deepEqual(
    GUIDED_BUILD_CHAPTER_DEFINITIONS.map((chapter) => chapter.id),
    [
      "CORE_STORY_FOUNDATION",
      "CAST_PRESENTATION",
      "WORLD_CONTINUITY",
      "CONNECTED_STORIES",
      "RULES_MECHANICS",
      "REUSE_SCALE",
    ]
  );
});

test("progressive guidance publishes 25 milestones", () => {
  assert.equal(
    GUIDED_BUILD_CHAPTER_DEFINITIONS.flatMap((chapter) => chapter.steps).length,
    25
  );
});

test("post-core chapters stay hidden until the core path is complete", () => {
  const chapters = buildGuidedChapterStates({ CHARACTER: 1 });
  assert.equal(chapters[0].visible, true);
  assert.equal(chapters.slice(1).every((chapter) => !chapter.visible), true);
});

test("all guided chapters appear after the core path is complete", () => {
  const chapters = buildGuidedChapterStates(coreCompleteCounts());
  assert.equal(chapters.every((chapter) => chapter.visible), true);
});

test("Player Character is recommended immediately after core completion", () => {
  const chapters = buildGuidedChapterStates(coreCompleteCounts());
  assert.equal(getRecommendedGuidedStep(chapters)?.id, "PLAYER_CHARACTER");
  assert.equal(chapters[1].current, true);
});

test("the recommendation advances from Player Character to Outfit", () => {
  const chapters = buildGuidedChapterStates(
    coreCompleteCounts({ PLAYER_CHARACTER: 1 })
  );
  assert.equal(getRecommendedGuidedStep(chapters)?.id, "OUTFIT");
});

test("cast and presentation follows the approved dependency order", () => {
  assert.deepEqual(
    GUIDED_BUILD_CHAPTER_DEFINITIONS[1].steps.map((step) => step.id),
    [
      "PLAYER_CHARACTER",
      "OUTFIT",
      "WARDROBE",
      "POSE",
      "NARRATOR",
      "IMAGE_PRESET",
    ]
  );
});

test("world and continuity grows from people to places to powers to objects to history to quests", () => {
  assert.deepEqual(
    GUIDED_BUILD_CHAPTER_DEFINITIONS[2].steps.map((step) => step.id),
    [
      "NPC_REGISTRY",
      "LOCATION_REGISTRY",
      "FACTION_REGISTRY",
      "ORGANIZATION_REGISTRY",
      "ITEM_REGISTRY",
      "EVENT_REGISTRY",
      "QUEST_REGISTRY",
    ]
  );
});

test("connected stories requires a second Story before a Storyline", () => {
  assert.deepEqual(
    GUIDED_BUILD_CHAPTER_DEFINITIONS[3].steps.map((step) => step.id),
    ["SECOND_STORY", "STORYLINE"]
  );
});

test("one Story does not complete the second-Story milestone", () => {
  const chapters = buildGuidedChapterStates(coreCompleteCounts());
  const secondStory = flattenGuidedSteps(chapters).find(
    (step) => step.id === "SECOND_STORY"
  );
  assert.equal(secondStory.count, 1);
  assert.equal(secondStory.complete, false);
});

test("two Stories complete the second-Story milestone", () => {
  const chapters = buildGuidedChapterStates(
    coreCompleteCounts({ ROOM_TEMPLATE: 2 })
  );
  const secondStory = flattenGuidedSteps(chapters).find(
    (step) => step.id === "SECOND_STORY"
  );
  assert.equal(secondStory.count, 2);
  assert.equal(secondStory.complete, true);
});

test("rules and mechanics follows state, progression, operations, actor package, codex", () => {
  assert.deepEqual(
    GUIDED_BUILD_CHAPTER_DEFINITIONS[4].steps.map((step) => step.id),
    [
      "STATS_POOLS_PROFILE",
      "PROGRESSION_PROFILE",
      "MECHANICS_MODULE",
      "ACTOR_MECHANICS_PROFILE",
      "RULES_CODEX",
    ]
  );
});

test("Character Template is the final reuse milestone", () => {
  const allSteps = GUIDED_BUILD_CHAPTER_DEFINITIONS.flatMap(
    (chapter) => chapter.steps
  );
  assert.equal(allSteps.at(-1).id, "CHARACTER_TEMPLATE");
  assert.equal(allSteps.at(-1).number, 25);
});

test("every Full Studio asset appears in progressive guidance", () => {
  const guidedTitles = new Set(
    GUIDED_BUILD_CHAPTER_DEFINITIONS.flatMap((chapter) => chapter.steps).map(
      (step) => step.assetTitle
    )
  );
  const expectedTitles = [
    ...creationStudioFixtureAssets,
    ...creationStudioFixtureRegistries,
  ].map((asset) => asset.title);

  expectedTitles.forEach((title) => {
    assert.equal(guidedTitles.has(title), true, `missing guided title ${title}`);
  });
});

test("Story is the only asset intentionally represented by two milestones", () => {
  const titles = GUIDED_BUILD_CHAPTER_DEFINITIONS.flatMap(
    (chapter) => chapter.steps
  ).map((step) => step.assetTitle);
  const duplicateTitles = [...new Set(titles.filter(
    (title, index) => titles.indexOf(title) !== index
  ))];

  assert.deepEqual(duplicateTitles, ["Story"]);
});

test("complete guided counts finish every chapter and milestone", () => {
  const chapters = buildGuidedChapterStates(creationStudioCompleteGuidedCounts);
  const progress = getGuidedProgress(chapters);

  assert.equal(chapters.every((chapter) => chapter.complete), true);
  assert.equal(progress.completedStepCount, 25);
  assert.equal(progress.totalStepCount, 25);
  assert.equal(progress.coreComplete, true);
  assert.equal(progress.allComplete, true);
  assert.equal(getRecommendedGuidedStep(chapters), null);
});

test("one missing creation keeps the toolkit foundation incomplete", () => {
  const counts = {
    ...creationStudioCompleteGuidedCounts,
    CHARACTER_TEMPLATE: 0,
  };
  const chapters = buildGuidedChapterStates(counts);
  const progress = getGuidedProgress(chapters);

  assert.equal(progress.allComplete, false);
  assert.equal(getRecommendedGuidedStep(chapters)?.id, "CHARACTER_TEMPLATE");
});

test("Full Studio publishes five purpose-based sections", () => {
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

test("Rules and mechanics remain isolated from story assets", () => {
  const rules = FULL_STUDIO_SECTION_DEFINITIONS.find(
    (section) => section.id === "RULES_MECHANICS"
  );
  const stories = FULL_STUDIO_SECTION_DEFINITIONS.find(
    (section) => section.id === "STORIES_SESSIONS"
  );

  assert.deepEqual(rules.assetTitles, [
    "Stats & Pools Profile",
    "Progression Profile",
    "Mechanics Module",
    "Actor Mechanics Profile",
    "Rules Codex",
  ]);
  assert.equal(stories.assetTitles.includes("Rules Codex"), false);
  assert.equal(stories.assetTitles.includes("Mechanics Module"), false);
});

test("Worlds and Continuity combines Location with every registry", () => {
  const sections = buildFullStudioSections({
    creationAssets: creationStudioFixtureAssets,
    registryTypes: creationStudioFixtureRegistries,
  });
  const worlds = sections.find((section) => section.id === "WORLDS_CONTINUITY");

  assert.deepEqual(
    worlds.assets.map((asset) => asset.title),
    [
      "Location",
      "NPC Registry",
      "Location Registry",
      "Faction Registry",
      "Organization Registry",
      "Event Registry",
      "Quest Registry",
      "Item Registry",
    ]
  );
});

test("the page delegates behavior to the Creation Studio experience", async () => {
  const source = await readFile("app/studio/create/page.js", "utf8");
  assert.match(source, /CreationStudioExperience/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /supabase/i);
  assert.doesNotMatch(source, /postgraphile/i);
});

test("the ViewModel owns the existing client API read and progressive state", async () => {
  const source = await readFile(
    "components/studio/create/creation-studio/useCreationStudioViewModel.js",
    "utf8"
  );
  assert.match(source, /fetchOwnedCreations/);
  assert.match(source, /buildGuidedChapterStates/);
  assert.match(source, /getRecommendedGuidedStep/);
  assert.match(source, /CREATION_STUDIO_MODE_STORAGE_KEY/);
  assert.doesNotMatch(source, /supabase/i);
  assert.doesNotMatch(source, /postgraphile/i);
});

test("the View has no direct backend call", async () => {
  const source = await readFile(
    "components/studio/create/creation-studio/CreationStudio.view.jsx",
    "utf8"
  );
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /supabase/i);
  assert.doesNotMatch(source, /postgraphile/i);
  assert.match(source, /Quick Start/);
  assert.match(source, /Guided Build/);
  assert.match(source, /Full Studio/);
});

test("the View publishes progressive recommendation, fold-down chapters, and final completion", async () => {
  const source = await readFile(
    "components/studio/create/creation-studio/CreationStudio.view.jsx",
    "utf8"
  );
  assert.match(source, /Recommended Next/);
  assert.match(source, /GuidedChapter/);
  assert.match(source, /<details/);
  assert.match(source, /Your Crestfall Toolkit Foundation Is Ready/);
});

let passed = 0;
let failed = 0;

for (const item of tests) {
  try {
    await item.run();
    passed += 1;
    console.log(`PASS ${item.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${item.name}`);
    console.error(error);
  }
}

console.log(`Summary: ${passed} passed, ${failed} failed, ${tests.length} total`);

if (failed > 0) {
  process.exitCode = 1;
}
