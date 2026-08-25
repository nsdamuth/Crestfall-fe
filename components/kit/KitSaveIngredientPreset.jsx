"use client";

import KitSaveIngredientPresetView from "./save-ingredient-preset/KitSaveIngredientPreset.view";
import { useKitSaveIngredientPresetViewModel } from "./save-ingredient-preset/useKitSaveIngredientPresetViewModel";

export default function KitSaveIngredientPreset(props) {
  const viewProps = useKitSaveIngredientPresetViewModel(props);

  return <KitSaveIngredientPresetView {...viewProps} />;
}
