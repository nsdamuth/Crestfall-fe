"use client";

import { ChevronRight } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function PersonalityModalView({
  open = false,
  triggerLabel = "Personality",
  triggerSummary = "Not chosen",
  modalTitle = "Personality",
  modalDescription = "",
  options = [],
  customActive = false,
  customTitle = "Custom Personality",
  customValue = "",
  customPlaceholder = "Type a custom archetype...",
  onOpen = null,
  onClose = null,
  onChooseOption = null,
  onChangeCustomValue = null,
  onBackFromCustom = null,
  onUseCustomValue = null,
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
            <div>
              <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                {modalTitle}
              </h2>
              {modalDescription ? (
                <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  {modalDescription}
                </p>
              ) : null}
            </div>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            {customActive ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)]">
                <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                  {customTitle}
                </span>

                <input
                  value={customValue}
                  onChange={(event) =>
                    onChangeCustomValue?.(event.target.value)
                  }
                  placeholder={customPlaceholder}
                  className="mt-[var(--space-3)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)]"
                />

                <div className="mt-[var(--space-4)] flex justify-between gap-[var(--space-3)]">
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
              <div className="grid min-h-0 flex-1 gap-[var(--space-2)] overflow-y-auto pb-[var(--space-2)] pr-1 md:grid-cols-2">
                {options.map((option) => (
                  <button
                    key={option?.id || option?.label}
                    type="button"
                    onClick={() => onChooseOption?.(option?.id || "")}
                    className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left transition-colors ${
                      option?.isSelected
                        ? "border-[var(--gold-ornament)]/55 bg-[var(--fill-whisper)] text-[var(--ink)]"
                        : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                    }`}
                  >
                    <span className="block text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                      {option?.label || "Unnamed personality"}
                    </span>
                    {option?.description ? (
                      <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                        {option.description}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </KitModalFrame>
      ) : null}
    </div>
  );
}
