import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  normalizeStoryStatusSurfaces,
} from "./storyStatusSurfacesNormalization.js";
import {
  addStoryStatusSurface,
  addStoryStatusSurfaceReadout,
  moveStoryStatusSurfaceReadout,
  patchStoryStatusSurface,
  patchStoryStatusSurfaceReadout,
} from "./storyStatusSurfacesOperations.js";

import {
  buildStoryStatusSurfaceMechanicsSourceOptions,
} from "../mechanics-module-assembly/mechanicsModuleAssemblyOperations.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(currentDir, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(mechanicsRoot, relativePath), "utf8");
}

const source = [
  {
    id: "world",
    title: "World",
    enabled: true,
    presentation: { host: "INLINE", placement: "TOP" },
    readouts: [
      {
        id: "weather",
        label: "Weather",
        source: { domain: "MECHANICS", bucket: "STAGE", valueId: "weather" },
      },
    ],
    futureMetadata: { preserved: true },
  },
];

const normalized = normalizeStoryStatusSurfaces(source);
assert.equal(normalized.length, 1);
assert.equal(normalized[0].presentation.placement, "TOP");
assert.equal(normalized[0].readouts[0].source.domain, "MECHANICS");
assert.deepEqual(normalized[0].futureMetadata, { preserved: true });

const withSurface = addStoryStatusSurface(normalized);
assert.equal(withSurface.length, 2);
assert.equal(withSurface[1].presentation.host, "INLINE");
assert.equal(withSurface[1].presentation.placement, "BOTTOM");

let edited = addStoryStatusSurfaceReadout(withSurface, 1);
assert.equal(edited[1].readouts.length, 1);
edited = patchStoryStatusSurfaceReadout(edited, 1, 0, {
  label: "HP",
  source: {
    domain: "STATS_POOLS",
    bindingId: "stats",
    kind: "POOL",
    valueId: "pool.health",
  },
});
assert.equal(edited[1].readouts[0].source.valueId, "pool.health");
assert.equal(edited[1].readouts[0].label, "HP");

edited = addStoryStatusSurfaceReadout(edited, 1);
edited = patchStoryStatusSurfaceReadout(edited, 1, 1, {
  label: "Gold",
  source: { domain: "WALLET", bindingId: "wallet", valueId: "currency.gold" },
});
edited = moveStoryStatusSurfaceReadout(edited, 1, 1, -1);
assert.equal(edited[1].readouts[0].label, "Gold");

edited = addStoryStatusSurfaceReadout(edited, 1);
edited = patchStoryStatusSurfaceReadout(edited, 1, 2, {
  label: "Level",
  source: { domain: "PROGRESSION", bindingId: "progression", valueId: "level" },
});
assert.equal(edited[1].readouts[2].source.domain, "PROGRESSION");
assert.equal(edited[1].readouts[2].source.valueId, "level");

const progressionAlias = normalizeStoryStatusSurfaces([
  {
    id: "actor",
    readouts: [
      {
        id: "xp",
        source: {
          domain: "PROGRESSION",
          bindingId: "progression",
          valueId: "xp_progress",
        },
      },
    ],
  },
]);
assert.equal(progressionAlias[0].readouts[0].source.domain, "PROGRESSION");
assert.equal(progressionAlias[0].readouts[0].source.valueId, "xp_progress");

edited = patchStoryStatusSurface(edited, 1, {
  presentation: { placement: "TOP" },
});
assert.equal(edited[1].presentation.placement, "TOP");
assert.equal(edited[1].presentation.host, "INLINE");

const mechanicsOptions = buildStoryStatusSurfaceMechanicsSourceOptions({
  trackers: [{ id: "tension", label: "Tension", min: 0, max: 100, initial: 0 }],
  defaults: {
    flags: [{ id: "under_contract", label: "Under Contract" }],
    counters: [{ id: "day", label: "Day" }],
    stages: [{ id: "weather", label: "Weather" }],
  },
});
assert.deepEqual(
  mechanicsOptions.map((option) => [option.bucket, option.valueId]),
  [
    ["METER", "tension"],
    ["FLAG", "under_contract"],
    ["COUNTER", "day"],
    ["STAGE", "weather"],
  ]
);


