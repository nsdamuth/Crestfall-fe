const sharedCopy = {
  sectionEyebrow: "Danger Zone",
  sectionTitle: "Archive or Delete",
  sectionDescription:
    "Destructive and lifecycle actions live here deliberately, not on compact cards.",
  canonNoticeEyebrow: "Canon Locked",
  canonNoticeBody:
    "Canon creations are preserved as part of Crestfall continuity. They cannot be archived or deleted from owner tools.",
  archiveTitle: "Archive Creation",
  archiveDescription:
    "Archiving hides this creation from active workflows while keeping the record available to you.",
  deleteTitle: "Delete Creation",
  deleteDescription:
    "Permanently deletes this creation. This is only available for non-canon draft or archived creations.",
  deleteRequirementMessage:
    "This creation must be a draft or archived before it can be deleted.",
};

export const creationDangerSectionDraftFixture = {
  ...sharedCopy,
  showCanonNotice: false,
  showDeleteRequirement: false,
  archiveButtonLabel: "Archive Creation",
  archiveDisabled: false,
  archiveMessage: "",
  archiveMessageTone: "success",
  deleteButtonLabel: "Delete Creation",
  deleteDisabled: false,
  deleteMessage: "",
  deleteMessageTone: "success",
};

export const creationDangerSectionApprovedFixture = {
  ...creationDangerSectionDraftFixture,
  showDeleteRequirement: true,
  deleteButtonLabel: "Archive Before Deleting",
  deleteDisabled: true,
};

export const creationDangerSectionArchivedFixture = {
  ...creationDangerSectionDraftFixture,
  archiveButtonLabel: "Archived",
  archiveDisabled: true,
  archiveMessage: "Archived.",
};

export const creationDangerSectionCanonLockedFixture = {
  ...creationDangerSectionApprovedFixture,
  showCanonNotice: true,
  showDeleteRequirement: false,
  archiveButtonLabel: "Canon Locked",
  archiveDisabled: true,
  deleteButtonLabel: "Canon Locked",
  deleteDisabled: true,
};

export const creationDangerSectionSavingFixture = {
  ...creationDangerSectionDraftFixture,
  archiveButtonLabel: "Archiving...",
  archiveDisabled: true,
  deleteButtonLabel: "Deleting...",
  deleteDisabled: true,
};

export const creationDangerSectionErrorFixture = {
  ...creationDangerSectionDraftFixture,
  archiveMessage: "Creation could not be archived.",
  archiveMessageTone: "error",
  deleteMessage: "Creation could not be deleted.",
  deleteMessageTone: "error",
};

export const creationDangerSectionMissingCallbacksFixture = {
  ...creationDangerSectionDraftFixture,
  onArchive: null,
  onDelete: null,
};
