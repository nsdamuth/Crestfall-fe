import {
  COMMAND_OPPOSED_TIE_POLICIES,
  COMMAND_RESOLUTION_MODES,
  COMMAND_RESOLUTION_MODIFIER_BUCKETS,
  COMMAND_RESOLUTION_MODIFIER_MISSING_POLICIES,
  COMMAND_RESOLUTION_MODIFIER_ROUNDING,
  COMMAND_RESOLUTION_MODIFIER_SCOPE_MODES,
  COMMAND_RESOLUTION_MODIFIER_SOURCE_TYPES,
  COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS,
  COMMAND_RESOLUTION_ROLL_MODES,
  COMMAND_RESOLUTION_TARGET_PROPERTIES,
  buildMechanicsCommandResolutionReferenceConfiguration,
  createMechanicsCommandResolutionModifier,
  createMechanicsCommandResolutionModifierSource,
  formatMechanicsCommandResolutionBuilderSummary,
  isBooleanMechanicsCommandResolutionTargetProperty,
  isRollingMechanicsCommandResolutionMode,
  normalizeMechanicsCommandResolutionBuilder,
  normalizeMechanicsCommandResolutionModifier,
  normalizeMechanicsCommandResolutionModifierSource,
} from "../mechanicsCommandResolutionBuilder.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sourceDie(value = {}) {
  const source = asObject(value);
  return asObject(source.die || source.thresholdDie || source.actorDie);
}

function sourceDegree(value = {}) {
  const source = asObject(value);
  return asObject(
    source.degreeOfSuccess || source.marginBands || source.degreesOfSuccess
  );
}

function sourceOpposed(value = {}) {
  const source = asObject(value);
  return asObject(
    source.opposed ||
      source.opposition ||
      source.opponent ||
      source.defender ||
      source.targetCheck
  );
}

function sourceOpposedDie(value = {}) {
  const source = sourceOpposed(value);
  return asObject(source.die || source.opposedDie || source.defenderDie);
}

export function normalizeMechanicsCommandResolution(value = {}) {
  const source = asObject(value);
  const normalized = normalizeMechanicsCommandResolutionBuilder(source);
  const opposedSource = sourceOpposed(source);

  return {
    ...source,
    ...normalized,
    die: {
      ...sourceDie(source),
      ...normalized.die,
    },
    modifiers: normalized.modifiers,
    modifierSources: normalized.modifierSources,
    opposed: normalized.opposed
      ? {
          ...opposedSource,
          ...normalized.opposed,
          die: {
            ...sourceOpposedDie(source),
            ...normalized.opposed.die,
          },
          modifiers: normalized.opposed.modifiers,
          modifierSources: normalized.opposed.modifierSources,
        }
      : null,
    degreeOfSuccess: {
      ...sourceDegree(source),
      ...normalized.degreeOfSuccess,
    },
  };
}

export function buildMechanicsCommandResolutionReference(id) {
  return normalizeMechanicsCommandResolution(
    buildMechanicsCommandResolutionReferenceConfiguration(id) || {}
  );
}

export function formatMechanicsCommandResolutionSummary(value = {}) {
  return formatMechanicsCommandResolutionBuilderSummary(value);
}

export {
  COMMAND_OPPOSED_TIE_POLICIES,
  COMMAND_RESOLUTION_MODES,
  COMMAND_RESOLUTION_MODIFIER_BUCKETS,
  COMMAND_RESOLUTION_MODIFIER_MISSING_POLICIES,
  COMMAND_RESOLUTION_MODIFIER_ROUNDING,
  COMMAND_RESOLUTION_MODIFIER_SCOPE_MODES,
  COMMAND_RESOLUTION_MODIFIER_SOURCE_TYPES,
  COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS,
  COMMAND_RESOLUTION_ROLL_MODES,
  COMMAND_RESOLUTION_TARGET_PROPERTIES,
  createMechanicsCommandResolutionModifier,
  createMechanicsCommandResolutionModifierSource,
  isBooleanMechanicsCommandResolutionTargetProperty,
  isRollingMechanicsCommandResolutionMode,
  normalizeMechanicsCommandResolutionModifier,
  normalizeMechanicsCommandResolutionModifierSource,
};
