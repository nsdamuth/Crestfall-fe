import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  IMAGE_STUDIO_DEFAULT_MIN_OUTPUT_COUNT,
  IMAGE_STUDIO_OUTPUT_COUNT_BACKEND_MAX,
  buildImageStudioOutputCountValues,
  clampImageStudioOutputCount,
  resolveImageStudioMinimumOutputCount,
} from "./imageStudioOutputCountPolicy.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

assert.equal(IMAGE_STUDIO_DEFAULT_MIN_OUTPUT_COUNT, 2);
assert.equal(IMAGE_STUDIO_OUTPUT_COUNT_BACKEND_MAX, 4);
assert.equal(resolveImageStudioMinimumOutputCount("1"), 1);
assert.equal(resolveImageStudioMinimumOutputCount("2"), 2);
assert.equal(resolveImageStudioMinimumOutputCount("99"), 4);
assert.equal(resolveImageStudioMinimumOutputCount("bad"), 2);
assert.equal(clampImageStudioOutputCount("1", { minimum: 2 }), 2);
assert.equal(clampImageStudioOutputCount("4", { minimum: 1 }), 4);
assert.deepEqual(buildImageStudioOutputCountValues(1).slice(0, 3), [1, 2, 4]);
assert.deepEqual(buildImageStudioOutputCountValues(2).slice(0, 2), [2, 4]);
assert.deepEqual(buildImageStudioOutputCountValues(3).slice(0, 2), [3, 4]);

const workbench = read(
  "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
);
const data = read("components/studio/image-studio/imageStudioData.js");
const preview = read(
  "components/studio/create/character/character-preview/characterPreviewGeneration.js"
);

assert.match(workbench, /IMAGE_STUDIO_MIN_OUTPUT_COUNT/);
assert.match(workbench, /clampImageStudioOutputCount\(imageCount\)/);
assert.match(data, /buildImageStudioOutputCountValues/);
assert.match(
  preview,
  /outputCount:\s*1/,
  "Character preview must remain a one-image workflow independent of Media Studio minimum"
);

console.log(
  JSON.stringify(
    {
      diagnostic: "image_studio_output_count_policy_v1",
      status: "PASSED",
      env: "NEXT_PUBLIC_CRESTFALL_IMAGE_STUDIO_MIN_OUTPUT_COUNT",
      defaultMinimum: 2,
      alphaMinimumOneSupported: true,
      backendMaximumPreserved: 4,
      mediaStudioPayloadClampedToConfiguredMinimum: true,
      characterPreviewStillOneImage: true,
    },
    null,
    2
  )
);
