"use client";

import MechanicsModulePickerModal from "@/components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModulePickerModal";

import StoryRoomRuntimeMechanicsPanelView from "./story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.view";
import { useStoryRoomRuntimeMechanicsPanelViewModel } from "./story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel";

export default function StoryRoomRuntimeMechanicsPanel(props) {
  const { viewProps, pickerProps } =
    useStoryRoomRuntimeMechanicsPanelViewModel(props);

  const pickerContent = pickerProps ? (
    <MechanicsModulePickerModal {...pickerProps} />
  ) : null;

  return (
    <StoryRoomRuntimeMechanicsPanelView
      {...viewProps}
      pickerContent={pickerContent}
    />
  );
}
