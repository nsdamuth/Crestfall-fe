import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const previewPage = read("app/dev/ui-preview/image-studio-v2/page.jsx");
const previewClient = read("app/dev/ui-preview/image-studio-v2/ImageStudioV2PreviewClient.jsx");
const conceptFiles = fs.readdirSync(path.join(root, "components/studio/image-studio/v2-concept"));

test("Image Studio v2 concept remains development-only", () => {
  assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
  assert.match(previewPage, /notFound\(\)/);
});

test("Image Studio v2 concept remains fixture-driven and non-production", () => {
  assert.match(previewClient, /Fixture-driven concept preview/);
  assert.match(previewClient, /Nothing here opens production[\s\S]*spends coins[\s\S]*starts a job/);
  assert.doesNotMatch(previewClient, /submitImageGeneration|createImageGenerationJob|fetch\(|\/api\//);
});

test("Concept package contains the intended five presentation surfaces", () => {
  for (const stem of ["ModeSwitch", "SegmentList", "RegionEditBar", "RemixComposer", "AssignPublishDrawer"]) {
    assert.ok(conceptFiles.includes(`${stem}.view.jsx`), `${stem}.view.jsx missing`);
    assert.ok(conceptFiles.includes(`${stem}.fixtures.js`), `${stem}.fixtures.js missing`);
  }
});
