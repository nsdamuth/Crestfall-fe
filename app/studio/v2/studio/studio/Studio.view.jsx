"use client";

// Studio hub (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4; docs/BUILD-
// BLUEPRINT.md 3.1 row 6; docs/STUDIO-SPEC.md sections 1, 2, 3, 6,
// 8.1). UPDATED 24 Aug 2026 (V2 convergence product override): the
// user-facing altitude/mode ladder is restored because Quick Start, Guided
// Build, and Full Studio are validated product choices. Quick Start keeps
// the newer CREATE / BUILD / PUBLISH V2 composition. Guided Build and Full
// Studio receive the proven progressive/full-tool content through a portable
// slot from the Binding Shell. Presentation only: no data access, routing
// decisions, or business rules here.
//
// The door recipe is page-local, not a kit package: no
// components/kit/door exists yet, and this is this page's only
// consumer, so per LOOM law (a pattern promotes to components/kit
// only once a second consumer needs it) it stays here.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";
import { CREATION_STUDIO_MODES } from "@/components/studio/create/creation-studio/CreationStudio.contract.mjs";

function ZoneLabel({ children }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {children}
      </p>
      <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />
    </div>
  );
}

function Door({ label, eyebrow, description, imageSrc, isLive, onOpen }) {
  return (
    <button
      type="button"
      onClick={isLive ? () => onOpen?.() : undefined}
      disabled={!isLive}
      className={`group relative flex min-h-[17rem] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] text-center transition-[box-shadow,transform] duration-[var(--dur-hover)] ${
        isLive ? "hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)]" : "cursor-default"
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

function StudioModeSelector({ options = [], activeMode, onSelectMode }) {
  return (
    <section className="flex flex-col gap-[var(--space-3)]" aria-label="Studio creation mode">
      <div className="flex items-center gap-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          The ladder · assets → stories → adventures
        </p>
        <div aria-hidden="true" className="h-px flex-1 bg-[image:var(--line-fade)]" />
      </div>

      <div className="grid grid-cols-1 gap-[var(--space-3)] lg:grid-cols-3" role="tablist" aria-label="Studio modes">
        {options.map((option) => {
          const active = option.id === activeMode;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectMode?.(option.id)}
              className={`group flex min-h-[6.5rem] flex-col rounded-[var(--radius-md)] border p-[var(--space-4)] text-left transition-[border-color,background-color,box-shadow] duration-[var(--dur-hover)] ${
                active
                  ? "border-[var(--gold-action)] bg-[color-mix(in_srgb,var(--gold-action)_8%,var(--surface-1))] shadow-[var(--glow-hover)]"
                  : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)]"
              }`}
            >
              <div className="flex items-baseline gap-[var(--space-2)]">
                <span className="font-[family-name:var(--font-display)] text-[length:var(--text-heading)] text-[var(--gold-action)]">
                  {option.numeral}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[length:var(--text-lead)] font-medium text-[var(--ink)]">
                  {option.label}
                </span>
              </div>
              <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {option.description}
              </p>
              <div className="mt-auto pt-[var(--space-3)]">
                <div className="h-[2px] overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className={`h-full bg-[var(--gold-action)] transition-[width] ${active ? "w-full" : "w-1/3 group-hover:w-2/3"}`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CreateZone({ doors, onOpenAdvancedEditor }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <ZoneLabel>Create</ZoneLabel>
      <div className="grid grid-cols-1 gap-[var(--space-4)] min-[700px]:grid-cols-2">
        {doors.map((door) => (
          <Door key={door.id} {...door} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onOpenAdvancedEditor?.()}
        className="text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
      >
        Prefer full control? Start in the advanced editor
      </button>
    </div>
  );
}

function BuildRow({ title, description, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="flex min-w-0 flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)] text-left transition-[border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line-strong)] hover:shadow-[var(--glow-hover)]"
    >
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-lead)] leading-[var(--lh-lead)] font-medium text-[var(--ink)]">
        {title}
      </h3>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{description}</p>
      <span className="mt-auto pt-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
        Begin &rarr;
      </span>
    </button>
  );
}

function BuildZone({ onBuildStory, onBuildAdventure }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <ZoneLabel>Build</ZoneLabel>
      <div className="grid grid-cols-1 gap-[var(--space-3)] min-[700px]:grid-cols-2">
        <BuildRow
          title="Build a Story"
          description="Gather characters, a setting, and a premise into a Story, then play it."
          onOpen={onBuildStory}
        />
        <BuildRow
          title="Build an Adventure"
          description="A series of linked Stories with continuous cast, world state, and memory."
          onOpen={onBuildAdventure}
        />
      </div>
    </div>
  );
}

function PublishZone({ onOpenVault }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <ZoneLabel>Publish</ZoneLabel>
      <button
        type="button"
        onClick={() => onOpenVault?.()}
        className="text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
      >
        Ready to share? Submit finished work from the Vault
      </button>
    </div>
  );
}

export default function StudioView({
  hubExplainer,
  modeOptions = [],
  activeMode = CREATION_STUDIO_MODES.QUICK,
  onSelectMode = null,
  modeContentSlot = null,
  doors = [],
  onOpenAdvancedEditor = null,
  onBuildStory = null,
  onBuildAdventure = null,
  onOpenVault = null,
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

        <StudioModeSelector
          options={modeOptions}
          activeMode={activeMode}
          onSelectMode={onSelectMode}
        />

        {activeMode === CREATION_STUDIO_MODES.QUICK ? (
          <div className="flex flex-col gap-[var(--space-8)]">
            <CreateZone doors={doors} onOpenAdvancedEditor={onOpenAdvancedEditor} />
            <BuildZone onBuildStory={onBuildStory} onBuildAdventure={onBuildAdventure} />
            <PublishZone onOpenVault={onOpenVault} />
          </div>
        ) : (
          modeContentSlot
        )}
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
