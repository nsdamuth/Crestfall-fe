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
  onOpenCharacterCreator = null,
  showModeSelector = true,
}) {
  return (
    <div className={showModeSelector ? "mt-8 space-y-8" : "space-y-8"}>
      {showModeSelector ? (
        <ModeSelector mode={mode} onModeChange={setMode} />
      ) : null}

      {mode === CREATION_STUDIO_MODES.QUICK ? (
        <QuickStartView
          assets={quickStartAssets}
          onModeChange={setMode}
          onOpenCharacterCreator={onOpenCharacterCreator}
        />
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
        <FullStudioView
          sections={fullStudioSections}
          onOpenCharacterCreator={onOpenCharacterCreator}
        />
      ) : null}
    </div>
  );
}

function ModeSelector({ mode, onModeChange }) {
  return (
    <section className="sticky top-3 z-20 rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/90 p-2 shadow-2xl backdrop-blur-xl">
      <div className="grid gap-2 md:grid-cols-3">
        {CREATION_STUDIO_MODE_OPTIONS.map((option) => {
          const active = option.id === mode;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onModeChange(option.id)}
              aria-pressed={active}
              className={`rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "border-transparent bg-black/20 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/25 hover:text-[var(--ink)]"
              }`}
            >
              <span className="block text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
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

function QuickStartView({ assets, onModeChange, onOpenCharacterCreator }) {
  return (
    <section>
      <SectionIntro
        eyebrow="Quick Start"
        title="Start With the Essentials"
        description="Create a person, a player identity, a place, or a reusable outfit without navigating the larger worldbuilding toolkit."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <CreateTypeCard
            key={asset.title}
            {...asset}
            onOpenCreator={
              asset.href === "/studio/create/character"
                ? onOpenCharacterCreator
                : null
            }
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.GUIDED)}
          className="cf-btn cf-btn--secondary"
        >
          Build a complete story →
        </button>

        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="cf-btn cf-btn--secondary"
        >
          View every tool →
        </button>
      </div>
    </section>
  );
}

const GUIDED_MILESTONE_DEFAULT_ART = Object.freeze({
  Character: "/assets/characters/crestfall/lux/profile.png",
  "Player Character": "/assets/characters/crestfall/sun-hee/profile.png",
  Location: "/assets/locations/aethelgard/amphitheater/profile.png",
  Scenario: "/assets/covers/crestfall-camellia-cover.png",
  Story: "/assets/covers/crestfall-book-cover.png",
  Storyline: "/assets/covers/crestfall-compass-cover.png",
  "Outfit / Clothing": "/assets/covers/crestfall-cloak-cover.png",
  Wardrobe: "/assets/covers/crestfall-painting-cover.png",
  Pose: "/assets/covers/crestfall-ballerina-cover.png",
  Narrator: "/assets/covers/crestfall-scrolls-cover.png",
  "Image Preset": "/assets/covers/crestfall-drawings-cover.png",
  "NPC Registry": "/assets/characters/aethelgard/kessa/profile.png",
  "Location Registry": "/assets/locations/aethelgard/amphitheater/profile.png",
  "Faction Registry": "/assets/covers/crestfall-compass-cover.png",
  "Organization Registry": "/assets/covers/crestfall-statue-cover.png",
  "Item Registry": "/assets/covers/crestfall-cloak-cover.png",
  "Event Registry": "/assets/covers/crestfall-sundial-cover.png",
  "Quest Registry": "/assets/covers/crestfall-scrolls-cover.png",
  "Stats & Pools Profile": "/assets/covers/crestfall-statue-cover.png",
  "Progression Profile": "/assets/covers/crestfall-sundial-cover.png",
  "Mechanics Module": "/assets/covers/crestfall-drawings-cover.png",
  "Actor Mechanics Profile": "/assets/covers/crestfall-compass-cover.png",
  "Rules Codex": "/assets/covers/crestfall-book-cover.png",
  "Character Template": "/assets/characters/aethelgard/alyera/profile.png",
});

function resolveGuidedMilestoneArtwork(asset = {}) {
  return GUIDED_MILESTONE_DEFAULT_ART[asset?.title] || asset?.image || "";
}

function GuidedMilestoneArtwork({ asset = {}, emphasis = false }) {
  const image = resolveGuidedMilestoneArtwork(asset);
  if (!image) return null;

  return (
    <>
      {/* Same full-bleed image recipe used by the visibly image-backed Studio cards. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025] group-hover:saturate-110 ${
          emphasis
            ? "opacity-90 saturate-95"
            : "opacity-82 saturate-85"
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-black/18"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15"
      />
    </>
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
        <span className="rounded-full border border-[var(--gold-ornament)]/25 bg-black/35 px-3 py-2 text-[var(--gold-ornament)]">
          {isLoading
            ? "Loading progress"
            : progress.coreComplete
              ? `${progress.completedStepCount} of ${progress.totalStepCount} guided milestones complete`
              : `${coreChapter?.completedStepCount || 0} of ${coreChapter?.totalStepCount || 0} core steps complete`}
        </span>

        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="cf-btn cf-btn--tertiary"
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
    <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/5 p-[var(--space-5)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            Core Story Foundation Complete
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
            Your First Story Foundation Is Ready
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Continue through the guided chapters below. Crestfall will keep recommending the next useful tool until every major Creation Studio system has a foundation.
          </p>
        </div>

        <LinkComponent
          href="/studio/my-creations"
          className="cf-btn cf-btn--secondary shrink-0"
        >
          Open my creations →
        </LinkComponent>
      </div>
    </div>
  );
}

function RecommendedNextPanel({ step, asset, LinkComponent }) {
  if (!step || !asset) return null;

  return (
    <article className="group relative mt-6 overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/50 bg-[var(--gold-ornament)]/12 p-[var(--space-6)] shadow-[0_0_40px_rgba(184,134,11,0.08)]">
      <GuidedMilestoneArtwork asset={asset} emphasis />
      <div className="relative z-10 flex h-full flex-col justify-between gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/35 bg-black/25 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
              Recommended Next
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              {step.chapterTitle} · Milestone {step.number}
            </span>
          </div>

          <p className="mt-4 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {step.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl text-[var(--ink)]">
            {step.title}
          </h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">{step.why}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--gold-ornament)]/85">
            What this prepares: {step.next}
          </p>
        </div>

        <LinkComponent
          href={asset.href}
          className="cf-btn cf-btn--primary shrink-0 border-[var(--gold-ornament)]/35 bg-black/35 backdrop-blur-sm"
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
      className={`group rounded-[var(--radius-md)] border p-[var(--space-5)] ${
        chapter.current
          ? "border-[var(--gold-ornament)]/40 bg-[var(--gold-ornament)]/10"
          : "border-[var(--gold-ornament)]/20 bg-black/20"
      }`}
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                {chapter.eyebrow}
              </p>
              {chapter.complete ? (
                <span className="inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
                  Complete
                </span>
              ) : chapter.current ? (
                <span className="inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/30 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
                  Current Chapter
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 font-display text-3xl text-[var(--ink)]">
              {chapter.title}
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-dim)]">
              {chapter.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              {chapter.completedStepCount} of {chapter.totalStepCount}
            </span>
            <span className="inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/25 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
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
      className={`group relative min-h-[220px] overflow-hidden rounded-[var(--radius-md)] border p-[var(--space-5)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--gold-ornament)]/45 ${
        step.complete
          ? "border-[var(--gold-ornament)]/25 bg-black/35"
          : "border-white/10 bg-black/35"
      }`}
    >
      <GuidedMilestoneArtwork asset={asset} />
      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]/90">
              Milestone {step.number}
              {step.complete ? ` · ${step.count} created` : " · Available"}
            </p>
            <h4 className="mt-3 max-w-[18ch] font-display text-[1.95rem] leading-tight text-[var(--ink)]">
              {step.title}
            </h4>
            {!step.complete ? (
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink-dim)]">
                {step.why}
              </p>
            ) : null}
          </div>

          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm ${
              step.complete
                ? "border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
                : "border-white/15 bg-black/25 text-[var(--ink-dim)]"
            }`}
          >
            {step.complete ? "✓" : step.number}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)]">
            {step.complete ? "Complete" : "Recommended tool"}
          </p>
          <LinkComponent
            href={asset.href}
            className="cf-btn cf-btn--secondary cf-btn--sm shrink-0 border-[var(--gold-ornament)]/30 bg-black/35 backdrop-blur-sm"
          >
            {step.complete
              ? step.id === "SECOND_STORY"
                ? "Create another story"
                : "Create another"
              : getGuidedStepActionLabel(step, asset)} →
          </LinkComponent>
        </div>
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
      <article className="group relative min-h-[220px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/35 p-[var(--space-5)] md:p-[var(--space-6)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--gold-ornament)]/45">
        <GuidedMilestoneArtwork asset={asset} />
        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]/90">
                Step {step.number} complete · {step.count} created
              </p>
              <h3 className="mt-3 max-w-[18ch] font-display text-3xl leading-tight text-[var(--ink)]">
                {step.title}
              </h3>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 text-sm text-[var(--gold-ornament)]">
              ✓
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)]">
              Complete
            </p>
            <LinkComponent
              href={asset.href}
              className="cf-btn cf-btn--secondary cf-btn--sm shrink-0 border-[var(--gold-ornament)]/30 bg-black/35 backdrop-blur-sm"
            >
              Create another →
            </LinkComponent>
          </div>
        </div>
      </article>
    );
  }

  const statusLabel = step.current ? "Recommended next" : "Available";

  return (
    <article
      className={`group relative min-h-[260px] overflow-hidden rounded-[var(--radius-md)] border p-[var(--space-5)] md:p-[var(--space-6)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--gold-ornament)]/55 ${
        step.current
          ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
          : "border-[var(--gold-ornament)]/20 bg-black/35"
      }`}
    >
      <GuidedMilestoneArtwork asset={asset} emphasis={step.current} />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/25 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
              Step {step.number}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              {statusLabel}
            </span>
          </div>

          <p className="mt-4 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {step.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl text-[var(--ink)]">
            {step.title}
          </h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">{step.why}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--gold-ornament)]/85">
            Why this comes next: {step.next}
          </p>
        </div>

        <LinkComponent
          href={asset.href}
          className="cf-btn cf-btn--primary shrink-0"
        >
          {getGuidedStepActionLabel(step, asset)} →
        </LinkComponent>
      </div>

      {optionalAssets.length ? (
        <div className="relative z-10 mt-5 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)]">
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
                  className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
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
    return "Create second story";
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
    <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/12 p-[var(--space-6)]">
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        Guided Foundation Complete
      </p>
      <h3 className="mt-3 font-display text-3xl text-[var(--ink)]">
        Your Crestfall Toolkit Foundation Is Ready
      </h3>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">
        You have created a foundation in every major Creation Studio tool, including two Stories for connected continuity. Continue deepening the systems that best serve your world, cast, and play style.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <LinkComponent
          href="/studio/my-creations"
          className="cf-btn cf-btn--secondary"
        >
          Open my creations →
        </LinkComponent>
        <button
          type="button"
          onClick={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
          className="cf-btn cf-btn--primary"
        >
          Open full studio →
        </button>
      </div>
    </div>
  );
}

function FullStudioView({ sections, onOpenCharacterCreator }) {
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
              <CreateTypeCard
                key={asset.title}
                {...asset}
                onOpenCreator={
                  asset.href === "/studio/create/character"
                    ? onOpenCharacterCreator
                    : null
                }
              />
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
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl text-[var(--ink)]">
        {title}
      </h2>
      <p className="mt-3 max-w-4xl leading-7 text-[var(--ink-dim)]">
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
      className="group rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/15 bg-black/20 p-[var(--space-5)]"
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {eyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl text-[var(--ink)]">
              {title}
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-dim)]">
              {description}
            </p>
          </div>

          <span className="mt-1 inline-flex h-[var(--space-6)] items-center rounded-full border border-[var(--gold-ornament)]/25 px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] font-medium uppercase text-[var(--ink-dim)]">
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
