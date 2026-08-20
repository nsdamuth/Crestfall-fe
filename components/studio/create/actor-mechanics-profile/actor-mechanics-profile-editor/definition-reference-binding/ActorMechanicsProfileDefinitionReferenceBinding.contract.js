import {
  ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
} from "../ActorMechanicsProfileEditor.contract.js";

import {
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
} from "../../../ability-spell/ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";

import {
  SKILLS_PROFILE_CONTRACT_VERSION,
} from "../../../skills/skills-profile-editor/SkillsProfileEditor.contract.js";

import {
  WALLET_PROFILE_CONTRACT_VERSION,
} from "../../../wallet/wallet-profile-editor/WalletProfileEditor.contract.js";

export const ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION =
  "actor_mechanics_profile_definition_reference_binding_v1";

export const ACTOR_MECHANICS_PROFILE_MANAGED_REFERENCE_MODES = Object.freeze([
  "STATS_POOLS_PROFILE",
  "PROGRESSION_PROFILE",
  "SKILLS_PROFILE",
  "ABILITY_SPELL_PROFILE",
  "WALLET_PROFILE",
]);

export const ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_CALLBACK_KEYS =
  Object.freeze([
    "onOpenStatsPoolsProfilePicker",
    "onOpenProgressionProfilePicker",
    "onOpenSkillsProfilePicker",
    "onOpenAbilitySpellProfilePicker",
    "onOpenWalletProfilePicker",
  ]);

const REFERENCE_MODE_CONFIG = Object.freeze({
  STATS_POOLS_PROFILE: Object.freeze({
    domains: ["STATS"],
    label: "Stats & Pools Profile",
    fallbackTitle: "Selected Stats & Pools Profile",
    fallbackVersion:
      ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
    creationType:
      ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE,
    selectLabel:
      "Select Stats & Pools Profile",
    replaceLabel:
      "Replace Stats & Pools Profile",
    description:
      "Choose one owned Stats & Pools Profile. Only its reusable definition reference is saved; actor values are not copied or initialized.",
    emptyState:
      "No Stats & Pools Profile selected. Choose an owned profile to provide the reusable stat and pool definitions for this binding.",
    currentFeVisualStatus:
      "CURRENT_FE_CONTROL_AVAILABLE",
    callbackKey:
      "onOpenStatsPoolsProfilePicker",
  }),

  PROGRESSION_PROFILE: Object.freeze({
    domains: ["PROGRESSION"],
    label: "Progression Profile",
    fallbackTitle: "Selected Progression Profile",
    fallbackVersion:
      ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
    creationType:
      ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
    selectLabel:
      "Select Progression Profile",
    replaceLabel:
      "Replace Progression Profile",
    description:
      "Choose one owned Progression Profile. Only its reusable curve and tier definition reference is saved; actor experience and level state are not copied or initialized.",
    emptyState:
      "No Progression Profile selected. Choose an owned profile to provide reusable curve and tier definitions for this binding.",
    currentFeVisualStatus:
      "CURRENT_FE_CONTROL_AVAILABLE",
    callbackKey:
      "onOpenProgressionProfilePicker",
  }),

  SKILLS_PROFILE: Object.freeze({
    domains: ["SKILLS"],
    label: "Skills Profile",
    fallbackTitle: "Selected Skills Profile",
    fallbackVersion:
      SKILLS_PROFILE_CONTRACT_VERSION,
    creationType: "SKILLS_PROFILE",
    selectLabel:
      "Select Skills Profile",
    replaceLabel:
      "Replace Skills Profile",
    description:
      "Choose one owned Skills Profile. Only reusable proficiency and rank definitions are saved; actor ranks and unspent points are not copied or initialized.",
    emptyState:
      "No Skills Profile selected. Choose an owned profile to provide reusable skill and rank definitions for this binding.",
    currentFeVisualStatus:
      "WIRED_LEGACY_PRESENTATION",
    callbackKey:
      "onOpenSkillsProfilePicker",
  }),

  ABILITY_SPELL_PROFILE: Object.freeze({
    domains: ["MAGIC", "ABILITIES"],
    label: "Ability & Spell Profile",
    fallbackTitle:
      "Selected Ability & Spell Profile",
    fallbackVersion:
      ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
    creationType:
      "ABILITY_SPELL_PROFILE",
    selectLabel:
      "Select Ability & Spell Profile",
    replaceLabel:
      "Replace Ability & Spell Profile",
    currentFeVisualStatus:
      "WIRED_LEGACY_PRESENTATION",
    callbackKey:
      "onOpenAbilitySpellProfilePicker",
  }),

  WALLET_PROFILE: Object.freeze({
    domains: ["WALLET"],
    label: "Wallet Profile",
    fallbackTitle:
      "Selected Wallet Profile",
    fallbackVersion:
      WALLET_PROFILE_CONTRACT_VERSION,
    creationType:
      "WALLET_PROFILE",
    selectLabel:
      "Select Wallet Profile",
    replaceLabel:
      "Replace Wallet Profile",
    description:
      "Choose one owned Wallet Profile for reusable gameplay currency definitions. Live balances, revisions, and transaction history remain owner-scoped and are not initialized by attachment.",
    emptyState:
      "No Wallet Profile selected. Choose an owned profile to provide reusable gameplay currency definitions for this binding.",
    currentFeVisualStatus:
      "WIRED_LEGACY_PRESENTATION",
    callbackKey:
      "onOpenWalletProfilePicker",
  }),
});

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function abilitySpellDescription(domain) {
  return domain === "MAGIC"
    ? "Choose one owned Ability & Spell Profile for reusable spell and magic definitions. Actor-known state, mastery, cooldowns, charges, and resource state remain owner-scoped and are not initialized by attachment."
    : "Choose one owned Ability & Spell Profile for reusable abilities, techniques, special attacks, passives, and spells. Actor-known state, mastery, cooldowns, charges, and resource state remain owner-scoped and are not initialized by attachment.";
}

