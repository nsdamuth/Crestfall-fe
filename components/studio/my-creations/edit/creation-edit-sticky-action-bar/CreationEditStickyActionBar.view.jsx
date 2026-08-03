"use client";

import { Save } from "lucide-react";

const EMPTY_ACTION = {
  visible: false,
  disabled: true,
  busy: false,
  label: "",
  busyLabel: "",
};

function getActionLabel(action) {
  if (action?.busy && action?.busyLabel) return action.busyLabel;
  return action?.label || "";
}

export default function CreationEditStickyActionBarView({
  eyebrow = "Visibility & Save",
  visibilityLabel = "",
  lifecycleStatusLabel = "",
  canonStatusLabel = "",
  editLockMessage = null,
  visibilityOptions = [],
  publicVisibility = {
    active: false,
    disabled: true,
    title: "",
    label: "Public",
  },
  reviewAction = {
    disabled: true,
    label: "Review Actions",
  },
  unlistAction = EMPTY_ACTION,
  saveAction = EMPTY_ACTION,
  cancelReviewAction = EMPTY_ACTION,
  saveFeedback = null,
  onSelectVisibility,
  onOpenReviewActions,
  onUnlistForEditing,
  onSaveChanges,
  onCancelReview,
}) {
  const safeVisibilityOptions = Array.isArray(visibilityOptions)
    ? visibilityOptions
    : [];

  return (
    <div className="sticky bottom-4 z-30 mt-8 rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706]/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Current:{" "}
            <span className="text-[var(--foreground)]">{visibilityLabel}</span>
            {" · "}
            Status:{" "}
            <span className="text-[var(--foreground)]">
              {lifecycleStatusLabel}
            </span>
            {" · "}
            Canon:{" "}
            <span className="text-[var(--foreground)]">
              {canonStatusLabel}
            </span>
          </p>

          {editLockMessage ? (
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              {editLockMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {safeVisibilityOptions.map((visibilityOption) => (
            <button
              key={visibilityOption.value}
              type="button"
              disabled={Boolean(visibilityOption.disabled)}
              onClick={() => onSelectVisibility?.(visibilityOption.value)}
              className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                visibilityOption.active
                  ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {visibilityOption.label}
            </button>
          ))}

          <button
            type="button"
            disabled={Boolean(publicVisibility?.disabled)}
            className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
              publicVisibility?.active
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                : "border-white/10 bg-black/30 text-[var(--muted)]"
            } disabled:cursor-not-allowed disabled:opacity-60`}
            title={publicVisibility?.title || undefined}
          >
            {publicVisibility?.label || "Public"}
          </button>

          <button
            type="button"
            disabled={Boolean(reviewAction?.disabled)}
            onClick={() => onOpenReviewActions?.()}
            className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewAction?.label || "Review Actions"}
          </button>

          {unlistAction?.visible ? (
            <button
              type="button"
              disabled={Boolean(unlistAction.disabled)}
              onClick={() => onUnlistForEditing?.()}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {getActionLabel(unlistAction)}
            </button>
          ) : null}

          {saveAction?.visible ? (
            <button
              type="button"
              disabled={Boolean(saveAction.disabled)}
              onClick={() => onSaveChanges?.()}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {getActionLabel(saveAction)}
            </button>
          ) : null}

          {cancelReviewAction?.visible ? (
            <button
              type="button"
              disabled={Boolean(cancelReviewAction.disabled)}
              onClick={() => onCancelReview?.()}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {getActionLabel(cancelReviewAction)}
            </button>
          ) : null}

          {saveFeedback?.message ? (
            <p
              className={`basis-full text-xs ${
                saveFeedback.tone === "error"
                  ? "text-red-200"
                  : "text-emerald-200"
              }`}
            >
              {saveFeedback.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
