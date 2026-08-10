"use client";

// Restyled to the token system in the 9 Aug 2026 kit revision pass
// (docs/BUILD-BLUEPRINT.md 2.16 note in 2.12): the white/black
// literals and off-scale text sizes convert to tokens. Contract and
// reporting are unchanged (contract law).
import { Grid2X2, List } from "lucide-react";

const VIEW_MODE_OPTIONS = [
  { id: "grid", label: "Grid", icon: Grid2X2 },
  { id: "list", label: "List", icon: List },
];

export default function ViewModeToggleView({
  value = "grid",
  onChange = null,
  label = "View",
}) {
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <span className="hidden text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)] sm:inline">
        {label}
      </span>

      <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)]">
        {VIEW_MODE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange?.(option.id)}
              className={`inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition-colors duration-[var(--dur-hover)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
                active
                  ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
