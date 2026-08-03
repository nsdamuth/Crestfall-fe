"use client";

import AdvancedPromptingEditor from "@/components/studio/characters/advanced-prompting/AdvancedPromptingEditor";

import CharacterAdvancedSectionView from "./character-advanced-section/CharacterAdvancedSection.view";
import { useCharacterAdvancedSectionViewModel } from "./character-advanced-section/useCharacterAdvancedSectionViewModel";

export default function AdvancedSection(props) {
  const viewProps = useCharacterAdvancedSectionViewModel(props);

  return (
    <CharacterAdvancedSectionView
      {...viewProps}
      advancedPromptingControl={
        <AdvancedPromptingEditor
          value={viewProps.creatorDirectivesValue}
          onChange={viewProps.onChangeCreatorDirectives}
        />
      }
    />
  );
}
