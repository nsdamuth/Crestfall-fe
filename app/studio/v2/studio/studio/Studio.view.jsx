"use client";

// Studio hub (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4; docs/BUILD-
// BLUEPRINT.md 3.1 row 6; docs/STUDIO-SPEC.md sections 1, 2, 3, 6,
// 8.1). RESHAPED 23 Aug 2026 (build-0823 pass 4, RULED): the altitude
// tablist (LevelSelector, three panes) is removed. One calm scroll,
// three zones in order, plain zone labels, nothing numbered or
// mandatory-sequential: CREATE (the live quick-create doors plus the
// advanced-editor line), BUILD (Build a Story, Build an Adventure),
// PUBLISH (one line routing to Vault). Portable View: presentation
// only, no data access, no routing decisions, no business rules.
//
// The Full Studio tool-card grid (11 cards, 10 Soon) does not fit the
// ruled three-zone model and is dropped from this page; its one live
// path (the Character door) is already covered by CREATE.
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

        <div className="flex flex-col gap-[var(--space-8)]">
          <CreateZone doors={doors} onOpenAdvancedEditor={onOpenAdvancedEditor} />
          <BuildZone onBuildStory={onBuildStory} onBuildAdventure={onBuildAdventure} />
          <PublishZone onOpenVault={onOpenVault} />
        </div>
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
