const CANON_LOCKED_STATUSES = new Set([
  "OFFICIAL",
  "CANON",
  "ACCEPTED",
  "CANDIDATE",
]);

const DELETABLE_STATUSES = new Set(["DRAFT", "ARCHIVED"]);

const DEFAULT_COPY = Object.freeze({
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
});

function normalizeUppercase(value, fallback = "") {
  const normalized = String(value || fallback).trim().toUpperCase();
  return normalized || fallback;
}

export function normalizeCreationDangerLifecycleStatus(form = {}) {
  return normalizeUppercase(form?.reviewStatus || form?.status, "DRAFT");
}

export function isCreationDangerCanonLocked(canonStatus) {
  return CANON_LOCKED_STATUSES.has(
    normalizeUppercase(canonStatus, "NONE")
  );
}

function getArchiveButtonLabel({ archiveStatus, canonLocked, isArchived }) {
  if (archiveStatus === "saving") return "Archiving...";
  if (canonLocked) return "Canon Locked";
  if (isArchived) return "Archived";
  return "Archive Creation";
}

function getDeleteButtonLabel({ deleteStatus, canonLocked, canDelete }) {
  if (deleteStatus === "saving") return "Deleting...";
  if (canonLocked) return "Canon Locked";
  if (!canDelete) return "Archive Before Deleting";
  return "Delete Creation";
}

function getMessageTone(status) {
  return status === "error" ? "error" : "success";
}

export function getCreationDangerSectionViewProps({
  form = {},
  onArchive = null,
  archiveStatus = "idle",
  archiveMessage = "",
  onDelete = null,
  deleteStatus = "idle",
  deleteMessage = "",
} = {}) {
  const lifecycleStatus = normalizeCreationDangerLifecycleStatus(form);
  const canonLocked = isCreationDangerCanonLocked(form?.canonStatus);
  const isArchived = lifecycleStatus === "ARCHIVED";
  const canDelete = DELETABLE_STATUSES.has(lifecycleStatus) && !canonLocked;

  return {
    ...DEFAULT_COPY,
    showCanonNotice: canonLocked,
    showDeleteRequirement: !canDelete && !canonLocked,
    archiveButtonLabel: getArchiveButtonLabel({
      archiveStatus,
      canonLocked,
      isArchived,
    }),
    archiveDisabled:
      archiveStatus === "saving" || canonLocked || isArchived,
    archiveMessage,
    archiveMessageTone: getMessageTone(archiveStatus),
    deleteButtonLabel: getDeleteButtonLabel({
      deleteStatus,
      canonLocked,
      canDelete,
    }),
    deleteDisabled: deleteStatus === "saving" || !canDelete,
    deleteMessage,
    deleteMessageTone: getMessageTone(deleteStatus),
    onArchive: () => onArchive?.(),
    onDelete: () => onDelete?.(),
  };
}

export function useCreationDangerSectionViewModel(props = {}) {
  return getCreationDangerSectionViewProps(props);
}
