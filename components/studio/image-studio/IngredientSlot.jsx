"use client";

import IngredientSlotView from "./ingredient-slot/IngredientSlot.view";
import { useIngredientSlotViewModel } from "./ingredient-slot/useIngredientSlotViewModel";

export default function IngredientSlot(props) {
  const viewProps = useIngredientSlotViewModel(props);

  return <IngredientSlotView {...viewProps} />;
}
