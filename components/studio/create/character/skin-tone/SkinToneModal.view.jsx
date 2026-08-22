"use client";

import { X } from "lucide-react";

export default function SkinToneModalView({
  open = false,
  triggerLabel = "Skin Tone",
  triggerSummary = "Not chosen",
  modalTitle = "Select Skin Tone",
  options = [],
  selectedOptionId = "",
  customActive = false,
  customValue = "",
  customInputTitle = "Custom Skin Tone",
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
        className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left text-sm transition hover:border-[var(--gold-ornament)]/35"
      >
        <span className="block text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          {triggerLabel}
        </span>
        <span className="mt-1 block text-[var(--ink)]">
          {triggerSummary || "Not chosen"}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl">{modalTitle}</h2>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-[var(--radius-full)] border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {options.map((option) => {
                const active = option?.isCustom
                  ? customActive
                  : !customActive && option?.id === selectedOptionId;

                return (
                  <button
                    key={option?.id || "none"}
                    type="button"
                    onClick={() => onChooseOption?.(option?.id || "")}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[var(--gold-ornament)]/60 bg-[var(--fill-whisper)]"
                        : "border-white/10 bg-[var(--fill-option-rest)] hover:border-[var(--gold-ornament)]/35"
                    }`}
                  >
                    <div
                      className="h-14 rounded-lg border border-white/10"
                      style={option?.swatchStyle || {}}
                    />
                    <p className="mt-3 text-sm text-[var(--ink)]">
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
        </div>
      ) : null}
    </div>
  );
}
