"use client";

import { useMemo } from "react";

import {
  normalizeMechanicsGuards,
  summarizeMechanicsGuard,
} from "./mechanicsGuardsNormalization.js";
import {
  addMechanicsGuard,
  addMechanicsGuardCondition,
  patchMechanicsGuard,
  patchMechanicsGuardCondition,
  removeMechanicsGuard,
  removeMechanicsGuardCondition,
} from "./mechanicsGuardsOperations.js";

export default function useMechanicsGuardsViewModel({ guards, onChange, foldSignal }) {
  const normalized = useMemo(() => normalizeMechanicsGuards(guards), [guards]);

  function commit(nextGuards) {
    onChange?.(normalizeMechanicsGuards(nextGuards));
  }

  return {
    guards: normalized.map((guard, index) => ({
      ...guard,
      summary: summarizeMechanicsGuard(guard, index),
    })),
    foldSignal,
    addGuard() {
      commit(addMechanicsGuard(normalized));
    },
    patchGuard(guardIndex, patch) {
      commit(patchMechanicsGuard(normalized, guardIndex, patch));
    },
    removeGuard(guardIndex) {
      commit(removeMechanicsGuard(normalized, guardIndex));
    },
    addCondition(guardIndex) {
      commit(addMechanicsGuardCondition(normalized, guardIndex));
    },
    patchCondition(guardIndex, conditionIndex, patch) {
      commit(
        patchMechanicsGuardCondition(
          normalized,
          guardIndex,
          conditionIndex,
          patch
        )
      );
    },
    removeCondition(guardIndex, conditionIndex) {
      commit(
        removeMechanicsGuardCondition(normalized, guardIndex, conditionIndex)
      );
    },
  };
}