function abilitySpellEmptyState(domain) {
  return domain === "MAGIC"
    ? "No Ability & Spell Profile selected. Choose an owned profile to provide reusable spell and magic definitions for this binding."
    : "No Ability & Spell Profile selected. Choose an owned profile to provide reusable ability and spell definitions for this binding.";
}

function managedConfigForBinding(binding = {}) {
  const source = object(binding);
  const mode = upper(
    source.definitionReferenceMode
  );
  const domain = upper(source.domain);

  const config =
    REFERENCE_MODE_CONFIG[mode];

  if (!config) return null;

  if (!config.domains.includes(domain)) {
    return null;
  }

  if (mode === "ABILITY_SPELL_PROFILE") {
    return {
      ...config,
      description:
        abilitySpellDescription(domain),
      emptyState:
        abilitySpellEmptyState(domain),
    };
  }

  return config;
}

function projectCreationReference(reference = {}, index = 0) {
  const source = object(reference);

  return {
    index:
      Number.isFinite(Number(source.index))
        ? Number(source.index)
        : index,
    referenceType:
      upper(source.referenceType) ||
      "CREATION",
    sourceId:
      text(source.sourceId),
    version:
      text(source.version),
    title:
      text(source.title),
    issues:
      array(source.issues).map((issue) => ({
        code:
          text(issue?.code),
        message:
          text(issue?.message),
        severity:
          upper(issue?.severity) ||
          "ERROR",
      })),
  };
}

export function projectActorMechanicsProfileDefinitionReferenceBindingItem({
  binding = {},
  callbacks = {},
} = {}) {
  const source = object(binding);
  const callbackSource = object(callbacks);

  const config =
    managedConfigForBinding(source);

  const references =
    array(source.references)
      .map(projectCreationReference);

  const creationReferences =
    references.filter(
      (reference) =>
        reference.referenceType === "CREATION"
    );

  if (!config) {
    return {
      bindingId:
        text(source.id),
      domain:
        upper(source.domain),
      definitionReferenceMode:
        upper(source.definitionReferenceMode) ||
        "GENERIC",
      managed: false,
      visualStatus:
        "CURRENT_GENERIC_REFERENCE_EDITOR",
      references,
      creationReferences,
      selectedCreationIds:
        creationReferences
          .map((reference) => reference.sourceId)
          .filter(Boolean),
      emptyState:
        "No reusable definition is attached. This is acceptable for an unbound template; bound enabled domains should normally identify a definition source.",
      picker: null,
      onOpenManagedProfilePicker: null,
    };
  }

  const hasReference =
    creationReferences.length > 0;

  const primaryReference =
    creationReferences[0] || null;

  return {
    bindingId:
      text(source.id),
    domain:
      upper(source.domain),
    domainLabel:
      text(source.domainLabel),
    definitionReferenceMode:
      upper(source.definitionReferenceMode),

    managed: true,

    visualStatus:
      config.currentFeVisualStatus,

    label:
      config.label,
    creationType:
      config.creationType,
    fallbackTitle:
      config.fallbackTitle,
    fallbackVersion:
      config.fallbackVersion,

    description:
      config.description,

    selectLabel:
      config.selectLabel,
    replaceLabel:
      config.replaceLabel,

    actionLabel:
      hasReference
        ? config.replaceLabel
        : config.selectLabel,

    hasReference,
    primaryReference,
    references,
    creationReferences,

    selectedCreationIds:
      creationReferences
        .map((reference) => reference.sourceId)
        .filter(Boolean),

    displayReference: {
      title:
        text(primaryReference?.title) ||
        config.fallbackTitle,
      version:
        text(primaryReference?.version) ||
        config.fallbackVersion,
      sourceId:
        text(primaryReference?.sourceId),
    },

    emptyState:
      config.emptyState,

    pickerExpected: {
      title:
        config.selectLabel,
      allowedTypes:
        [config.creationType],
      selectedCreationIds:
        creationReferences
          .map((reference) => reference.sourceId)
          .filter(Boolean),
    },

    callbackKey:
      config.callbackKey,

    onOpenManagedProfilePicker:
      callbackSource[
        config.callbackKey
      ] || null,
  };
}

