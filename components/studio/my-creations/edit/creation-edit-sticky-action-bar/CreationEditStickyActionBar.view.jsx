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
    <div className="sticky bottom-4 z-30 mt-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-4)] shadow-[var(--shadow-popover)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>

          <p className="mt-1 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Current:{" "}
            <span className="text-[var(--ink)]">{visibilityLabel}</span>
            {" · "}
            Status:{" "}
            <span className="text-[var(--ink)]">
              {lifecycleStatusLabel}
            </span>
            {" · "}
            Canon:{" "}
            <span className="text-[var(--ink)]">
              {canonStatusLabel}
            </span>
          </p>

          {editLockMessage ? (
            <p className="mt-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
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
              className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] tracking-[var(--track-label)] transition ${
                visibilityOption.active
                  ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {visibilityOption.label}
            </button>
          ))}

          {/* SKIPPED: the Public toggle's active-state color is semantic
              "success" green (emerald-*), which none of the eight rulings
              or thirteen families define a token for. Only its geometry
              converts; the color is left as-is rather than inventing a
              token out of scope for this pass. */}
          <button
            type="button"
            disabled={Boolean(publicVisibility?.disabled)}
            className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] tracking-[var(--track-label)] transition ${
              publicVisibility?.active
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)]"
            } disabled:cursor-not-allowed disabled:opacity-45`}
            title={publicVisibility?.title || undefined}
          >
            {publicVisibility?.label || "Public"}
          </button>

          <button
            type="button"
            disabled={Boolean(reviewAction?.disabled)}
            onClick={() => onOpenReviewActions?.()}
            className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {reviewAction?.label || "Review Actions"}
          </button>

          {unlistAction?.visible ? (
            <button
              type="button"
              disabled={Boolean(unlistAction.disabled)}
              onClick={() => onUnlistForEditing?.()}
              className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {getActionLabel(unlistAction)}
            </button>
          ) : null}

          {saveAction?.visible ? (
            <button
              type="button"
              disabled={Boolean(saveAction.disabled)}
              onClick={() => onSaveChanges?.()}
              className="inline-flex h-[var(--control-md)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-45"
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
              className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {getActionLabel(cancelReviewAction)}
            </button>
          ) : null}

          {/* Save confirmation, RULED (a1 advanced-creator pass): the
              status-token dot-plus-word treatment now shipping in the
              quick creates (components/studio/create/character/
              creator-stops/CreatorStops.view.jsx), read here only as
              a reference, not imported. Was raw Tailwind
              red-200/emerald-200 with no token, no dot, no aria-live. */}
          {saveFeedback?.message ? (
            <span
              role={saveFeedback.tone === "error" ? "alert" : undefined}
              aria-live="polite"
              className={`inline-flex basis-full items-center gap-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] ${
                saveFeedback.tone === "error"
                  ? "text-[var(--status-danger)]"
                  : "text-[var(--status-success)]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 flex-none rounded-full ${
                  saveFeedback.tone === "error"
                    ? "bg-[var(--status-danger)]"
                    : "bg-[var(--status-success)]"
                }`}
              />
              <span className="inline">{saveFeedback.message}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
