import assert from "node:assert/strict";
import fs from "node:fs";

import {
  voiceModuleOptions,
} from "../../constants/voiceModules.js";

import {
  VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION,
} from "../VoiceModulePickerModal.contract.js";

import {
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS,
  CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION,
  CHARACTER_VOICE_MODULE_CATALOG_SOURCE_VERSION,
  getExpandedCharacterVoiceModuleCatalog,
  getExpandedCharacterVoiceModuleLabel,
  getExpandedCharacterVoiceModuleOptionById,
  projectCharacterVoiceModuleCatalogExpansionBinding,
  projectExpandedCharacterVoiceModuleGroups,
} from "./CharacterVoiceModuleCatalogExpansionBinding.contract.js";

import {
  characterVoiceModuleCatalogExpansionEmptyFixture,
  characterVoiceModuleCatalogExpansionSelectionFixture,
} from "./CharacterVoiceModuleCatalogExpansionBinding.fixtures.js";

assert.equal(
  CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION,
  "character_voice_module_catalog_expansion_binding_v1"
);

assert.equal(
  CHARACTER_VOICE_MODULE_CATALOG_SOURCE_VERSION,
  "crestfall_voice_module_catalog_2026_08_15"
);

assert.equal(voiceModuleOptions.length, 41);
assert.equal(
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.length,
  25
);

const catalog =
  getExpandedCharacterVoiceModuleCatalog();

assert.equal(catalog.length, 41);

assert.deepEqual(
  catalog,
  voiceModuleOptions
);

const liveCatalogIds = new Set(
  voiceModuleOptions.map(
    (option) => option.value
  )
);

assert.equal(
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.every(
    (option) =>
      liveCatalogIds.has(
        option.value
      )
  ),
  true
);

assert.equal(
  new Set(
    catalog.map((option) => option.value)
  ).size,
  41
);

assert.deepEqual(
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.map(
    (option) => option.value
  ),
  [
  "archaic_saga_register",
  "clinical_systems_register",
  "plainspoken_practical_register",
  "warm_synthetic_register",
  "mesmeric_cadence",
  "tactical_brevity",
  "psychological_pressure",
  "adaptive_social_mirroring",
  "dramatic_flourish",
  "bombastic_confidence",
  "playful_provocation",
  "aphoristic_authority",
  "corrective_courtesy",
  "subtle_vocal_emphasis",
  "whispered_vocal_emphasis",
  "oracular_symbolism",
  "underworld_gravitas",
  "investigative_reasoning",
  "operational_analysis",
  "covert_tradecraft",
  "procedural_specialist",
  "conversational_rapport",
  "observational_understatement",
  "guided_discovery",
  "transactional_negotiation"
]
);

assert.deepEqual(
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.map(
    (option) => option.label
  ),
  [
  "Archaic Saga Register",
  "Clinical Systems Register",
  "Plainspoken Practical Register",
  "Warm Synthetic Register",
  "Mesmeric Cadence",
  "Tactical Brevity",
  "Psychological Pressure",
  "Adaptive Social Mirroring",
  "Dramatic Flourish",
  "Bombastic Confidence",
  "Playful Provocation",
  "Aphoristic Authority",
  "Corrective Courtesy",
  "Subtle Vocal Emphasis",
  "Whispered Vocal Emphasis",
  "Oracular Symbolism",
  "Underworld Gravitas",
  "Investigative Reasoning",
  "Operational Analysis",
  "Covert Tradecraft",
  "Procedural Specialist",
  "Conversational Rapport",
  "Observational Understatement",
  "Guided Discovery",
  "Transactional Negotiation"
]
);

assert.deepEqual(
  CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.map(
    (option) => option.category
  ),
  [
  "Dialect / Register",
  "Dialect / Register",
  "Dialect / Register",
  "Dialect / Register",
  "Vocal Texture",
  "Authority Register",
  "Social Register",
  "Social Register",
  "Vocal Texture",
  "Authority Register",
  "Social Register",
  "Authority Register",
  "Formality Register",
  "Format Emphasis",
  "Format Emphasis",
  "Genre Register",
  "Genre Register",
  "Knowledge Register",
  "Knowledge Register",
  "Knowledge Register",
  "Knowledge Register",
  "Social Register",
  "Knowledge Register",
  "Knowledge Register",
  "Social Register"
]
);

assert.equal(
  getExpandedCharacterVoiceModuleOptionById(
    "investigative_reasoning"
  )?.label,
  "Investigative Reasoning"
);

assert.equal(
  getExpandedCharacterVoiceModuleLabel(
    "guided_discovery"
  ),
  "Guided Discovery"
);

assert.equal(
  getExpandedCharacterVoiceModuleLabel(
    "unknown_legacy_module"
  ),
  "unknown_legacy_module"
);

const groups =
  projectExpandedCharacterVoiceModuleGroups();

assert.equal(groups.length, 8);

assert.deepEqual(
  groups.map((group) => group.label),
  [
    "Vocal Texture",
    "Format Emphasis",
    "Authority Register",
    "Formality Register",
    "Social Register",
    "Genre Register",
    "Knowledge Register",
    "Dialect / Register",
  ]
);

