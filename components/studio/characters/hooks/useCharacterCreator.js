"use client";

import { useCharacterCreatorViewModel } from "@/components/studio/create/character/character-creator/useCharacterCreatorViewModel";

// Compatibility adapter for any legacy caller that still consumes the original
// flat hook result. New LOOM callers should use useCharacterCreatorViewModel.
export function useCharacterCreator(options) {
  const { viewProps, applicationContentProps } =
    useCharacterCreatorViewModel(options);

  return {
    ...viewProps,
    ...applicationContentProps,
    setActiveStep: viewProps.onSelectStep,
    goBack: viewProps.onBack,
    goNext: viewProps.onNext,
    finishDraft: viewProps.onSave,
  };
}
