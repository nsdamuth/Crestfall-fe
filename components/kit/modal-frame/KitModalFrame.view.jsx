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

function CloseControl({ onClose = null }) {
  return (
    <button
      type="button"
      onClick={() => onClose?.()}
      aria-label="Close"
      className="kit-focus absolute right-[var(--space-3)] top-[var(--space-3)] z-[1] flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
    >
      <X size={18} aria-hidden="true" />
    </button>
  );
}

export default function KitModalFrameView({
  children = null,
  onClose = null,
  className = "",
  panelClassName = "",
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel = null,
  generatedLabelId = null,
  onBackdropMouseDown = () => {},
}) {
  if (typeof document === "undefined") return null;

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
      <CloseControl onClose={onClose} />
      {children}
    </ModalShellView>,
    document.body
  );
}
