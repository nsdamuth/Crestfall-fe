"use client";

import { Check, X } from "lucide-react";

export default function VoiceModulePickerModalView({
  open = false,
  triggerLabel = "Voice Modules",
  triggerDescription = "",
  triggerActionLabel = "Choose modules",
  selectedItems = [],
  emptySelectionMessage = "No voice modules selected.",
  modalAriaLabel = "Choose voice modules",
  modalTitle = "Choose Voice Modules",
  modalDescription = "",
  optionGroups = [],
  selectedIds = [],
  clearActionLabel = "Clear all",
  doneActionLabel = "Done",
  canClear = false,
  onOpen = null,
  onClose = null,
  onToggleModule = null,
  onClearAll = null,
  onDone = null,
}) {
  const selectedSet = new Set(Array.isArray(selectedIds) ? selectedIds : []);
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const safeOptionGroups = Array.isArray(optionGroups) ? optionGroups : [];

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {triggerLabel}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {triggerDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpen?.()}
          className="cf-btn cf-btn--primary shrink-0"
        >
          {triggerActionLabel}
        </button>
      </div>

      {safeSelectedItems.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {safeSelectedItems.map((item, index) => (
            <span
              key={`${item?.id || item?.label || "voice-module"}-${index}`}
              className="rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 px-3 py-1 text-xs text-[var(--gold-ornament)]"
            >
              {item?.label || "Voice Module"}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--ink-dim)]">
          {emptySelectionMessage}
        </p>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={modalAriaLabel}
            className="flex max-h-[88vh] w-full max-w-5xl flex-col rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl">{modalTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
                  {modalDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-[var(--radius-full)] border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 min-h-0 overflow-y-auto pr-1">
              {safeOptionGroups.length ? (
                <div className="space-y-6">
                  {safeOptionGroups.map((group) => {
                    const options = Array.isArray(group?.options)
                      ? group.options
                      : [];

                    if (!options.length) return null;

                    return (
                      <section key={group?.id || group?.label}>
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                          {group?.label || "Voice Modules"}
                        </p>

                        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                          {options.map((option) => {
                            const optionId = option?.id || "";
                            const active = selectedSet.has(optionId);

                            return (
                              <button
                                key={optionId || option?.label}
                                type="button"
                                onClick={() => onToggleModule?.(optionId)}
                                className={`rounded-xl border px-4 py-3 text-left transition ${
                                  active
                                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                                    : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                                }`}
                              >
                                <span className="flex items-start justify-between gap-3">
                                  <span className="min-w-0">
                                    <span className="block text-sm text-[var(--ink)]">
                                      {option?.label || "Voice Module"}
                                    </span>

                                    <span className="mt-1 block text-xs leading-5 text-[var(--ink-dim)]">
                                      {option?.description || ""}
                                    </span>
                                  </span>

                                  {active ? (
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 text-[var(--gold-ornament)]">
                                      <Check size={14} />
                                    </span>
                                  ) : null}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-6 text-sm leading-6 text-[var(--ink-dim)]">
                  No voice modules are available.
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => onClearAll?.()}
                disabled={!canClear}
                className="cf-btn cf-btn--danger"
              >
                {clearActionLabel}
              </button>

              <button
                type="button"
                onClick={() => onDone?.()}
                className="cf-btn cf-btn--primary"
              >
                {doneActionLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
