"use client";

import { Loader2, Save } from "lucide-react";

function statusWord(saveStatus, saveMessage) {
  if (saveStatus === "saving") return "Saving...";
  if (saveStatus === "error") {
    return saveMessage || "Your changes could not be saved. Please try again.";
  }
  return "Unsaved changes";
}

export default function EditorSaveBarView({
  hasUnsavedChanges = false,
  saveStatus = "idle",
  saveMessage = "",
  onSave = null,
  onDiscard = null,
}) {
  // Visibility law, ED1B (contract 2.0.0): dirty, saving, or a
  // failed save. A clean form after a successful save hides the bar.
  const isSaving = saveStatus === "saving";
  const isError = saveStatus === "error";
  const isVisible = hasUnsavedChanges || isSaving || isError;
  if (!isVisible) return null;

  return (
    <div className="sticky top-[var(--topbar-h)] z-20 mb-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-3)] px-[var(--space-4)] py-[var(--space-3)] shadow-[var(--shadow-popover)]">
      <span
        role={isError ? "alert" : undefined}
        aria-live="polite"
        className={`flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
          isError ? "text-[var(--status-danger)]" : "text-[var(--ink-dim)]"
        }`}
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : null}
        {statusWord(saveStatus, saveMessage)}
      </span>

      <div className="flex items-center gap-[var(--space-2)]">
        {hasUnsavedChanges ? (
          <button
            type="button"
            onClick={() => onDiscard?.()}
            className="kit-focus cf-btn cf-btn--secondary"
          >
            Discard
          </button>
        ) : null}
        <button
          type="button"
          disabled={!hasUnsavedChanges || isSaving}
          onClick={() => onSave?.()}
          className="kit-focus cf-btn cf-btn--primary"
        >
          <Save size={14} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
