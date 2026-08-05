"use client";

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
    <div className="flex items-center gap-2">
      <span className="hidden text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] sm:inline">
        {label}
      </span>

      <div className="inline-flex rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-1">
        {VIEW_MODE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange?.(option.id)}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                active
                  ? "bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
