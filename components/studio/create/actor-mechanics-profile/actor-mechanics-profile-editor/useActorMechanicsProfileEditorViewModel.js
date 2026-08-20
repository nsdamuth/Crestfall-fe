"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_WALLET_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES,
  ACTOR_MECHANICS_PROFILE_ACTIVATION_MODE_OPTIONS,
  ACTOR_MECHANICS_PROFILE_BINDING_MODES,
  ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
  ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
  ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_DOMAINS,
  ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS,
  ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS,
  ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
  ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
  ACTOR_MECHANICS_PROFILE_PRESETS,
  ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_SKILLS_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE,
  ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES,
  ACTOR_MECHANICS_PROFILE_REFERENCE_TYPE_OPTIONS,
  ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
  ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
  ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION,
  ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE,
  EMPTY_ACTOR_MECHANICS_PROFILE_STATE_POLICY,
} from "./ActorMechanicsProfileEditor.contract.js";

const LEGACY_ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION =
  "character_mechanics_loadout_contract_v0";
const LEGACY_ACTOR_MECHANICS_PROFILE_BINDING_VERSION =
  "character_mechanics_loadout_binding_v0";

function normalizeActorMechanicsProfileContractVersion(value) {
  const normalized = normalizeString(value);
  return normalized === LEGACY_ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION
    ? ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION
    : normalized || ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION;
}

