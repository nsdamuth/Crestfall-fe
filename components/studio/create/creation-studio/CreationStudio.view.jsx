"use client";

import { useEffect, useState } from "react";
import CreateTypeCard from "@/components/studio/create/CreateTypeCard";
import {
  CREATION_STUDIO_MODE_OPTIONS,
  CREATION_STUDIO_MODES,
  getAssetByTitle,
} from "./CreationStudio.contract.mjs";

export default function CreationStudioView({
  mode,
  setMode,
  quickStartAssets,
  guidedChapters,
  guidedProgress,
  recommendedGuidedStep,
  guidedAssets,
  fullStudioSections,
  creationTypeCounts,
  isLoadingCounts,
  countLoadError,
  LinkComponent = "a",
}) {
  return (
    <div className="mt-8 space-y-8">
      <ModeSelector mode={mode} onModeChange={setMode} />

      {mode === CREATION_STUDIO_MODES.QUICK ? (
        <QuickStartView assets={quickStartAssets} onModeChange={setMode} />
      ) : null}

      {mode === CREATION_STUDIO_MODES.GUIDED ? (
        <GuidedBuildView
          chapters={guidedChapters}
          progress={guidedProgress}
          recommendedStep={recommendedGuidedStep}
          guidedAssets={guidedAssets}
          creationTypeCounts={creationTypeCounts}
          isLoading={isLoadingCounts}
          loadError={countLoadError}
          onModeChange={setMode}
          LinkComponent={LinkComponent}
        />
      ) : null}

      {mode === CREATION_STUDIO_MODES.FULL ? (
        <FullStudioView sections={fullStudioSections} />
      ) : null}
    </div>
  );
}

