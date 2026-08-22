"use client";

import { ChevronRight } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

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
  const hasValue = Boolean(triggerSummary) && triggerSummary !== "Not chosen";

  return (
    <div>
      <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {triggerLabel}
      </span>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="mt-[var(--space-1)] flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left transition-colors hover:border-[var(--state-hover-line)]"
      >
        <span
          className={`truncate text-[length:var(--text-body)] leading-[var(--lh-body)] ${hasValue ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
        >
          {triggerSummary || "Not chosen"}
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-[var(--ink-faint)]"
          aria-hidden="true"
        />
      </button>

      {open ? (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-2xl"
          onClose={onClose}
          ariaLabel={modalTitle}
        >
          <div className="flex max-h-[92dvh] flex-col p-[var(--space-6)] pt-[var(--space-8)]">
            <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
              {modalTitle}
            </h2>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            <div className="min-h-0 flex-1 overflow-y-auto pb-[var(--space-2)] pr-1">
              <div className="grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-4">
                {options.map((option) => {
                  const active = option?.isCustom
                    ? customActive
                    : !customActive && option?.id === selectedOptionId;

                  return (
                    <button
                      key={option?.id || "none"}
                      type="button"
                      onClick={() => onChooseOption?.(option?.id || "")}
                      className={`rounded-[var(--radius-md)] border p-[var(--space-3)] text-left transition-colors ${
                        active
                          ? "border-[var(--gold-ornament)]/60 bg-[var(--fill-whisper)]"
                          : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] hover:border-[var(--gold-ornament)]/35"
                      }`}
                    >
                      <div
                        className="h-14 rounded-[var(--radius-md)] border border-[var(--line-whisper)]"
                        style={option?.swatchStyle || {}}
                      />
                      <p className="mt-[var(--space-3)] text-[length:var(--text-body)] text-[var(--ink)]">
                        {option?.label || "Not chosen"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {customActive ? (
                <div className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)]">
                  <label className="block">
                    <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
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
                      className="mt-[var(--space-2)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)]"
                    />
                  </label>
                  <div className="mt-[var(--space-2)] flex items-start justify-between gap-[var(--space-4)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                    <p>{customHelperText}</p>
                    <span className="shrink-0 tabular-nums">
                      {String(customValue || "").length} / {customValueMaxLength}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-[var(--space-5)] flex justify-end">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="cf-btn cf-btn--primary"
              >
                Done
              </button>
            </div>
          </div>
        </KitModalFrame>
      ) : null}
    </div>
  );
}