function normalizeActorMechanicsProfileBindingVersion(value) {
  const normalized = normalizeString(value);
  return normalized === LEGACY_ACTOR_MECHANICS_PROFILE_BINDING_VERSION
    ? ACTOR_MECHANICS_PROFILE_BINDING_VERSION
    : normalized || ACTOR_MECHANICS_PROFILE_BINDING_VERSION;
}

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;
const ACTIVATION_DOMAIN_PATTERN = /^[A-Z0-9][A-Z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function uniqueStrings(values, { uppercase = false, lowercase = false } = {}) {
  const seen = new Set();
  const normalized = [];

  for (const value of normalizeArray(values)) {
    const text = normalizeString(value);
    const candidate = uppercase
      ? text.toUpperCase()
      : lowercase
        ? text.toLowerCase()
        : text;

    if (!candidate || seen.has(candidate)) continue;

    seen.add(candidate);
    normalized.push(candidate);

    if (
      normalized.length >=
      ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxActivationDomainsPerBinding
    ) {
      break;
    }
  }

  return normalized;
}

function splitActivationDomains(value) {
  return uniqueStrings(String(value || "").split(","), { uppercase: true });
}

function getPresetDefinition(presetId) {
  return (
    ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS.find(
      (preset) => preset.presetId === presetId
    ) || ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS.at(-1)
  );
}

function getDomainDefinition(domain) {
  return (
    ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS.find(
      (option) => option.value === domain
    ) || {
      value: domain,
      label: domain.replaceAll("_", " "),
      description: "Actor-scoped mechanics domain.",
    }
  );
}

function normalizeOwner(value = {}, presetOwnerType = "CHARACTER", ownerContext) {
  const source = normalizeObject(value);
  const context = normalizeObject(ownerContext);
  const locked = context.locked === true;

  const owner = {
    bindingMode: normalizeEnum(
      locked
        ? context.bindingMode ||
            (normalizeString(context.ownerId) ? "BOUND_ACTOR" : source.bindingMode)
        : source.bindingMode,
      ACTOR_MECHANICS_PROFILE_BINDING_MODES,
      "UNBOUND_TEMPLATE"
    ),
    ownerType: normalizeEnum(
      locked ? context.ownerType || source.ownerType : source.ownerType,
      ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
      presetOwnerType
    ),
    ownerId:
      normalizeString(
        locked ? context.ownerId || source.ownerId : source.ownerId
      ) || null,
    ownerTitle: normalizeString(
      locked ? context.ownerTitle || source.ownerTitle : source.ownerTitle
    ),
  };

  return owner;
}

function normalizeCapabilityPolicy(value = {}, presetPolicy = {}) {
  const source = normalizeObject(value);
  const fallback = normalizeObject(presetPolicy);
  const mode = normalizeEnum(
    source.mode || fallback.mode,
    ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
    "STANDARD"
  );
  const defaultPolicy =
    mode === "BEYOND_SCALE" ? "WORKING_MODE_ONLY" : "DETERMINISTIC";

  return {
    mode,
    opposedResolutionPolicy: normalizeEnum(
      source.opposedResolutionPolicy || fallback.opposedResolutionPolicy,
      ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
      defaultPolicy
    ),
    workingModeProfile: normalizeString(
      source.workingModeProfile || fallback.workingModeProfile
    ),
    notes: normalizeString(source.notes || fallback.notes),
  };
}

function normalizeReference(value = {}) {
  const source = normalizeObject(value);

  return {
    referenceType: normalizeEnum(
      source.referenceType,
      ACTOR_MECHANICS_PROFILE_REFERENCE_TYPES,
      "CREATION"
    ),
    sourceId: normalizeString(source.sourceId),
    version: normalizeString(source.version),
    title: normalizeString(source.title),
    metadata: normalizeObject(source.metadata),
  };
}

function normalizeBinding(value = {}, index = 0) {
  const source = normalizeObject(value);
  const domain = normalizeEnum(
    source.domain,
    ACTOR_MECHANICS_PROFILE_DOMAINS,
    "STATS"
  );

  return {
    bindingVersion:
      normalizeActorMechanicsProfileBindingVersion(source.bindingVersion),
    id:
      normalizeString(source.id).toLowerCase() ||
      `${domain.toLowerCase()}.${index + 1}`,
    domain,
    title: normalizeString(source.title),
    enabled: source.enabled !== false,
    required: source.required === true,
    stateIsolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
    activation: {
      mode: normalizeEnum(
        normalizeObject(source.activation).mode,
        ACTOR_MECHANICS_PROFILE_ACTIVATION_MODES,
        "ON_DEMAND"
      ),
      domains: uniqueStrings(normalizeObject(source.activation).domains, {
        uppercase: true,
      }),
    },
    references: normalizeArray(source.references)
      .slice(
        0,
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxReferencesPerBinding
      )
      .map(normalizeReference),
    notes: normalizeString(source.notes),
    order: normalizeInteger(source.order, index, 0, 100000),
    metadata: normalizeObject(source.metadata),
  };
}

function createPresetBinding(binding, index) {
  const domainDefinition = getDomainDefinition(binding.domain);

  return normalizeBinding(
    {
      bindingVersion: ACTOR_MECHANICS_PROFILE_BINDING_VERSION,
      id: binding.domain.toLowerCase(),
      domain: binding.domain,
      title: domainDefinition.label,
      enabled: binding.enabled,
      required: binding.required,
      stateIsolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
      activation: {
        mode: "ON_DEMAND",
        domains: [binding.domain],
      },
      references: [],
      order: index,
    },
    index
  );
}

function createProfileFromPreset(presetId, current = {}, ownerContext = null) {
  const preset = getPresetDefinition(presetId);
  const currentOwner = normalizeObject(current.owner);
  const context = normalizeObject(ownerContext);
  const ownerType = normalizeEnum(
    context.ownerType || preset.ownerType,
    ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
    preset.ownerType
  );
  const canPreserveOwner =
    currentOwner.ownerType === ownerType || context.locked === true;

  return normalizeActorMechanicsProfileEditorValue(
    {
      contractVersion: ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION,
      presetId: preset.presetId,
      title: preset.title,
      summary: preset.summary,
      enabled: current.enabled !== false,
      owner: {
        bindingMode:
          context.bindingMode || currentOwner.bindingMode || "UNBOUND_TEMPLATE",
        ownerType,
        ownerId:
          context.ownerId || (canPreserveOwner ? currentOwner.ownerId : null),
        ownerTitle:
          context.ownerTitle ||
          (canPreserveOwner ? currentOwner.ownerTitle : ""),
      },
      statePolicy: EMPTY_ACTOR_MECHANICS_PROFILE_STATE_POLICY,
      capabilityPolicy: preset.capabilityPolicy,
      bindings: preset.bindings.map(createPresetBinding),
      metadata: normalizeObject(current.metadata),
    },
    ownerContext
  );
}

export function normalizeActorMechanicsProfileEditorValue(value = {}, ownerContext = null) {
  const source = normalizeObject(value);
  const presetId = normalizeEnum(
    source.presetId,
    ACTOR_MECHANICS_PROFILE_PRESETS,
    "CUSTOM"
  );
  const preset = getPresetDefinition(presetId);

  return {
    contractVersion:
      normalizeActorMechanicsProfileContractVersion(source.contractVersion),
    presetId,
    title: normalizeString(source.title) || preset.title,
    summary: normalizeString(source.summary) || preset.summary,
    enabled: source.enabled !== false,
    owner: normalizeOwner(source.owner, preset.ownerType, ownerContext),
    statePolicy: {
      isolation: ACTOR_MECHANICS_PROFILE_STATE_ISOLATION,
      namespaceStrategy: ACTOR_MECHANICS_PROFILE_STATE_NAMESPACE,
      sharedDefinitionsAllowed: true,
      sharedMutableStateAllowed: false,
    },
    capabilityPolicy: normalizeCapabilityPolicy(
      source.capabilityPolicy,
      preset.capabilityPolicy
    ),
    bindings: normalizeArray(source.bindings)
      .slice(0, ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxBindings)
      .map(normalizeBinding)
      .sort((left, right) => left.order - right.order)
      .map((binding, order) => ({ ...binding, order })),
    metadata: normalizeObject(source.metadata),
  };
}

function createIssue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function validateActorMechanicsProfileEditorValue(profile) {
  const issues = [];

  if (profile.contractVersion !== ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${ACTOR_MECHANICS_PROFILE_CONTRACT_VERSION}.`
      )
    );
  }

  if (!profile.title) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_TITLE_REQUIRED",
        "title",
        "Profile title is required."
      )
    );
  } else if (
    profile.title.length >
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxTitleLength
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_TITLE_TOO_LONG",
        "title",
        `Profile title must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxTitleLength} characters.`
      )
    );
  }

  if (
    profile.summary.length >
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSummaryLength
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_SUMMARY_TOO_LONG",
        "summary",
        `Profile summary must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSummaryLength} characters.`
      )
    );
  }

  if (profile.owner.bindingMode === "BOUND_ACTOR" && !profile.owner.ownerId) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_BOUND_OWNER_ID_REQUIRED",
        "owner.ownerId",
        "A bound actor profile requires an owner reference."
      )
    );
  }

  if (
    profile.capabilityPolicy.mode === "STANDARD" &&
    profile.capabilityPolicy.opposedResolutionPolicy === "WORKING_MODE_ONLY"
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_STANDARD_WORKING_MODE_POLICY_INVALID",
        "capabilityPolicy.opposedResolutionPolicy",
        "WORKING_MODE_ONLY is reserved for Beyond Scale capability."
      )
    );
  }

  if (
    profile.capabilityPolicy.mode === "BEYOND_SCALE" &&
    profile.capabilityPolicy.opposedResolutionPolicy === "DETERMINISTIC"
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_BEYOND_SCALE_DETERMINISTIC_FORBIDDEN",
        "capabilityPolicy.opposedResolutionPolicy",
        "Unrestricted Beyond Scale capability cannot use ordinary deterministic opposed checks."
      )
    );
  }

  if (
    profile.capabilityPolicy.mode === "BEYOND_SCALE" &&
    profile.capabilityPolicy.opposedResolutionPolicy === "WORKING_MODE_ONLY" &&
    !profile.capabilityPolicy.workingModeProfile
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_WORKING_MODE_PROFILE_RECOMMENDED",
        "capabilityPolicy.workingModeProfile",
        "Identify the restricted working-mode profile that may use deterministic mechanics.",
        "WARNING"
      )
    );
  }

  if (
    profile.capabilityPolicy.workingModeProfile.length >
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxWorkingModeProfileLength
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_WORKING_MODE_PROFILE_TOO_LONG",
        "capabilityPolicy.workingModeProfile",
        `Working-mode profile must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxWorkingModeProfileLength} characters.`
      )
    );
  }

  if (
    profile.capabilityPolicy.notes.length >
    ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_CAPABILITY_NOTES_TOO_LONG",
        "capabilityPolicy.notes",
        `Capability notes must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength} characters.`
      )
    );
  }

  const bindingIds = new Set();
  const enabledDomains = new Set();

  profile.bindings.forEach((binding, index) => {
    const path = `bindings[${index}]`;

    if (!binding.id) {
      issues.push(
        createIssue(
          "ACTOR_MECHANICS_PROFILE_BINDING_ID_REQUIRED",
          `${path}.id`,
          "Binding ID is required."
        )
      );
    } else {
      if (!IDENTIFIER_PATTERN.test(binding.id)) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_BINDING_ID_INVALID",
            `${path}.id`,
            "Binding ID must use lowercase letters, numbers, dots, colons, underscores, or hyphens."
          )
        );
      }

      if (bindingIds.has(binding.id)) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_BINDING_ID_DUPLICATE",
            `${path}.id`,
            `Binding ID ${binding.id} is duplicated.`
          )
        );
      }
      bindingIds.add(binding.id);
    }

    if (
      binding.id.length >
      ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxIdentifierLength
    ) {
      issues.push(
        createIssue(
          "ACTOR_MECHANICS_PROFILE_BINDING_ID_TOO_LONG",
          `${path}.id`,
          `Binding ID must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxIdentifierLength} characters.`
        )
      );
    }

    if (
      binding.notes.length >
      ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength
    ) {
      issues.push(
        createIssue(
          "ACTOR_MECHANICS_PROFILE_BINDING_NOTES_TOO_LONG",
          `${path}.notes`,
          `Binding notes must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength} characters.`
        )
      );
    }

    for (const domain of binding.activation.domains) {
      if (!ACTIVATION_DOMAIN_PATTERN.test(domain)) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_ACTIVATION_DOMAIN_INVALID",
            `${path}.activation.domains`,
            "Activation domains must use uppercase letters, numbers, dots, colons, underscores, or hyphens."
          )
        );
        break;
      }
    }

    const referenceKeys = new Set();
    binding.references.forEach((reference, referenceIndex) => {
      const referencePath = `${path}.references[${referenceIndex}]`;

      if (!reference.sourceId) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_REFERENCE_SOURCE_REQUIRED",
            `${referencePath}.sourceId`,
            "A reusable definition reference requires a source ID."
          )
        );
      }

      if (
        reference.sourceId.length >
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSourceIdLength
      ) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_REFERENCE_SOURCE_TOO_LONG",
            `${referencePath}.sourceId`,
            `Reference source ID must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSourceIdLength} characters.`
          )
        );
      }

      if (
        reference.version.length >
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxVersionLength
      ) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_REFERENCE_VERSION_TOO_LONG",
            `${referencePath}.version`,
            `Reference version must not exceed ${ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxVersionLength} characters.`
          )
        );
      }

      const referenceKey = `${reference.referenceType}:${reference.sourceId}`;
      if (reference.sourceId && referenceKeys.has(referenceKey)) {
        issues.push(
          createIssue(
            "ACTOR_MECHANICS_PROFILE_REFERENCE_DUPLICATE",
            referencePath,
            `Reference ${referenceKey} is duplicated within this binding.`
          )
        );
      }
      referenceKeys.add(referenceKey);
    });

    if (binding.enabled) {
      enabledDomains.add(binding.domain);
    }

    if (
      binding.enabled &&
      binding.references.length === 0 &&
      profile.owner.bindingMode === "BOUND_ACTOR"
    ) {
      issues.push(
        createIssue(
          "ACTOR_MECHANICS_PROFILE_BOUND_BINDING_REFERENCE_RECOMMENDED",
          `${path}.references`,
          `Enabled ${binding.domain} binding has no reusable definition reference.`,
          "WARNING"
        )
      );
    }
  });

  if (
    profile.presetId === "FULL_PLAYER_CHARACTER" &&
    profile.owner.ownerType !== "PLAYER_CHARACTER"
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_FULL_PC_OWNER_INVALID",
        "owner.ownerType",
        "Full Player Character profiles must target a Player Character."
      )
    );
  }

  if (
    profile.presetId === "NARRATIVE_ONLY" &&
    profile.bindings.some((binding) => binding.enabled)
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_NARRATIVE_ONLY_BINDING_ENABLED",
        "bindings",
        "Narrative Only profiles cannot enable deterministic mechanics bindings."
      )
    );
  }

  if (
    profile.presetId === "BEYOND_SCALE" &&
    profile.capabilityPolicy.mode !== "BEYOND_SCALE"
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_BEYOND_SCALE_POLICY_REQUIRED",
        "capabilityPolicy.mode",
        "Beyond Scale preset requires the Beyond Scale capability policy."
      )
    );
  }

  if (
    profile.presetId === "STATTED_NPC" &&
    !enabledDomains.has("STATS")
  ) {
    issues.push(
      createIssue(
        "ACTOR_MECHANICS_PROFILE_STATTED_NPC_STATS_REQUIRED",
        "bindings",
        "Statted NPC preset requires an enabled Stats binding."
      )
    );
  }

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "ERROR"),
    warnings: issues.filter((issue) => issue.severity === "WARNING"),
    enabledDomains: [...enabledDomains],
  };
}

function issuesForPath(issues, pathPrefix) {
  return issues
    .filter((issue) => issue.path.startsWith(pathPrefix))
    .map((issue) => ({
      code: issue.code,
      message: issue.message,
      severity: issue.severity,
    }));
}

function nextBindingId(bindings, domain) {
  const base = domain.toLowerCase();
  const ids = new Set(bindings.map((binding) => binding.id));

  if (!ids.has(base)) return base;

  let index = 2;
  let candidate = `${base}.${index}`;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${base}.${index}`;
  }
  return candidate;
}

