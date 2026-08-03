"use client";

import SaveIngredientPresetModalView from "./save-ingredient-preset/SaveIngredientPresetModal.view";
import { useSaveIngredientPresetViewModel } from "./save-ingredient-preset/useSaveIngredientPresetViewModel";

export default function SaveIngredientPresetModal(props) {
  const viewProps = useSaveIngredientPresetViewModel(props);

  return <SaveIngredientPresetModalView {...viewProps} />;
}
