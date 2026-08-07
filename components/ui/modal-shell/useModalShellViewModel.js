"use client";

import { useCallback, useEffect } from "react";

export function useModalShellViewModel({
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
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
