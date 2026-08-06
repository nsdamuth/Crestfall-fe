"use client";

import {
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  Eye,
  MessageCircle,
  X,
} from "lucide-react";

const STEP_ICONS = {
  identity: BadgeInfo,
  appearance: Eye,
  body: BookOpen,
  behavior: MessageCircle,
  review: CheckCircle2,
};

export default function CharacterCreatorView({
  headerContent = null,
  previewContent = null,
  editorContent = null,
  activeStep = "identity",
  activeIndex = 0,
  stepItems = [],
  progress = 0,
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  onSelectStep = null,
  onBack = null,
  onNext = null,
  onSave = null,
  onClose = null,
} = {}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-[var(--scrim-strong)] backdrop-blur-[2px]"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose?.();
          }
        }}
      />

      <div className="relative flex w-full max-h-[calc(100dvh-var(--space-3)*2)] max-w-none flex-col overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--line)] border-b-0 bg-[var(--surface-4)] shadow-[var(--shadow-modal)] sm:max-h-[min(44rem,calc(100dvh-var(--space-8)*2))] sm:max-w-[min(46rem,calc(100vw-var(--space-8)*2))] sm:rounded-[var(--radius-lg)] sm:border-b">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line-whisper)] px-4 pb-3 pt-4 sm:px-6">
          <div className="min-w-0 flex-1">{headerContent}</div>

          {onClose ? (
            <button
              type="button"
              onClick={() => onClose?.()}
              aria-label="Close character creator"
              className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
                  Draft Progress
                </p>
                <p className="mt-1 text-sm text-[var(--ink-dim)]">
                  {progress}% filled &middot; optional fields can be completed
                  later.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSave?.()}
                disabled={saveDisabled}
                className="cf-btn cf-btn--tertiary"
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : (
                  <>
                    Save draft <span className="cf-btn__arrow">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {previewContent ? (
            <div className="mt-5">{previewContent}</div>
          ) : null}

          <div className="mt-5 space-y-2">
            {stepItems.map((step) => {
              const Icon = STEP_ICONS[step.iconKey] || BadgeInfo;
              const isActive = step.id === activeStep;

              return (
                <div
                  key={step.id}
                  className={`overflow-hidden rounded-[var(--radius-md)] border transition ${
                    isActive
                      ? "border-[var(--gold-ornament)]/45 bg-black/30"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectStep?.(step.id)}
                    aria-expanded={isActive}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? "text-[var(--ink)]"
                        : step.visited
                          ? "text-[var(--gold-ornament)] hover:border-[var(--gold-ornament)]/25"
                          : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="flex-1 text-[10px] uppercase tracking-[0.16em]">
                      {step.label}
                    </span>
                    {step.summary ? (
                      <span className="max-w-[45%] truncate text-xs normal-case tracking-normal text-[var(--ink-dim)]">
                        {step.summary}
                      </span>
                    ) : null}
                  </button>

                  {isActive ? (
                    <div className="border-t border-[var(--line-whisper)] px-4 py-4">
                      {editorContent}

                      {saveMessage ? (
                        <p
                          className={`mt-4 text-sm ${
                            saveStatus === "error"
                              ? "text-red-200"
                              : "text-emerald-200"
                          }`}
                        >
                          {saveMessage}
                        </p>
                      ) : null}

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onBack?.()}
                          disabled={activeIndex === 0}
                          className="cf-btn cf-btn--secondary"
                        >
                          Back
                        </button>

                        {activeStep === "review" ? (
                          <button
                            type="button"
                            onClick={() => onSave?.()}
                            disabled={saveDisabled}
                            className="cf-btn cf-btn--primary"
                          >
                            {saveStatus === "saving"
                              ? "Saving..."
                              : "Finish draft"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNext?.()}
                            className="cf-btn cf-btn--primary"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