function createEmptyBinding(bindings) {
  const unusedDomain = ACTOR_MECHANICS_PROFILE_DOMAINS.find(
    (domain) => !bindings.some((binding) => binding.domain === domain)
  );
  const domain = unusedDomain || "STATS";
  const domainDefinition = getDomainDefinition(domain);

  return normalizeBinding(
    {
      id: nextBindingId(bindings, domain),
      domain,
      title: domainDefinition.label,
      enabled: true,
      required: false,
      activation: {
        mode: "ON_DEMAND",
        domains: [domain],
      },
      references: [],
      order: bindings.length,
    },
    bindings.length
  );
}

function createEmptyReference() {
  return {
    referenceType: "CREATION",
    sourceId: "",
    version: "",
    title: "",
    metadata: {},
  };
}

function getStatsPoolsProfileFromCreation(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(
    data.stats_pools_profile || data.statsPoolsProfile
  );
}

function createStatsPoolsProfileReference(creation = {}) {
  const profile = getStatsPoolsProfileFromCreation(creation);
  const contractVersion =
    normalizeString(profile.contractVersion) ||
    ACTOR_MECHANICS_PROFILE_STATS_POOLS_CONTRACT_VERSION;

  return normalizeReference({
    referenceType: "CREATION",
    sourceId: normalizeString(creation.id),
    version: contractVersion,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Stats & Pools Profile",
    metadata: {
      creationType: ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE,
      contractVersion,
    },
  });
}

