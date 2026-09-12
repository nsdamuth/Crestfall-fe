"use client";

import {
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  Eye,
  MessageCircle,
} from "lucide-react";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

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

      <section className="mt-8 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Draft Progress
            </p>
            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              {progress}% filled · optional fields can be completed later.
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
                Save draft <span className="cf-btn__arrow">→</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-5">
          {stepItems.map((step) => {
            const Icon = STEP_ICONS[step.iconKey] || BadgeInfo;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep?.(step.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  step.active
                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : step.visited
                      ? "border-[var(--line-strong)] bg-[var(--surface-1)] text-[var(--gold-ornament)]"
                      : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/25"
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

      {/* MOBILE-SHELLS: min-w-0 on the authoring pane, and previewContent
          is wrapped so the slot the binding shell passes in gets the same
          guard. Without it the implicit base column below xl is sized by
          min-width:auto and any nowrap descendant becomes the page's
          horizontal scroll width. This is the single-column rule for this
          shell: preview then editor, in DOM order, each full width minus
          the page gutter. */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0">{previewContent}</div>

        <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-6">
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

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onBack?.()}
              disabled={activeIndex === 0}
              className="cf-btn cf-btn--secondary w-full md:w-auto"
            >
              Back
            </button>

            {activeStep === "review" ? (
              <button
                type="button"
                onClick={() => onSave?.()}
                disabled={saveDisabled}
                className="cf-btn cf-btn--primary w-full md:w-auto"
              >
                {saveStatus === "saving" ? "Saving..." : "Finish draft"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNext?.()}
                className="cf-btn cf-btn--primary w-full md:w-auto"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE-SHELLS: the progress row's Save draft is a full scroll away
          on a phone, so the same action docks to the bottom edge below md.
          The progress-row button is untouched and is what renders on
          desktop. */}
      <CreateActionBar
        label={saveStatus === "saving" ? "Saving..." : "Save draft"}
        onAction={onSave}
        disabled={saveDisabled}
      />
    </>
  );
}
