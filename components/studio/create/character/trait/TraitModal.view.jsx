"use client";

import { ChevronDown } from "lucide-react";

export default function TraitModalView({
  open = false,
  triggerLabel = "Trait",
  triggerSummary = "Not chosen",
  modalTitle = "Trait",
  modalDescription = "",
  options = [],
  customActive = false,
  customTitle = "Custom Trait",
  customValue = "",
  customPlaceholder = "Type a custom trait...",
  onOpen = null,
  onClose = null,
  onChooseOption = null,
  onChangeCustomValue = null,
  onBackFromCustom = null,
  onUseCustomValue = null,
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
            {modalDescription ? (
              <p className="mb-4 text-sm leading-6 text-[var(--ink-dim)]">
                {modalDescription}
              </p>
            ) : null}

            {customActive ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  {customTitle}
                </p>

                <input
                  value={customValue}
                  onChange={(event) =>
                    onChangeCustomValue?.(event.target.value)
                  }
                  placeholder={customPlaceholder}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
                />

                <div className="mt-4 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onBackFromCustom?.()}
                    className="cf-btn cf-btn--secondary"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => onUseCustomValue?.()}
                    className="cf-btn cf-btn--primary"
                  >
                    Use custom
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid max-h-[60vh] gap-2 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
                {options.map((option) => (
                  <button
                    key={option?.id || option?.label}
                    type="button"
                    onClick={() => onChooseOption?.(option?.id || "")}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      option?.isSelected
                        ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                        : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                    }`}
                  >
                    <span className="block text-sm text-[var(--ink)]">
                      {option?.label || "Unnamed trait"}
                    </span>
                    {option?.description ? (
                      <span className="mt-1 block text-xs leading-5 text-[var(--ink-dim)]">
                        {option.description}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
        </div>
      ) : null}
    </div>
  );
}
