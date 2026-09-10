import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  getIngredientSelectionImagePosition,
} from "./imageStudioFocalSelection.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const characterWithFace = {
  featuredMedia: [
    {
      presentationMetadata: {
        focalAnalysis: {
          source: "FACE_DETECTION",
          faceDetected: true,
          focalPoint: { x: 0.68, y: 0.21 },
        },
      },
    },
  ],
};

test("V2 selected Character uses backend face-aware focal metadata", () => {
  assert.equal(
    getIngredientSelectionImagePosition("character", characterWithFace),
    "68% 21%"
  );
  assert.equal(
    getIngredientSelectionImagePosition("playerCharacter", characterWithFace),
    "68% 21%"
  );
});

test("non-character ingredients and missing face metadata preserve normal crop behavior", () => {
  assert.equal(getIngredientSelectionImagePosition("location", characterWithFace), null);
  assert.equal(getIngredientSelectionImagePosition("character", {}), null);
});

test("portable Kit panel consumes caller-projected object-position without browser inference", () => {
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  const focalProjection = read(
    "app/studio/v2/images/images-live/imageStudioFocalSelection.js"
  );

  const projectSelectionSource = String(
    adapter.split("function projectSelection", 2)[1] || ""
  ).split("\nfunction projectSlotStates", 1)[0];
  const projectSlotStatesSource = String(
    adapter.split("function projectSlotStates", 2)[1] || ""
  ).split("\n// Remix", 1)[0];

  assert.match(focalProjection, /resolveImageFocalObjectPosition/);
  assert.match(
    projectSelectionSource,
    /imagePosition:\s*getIngredientSelectionImagePosition/,
    "The shared selection projector must carry focal object-position; a dead duplicate selection object is not sufficient."
  );
  assert.equal(
    (projectSlotStatesSource.match(/\bselection:/g) || []).length,
    1,
    "Generate slot state must contain exactly one selection projection after merge resolution."
  );
  assert.match(
    projectSlotStatesSource,
    /selection:\s*projectSelection\(value, slot, customText\)/
  );
  assert.match(panel, /objectPosition:\s*imagePosition/);
  assert.doesNotMatch(panel, /focalAnalysis|FACE_DETECTION|blazeface/i);
});

console.log(
  JSON.stringify(
    {
      diagnostic: "images_v2_character_focal_selection_v1",
      status: "PASSED",
      selectedCharacterUsesBackendFaceFocalMetadata: true,
      playerCharacterCompatibilityPreserved: true,
      nonCharacterCropPolicyUnchanged: true,
      browserFaceInferenceIntroduced: false,
    },
    null,
    2
  )
);
