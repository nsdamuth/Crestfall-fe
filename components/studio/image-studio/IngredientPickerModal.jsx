"use client";

import IngredientPickerModalView from "./ingredient-picker/IngredientPickerModal.view";
import { useIngredientPickerViewModel } from "./ingredient-picker/useIngredientPickerViewModel";

export default function IngredientPickerModal(props) {
  const viewProps = useIngredientPickerViewModel(props);

  return <IngredientPickerModalView {...viewProps} />;
}
