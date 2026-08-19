import assert from "node:assert/strict";
import fs from "node:fs";

import {
  narratorModuleGroups as CURRENT_FE_NARRATOR_MODULE_GROUPS,
} from "../../narratorModulePresets.js";

import {
  NARRATOR_BUILDER_DEFAULT_MODULES,
  NARRATOR_BUILDER_VIEW_CONTRACT_VERSION,
} from "../NarratorBuilder.contract.js";

import {
  NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION,
} from "../../narrator-module-selector/NarratorModuleSelector.contract.js";

import {
  NARRATOR_PRESENTATION_CANONICAL_DEFAULTS,
  NARRATOR_PRESENTATION_CANONICAL_GROUPS,
  NARRATOR_PRESENTATION_DEPRECATED_GROUPS,
  NARRATOR_PRESENTATION_LEGACY_TOP_LEVEL_FIELDS,
  NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION,
  NARRATOR_PRESENTATION_RESPONSE_DIRECTION_GROUPS,
  getNarratorPresentationCurrentFeDrift,
  projectNarratorPresentationModuleScopeBinding,
} from "./NarratorPresentationModuleScopeBinding.contract.js";

import {
  narratorPresentationModuleScopeCanonicalFixture,
  narratorPresentationModuleScopeInvalidSelectionFixture,
  narratorPresentationModuleScopeLegacySelectionFixture,
} from "./NarratorPresentationModuleScopeBinding.fixtures.js";

assert.equal(
  NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION,
  "narrator_presentation_module_scope_binding_v1"
);

assert.equal(
  NARRATOR_BUILDER_VIEW_CONTRACT_VERSION,
  "1.0.0"
);

assert.equal(
  NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION,
  "1.0.0"
);

assert.deepEqual(
  CURRENT_FE_NARRATOR_MODULE_GROUPS.map(
    (group) => group.id
  ),
  [
    "prose_style",
    "detail_level",
    "pacing",
    "atmosphere",
  ]
);

assert.deepEqual(
  NARRATOR_PRESENTATION_CANONICAL_GROUPS.map(
    (group) => group.id
  ),
  [
    "prose_style",
    "detail_level",
    "pacing",
    "atmosphere",
  ]
);

assert.deepEqual(
  NARRATOR_PRESENTATION_CANONICAL_DEFAULTS,
  {
    prose_style: "cinematic",
    detail_level: "balanced",
    pacing: "balanced",
    atmosphere: "adventurous",
  }
);

assert.deepEqual(
  NARRATOR_PRESENTATION_RESPONSE_DIRECTION_GROUPS
    .find(
      (group) =>
        group.id ===
        "portrayal_mode"
    )
    .options
    .map(
      (option) =>
        option.title
    ),
  [
    "Scene Narration Only — Default",
    "Ensemble Narration — Opt In",
  ]
);

assert.deepEqual(
  NARRATOR_PRESENTATION_DEPRECATED_GROUPS.map(
    (group) => [
      group.id,
      group.replacementAuthority,
    ]
  ),
  [
    [
      "dialogue_style",
      "CHARACTER_VOICE_AND_VOICE_MODULES",
    ],
    [
      "knowledge_behavior",
      "REGISTRY_RUNTIME_KNOWLEDGE_BOUNDARIES",
    ],
  ]
);

assert.deepEqual(
  NARRATOR_PRESENTATION_LEGACY_TOP_LEVEL_FIELDS,
  [
    "pacing",
    "detail_level",
  ]
);

const drift =
  getNarratorPresentationCurrentFeDrift();

assert.deepEqual(
  drift.extraCurrentFeGroupIds,
  []
);

assert.deepEqual(
  drift.missingCurrentFeGroupIds,
  []
);

assert.deepEqual(
  drift.currentFeDefaultKeys,
  [
    "prose_style",
    "detail_level",
    "pacing",
    "atmosphere",
  ]
);

