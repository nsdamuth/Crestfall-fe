"use client";

import { ChevronRight } from "lucide-react";

export default function ModeSwitchView({
  flowLabel = "Craft Images",
  flowSteps = [],
  modes = [],
  activeModeId = "",
  onChangeMode = null,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
      {flowSteps.length ? (
        <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--ink-dim)]">
          {flowSteps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight size={12} aria-hidden="true" />
              ) : null}
              <span
                className={
                  step.id === flowLabel || step.active
                    ? "text-[var(--gold-ornament)]"
                    : ""
                }
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      <div
        role="tablist"
        aria-label="Image studio mode"
        className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {modes.map((mode) => {
          const Icon = mode.Icon;
          const isActive = mode.id === activeModeId;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeMode?.(mode.id)}
              className={`flex min-h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-left text-sm transition ${
                isActive
                  ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10 text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
              }`}
            >
              {Icon ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
                  <Icon size={14} aria-hidden="true" />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block leading-5">{mode.label}</span>
                {mode.stepLabel ? (
                  <span className="block text-[11px] leading-4 text-[var(--ink-faint)]">
                    {mode.stepLabel}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
