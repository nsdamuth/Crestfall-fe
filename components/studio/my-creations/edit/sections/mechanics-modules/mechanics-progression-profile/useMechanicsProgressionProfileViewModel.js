"use client";

import { useMemo } from "react";

import {
  MECHANICS_PROGRESSION_CURVE_TYPES,
  MECHANICS_PROGRESSION_DERIVED_METHODS,
  MECHANICS_PROGRESSION_MAXIMUM_POLICIES,
  MECHANICS_PROGRESSION_MODES,
  MECHANICS_PROGRESSION_REQUIREMENT_MODES,
  MECHANICS_PROGRESSION_ROUNDING,
  generateMechanicsProgressionTable,
  normalizeMechanicsProgressionProfileBuilder,
  resolveMechanicsProgressionDerivedValue,
  summarizeMechanicsProgressionProfile,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  MECHANICS_PROGRESSION_PROFILE_PHASE,
  MECHANICS_PROGRESSION_PROFILE_STATUS,
  MECHANICS_PROGRESSION_PROFILE_STORAGE_PATHS,
  MECHANICS_PROGRESSION_PROFILE_VIEW_CONTRACT_VERSION,
} from "./MechanicsProgressionProfileFields.contract.js";
import {
  addMechanicsProgressionDerivedValue,
  addMechanicsProgressionOverride,
  patchMechanicsProgressionCurve,
  patchMechanicsProgressionDerivedValue,
  patchMechanicsProgressionOverride,
  patchMechanicsProgressionProfile,
  removeMechanicsProgressionDerivedValue,
  removeMechanicsProgressionOverride,
} from "./mechanicsProgressionProfileOperations.js";

export function useMechanicsProgressionProfileViewModel({
  profile = {},
  onChange = () => {},
} = {}) {
  const normalizedProfile = useMemo(
    () => normalizeMechanicsProgressionProfileBuilder(profile),
    [profile]
  );
  const summary = useMemo(
    () => summarizeMechanicsProgressionProfile(normalizedProfile),
    [normalizedProfile]
  );
  const activeDerivedValues = useMemo(
    () => normalizedProfile.derivedValues.filter((entry) => entry.enabled !== false),
    [normalizedProfile]
  );
  const previewRows = useMemo(
    () =>
      generateMechanicsProgressionTable(normalizedProfile)
        .slice(0, 100)
        .map((row) => ({
          ...row,
          derivedValues: activeDerivedValues.map((rule) => ({
            id: rule.id,
            value: resolveMechanicsProgressionDerivedValue(
              rule,
              row.rank,
              normalizedProfile.startingRank
            ),
          })),
        })),
    [activeDerivedValues, normalizedProfile]
  );

  function commit(nextProfile) {
    onChange(normalizeMechanicsProgressionProfileBuilder(nextProfile));
  }

  return {
    contractVersion: MECHANICS_PROGRESSION_PROFILE_VIEW_CONTRACT_VERSION,
    phase: MECHANICS_PROGRESSION_PROFILE_PHASE,
    status: MECHANICS_PROGRESSION_PROFILE_STATUS,
    storagePaths: MECHANICS_PROGRESSION_PROFILE_STORAGE_PATHS,
    profile: normalizedProfile,
    summary,
    previewRows,
    activeDerivedValues,
    modeOptions: MECHANICS_PROGRESSION_MODES,
    requirementModeOptions: MECHANICS_PROGRESSION_REQUIREMENT_MODES,
    curveTypeOptions: MECHANICS_PROGRESSION_CURVE_TYPES,
    maximumPolicyOptions: MECHANICS_PROGRESSION_MAXIMUM_POLICIES,
    derivedMethodOptions: MECHANICS_PROGRESSION_DERIVED_METHODS,
    roundingOptions: MECHANICS_PROGRESSION_ROUNDING,
    patchProfile: (patch) =>
      commit(patchMechanicsProgressionProfile(normalizedProfile, patch)),
    patchCurve: (patch) =>
      commit(patchMechanicsProgressionCurve(normalizedProfile, patch)),
    addOverride: () =>
      commit(addMechanicsProgressionOverride(normalizedProfile)),
    patchOverride: (index, patch) =>
      commit(
        patchMechanicsProgressionOverride(normalizedProfile, index, patch)
      ),
    removeOverride: (index) =>
      commit(removeMechanicsProgressionOverride(normalizedProfile, index)),
    addDerivedValue: () =>
      commit(addMechanicsProgressionDerivedValue(normalizedProfile)),
    patchDerivedValue: (index, patch) =>
      commit(
        patchMechanicsProgressionDerivedValue(normalizedProfile, index, patch)
      ),
    removeDerivedValue: (index) =>
      commit(
        removeMechanicsProgressionDerivedValue(normalizedProfile, index)
      ),
  };
}
