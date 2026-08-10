"use client";

import { useCallback, useEffect } from "react";

export function useModalShellViewModel({
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  // Default veil gutter, presentation only (R4, 10 Aug 2026, kit
  // polish 3 pass, plan 1.1). Previously hardcoded on ModalShellView
  // itself; moved here so KitModalFrame (which calls ModalShellView
  // directly with its own alignment classes, bypassing this hook) can
  // fully control its own inset per variant, while every consumer
  // that goes through this hook (components/ui/ModalShell.jsx and its
  // callers) keeps the same default gutter unless it supplies its own
  // className.
  className = "p-4",
  panelClassName = "",
  ariaLabelledBy,
  ariaDescribedBy,
  children,
}) {
  useEffect(() => {
    if (!closeOnEscape || !onClose) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onBackdropMouseDown = useCallback(
    (event) => {
      if (!closeOnBackdrop || !onClose) return;

      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  return {
    children,
    className,
    panelClassName,
    ariaLabelledBy,
    ariaDescribedBy,
    onBackdropMouseDown,
  };
}
