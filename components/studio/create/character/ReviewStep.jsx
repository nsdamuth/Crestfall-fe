"use client";

import AdvancedPromptingEditor from "@/components/studio/characters/advanced-prompting/AdvancedPromptingEditor";
import CharacterReviewStepView from "@/components/studio/create/character/review-step/CharacterReviewStep.view";
import useCharacterReviewStepViewModel from "@/components/studio/create/character/review-step/useCharacterReviewStepViewModel";

export default function ReviewStep(props) {
  const { viewProps, advancedPromptingProps } =
    useCharacterReviewStepViewModel(props);

  return (
    <CharacterReviewStepView
      {...viewProps}
      advancedPromptingContent={
        <AdvancedPromptingEditor {...advancedPromptingProps} />
      }
    />
  );
}