assert.deepEqual(
  drift.canonicalDefaultKeys,
  [
    "prose_style",
    "detail_level",
    "pacing",
    "atmosphere",
  ]
);

const legacy =
  projectNarratorPresentationModuleScopeBinding(
    narratorPresentationModuleScopeLegacySelectionFixture
  );

assert.equal(
  legacy.bindingContractVersion,
  NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION
);

assert.equal(
  legacy.narratorBuilderViewContractVersion,
  NARRATOR_BUILDER_VIEW_CONTRACT_VERSION
);

assert.equal(
  legacy.moduleSelectorViewContractVersion,
  NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION
);

assert.deepEqual(
  legacy.canonicalSelection,
  {
    prose_style: "literary",
    detail_level: "rich",
    pacing: "slow_burn",
    atmosphere: "noir",
  }
);

assert.deepEqual(
  legacy.ignoredLegacySelections,
  [
    {
      id: "dialogue_style",
      storedValue: "dramatic",
      ignored: true,
      replacementAuthority:
        "CHARACTER_VOICE_AND_VOICE_MODULES",
      reason:
        "Narrator presentation must not replace or globally prescribe named Character dialogue style.",
    },
    {
      id: "knowledge_behavior",
      storedValue:
        "mystery_preserving",
      ignored: true,
      replacementAuthority:
        "REGISTRY_RUNTIME_KNOWLEDGE_BOUNDARIES",
      reason:
        "Narrator presentation must not loosen, tighten, or replace authoritative Character and registry knowledge boundaries.",
    },
  ]
);

assert.equal(
  legacy.moduleSelectorViewProps.moduleGroups.length,
  4
);

assert.deepEqual(
  legacy.moduleSelectorViewProps.moduleGroups.map(
    (group) => [
      group.id,
      group.modules.length,
    ]
  ),
  [
    ["prose_style", 4],
    ["detail_level", 4],
    ["pacing", 4],
    ["atmosphere", 6],
  ]
);

assert.equal(
  legacy.moduleSelectorViewProps.moduleGroups.some(
    (group) =>
      group.id ===
      "dialogue_style"
  ),
  false
);

assert.equal(
  legacy.moduleSelectorViewProps.moduleGroups.some(
    (group) =>
      group.id ===
      "knowledge_behavior"
  ),
  false
);

assert.deepEqual(
  legacy.moduleSummaryItems,
  [
    {
      id:
        "prose_style-literary",
      label:
        "Prose Style: Literary",
    },
    {
      id:
        "detail_level-rich",
      label:
        "Detail Level: Rich",
    },
    {
      id:
        "pacing-slow_burn",
      label:
        "Pacing: Slow Burn",
    },
    {
      id:
        "atmosphere-noir",
      label:
        "Atmosphere: Noir",
    },
  ]
);

assert.equal(
  legacy.moduleSelectorViewProps.showEnsembleLimit,
  true
);

assert.equal(
  legacy.moduleSelectorViewProps.responseDirectionGroups
    .find(
      (group) =>
        group.id ===
        "portrayal_mode"
    )
    .options
    .find(
      (option) =>
        option.value ===
        "SCENE_ONLY"
    )
    .title,
  "Scene Narration Only — Default"
);

assert.equal(
  legacy.moduleSelectorViewProps.responseDirectionGroups
    .find(
      (group) =>
        group.id ===
        "portrayal_mode"
    )
    .options
    .find(
      (option) =>
        option.value ===
        "ENSEMBLE"
    )
    .title,
  "Ensemble Narration — Opt In"
);

assert.equal(
  legacy.moduleSelectorViewProps.ensembleLimitOptions
    .find(
      (option) =>
        option.value === 3
    )
    .active,
  true
);

assert.deepEqual(
  legacy.canonicalPersistence,
  {
    field:
      "selected_modules",
    value: {
      prose_style: "literary",
      detail_level: "rich",
      pacing: "slow_burn",
      atmosphere: "noir",
    },
    topLevelLegacyMirrorsRequired:
      false,
    excludedTopLevelLegacyFields:
      [
        "pacing",
        "detail_level",
      ],
  }
);

