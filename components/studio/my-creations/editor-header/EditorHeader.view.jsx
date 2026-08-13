"use client";

import { useState } from "react";
import { ChevronsUpDown, ImageOff, List } from "lucide-react";

import KitBadge from "@/components/kit/KitBadge";

function ArtFrame({ imageSrc, typeIcon: TypeIcon }) {
  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="aspect-[3/4] w-[72px] flex-none rounded-[var(--radius-md)] border border-[var(--line)] object-cover sm:w-[132px]"
      />
    );
  }

  const Icon = TypeIcon || ImageOff;

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[3/4] w-[72px] flex-none items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-faint)] sm:w-[132px]"
    >
      <Icon size={24} />
    </div>
  );
}

function SwitcherButton({ label, onActivate, className = "" }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className={`kit-focus items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition hover:border-[var(--gold-action)] min-h-[var(--control-md)] ${className}`}
    >
      {label}
      <ChevronsUpDown size={14} aria-hidden="true" />
    </button>
  );
}

export default function EditorHeaderView({
  imageSrc = null,
  title = "Untitled Creation",
  typeLabel = "",
  typeIcon = null,
  visibilityLabel = "",
  visibilityVariant = "status",
  hasUnsavedChanges = false,
  switcherLabel = "Switch creation",
  onOpenSwitcher = null,
  onOpenSections = null,
  actions = null,
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
    <header>
      <div className="flex items-start gap-[var(--space-4)] sm:gap-[var(--space-5)]">
        <ArtFrame imageSrc={imageSrc} typeIcon={typeIcon} />

        <div className="min-w-0 flex-1">
          {typeLabel ? (
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {typeLabel}
            </p>
          ) : null}
          <h1 className="mt-[var(--space-1)] line-clamp-2 font-display text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--ink)] [text-wrap:balance] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]">
            {title}
          </h1>
          <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-2)]">
            {visibilityLabel ? (
              <KitBadge label={visibilityLabel} variant={visibilityVariant} surface="canvas" />
            ) : null}
            {actions}
          </div>
        </div>

        <div className="hidden flex-none items-center gap-[var(--space-2)] sm:flex">
          {onOpenSections ? (
            <button
              type="button"
              onClick={() => onOpenSections?.()}
              className="kit-focus hidden min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition hover:border-[var(--gold-action)] sm:flex lg:hidden"
            >
              <List size={14} aria-hidden="true" />
              Sections
            </button>
          ) : null}
          <SwitcherButton label={switcherLabel} onActivate={activateSwitcher} className="flex" />
        </div>
      </div>

      <div
        className={`mt-[var(--space-3)] grid gap-[var(--space-2)] sm:hidden ${
          onOpenSections ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <SwitcherButton label={switcherLabel} onActivate={activateSwitcher} className="flex" />
        {onOpenSections ? (
          <button
            type="button"
            onClick={() => onOpenSections?.()}
            className="kit-focus flex min-h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] transition hover:border-[var(--gold-action)]"
          >
            <List size={14} aria-hidden="true" />
            Sections
          </button>
        ) : null}
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
    </header>
  );
}
