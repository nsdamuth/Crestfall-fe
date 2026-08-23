"use client";

// Composes the existing ModalShell ViewModel (escape, scroll lock,
// backdrop guard) per docs/SPRINT-A-PLAN.md section 1.3. ModalShell's
// contract v1.0.0 and every current caller are untouched; this hook
// only merges its behavior with the frame's own alignment and panel
// anatomy.
import { useCallback, useId, useState } from "react";

import { useModalShellViewModel } from "@/components/ui/modal-shell/useModalShellViewModel";

// Mobile modal law, RULED 22 Aug 2026 (modal family close), supersedes
// R4 under 700px (docs/plans/ED1F-PROPAGATION-PLAN.md section C). The
// popup modal (variant modal) no longer maximizes under 700px: it
// bottom-anchors at its own content height, same alignment the sheet
// variant already used. The viewer variant keeps its own chromeless
// R2/R5 treatment (B7), never a bottom-anchored panel, so it is not
// touched by this supersession.
const VARIANT_ALIGNMENT = {
  modal: "items-end p-0 min-[700px]:items-center min-[700px]:p-[var(--space-4)]",
  sheet: "items-end p-0",
  viewer:
    "items-stretch p-0 min-[700px]:items-center min-[700px]:p-[var(--space-4)]",
};

// Panel recipes are self-contained per variant (not layered on a
// shared base): Tailwind's default-scale utilities do not reliably
// override each other by source order (see the R4 veil-padding find,
// phase 1), so "no chrome" for the viewer variant is built by never
// emitting the chrome classes at all, rather than trying to zero them
// out after the fact.
//
// modal and sheet panels: --surface-4 superseded by the ratified
// panel lift gradient (B3, docs/plans/ED1F-PROPAGATION-PLAN.md
// section A item 7), propagated once here for every caller. Under
// 700px the modal panel is sized to its own content height and capped
// at 92dvh with internal scroll, never forced to h-[100dvh]; that cap
// is the same content-height treatment the sheet variant already
// used, not a full-screen maximize.
const PANEL_RECIPE = {
  modal:
    "relative w-full max-h-[92dvh] overflow-y-auto bg-[image:var(--grad-panel-lift)] border border-[var(--line)] shadow-[var(--shadow-modal)] rounded-t-[var(--radius-lg)] rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)] min-[700px]:max-h-[92dvh] min-[700px]:w-auto min-[700px]:rounded-[var(--radius-lg)] min-[700px]:border-b min-[700px]:pb-0",
  sheet:
    "relative w-full max-h-[92dvh] overflow-y-auto bg-[image:var(--grad-panel-lift)] border border-[var(--line)] shadow-[var(--shadow-modal)] rounded-t-[var(--radius-lg)] rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)]",
  // R2/R5 (10 Aug 2026, kit polish 3 pass, plan 1.2): the viewer is
  // its own surface, never a panel with an image inside it. No
  // background, border, shadow, or radius anywhere; a transparent
  // full-viewport flex column, its only chrome the frame's close
  // control. pointer-events-none (R3, 10 Aug 2026 review gate): the
  // transparent panel spans the whole viewport, so without it every
  // veil click landed on the panel and ModalShell's
  // target===currentTarget backdrop guard could never fire; the
  // panel is click-transparent and each interactive child (close
  // control, image frame, shelf) re-enables its own pointer events.
  viewer:
    "relative flex h-[100dvh] max-h-[100dvh] w-full flex-col items-center justify-center pointer-events-none",
};

// B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
// plan group G3), REVERSING R2: the viewer variant's veil is now the
// lawful 2px veil at the --chrome-wash color, paired with
// --blur-panel, the same strength every other floating veil uses
// ("lawful 2px veil, no glass extension"; docs/DESIGN-TOKENS.md,
// "R2 REVERSED" note). This is the only line this file changes for
// G3: it is exclusively consumed by KitImageOverlay's variant="viewer"
// composition, so the edit carries no effect on the modal or sheet
// variants G2 delivered. Modal and sheet keep ModalShellView's own
// default (undefined here so the View's default parameter applies).
const VARIANT_VEIL = {
  modal: undefined,
  sheet: undefined,
  viewer: "bg-[var(--chrome-wash)] backdrop-blur-[var(--blur-panel)]",
};

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

// Mobile modal law, RULED 22 Aug 2026, checkable condition 3
// (docs/plans/ED1F-DESIGN-DELTAS.md section A4): dismissing a modal
// with unsaved state routes through a confirm step, never a silent
// discard. hasUnsavedChanges is caller-reported (the frame owns no
// form state of its own); when true, every one of the three
// dismissal paths (backdrop, Escape, close control) is intercepted
// into a confirm step instead of closing immediately.
export function useKitModalFrameViewModel({
  children = null,
  onClose = null,
  closeOnBackdrop = true,
  closeOnEscape = true,
  variant = "modal",
  panelClassName = "",
  hasUnsavedChanges = false,
  sheetGrabber = false,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
} = {}) {
  const resolvedVariant =
    variant === "sheet" ? "sheet" : variant === "viewer" ? "viewer" : "modal";
  const onCloseCallback = toCallback(onClose);
  const [isConfirmingDismiss, setIsConfirmingDismiss] = useState(false);

  const guardedOnClose = useCallback(() => {
    if (!onCloseCallback) return;
    // While the discard-confirm panel is showing, every dismissal path
    // (backdrop, Escape, close control) that routes through here is a
    // no-op: only the explicit Discard button (onConfirmDiscard) may
    // close the frame at that point.
    if (isConfirmingDismiss) return;
    if (hasUnsavedChanges) {
      setIsConfirmingDismiss(true);
      return;
    }
    onCloseCallback();
  }, [onCloseCallback, hasUnsavedChanges, isConfirmingDismiss]);

  const shellProps = useModalShellViewModel({
    onClose: guardedOnClose,
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
    onClose: guardedOnClose,
    variant: resolvedVariant,
    className: VARIANT_ALIGNMENT[resolvedVariant],
    veilClassName: VARIANT_VEIL[resolvedVariant],
    panelClassName: [PANEL_RECIPE[resolvedVariant], panelClassName]
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
    sheetGrabber,
    isConfirmingDismiss,
    onKeepEditing: () => setIsConfirmingDismiss(false),
    onConfirmDiscard: () => {
      setIsConfirmingDismiss(false);
      onCloseCallback?.();
    },
    children,
  };
}
