"use client";

import CustomIngredientEditorView from "./custom-ingredient-editor/CustomIngredientEditor.view";
import { useCustomIngredientEditorViewModel } from "./custom-ingredient-editor/useCustomIngredientEditorViewModel";

export default function CustomIngredientEditor(props) {
  const viewProps = useCustomIngredientEditorViewModel(props);

  return <CustomIngredientEditorView {...viewProps} />;
}
