"use client";

import VoiceModulePickerModalView from "./voice-module-picker/VoiceModulePickerModal.view";
import { useVoiceModulePickerModalViewModel } from "./voice-module-picker/useVoiceModulePickerModalViewModel";

export default function VoiceModulePickerModal(props) {
  const viewProps = useVoiceModulePickerModalViewModel(props);

  return <VoiceModulePickerModalView {...viewProps} />;
}
