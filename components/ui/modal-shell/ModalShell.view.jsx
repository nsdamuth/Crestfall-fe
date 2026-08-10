"use client";

export default function ModalShellView({
  children = null,
  className = "",
  panelClassName = "",
  ariaLabelledBy,
  ariaDescribedBy,
  onBackdropMouseDown = () => {},
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)] ${className}`}
      onMouseDown={onBackdropMouseDown}
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
