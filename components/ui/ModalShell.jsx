"use client";

import { useEffect } from "react";

export default function ModalShell({
  children,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
  panelClassName = "",
  ariaLabelledBy,
  ariaDescribedBy,
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

  function handleBackdropMouseDown(event) {
    if (!closeOnBackdrop || !onClose) return;

    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 ${className}`}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
}