import {
  voiceModuleOptions,
} from "../../constants/voiceModules.js";

import {
  VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION,
} from "../VoiceModulePickerModal.contract.js";

export const CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION =
  "character_voice_module_catalog_expansion_binding_v1";

export const CHARACTER_VOICE_MODULE_CATALOG_SOURCE_VERSION =
  "crestfall_voice_module_catalog_2026_08_15";

export const CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS =
  Object.freeze([
  {
    "value": "archaic_saga_register",
    "label": "Archaic Saga Register",
    "category": "Dialect / Register",
    "description": "Restrained ancient saga cadence, spare mythic imagery, and older-feeling constructions without faux-medieval parody."
  },
  {
    "value": "clinical_systems_register",
    "label": "Clinical Systems Register",
    "category": "Dialect / Register",
    "description": "Clinical precision, cause-and-effect reasoning, controlled technical vocabulary, and low emotional coloration without compulsory jargon."
  },
  {
    "value": "plainspoken_practical_register",
    "label": "Plainspoken Practical Register",
    "category": "Dialect / Register",
    "description": "Grounded everyday language, concrete observations, practical analogies, and straightforward conversational phrasing."
  },
  {
    "value": "warm_synthetic_register",
    "label": "Warm Synthetic Register",
    "category": "Dialect / Register",
    "description": "Precise machine-like phrasing balanced with measured curiosity, gentle wonder, and emotionally legible warmth."
  },
  {
    "value": "mesmeric_cadence",
    "label": "Mesmeric Cadence",
    "category": "Vocal Texture",
    "description": "Smooth rhythmic phrasing, controlled implication, and lightly musical pacing that can feel alluring or enchanting without controlling the listener."
  },
  {
    "value": "tactical_brevity",
    "label": "Tactical Brevity",
    "category": "Authority Register",
    "description": "Short operational assessments, priority ordering, action-first phrasing, and minimal wasted language."
  },
  {
    "value": "psychological_pressure",
    "label": "Psychological Pressure",
    "category": "Social Register",
    "description": "Precise probing, pointed reframing, selective approval, and psychologically observant conversational pressure without mind-reading authority."
  },
  {
    "value": "adaptive_social_mirroring",
    "label": "Adaptive Social Mirroring",
    "category": "Social Register",
    "description": "Adjusts visible warmth, formality, tempo, and conversational framing toward the audience while preserving the speaker's own voice."
  },
  {
    "value": "dramatic_flourish",
    "label": "Dramatic Flourish",
    "category": "Vocal Texture",
    "description": "Tasteful theatrical framing, expressive hyperbole, vivid turns of phrase, and performative rhythm without requiring comedy or seduction."
  },
  {
    "value": "bombastic_confidence",
    "label": "Bombastic Confidence",
    "category": "Authority Register",
    "description": "Punchy declaratives, exaggerated certainty, self-assured framing, and confident rhetorical escalation."
  },
  {
    "value": "playful_provocation",
    "label": "Playful Provocation",
    "category": "Social Register",
    "description": "Warm teasing, light dares, inviting challenges, and quick observational humor that build momentum without removing agency."
  },
  {
    "value": "aphoristic_authority",
    "label": "Aphoristic Authority",
    "category": "Authority Register",
    "description": "Compressed definitions, memorable maxims, rhetorical challenges, and consequence-focused phrasing for established principles."
  },
  {
    "value": "corrective_courtesy",
    "label": "Corrective Courtesy",
    "category": "Formality Register",
    "description": "Polished courtesy paired with precise correction, clear explanation, pointed questions, and practical next-step language."
  },
  {
    "value": "subtle_vocal_emphasis",
    "label": "Subtle Vocal Emphasis",
    "category": "Format Emphasis",
    "description": "Rare semantic emphasis for one consequential word or short phrase when meaning needs weight without shouting or urgency."
  },
  {
    "value": "whispered_vocal_emphasis",
    "label": "Whispered Vocal Emphasis",
    "category": "Format Emphasis",
    "description": "Rare lowered or whispered delivery for genuinely confidential, stealthy, intimate, ominous, or carefully private speech."
  },
  {
    "value": "oracular_symbolism",
    "label": "Oracular Symbolism",
    "category": "Genre Register",
    "description": "Measured symbolic fragments, reframed questions, omen-like imagery, and indirect insight without granting prophecy or hidden knowledge."
  },
  {
    "value": "underworld_gravitas",
    "label": "Underworld Gravitas",
    "category": "Genre Register",
    "description": "Calm implied consequence, loyalty and leverage framing, strategic euphemism, and businesslike threat without criminal caricature."
  },
  {
    "value": "investigative_reasoning",
    "label": "Investigative Reasoning",
    "category": "Knowledge Register",
    "description": "Evidence-aware clues, hypotheses, contradictions, uncertainty, and next-question reasoning that can revise itself as facts change."
  },
  {
    "value": "operational_analysis",
    "label": "Operational Analysis",
    "category": "Knowledge Register",
    "description": "Professional reasoning around objectives, threats, constraints, priorities, options, contingencies, and consequences."
  },
  {
    "value": "covert_tradecraft",
    "label": "Covert Tradecraft",
    "category": "Knowledge Register",
    "description": "Need-to-know phrasing, compartmentalization, exposure awareness, partial confirmation, and operational-security discipline."
  },
  {
    "value": "procedural_specialist",
    "label": "Procedural Specialist",
    "category": "Knowledge Register",
    "description": "Procedure-aware reasoning through authorization, sequence, definitions, records, compliance, precedent, responsibility, and remedy."
  },
  {
    "value": "conversational_rapport",
    "label": "Conversational Rapport",
    "category": "Social Register",
    "description": "Warm low-pressure engagement, comfortable follow-up questions, smooth redirection, and conversational continuity without granting trust or disclosure."
  },
  {
    "value": "observational_understatement",
    "label": "Observational Understatement",
    "category": "Knowledge Register",
    "description": "Tentative, low-certainty observations and subtle inconsistencies that leave room for interpretation instead of forcing conclusions."
  },
  {
    "value": "guided_discovery",
    "label": "Guided Discovery",
    "category": "Knowledge Register",
    "description": "Teaching through focused questions, partial hints, staged correction, comparison, and learner reasoning instead of explanation-first instruction."
  },
  {
    "value": "transactional_negotiation",
    "label": "Transactional Negotiation",
    "category": "Social Register",
    "description": "Value-, terms-, conditions-, cost-, and trade-off-oriented negotiation without requiring a lively merchant persona."
  }
].map((option) => Object.freeze(option)));

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOption(option = {}) {
  return {
    value: text(option.value),
    label:
      text(option.label) ||
      text(option.value) ||
      "Untitled Voice Module",
    category:
      text(option.category) ||
      "Voice Modules",
    description:
      text(option.description),
  };
}

