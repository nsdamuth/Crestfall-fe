"use client";

import SelectedCharactersPanelView from "./selected-characters-panel/SelectedCharactersPanel.view";
import { useSelectedCharactersPanelViewModel } from "./selected-characters-panel/useSelectedCharactersPanelViewModel";

export default function SelectedCharactersPanel(props) {
  const viewProps = useSelectedCharactersPanelViewModel(props);

  return <SelectedCharactersPanelView {...viewProps} />;
}
