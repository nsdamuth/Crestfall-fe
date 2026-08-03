import { Archive, Trash2 } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

function getMessageClassName(tone) {
  return tone === "error" ? "text-red-200" : "text-emerald-200";
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
  archiveButtonLabel = "Archive Creation",
  archiveDisabled = false,
  archiveMessage = "",
  archiveMessageTone = "success",
  deleteTitle = "Delete Creation",
  deleteDescription = "",
  showDeleteRequirement = false,
  deleteRequirementMessage = "",
  deleteButtonLabel = "Delete Creation",
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
        <div className="mt-6 rounded-2xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {canonNoticeEyebrow}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {canonNoticeBody}
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
          <div className="flex items-start gap-4">
            <Archive className="mt-1 text-red-200" size={22} />

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-3xl text-red-100">
                {archiveTitle}
              </h3>

              <p className="mt-2 leading-7 text-red-100/75">
                {archiveDescription}
              </p>

              <button
                type="button"
                disabled={archiveDisabled}
                onClick={() => onArchive?.()}
                className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {archiveButtonLabel}
              </button>

              {archiveMessage ? (
                <p
                  className={`mt-4 text-sm ${getMessageClassName(
                    archiveMessageTone
                  )}`}
                >
                  {archiveMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-500/35 bg-red-950/25 p-5">
          <div className="flex items-start gap-4">
            <Trash2 className="mt-1 text-red-200" size={22} />

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-3xl text-red-100">
                {deleteTitle}
              </h3>

              <p className="mt-2 leading-7 text-red-100/75">
                {deleteDescription}
              </p>

              {showDeleteRequirement ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
                  {deleteRequirementMessage}
                </p>
              ) : null}

              <button
                type="button"
                disabled={deleteDisabled}
                onClick={() => onDelete?.()}
                className="mt-5 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteButtonLabel}
              </button>

              {deleteMessage ? (
                <p
                  className={`mt-4 text-sm ${getMessageClassName(
                    deleteMessageTone
                  )}`}
                >
                  {deleteMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
