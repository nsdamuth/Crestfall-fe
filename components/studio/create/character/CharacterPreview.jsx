"use client";

import CharacterPreviewView from "./character-preview/CharacterPreview.view";
import { useCharacterPreviewViewModel } from "./character-preview/useCharacterPreviewViewModel";

export default function CharacterPreview(props) {
  const viewProps = useCharacterPreviewViewModel(props);

  return <CharacterPreviewView {...viewProps} />;
}
