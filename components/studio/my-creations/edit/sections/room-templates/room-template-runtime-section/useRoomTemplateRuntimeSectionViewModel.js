"use client";

import { useRoomRegistryAttachmentsSectionViewModel } from "@/components/studio/create/room-template/room-registry-attachments-section/useRoomRegistryAttachmentsSectionViewModel";
import { useStoryRulesCodexAttachmentsSectionViewModel } from "@/components/studio/create/room-template/story-rules-codex-attachments-section/useStoryRulesCodexAttachmentsSectionViewModel";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Runtime Context",
  sectionDescription:
    "Edit Story-specific Rules Codex attachments, registry attachments, and hidden runtime guidance. Story registries take priority over inherited Location registries.",
  privateGuidanceLabel: "Private Room Guidance",
  privateGuidancePlaceholder: "Optional hidden runtime notes for the Story.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function useRoomTemplateRuntimeSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const data = normalizeObject(form?.data);
  const rulesCodexAttachments =
    useStoryRulesCodexAttachmentsSectionViewModel({
      data,
      updateDataField,
    });

  const registryAttachments = useRoomRegistryAttachmentsSectionViewModel({
    data,
    updateDataField,
    eyebrow: "Story Registries",
    title: "Story Registry Attachments",
    body:
      "Attach registries directly to this Story. When the Story starts, these become the room-level priority registry layer; NPC Registry entries remain available for later runtime-managed loading.",
  });

  return {
    viewProps: {
      ...DEFAULT_COPY,
      rulesCodexAttachments: rulesCodexAttachments.viewProps,
      registryAttachments: registryAttachments.viewProps,
      privateGuidance: data.private_room_guidance || "",
      onChangePrivateGuidance: (value) =>
        updateDataField?.("private_room_guidance", value),
    },
    rulesCodexPickerProps: rulesCodexAttachments.pickerProps,
    registryPickerProps: registryAttachments.pickerProps,
  };
}
