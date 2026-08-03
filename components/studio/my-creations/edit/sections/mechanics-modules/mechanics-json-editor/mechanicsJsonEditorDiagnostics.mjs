import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  MECHANICS_COMPOSITION_VERSION,
  MECHANICS_INSTANCE_DATA_VERSION,
  MECHANICS_JSON_EDITOR_VALIDATION_VERSION,
  canonicalizeMechanicsModuleData,
  formatMechanicsJsonData,
  validateMechanicsJsonText,
  validateMechanicsModuleData,
} from "./mechanicsJsonEditor.validation.js";
import {
  MECHANICS_JSON_AI_AUTHORING_GUIDE_FILENAME,
  MECHANICS_JSON_AI_AUTHORING_GUIDE_MIME_TYPE,
  MECHANICS_JSON_AI_AUTHORING_GUIDE_VERSION,
  buildMechanicsJsonAiAuthoringGuide,
} from "./mechanicsJsonAiAuthoringGuide.js";

const ROOT = process.cwd();

const FEATURE_DIR = path.join(
  ROOT,
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor"
);
const MECHANICS_SECTION_PATH = path.join(
  ROOT,
  "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx"
);
const MECHANICS_ASSEMBLY_SHELL_PATH = path.join(
  ROOT,
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
);
const CREATION_SHELL_PATH = path.join(
  ROOT,
  "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
);
const RESOLUTION_BUILDER_PATH = path.join(
  ROOT,
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanicsCommandResolutionBuilder.js"
);
const PREVIEW_PAGE_PATH = path.join(
  ROOT,
  "app/dev/ui-preview/mechanics-json-editor/page.jsx"
);

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const validMechanicsData = {
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  priority: 65,
  tags: ["mechanics", "test"],
  contractVersion: "trackers_instance_data.v0_2",
  customMetadata: {
    preserved: true,
  },
  instanceData: {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [
      {
        id: "trust",
        label: "Trust",
        kind: "meter",
        min: 0,
        max: 100,
        initial: 40,
        phases: [],
        mutationHints: [],
      },
    ],
    commands: [
      {
        id: "probe",
        label: "Probe",
        commandContractVersion: "mechanics_command_contract_v1",
        invocation: {
          version: "mechanics_command_invocation_v1",
          command: "probe",
          prefixes: ["/"],
          aliases: [],
          arguments: [
            {
              name: "target",
              label: "Target",
              type: "CHARACTER_PRESENT",
              required: true,
              consumeRemaining: true,
              allowQuoted: true,
              options: [],
            },
            {
              name: "item",
              label: "Item",
              type: "ITEM_HELD",
              required: true,
              consumeRemaining: false,
              allowQuoted: true,
              options: [],
            },
            {
              name: "condition",
              label: "Condition",
              type: "TEXT",
              required: true,
              consumeRemaining: false,
              allowQuoted: true,
              options: [],
            },
          ],
        },
        requirements: [],
        attemptEffects: [
          {
            id: "spend_trust",
            type: "METER_DELTA",
            targetId: "trust",
            targetBinding: {
              mode: "FIXED",
              argumentName: "",
            },
            delta: -1,
            amount: -1,
          },
        ],
        resolution: {
          version: "mechanics_command_resolution_v6",
          mode: "THRESHOLD_DIE",
          rollMode: "NORMAL",
          die: {
            count: 1,
            sides: 20,
          },
          targetNumber: 11,
          modifiers: [],
          modifierSources: [],
          opposed: null,
          degreeOfSuccess: {
            enabled: false,
          },
          criticalOnNaturalMax: true,
          fumbleOnNaturalMin: true,
        },
        outcomes: {
          version: "mechanics_command_outcomes_v1",
          CRITICAL_SUCCESS: {
            outcome: "CRITICAL_SUCCESS",
            effectMode: "INHERIT",
            effects: [],
            summary: "",
          },
          SUCCESS: {
            outcome: "SUCCESS",
            effectMode: "INHERIT",
            effects: [],
            summary: "",
          },
          FAILURE: {
            outcome: "FAILURE",
            effectMode: "NONE",
            effects: [],
            summary: "",
          },
          FUMBLE: {
            outcome: "FUMBLE",
            effectMode: "NONE",
            effects: [],
            summary: "",
          },
        },
        domainAction: {
          version: "mechanics_command_domain_action_v1",
          enabled: false,
          type: "NONE",
          applyOnOutcomes: [],
        },
        composition: {
          version: "mechanics_command_composition_v1",
          mechanicsSteps: [
            {
              id: "mark_attempt",
              label: "Mark Attempt",
              enabled: true,
              phase: "ATTEMPT",
              failurePolicy: "CONTINUE",
              dependsOnStepIds: [],
              conditionMode: "ALL",
              conditions: [],
              applyOnOutcomes: [],
              effects: [
                {
                  id: "attempt_count",
                  type: "COUNTER_INCREMENT",
                  targetId: "attempts",
                  targetBinding: {
                    mode: "FIXED",
                    argumentName: "",
                  },
                  amount: 1,
                },
              ],
            },
            {
              id: "mark_target",
              label: "Mark Target",
              enabled: true,
              phase: "OUTCOME",
              failurePolicy: "SKIP_DEPENDENTS",
              dependsOnStepIds: ["mark_attempt"],
              conditionMode: "ALL",
              conditions: [
                {
                  id: "target_ready",
                  bucket: "COUNTER",
                  mechanicsId: "probe_hits",
                  scopeMode: "TARGET_ARGUMENT",
                  argumentName: "target",
                  field: "value",
                  operator: "GTE",
                  value: 0,
                  enabled: true,
                },
              ],
              applyOnOutcomes: ["SUCCESS", "CRITICAL_SUCCESS"],
              effects: [
                {
                  id: "probe_hit",
                  type: "COUNTER_INCREMENT",
                  targetId: "probe_hits",
                  targetBinding: {
                    mode: "ARGUMENT",
                    argumentName: "target",
                  },
                  amount: 1,
                },
              ],
            },
          ],
          domainSteps: [
            {
              id: "give_item",
              label: "Give Item",
              enabled: true,
              failurePolicy: "STOP",
              dependsOnStepIds: ["mark_target"],
              action: {
                version: "mechanics_command_domain_action_v1",
                enabled: true,
                type: "ITEM_GIVE",
                itemArgumentName: "item",
                targetArgumentName: "target",
                applyOnOutcomes: ["SUCCESS", "CRITICAL_SUCCESS"],
              },
            },
            {
              id: "apply_condition",
              label: "Apply Condition",
              enabled: true,
              failurePolicy: "CONTINUE",
              dependsOnStepIds: ["give_item"],
              action: {
                version: "mechanics_command_domain_action_v1",
                enabled: true,
                type: "PARTICIPANT_CONDITION_APPLY",
                targetArgumentName: "target",
                conditionArgumentName: "condition",
                applyOnOutcomes: ["SUCCESS", "CRITICAL_SUCCESS"],
              },
            },
          ],
        },
        presentation: {
          mode: "MECHANICS_ACTION",
          continueNarrative: false,
          advanceTime: false,
          resultVisibility: "FULL",
        },
        triggers: [],
        effects: [],
      },
    ],
    guards: [],
    statusBlocks: [],
    defaults: {
      flags: [],
      counters: [
        {
          id: "attempts",
          label: "Attempts",
          initial: 0,
        },
      ],
      stages: [],
    },
  },
};

