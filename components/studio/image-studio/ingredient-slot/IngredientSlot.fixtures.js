import { MapPin, Shirt, Sparkles, Theater, Users } from "lucide-react";

const noOp = () => {};

export const ingredientSlotRequiredEmptyFixture = {
  label: "Character",
  SlotIcon: Users,
  isCustom: false,
  hasValue: false,
  requirementLabel: "required",
  title: "Select…",
  subtitle: "",
  clearLabel: "Clear Character",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotOptionalEmptyFixture = {
  label: "Location / Scene",
  SlotIcon: MapPin,
  isCustom: false,
  hasValue: false,
  requirementLabel: "optional",
  title: "Select…",
  subtitle: "",
  clearLabel: "Clear Location / Scene",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotSelectedFixture = {
  label: "Clothing Source",
  SlotIcon: Shirt,
  isCustom: false,
  hasValue: true,
  requirementLabel: "optional",
  title: "Midnight Court Formalwear",
  subtitle: "Wardrobe • 6 coordinated pieces",
  clearLabel: "Clear Clothing Source",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotCustomFixture = {
  label: "Pose",
  SlotIcon: Theater,
  isCustom: true,
  hasValue: true,
  requirementLabel: "custom",
  title: "Leaning against the balcony rail",
  subtitle: "Custom ingredient",
  clearLabel: "Clear Pose",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotNoSubtitleFixture = {
  label: "Rendering Preset",
  SlotIcon: Sparkles,
  isCustom: false,
  hasValue: true,
  requirementLabel: "optional",
  title: "Cinematic Dark Fantasy",
  subtitle: "",
  clearLabel: "Clear Rendering Preset",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotLongContentFixture = {
  label: "Location / Scene with an unusually long category label",
  SlotIcon: MapPin,
  isCustom: false,
  hasValue: true,
  requirementLabel: "optional",
  title:
    "The moonlit western observation gallery overlooking the storm-wrapped capital",
  subtitle:
    "Location • Upper Citadel • Restricted observatory and diplomatic reception wing",
  clearLabel:
    "Clear Location / Scene with an unusually long category label",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};

export const ingredientSlotMissingIconFixture = {
  label: "Unconfigured Ingredient",
  SlotIcon: null,
  isCustom: false,
  hasValue: false,
  requirementLabel: "optional",
  title: "Select…",
  subtitle: "",
  clearLabel: "Clear Unconfigured Ingredient",
  onOpenSlot: noOp,
  onClearSlot: noOp,
};
