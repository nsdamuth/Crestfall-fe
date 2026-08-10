"use client";

// Composes the existing ModalShell ViewModel (escape, scroll lock,
// backdrop guard) per docs/SPRINT-A-PLAN.md section 1.3. ModalShell's
// contract v1.0.0 and every current caller are untouched; this hook
// only merges its behavior with the frame's own alignment and panel
// anatomy.
import { useId } from "react";

import { useModalShellViewModel } from "@/components/ui/modal-shell/useModalShellViewModel";

// R4 (10 Aug 2026, kit polish 3 pass, plan section 1.1): popup modals
// (variant modal, variant viewer) maximize the screen under 700px
// instead of docking to the bottom edge. The sheet variant is not
// named by R4 and keeps the bottom dock (subject of R7 instead).
const VARIANT_ALIGNMENT = {
  modal:
    "items-stretch p-0 min-[700px]:items-center min-[700px]:p-[var(--space-4)]",
  sheet: "items-end p-0",
  // Empty shell for phase 1; filled in by the R2/R5 viewer rebuild
  // (plan section 1.2, phase 2).
  viewer:
    "items-stretch p-0 min-[700px]:items-center min-[700px]:p-[var(--space-4)]",
};

const VARIANT_PANEL = {
  modal:
    "h-[100dvh] max-h-[100dvh] w-full rounded-none border-0 pb-[env(safe-area-inset-bottom)] min-[700px]:h-auto min-[700px]:max-h-[92dvh] min-[700px]:w-auto min-[700px]:rounded-[var(--radius-lg)] min-[700px]:border min-[700px]:pb-0",
  sheet:
    "rounded-t-[var(--radius-lg)] rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)]",
  // Empty shell for phase 1; filled in by the R2/R5 viewer rebuild
  // (plan section 1.2, phase 2).
  viewer:
    "h-[100dvh] max-h-[100dvh] w-full rounded-none border-0 pb-[env(safe-area-inset-bottom)] min-[700px]:h-auto min-[700px]:max-h-[92dvh] min-[700px]:w-auto min-[700px]:rounded-[var(--radius-lg)] min-[700px]:border min-[700px]:pb-0",
};

const PANEL_BASE =
  "relative w-full max-h-[92dvh] overflow-y-auto bg-[var(--surface-4)] border border-[var(--line)] shadow-[var(--shadow-modal)]";

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

export function useKitModalFrameViewModel({
  children = null,
  onClose = null,
  closeOnBackdrop = true,
  closeOnEscape = true,
  variant = "modal",
  panelClassName = "",
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
} = {}) {
  const resolvedVariant =
    variant === "sheet" ? "sheet" : variant === "viewer" ? "viewer" : "modal";
  const onCloseCallback = toCallback(onClose);

  const shellProps = useModalShellViewModel({
    onClose: onCloseCallback,
    closeOnBackdrop,
    closeOnEscape,
  });

  // Fallback accessible name: when the caller supplies ariaLabel and
  // no ariaLabelledBy, a visually-hidden span carries the label and
  // its generated id is forwarded as ariaLabelledBy to the composed
  // ModalShellView, which accepts ariaLabelledBy only. The rendered
  // accessible name is identical to a raw aria-label attribute.
  const generatedLabelId = useId();
  const hasOwnLabelledBy = Boolean(ariaLabelledBy);
  const needsGeneratedLabel = !hasOwnLabelledBy && Boolean(ariaLabel);

  return {
    ...shellProps,
    onClose: onCloseCallback,
    variant: resolvedVariant,
    className: VARIANT_ALIGNMENT[resolvedVariant],
    panelClassName: [PANEL_BASE, VARIANT_PANEL[resolvedVariant], panelClassName]
      .filter(Boolean)
      .join(" "),
    ariaLabelledBy: hasOwnLabelledBy
      ? ariaLabelledBy
      : needsGeneratedLabel
        ? generatedLabelId
        : undefined,
    ariaDescribedBy,
    generatedLabelId: needsGeneratedLabel ? generatedLabelId : null,
    ariaLabel: needsGeneratedLabel ? ariaLabel : null,
    children,
  };
}
