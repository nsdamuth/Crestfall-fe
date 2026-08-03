import {
  createMechanicsProgressionDerivedValue,
  normalizeMechanicsProgressionProfileBuilder,
} from "../mechanicsProgressionProfileBuilder.js";

export function patchMechanicsProgressionProfile(profile, patch = {}) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return normalizeMechanicsProgressionProfileBuilder({
    ...safe,
    ...patch,
  });
}

export function patchMechanicsProgressionCurve(profile, patch = {}) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    curve: {
      ...safe.curve,
      ...patch,
    },
  });
}

export function addMechanicsProgressionOverride(profile) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    overrides: [
      ...safe.overrides,
      {
        id: `override_${safe.overrides.length + 1}`,
        rank: Math.min(
          safe.endingRank,
          safe.startingRank + safe.overrides.length + 2
        ),
        requirement: null,
        totalRequirement: null,
      },
    ],
  });
}

export function patchMechanicsProgressionOverride(
  profile,
  overrideIndex,
  patch = {}
) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    overrides: safe.overrides.map((entry, index) =>
      index === overrideIndex ? { ...entry, ...patch } : entry
    ),
  });
}

export function removeMechanicsProgressionOverride(profile, overrideIndex) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    overrides: safe.overrides.filter((_entry, index) => index !== overrideIndex),
  });
}

export function addMechanicsProgressionDerivedValue(profile) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    derivedValues: [
      ...safe.derivedValues,
      createMechanicsProgressionDerivedValue(safe.derivedValues.length),
    ],
  });
}

export function patchMechanicsProgressionDerivedValue(
  profile,
  derivedIndex,
  patch = {}
) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    derivedValues: safe.derivedValues.map((entry, index) =>
      index === derivedIndex ? { ...entry, ...patch } : entry
    ),
  });
}

export function removeMechanicsProgressionDerivedValue(profile, derivedIndex) {
  const safe = normalizeMechanicsProgressionProfileBuilder(profile);
  return patchMechanicsProgressionProfile(safe, {
    derivedValues: safe.derivedValues.filter(
      (_entry, index) => index !== derivedIndex
    ),
  });
}