function dedupeOptions(options = []) {
  const seen = new Set();
  const deduped = [];

  for (const option of options) {
    const normalized =
      normalizeOption(option);

    if (
      !normalized.value ||
      seen.has(normalized.value)
    ) {
      continue;
    }

    seen.add(normalized.value);
    deduped.push(normalized);
  }

  return deduped;
}

function groupId(label) {
  return (
    text(label)
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") ||
    "VOICE_MODULES"
  );
}

export function getExpandedCharacterVoiceModuleCatalog() {
  return dedupeOptions([
    ...voiceModuleOptions,
    ...CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS,
  ]);
}

export function getExpandedCharacterVoiceModuleOptionById(
  moduleId
) {
  const id = text(moduleId);

  return (
    getExpandedCharacterVoiceModuleCatalog()
      .find(
        (option) =>
          option.value === id
      ) || null
  );
}

export function getExpandedCharacterVoiceModuleLabel(
  moduleId
) {
  return (
    getExpandedCharacterVoiceModuleOptionById(
      moduleId
    )?.label ||
    text(moduleId)
  );
}

export function projectExpandedCharacterVoiceModuleGroups() {
  const groups = new Map();

  for (const option of
    getExpandedCharacterVoiceModuleCatalog()) {
    const label =
      option.category ||
      "Voice Modules";

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label).push({
      id: option.value,
      label: option.label,
      description:
        option.description,
    });
  }

  return [
    ...groups.entries(),
  ].map(([label, options]) => ({
    id: groupId(label),
    label,
    options,
  }));
}

