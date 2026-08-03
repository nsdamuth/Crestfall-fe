"use client";

import { useMemo, useState } from "react";

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
  formatMechanicsCommandResolutionSummary,
  isBooleanMechanicsCommandResolutionTargetProperty,
  isRollingMechanicsCommandResolutionMode,
  normalizeMechanicsCommandResolution,
} from "./mechanicsCommandResolutionNormalization.js";
import {
  addMechanicsCommandResolutionModifier,
  addMechanicsCommandResolutionModifierSource,
  applyMechanicsCommandResolutionReference,
  patchMechanicsCommandOpposedResolution,
  patchMechanicsCommandResolution,
  patchMechanicsCommandResolutionModifier,
  patchMechanicsCommandResolutionModifierSource,
  removeMechanicsCommandResolutionModifier,
  removeMechanicsCommandResolutionModifierSource,
} from "./mechanicsCommandResolutionOperations.js";

export default function useMechanicsCommandResolutionViewModel({
  resolution,
  argumentOptions = [],
  onChange,
}) {
  const [referenceId, setReferenceId] = useState("");
  const normalizedResolution = useMemo(
    () => normalizeMechanicsCommandResolution(resolution),
    [resolution]
  );

  function commit(nextResolution) {
    onChange?.(normalizeMechanicsCommandResolution(nextResolution));
  }

  function patchResolution(patch) {
    commit(patchMechanicsCommandResolution(normalizedResolution, patch));
  }

  function patchOpposed(patch) {
    commit(
      patchMechanicsCommandOpposedResolution(normalizedResolution, patch)
    );
  }

  function applyReference() {
    if (!referenceId) return;
    commit(
      applyMechanicsCommandResolutionReference(normalizedResolution, referenceId)
    );
    setReferenceId("");
  }

  function addModifier(side) {
    commit(addMechanicsCommandResolutionModifier(normalizedResolution, side));
  }

  function patchModifier(side, index, patch) {
    commit(
      patchMechanicsCommandResolutionModifier(
        normalizedResolution,
        side,
        index,
        patch
      )
    );
  }

  function removeModifier(side, index) {
    commit(
      removeMechanicsCommandResolutionModifier(
        normalizedResolution,
        side,
        index
      )
    );
  }

  function addModifierSource(side) {
    commit(
      addMechanicsCommandResolutionModifierSource(normalizedResolution, side)
    );
  }

  function patchModifierSource(side, index, patch) {
    commit(
      patchMechanicsCommandResolutionModifierSource(
        normalizedResolution,
        side,
        index,
        patch
      )
    );
  }

  function removeModifierSource(side, index) {
    commit(
      removeMechanicsCommandResolutionModifierSource(
        normalizedResolution,
        side,
        index
      )
    );
  }

  return {
    resolution: normalizedResolution,
    argumentOptions: Array.isArray(argumentOptions) ? argumentOptions : [],
    referenceId,
    referenceConfigurations: COMMAND_RESOLUTION_REFERENCE_CONFIGURATIONS,
    resolutionModes: COMMAND_RESOLUTION_MODES,
    rollModes: COMMAND_RESOLUTION_ROLL_MODES,
    tiePolicies: COMMAND_OPPOSED_TIE_POLICIES,
    modifierSourceTypes: COMMAND_RESOLUTION_MODIFIER_SOURCE_TYPES,
    modifierBuckets: COMMAND_RESOLUTION_MODIFIER_BUCKETS,
    modifierScopeModes: COMMAND_RESOLUTION_MODIFIER_SCOPE_MODES,
    targetProperties: COMMAND_RESOLUTION_TARGET_PROPERTIES,
    roundingModes: COMMAND_RESOLUTION_MODIFIER_ROUNDING,
    missingPolicies: COMMAND_RESOLUTION_MODIFIER_MISSING_POLICIES,
    summary: formatMechanicsCommandResolutionSummary(normalizedResolution),
    isRolling: isRollingMechanicsCommandResolutionMode(
      normalizedResolution.mode
    ),
    setReferenceId,
    applyReference,
    patchResolution,
    patchOpposed,
    addModifier,
    patchModifier,
    removeModifier,
    addModifierSource,
    patchModifierSource,
    removeModifierSource,
    isBooleanTargetProperty:
      isBooleanMechanicsCommandResolutionTargetProperty,
  };
}
