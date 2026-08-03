import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

import {
  buildProgressionCurvePreview,
  buildProgressionCurvePreviewRows,
  createDefaultGeneratedProgressionProfile,
  createDefaultProgressionProfile,
  normalizeProgressionProfileEditorValue,
  PROGRESSION_CURVE_GENERATOR_VERSION,
  rebuildProgressionThresholds,
  validateProgressionProfileEditorValue,
} from "./ProgressionProfileEditor.contract.js";
import {
  resolveProgressionProfileCreationTitle,
} from "../progression-profile-builder/ProgressionProfileBuilder.contract.js";

const fixture = createDefaultProgressionProfile();
const validation = validateProgressionProfileEditorValue(fixture);
assert.equal(validation.valid, true);
assert.equal(validation.normalized.curve.mode, "EXPLICIT_TABLE");
assert.equal(validation.metrics.thresholdCount, 5);
assert.equal(validation.metrics.storedThresholdCount, 5);
assert.equal(validation.metrics.tierCount, 3);

const rebuilt = rebuildProgressionThresholds({
  thresholds: fixture.curve.thresholds,
  minimumLevel: 1,
  maximumLevel: 6,
});
assert.equal(rebuilt.length, 6);
assert.equal(rebuilt[0].cumulativeExperience, 0);
assert.ok(rebuilt[5].cumulativeExperience > rebuilt[4].cumulativeExperience);

const invalid = validateProgressionProfileEditorValue({
  ...fixture,
  curve: {
    ...fixture.curve,
    thresholds: [
      { level: 1, cumulativeExperience: 0 },
      { level: 2, cumulativeExperience: 0 },
    ],
  },
});
assert.equal(invalid.valid, false);
assert.ok(
  invalid.errors.some(
    (entry) => entry.code === "PROGRESSION_THRESHOLD_COUNT_INVALID"
  )
);

const normalized = normalizeProgressionProfileEditorValue({
  title: " Compact Progression ",
  tags: "hero, Hero, campaign",
  curve: {
    mode: "THRESHOLD_TABLE",
    minimumLevel: 1,
    maximumLevel: 2,
    thresholds: [
      { level: 1, cumulativeExperience: 0 },
      { level: 2, cumulativeExperience: 100 },
    ],
  },
});
assert.equal(normalized.title, "Compact Progression");
assert.deepEqual(normalized.tags, ["hero", "campaign"]);
assert.equal(normalized.curve.mode, "EXPLICIT_TABLE");

const generated = createDefaultGeneratedProgressionProfile();
const generatedValidation = validateProgressionProfileEditorValue(generated);
assert.equal(generatedValidation.valid, true);
assert.equal(generatedValidation.metrics.thresholdCount, 20);
assert.equal(generatedValidation.metrics.storedThresholdCount, 0);
assert.equal(generatedValidation.metrics.maximumThreshold, 361400);
const generatedRows = buildProgressionCurvePreview(generated.curve);
assert.equal(generatedRows[1].cumulativeExperience, 300);
assert.equal(
  generatedRows.find((row) => row.level === 5)?.cumulativeExperience,
  4200
);
assert.equal(generatedRows.at(-1)?.cumulativeExperience, 361400);

const preview = buildProgressionCurvePreviewRows({
  ...generated.curve,
  maximumLevel: 100,
});
assert.equal(preview.rows.length, 12);
assert.equal(preview.omittedCount, 88);
assert.equal(preview.rows[0].level, 1);
assert.equal(preview.rows.at(-1).level, 100);

const viewSource = readFileSync(
  new URL("./ProgressionProfileEditor.view.jsx", import.meta.url),
  "utf8"
);
assert.match(viewSource, /<details className="group mt-6/);
assert.match(viewSource, /<summary className="cursor-pointer list-none/);
assert.match(viewSource, /<table className="w-full min-w-\[560px\] table-fixed/);
assert.match(viewSource, /group-open:rotate-180/);
assert.doesNotMatch(viewSource, /grid-cols-\[0\.3fr_0\.8fr_1fr_0\.55fr\]/);

const overrideProfile = {
  ...generated,
  curve: {
    ...generated.curve,
    mode: "GENERATED_CURVE_WITH_OVERRIDES",
    maximumLevel: 6,
    overrides: [
      {
        id: "override.level_5",
        level: 5,
        cumulativeExperience: 5000,
      },
    ],
  },
};
const overrideValidation = validateProgressionProfileEditorValue(
  overrideProfile
);
assert.equal(overrideValidation.valid, true);
assert.equal(overrideValidation.metrics.overrideCount, 1);
assert.equal(
  buildProgressionCurvePreview(overrideValidation.normalized.curve).find(
    (row) => row.level === 5
  )?.cumulativeExperience,
  5000
);

const duplicateOverride = validateProgressionProfileEditorValue({
  ...overrideProfile,
  curve: {
    ...overrideProfile.curve,
    overrides: [
      { id: "override.a", level: 5, experienceCost: 1000 },
      { id: "override.b", level: 5, experienceCost: 1200 },
    ],
  },
});
assert.equal(duplicateOverride.valid, false);
assert.ok(
  duplicateOverride.errors.some(
    (entry) => entry.code === "PROGRESSION_OVERRIDE_LEVEL_DUPLICATE"
  )
);

assert.equal(
  resolveProgressionProfileCreationTitle({
    creationTitle: "",
    profileTitle: " Profile Title Fallback ",
  }),
  "Profile Title Fallback"
);
assert.equal(
  resolveProgressionProfileCreationTitle({
    creationTitle: " Explicit Creation Title ",
    profileTitle: "Profile Title",
  }),
  "Explicit Creation Title"
);
assert.equal(
  resolveProgressionProfileCreationTitle({
    creationTitle: "",
    profileTitle: "",
  }),
  ""
);

console.log(
  JSON.stringify(
    {
      diagnostic: "progression_profile_editor_contract_v0_1",
      status: "PASSED",
      curveGeneratorVersion: PROGRESSION_CURVE_GENERATOR_VERSION,
      explicitThresholdCount: validation.metrics.thresholdCount,
      generatedThresholdCount: generatedValidation.metrics.thresholdCount,
      generatedMaximumThreshold: generatedValidation.metrics.maximumThreshold,
      overrideCount: overrideValidation.metrics.overrideCount,
      tierCount: validation.metrics.tierCount,
      creationTitleFallback: true,
      collapsedPreview: true,
      compactTablePreview: true,
    },
    null,
    2
  )
);
