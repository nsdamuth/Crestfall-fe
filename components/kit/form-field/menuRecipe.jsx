"use client";

// ONE menu look for everything opened out of the composer (round 3
// item 3): the surface, radius, padding, and hover state of the footer
// count menu, shared by construction rather than by copy.
//
// Moved out of KitImageCreatorPanel.view.jsx (FE/MEDIA-STUDIO session
// 3, notes 6 and 6a, 10 Sep 2026) the way growTextarea was moved in
// session 2, so the image viewer's download size menu is the same
// menu the composer opens. Additive: `href` renders a row as a
// download anchor instead of a button, `detail` renders a quiet
// right-hand note (the measured pixel size on the Large row).
import { Check } from "lucide-react";

export const MENU_PANEL_RECIPE =
  "absolute z-50 max-h-[19rem] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel-ui-glass)] p-[var(--space-2)] backdrop-blur-[var(--blur-panel)]";

const ROW_RECIPE =
  "flex min-h-[var(--control-sm)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-1)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)]";

function rowInkClass({ disabled, isSelected }) {
  if (disabled) {
    return "cursor-not-allowed text-[var(--ink-dim)] opacity-[var(--state-disabled-opacity)]";
  }
  if (isSelected) {
    return "text-[var(--gold-bright)] hover:bg-[var(--state-hover-fill)]";
  }
  return "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]";
}

function MenuRowContent({ label, detail, isSelected, disabled, tooltip }) {
  return (
    <>
      <span className="min-w-0 truncate">{label}</span>
      {disabled && tooltip ? (
        // Same treatment as the Video toggle's Soon chip: one "Soon"
        // look across the composer (round 6, 10 Sep 2026).
        <span className="flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {tooltip}
        </span>
      ) : detail ? (
        <span className="flex-none text-[length:var(--text-label)] tabular-nums text-[var(--ink-faint)]">
          {detail}
        </span>
      ) : isSelected ? (
        <Check size={14} aria-hidden="true" className="flex-none" />
      ) : null}
    </>
  );
}

export function MenuRow({
  label,
  isSelected = false,
  disabled = false,
  tooltip = "",
  detail = "",
  href = "",
  downloadName = "",
  onSelect,
}) {
  const className = `${ROW_RECIPE} ${rowInkClass({ disabled, isSelected })}`;
  const content = (
    <MenuRowContent
      label={label}
      detail={detail}
      isSelected={isSelected}
      disabled={disabled}
      tooltip={tooltip}
    />
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        download={downloadName || true}
        title={tooltip || undefined}
        onClick={() => onSelect?.()}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      title={tooltip || undefined}
      onClick={() => onSelect?.()}
      className={className}
    >
      {content}
    </button>
  );
}
