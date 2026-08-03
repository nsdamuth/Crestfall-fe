import {
  COMMAND_OUTCOME_EFFECT_MODES,
  COMMAND_RESOLUTION_OUTCOMES,
  MECHANICS_COMMAND_OUTCOMES_VERSION,
} from "./MechanicsCommandOutcomes.contract.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function defaultNormalizeEffect(effect) {
  return effect && typeof effect === "object" ? { ...effect } : {};
}

function outcomeKeyVariants(outcome) {
  const lowercase = outcome.toLowerCase();
  const camel = lowercase.replace(/_([a-z])/g, (_match, letter) =>
    letter.toUpperCase()
  );
  return [outcome, lowercase, camel];
}

export function getDefaultCommandOutcomeEffectMode(outcome) {
  return ["CRITICAL_SUCCESS", "SUCCESS"].includes(outcome)
    ? "INHERIT"
    : "NONE";
}

export function normalizeCommandOutcomeBranch(
  value,
  outcome,
  { normalizeEffect = defaultNormalizeEffect } = {}
) {
  const source = asObject(value);
  const effects = asArray(source.effects).map((effect) =>
    normalizeEffect(effect, effect?.type)
  );
  const requestedMode = normalizeString(
    source.effectMode || source.effect_mode || source.mode
  ).toUpperCase();
  const defaultMode = effects.length
    ? "REPLACE"
    : getDefaultCommandOutcomeEffectMode(outcome);

  return {
    ...source,
    outcome,
    effectMode: COMMAND_OUTCOME_EFFECT_MODES.includes(requestedMode)
      ? requestedMode
      : defaultMode,
    effects,
    summary: normalizeString(
      source.summary || source.reason || source.description
    ),
  };
}

export function normalizeCommandOutcomes(
  value,
  { normalizeEffect = defaultNormalizeEffect } = {}
) {
  const source = asObject(value);
  const normalizedBranches = Object.fromEntries(
    COMMAND_RESOLUTION_OUTCOMES.map((outcome) => {
      const branchSource = outcomeKeyVariants(outcome)
        .map((key) => source[key])
        .find((candidate) => candidate !== undefined);

      return [
        outcome,
        normalizeCommandOutcomeBranch(branchSource, outcome, {
          normalizeEffect,
        }),
      ];
    })
  );

  return {
    ...source,
    version: normalizeString(source.version) || MECHANICS_COMMAND_OUTCOMES_VERSION,
    ...normalizedBranches,
  };
}

export function getCommandOutcomeEffectModeDescription(outcome, effectMode) {
  if (effectMode === "INHERIT") {
    return "Use the Base Success Effects exactly as configured below.";
  }

  if (effectMode === "REPLACE") {
    return `Use only the effects configured for ${outcome.replaceAll("_", " ")}.`;
  }

  if (effectMode === "APPEND") {
    return "Apply the Base Success Effects, then apply this outcome’s additional effects.";
  }

  return "Resolve and display this outcome without applying mechanics effects.";
}

export function countCustomCommandOutcomeBranches(value, options = {}) {
  const outcomes = normalizeCommandOutcomes(value, options);

  return COMMAND_RESOLUTION_OUTCOMES.filter((outcome) => {
    const branch = outcomes[outcome];
    return (
      branch.effectMode !== getDefaultCommandOutcomeEffectMode(outcome) ||
      Boolean(branch.summary) ||
      asArray(branch.effects).length > 0
    );
  }).length;
}

export function listCommandOutcomeEffects(value, options = {}) {
  const outcomes = normalizeCommandOutcomes(value, options);
  return COMMAND_RESOLUTION_OUTCOMES.flatMap((outcome) =>
    asArray(outcomes[outcome]?.effects)
  );
}
