"use client";

import CharacterTemplateModalView from "@/components/studio/create/character/character-template-picker/CharacterTemplateModal.view";
import { useCharacterTemplateModalViewModel } from "@/components/studio/create/character/character-template-picker/useCharacterTemplateModalViewModel";

export default function CharacterTemplateModal(props) {
  const viewProps = useCharacterTemplateModalViewModel(props);

  return <CharacterTemplateModalView {...viewProps} />;
}
