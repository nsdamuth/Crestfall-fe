"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import KitBadge from "@/components/kit/KitBadge";

function ArtThumb({ imageSrc, title }) {
  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="h-14 w-14 flex-none rounded-[var(--radius-md)] object-cover"
      />
    );
  }

  return (
    <div
      aria-label={title}
      className="flex h-14 w-14 flex-none items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]"
    >
      No art
    </div>
  );
}

export default function EditorHeaderView({
  imageSrc = null,
  title = "Untitled Creation",
  typeLabel = "",
  visibilityLabel = "",
  visibilityVariant = "status",
  hasUnsavedChanges = false,
  switcherLabel = "Switch creation",
  onOpenSwitcher = null,
}) {
  const [confirmingSwitch, setConfirmingSwitch] = useState(false);

  function activateSwitcher() {
    if (hasUnsavedChanges) {
      setConfirmingSwitch(true);
      return;
    }
    onOpenSwitcher?.();
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
      <div className="flex flex-wrap items-center gap-[var(--space-4)]">
        <ArtThumb imageSrc={imageSrc} title={title} />

        <div className="min-w-0 flex-1">
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {typeLabel}
          </p>
          <h1 className="mt-[var(--space-1)] truncate font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {title}
          </h1>
          {visibilityLabel ? (
            <div className="mt-[var(--space-2)]">
              <KitBadge label={visibilityLabel} variant={visibilityVariant} surface="canvas" />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={activateSwitcher}
          className="kit-focus flex min-h-[var(--control-md)] flex-none items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)]"
        >
          {switcherLabel}
          <ChevronsUpDown size={14} />
        </button>
      </div>

      {confirmingSwitch ? (
        <div className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-4)]">
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
            You have unsaved changes. Switch creations anyway?
          </p>
          <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
            <button
              type="button"
              onClick={() => setConfirmingSwitch(false)}
              className="cf-btn cf-btn--secondary"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmingSwitch(false);
                onOpenSwitcher?.();
              }}
              className="cf-btn cf-btn--primary"
            >
              Discard and switch
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