test("Validation contract starts at v1", () => {
  assert(
    MECHANICS_JSON_EDITOR_VALIDATION_VERSION ===
      "mechanics_json_editor_validation_v1",
    "Unexpected validation version."
  );
});

test("Canonical instance-data contract remains v0.2", () => {
  assert(
    MECHANICS_INSTANCE_DATA_VERSION ===
      "trackers_instance_data.v0_2",
    "Unexpected instance-data version."
  );
});

test("Composition contract remains v1", () => {
  assert(
    MECHANICS_COMPOSITION_VERSION ===
      "mechanics_command_composition_v1",
    "Unexpected composition version."
  );
});

test("Representative MC6 Mechanics data validates", () => {
  const result = validateMechanicsModuleData(validMechanicsData);

  assert(result.valid, JSON.stringify(result.errors));
  assert(result.errors.length === 0, "Unexpected errors.");
});

test("Valid text returns canonical formatted JSON", () => {
  const result = validateMechanicsJsonText(
    JSON.stringify(validMechanicsData)
  );

  assert(result.valid, "Expected valid JSON.");
  assert(
    result.formattedText.includes("\n  "),
    "Expected formatted indentation."
  );
});

test("Invalid JSON syntax is rejected", () => {
  const result = validateMechanicsJsonText('{"instanceData":');

  assert(!result.valid, "Broken JSON must fail.");
  assert(result.errors[0]?.path === "$", "Expected root syntax path.");
});

test("Array roots are rejected", () => {
  const result = validateMechanicsModuleData([]);

  assert(!result.valid, "Array root must fail.");
});

