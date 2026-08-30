"use client";

import { useEffect, useState } from "react";

import { getAssetByTitle } from "@/components/studio/create/creation-studio/CreationStudio.contract.mjs";
import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";
import {
  findFullStudioSectionBySlug,
  getFullStudioCategoryPresentation,
  getStudioAssetIdentityKey,
} from "./StudioModePanels.contract.mjs";

function ModeSectionLabel({ eyebrow, title, description, aside = null }) {
  return (
    <header className="flex flex-col gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-5)] lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
          {eyebrow}
        </p>
        <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3vw,2.65rem)] leading-[1.05] font-medium text-[var(--ink)]">
          {title}
        </h2>
        <p className="mt-[var(--space-3)] max-w-[58rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {description}
        </p>
      </div>
      {aside}
    </header>
  );
}

function ProgressMeter({ completed = 0, total = 0 }) {
  const safeTotal = Math.max(1, Number(total || 0));
  const safeCompleted = Math.min(safeTotal, Math.max(0, Number(completed || 0)));
  const width = `${Math.round((safeCompleted / safeTotal) * 100)}%`;

  return (
    <div className="min-w-[14rem] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)]">
      <div className="flex items-center justify-between gap-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)]">
        <span className="text-[var(--ink-faint)]">Progress</span>
        <span className="text-[var(--gold-action)]">{safeCompleted} / {Number(total || 0)}</span>
      </div>
      <div className="mt-[var(--space-2)] h-[2px] overflow-hidden rounded-full bg-[var(--line)]">
        <div className="h-full bg-[var(--gold-action)] transition-[width]" style={{ width }} />
      </div>
    </div>
  );
}

function AssetAction({
  asset,
  label,
  LinkComponent,
  onOpenCharacterCreator = null,
  onOpenPlayerCharacterCreator = null,
  primary = false,
}) {
  if (!asset) return null;
  const actorCreator =
    asset.href === "/studio/create/character"
      ? onOpenCharacterCreator
      : asset.href === "/studio/create/player-character"
        ? onOpenPlayerCharacterCreator
        : null;
  const className = primary ? "cf-btn cf-btn--primary" : "cf-btn cf-btn--secondary";

  if (actorCreator) {
    return (
      <button type="button" className={className} onClick={() => actorCreator?.()}>
        {label} →
      </button>
    );
  }

  return (
    <LinkComponent href={asset.href} className={className}>
      {label} →
    </LinkComponent>
  );
}

function RecommendedHero({
  step,
  asset,
  LinkComponent,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
}) {
  if (!step || !asset) return null;
  const identityKey = getStudioAssetIdentityKey(asset);

  return (
    <article className="relative min-h-[22rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)]">
      <div className="absolute inset-0">
        <KitArtPlaceholderView size="lg" identityKey={identityKey} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_84%,transparent)] to-[color-mix(in_srgb,var(--canvas)_28%,transparent)]"
      />
      <div className="relative z-[1] flex min-h-[22rem] max-w-[48rem] flex-col justify-center p-[clamp(1.5rem,4vw,3.25rem)]">
        <div className="flex flex-wrap items-center gap-[var(--space-2)]">
          <span className="rounded-full border border-[var(--gold-action)]/35 bg-[color-mix(in_srgb,var(--canvas)_72%,transparent)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
            Recommended next
          </span>
          <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {step.chapterTitle} · Milestone {step.number}
          </span>
        </div>
        <p className="mt-[var(--space-5)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
          {step.eyebrow}
        </p>
        <h3 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] leading-[1] font-medium text-[var(--art-ink)]">
          {step.title}
        </h3>
        <p className="mt-[var(--space-4)] max-w-[42rem] text-[length:var(--text-lead)] leading-[1.55] text-[var(--art-ink-dim)]">
          {step.why}
        </p>
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)]">
          Next: {step.next}
        </p>
        <div className="mt-[var(--space-5)]">
          <AssetAction
            asset={asset}
            label={step.id === "SECOND_STORY" ? "Create second Story" : `Create ${asset.title}`}
            LinkComponent={LinkComponent}
            onOpenCharacterCreator={onOpenCharacterCreator}
            onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
            primary
          />
        </div>
      </div>
    </article>
  );
}

