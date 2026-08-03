"use client";

import DefaultPlayerCharacterPickerModalView from "./default-player-character-picker/DefaultPlayerCharacterPickerModal.view";
import { useDefaultPlayerCharacterPickerViewModel } from "./default-player-character-picker/useDefaultPlayerCharacterPickerViewModel";

export default function DefaultPlayerCharacterPickerModal(props) {
  const viewProps = useDefaultPlayerCharacterPickerViewModel(props);

  return <DefaultPlayerCharacterPickerModalView {...viewProps} />;
}
