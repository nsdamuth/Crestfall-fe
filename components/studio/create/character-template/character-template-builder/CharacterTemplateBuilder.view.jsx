"use client";

import {
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  Eye,
  MessageCircle,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";

const STEP_ICONS = {
  template: BookOpen,
  identity: BadgeInfo,
  appearance: Eye,
  body: Sparkles,
  behavior: MessageCircle,
  review: CheckCircle2,
};

export default function CharacterTemplateBuilderView({
  templateTitle = "",
  templateCategory = "",
  templateDescription = "",
  templateInitial = "T",
  activeStep = "template",
  activeIndex = 0,
  stepItems = [],
  completion = 0,
  filledFieldCount = 0,
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  isFinalStep = false,
  browseTemplatesContent = null,
  editorContent = null,
  onReset = null,
  onSelectStep = null,
  onBack = null,
  onNext = null,
  onSave = null,
} = {}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <CharacterTemplateSummary
        templateTitle={templateTitle}
        templateCategory={templateCategory}
        templateDescription={templateDescription}
        templateInitial={templateInitial}
        completion={completion}
        filledFieldCount={filledFieldCount}
        onReset={onReset}
      />

      <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Template Builder
            </p>

            <h2 className="mt-2 font-display text-4xl">
              {templateTitle || "New Character Template"}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
              Build a guided preset for new character drafts. Templates copy
              optional defaults into a new character and do not stay linked.
            </p>
          </div>

          {browseTemplatesContent}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                Draft Progress
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {completion}% complete — {filledFieldCount} default fields filled.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={saveDisabled}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {saveStatus === "saving" ? "Saving..." : "Save Template"}
            </button>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {stepItems.map((step) => {
              const Icon = STEP_ICONS[step.iconKey] || CheckCircle2;

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
                  <Icon size={16} />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em]">
                    {step.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {saveMessage ? (
          <p
            className={`mt-4 text-sm ${
              saveStatus === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}

        <div className="mt-6">{editorContent}</div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onBack?.()}
            disabled={activeIndex === 0}
            className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>

          {isFinalStep ? (
            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={saveDisabled}
              className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Template"}
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
  );
}

function CharacterTemplateSummary({
  templateTitle,
  templateCategory,
  templateDescription,
  templateInitial,
  completion,
  filledFieldCount,
  onReset,
}) {
  return (
    <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6 xl:sticky xl:top-24">
      <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/70 to-[var(--muted-gold)]/10">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <p className="font-display text-5xl text-[var(--muted-gold)]">
              {templateInitial}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Template Draft
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-6 font-display text-4xl">
        {templateTitle || "Untitled Template"}
      </h2>

      <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {templateCategory || "Reusable Blueprint"}
      </p>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        {templateDescription ||
          "Character templates can only be applied while creating a new character. They copy defaults into the draft and do not stay linked."}
      </p>

      <div className="mt-5 grid gap-3">
        <SummaryItem label="Completion" value={`${completion}%`} />
        <SummaryItem label="Defaults Filled" value={String(filledFieldCount)} />
        <SummaryItem label="Applies To" value="New characters only" />
      </div>

      <button
        type="button"
        onClick={() => onReset?.()}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-red-300/30 hover:text-red-100"
      >
        <RotateCcw size={14} />
        Clear Template Draft
      </button>
    </aside>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">{value}</p>
    </div>
  );
}
