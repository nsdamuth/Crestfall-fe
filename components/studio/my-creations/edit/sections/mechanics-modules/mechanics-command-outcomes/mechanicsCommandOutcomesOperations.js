import {
  COMMAND_RESOLUTION_OUTCOMES,
} from "./MechanicsCommandOutcomes.contract.js";
import {
  normalizeCommandOutcomeBranch,
  normalizeCommandOutcomes,
} from "./mechanicsCommandOutcomesNormalization.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function defaultNormalizeEffect(effect) {
  return effect && typeof effect === "object" ? { ...effect } : {};
}

function uniqueEffectId(prefix, effects = []) {
  const existing = new Set(
    asArray(effects)
      .map((effect) => String(effect?.id || "").trim())
      .filter(Boolean)
  );
  let index = 1;
  let candidate = `${prefix}_${index}`;

  while (existing.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }

  return candidate;
}

export function createMechanicsCommandOutcomesController({
  outcomes,
  commandIndex,
  onPatchCommand,
  normalizeEffect = defaultNormalizeEffect,
}) {
  const safeOutcomes = normalizeCommandOutcomes(outcomes, { normalizeEffect });

  function replaceOutcomes(nextOutcomes) {
    onPatchCommand(commandIndex, {
      outcomes: normalizeCommandOutcomes(nextOutcomes, { normalizeEffect }),
    });
  }

  function patchOutcome(outcome, patch) {
    const current = normalizeCommandOutcomeBranch(
      safeOutcomes[outcome],
      outcome,
      { normalizeEffect }
    );

    replaceOutcomes({
      ...safeOutcomes,
      [outcome]: {
        ...current,
        ...patch,
      },
    });
  }

  function addOutcomeEffect(outcome) {
    const current = normalizeCommandOutcomeBranch(
      safeOutcomes[outcome],
      outcome,
      { normalizeEffect }
    );
    const effects = asArray(current.effects);
    const nextEffect = normalizeEffect(
      {
        id: uniqueEffectId("effect", effects),
        type: "FLAG_SET",
        targetId: "",
        targetBinding: {
          mode: "FIXED",
          argumentName: "",
        },
        value: true,
        reason: "",
      },
      "FLAG_SET"
    );

    patchOutcome(outcome, {
      effectMode: ["REPLACE", "APPEND"].includes(current.effectMode)
        ? current.effectMode
        : "REPLACE",
      effects: [...effects, nextEffect],
    });
  }

  function patchOutcomeEffect(outcome, effectIndex, patch) {
    const current = normalizeCommandOutcomeBranch(
      safeOutcomes[outcome],
      outcome,
      { normalizeEffect }
    );

    patchOutcome(outcome, {
      effects: asArray(current.effects).map((effect, index) =>
        index === effectIndex
          ? normalizeEffect(
              {
                ...effect,
                ...patch,
              },
              patch.type || effect.type
            )
          : effect
      ),
    });
  }

  function removeOutcomeEffect(outcome, effectIndex) {
    const current = normalizeCommandOutcomeBranch(
      safeOutcomes[outcome],
      outcome,
      { normalizeEffect }
    );

    patchOutcome(outcome, {
      effects: asArray(current.effects).filter(
        (_effect, index) => index !== effectIndex
      ),
    });
  }

  return {
    outcomes: safeOutcomes,
    branches: COMMAND_RESOLUTION_OUTCOMES.map((outcome) =>
      safeOutcomes[outcome]
    ),
    patchOutcome,
    addOutcomeEffect,
    patchOutcomeEffect,
    removeOutcomeEffect,
  };
}
