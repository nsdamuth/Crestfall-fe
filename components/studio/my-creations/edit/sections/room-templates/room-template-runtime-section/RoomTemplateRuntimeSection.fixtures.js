import {
  storyRulesCodexAttachmentsEmptyFixture,
  storyRulesCodexAttachmentsLegacyFixture,
  storyRulesCodexAttachmentsLongContentFixture,
  storyRulesCodexAttachmentsMissingCallbacksFixture,
  storyRulesCodexAttachmentsPopulatedFixture,
} from "@/components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.fixtures";

import {
  roomRegistryAttachmentsEmptyFixture,
  roomRegistryAttachmentsLegacyFixture,
  roomRegistryAttachmentsLongContentFixture,
  roomRegistryAttachmentsMissingCallbacksFixture,
  roomRegistryAttachmentsPopulatedFixture,
} from "@/components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.fixtures";

const BASE_COPY = {
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Runtime Context",
  sectionDescription:
    "Edit Story-specific Rules Codex attachments, registry attachments, and hidden runtime guidance. Story registries take priority over inherited Location registries.",
  privateGuidanceLabel: "Private Room Guidance",
  privateGuidancePlaceholder: "Optional hidden runtime notes for the Story.",
};

export const roomTemplateRuntimePopulatedFixture = {
  ...BASE_COPY,
  rulesCodexAttachments: storyRulesCodexAttachmentsPopulatedFixture,
  registryAttachments: roomRegistryAttachmentsPopulatedFixture,
  privateGuidance:
    "Keep the missing courier alive until the harbor confrontation, but do not reveal their identity before the second investigation beat.",
};

export const roomTemplateRuntimeEmptyFixture = {
  ...BASE_COPY,
  rulesCodexAttachments: storyRulesCodexAttachmentsEmptyFixture,
  registryAttachments: roomRegistryAttachmentsEmptyFixture,
  privateGuidance: "",
};

export const roomTemplateRuntimeGuidanceOnlyFixture = {
  ...BASE_COPY,
  rulesCodexAttachments: storyRulesCodexAttachmentsEmptyFixture,
  registryAttachments: roomRegistryAttachmentsEmptyFixture,
  privateGuidance:
    "Treat public rumors as unreliable until the players confirm them through direct investigation.",
};

export const roomTemplateRuntimeLegacyFixture = {
  ...BASE_COPY,
  rulesCodexAttachments: storyRulesCodexAttachmentsLegacyFixture,
  registryAttachments: roomRegistryAttachmentsLegacyFixture,
  privateGuidance: "Preserve the legacy Location Registry attachment.",
};

export const roomTemplateRuntimeLongContentFixture = {
  sectionEyebrow: "Story Editor Runtime Priority and Hidden Direction",
  sectionTitle:
    "Story Runtime Context for a Large Multi-Region Chronicle with Layered Registry Priority",
  sectionDescription:
    "A deliberately long explanation describing how Story-level registry attachments and hidden room guidance should shape a complex runtime while retaining inherited Location context when no direct Story override exists.",
  rulesCodexAttachments: storyRulesCodexAttachmentsLongContentFixture,
  registryAttachments: roomRegistryAttachmentsLongContentFixture,
  privateGuidance:
    "A deliberately long private guidance note used to stress the textarea, section spacing, and responsive layout. Keep every apparent faction alliance uncertain until the players verify it, allow registry NPCs to enter gradually rather than all at once, and avoid resolving the central mystery before the authored midpoint beat.",
};

export const roomTemplateRuntimeMissingCallbacksFixture = {
  ...BASE_COPY,
  rulesCodexAttachments: storyRulesCodexAttachmentsMissingCallbacksFixture,
  registryAttachments: roomRegistryAttachmentsMissingCallbacksFixture,
  privateGuidance: "This fixture intentionally provides no callbacks.",
  onChangePrivateGuidance: null,
};
