"use client";

import { X } from "lucide-react";

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
    <div>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left text-sm transition hover:border-[var(--muted-gold)]/35"
      >
        <span className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {triggerLabel}
        </span>
        <span className="mt-1 block text-[var(--foreground)]">
          {triggerSummary || "Not chosen"}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl">{modalTitle}</h2>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
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
                        ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15"
                        : "border-white/10 bg-black/30 hover:border-[var(--muted-gold)]/35"
                    }`}
                    title={option?.label || "Not chosen"}
                  >
                    <div
                      className="h-10 rounded-lg border border-white/10"
                      style={option?.swatchStyle || {}}
                    />
                    <p className="mt-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {option?.label || "Not chosen"}
                    </p>
                  </button>
                );
              })}
            </div>

            {customActive ? (
              <div className="mt-5 rounded-xl border border-[var(--muted-gold)]/25 bg-black/30 p-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
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
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
                  />
                </label>
                <div className="mt-2 flex items-start justify-between gap-4 text-xs leading-5 text-[var(--muted)]">
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
                className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
