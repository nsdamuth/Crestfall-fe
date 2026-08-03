"use client";

import { useCharacterTemplateBuilderViewModel } from "@/components/studio/create/character-template/character-template-builder/useCharacterTemplateBuilderViewModel";

export const CHARACTER_TEMPLATE_BUILDER_STEPS = Object.freeze([
  { id: "template", label: "Template" },
  { id: "identity", label: "Identity" },
  { id: "appearance", label: "Appearance" },
  { id: "body", label: "Body" },
  { id: "behavior", label: "Behavior" },
  { id: "review", label: "Review" },
]);

export function useCharacterTemplateBuilder(options) {
  const { compatibilityProps } =
    useCharacterTemplateBuilderViewModel(options);

  return compatibilityProps;
}
