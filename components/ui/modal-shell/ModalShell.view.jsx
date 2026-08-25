"use client";

// veilClassName is a full substitution, not a layered override: the
// R2 viewer variant (docs/BUILD-BLUEPRINT.md 2.16 (r)) needs the
// sticky nav chrome-frost treatment instead of the scrim-plus-blur
// pair, and concatenating two arbitrary-value utilities on the same
// property is not a reliable override in this build (see the R4
// veil-padding fix, kit polish 3 pass, phase 1). ModalShell contract
// 1.0.0 to 1.1.0: additive, presentation-only.
export default function ModalShellView({
  children = null,
  className = "",
  panelClassName = "",
  veilClassName = "bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)]",
  ariaLabelledBy,
  ariaDescribedBy,
  onBackdropMouseDown = () => {},
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${veilClassName} ${className}`}
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
