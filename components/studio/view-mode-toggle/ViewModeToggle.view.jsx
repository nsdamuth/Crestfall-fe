"use client";

// Restyled to the token system in the 9 Aug 2026 kit revision pass
// (docs/BUILD-BLUEPRINT.md 2.16 note in 2.12): the white/black
// literals and off-scale text sizes convert to tokens. Contract and
// reporting are unchanged (contract law).
//
// Icons-only, RULED 9 Aug 2026 (kit polish pass, amends
// BUILD-BLUEPRINT.md 2.16(j)): no visible "Layout" group title, no
// visible "Grid"/"List" text. `label` still reaches the control for
// accessibility, wired to aria-label on the group instead of a
// rendered heading. Selection state is the (i) gold-wash law: no
// bold border. Focus law: keyboard focus keeps a subtle border
// brightening, no gold box; pointer interaction shows nothing extra.
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
  // Control height parity, RULED 10 Aug 2026 (kit polish 3 pass):
  // the group's own frame (border, radius, padding) used to sit on
  // TOP of each button's own fixed --control-filter height, making
  // the visible toggle 10px taller than search/dropdown/sort. The
  // frame now carries the single source of truth for height
  // (fixed, border-box, matching Search/KitDropdown's own
  // --control-filter and coarse-pointer --control-md exactly);
  // buttons fill it (`h-full`, `aspect-square`) instead of each
  // declaring their own size, so the whole control, not just its
  // buttons, measures the same as every sibling on the line.
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-[var(--control-filter)] items-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)] [@media(pointer:coarse)]:h-[var(--control-md)]"
    >
      {VIEW_MODE_OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange?.(option.id)}
            className={`kit-focus flex aspect-square h-full items-center justify-center rounded-[var(--radius-full)] border border-transparent transition-colors duration-[var(--dur-hover)] ${
              active
                ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                : "text-[var(--ink-dim)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