function getProgressionProfileFromCreation(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(
    data.progression_profile || data.progressionProfile
  );
}

function createProgressionProfileReference(creation = {}) {
  const profile = getProgressionProfileFromCreation(creation);
  const contractVersion =
    normalizeString(profile.contractVersion) ||
    ACTOR_MECHANICS_PROFILE_PROGRESSION_CONTRACT_VERSION;

  return normalizeReference({
    referenceType: "CREATION",
    sourceId: normalizeString(creation.id),
    version: contractVersion,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Progression Profile",
    metadata: {
      creationType: ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
      contractVersion,
    },
  });
}

function getSkillsProfileFromCreation(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(data.skills_profile || data.skillsProfile);
}

function createSkillsProfileReference(creation = {}) {
  const profile = getSkillsProfileFromCreation(creation);
  const contractVersion =
    normalizeString(profile.contractVersion) ||
    ACTOR_MECHANICS_PROFILE_SKILLS_CONTRACT_VERSION;

  return normalizeReference({
    referenceType: "CREATION",
    sourceId: normalizeString(creation.id),
    version: contractVersion,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Skills Profile",
    metadata: {
      creationType: ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE,
      contractVersion,
    },
  });
}

function getAbilitySpellProfileFromCreation(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(
    data.ability_spell_profile || data.abilitySpellProfile
  );
}

function createAbilitySpellProfileReference(creation = {}) {
  const profile = getAbilitySpellProfileFromCreation(creation);
  const contractVersion =
    normalizeString(profile.contractVersion) ||
    ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CONTRACT_VERSION;

  return normalizeReference({
    referenceType: "CREATION",
    sourceId: normalizeString(creation.id),
    version: contractVersion,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Ability & Spell Profile",
    metadata: {
      creationType: ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE,
      contractVersion,
    },
  });
}

function getWalletProfileFromCreation(creation = {}) {
  const data = normalizeObject(creation.data);

  return normalizeObject(data.wallet_profile || data.walletProfile);
}

function createWalletProfileReference(creation = {}) {
  const profile = getWalletProfileFromCreation(creation);
  const contractVersion =
    normalizeString(profile.contractVersion) ||
    ACTOR_MECHANICS_PROFILE_WALLET_CONTRACT_VERSION;

  return normalizeReference({
    referenceType: "CREATION",
    sourceId: normalizeString(creation.id),
    version: contractVersion,
    title:
      normalizeString(creation.title) ||
      normalizeString(profile.title) ||
      "Wallet Profile",
    metadata: {
      creationType: ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE,
      contractVersion,
    },
  });
}

