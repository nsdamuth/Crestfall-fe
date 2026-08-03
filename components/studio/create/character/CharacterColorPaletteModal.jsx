"use client";

import CharacterColorPaletteModalView from "./character-color-palette/CharacterColorPaletteModal.view";
import { useCharacterColorPaletteModalViewModel } from "./character-color-palette/useCharacterColorPaletteModalViewModel";

export default function CharacterColorPaletteModal(props) {
  const viewProps = useCharacterColorPaletteModalViewModel(props);

  return <CharacterColorPaletteModalView {...viewProps} />;
}
