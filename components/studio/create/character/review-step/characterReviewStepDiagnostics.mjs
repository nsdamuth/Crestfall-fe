import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Character Review Step Binding Shell stays thin and injects application guidance", () => {
  const shell = read("components/studio/create/character/ReviewStep.jsx");

  assert.ok(shell.split("\n").length < 40);
  assert.match(shell, /useCharacterReviewStepViewModel/);
  assert.match(shell, /CharacterReviewStepView/);
  assert.match(shell, /AdvancedPromptingEditor/);
  assert.match(shell, /advancedPromptingContent/);
  assert.doesNotMatch(shell, /kibbeIdentityOptions|getCharacterColorPaletteLabel/);
  assert.doesNotMatch(shell, /<CrestfallSelect|<textarea|<input/);
});

test("Chassis owns option projection age normalization advanced fields and summaries", () => {
  const viewModel = read(
    "components/studio/create/character/review-step/useCharacterReviewStepViewModel.js"
  );

  assert.match(viewModel, /CHARACTER_REVIEW_VISIBILITY_OPTIONS/);
  assert.match(viewModel, /CHARACTER_REVIEW_CONTENT_RATING_OPTIONS/);
  assert.match(viewModel, /CHARACTER_REVIEW_RENDERING_STYLE_OPTIONS/);
  assert.match(viewModel, /normalizeAdultAgeValue/);
  assert.match(viewModel, /Number\(value\) < 18/);
  assert.match(viewModel, /resolveKibbeIdentityLabel/);
  assert.match(viewModel, /getCharacterColorPaletteLabel/);
  assert.match(viewModel, /buildCharacterReviewSummaryItems/);
  assert.doesNotMatch(viewModel, /<\w+|next\/navigation|@\/lib\/client/);
});

test("portable View renders the unchanged review controls through semantic callbacks", () => {
  const view = read(
    "components/studio/create/character/review-step/CharacterReviewStep.view.jsx"
  );

  assert.match(view, /Finalize publishing settings/);
  assert.match(view, /Adult characters only/);
  assert.match(view, /Advanced Creator Guidance/);
  assert.match(view, /Draft Summary/);
  assert.match(view, /selectFields\.map/);
  assert.match(view, /advancedFields\.map/);
  assert.match(view, /summaryItems\.map/);
  assert.match(view, /advancedPromptingContent/);
  assert.doesNotMatch(view, /AdvancedPromptingEditor|kibbeIdentityOptions/);
  assert.doesNotMatch(view, /@\/lib\/client|Supabase|PostGraphile/);
});

test("Character Creator retains the public ReviewStep integration", () => {
  const creator = read("components/studio/create/character/CharacterCreator.jsx");

  assert.match(
    creator,
    /import ReviewStep from "@\/components\/studio\/create\/character\/ReviewStep"/
  );
  assert.match(creator, /<ReviewStep/);
  assert.match(creator, /advancedOpen=\{advancedOpen\}/);
  assert.match(creator, /setAdvancedOpen=\{setAdvancedOpen\}/);
  assert.match(creator, /updateField=\{updateField\}/);
});

test("storage callback contract preserves publishing advanced and directive fields", () => {
  const contract = read(
    "components/studio/create/character/review-step/CharacterReviewStep.contract.js"
  );
  const viewModel = read(
    "components/studio/create/character/review-step/useCharacterReviewStepViewModel.js"
  );

  for (const field of [
    "visibility",
    "content_rating",
    "rendering_style",
    "age",
    "greeting",
    "scenario",
    "relationship_to_player",
    "backstory",
    "appearance_notes",
    "personality_notes",
    "extra_runtime_notes",
    "creator_directives",
  ]) {
    assert.match(`${contract}\n${viewModel}`, new RegExp(field));
  }

  assert.match(viewModel, /updateField\?\.\("creator_directives", value\)/);
  assert.match(viewModel, /setAdvancedOpen\?\.\(\(current\) => !current\)/);
});

test("contract and fixtures document collapsed advanced minimum-age and sparse states", () => {
  const contract = read(
    "components/studio/create/character/review-step/CharacterReviewStep.contract.js"
  );
  const fixtures = read(
    "components/studio/create/character/review-step/CharacterReviewStep.fixtures.js"
  );

  assert.match(contract, /CHARACTER_REVIEW_STEP_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CharacterReviewStepViewProps/);
  assert.match(fixtures, /characterReviewStepFixture/);
  assert.match(fixtures, /collapsed/);
  assert.match(fixtures, /advanced/);
  assert.match(fixtures, /minimumAge/);
  assert.match(fixtures, /sparse/);
});

test("development preview is protected and uses local fixtures only", () => {
  const page = read("app/dev/ui-preview/character-review-step/page.jsx");
  const preview = read(
    "app/dev/ui-preview/character-review-step/CharacterReviewStepPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterReviewStepView/);
  assert.match(preview, /useCharacterReviewStepViewModel/);
  assert.match(preview, /local fixture state only/);
  assert.doesNotMatch(preview, /AdvancedPromptingEditor|@\/lib\/client/);
});

test("README and focused diagnostic command remain discoverable", () => {
  const readme = read(
    "components/studio/create/character/review-step/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /\/studio\/create\/character/);
  assert.match(readme, /\/dev\/ui-preview\/character-review-step/);
  assert.match(readme, /creator_directives/);
  assert.match(packageJson, /diagnostics:loom:character-review-step/);
});