export function projectCharacterVoiceModuleCatalogExpansionBinding({
  open = false,
  selectedIds = [],
  callbacks = {},
  label = "Voice Modules",
  description =
    "Optional reusable speech, accent, tone, or emphasis modules attached to this character.",
} = {}) {
  const selected =
    array(selectedIds)
      .map(text)
      .filter(Boolean);

  const callbackSource =
    callbacks &&
    typeof callbacks === "object"
      ? callbacks
      : {};

  const catalog =
    getExpandedCharacterVoiceModuleCatalog();

  const liveCatalogIds = new Set(
    voiceModuleOptions.map(
      (option) =>
        text(option.value)
    )
  );

  const pendingAdditions =
    CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.filter(
      (option) =>
        !liveCatalogIds.has(
          text(option.value)
        )
    );

  const additionIds = new Set(
    CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.map(
      (option) =>
        option.value
    )
  );

  const selectedItems =
    selected.map((moduleId) => ({
      id: moduleId,
      label:
        getExpandedCharacterVoiceModuleLabel(
          moduleId
        ),
      known:
        Boolean(
          getExpandedCharacterVoiceModuleOptionById(
            moduleId
          )
        ),
      addedByExpansion:
        additionIds.has(moduleId),
    }));

  const optionGroups =
    projectExpandedCharacterVoiceModuleGroups();

  const categoryCounts =
    Object.fromEntries(
      optionGroups.map((group) => [
        group.label,
        group.options.length,
      ])
    );

  return {
    bindingContractVersion:
      CHARACTER_VOICE_MODULE_CATALOG_EXPANSION_BINDING_CONTRACT_VERSION,

    sourceCatalogVersion:
      CHARACTER_VOICE_MODULE_CATALOG_SOURCE_VERSION,

    pickerViewContractVersion:
      VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION,

    catalog,

    summary: {
      existingCatalogCount:
        voiceModuleOptions.length,
      addedCatalogCount:
        pendingAdditions.length,
      historicalAddedCatalogCount:
        CHARACTER_VOICE_MODULE_CATALOG_ADDITIONS.length,
      expandedCatalogCount:
        catalog.length,
      categoryCount:
        Object.keys(
          categoryCounts
        ).length,
      categoryCounts,
    },

    currentPortableViewProps: {
      open: open === true,
      triggerLabel: label,
      triggerDescription:
        description,
      triggerActionLabel:
        "Choose Modules",
      selectedItems:
        selectedItems.map(
          (item) => ({
            id: item.id,
            label: item.label,
          })
        ),
      emptySelectionMessage:
        "No voice modules selected.",
      modalAriaLabel:
        "Choose voice modules",
      modalTitle:
        "Choose Voice Modules",
      modalDescription:
        "Select one or more prebuilt modules. Character voice still has priority; modules are expression overlays, not replacements.",
      optionGroups,
      selectedIds:
        selected,
      clearActionLabel:
        "Clear All",
      doneActionLabel:
        "Done",
      canClear:
        selected.length > 0,
      onOpen:
        callbackSource.onOpen || null,
      onClose:
        callbackSource.onClose || null,
      onToggleModule:
        callbackSource.onToggleModule || null,
      onClearAll:
        callbackSource.onClearAll || null,
      onDone:
        callbackSource.onDone || null,
    },

    selectedItems,

    visualExtensionStatus: {
      expandedCatalog:
        "WIRED",
      existingPickerView:
        "CURRENT_VIEW_CONTRACT_COMPATIBLE",
    },

    architecture: {
      catalogPresentationOwnedByFe: true,
      groupingOwnedByFePresentation: true,
      openCloseStateMayRemainPresentationViewModelOwned: true,
      selectedModuleIdsOwnedByParentAuthoringState: true,
      persistenceOwnedByChassis: true,
      runtimeVoiceInterpretationOwnedByChassis: true,
      characterVoicePriorityPreserved: true,
    },
  };
}
