"use client";

import {
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  Eye,
  MessageCircle,
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
} = {}) {
  return (
    <>
      {headerContent}

      <section className="mt-8 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Draft Progress
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {progress}% filled — optional fields can be completed later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Draft →"}
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {stepItems.map((step) => {
            const Icon = STEP_ICONS[step.iconKey] || BadgeInfo;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep?.(step.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  step.active
                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : step.visited
                      ? "border-[var(--muted-gold)]/25 bg-black/35 text-[var(--muted-gold)]"
                      : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/25"
                }`}
              >
                <Icon size={17} />
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em]">
                  {step.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {previewContent}

        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          {editorContent}

          {saveMessage ? (
            <p
              className={`mt-4 text-sm ${
                saveStatus === "error" ? "text-red-200" : "text-emerald-200"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onBack?.()}
              disabled={activeIndex === 0}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {activeStep === "review" ? (
              <button
                type="button"
                onClick={() => onSave?.()}
                disabled={saveDisabled}
                className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveStatus === "saving" ? "Saving..." : "Finish Draft →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNext?.()}
                className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