test("Duplicate tracker ids are rejected", () => {
  const value = clone(validMechanicsData);
  value.instanceData.trackers.push(
    clone(value.instanceData.trackers[0])
  );

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Duplicate tracker must fail.");
  assert(
    result.errors.some((entry) =>
      entry.message.includes("Duplicate tracker")
    ),
    "Expected duplicate tracker error."
  );
});

test("Duplicate command ids are rejected", () => {
  const value = clone(validMechanicsData);
  value.instanceData.commands.push(
    clone(value.instanceData.commands[0])
  );

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Duplicate command must fail.");
});

test("Unknown resolution modes are rejected", () => {
  const value = clone(validMechanicsData);
  value.instanceData.commands[0].resolution.mode = "UNKNOWN";

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Unknown mode must fail.");
  assert(
    result.errors.some((entry) =>
      entry.path.endsWith(".resolution.mode")
    ),
    "Expected resolution path."
  );
});

test("Argument-bound effects require an existing target argument", () => {
  const value = clone(validMechanicsData);
  value.instanceData.commands[0].composition.mechanicsSteps[1]
    .effects[0].targetBinding.argumentName = "missing";

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Missing effect argument must fail.");
});

test("Forward composition dependencies are rejected", () => {
  const value = clone(validMechanicsData);
  value.instanceData.commands[0].composition.mechanicsSteps[0]
    .dependsOnStepIds = ["mark_target"];

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Forward dependency must fail.");
});

test("Domain composition is limited to three authored actions", () => {
  const value = clone(validMechanicsData);
  const steps =
    value.instanceData.commands[0].composition.domainSteps;
  steps.push(
    {
      ...clone(steps[0]),
      id: "give_item_2",
    },
    {
      ...clone(steps[1]),
      id: "apply_condition_2",
    }
  );

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "More than three domain steps must fail.");
});

test("Duplicate domain patch lanes are rejected", () => {
  const value = clone(validMechanicsData);
  value.instanceData.commands[0].composition.domainSteps[1] = {
    ...clone(
      value.instanceData.commands[0].composition.domainSteps[0]
    ),
    id: "second_item_action",
    dependsOnStepIds: ["give_item"],
  };

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Duplicate Item lane must fail.");
  assert(
    result.errors.some((entry) =>
      entry.message.includes("ITEM_RUNTIME")
    ),
    "Expected Item lane error."
  );
});

test("Location actions must be final", () => {
  const value = clone(validMechanicsData);
  const steps =
    value.instanceData.commands[0].composition.domainSteps;
  steps.unshift({
    id: "move_first",
    label: "Move First",
    enabled: true,
    failurePolicy: "CONTINUE",
    dependsOnStepIds: [],
    action: {
      version: "mechanics_command_domain_action_v1",
      enabled: true,
      type: "LOCATION_TRAVEL_OPERATION",
      travelOperation: "CONTINUE",
      applyOnOutcomes: ["SUCCESS"],
    },
  });

  const result = validateMechanicsModuleData(value);

  assert(!result.valid, "Non-final location action must fail.");
});

test("Unknown root metadata is preserved", () => {
  const canonical =
    canonicalizeMechanicsModuleData(validMechanicsData);

  assert(
    canonical.customMetadata?.preserved === true,
    "Unknown metadata was discarded."
  );
});

test("Canonicalization advances resolutions to v6", () => {
  const canonical =
    canonicalizeMechanicsModuleData(validMechanicsData);

  assert(
    canonical.instanceData.commands[0].resolution.version ===
      "mechanics_command_resolution_v6",
    "Resolution did not normalize to v6."
  );
});

test("Canonicalization retains authored composition", () => {
  const canonical =
    canonicalizeMechanicsModuleData(validMechanicsData);
  const composition =
    canonical.instanceData.commands[0].composition;

  assert(
    composition.version ===
      "mechanics_command_composition_v1",
    "Composition version changed."
  );
  assert(
    composition.mechanicsSteps.length === 2 &&
      composition.domainSteps.length === 2,
    "Composition steps were lost."
  );
});

test("Formatting current builder data is deterministic", () => {
  const left = formatMechanicsJsonData(validMechanicsData);
  const right = formatMechanicsJsonData(
    JSON.parse(left)
  );

  assert(left === right, "Round-trip formatting is not stable.");
});

test("LOOM Shell binds ViewModel to View", () => {
  const source = read(
    path.join(FEATURE_DIR, "MechanicsJsonEditorModal.jsx")
  );

  assert(
    source.includes("useMechanicsJsonEditorViewModel") &&
      source.includes("MechanicsJsonEditorModalView") &&
      source.includes("<MechanicsJsonEditorModalView"),
    "Binding Shell does not match the LOOM pattern."
  );
});

