"use client";

import MechanicsProgressionProfileFields from "../mechanics-progression-profile/MechanicsProgressionProfileFields";
import MechanicsCommandEffectCardView from "./MechanicsCommandEffectCard.view.jsx";
import MechanicsCommandEffectsView from "./MechanicsCommandEffects.view.jsx";
import useMechanicsCommandEffectsViewModel from "./useMechanicsCommandEffectsViewModel.js";

export function MechanicsCommandEffectCard({
  effect,
  effectIndex,
  outcome,
  eyebrow,
  argumentOptions,
  numericArgumentOptions,
  onPatch,
  onRemove,
}) {
  return (
    <MechanicsCommandEffectCardView
      effect={effect}
      effectIndex={effectIndex}
      eyebrow={eyebrow || (outcome ? `${outcome.replaceAll("_", " ")} Effect` : "Effect")}
      argumentOptions={argumentOptions}
      numericArgumentOptions={numericArgumentOptions}
      patchEffect={onPatch}
      removeEffect={onRemove}
      ProgressionProfileFieldsComponent={MechanicsProgressionProfileFields}
    />
  );
}

export default function MechanicsCommandEffects(props) {
  const viewModel = useMechanicsCommandEffectsViewModel(props);
  return (
    <MechanicsCommandEffectsView
      {...viewModel}
      argumentOptions={props.argumentOptions}
      numericArgumentOptions={props.numericArgumentOptions}
      EffectCardComponent={MechanicsCommandEffectCard}
    />
  );
}
