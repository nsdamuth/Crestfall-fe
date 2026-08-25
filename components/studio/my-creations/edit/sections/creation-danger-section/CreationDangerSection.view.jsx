import { useState } from "react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

function getMessageClassName(tone) {
  return tone === "error"
    ? "text-[var(--status-danger)]"
    : "text-[var(--status-success)]";
}

// 5.4 Danger Zone, REBUILT 22 Aug 2026 (ED1G SW2, D3): a quiet ghost
// row at rest, a ghost button carrying --status-danger TEXT beside a
// one-line tier 7 description, no red bed, no red border, no icon
// parade, no serif display title. Arming swaps the row in place to a
// confirm pair; the confirming button is the only filled danger
// surface (cf-btn--danger-filled), standard button size. Same local
// arm-then-call-once pattern as CreationPublishingSection's
// ConfirmableActionPanel.
function DangerRow({ label, description, note, disabled = false, onConfirm }) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Are you sure? This confirms: {label}
        </span>
        <span className="flex flex-none flex-wrap gap-[var(--space-3)]">
          <button
            type="button"
            className="cf-btn cf-btn--danger-filled"
            onClick={() => {
              setArmed(false);
              onConfirm?.();
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            className="cf-btn cf-btn--secondary"
            onClick={() => setArmed(false)}
          >
            Cancel
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setArmed(true)}
          className="cf-btn cf-btn--danger"
        >
          {label}
        </button>
        <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {description}
        </span>
      </div>
      {note ? (
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export default function CreationDangerSectionView({
  sectionEyebrow = "Danger Zone",
  sectionTitle = "Archive or Delete",
  sectionDescription = "",
  showCanonNotice = false,
  canonNoticeEyebrow = "Canon Locked",
  canonNoticeBody = "",
  archiveTitle = "Archive Creation",
  archiveDescription = "",
  archiveButtonLabel = "Archive creation",
  archiveDisabled = false,
  archiveMessage = "",
  archiveMessageTone = "success",
  deleteTitle = "Delete Creation",
  deleteDescription = "",
  showDeleteRequirement = false,
  deleteRequirementMessage = "",
  deleteButtonLabel = "Delete creation",
  deleteDisabled = false,
  deleteMessage = "",
  deleteMessageTone = "success",
  onArchive = null,
  onDelete = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {showCanonNotice ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          <span className="text-[var(--gold-ornament)]">{canonNoticeEyebrow}: </span>
          {canonNoticeBody}
        </p>
      ) : null}

      <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-4)]">
        <div>
          <DangerRow
            label={archiveButtonLabel}
            description={archiveDescription}
            disabled={archiveDisabled}
            onConfirm={() => onArchive?.()}
          />
          {archiveMessage ? (
            <p
              className={`mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${getMessageClassName(
                archiveMessageTone
              )}`}
            >
              {archiveMessage}
            </p>
          ) : null}
        </div>

        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <DangerRow
            label={deleteButtonLabel}
            description={deleteDescription}
            note={showDeleteRequirement ? deleteRequirementMessage : null}
            disabled={deleteDisabled}
            onConfirm={() => onDelete?.()}
          />
          {deleteMessage ? (
            <p
              className={`mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${getMessageClassName(
                deleteMessageTone
              )}`}
            >
              {deleteMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
