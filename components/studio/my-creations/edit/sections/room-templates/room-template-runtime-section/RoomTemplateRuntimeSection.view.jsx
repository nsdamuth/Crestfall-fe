import RoomRegistryAttachmentsSectionView from "@/components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.view";
import StoryRulesCodexAttachmentsSectionView from "@/components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.view";
import {
  SectionTitle,
  TextAreaField,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function RoomTemplateRuntimeSectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Story Runtime Context",
  sectionDescription =
    "Edit Story-specific Rules Codex attachments, registry attachments, and hidden runtime guidance. Story registries take priority over inherited Location registries.",
  rulesCodexAttachments = {},
  registryAttachments = {},
  privateGuidanceLabel = "Private Room Guidance",
  privateGuidance = "",
  privateGuidancePlaceholder = "Optional hidden runtime notes for the Story.",
  onChangePrivateGuidance = null,
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-6">
        <StoryRulesCodexAttachmentsSectionView
          {...(rulesCodexAttachments || {})}
        />

        <RoomRegistryAttachmentsSectionView
          {...(registryAttachments || {})}
        />

        <TextAreaField
          label={privateGuidanceLabel}
          value={privateGuidance}
          onChange={(value) => onChangePrivateGuidance?.(value)}
          placeholder={privateGuidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}
