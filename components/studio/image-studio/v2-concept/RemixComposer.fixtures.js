import { MapPin, Shirt, Users } from "lucide-react";

import {
  ingredientSlotOptionalEmptyFixture,
  ingredientSlotRequiredEmptyFixture,
  ingredientSlotSelectedFixture,
} from "../ingredient-slot/IngredientSlot.fixtures";

const noop = () => {};

const characterTile = (title, subtitle) => ({
  ...ingredientSlotSelectedFixture,
  label: "Character",
  title,
  subtitle,
  SlotIcon: Users,
  clearLabel: `Clear ${title}`,
  onOpenSlot: noop,
  onClearSlot: noop,
});

const outfitTile = (title) => ({
  ...(title ? ingredientSlotSelectedFixture : ingredientSlotOptionalEmptyFixture),
  label: "Outfit",
  title: title || "Select…",
  subtitle: title ? "Outfit" : "",
  SlotIcon: Shirt,
  clearLabel: "Clear Outfit",
  onOpenSlot: noop,
  onClearSlot: noop,
});

export const remixRatioField = {
  label: "Aspect Ratio",
  value: "LANDSCAPE_16_9",
  options: [
    { value: "PORTRAIT_4_5", label: "Portrait 4:5" },
    { value: "LANDSCAPE_16_9", label: "16:9" },
    { value: "SQUARE_1_1", label: "1:1" },
  ],
  onChange: noop,
};

export const remixComposerFilledFixture = {
  title: "Remix a Scene",
  characterSlots: [
    { id: "c1", character: characterTile("Seraphine Vale", "Character, Canon"), outfit: outfitTile("Court Regalia") },
    { id: "c2", character: characterTile("Brother Aldous", "Character, Internal"), outfit: outfitTile("") },
  ],
  maxCharacters: 4,
  canAddCharacter: true,
  locationSlot: {
    ...ingredientSlotSelectedFixture,
    label: "Location",
    title: "Moonlit Upper Gallery",
    subtitle: "Location, Public",
    SlotIcon: MapPin,
    clearLabel: "Clear Location",
    onOpenSlot: noop,
    onClearSlot: noop,
  },
  directionValue:
    "Seraphine confronts Aldous at the balustrade. Cold moonlight from the left, candle glow behind them.",
  ratioField: remixRatioField,
  manifest: [
    { id: "m1", role: "Character 1", name: "Seraphine Vale" },
    { id: "m2", role: "Outfit for Character 1", name: "Court Regalia" },
    { id: "m3", role: "Character 2", name: "Brother Aldous" },
    { id: "m4", role: "Outfit for Character 2", name: "Character default" },
    { id: "m5", role: "Location", name: "Moonlit Upper Gallery" },
  ],
  coinBalanceLabel: "45",
  coinCostLabel: "8",
  canRemix: true,
  helpText: "",
  onAddCharacter: noop,
  onChangeDirection: noop,
  onRemix: noop,
};

export const remixComposerEmptyFixture = {
  ...remixComposerFilledFixture,
  characterSlots: [
    {
      id: "c1",
      character: { ...ingredientSlotRequiredEmptyFixture, label: "Character", SlotIcon: Users, onOpenSlot: noop, onClearSlot: noop },
      outfit: outfitTile(""),
    },
    {
      id: "c2",
      character: { ...ingredientSlotRequiredEmptyFixture, label: "Character", SlotIcon: Users, onOpenSlot: noop, onClearSlot: noop },
      outfit: outfitTile(""),
    },
  ],
  locationSlot: {
    ...ingredientSlotRequiredEmptyFixture,
    label: "Location",
    SlotIcon: MapPin,
    onOpenSlot: noop,
    onClearSlot: noop,
  },
  directionValue: "",
  manifest: [],
  canRemix: false,
  helpText: "Select at least two Characters and one Location to remix.",
};
