"use client";

import { useMemo } from "react";

import { MECHANICS_COMMAND_EFFECT_LIST_VARIANTS } from "./MechanicsCommandEffects.contract.js";
import { createMechanicsCommandEffectsController } from "./mechanicsCommandEffectsOperations.js";

export default function useMechanicsCommandEffectsViewModel({
  effects,
  onChange,
  variant = "BASE",
}) {
  const variantConfig =
    MECHANICS_COMMAND_EFFECT_LIST_VARIANTS[variant] ||
    MECHANICS_COMMAND_EFFECT_LIST_VARIANTS.BASE;

  return useMemo(
    () => ({
      variant: variantConfig,
      ...createMechanicsCommandEffectsController({
        effects,
        onChange,
        variant: variantConfig,
      }),
    }),
    [effects, onChange, variantConfig]
  );
}
