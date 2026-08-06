"use client";

import { ChevronDown } from "lucide-react";

export default function EyeColorModalView({
  open = false,
  triggerLabel = "Eye Color",
  triggerSummary = "Not chosen",
  modalTitle = "Select Eye Color",
  options = [],
  selectedOptionId = "",
  customActive = false,
  customValue = "",
  customInputTitle = "Custom Eye Color",
  customPlaceholder = "",
  customHelperText = "",
  customValueMaxLength = 240,
  onOpen = null,
  onClose = null,
  onChooseOption = null,
  onChangeCustomValue = null,
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition ${
        open
          ? "border-[var(--gold-ornament)]/45 bg-black/25"
          : "border-white/10 bg-black/35"
      }`}
    >
      <button
        type="button"
        onClick={() => (open ? onClose?.() : onOpen?.())}
        aria-expanded={open}
        aria-label={modalTitle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:border-[var(--gold-ornament)]/35"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {triggerLabel}
          </span>
          <span className="mt-1 block text-[var(--ink)]">
            {triggerSummary || "Not chosen"}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--ink-dim)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="border-t border-[var(--line-whisper)] px-4 py-4">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {options.map((option) => {
                const active = option?.isCustom
                  ? customActive
                  : !customActive && option?.id === selectedOptionId;

                return (
                  <button
                    key={option?.id || "none"}
                    type="button"
                    onClick={() => onChooseOption?.(option?.id || "")}
                    className={`rounded-xl border p-2 transition ${
                      active
                        ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15"
                        : "border-white/10 bg-black/30 hover:border-[var(--gold-ornament)]/35"
                    }`}
                    title={option?.label || "Not chosen"}
                  >
                    <div
                      className="h-10 rounded-lg border border-white/10"
                      style={option?.swatchStyle || {}}
                    />
                    <p className="mt-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
                      {option?.label || "Not chosen"}
                    </p>
                  </button>
                );
              })}
            </div>

            {customActive ? (
              <div className="mt-5 rounded-xl border border-[var(--gold-ornament)]/25 bg-black/30 p-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    {customInputTitle}
                  </span>
                  <input
                    autoFocus
                    maxLength={customValueMaxLength}
                    value={customValue}
                    onChange={(event) =>
                      onChangeCustomValue?.(event.target.value)
                    }
                    placeholder={customPlaceholder}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
                  />
                </label>
                <div className="mt-2 flex items-start justify-between gap-4 text-xs leading-5 text-[var(--ink-dim)]">
                  <p>{customHelperText}</p>
                  <span className="shrink-0 tabular-nums">
                    {String(customValue || "").length} / {customValueMaxLength}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="cf-btn cf-btn--primary"
              >
                Done
              </button>
            </div>
        </div>
      ) : null}
    </div>
  );
}
