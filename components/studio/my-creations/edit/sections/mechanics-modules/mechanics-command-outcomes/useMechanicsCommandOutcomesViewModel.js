"use client";

import { useMemo } from "react";

import { createMechanicsCommandOutcomesController } from "./mechanicsCommandOutcomesOperations.js";

export default function useMechanicsCommandOutcomesViewModel({
  outcomes,
  commandIndex,
  onPatchCommand,
  normalizeEffect,
}) {
  return useMemo(
    () =>
      createMechanicsCommandOutcomesController({
        outcomes,
        commandIndex,
        onPatchCommand,
        normalizeEffect,
      }),
    [outcomes, commandIndex, onPatchCommand, normalizeEffect]
  );
}
