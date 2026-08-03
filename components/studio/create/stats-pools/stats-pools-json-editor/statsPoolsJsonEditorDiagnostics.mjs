import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { STATS_POOLS_PROFILE_CONTRACT_VERSION } from "../stats-pools-editor/StatsPoolsEditor.contract.js";
import {
  formatStatsPoolsJsonData,
  formatStatsPoolsJsonText,
  validateStatsPoolsJsonText,
} from "./statsPoolsJsonEditor.validation.js";
import {
  STATS_POOLS_JSON_AI_AUTHORING_GUIDE_FILENAME,
  buildStatsPoolsJsonAiAuthoringGuide,
} from "./statsPoolsJsonAiAuthoringGuide.js";
import { statsPoolsJsonEditorProfileFixture } from "./statsPoolsJsonEditor.fixtures.js";

const profile = statsPoolsJsonEditorProfileFixture;
const formatted = formatStatsPoolsJsonData(profile);
const parsedFormatted = JSON.parse(formatted);
assert.equal(parsedFormatted.contractVersion, STATS_POOLS_PROFILE_CONTRACT_VERSION);
assert.equal(parsedFormatted.profileMode, "FULL");
assert.equal(parsedFormatted.statDefinitions.length, 2);
assert.equal(parsedFormatted.poolDefinitions.length, 1);
assert.equal(parsedFormatted.modifierDefinitions.length, 1);
assert.equal(parsedFormatted.conditionDefinitions.length, 1);

const syntaxFailure = formatStatsPoolsJsonText('{"title":');
assert.equal(syntaxFailure.valid, false);
assert.equal(syntaxFailure.error.code, "STATS_POOLS_JSON_SYNTAX_INVALID");

const validResult = validateStatsPoolsJsonText(formatted);
assert.equal(validResult.valid, true);
assert.equal(validResult.errors.length, 0);
assert.equal(validResult.data.title, profile.title);
assert.equal(validResult.data.poolDefinitions[0].id, "health");

const missingVersionProfile = { ...profile };
delete missingVersionProfile.contractVersion;
const missingVersionResult = validateStatsPoolsJsonText(
  JSON.stringify(missingVersionProfile)
);
assert.equal(missingVersionResult.valid, true);
assert.ok(
  missingVersionResult.warnings.some(
    (entry) => entry.code === "STATS_POOLS_JSON_CONTRACT_VERSION_MISSING"
  )
);
assert.equal(
  missingVersionResult.data.contractVersion,
  STATS_POOLS_PROFILE_CONTRACT_VERSION
);

const actorStateResult = validateStatsPoolsJsonText(
  JSON.stringify({
    ...profile,
    profileId: "11111111-1111-4111-8111-111111111111",
    bindingId: "stats",
    statValues: [{ definitionId: "vitality", currentValue: 42 }],
    poolValues: [{ definitionId: "health", currentValue: 80 }],
    activeConditions: [],
  })
);
assert.equal(actorStateResult.valid, false);
assert.ok(
  actorStateResult.errors.some(
    (entry) => entry.code === "STATS_POOLS_JSON_RUNTIME_FIELD_FORBIDDEN"
  )
);

const metadataRuntimeStateResult = validateStatsPoolsJsonText(
  JSON.stringify({
    ...profile,
    metadata: { activeModifiers: [{ instanceId: "runtime.effect" }] },
  })
);
assert.equal(metadataRuntimeStateResult.valid, false);
assert.ok(
  metadataRuntimeStateResult.errors.some(
    (entry) => entry.path === "metadata.activeModifiers"
  )
);

const unsupportedModeResult = validateStatsPoolsJsonText(
  JSON.stringify({ ...profile, profileMode: "AI_DECIDES" })
);
assert.equal(unsupportedModeResult.valid, false);
assert.ok(
  unsupportedModeResult.errors.some(
    (entry) => entry.code === "STATS_POOLS_JSON_ENUM_UNSUPPORTED"
  )
);

const invalidFormulaResult = validateStatsPoolsJsonText(
  JSON.stringify({
    ...profile,
    statDefinitions: profile.statDefinitions.map((definition) =>
      definition.id === "defense"
        ? {
            ...definition,
            derived: {
              enabled: true,
              formula: {
                ...definition.derived.formula,
                root: {
                  ...definition.derived.formula.root,
                  operation: "EXECUTE_SCRIPT",
                },
              },
            },
          }
        : definition
    ),
  })
);
assert.equal(invalidFormulaResult.valid, false);
assert.ok(
  invalidFormulaResult.errors.some(
    (entry) => entry.path.endsWith("root.operation")
  )
);

const unknownFieldResult = validateStatsPoolsJsonText(
  JSON.stringify({ ...profile, unsupportedRuntimeHint: "ignored" })
);
assert.equal(unknownFieldResult.valid, true);
assert.ok(
  unknownFieldResult.warnings.some(
    (entry) => entry.code === "STATS_POOLS_JSON_UNKNOWN_TOP_LEVEL_FIELD"
  )
);
assert.equal(
  Object.prototype.hasOwnProperty.call(
    unknownFieldResult.data,
    "unsupportedRuntimeHint"
  ),
  false
);

const guide = buildStatsPoolsJsonAiAuthoringGuide(profile);
assert.match(guide, /Current Stats & Pools Profile JSON/);
assert.match(guide, /Return \*\*one complete JSON object only\*\*/);
assert.match(guide, /Do not add actor-owned Stat values/);
assert.match(guide, new RegExp(STATS_POOLS_PROFILE_CONTRACT_VERSION));
assert.match(guide, /"id": "health"/);
assert.equal(
  STATS_POOLS_JSON_AI_AUTHORING_GUIDE_FILENAME,
  "crestfall-stats-pools-profile-json-ai-authoring-guide.md"
);

const editorViewSource = readFileSync(
  new URL("../stats-pools-editor/StatsPoolsEditor.view.jsx", import.meta.url),
  "utf8"
);
const editorVmSource = readFileSync(
  new URL(
    "../stats-pools-editor/useStatsPoolsEditorViewModel.js",
    import.meta.url
  ),
  "utf8"
);
const modalViewSource = readFileSync(
  new URL("./StatsPoolsJsonEditorModal.view.jsx", import.meta.url),
  "utf8"
);
const modalVmSource = readFileSync(
  new URL("./useStatsPoolsJsonEditorViewModel.js", import.meta.url),
  "utf8"
);
const previewPageSource = readFileSync(
  new URL(
    "../../../../../app/dev/ui-preview/stats-pools-json-editor/page.jsx",
    import.meta.url
  ),
  "utf8"
);

assert.match(editorViewSource, /StatsPoolsJsonEditorModal/);
assert.match(editorViewSource, /JSON Editor/);
assert.match(editorVmSource, /jsonEditorOpen/);
assert.match(editorVmSource, /applyJsonProfile/);
assert.match(modalViewSource, /Download AI Guide/);
assert.match(modalViewSource, /Validate & Apply/);
assert.match(modalViewSource, /Authored Stats & Pools Profile/);
assert.doesNotMatch(modalViewSource, /fetch\s*\(/);
assert.doesNotMatch(modalViewSource, /supabase/i);
assert.match(modalVmSource, /buildStatsPoolsJsonAiAuthoringGuide/);
assert.match(modalVmSource, /validateStatsPoolsJsonText/);
assert.match(previewPageSource, /NODE_ENV === "production"/);
assert.match(previewPageSource, /notFound\(\)/);

console.log(
  JSON.stringify(
    {
      diagnostic: "stats_pools_json_editor_validation_v1",
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
