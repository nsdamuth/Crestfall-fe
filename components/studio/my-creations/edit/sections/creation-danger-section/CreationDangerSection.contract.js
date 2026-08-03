export const CREATION_DANGER_SECTION_VIEW_CONTRACT_VERSION =
  "creation-danger-section.view.v1";

export const CREATION_DANGER_SECTION_VIEW_CONTRACT = Object.freeze({
  copy: [
    "sectionEyebrow",
    "sectionTitle",
    "sectionDescription",
    "canonNoticeEyebrow",
    "canonNoticeBody",
    "archiveTitle",
    "archiveDescription",
    "deleteTitle",
    "deleteDescription",
    "deleteRequirementMessage",
  ],
  state: [
    "showCanonNotice",
    "showDeleteRequirement",
    "archiveButtonLabel",
    "archiveDisabled",
    "archiveMessage",
    "archiveMessageTone",
    "deleteButtonLabel",
    "deleteDisabled",
    "deleteMessage",
    "deleteMessageTone",
  ],
  callbacks: ["onArchive", "onDelete"],
});
