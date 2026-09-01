import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  CHARACTER_PREVIEW_COIN_COST,
  buildCharacterPreviewGenerationPayload,
  getCharacterPreviewJobId,
  getCharacterPreviewOutputImageUrl,
  getCharacterPreviewOutputJobId,
} from "./characterPreviewGeneration.js";

assert.equal(CHARACTER_PREVIEW_COIN_COST, 5);

const payload = buildCharacterPreviewGenerationPayload({
  creationId: "11111111-1111-4111-8111-111111111111",
});

assert.deepEqual(payload.ingredients.character, {
  mode: "asset",
  assetId: "11111111-1111-4111-8111-111111111111",
});
assert.equal(payload.ingredients.outfit.mode, "none");
assert.equal(payload.ingredients.pose.mode, "none");
assert.equal(payload.ingredients.location.mode, "none");
assert.equal(payload.ingredients.renderingPreset.mode, "none");
assert.equal(payload.settings.outputCount, 1);
assert.equal(payload.settings.renderProfileKey, "auto");
assert.equal(payload.settings.renderingStyle, "auto");
assert.equal(payload.settings.aspectRatio, "3:4");
assert.match(payload.prompt.userPrompt, /full-body character preview/i);

const playerPayload = buildCharacterPreviewGenerationPayload({
  creationId: "22222222-2222-4222-8222-222222222222",
  creationType: "PLAYER_CHARACTER",
});
assert.equal(playerPayload.ingredients.character.mode, "none");
assert.deepEqual(playerPayload.ingredients.playerCharacter, {
  mode: "asset",
  assetId: "22222222-2222-4222-8222-222222222222",
});

assert.equal(
  getCharacterPreviewJobId({ job: { id: "job-1" } }),
  "job-1"
);
assert.equal(
  getCharacterPreviewOutputJobId({ jobId: "job-1" }),
  "job-1"
);
assert.equal(
  getCharacterPreviewOutputImageUrl({ id: "output-1" }),
  "/api/studio/image-generation/outputs/output-1/file?variant=display"
);

const viewSource = readFileSync(
  new URL("./CharacterPreview.view.jsx", import.meta.url),
  "utf8"
);
const vmSource = readFileSync(
  new URL("./useCharacterPreviewViewModel.js", import.meta.url),
  "utf8"
);
const payoffSource = readFileSync(
  new URL("../creator-stops/payoff-stop/PayoffStop.view.jsx", import.meta.url),
  "utf8"
);
const modalSource = readFileSync(
  new URL("../creator-stops/CharacterCreatorModal.jsx", import.meta.url),
  "utf8"
);
const clientSource = readFileSync(
  new URL(
    "../../../../../lib/client/studio/characters/characterPreviewClient.js",
    import.meta.url
  ),
  "utf8"
);

assert.match(viewSource, /\$\{previewCostLabel\} coins/);
assert.doesNotMatch(viewSource, /40 tokens|previewCostLabel\} tokens/);
assert.doesNotMatch(viewSource, /useState/);
assert.match(viewSource, /previewImageUrl/);
assert.match(viewSource, /onGeneratePreview/);
assert.match(vmSource, /CHARACTER_PREVIEW_COIN_COST/);
assert.match(payoffSource, /<CharacterPreview/);
assert.doesNotMatch(payoffSource, /useCharacterPreviewViewModel/);
assert.match(modalSource, /await persistCreation\(\)/);
assert.match(modalSource, /generateCharacterPreviewImage/);
assert.match(modalSource, /invalidatePreview/);
assert.match(clientSource, /createImageGenerationJob/);
assert.match(clientSource, /fetchImageGenerationHistory/);

console.log("characterPreviewGeneration diagnostics passed");
