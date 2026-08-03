import {
  createMechanicsCommandEffect,
  normalizeMechanicsCommandEffect,
  normalizeMechanicsCommandEffects,
} from "./mechanicsCommandEffectsNormalization.js";

function uniqueEffectId(prefix, effects = []) {
  const ids = new Set(
    normalizeMechanicsCommandEffects(effects).map((effect) => effect.id)
  );
  let index = effects.length + 1;
  let candidate = `${prefix}_${index}`;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }
  return candidate;
}

export function addMechanicsCommandEffect(
  effects,
  { type = "FLAG_SET", idPrefix = "effect" } = {}
) {
  const safe = normalizeMechanicsCommandEffects(effects);
  return [
    ...safe,
    createMechanicsCommandEffect({
      type,
      id: uniqueEffectId(idPrefix, safe),
    }),
  ];
}

export function patchMechanicsCommandEffect(effects, effectIndex, patch = {}) {
  return normalizeMechanicsCommandEffects(effects).map((effect, index) =>
    index === effectIndex
      ? normalizeMechanicsCommandEffect(
          { ...effect, ...patch },
          patch.type || effect.type
        )
      : effect
  );
}

export function removeMechanicsCommandEffect(effects, effectIndex) {
  return normalizeMechanicsCommandEffects(effects).filter(
    (_effect, index) => index !== effectIndex
  );
}

export function createMechanicsCommandEffectsController({
  effects,
  onChange,
  variant,
}) {
  const safeEffects = normalizeMechanicsCommandEffects(effects);

  return {
    effects: safeEffects,
    addEffect() {
      onChange?.(
        addMechanicsCommandEffect(safeEffects, {
          type: variant.defaultType,
          idPrefix: variant.idPrefix,
        })
      );
    },
    patchEffect(effectIndex, patch) {
      onChange?.(patchMechanicsCommandEffect(safeEffects, effectIndex, patch));
    },
    removeEffect(effectIndex) {
      onChange?.(removeMechanicsCommandEffect(safeEffects, effectIndex));
    },
  };
}