function MilestoneCard({
  step,
  asset,
  LinkComponent,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
}) {
  if (!asset) return null;
  const identityKey = getStudioAssetIdentityKey(asset);

  return (
    <article
      className={`group relative flex min-h-[11.5rem] overflow-hidden rounded-[var(--radius-lg)] border text-left transition-[border-color,box-shadow,transform] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:border-[var(--line-strong)] hover:shadow-[var(--glow-hover)] ${
        step.complete
          ? "border-[var(--line)] bg-[var(--surface-1)]"
          : "border-[var(--gold-action)]/35 bg-[var(--surface-1)]"
      }`}
    >
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.015]">
        <KitArtPlaceholderView size="lg" identityKey={identityKey} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_76%,transparent)] to-[color-mix(in_srgb,var(--canvas)_30%,transparent)]"
      />

      <div className="relative z-[1] flex w-full flex-col justify-between gap-[var(--space-5)] p-[var(--space-5)]">
        <div className="flex items-start justify-between gap-[var(--space-4)]">
          <div className="min-w-0">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
              Milestone {step.number}{step.complete ? ` · ${step.count} created` : ""}
            </p>
            <h4 className="mt-[var(--space-2)] max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.1] font-medium text-[var(--art-ink)]">
              {step.title}
            </h4>
            {!step.complete ? (
              <p className="mt-[var(--space-3)] max-w-[32rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">
                {step.why}
              </p>
            ) : null}
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-[color-mix(in_srgb,var(--canvas)_72%,transparent)] text-[length:var(--text-ui)] backdrop-blur-sm ${
              step.complete
                ? "border-[var(--gold-action)]/45 text-[var(--gold-action)]"
                : "border-[var(--line-strong)] text-[var(--ink-dim)]"
            }`}
          >
            {step.complete ? "✓" : step.number}
          </span>
        </div>

        <div>
          <AssetAction
            asset={asset}
            label={step.complete ? "Create another" : `Create ${asset.title}`}
            LinkComponent={LinkComponent}
            onOpenCharacterCreator={onOpenCharacterCreator}
            onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
          />
        </div>
      </div>
    </article>
  );
}

function GuidedChapter({
  chapter,
  guidedAssets,
  LinkComponent,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
}) {
  const [open, setOpen] = useState(Boolean(chapter.current));

  useEffect(() => {
    if (chapter.current) setOpen(true);
    else if (chapter.complete) setOpen(false);
  }, [chapter.complete, chapter.current]);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)]"
    >
      <summary className="cursor-pointer list-none p-[var(--space-5)] [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-[var(--space-2)]">
              <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">{chapter.eyebrow}</p>
              {chapter.complete ? <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">Complete</span> : null}
              {chapter.current ? <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">Current chapter</span> : null}
            </div>
            <h3 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(1.55rem,2vw,2.15rem)] font-medium text-[var(--ink)]">{chapter.title}</h3>
            <p className="mt-[var(--space-2)] max-w-[58rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{chapter.description}</p>
          </div>
          <div className="flex items-center gap-[var(--space-3)]">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">{chapter.completedStepCount} / {chapter.totalStepCount}</span>
            <span className="rounded-full border border-[var(--line)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
              <span className="group-open:hidden">Open</span><span className="hidden group-open:inline">Close</span>
            </span>
          </div>
        </div>
      </summary>
      <div className="grid gap-[var(--space-3)] border-t border-[var(--line)] p-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
        {(chapter.steps || []).map((step) => (
          <MilestoneCard
            key={step.id}
            step={step}
            asset={getAssetByTitle(guidedAssets, step.assetTitle)}
            LinkComponent={LinkComponent}
            onOpenCharacterCreator={onOpenCharacterCreator}
            onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
          />
        ))}
      </div>
    </details>
  );
}

export function StudioGuidedModeView({
  chapters = [],
  progress = {},
  recommendedStep = null,
  guidedAssets = [],
  isLoading = false,
  loadError = "",
  LinkComponent = "a",
  onOpenCharacterCreator = null,
  onOpenPlayerCharacterCreator = null,
  onOpenFullStudio = null,
}) {
  const coreChapter = chapters[0] || null;
  const coreSteps = (coreChapter?.steps || []).filter((step) => step.visible);
  const recommendedAsset = recommendedStep ? getAssetByTitle(guidedAssets, recommendedStep.assetTitle) : null;
  const postCoreChapters = chapters.filter((chapter, index) => index > 0 && chapter.visible);

  return (
    <section className="space-y-[var(--space-5)]">
      <ModeSectionLabel
        eyebrow="Guided Build"
        title="Build a world one useful step at a time"
        description="Crestfall reads what you already own and recommends the next useful creation. Nothing is locked: jump ahead whenever you want, or open Full Studio for the entire toolkit."
        aside={<ProgressMeter completed={progress.completedStepCount} total={progress.totalStepCount} />}
      />

      {loadError ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--gold-action)]/30 bg-[color-mix(in_srgb,var(--gold-action)_7%,var(--surface-1))] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Your saved progress could not be loaded. Guided Build is showing the first safe path; every creation tool is still available. {loadError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-6)] text-[var(--ink-dim)]">Loading your creation path…</div>
      ) : !progress.coreComplete ? (
        <div className="space-y-[var(--space-4)]">
          {coreSteps.map((step) => {
            const asset = getAssetByTitle(guidedAssets, step.assetTitle);
            return step.current ? (
              <RecommendedHero key={step.id} step={step} asset={asset} LinkComponent={LinkComponent} onOpenCharacterCreator={onOpenCharacterCreator} onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator} />
            ) : (
              <MilestoneCard key={step.id} step={step} asset={asset} LinkComponent={LinkComponent} onOpenCharacterCreator={onOpenCharacterCreator} onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator} />
            );
          })}
        </div>
      ) : (
        <>
          <div className="rounded-[var(--radius-md)] border border-[var(--gold-action)]/30 bg-[color-mix(in_srgb,var(--gold-action)_6%,var(--surface-1))] p-[var(--space-5)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">Core Story foundation complete</p>
            <h3 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-heading)] text-[var(--ink)]">Your first playable foundation is ready.</h3>
            <p className="mt-[var(--space-2)] max-w-[58rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">Continue through the deeper chapters when they serve your project. Guided Build keeps the dependency order, but it never locks the rest of Studio.</p>
          </div>

          {recommendedStep ? <RecommendedHero step={recommendedStep} asset={recommendedAsset} LinkComponent={LinkComponent} onOpenCharacterCreator={onOpenCharacterCreator} onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator} /> : null}

          <div className="space-y-[var(--space-3)]">
            {postCoreChapters.map((chapter) => (
              <GuidedChapter key={chapter.id} chapter={chapter} guidedAssets={guidedAssets} LinkComponent={LinkComponent} onOpenCharacterCreator={onOpenCharacterCreator} onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator} />
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] border-t border-[var(--line)] pt-[var(--space-4)]">
        <p className="text-[length:var(--text-ui)] text-[var(--ink-dim)]">Need a specialist tool now? Guided Build never blocks you.</p>
        <button type="button" className="cf-btn cf-btn--secondary" onClick={() => onOpenFullStudio?.()}>Open Full Studio →</button>
      </div>
    </section>
  );
}

function FullStudioAssetCard({
  asset,
  LinkComponent,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
}) {
  const identityKey = getStudioAssetIdentityKey(asset);
  const actorCreator =
    asset.href === "/studio/create/character"
      ? onOpenCharacterCreator
      : asset.href === "/studio/create/player-character"
        ? onOpenPlayerCharacterCreator
        : null;
  const classes = "group relative flex min-h-[13rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] text-left transition-[border-color,box-shadow,transform] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:border-[var(--line-strong)] hover:shadow-[var(--glow-hover)]";
  const content = (
    <>
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.015]">
        <KitArtPlaceholderView size="lg" identityKey={identityKey} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_78%,transparent)] to-[color-mix(in_srgb,var(--canvas)_28%,transparent)]" />
      <div className="relative z-[1] mt-auto w-full p-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">{asset.eyebrow}</p>
        <h4 className="mt-[var(--space-1)] font-[family-name:var(--font-display)] text-[length:var(--text-lead)] font-medium text-[var(--art-ink)]">{asset.title}</h4>
        <p className="mt-[var(--space-2)] line-clamp-3 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">{asset.description}</p>
        <span className="mt-[var(--space-3)] block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">Open builder →</span>
      </div>
    </>
  );

  return actorCreator ? <button type="button" className={classes} onClick={() => actorCreator?.()}>{content}</button> : <LinkComponent href={asset.href} className={classes}>{content}</LinkComponent>;
}

function FullStudioCategoryCard({ section, onOpen }) {
  const presentation = getFullStudioCategoryPresentation(section?.id);
  const identityKey = presentation?.identityKey || "DESTINATION_STUDIO";
  const toolCount = Array.isArray(section?.assets) ? section.assets.length : 0;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(section.id)}
      className="group relative flex min-h-[10.5rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] text-left transition-[border-color,box-shadow,transform] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:border-[var(--line-strong)] hover:shadow-[var(--glow-hover)] md:min-h-[18rem]"
    >
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.015]">
        <KitArtPlaceholderView size="lg" identityKey={identityKey} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_66%,transparent)] to-[color-mix(in_srgb,var(--canvas)_20%,transparent)]"
      />
      <div className="relative z-[1] mt-auto w-full p-[var(--space-4)] md:p-[var(--space-5)]">
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
            {section.eyebrow}
          </p>
          <span className="rounded-full border border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_66%,transparent)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-ink-dim)]">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </span>
        </div>
        <h3 className="mt-[var(--space-2)] max-w-[34rem] font-[family-name:var(--font-display)] text-[clamp(1.45rem,2.4vw,2.35rem)] leading-[1.05] font-medium text-[var(--art-ink)]">
          {section.title}
        </h3>
        <p className="mt-[var(--space-3)] max-w-[42rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">
          {section.description}
        </p>
        <span className="mt-[var(--space-4)] block text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)] group-hover:text-[var(--gold-bright)]">
          Open category →
        </span>
      </div>
    </button>
  );
}

function FullStudioCategoryIndex({ sections = [], onSelectSection = null }) {
  return (
    <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => (
        <FullStudioCategoryCard
          key={section.id}
          section={section}
          onOpen={onSelectSection}
        />
      ))}
    </div>
  );
}

function FullStudioCategoryDetail({
  section,
  LinkComponent,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
  onBack,
}) {
  if (!section) return null;

  return (
    <section className="space-y-[var(--space-5)]">
      <button
        type="button"
        onClick={() => onBack?.()}
        className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] font-medium text-[var(--ink)] shadow-[0_8px_24px_color-mix(in_srgb,var(--canvas)_55%,transparent)] transition-[border-color,background-color,box-shadow,color,transform] duration-[var(--dur-hover)] hover:-translate-y-px hover:border-[var(--gold-action)] hover:bg-[color-mix(in_srgb,var(--gold-action)_7%,var(--surface-1))] hover:text-[var(--gold-bright)] hover:shadow-[var(--glow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-action)]/70"
        aria-label="Back to Full Studio categories"
      >
        <span aria-hidden="true" className="text-[var(--gold-action)]">←</span>
        <span>Back to Full Studio</span>
      </button>

      <div className="flex items-center gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-5)]">
        <div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">{section.eyebrow}</p>
          <h3 className="mt-[var(--space-1)] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3vw,2.65rem)] leading-[1.05] font-medium text-[var(--ink)]">{section.title}</h3>
          <p className="mt-[var(--space-3)] max-w-[60rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{section.description}</p>
        </div>
        <div aria-hidden="true" className="hidden h-px flex-1 bg-[image:var(--line-fade)] lg:block" />
      </div>

      <div className="grid gap-[var(--space-3)] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {(section.assets || []).map((asset) => (
          <FullStudioAssetCard key={asset.title} asset={asset} LinkComponent={LinkComponent} onOpenCharacterCreator={onOpenCharacterCreator} onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator} />
        ))}
      </div>
    </section>
  );
}

export function StudioFullModeView({
  sections = [],
  activeSectionSlug = "",
  LinkComponent = "a",
  onOpenCharacterCreator = null,
  onOpenPlayerCharacterCreator = null,
  onSelectSection = null,
  onBack = null,
}) {
  const requestedSection = findFullStudioSectionBySlug(sections, activeSectionSlug);
  const requestedSlug = requestedSection ? activeSectionSlug : "";
  const [displaySlug, setDisplaySlug] = useState(requestedSlug);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (requestedSlug === displaySlug) return undefined;

    setVisible(false);
    const timer = window.setTimeout(() => {
      setDisplaySlug(requestedSlug);
      window.requestAnimationFrame(() => setVisible(true));
    }, 110);

    return () => window.clearTimeout(timer);
  }, [displaySlug, requestedSlug]);

  const displayedSection = findFullStudioSectionBySlug(sections, displaySlug);

  return (
    <section className="space-y-[var(--space-6)]">
      {!displayedSection ? (
        <ModeSectionLabel
          eyebrow="Full Studio"
          title="Every builder. Every registry. One workspace."
          description="Choose a domain first, then work from the complete Crestfall authoring toolkit inside it. The builders keep their existing routes, permissions, persistence, and runtime behavior."
        />
      ) : null}

      <div
        className={`transition-[opacity,transform] duration-150 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
        aria-live="polite"
      >
        {displayedSection ? (
          <FullStudioCategoryDetail
            section={displayedSection}
            LinkComponent={LinkComponent}
            onOpenCharacterCreator={onOpenCharacterCreator}
            onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
            onBack={onBack}
          />
        ) : (
          <FullStudioCategoryIndex sections={sections} onSelectSection={onSelectSection} />
        )}
      </div>
    </section>
  );
}
