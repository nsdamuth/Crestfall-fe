"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";

import StoryRulesCodexAttachmentsSectionView from "./story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.view";
import { useStoryRulesCodexAttachmentsSectionViewModel } from "./story-rules-codex-attachments-section/useStoryRulesCodexAttachmentsSectionViewModel";

export default function StoryRulesCodexAttachmentsSection(props) {
  const { viewProps, pickerProps } =
    useStoryRulesCodexAttachmentsSectionViewModel(props);

  return (
    <>
      <StoryRulesCodexAttachmentsSectionView {...viewProps} />
      {pickerProps ? (
        <RegistryLinkedCreationPickerModal {...pickerProps} />
      ) : null}
    </>
  );
}
