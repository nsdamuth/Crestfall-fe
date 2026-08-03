"use client";

import MechanicsCommandOutcomesView from "./MechanicsCommandOutcomes.view.jsx";
import useMechanicsCommandOutcomesViewModel from "./useMechanicsCommandOutcomesViewModel.js";

export default function MechanicsCommandOutcomes({
  outcomes,
  commandIndex,
  onPatchCommand,
  normalizeEffect,
  EffectCardComponent,
  argumentOptions,
  numericArgumentOptions,
}) {
  const viewModel = useMechanicsCommandOutcomesViewModel({
    outcomes,
    commandIndex,
    onPatchCommand,
    normalizeEffect,
  });

  return (
    <MechanicsCommandOutcomesView
      {...viewModel}
      EffectCardComponent={EffectCardComponent}
      argumentOptions={argumentOptions}
      numericArgumentOptions={numericArgumentOptions}
    />
  );
}
