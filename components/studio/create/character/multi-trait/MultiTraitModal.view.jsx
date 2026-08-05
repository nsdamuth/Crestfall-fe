"use client";

import { X } from "lucide-react";

export default function MultiTraitModalView({
  open = false,
  triggerLabel = "Traits",
  triggerSummary = "Not chosen",
  modalTitle = "Traits",
  modalDescription = "",
  options = [],
  customActive = false,
  customTitle = "Custom Traits",
  customValue = "",
  customPlaceholder = "Type custom traits...",
  onOpen = null,
  onClose = null,
  onChooseOption = null,
  onChangeCustomValue = null,
  onBackFromCustom = null,
  onAddCustomValue = null,
  onDone = null,
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
          <div className="w-full max-w-5xl rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl">{modalTitle}</h2>
                {modalDescription ? (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                    {modalDescription}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {customActive ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
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
                    className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddCustomValue?.()}
                    className="rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
                  >
                    Add Custom
                  </button>
                </div>
              </div>
            ) : (
              <>
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

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onDone?.()}
                    className="rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
