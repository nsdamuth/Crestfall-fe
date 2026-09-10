"use client";

// veilClassName is a full substitution, not a layered override: the
// R2 viewer variant (docs/BUILD-BLUEPRINT.md 2.16 (r)) needs the
// sticky nav chrome-frost treatment instead of the scrim-plus-blur
// pair, and concatenating two arbitrary-value utilities on the same
// property is not a reliable override in this build (see the R4
// veil-padding fix, kit polish 3 pass, phase 1). ModalShell contract
// 1.0.0 to 1.1.0: additive, presentation-only.
// panelStyle (1.2.0, 10 Sep 2026, fixed modal width): an optional
// inline style object for the dialog panel, used by KitModalFrame to
// hand the panel its width as a custom property so no two width
// utilities ever compete. Absent by default; every prior caller is
// unchanged.
export default function ModalShellView({
  children = null,
  className = "",
  panelClassName = "",
  panelStyle,
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
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );
}
