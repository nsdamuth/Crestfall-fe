import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  PROGRESSION_PROFILE_CONTRACT_VERSION,
  createDefaultGeneratedProgressionProfile,
} from "../progression-profile-editor/ProgressionProfileEditor.contract.js";
import {
  formatProgressionJsonData,
  formatProgressionJsonText,
  validateProgressionJsonText,
} from "./progressionJsonEditor.validation.js";
import {
  PROGRESSION_JSON_AI_AUTHORING_GUIDE_FILENAME,
  buildProgressionJsonAiAuthoringGuide,
} from "./progressionJsonAiAuthoringGuide.js";

const profile = createDefaultGeneratedProgressionProfile();
const formatted = formatProgressionJsonData(profile);
const parsedFormatted = JSON.parse(formatted);
assert.equal(parsedFormatted.contractVersion, PROGRESSION_PROFILE_CONTRACT_VERSION);
assert.equal(parsedFormatted.curve.mode, "GENERATED_CURVE");
assert.deepEqual(parsedFormatted.curve.thresholds, []);

const syntaxFailure = formatProgressionJsonText('{"title":');
assert.equal(syntaxFailure.valid, false);
assert.equal(syntaxFailure.error.code, "PROGRESSION_JSON_SYNTAX_INVALID");

const validResult = validateProgressionJsonText(formatted);
assert.equal(validResult.valid, true);
assert.equal(validResult.errors.length, 0);
assert.equal(validResult.data.title, profile.title);
assert.equal(validResult.data.curve.maximumLevel, 20);

const missingVersionProfile = { ...profile };
delete missingVersionProfile.contractVersion;
const missingVersionResult = validateProgressionJsonText(
  JSON.stringify(missingVersionProfile)
);
assert.equal(missingVersionResult.valid, true);
assert.ok(
  missingVersionResult.warnings.some(
    (entry) => entry.code === "PROGRESSION_JSON_CONTRACT_VERSION_MISSING"
  )
);
assert.equal(
  missingVersionResult.data.contractVersion,
  PROGRESSION_PROFILE_CONTRACT_VERSION
);

const actorStateResult = validateProgressionJsonText(
  JSON.stringify({
    ...profile,
    currentExperience: 250,
    currentLevel: 1,
    unspentPoints: 3,
  })
);
assert.equal(actorStateResult.valid, false);
assert.ok(
  actorStateResult.errors.some(
    (entry) => entry.code === "PROGRESSION_JSON_RUNTIME_FIELD_FORBIDDEN"
  )
);

const metadataRuntimeStateResult = validateProgressionJsonText(
  JSON.stringify({
    ...profile,
    metadata: { currentXP: 250 },
  })
);
assert.equal(metadataRuntimeStateResult.valid, false);
assert.ok(
  metadataRuntimeStateResult.errors.some(
    (entry) => entry.path === "metadata.currentXP"
  )
);

const unsupportedModeResult = validateProgressionJsonText(
  JSON.stringify({
    ...profile,
    curve: { ...profile.curve, mode: "AI_DECIDES" },
  })
);
assert.equal(unsupportedModeResult.valid, false);
assert.ok(
  unsupportedModeResult.errors.some(
    (entry) => entry.code === "PROGRESSION_JSON_CURVE_MODE_UNSUPPORTED"
  )
);

const invalidThresholdResult = validateProgressionJsonText(
  JSON.stringify({
    ...profile,
    curve: {
      ...profile.curve,
      mode: "EXPLICIT_TABLE",
      maximumLevel: 3,
      thresholds: [
        { level: 1, cumulativeExperience: 0, metadata: {} },
        { level: 2, cumulativeExperience: 100, metadata: {} },
        { level: 3, cumulativeExperience: 100, metadata: {} },
      ],
    },
  })
);
assert.equal(invalidThresholdResult.valid, false);
assert.ok(
  invalidThresholdResult.errors.some(
    (entry) =>
      entry.code === "PROGRESSION_THRESHOLD_EXPERIENCE_NOT_INCREASING"
  )
);

const unknownFieldResult = validateProgressionJsonText(
  JSON.stringify({ ...profile, unsupportedRuntimeHint: "ignored" })
);
assert.equal(unknownFieldResult.valid, true);
assert.ok(
  unknownFieldResult.warnings.some(
    (entry) => entry.code === "PROGRESSION_JSON_UNKNOWN_TOP_LEVEL_FIELD"
  )
);
assert.equal(
  Object.prototype.hasOwnProperty.call(
    unknownFieldResult.data,
    "unsupportedRuntimeHint"
  ),
  false
);

const guide = buildProgressionJsonAiAuthoringGuide(profile);
assert.match(guide, /Current Progression Profile JSON/);
assert.match(guide, /Return \*\*one complete JSON object only\*\*/);
assert.match(guide, /Do not add current XP, current level, unspent points/);
assert.match(guide, new RegExp(PROGRESSION_PROFILE_CONTRACT_VERSION));
assert.match(guide, /"maximumLevel": 20/);
assert.equal(
  PROGRESSION_JSON_AI_AUTHORING_GUIDE_FILENAME,
  "crestfall-progression-profile-json-ai-authoring-guide.md"
);

const editorViewSource = readFileSync(
  new URL(
    "../progression-profile-editor/ProgressionProfileEditor.view.jsx",
    import.meta.url
  ),
  "utf8"
);
const editorVmSource = readFileSync(
  new URL(
    "../progression-profile-editor/useProgressionProfileEditorViewModel.js",
    import.meta.url
  ),
  "utf8"
);
const modalViewSource = readFileSync(
  new URL("./ProgressionJsonEditorModal.view.jsx", import.meta.url),
  "utf8"
);
const modalVmSource = readFileSync(
  new URL("./useProgressionJsonEditorViewModel.js", import.meta.url),
  "utf8"
);
const previewPageSource = readFileSync(
  new URL(
    "../../../../../app/dev/ui-preview/progression-json-editor/page.jsx",
    import.meta.url
  ),
  "utf8"
);

assert.match(editorViewSource, /ProgressionJsonEditorModal/);
assert.match(editorViewSource, /JSON Editor/);
assert.match(editorVmSource, /jsonEditorOpen/);
assert.match(editorVmSource, /applyJsonProfile/);
assert.match(modalViewSource, /Download AI Guide/);
assert.match(modalViewSource, /Validate & Apply/);
assert.match(modalViewSource, /Authored Progression Profile/);
assert.doesNotMatch(modalViewSource, /fetch\s*\(/);
assert.doesNotMatch(modalViewSource, /supabase/i);
assert.match(modalVmSource, /buildProgressionJsonAiAuthoringGuide/);
assert.match(modalVmSource, /validateProgressionJsonText/);
assert.match(previewPageSource, /NODE_ENV === "production"/);
assert.match(previewPageSource, /notFound\(\)/);

console.log(
  JSON.stringify(
    {
      diagnostic: "progression_json_editor_validation_v1",
      status: "PASSED",
      completeObjectRoundTrip: true,
      authoritativeNormalizerReused: true,
      authoritativeValidatorReused: true,
      actorRuntimeFieldsRejected: true,
      currentProfileEmbeddedInGuide: true,
      directPersistenceAllowed: false,
      previewBlockedInProduction: true,
    },
    null,
    2
  )
);