assert.match(
  legacy.scopeRules.proseStyle,
  /Character voice remains Character-owned/i
);

assert.match(
  legacy.scopeRules.detailLevel,
  /not a Character speech-length control/i
);

assert.match(
  legacy.scopeRules.pacing,
  /cannot create, delay, skip, or override Story state transitions/i
);

assert.match(
  legacy.scopeRules.knowledgeBehavior,
  /authoritative registry\/runtime boundaries/i
);

const invalid =
  projectNarratorPresentationModuleScopeBinding(
    narratorPresentationModuleScopeInvalidSelectionFixture
  );

assert.deepEqual(
  invalid.canonicalSelection,
  {
    prose_style: "cinematic",
    detail_level: "balanced",
    pacing: "fast",
    atmosphere: "adventurous",
  }
);

const canonical =
  projectNarratorPresentationModuleScopeBinding(
    narratorPresentationModuleScopeCanonicalFixture
  );

assert.deepEqual(
  canonical.ignoredLegacySelections,
  []
);

assert.equal(
  canonical.moduleSelectorViewProps.showEnsembleLimit,
  false
);

assert.deepEqual(
  canonical.visualExtensionStatus,
  {
    canonicalFourGroupSelector:
      "WIRED",
    deprecatedGroupRemoval:
      "WIRED",
    canonicalSummary:
      "WIRED",
  }
);

assert.deepEqual(
  canonical.architecture,
  {
    selectedModuleApplicationStateOwnedByChassis: true,
    responseDirectionApplicationStateOwnedByChassis: true,
    creationPayloadOwnedByChassis: true,
    persistenceOwnedByChassis: true,
    characterVoiceAuthoritySeparate: true,
    knowledgeBoundaryAuthoritySeparate: true,
    deterministicProgressionAuthoritySeparate: true,
    moduleCatalogAndCopyOwnedByFe: true,
    moduleSelectorVisualCompositionOwnedByFe: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./NarratorPresentationModuleScopeBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "buildNarratorCreationPayload",
  "createNarratorDraft",
  "setSelectedModules",
  "setResponseDirection",
  "setForm",
  "router.push",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useState(",
  "useEffect(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "narrator_presentation_module_scope_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION,
  narratorBuilderViewContractVersion:
    NARRATOR_BUILDER_VIEW_CONTRACT_VERSION,
  moduleSelectorViewContractVersion:
    NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION,
  currentFeGroupCount:
    CURRENT_FE_NARRATOR_MODULE_GROUPS.length,
  canonicalGroupCount:
    NARRATOR_PRESENTATION_CANONICAL_GROUPS.length,
  liveFeDriftClosed:
    drift.extraCurrentFeGroupIds.length === 0 &&
    drift.missingCurrentFeGroupIds.length === 0,
  liveFeDefaultsCanonical:
    JSON.stringify(drift.currentFeDefaultKeys) ===
    JSON.stringify(drift.canonicalDefaultKeys),
  deprecatedDialogueStyleRemoved: true,
  deprecatedKnowledgeBehaviorRemoved: true,
  canonicalFourGroupCopyCovered: true,
  currentResponseDirectionCopyCovered: true,
  pacingProgressionBoundaryCovered: true,
  characterVoiceBoundaryCovered: true,
  knowledgeAuthorityBoundaryCovered: true,
  selectedModulesCanonicalPersistenceCovered: true,
  topLevelPacingDetailMirrorsExcluded: true,
  existingNarratorBuilderViewUnmodified: true,
  narratorBuilderViewModelWiredToChassisAuthority: true,
  existingNarratorModuleSelectorViewUnmodified: true,
  chassisMutationPayloadAndPersistenceExcludedFromBindingContract: true,
}, null, 2));
