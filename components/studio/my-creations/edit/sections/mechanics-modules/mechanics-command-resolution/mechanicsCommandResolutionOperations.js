import {
  buildMechanicsCommandResolutionReference,
  createMechanicsCommandResolutionModifier,
  createMechanicsCommandResolutionModifierSource,
  normalizeMechanicsCommandResolution,
  normalizeMechanicsCommandResolutionModifier,
  normalizeMechanicsCommandResolutionModifierSource,
} from "./mechanicsCommandResolutionNormalization.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sideValue(resolution, side) {
  return side === "OPPOSITION"
    ? asObject(resolution.opposed)
    : resolution;
}

function replaceSide(resolution, side, patch) {
  if (side === "OPPOSITION") {
    return normalizeMechanicsCommandResolution({
      ...resolution,
      opposed: {
        ...asObject(resolution.opposed),
        ...patch,
      },
    });
  }

  return normalizeMechanicsCommandResolution({
    ...resolution,
    ...patch,
  });
}

export function patchMechanicsCommandResolution(resolution, patch) {
  return normalizeMechanicsCommandResolution({
    ...normalizeMechanicsCommandResolution(resolution),
    ...asObject(patch),
  });
}

export function replaceMechanicsCommandResolution(nextResolution) {
  return normalizeMechanicsCommandResolution(nextResolution);
}

export function patchMechanicsCommandOpposedResolution(resolution, patch) {
  const current = normalizeMechanicsCommandResolution(resolution);
  return normalizeMechanicsCommandResolution({
    ...current,
    opposed: {
      ...asObject(current.opposed),
      ...asObject(patch),
    },
  });
}

export function applyMechanicsCommandResolutionReference(resolution, id) {
  const reference = buildMechanicsCommandResolutionReference(id);
  return reference || normalizeMechanicsCommandResolution(resolution);
}

export function addMechanicsCommandResolutionModifier(resolution, side = "ACTOR") {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);
  const modifiers = asArray(target.modifiers);

  return replaceSide(current, side, {
    modifiers: [
      ...modifiers,
      createMechanicsCommandResolutionModifier(modifiers.length),
    ],
  });
}

export function patchMechanicsCommandResolutionModifier(
  resolution,
  side,
  modifierIndex,
  patch
) {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);
  const modifiers = asArray(target.modifiers).map((modifier, index) =>
    index === modifierIndex
      ? normalizeMechanicsCommandResolutionModifier(
          {
            ...modifier,
            ...asObject(patch),
          },
          index
        )
      : modifier
  );

  return replaceSide(current, side, { modifiers });
}

export function removeMechanicsCommandResolutionModifier(
  resolution,
  side,
  modifierIndex
) {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);

  return replaceSide(current, side, {
    modifiers: asArray(target.modifiers).filter(
      (_modifier, index) => index !== modifierIndex
    ),
  });
}

export function addMechanicsCommandResolutionModifierSource(
  resolution,
  side = "ACTOR"
) {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);
  const sources = asArray(target.modifierSources);

  return replaceSide(current, side, {
    modifierSources: [
      ...sources,
      createMechanicsCommandResolutionModifierSource(
        "MECHANICS_VALUE",
        sources.length
      ),
    ],
  });
}

export function patchMechanicsCommandResolutionModifierSource(
  resolution,
  side,
  sourceIndex,
  patch
) {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);
  const modifierSources = asArray(target.modifierSources).map((source, index) =>
    index === sourceIndex
      ? normalizeMechanicsCommandResolutionModifierSource(
          {
            ...source,
            ...asObject(patch),
          },
          index
        )
      : source
  );

  return replaceSide(current, side, { modifierSources });
}

export function removeMechanicsCommandResolutionModifierSource(
  resolution,
  side,
  sourceIndex
) {
  const current = normalizeMechanicsCommandResolution(resolution);
  const target = sideValue(current, side);

  return replaceSide(current, side, {
    modifierSources: asArray(target.modifierSources).filter(
      (_source, index) => index !== sourceIndex
    ),
  });
}
