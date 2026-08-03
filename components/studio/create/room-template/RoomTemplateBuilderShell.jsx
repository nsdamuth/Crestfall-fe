"use client";

import RoomTemplatePickerModal from "@/components/studio/room-templates/RoomTemplatePickerModal";
import RoomRegistryAttachmentsSection from "@/components/studio/create/room-template/RoomRegistryAttachmentsSection";
import StoryRulesCodexAttachmentsSection from "@/components/studio/create/room-template/StoryRulesCodexAttachmentsSection";

import RoomTemplateBuilderView from "./room-template-builder/RoomTemplateBuilder.view";
import { useRoomTemplateBuilderViewModel } from "./room-template-builder/useRoomTemplateBuilderViewModel";

export default function RoomTemplateBuilderShell(props) {
  const { viewProps, applicationContentProps } =
    useRoomTemplateBuilderViewModel(props);
  const { form, updateField, pickerProps } = applicationContentProps;

  return (
    <>
      <RoomTemplateBuilderView
        {...viewProps}
        runtimeAttachmentsContent={
          <>
            <StoryRulesCodexAttachmentsSection
              data={form}
              updateDataField={updateField}
            />

            <RoomRegistryAttachmentsSection
              data={form}
              updateDataField={updateField}
              eyebrow="Story Registries"
              title="Story Registry Attachments"
              body="Attach registries directly to this Story. These become the Story-level priority registry layer when the Story is played."
            />
          </>
        }
      />

      {pickerProps ? <RoomTemplatePickerModal {...pickerProps} /> : null}
    </>
  );
}