test("Portable View owns presentation without application state", () => {
  const source = read(
    path.join(
      FEATURE_DIR,
      "MechanicsJsonEditorModal.view.jsx"
    )
  );

  assert(
    source.includes('from "@/components/ui/ModalShell"'),
    "View must use shared ModalShell."
  );
  assert(
    !source.includes("useState") &&
      !source.includes("useEffect") &&
      !source.includes("fetch(") &&
      !source.includes("/lib/client") &&
      !source.includes("Supabase") &&
      !source.includes("PostGraphile"),
    "Portable View contains application behavior."
  );
});

test("ViewModel owns validation and mutation orchestration", () => {
  const source = read(
    path.join(
      FEATURE_DIR,
      "useMechanicsJsonEditorViewModel.js"
    )
  );

  assert(
    source.includes("validateMechanicsJsonText") &&
      source.includes("onApply?.(result.data)") &&
      source.includes("navigator.clipboard") &&
      source.includes("buildMechanicsJsonAiAuthoringGuide") &&
      source.includes("new Blob") &&
      source.includes("URL.createObjectURL") &&
      source.includes("anchor.download"),
    "ViewModel is missing expected authoring behavior."
  );
});

test("Versioned semantic contract is present", () => {
  const source = read(
    path.join(
      FEATURE_DIR,
      "MechanicsJsonEditorModal.contract.js"
    )
  );

  assert(
    source.includes(
      "mechanics_json_editor_view_contract_v1_1"
    ),
    "View contract version is missing."
  );
});

test("Contract-shaped fixtures cover valid error and warning states", () => {
  const source = read(
    path.join(
      FEATURE_DIR,
      "mechanicsJsonEditor.fixtures.js"
    )
  );

  assert(
    source.includes("mechanicsJsonEditorBaseFixture") &&
      source.includes("mechanicsJsonEditorErrorFixture") &&
      source.includes("mechanicsJsonEditorWarningFixture") &&
      source.includes("guideDownloadStatus") &&
      source.includes("onDownloadAiGuide"),
    "Expected preview fixtures are missing."
  );
});

test("Development preview is production-gated", () => {
  const source = read(PREVIEW_PAGE_PATH);

  assert(
    source.includes('process.env.NODE_ENV === "production"') &&
      source.includes("notFound()"),
    "Preview route is not production-gated."
  );
});

test("Mechanics builder exposes the JSON Editor action", () => {
  const source = read(MECHANICS_SECTION_PATH);
  const assemblyShell = read(MECHANICS_ASSEMBLY_SHELL_PATH);
  const orchestrationView = read(
    path.join(
      path.dirname(MECHANICS_SECTION_PATH),
      "mechanics-document-orchestration/MechanicsDocumentOrchestration.view.jsx"
    )
  );
  const orchestrationShell = read(
    path.join(
      path.dirname(MECHANICS_SECTION_PATH),
      "mechanics-document-orchestration/MechanicsDocumentOrchestration.jsx"
    )
  );

  assert(
    assemblyShell.includes("MechanicsDocumentOrchestrationControls") &&
      source.includes("replaceData(normalizeMechanicsDocument(nextData))") &&
      orchestrationView.includes("JSON Editor") &&
      orchestrationShell.includes("<MechanicsJsonEditorModal"),
    "Mechanics builder integration is incomplete."
  );
});

test("Creation edit shell replaces form.data atomically", () => {
  const source = read(CREATION_SHELL_PATH);

  assert(
    source.includes('updateField("data", nextData)'),
    "Creation shell must replace the complete data object through updateField."
  );
});

test("Resolution builder remains frozen at v6", () => {
  const source = read(RESOLUTION_BUILDER_PATH);

  assert(
    source.includes('"mechanics_command_resolution_v6"'),
    "Resolution builder contract changed."
  );
});

test("Feature README documents the persistence boundary", () => {
  const source = read(path.join(FEATURE_DIR, "README.md"));

  assert(
    source.includes("existing page Save action") &&
      source.includes("does not save the creation"),
    "README does not preserve the persistence boundary."
  );
});


test("AI authoring guide contract starts at v1", () => {
  assert(
    MECHANICS_JSON_AI_AUTHORING_GUIDE_VERSION ===
      "mechanics_json_ai_authoring_guide_v1",
    "Unexpected AI authoring guide version."
  );
  assert(
    MECHANICS_JSON_AI_AUTHORING_GUIDE_FILENAME ===
      "crestfall-mechanics-json-ai-authoring-guide.md",
    "Unexpected AI authoring guide filename."
  );
  assert(
    MECHANICS_JSON_AI_AUTHORING_GUIDE_MIME_TYPE ===
      "text/markdown;charset=utf-8",
    "Unexpected AI authoring guide MIME type."
  );
});

