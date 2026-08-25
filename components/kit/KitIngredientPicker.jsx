"use client";

import KitIngredientPickerView from "./ingredient-picker/KitIngredientPicker.view";
import { useKitIngredientPickerViewModel } from "./ingredient-picker/useKitIngredientPickerViewModel";

export default function KitIngredientPicker(props) {
  const viewProps = useKitIngredientPickerViewModel(props);

  return <KitIngredientPickerView {...viewProps} />;
}
