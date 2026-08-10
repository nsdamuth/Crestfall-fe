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
      className={`kit-focus flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)] ${className}`}
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
function SheetHeaderRow({ onClose = null }) {
  return (
    <div className="flex min-h-[calc(var(--control-md)+var(--space-3)*2)] items-center justify-end border-b border-[var(--line-whisper)] px-[var(--space-3)]">
      <CircularCloseButton onClose={onClose} />
    </div>
  );
}

export default function KitModalFrameView({
  children = null,
  onClose = null,
  className = "",
  panelClassName = "",
  variant = "modal",
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel = null,
  generatedLabelId = null,
  onBackdropMouseDown = () => {},
}) {
  if (typeof document === "undefined") return null;

  const isSheet = variant === "sheet";

  return createPortal(
    <ModalShellView
      className={className}
      panelClassName={panelClassName}
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
          {children}
        </>
      ) : (
        <>
          <AbsoluteCloseControl onClose={onClose} />
          {children}
        </>
      )}
    </ModalShellView>,
    document.body
  );
}