export function useActorMechanicsProfileEditorViewModel({
  value,
  onChange,
  ownerContext = null,
} = {}) {
  const normalized = useMemo(
    () =>
      normalizeActorMechanicsProfileEditorValue(
        value || createProfileFromPreset("CUSTOM", {}, ownerContext),
        ownerContext
      ),
    [ownerContext, value]
  );
  const [pendingPresetId, setPendingPresetId] = useState(normalized.presetId);
  const [expandedBindingIds, setExpandedBindingIds] = useState(() =>
    new Set(normalized.bindings.slice(0, 1).map((binding) => binding.id))
  );
  const [activationDomainDrafts, setActivationDomainDrafts] = useState({});
  const [statsPoolsPickerBindingId, setStatsPoolsPickerBindingId] =
    useState("");
  const [progressionPickerBindingId, setProgressionPickerBindingId] =
    useState("");
  const [skillsPickerBindingId, setSkillsPickerBindingId] = useState("");
  const [abilitySpellPickerBindingId, setAbilitySpellPickerBindingId] =
    useState("");
  const [walletPickerBindingId, setWalletPickerBindingId] = useState("");
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);

  useEffect(() => {
    setPendingPresetId(normalized.presetId);
  }, [normalized.presetId]);

  const validation = useMemo(() => validateActorMechanicsProfileEditorValue(normalized), [normalized]);
  const ownerLocked = normalizeObject(ownerContext).locked === true;

  function emit(nextValue) {
    onChange?.(normalizeActorMechanicsProfileEditorValue(nextValue, ownerContext));
  }

  function applyJsonProfile(nextProfile) {
    const next = normalizeActorMechanicsProfileEditorValue(
      nextProfile,
      ownerContext
    );
    setPendingPresetId(next.presetId);
    setExpandedBindingIds(
      new Set(next.bindings.slice(0, 1).map((binding) => binding.id))
    );
    setActivationDomainDrafts({});
    emit(next);
  }

  function updateTopLevel(field, nextValue) {
    emit({ ...normalized, [field]: nextValue });
  }

  function updateOwner(field, nextValue) {
    if (ownerLocked) return;

    emit({
      ...normalized,
      owner: {
        ...normalized.owner,
        [field]: nextValue,
      },
    });
  }

  function updateCapabilityPolicy(field, nextValue) {
    const capabilityPolicy = {
      ...normalized.capabilityPolicy,
      [field]: nextValue,
    };

    if (field === "mode" && nextValue === "STANDARD") {
      if (capabilityPolicy.opposedResolutionPolicy === "WORKING_MODE_ONLY") {
        capabilityPolicy.opposedResolutionPolicy = "DETERMINISTIC";
      }
      capabilityPolicy.workingModeProfile = "";
    }

    if (field === "mode" && nextValue === "BEYOND_SCALE") {
      if (capabilityPolicy.opposedResolutionPolicy === "DETERMINISTIC") {
        capabilityPolicy.opposedResolutionPolicy = "WORKING_MODE_ONLY";
      }
    }

    emit({ ...normalized, capabilityPolicy });
  }

  function applyPreset() {
    const next = createProfileFromPreset(
      pendingPresetId,
      normalized,
      ownerContext
    );
    setExpandedBindingIds(
      new Set(next.bindings.slice(0, 1).map((binding) => binding.id))
    );
    setActivationDomainDrafts({});
    emit(next);
  }

  function addBinding() {
    if (
      normalized.bindings.length >=
      ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxBindings
    ) {
      return;
    }

    const binding = createEmptyBinding(normalized.bindings);
    setExpandedBindingIds((current) => new Set([...current, binding.id]));
    emit({
      ...normalized,
      presetId:
        normalized.presetId === "NARRATIVE_ONLY"
          ? "CUSTOM"
          : normalized.presetId,
      bindings: [...normalized.bindings, binding],
    });
  }

  function removeBinding(bindingId) {
    setActivationDomainDrafts((current) => {
      const next = { ...current };
      delete next[bindingId];
      return next;
    });
    setExpandedBindingIds((current) => {
      const next = new Set(current);
      next.delete(bindingId);
      return next;
    });
    emit({
      ...normalized,
      bindings: normalized.bindings.filter((binding) => binding.id !== bindingId),
    });
  }

  function moveBinding(bindingId, direction) {
    const index = normalized.bindings.findIndex(
      (binding) => binding.id === bindingId
    );
    const target = direction === "UP" ? index - 1 : index + 1;

    if (index < 0 || target < 0 || target >= normalized.bindings.length) {
      return;
    }

    const bindings = [...normalized.bindings];
    const [binding] = bindings.splice(index, 1);
    bindings.splice(target, 0, binding);
    emit({
      ...normalized,
      bindings: bindings.map((item, order) => ({ ...item, order })),
    });
  }

  function toggleBinding(bindingId) {
    setExpandedBindingIds((current) => {
      const next = new Set(current);
      if (next.has(bindingId)) next.delete(bindingId);
      else next.add(bindingId);
      return next;
    });
  }

  function updateBinding(bindingId, field, nextValue) {
    let nextExpandedId = null;

    if (field === "activationDomainsInput") {
      setActivationDomainDrafts((current) => ({
        ...current,
        [bindingId]: String(nextValue || "").toUpperCase(),
      }));
    }

    const bindings = normalized.bindings.map((binding) => {
      if (binding.id !== bindingId) return binding;

      if (field === "id") {
        nextExpandedId = normalizeString(nextValue).toLowerCase();
        return { ...binding, id: nextExpandedId };
      }

      if (field === "domain") {
        const domain = normalizeEnum(
          nextValue,
          ACTOR_MECHANICS_PROFILE_DOMAINS,
          binding.domain
        );
        return {
          ...binding,
          domain,
          activation: {
            ...binding.activation,
            domains:
              binding.activation.domains.length === 1 &&
              binding.activation.domains[0] === binding.domain
                ? [domain]
                : binding.activation.domains,
          },
        };
      }

      if (field === "activationMode") {
        return {
          ...binding,
          activation: {
            ...binding.activation,
            mode: nextValue,
          },
        };
      }

      if (field === "activationDomainsInput") {
        return {
          ...binding,
          activation: {
            ...binding.activation,
            domains: splitActivationDomains(nextValue),
          },
        };
      }

      return { ...binding, [field]: nextValue };
    });

    if (nextExpandedId && nextExpandedId !== bindingId) {
      setActivationDomainDrafts((current) => {
        if (!(bindingId in current)) return current;
        const next = { ...current, [nextExpandedId]: current[bindingId] };
        delete next[bindingId];
        return next;
      });
      setExpandedBindingIds((current) => {
        const next = new Set(current);
        next.delete(bindingId);
        if (nextExpandedId) next.add(nextExpandedId);
        return next;
      });
    }

    emit({ ...normalized, bindings });
  }

  function addReference(bindingId) {
    const bindings = normalized.bindings.map((binding) => {
      if (binding.id !== bindingId) return binding;
      if (
        binding.references.length >=
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxReferencesPerBinding
      ) {
        return binding;
      }
      return {
        ...binding,
        references: [...binding.references, createEmptyReference()],
      };
    });

    emit({ ...normalized, bindings });
  }

  function removeReference(bindingId, referenceIndex) {
    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId
          ? {
              ...binding,
              references: binding.references.filter(
                (_reference, index) => index !== referenceIndex
              ),
            }
          : binding
      ),
    });
  }

  function updateReference(bindingId, referenceIndex, field, nextValue) {
    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId
          ? {
              ...binding,
              references: binding.references.map((reference, index) =>
                index === referenceIndex
                  ? { ...reference, [field]: nextValue }
                  : reference
              ),
            }
          : binding
      ),
    });
  }

  function openStatsPoolsProfilePicker(bindingId) {
    const binding = normalized.bindings.find(
      (candidate) => candidate.id === bindingId
    );

    if (!binding || binding.domain !== "STATS") return;

    setProgressionPickerBindingId("");
    setSkillsPickerBindingId("");
    setAbilitySpellPickerBindingId("");
    setWalletPickerBindingId("");
    setStatsPoolsPickerBindingId(bindingId);
  }

  function selectStatsPoolsProfile(creation) {
    const creationId = normalizeString(creation?.id);
    const bindingId = statsPoolsPickerBindingId;

    if (!creationId || !bindingId) {
      setStatsPoolsPickerBindingId("");
      return;
    }

    const reference = createStatsPoolsProfileReference(creation);

    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId && binding.domain === "STATS"
          ? {
              ...binding,
              references: [
                ...binding.references.filter(
                  (existingReference) =>
                    existingReference.referenceType !== "CREATION"
                ),
                reference,
              ],
            }
          : binding
      ),
    });
    setStatsPoolsPickerBindingId("");
  }

  function openProgressionProfilePicker(bindingId) {
    const binding = normalized.bindings.find(
      (candidate) => candidate.id === bindingId
    );

    if (!binding || binding.domain !== "PROGRESSION") return;

    setStatsPoolsPickerBindingId("");
    setSkillsPickerBindingId("");
    setAbilitySpellPickerBindingId("");
    setWalletPickerBindingId("");
    setProgressionPickerBindingId(bindingId);
  }

  function selectProgressionProfile(creation) {
    const creationId = normalizeString(creation?.id);
    const bindingId = progressionPickerBindingId;

    if (!creationId || !bindingId) {
      setProgressionPickerBindingId("");
      return;
    }

    const reference = createProgressionProfileReference(creation);

    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId && binding.domain === "PROGRESSION"
          ? {
              ...binding,
              references: [
                ...binding.references.filter(
                  (existingReference) =>
                    existingReference.referenceType !== "CREATION"
                ),
                reference,
              ],
            }
          : binding
      ),
    });
    setProgressionPickerBindingId("");
  }

  function openSkillsProfilePicker(bindingId) {
    const binding = normalized.bindings.find(
      (candidate) => candidate.id === bindingId
    );

    if (!binding || binding.domain !== "SKILLS") return;

    setStatsPoolsPickerBindingId("");
    setProgressionPickerBindingId("");
    setAbilitySpellPickerBindingId("");
    setWalletPickerBindingId("");
    setSkillsPickerBindingId(bindingId);
  }

  function selectSkillsProfile(creation) {
    const creationId = normalizeString(creation?.id);
    const bindingId = skillsPickerBindingId;

    if (!creationId || !bindingId) {
      setSkillsPickerBindingId("");
      return;
    }

    const reference = createSkillsProfileReference(creation);

    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId && binding.domain === "SKILLS"
          ? {
              ...binding,
              references: [
                ...binding.references.filter(
                  (existingReference) =>
                    existingReference.referenceType !== "CREATION"
                ),
                reference,
              ],
            }
          : binding
      ),
    });
    setSkillsPickerBindingId("");
  }

  function openAbilitySpellProfilePicker(bindingId) {
    const binding = normalized.bindings.find(
      (candidate) => candidate.id === bindingId
    );

    if (!binding || !["MAGIC", "ABILITIES"].includes(binding.domain)) return;

    setStatsPoolsPickerBindingId("");
    setProgressionPickerBindingId("");
    setSkillsPickerBindingId("");
    setWalletPickerBindingId("");
    setAbilitySpellPickerBindingId(bindingId);
  }

  function selectAbilitySpellProfile(creation) {
    const creationId = normalizeString(creation?.id);
    const bindingId = abilitySpellPickerBindingId;

    if (!creationId || !bindingId) {
      setAbilitySpellPickerBindingId("");
      return;
    }

    const reference = createAbilitySpellProfileReference(creation);

    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId && ["MAGIC", "ABILITIES"].includes(binding.domain)
          ? {
              ...binding,
              references: [
                ...binding.references.filter(
                  (existingReference) =>
                    existingReference.referenceType !== "CREATION"
                ),
                reference,
              ],
            }
          : binding
      ),
    });
    setAbilitySpellPickerBindingId("");
  }

  function openWalletProfilePicker(bindingId) {
    const binding = normalized.bindings.find(
      (candidate) => candidate.id === bindingId
    );

    if (!binding || binding.domain !== "WALLET") return;

    setStatsPoolsPickerBindingId("");
    setProgressionPickerBindingId("");
    setSkillsPickerBindingId("");
    setAbilitySpellPickerBindingId("");
    setWalletPickerBindingId(bindingId);
  }

  function selectWalletProfile(creation) {
    const creationId = normalizeString(creation?.id);
    const bindingId = walletPickerBindingId;

    if (!creationId || !bindingId) {
      setWalletPickerBindingId("");
      return;
    }

    const reference = createWalletProfileReference(creation);

    emit({
      ...normalized,
      bindings: normalized.bindings.map((binding) =>
        binding.id === bindingId && binding.domain === "WALLET"
          ? {
              ...binding,
              references: [
                ...binding.references.filter(
                  (existingReference) =>
                    existingReference.referenceType !== "CREATION"
                ),
                reference,
              ],
            }
          : binding
      ),
    });
    setWalletPickerBindingId("");
  }

  const bindingViewItems = normalized.bindings.map((binding, index) => {
    const domain = getDomainDefinition(binding.domain);

    const bindingPath = `bindings[${index}]`;
    const referenceItemPrefix = `${bindingPath}.references[`;

    return {
      ...binding,
      domainLabel: domain.label,
      domainDescription: domain.description,
      activationMode: binding.activation.mode,
      activationDomainsInput:
        activationDomainDrafts[binding.id] ??
        binding.activation.domains.join(", "),
      expanded: expandedBindingIds.has(binding.id),
      definitionReferenceMode:
        binding.domain === "STATS"
          ? "STATS_POOLS_PROFILE"
          : binding.domain === "PROGRESSION"
            ? "PROGRESSION_PROFILE"
            : binding.domain === "SKILLS"
              ? "SKILLS_PROFILE"
              : ["MAGIC", "ABILITIES"].includes(binding.domain)
                ? "ABILITY_SPELL_PROFILE"
                : binding.domain === "WALLET"
                  ? "WALLET_PROFILE"
                  : "GENERIC",
      hasStatsPoolsProfileReference:
        binding.domain === "STATS" &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
      hasProgressionProfileReference:
        binding.domain === "PROGRESSION" &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
      hasSkillsProfileReference:
        binding.domain === "SKILLS" &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
      hasAbilitySpellProfileReference:
        ["MAGIC", "ABILITIES"].includes(binding.domain) &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
      hasWalletProfileReference:
        binding.domain === "WALLET" &&
        binding.references.some(
          (reference) => reference.referenceType === "CREATION"
        ),
      issues: validation.issues
        .filter(
          (issue) =>
            issue.path.startsWith(bindingPath) &&
            !issue.path.startsWith(referenceItemPrefix)
        )
        .map((issue) => ({
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
        })),
      references: binding.references.map((reference, referenceIndex) => ({
        ...reference,
        index: referenceIndex,
        issues: issuesForPath(
          validation.issues,
          `bindings[${index}].references[${referenceIndex}]`
        ),
      })),
    };
  });

  const selectedStatsPoolsBinding = normalized.bindings.find(
    (binding) => binding.id === statsPoolsPickerBindingId
  );
  const selectedStatsPoolsCreationIds =
    selectedStatsPoolsBinding?.domain === "STATS"
      ? selectedStatsPoolsBinding.references
          .filter((reference) => reference.referenceType === "CREATION")
          .map((reference) => reference.sourceId)
          .filter(Boolean)
      : [];

  const selectedProgressionBinding = normalized.bindings.find(
    (binding) => binding.id === progressionPickerBindingId
  );
  const selectedProgressionCreationIds =
    selectedProgressionBinding?.domain === "PROGRESSION"
      ? selectedProgressionBinding.references
          .filter((reference) => reference.referenceType === "CREATION")
          .map((reference) => reference.sourceId)
          .filter(Boolean)
      : [];

  const selectedSkillsBinding = normalized.bindings.find(
    (binding) => binding.id === skillsPickerBindingId
  );
  const selectedSkillsCreationIds =
    selectedSkillsBinding?.domain === "SKILLS"
      ? selectedSkillsBinding.references
          .filter((reference) => reference.referenceType === "CREATION")
          .map((reference) => reference.sourceId)
          .filter(Boolean)
      : [];

  const selectedAbilitySpellBinding = normalized.bindings.find(
    (binding) => binding.id === abilitySpellPickerBindingId
  );
  const selectedAbilitySpellCreationIds =
    ["MAGIC", "ABILITIES"].includes(selectedAbilitySpellBinding?.domain)
      ? selectedAbilitySpellBinding.references
          .filter((reference) => reference.referenceType === "CREATION")
          .map((reference) => reference.sourceId)
          .filter(Boolean)
      : [];

  const selectedWalletBinding = normalized.bindings.find(
    (binding) => binding.id === walletPickerBindingId
  );
  const selectedWalletCreationIds =
    selectedWalletBinding?.domain === "WALLET"
      ? selectedWalletBinding.references
          .filter((reference) => reference.referenceType === "CREATION")
          .map((reference) => reference.sourceId)
          .filter(Boolean)
      : [];

  return {
    viewProps: {
      profile: normalized,
      ownerContext,
      enabled: normalized.enabled,
      title: normalized.title,
      summary: normalized.summary,
      titleCharacterCount: normalized.title.length,
      titleCharacterLimit: ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxTitleLength,
      summaryCharacterCount: normalized.summary.length,
      summaryCharacterLimit:
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxSummaryLength,
      presetId: normalized.presetId,
      pendingPresetId,
      presetOptions: ACTOR_MECHANICS_PROFILE_PRESET_OPTIONS,
      ownerBindingMode: normalized.owner.bindingMode,
      ownerType: normalized.owner.ownerType,
      ownerId: normalized.owner.ownerId || "",
      ownerTitle: normalized.owner.ownerTitle,
      ownerLocked,
      ownerTypes: ACTOR_MECHANICS_PROFILE_OWNER_TYPES,
      ownerBindingModes: ACTOR_MECHANICS_PROFILE_BINDING_MODES,
      statePolicy: normalized.statePolicy,
      capabilityMode: normalized.capabilityPolicy.mode,
      opposedResolutionPolicy:
        normalized.capabilityPolicy.opposedResolutionPolicy,
      workingModeProfile: normalized.capabilityPolicy.workingModeProfile,
      capabilityNotes: normalized.capabilityPolicy.notes,
      capabilityModes: ACTOR_MECHANICS_PROFILE_CAPABILITY_MODES,
      opposedResolutionPolicies:
        ACTOR_MECHANICS_PROFILE_OPPOSED_RESOLUTION_POLICIES,
      capabilityNotesCharacterCount: normalized.capabilityPolicy.notes.length,
      capabilityNotesCharacterLimit:
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxNotesLength,
      workingModeProfileCharacterCount:
        normalized.capabilityPolicy.workingModeProfile.length,
      workingModeProfileCharacterLimit:
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxWorkingModeProfileLength,
      bindings: bindingViewItems,
      bindingCount: normalized.bindings.length,
      bindingLimit: ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxBindings,
      enabledBindingCount: normalized.bindings.filter(
        (binding) => binding.enabled
      ).length,
      referenceCount: normalized.bindings.reduce(
        (total, binding) => total + binding.references.length,
        0
      ),
      enabledDomains: validation.enabledDomains,
      domainOptions: ACTOR_MECHANICS_PROFILE_DOMAIN_OPTIONS,
      referenceTypeOptions: ACTOR_MECHANICS_PROFILE_REFERENCE_TYPE_OPTIONS,
      activationModeOptions:
        ACTOR_MECHANICS_PROFILE_ACTIVATION_MODE_OPTIONS,
      referenceLimitPerBinding:
        ACTOR_MECHANICS_PROFILE_EDITOR_LIMITS.maxReferencesPerBinding,
      globalIssues: validation.issues.filter(
        (issue) => !issue.path.startsWith("bindings[")
      ),
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      jsonEditorOpen,
      onOpenJsonEditor: () => setJsonEditorOpen(true),
      onCloseJsonEditor: () => setJsonEditorOpen(false),
      onApplyJsonProfile: applyJsonProfile,
      onSetEnabled: (enabled) => updateTopLevel("enabled", enabled),
      onUpdateIdentity: updateTopLevel,
      onSelectPreset: setPendingPresetId,
      onApplyPreset: applyPreset,
      onUpdateOwner: updateOwner,
      onUpdateCapabilityPolicy: updateCapabilityPolicy,
      onAddBinding: addBinding,
      onRemoveBinding: removeBinding,
      onMoveBinding: moveBinding,
      onToggleBinding: toggleBinding,
      onUpdateBinding: updateBinding,
      onAddReference: addReference,
      onRemoveReference: removeReference,
      onUpdateReference: updateReference,
      onOpenStatsPoolsProfilePicker: openStatsPoolsProfilePicker,
      onOpenProgressionProfilePicker: openProgressionProfilePicker,
      onOpenSkillsProfilePicker: openSkillsProfilePicker,
      onOpenAbilitySpellProfilePicker: openAbilitySpellProfilePicker,
      onOpenWalletProfilePicker: openWalletProfilePicker,
    },
    pickerProps: statsPoolsPickerBindingId
      ? {
          title: "Select Stats & Pools Profile",
          body:
            "Choose an owned Stats & Pools Profile to provide reusable definitions for this STATS binding. Mutable actor values are not copied or created by this attachment.",
          allowedTypes: [
            ACTOR_MECHANICS_PROFILE_STATS_POOLS_CREATION_TYPE,
          ],
          selectedCreationIds: selectedStatsPoolsCreationIds,
          onClose: () => setStatsPoolsPickerBindingId(""),
          onSelect: selectStatsPoolsProfile,
        }
      : progressionPickerBindingId
        ? {
            title: "Select Progression Profile",
            body:
              "Choose an owned Progression Profile to provide reusable curve and tier definitions for this PROGRESSION binding. Actor experience and level state are not copied or initialized by this attachment.",
            allowedTypes: [
              ACTOR_MECHANICS_PROFILE_PROGRESSION_CREATION_TYPE,
            ],
            selectedCreationIds: selectedProgressionCreationIds,
            onClose: () => setProgressionPickerBindingId(""),
            onSelect: selectProgressionProfile,
          }
        : skillsPickerBindingId
          ? {
              title: "Select Skills Profile",
              body:
                "Choose an owned Skills Profile to provide reusable proficiency and rank definitions for this SKILLS binding. Actor ranks and unspent points are not copied or initialized by this attachment.",
              allowedTypes: [ACTOR_MECHANICS_PROFILE_SKILLS_CREATION_TYPE],
              selectedCreationIds: selectedSkillsCreationIds,
              onClose: () => setSkillsPickerBindingId(""),
              onSelect: selectSkillsProfile,
            }
          : abilitySpellPickerBindingId
            ? {
                title: "Select Ability & Spell Profile",
                body:
                  selectedAbilitySpellBinding?.domain === "MAGIC"
                    ? "Choose an owned Ability & Spell Profile to provide reusable spell and magic definitions for this MAGIC binding. Known spells, mastery, cooldowns, charges, and resource state are not copied or initialized by this attachment."
                    : "Choose an owned Ability & Spell Profile to provide reusable ability, technique, special attack, passive, and spell definitions for this ABILITIES binding. Known abilities, mastery, cooldowns, charges, and resource state are not copied or initialized by this attachment.",
                allowedTypes: [
                  ACTOR_MECHANICS_PROFILE_ABILITY_SPELL_CREATION_TYPE,
                ],
                selectedCreationIds: selectedAbilitySpellCreationIds,
                onClose: () => setAbilitySpellPickerBindingId(""),
                onSelect: selectAbilitySpellProfile,
              }
            : walletPickerBindingId
              ? {
                  title: "Select Wallet Profile",
                  body:
                    "Choose an owned Wallet Profile to provide reusable gameplay currency definitions for this WALLET binding. Live actor balances, revisions, and transaction history are not copied or initialized by this attachment.",
                  allowedTypes: [
                    ACTOR_MECHANICS_PROFILE_WALLET_CREATION_TYPE,
                  ],
                  selectedCreationIds: selectedWalletCreationIds,
                  onClose: () => setWalletPickerBindingId(""),
                  onSelect: selectWalletProfile,
                }
              : null,
  };
}