test("AI authoring guide is deterministic generic and bounded", () => {
  const first = buildMechanicsJsonAiAuthoringGuide();
  const second = buildMechanicsJsonAiAuthoringGuide();

  assert(first === second, "AI authoring guide output is not deterministic.");
  assert(
    first.length >= 12000 && first.length <= 65536,
    "AI authoring guide size is outside its bounded range."
  );
  assert(
    !first.includes('"customMetadata"') &&
      !first.includes('"preserved": true') &&
      !first.includes("ownerId"),
    "AI authoring guide contains creation-specific data."
  );
});

test("AI authoring guide documents complete JSON and persistence rules", () => {
  const guide = buildMechanicsJsonAiAuthoringGuide();

  [
    "Return exactly one complete JSON object.",
    "Return JSON only.",
    "Never return a partial patch",
    "Preserve unknown metadata",
    "Do not invent database UUIDs",
    "Validate & Apply",
    "page-level **Save** action",
  ].forEach((marker) => {
    assert(
      guide.includes(marker),
      `AI authoring guide is missing ${marker}.`
    );
  });
});

test("AI authoring guide documents frozen Mechanics contracts", () => {
  const guide = buildMechanicsJsonAiAuthoringGuide();

  [
    "core.trackers.v1",
    "trackers_instance_data.v0_2",
    "mechanics_command_contract_v1",
    "mechanics_command_invocation_v1",
    "mechanics_command_resolution_v6",
    "mechanics_command_outcomes_v1",
    "mechanics_command_composition_v1",
    "mechanics_command_domain_action_v1",
    "mechanics_command_state_readout_v1",
  ].forEach((marker) => {
    assert(
      guide.includes(marker),
      `AI authoring guide is missing ${marker}.`
    );
  });
});

test("AI authoring guide documents validation enums and domain rules", () => {
  const guide = buildMechanicsJsonAiAuthoringGuide();

  [
    "CHARACTER_PRESENT",
    "LOCATION_CONNECTED",
    "PROGRESSION_RECONCILE",
    "NO_ROLL_DETERMINISTIC",
    "OPPOSED_DIE",
    "HARD_LOCK",
    "PARTICIPANT_CONDITION_APPLY",
    "At most three authored domain steps",
    "A Location action must be the final",
  ].forEach((marker) => {
    assert(
      guide.includes(marker),
      `AI authoring guide is missing ${marker}.`
    );
  });
});

test("Portable View exposes the AI guide download action", () => {
  const source = read(
    path.join(
      FEATURE_DIR,
      "MechanicsJsonEditorModal.view.jsx"
    )
  );

  assert(
    source.includes("Download") &&
      source.includes("onDownloadAiGuide") &&
      source.includes("Download AI Guide") &&
      source.includes("Guide Downloaded"),
    "Portable View is missing the AI guide download action."
  );
});

test("AI guide export remains local and persistence free", () => {
  const guideSource = read(
    path.join(
      FEATURE_DIR,
      "mechanicsJsonAiAuthoringGuide.js"
    )
  );
  const viewModelSource = read(
    path.join(
      FEATURE_DIR,
      "useMechanicsJsonEditorViewModel.js"
    )
  );
  const combined = `${guideSource}\n${viewModelSource}`;

  [
    "fetch(",
    "/lib/client",
    "Supabase",
    "PostGraphile",
    "CRESTFALL_API_INTERNAL_URL",
    "createChat",
  ].forEach((marker) => {
    assert(
      !combined.includes(marker),
      `AI guide export contains forbidden coupling ${marker}.`
    );
  });
});

const startedAt = Date.now();
let passed = 0;
let failed = 0;

console.log("Crestfall mc8g1_mechanics_json_ai_authoring_guide_diagnostics_v1");
console.log(`Node ${process.version}`);
console.log("");

for (let index = 0; index < tests.length; index += 1) {
  const entry = tests[index];
  const testStartedAt = Date.now();

  try {
    await entry.fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStartedAt} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${entry.name} (${Date.now() - testStartedAt} ms)`
    );
    console.log(`     ${error?.message || error}`);
  }
}

console.log("");
console.log(
  `Summary: ${passed} passed, ${failed} failed, ${tests.length} total`
);
console.log(`Elapsed: ${Date.now() - startedAt} ms`);

if (failed) {
  process.exitCode = 1;
}
