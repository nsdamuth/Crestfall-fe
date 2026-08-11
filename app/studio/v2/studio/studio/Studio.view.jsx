"use client";

// Studio hub (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4; docs/BUILD-
// BLUEPRINT.md 3.1 row 6; docs/STUDIO-SPEC.md sections 1, 2, 3, 6,
// 8.1). Portable View: presentation only, no data access, no routing
// decisions, no business rules. Composition, top to bottom,
// exhaustive: page header (StudioPageHeaderView) -> the hub explainer
// strip (KitAlertStrip neutral, the submission-hub presentation) ->
// the ladder's level selector -> the active level's pane (Quick Start
// doors plus the Story bridge strip; Guided Build's quiet Soon pane;
// Full Studio's tool card groups) -> bottom promo banner routing to
// /studio/v2/images.
//
// The level/door/tool-card recipes are page-local, not kit packages:
// no components/kit/door or components/kit/tool-card exists yet, and
// this is this page's only consumer, so per LOOM law (a pattern
// promotes to components/kit only once a second consumer needs it)
// they stay here.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

function LevelSelector({ levels, activeLevelId, onSelectLevel }) {
  return (
    <div role="tablist" aria-label="Choose a creator level" className="grid grid-cols-1 gap-[var(--space-3)] min-[900px]:grid-cols-3">
      {levels.map((level) => {
        const selected = level.id === activeLevelId;
        return (
          <button
            key={level.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelectLevel?.(level.id)}
            className={`kit-focus flex flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-5)] py-[var(--space-4)] text-left transition-colors ${
              selected
                ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)] bg-[var(--surface-1)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
            }`}
          >
            <span className="flex items-baseline gap-[var(--space-3)]">
              <span className="font-[family-name:var(--font-display)] text-[length:var(--text-heading)] leading-none text-[var(--gold-action)]">
                {level.numeral}
              </span>
              <h2
                className={`font-[family-name:var(--font-display)] text-[length:var(--text-lead)] leading-[var(--lh-lead)] font-medium ${
                  selected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"
                }`}
              >
                {level.title}
              </h2>
            </span>
            <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{level.description}</p>
            <span className="mt-[var(--space-1)] flex gap-1" aria-hidden="true">
              {[1, 2, 3].map((segment) => (
                <i
                  key={segment}
                  className={`h-1 flex-1 rounded-[var(--radius-full)] ${
                    segment <= level.depth ? "bg-[image:var(--grad-track)]" : "bg-[var(--fill)]"
                  }`}
                />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Door({ label, eyebrow, description, imageSrc, isLive, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      aria-disabled={!isLive}
      className={`kit-focus group relative flex min-h-[17rem] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] text-center transition-[box-shadow,transform] duration-[var(--dur-hover)] ${
        isLive ? "hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)]" : ""
      }`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
      ) : null}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_55%,transparent)] to-[color-mix(in_srgb,var(--canvas)_15%,transparent)] ${
          isLive ? "" : "opacity-90"
        }`}
        aria-hidden="true"
      />
      <div className="relative z-[1] flex w-full flex-col items-center gap-[var(--space-1)] p-[var(--space-5)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">{eyebrow}</p>
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-heading)] leading-[var(--lh-heading)] font-medium text-[var(--art-ink)]">
          {label}
        </h3>
        <p className="max-w-[26rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]">{description}</p>
        <span
          className={`mt-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${
            isLive ? "text-[var(--gold-action)] group-hover:text-[var(--gold-bright)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {isLive ? "Begin creation →" : "Soon"}
        </span>
      </div>
    </button>
  );
}

function ToolCard({ title, description, isLive, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      aria-disabled={!isLive}
      className="kit-focus flex min-w-0 flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)] text-left transition-[border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line-strong)] hover:shadow-[var(--glow-hover)]"
    >
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-lead)] leading-[var(--lh-lead)] font-medium text-[var(--ink)]">
        {title}
      </h3>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{description}</p>
      <span
        className={`mt-auto pt-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] whitespace-nowrap ${
          isLive ? "text-[var(--gold-action)]" : "text-[var(--ink-faint)]"
        }`}
      >
        {isLive ? "Begin →" : "Soon"}
      </span>
    </button>
  );
}

function QuickStartPane({ doors, storyBridge }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <div className="grid grid-cols-1 gap-[var(--space-4)] min-[700px]:grid-cols-2">
        {doors.map((door) => (
          <Door key={door.id} {...door} />
        ))}
      </div>
      <KitAlertStripView
        tone="neutral"
        title={storyBridge.title}
        body={storyBridge.body}
        actionLabel={storyBridge.actionLabel}
        onAction={storyBridge.onAction}
      />
    </div>
  );
}

function GuidedBuildPane({ guidedBuildSoon }) {
  return <KitAlertStripView tone="neutral" title={guidedBuildSoon.title} body={guidedBuildSoon.body} />;
}

function FullStudioPane({ toolGroups }) {
  return (
    <div className="flex flex-col gap-[var(--space-8)]">
      {toolGroups.map((group) => (
        <div key={group.id} className="flex flex-col gap-[var(--space-3)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-lead)] leading-[var(--lh-lead)] font-medium text-[var(--ink)]">
              {group.title}
            </h2>
            <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">{group.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--space-3)] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3">
            {group.cards.map((card) => (
              <ToolCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudioView({
  levels = [],
  activeLevelId = "quickStart",
  onSelectLevel = null,
  hubExplainer,
  doors = [],
  storyBridge,
  guidedBuildSoon,
  toolGroups = [],
  bottomBanner,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
        headerSlot={
          <StudioPageHeaderView
            eyebrow="Craft"
            title="Studio"
            description="Make assets, gather them into a Story, and play it. Publish the Story and it becomes an Adventure. Creations start private; everyone here is a creator."
          />
        }
        bannerSlot={
          <KitPromoBannerView
            treatment="bottom"
            bottomVariant="uniform"
            eyebrow={bottomBanner?.eyebrow}
            title={bottomBanner?.title}
            line={bottomBanner?.line}
            ctaLabel={bottomBanner?.ctaLabel}
            imageSrc={bottomBanner?.imageSrc ?? null}
            onCtaClick={() => bottomBanner?.onCtaClick?.()}
          />
        }
      >
        <KitAlertStripView tone="neutral" title={hubExplainer?.title} body={hubExplainer?.body} />

        <div className="flex flex-col gap-[var(--space-2)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            The ladder &middot; assets &rarr; Stories &rarr; Adventures
          </p>
          <LevelSelector levels={levels} activeLevelId={activeLevelId} onSelectLevel={onSelectLevel} />
        </div>

        {activeLevelId === "quickStart" ? (
          <QuickStartPane doors={doors} storyBridge={storyBridge} />
        ) : activeLevelId === "guidedBuild" ? (
          <GuidedBuildPane guidedBuildSoon={guidedBuildSoon} />
        ) : (
          <FullStudioPane toolGroups={toolGroups} />
        )}
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