export function projectActorMechanicsProfileDefinitionReferenceBinding({
  bindings = [],
  pickerProps = null,
  callbacks = {},
} = {}) {
  const items =
    array(bindings).map((binding) =>
      projectActorMechanicsProfileDefinitionReferenceBindingItem({
        binding,
        callbacks,
      })
    );

  const managedItems =
    items.filter((item) => item.managed);

  const unresolvedVisualItems =
    managedItems.filter(
      (item) =>
        ![
          "CURRENT_FE_CONTROL_AVAILABLE",
          "WIRED_LEGACY_PRESENTATION",
        ].includes(item.visualStatus)
    );

  const picker = pickerProps
    ? {
        title:
          text(pickerProps.title),
        body:
          text(pickerProps.body),
        allowedTypes:
          array(pickerProps.allowedTypes)
            .map(upper)
            .filter(Boolean),
        selectedCreationIds:
          array(
            pickerProps.selectedCreationIds
          )
            .map(text)
            .filter(Boolean),
        onClose:
          pickerProps.onClose || null,
        onSelect:
          pickerProps.onSelect || null,
        authority:
          "CHASSIS_APPLICATION_VIEWMODEL",
      }
    : null;

  return {
    bindingContractVersion:
      ACTOR_MECHANICS_PROFILE_DEFINITION_REFERENCE_BINDING_CONTRACT_VERSION,

    actorMechanicsProfileEditorViewContractVersion:
      ACTOR_MECHANICS_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,

    managedReferenceModes:
      [...ACTOR_MECHANICS_PROFILE_MANAGED_REFERENCE_MODES],

    bindings: items,

    summary: {
      bindingCount:
        items.length,
      managedBindingCount:
        managedItems.length,
      pendingFeVisualExtensionCount:
        unresolvedVisualItems.length,
      selectedManagedCreationReferenceCount:
        managedItems.reduce(
          (total, item) =>
            total +
            item.creationReferences.length,
          0
        ),
    },

    picker,

    visualExtensionStatus: {
      skillsProfileControl:
        managedItems.some(
          (item) =>
            item.definitionReferenceMode ===
            "SKILLS_PROFILE"
        )
          ? "WIRED_LEGACY_PRESENTATION"
          : "NOT_REQUIRED_BY_CURRENT_BINDINGS",

      abilitySpellProfileControl:
        managedItems.some(
          (item) =>
            item.definitionReferenceMode ===
            "ABILITY_SPELL_PROFILE"
        )
          ? "WIRED_LEGACY_PRESENTATION"
          : "NOT_REQUIRED_BY_CURRENT_BINDINGS",

      walletProfileControl:
        managedItems.some(
          (item) =>
            item.definitionReferenceMode ===
            "WALLET_PROFILE"
        )
          ? "WIRED_LEGACY_PRESENTATION"
          : "NOT_REQUIRED_BY_CURRENT_BINDINGS",
    },

    architecture: {
      definitionReferenceModeOwnedByChassis: true,
      referenceSelectionStateOwnedByChassis: true,
      pickerOpenStateOwnedByChassis: true,
      candidateCreationLoadingOwnedByChassis: true,
      profileReferenceMutationOwnedByChassis: true,
      runtimeActorStateExcludedFromAttachment: true,
      managedProfileControlPresentationOwnedByFe: true,
    },
  };
}