function ModeSelector({ mode, onModeChange }) {
  return (
    <section className="sticky top-3 z-20 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/90 p-2 shadow-2xl backdrop-blur-xl">
      <div className="grid gap-2 md:grid-cols-3">
        {CREATION_STUDIO_MODE_OPTIONS.map((option) => {
          const active = option.id === mode;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onModeChange(option.id)}
              aria-pressed={active}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-transparent bg-black/20 text-[var(--muted)] hover:border-[var(--muted-gold)]/25 hover:text-[var(--foreground)]"
              }`}
            >
              <span className="block text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                {option.label}
              </span>
              <span className="mt-1 block text-xs leading-5">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function QuickStartView({ assets, onModeChange }) {
  return (
    <section>
      <SectionIntro
        eyebrow="Quick Start"
        title="Start With the Essentials"
        description="Create a person, a player identity, a place, or a reusable outfit without navigating the larger worldbuilding toolkit."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <CreateTypeCard key={asset.title} {...asset} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.GUIDED)}
          className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          Build a Complete Story →
        </button>

        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
        >
          View Every Tool →
        </button>
      </div>
    </section>
  );
}

function GuidedBuildView({
  chapters,
  progress,
  recommendedStep,
  guidedAssets,
  creationTypeCounts,
  isLoading,
  loadError,
  onModeChange,
  LinkComponent,
}) {
  const coreChapter = chapters[0] || null;
  const visibleCoreSteps = (coreChapter?.steps || []).filter(
    (step) => step.visible
  );
  const visibleChapters = chapters.filter((chapter) => chapter.visible);

  return (
    <section>
      <SectionIntro
        eyebrow="Guided Build"
        title="Build Toward a Complete Creation Foundation"
        description="Follow a recommended path through Crestfall. Nothing is locked: skip ahead at any time or open the Full Studio whenever you need a specialized tool."
      />

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em]">
        <span className="rounded-full border border-[var(--muted-gold)]/25 bg-black/35 px-3 py-2 text-[var(--muted-gold)]">
          {isLoading
            ? "Loading progress"
            : progress.coreComplete
              ? `${progress.completedStepCount} of ${progress.totalStepCount} guided milestones complete`
              : `${coreChapter?.completedStepCount || 0} of ${coreChapter?.totalStepCount || 0} core steps complete`}
        </span>

        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="rounded-full border border-white/10 px-3 py-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
        >
          View all tools
        </button>
      </div>

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Your saved progress could not be loaded, so Guided Build is showing the first recommended step. Every creation tool remains available. {loadError}
        </div>
      ) : null}

      {!progress.coreComplete ? (
        <div className="mt-6 space-y-4">
          {visibleCoreSteps.map((step) => (
            <GuidedStep
              key={step.id}
              step={step}
              asset={getAssetByTitle(guidedAssets, step.assetTitle)}
              optionalAssets={(step.optionalAssetTitles || [])
                .map((title) => getAssetByTitle(guidedAssets, title))
                .filter(Boolean)}
              creationTypeCounts={creationTypeCounts}
              LinkComponent={LinkComponent}
            />
          ))}
        </div>
      ) : (
        <>
          <CorePathCompleteBanner LinkComponent={LinkComponent} />

          {recommendedStep ? (
            <RecommendedNextPanel
              step={recommendedStep}
              asset={getAssetByTitle(guidedAssets, recommendedStep.assetTitle)}
              LinkComponent={LinkComponent}
            />
          ) : null}

          <div className="mt-6 space-y-4">
            {visibleChapters.map((chapter) => (
              <GuidedChapter
                key={chapter.id}
                chapter={chapter}
                guidedAssets={guidedAssets}
                creationTypeCounts={creationTypeCounts}
                LinkComponent={LinkComponent}
              />
            ))}
          </div>

          {progress.allComplete ? (
            <ToolkitFoundationCompletePanel
              onModeChange={onModeChange}
              LinkComponent={LinkComponent}
            />
          ) : null}
        </>
      )}
    </section>
  );
}

function CorePathCompleteBanner({ LinkComponent }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/5 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Core Story Foundation Complete
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
            Your First Story Foundation Is Ready
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Continue through the guided chapters below. Crestfall will keep recommending the next useful tool until every major Creation Studio system has a foundation.
          </p>
        </div>

        <LinkComponent
          href="/studio/my-creations"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
        >
          Open My Creations →
        </LinkComponent>
      </div>
    </div>
  );
}

function RecommendedNextPanel({ step, asset, LinkComponent }) {
  if (!step || !asset) return null;

  return (
    <article className="mt-6 rounded-2xl border border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/12 p-6 shadow-[0_0_40px_rgba(184,134,11,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--muted-gold)]/35 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Recommended Next
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {step.chapterTitle} · Milestone {step.number}
            </span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            {step.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl text-[var(--foreground)]">
            {step.title}
          </h3>
          <p className="mt-3 leading-7 text-[var(--muted)]">{step.why}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-gold)]/85">
            What this prepares: {step.next}
          </p>
        </div>

        <LinkComponent
          href={asset.href}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[var(--muted-gold)]/45 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-black/45 hover:text-[var(--foreground)]"
        >
          {getGuidedStepActionLabel(step, asset)} →
        </LinkComponent>
      </div>
    </article>
  );
}

function GuidedChapter({
  chapter,
  guidedAssets,
  creationTypeCounts,
  LinkComponent,
}) {
  const [open, setOpen] = useState(chapter.current);

  useEffect(() => {
    if (chapter.current) {
      setOpen(true);
    } else if (chapter.complete) {
      setOpen(false);
    }
  }, [chapter.complete, chapter.current]);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className={`group rounded-2xl border p-5 ${
        chapter.current
          ? "border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10"
          : "border-[var(--muted-gold)]/20 bg-black/20"
      }`}
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
                {chapter.eyebrow}
              </p>
              {chapter.complete ? (
                <span className="rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  Complete
                </span>
              ) : chapter.current ? (
                <span className="rounded-full border border-[var(--muted-gold)]/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  Current Chapter
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 font-display text-3xl text-[var(--foreground)]">
              {chapter.title}
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">
              {chapter.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              {chapter.completedStepCount} of {chapter.totalStepCount}
            </span>
            <span className="rounded-full border border-[var(--muted-gold)]/25 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
              <span className="group-open:hidden">Open</span>
              <span className="hidden group-open:inline">Close</span>
            </span>
          </div>
        </div>
      </summary>

      <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
        {chapter.steps.map((step) => (
          <GuidedChapterStep
            key={step.id}
            step={step}
            asset={getAssetByTitle(guidedAssets, step.assetTitle)}
            creationTypeCounts={creationTypeCounts}
            LinkComponent={LinkComponent}
          />
        ))}
      </div>
    </details>
  );
}

function GuidedChapterStep({
  step,
  asset,
  creationTypeCounts,
  LinkComponent,
}) {
  if (!asset) return null;

  if (step.current) {
    return (
      <GuidedStep
        step={step}
        asset={asset}
        optionalAssets={[]}
        creationTypeCounts={creationTypeCounts}
        LinkComponent={LinkComponent}
      />
    );
  }

  return (
    <article
      className={`rounded-xl border p-4 ${
        step.complete
          ? "border-[var(--muted-gold)]/20 bg-black/20"
          : "border-white/10 bg-black/20"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs ${
              step.complete
                ? "border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]"
                : "border-white/10 text-[var(--muted)]"
            }`}
          >
            {step.complete ? "✓" : step.number}
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              Milestone {step.number}
              {step.complete ? ` complete · ${step.count} created` : " · Available"}
            </p>
            <h4 className="mt-1 font-display text-xl text-[var(--foreground)]">
              {step.title}
            </h4>
            {!step.complete ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                {step.why}
              </p>
            ) : null}
          </div>
        </div>

        <LinkComponent
          href={asset.href}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
        >
          {step.complete
            ? step.id === "SECOND_STORY"
              ? "Create Another Story"
              : "Create Another"
            : getGuidedStepActionLabel(step, asset)} →
        </LinkComponent>
      </div>
    </article>
  );
}

function GuidedStep({
  step,
  asset,
  optionalAssets,
  creationTypeCounts,
  LinkComponent,
}) {
  if (!asset) return null;

  if (step.complete) {
    return (
      <article className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 text-sm text-[var(--muted-gold)]">
              ✓
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Step {step.number} complete · {step.count} created
              </p>
              <h3 className="mt-1 font-display text-2xl text-[var(--foreground)]">
                {step.title}
              </h3>
            </div>
          </div>

          <LinkComponent
            href={asset.href}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
          >
            Create Another →
          </LinkComponent>
        </div>
      </article>
    );
  }

  const statusLabel = step.current ? "Recommended next" : "Available";

  return (
    <article
      className={`rounded-2xl border p-5 md:p-6 ${
        step.current
          ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10"
          : "border-[var(--muted-gold)]/20 bg-black/30"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--muted-gold)]/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Step {step.number}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {statusLabel}
            </span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            {step.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl text-[var(--foreground)]">
            {step.title}
          </h3>
          <p className="mt-3 leading-7 text-[var(--muted)]">{step.why}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-gold)]/85">
            Why this comes next: {step.next}
          </p>
        </div>

        <LinkComponent
          href={asset.href}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          {getGuidedStepActionLabel(step, asset)} →
        </LinkComponent>
      </div>

      {optionalAssets.length ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Optional enhancements
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {optionalAssets.map((optionalAsset) => {
              const optionalType = getCreationTypeForAsset(optionalAsset.title);
              const count = optionalType
                ? Number(creationTypeCounts[optionalType] || 0)
                : 0;

              return (
                <LinkComponent
                  key={optionalAsset.title}
                  href={optionalAsset.href}
                  className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                >
                  {optionalAsset.title}
                  {count > 0 ? ` · ${count} created` : ""}
                </LinkComponent>
              );
            })}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function getGuidedStepActionLabel(step, asset) {
  if (step.id === "SECOND_STORY") {
    return "Create Second Story";
  }

  return `Create ${asset.title}`;
}

function getCreationTypeForAsset(title) {
  const typeByTitle = {
    "Player Character": "PLAYER_CHARACTER",
    "Outfit / Clothing": "OUTFIT",
    Narrator: "NARRATOR",
    Storyline: "STORYLINE",
  };

  return typeByTitle[title] || null;
}

function ToolkitFoundationCompletePanel({ onModeChange, LinkComponent }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/12 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        Guided Foundation Complete
      </p>
      <h3 className="mt-3 font-display text-3xl text-[var(--foreground)]">
        Your Crestfall Toolkit Foundation Is Ready
      </h3>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
        You have created a foundation in every major Creation Studio tool, including two Stories for connected continuity. Continue deepening the systems that best serve your world, cast, and play style.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <LinkComponent
          href="/studio/my-creations"
          className="rounded-xl border border-[var(--muted-gold)]/45 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-black/55 hover:text-[var(--foreground)]"
        >
          Open My Creations →
        </LinkComponent>
        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
        >
          Open Full Studio →
        </button>
      </div>
    </div>
  );
}

function FullStudioView({ sections }) {
  return (
    <section>
      <SectionIntro
        eyebrow="Full Studio"
        title="The Complete Crestfall Creation Toolkit"
        description="Browse every builder by purpose. These sections reorganize the existing tools without changing their routes, permissions, or behavior."
      />

      <div className="mt-6 space-y-5">
        {sections.map((section) => (
          <CreationSection key={section.id} {...section}>
            {section.assets.map((asset) => (
              <CreateTypeCard key={asset.title} {...asset} />
            ))}
          </CreationSection>
        ))}
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <header>
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-3 max-w-4xl leading-7 text-[var(--muted)]">
        {description}
      </p>
    </header>
  );
}

function CreationSection({
  eyebrow,
  title,
  description,
  defaultOpen = false,
  children,
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[var(--muted-gold)]/15 bg-black/20 p-5"
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl text-[var(--foreground)]">
              {title}
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <span className="mt-1 rounded-full border border-[var(--muted-gold)]/25 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
            <span className="group-open:hidden">Open</span>
            <span className="hidden group-open:inline">Close</span>
          </span>
        </div>
      </summary>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </details>
  );
}
