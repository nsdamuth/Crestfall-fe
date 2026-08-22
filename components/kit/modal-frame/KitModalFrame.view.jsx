"use client";

// Ruled PANEL standing on the existing ModalShell behavioral
// primitive (docs/BUILD-BLUEPRINT.md 2.5). Renders ModalShellView
// with the frame's alignment classes and the standard panel inside
// it, per docs/SPRINT-A-PLAN.md section 1.3. Portaled to document.body:
// a backdrop-filter ancestor (the sticky filter bar, the frosted top
// bar) becomes the containing block for fixed descendants, so a frame
// opened from chrome must escape it, same reason the dropdown sheet
// already portals.
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import ModalShellView from "@/components/ui/modal-shell/ModalShell.view";

// Circular close recipe, shared by the absolute (modal, viewer) and
// static-in-header-row (sheet, R7) placements.
function CircularCloseButton({ onClose = null, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onClose?.()}
      aria-label="Close"
      className={`kit-focus pointer-events-auto flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)] ${className}`}
    >
      <X size={18} aria-hidden="true" />
    </button>
  );
}

function AbsoluteCloseControl({ onClose = null }) {
  return (
    <CircularCloseButton
      onClose={onClose}
      className="absolute right-[var(--space-3)] top-[var(--space-3)] z-[1]"
    />
  );
}

// R7 (10 Aug 2026, kit polish 3 pass, plan section 1.1): the sheet
// variant gains a structural header band as its first child, so the
// close control can never overlap sheet content below it. Every
// sheet inherits by construction (filter, sort, any future settings
// sheet).
// B1 fade divider (docs/plans/ED1F-DESIGN-DELTAS.md), scope broadened
// to every modal-family divider: 1px, fades to transparent at both
// ends, never edge-to-edge.
function FadeDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px bg-[image:var(--line-fade)] ${className}`}
    />
  );
}

function SheetHeaderRow({ onClose = null }) {
  return (
    <div className="flex min-h-[calc(var(--control-md)+var(--space-3)*2)] flex-col justify-end px-[var(--space-3)]">
      <div className="flex items-center justify-end">
        <CircularCloseButton onClose={onClose} />
      </div>
      <FadeDivider />
    </div>
  );
}

// A4 mobile modal law, checkable condition 3: dismissing a modal with
// unsaved state routes through a confirm step, never a silent
// discard. Fade divider plus a two-button footer aligned to its ends
// (B8): "Keep editing" is the safe default, "Discard" is the
// destructive path and carries the ratified B5 danger-fill recipe.
function UnsavedDismissConfirm({ onKeepEditing = null, onConfirmDiscard = null }) {
  return (
    <div className="p-[var(--space-6)]">
      <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        Discard changes?
      </h2>
      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        Unsaved changes in this panel will be lost.
      </p>
      <FadeDivider className="my-[var(--space-5)]" />
      <div className="flex items-center justify-between gap-[var(--space-3)]">
        <button
          type="button"
          onClick={() => onKeepEditing?.()}
          className="kit-focus cf-btn cf-btn--secondary"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={() => onConfirmDiscard?.()}
          className="kit-focus cf-btn cf-btn--danger-filled"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default function KitModalFrameView({
  children = null,
  onClose = null,
  className = "",
  panelClassName = "",
  veilClassName,
  variant = "modal",
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel = null,
  generatedLabelId = null,
  onBackdropMouseDown = () => {},
  isConfirmingDismiss = false,
  onKeepEditing = null,
  onConfirmDiscard = null,
}) {
  if (typeof document === "undefined") return null;

  const isSheet = variant === "sheet";
  const body = isConfirmingDismiss ? (
    <UnsavedDismissConfirm onKeepEditing={onKeepEditing} onConfirmDiscard={onConfirmDiscard} />
  ) : (
    children
  );

  return createPortal(
    <ModalShellView
      className={className}
      panelClassName={panelClassName}
      veilClassName={veilClassName}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      onBackdropMouseDown={onBackdropMouseDown}
    >
      {ariaLabel && generatedLabelId && (
        <span id={generatedLabelId} className="sr-only">
          {ariaLabel}
        </span>
      )}
      {isSheet ? (
        <>
          <SheetHeaderRow onClose={onClose} />
          {body}
        </>
      ) : (
        <>
          <AbsoluteCloseControl onClose={onClose} />
          {body}
        </>
      )}
    </ModalShellView>,
    document.body
  );
}