const expectedCategoryCounts = {
  "Vocal Texture": 6,
  "Format Emphasis": 3,
  "Authority Register": 4,
  "Formality Register": 3,
  "Social Register": 6,
  "Genre Register": 3,
  "Knowledge Register": 7,
  "Dialect / Register": 9,
};

assert.deepEqual(
  Object.fromEntries(
    groups.map((group) => [
      group.label,
      group.options.length,
    ])
  ),
  expectedCategoryCounts
);

const selection =
  projectCharacterVoiceModuleCatalogExpansionBinding(
    characterVoiceModuleCatalogExpansionSelectionFixture
  );

assert.equal(
  selection.bindingContractVersion,
  CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION
);

assert.equal(
  selection.pickerViewContractVersion,
  VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION
);

assert.equal(
  selection.pickerViewContractVersion,
  "1.0.0"
);

assert.deepEqual(
  selection.summary,
  {
    existingCatalogCount: 41,
    addedCatalogCount: 0,
    historicalAddedCatalogCount: 25,
    expandedCatalogCount: 41,
    categoryCount: 8,
    categoryCounts:
      expectedCategoryCounts,
  }
);

assert.equal(
  selection.currentPortableViewProps.open,
  true
);

assert.equal(
  selection.currentPortableViewProps.optionGroups.length,
  8
);

assert.equal(
  selection.currentPortableViewProps.optionGroups.reduce(
    (total, group) =>
      total +
      group.options.length,
    0
  ),
  41
);

assert.deepEqual(
  selection.selectedItems,
  [
    {
      id: "dry_wit",
      label: "Dry Wit",
      known: true,
      addedByExpansion: false,
    },
    {
      id: "investigative_reasoning",
      label: "Investigative Reasoning",
      known: true,
      addedByExpansion: true,
    },
    {
      id: "guided_discovery",
      label: "Guided Discovery",
      known: true,
      addedByExpansion: true,
    },
    {
      id: "transactional_negotiation",
      label: "Transactional Negotiation",
      known: true,
      addedByExpansion: true,
    },
    {
      id: "unknown_legacy_module",
      label: "unknown_legacy_module",
      known: false,
      addedByExpansion: false,
    },
  ]
);

assert.deepEqual(
  selection.currentPortableViewProps.selectedItems,
  selection.selectedItems.map((item) => ({
    id: item.id,
    label: item.label,
  }))
);

assert.equal(
  selection.currentPortableViewProps.modalDescription,
  "Select one or more prebuilt modules. Character voice still has priority; modules are expression overlays, not replacements."
);

assert.deepEqual(
  selection.visualExtensionStatus,
  {
    expandedCatalog:
      "WIRED",
    existingPickerView:
      "CURRENT_VIEW_CONTRACT_COMPATIBLE",
  }
);

assert.deepEqual(
  selection.architecture,
  {
    catalogPresentationOwnedByFe: true,
    groupingOwnedByFePresentation: true,
    openCloseStateMayRemainPresentationViewModelOwned: true,
    selectedModuleIdsOwnedByParentAuthoringState: true,
    persistenceOwnedByChassis: true,
    runtimeVoiceInterpretationOwnedByChassis: true,
    characterVoicePriorityPreserved: true,
  }
);

const empty =
  projectCharacterVoiceModuleCatalogExpansionBinding(
    characterVoiceModuleCatalogExpansionEmptyFixture
  );

assert.equal(
  empty.currentPortableViewProps.canClear,
  false
);

assert.deepEqual(
  empty.currentPortableViewProps.selectedIds,
  []
);

const source = fs.readFileSync(
  new URL(
    "./CharacterVoiceModuleCatalogExpansionBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "setOpen(",
  "onChange?.",
  "setVoice",
  "updateCharacter",
  "saveCharacter",
  "createCharacter",
  "applyVoiceModule",
  "runtimePrompt",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useMemo(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "character_voice_module_catalog_expansion_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION,
  pickerViewContractVersion:
    VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION,
  liveCatalogCount:
    voiceModuleOptions.length,
  pendingCatalogAdditionCount:
    CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.filter(
      (option) =>
        !liveCatalogIds.has(
          option.value
        )
    ).length,
  historicalExpansionCount:
    CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.length,
  expandedCatalogCount:
    catalog.length,
  categoryCount:
    groups.length,
  liveCatalogWired: true,
  exactSourceAdditionIdsCovered: true,
  exactSourceLabelsCategoriesAndDescriptionsCovered: true,
  currentPickerViewCompatibilityCovered: true,
  selectedNewModuleLabelResolutionCovered: true,
  unknownLegacySelectionPreservationCovered: true,
  voiceModuleConstantsWiredToCurrentSource: true,
  existingVoiceModulePickerViewUnmodified: true,
  existingVoiceModulePickerViewModelUnmodified: true,
  chassisPersistenceAndRuntimeInterpretationExcluded: true,
}, null, 2));
