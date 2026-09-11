import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  VIDEO_DIRECTOR_JSON_CONTRACT_VERSION,
  buildVideoDirectorJsonAiAuthoringGuide,
  buildVideoDirectorJsonDocument,
  validateVideoDirectorJsonText,
  videoDirectorDocumentToCueState,
} from "./videoDirectorJsonEditor.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const options = {
  durationMin: 5,
  durationMax: 30,
  durationStep: 5,
  allowedAspectRatios: [
    "PORTRAIT_4_5",
    "LANDSCAPE_5_4",
    "PORTRAIT_9_16",
    "LANDSCAPE_16_9",
    "SQUARE_1_1",
  ],
  allowedQualities: ["720p", "1080p"],
};

const document = buildVideoDirectorJsonDocument({
  customPrompt: "Restrained cinematic motion.",
  cues: [
    { id: "cue-a", fromSecond: 0, toSecond: 1, prompt: "Looks toward camera." },
    { id: "cue-b", fromSecond: 1.2, toSecond: 2.5, prompt: "Hair moves in the breeze." },
    { id: "cue-c", fromSecond: 3, toSecond: 5, prompt: "Camera pushes in." },
  ],
  durationSeconds: 5,
  aspectRatio: "PORTRAIT_4_5",
  quality: "720p",
});

assert.equal(document.contractVersion, VIDEO_DIRECTOR_JSON_CONTRACT_VERSION);
assert.deepEqual(Object.keys(document).sort(), [
  "contractVersion",
  "customPrompt",
  "settings",
  "timeline",
]);
assert.deepEqual(Object.keys(document.settings).sort(), [
  "aspectRatio",
  "durationSeconds",
  "quality",
]);
assert.equal(JSON.stringify(document).includes("characterId"), false);
assert.equal(JSON.stringify(document).includes("imageOutputId"), false);

const valid = validateVideoDirectorJsonText(JSON.stringify(document), options);
assert.equal(valid.valid, true, JSON.stringify(valid.errors));
assert.equal(valid.data.timeline.length, 3);
assert.equal(valid.data.timeline[1].startSeconds, 1.2);
assert.equal(videoDirectorDocumentToCueState(valid.data)[2].id, "cue-3");

const overlapping = structuredClone(document);
overlapping.timeline[1].startSeconds = 0.8;
const overlapResult = validateVideoDirectorJsonText(
  JSON.stringify(overlapping),
  options
);
assert.equal(overlapResult.valid, false);
assert.match(
  overlapResult.errors.map((item) => item.message).join(" "),
  /cannot overlap/i
);

const assetInjection = {
  ...document,
  characterId: "11111111-1111-4111-8111-111111111111",
};
const assetResult = validateVideoDirectorJsonText(
  JSON.stringify(assetInjection),
  options
);
assert.equal(assetResult.valid, false);
assert.match(
  assetResult.errors.map((item) => item.message).join(" "),
  /not editable in Director JSON/i
);

const badDuration = structuredClone(document);
badDuration.settings.durationSeconds = 7;
const durationResult = validateVideoDirectorJsonText(
  JSON.stringify(badDuration),
  options
);
assert.equal(durationResult.valid, false);
assert.match(
  durationResult.errors.map((item) => item.message).join(" "),
  /5-second Video duration step/i
);

const guide = buildVideoDirectorJsonAiAuthoringGuide(document, options);
for (const token of [
  "Character ids or UUIDs",
  "source Image",
  "Pose ids",
  "Outfit ids",
  "Location ids",
  "Image Preset ids",
  "Gaps are valid",
  "0.1-second precision",
]) {
  assert.match(guide, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

const adapter = read(
  "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
);
const view = read(
  "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
);
const modal = read(
  "components/kit/image-creator-panel/VideoDirectorJsonEditorModal.view.jsx"
);
const contract = read(
  "components/kit/image-creator-panel/KitImageCreatorPanel.contract.js"
);

assert.match(adapter, /useVideoDirectorJsonEditorViewModel/);
assert.match(adapter, /setVideoPrompt\(document\.customPrompt\)/);
assert.match(adapter, /setVideoDurationSeconds\(document\.settings\.durationSeconds\)/);
assert.match(adapter, /setVideoAspectRatio\(document\.settings\.aspectRatio\)/);
assert.match(adapter, /setVideoQuality\(document\.settings\.quality\)/);
assert.match(adapter, /setVideoDirectorCues\(document\.cues\)/);
assert.doesNotMatch(adapter, /fetch\([^\n]*videoDirectorJson/i);

assert.match(view, /JSON editor/);
assert.match(view, /VideoDirectorJsonEditorModalView/);
assert.match(modal, /Download AI guide/);
assert.match(modal, /Reset from Director/);
assert.match(modal, /Validate & apply/);
assert.match(modal, /Asset Authority/);
assert.match(modal, /no backend request is made/i);
assert.match(contract, /2\.5\.0/);

console.log(
  JSON.stringify(
    {
      diagnostic: "video_director_json_editor_v1",
      status: "PASSED",
      frontendOnly: true,
      exactContractShapeEnforced: true,
      customPromptTimelineAndSettingsEditable: true,
      subSecondTimingPreserved: true,
      gapsAllowedAndOverlapRejected: true,
      currentDurationAspectAndQualityValidated: true,
      assetUuidAuthorityExcluded: true,
      aiGuideDocumentsAssetBoundary: true,
      visualAssetSelectionsRemainUntouched: true,
    },
    null,
    2
  )
);