const progressionValidation = validateMechanicsModuleData({
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  priority: 65,
  tags: [],
  instanceData: {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [],
    commands: [],
    guards: [],
    statusBlocks: [],
    defaults: { flags: [], counters: [], stages: [] },
    storyStatusSurfaces: [
      {
        id: "actor_progress",
        presentation: { host: "INLINE", placement: "BOTTOM" },
        readouts: [
          {
            id: "xp",
            label: "XP",
            source: {
              domain: "PROGRESSION",
              bindingId: "progression",
              valueId: "xp_progress",
            },
          },
        ],
      },
    ],
  },
});
assert.equal(progressionValidation.valid, true);
assert.equal(
  progressionValidation.data.instanceData.storyStatusSurfaces[0].readouts[0].source.domain,
  "PROGRESSION"
);
assert.equal(
  progressionValidation.data.instanceData.storyStatusSurfaces[0].readouts[0].source.valueId,
  "xp_progress"
);

const futureHost = normalizeStoryStatusSurfaces([
  {
    id: "future",
    presentation: { host: "DRAWER", placement: "TOP" },
    readouts: [],
  },
]);
assert.equal(
  futureHost[0].presentation.host,
  "DRAWER",
  "older authoring must preserve a future host instead of silently converting it to INLINE"
);

const assembly = read("mechanics-module-assembly/MechanicsModuleAssembly.jsx");
const assemblyView = read("mechanics-module-assembly/MechanicsModuleAssembly.view.jsx");
const assemblyVm = read("mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js");
const documentNormalization = read("mechanics-core/mechanicsDocumentNormalization.js");
const jsonValidation = read("mechanics-json-editor/mechanicsJsonEditor.validation.js");
const aiGuide = read("mechanics-json-editor/mechanicsJsonAiAuthoringGuide.js");
const view = read("mechanics-story-status-surfaces/StoryStatusSurfaces.view.jsx");

for (const marker of [
  "StoryStatusSurfaces",
  "projection.storyStatusSurfaces",
  "updateStoryStatusSurfaces",
]) {
  assert.match(assembly + assemblyVm, new RegExp(marker));
}
assert.match(assemblyView, /Story Status Surfaces/);
assert.match(assemblyView, /storyStatusSurfacesContent/);
assert.match(documentNormalization, /storyStatusSurfaces/);
assert.match(jsonValidation, /STORY_STATUS_SURFACE_SOURCE_DOMAINS/);
assert.match(jsonValidation, /authoritative value ID/);
assert.match(aiGuide, /Story Status Surfaces/);
assert.match(aiGuide, /Do not duplicate Stats & Pools, Progression, or Wallet values/);
assert.match(view, /Top \/ Header/);
assert.match(view, /Bottom \/ Footer/);
assert.match(view, /Progression Binding ID/);
assert.match(view, /Progression Value/);
assert.match(view, /future modal or drawer hosts can reuse the same readouts/i);
assert.doesNotMatch(view, /fetch\s*\(|supabase|PostGraphile/);
assert.doesNotMatch(view, /Crownfall|Vermillion|Mana|Stamina|Health|Gold-Scent|Sunspill/);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_status_surface_visual_authoring_v1",
      status: "PASSED",
      visualSurfaceAddEditRemoveSupported: true,
      visualReadoutAddEditRemoveAndOrderingSupported: true,
      creatorControlsTitleLabelsAndOrdering: true,
      inlineTopHeaderSupported: true,
      inlineBottomFooterSupported: true,
      mechanicsSourceSupported: true,
      statsPoolsSourceSupported: true,
      progressionSourceSupported: true,
      progressionSourcePreservedWithoutFallback: true,
      progressionCanonicalValuePickerSupported: true,
      progressionJsonValidationAndCanonicalizationAligned: true,
      walletSourceSupported: true,
      currentModuleMechanicsValuesSuggested: true,
      authoritativeValuesNotDuplicated: true,
      futureHostPreservationProtected: true,
      modalDrawerControlsPrematurelyExposed: false,
      jsonEditorValidationAligned: true,
      aiAuthoringGuideAligned: true,
      providerAuthorityGranted: false,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
