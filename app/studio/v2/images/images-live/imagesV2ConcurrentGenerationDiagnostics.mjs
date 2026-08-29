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

test("V2 desktop image generation remains clickable while another generation is active", () => {
  const panel = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");

  assert.match(panel, /disabled=\{!canGenerate\}/);
  assert.doesNotMatch(
    panel,
    /disabled=\{!canGenerate \|\| generationStatus === ["']loading["']\}/
  );
  assert.match(panel, /Generate another image/);
});

test("V2 mobile image generation remains clickable while another generation is active", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(live, /disabled=\{!canGenerate\}/);
  assert.doesNotMatch(
    live,
    /disabled=\{!canGenerate \|\| generationPending\}/
  );
  assert.match(live, /Generate another/);
});

test("generation submission has no client-side single-flight guard", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );
  const generationHook = read(
    "components/studio/image-studio/hooks/useImageGenerationJob.js"
  );

  assert.match(workbench, /async function handleGenerateImage\(\) \{\s*if \(!canGenerateImage\) return;/);
  assert.doesNotMatch(workbench, /if \([^)]*generationStatus[^)]*\) return;/);
  assert.match(generationHook, /await createImageGenerationJob\(payload\)/);
  assert.doesNotMatch(generationHook, /if \([^)]*generationStatus[^)]*\) return;/);
});
