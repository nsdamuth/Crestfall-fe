import { Crop, Eraser, Palette, Shirt } from "lucide-react";

import { ingredientSlotOptionalEmptyFixture, ingredientSlotSelectedFixture } from "../ingredient-slot/IngredientSlot.fixtures";

const noop = () => {};

export const regionEditQuickActions = [
  { id: "precise", label: "Precise edit", Icon: Palette },
  { id: "recolor", label: "Recolor", Icon: Palette },
  { id: "remove", label: "Remove", Icon: Eraser },
  { id: "crop", label: "Crop to region", Icon: Crop },
];

export const regionEditBarFilledFixture = {
  selectedSegmentLabel: "Outfit",
  promptValue: "Swap the court regalia for the traveling cloak, keep the gold trim.",
  quickActions: regionEditQuickActions,
  activeQuickActionId: "precise",
  ingredientSlot: {
    ...ingredientSlotSelectedFixture,
    label: "Outfit",
    title: "Traveling Cloak",
    subtitle: "Outfit, Private",
    SlotIcon: Shirt,
    clearLabel: "Clear Outfit",
    onOpenSlot: noop,
    onClearSlot: noop,
  },
  coinCostLabel: "3",
  coinBalanceLabel: "45",
  canApply: true,
  helpText: "The Outfit carries its own description. Only the region prompt is sent as new text.",
  onChangePrompt: noop,
  onSelectQuickAction: noop,
  onApply: noop,
};

export const regionEditBarEmptyFixture = {
  selectedSegmentLabel: "",
  promptValue: "",
  quickActions: regionEditQuickActions,
  activeQuickActionId: "",
  ingredientSlot: {
    ...ingredientSlotOptionalEmptyFixture,
    label: "Ingredient",
    SlotIcon: Shirt,
    onOpenSlot: noop,
    onClearSlot: noop,
  },
  coinCostLabel: "3",
  coinBalanceLabel: "45",
  canApply: false,
  helpText: "Choose a segment on the left to start a region edit.",
  onChangePrompt: noop,
  onSelectQuickAction: noop,
  onApply: noop,
};
