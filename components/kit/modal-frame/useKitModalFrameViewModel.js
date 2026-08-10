"use client";

// Composes the existing ModalShell ViewModel (escape, scroll lock,
// backdrop guard) per docs/SPRINT-A-PLAN.md section 1.3. ModalShell's
// contract v1.0.0 and every current caller are untouched; this hook
// only merges its behavior with the frame's own alignment and panel
// anatomy.
import { useId } from "react";

import { useModalShellViewModel } from "@/components/ui/modal-shell/useModalShellViewModel";

const VARIANT_ALIGNMENT = {
  modal:
    "items-end p-0 min-[700px]:items-center min-[700px]:p-[var(--space-4)]",
  sheet: "items-end p-0",
};

const VARIANT_PANEL = {
  modal:
    "rounded-t-[var(--radius-lg)] rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)] min-[700px]:rounded-[var(--radius-lg)] min-[700px]:border-b min-[700px]:pb-0",
  sheet:
    "rounded-t-[var(--radius-lg)] rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)]",
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
  const resolvedVariant = variant === "sheet" ? "sheet" : "modal";
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
