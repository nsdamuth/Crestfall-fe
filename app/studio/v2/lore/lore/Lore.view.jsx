"use client";

// Lore (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.9; docs/SPRINT-G-
// PLAN.md section 4; docs/SPRINT-H-PLAN.md section 5.7). Portable
// View: presentation only, no data access, no routing decisions, no
// business rules. Composition, top to bottom, exhaustive: top banner
// (promo-banner top treatment) with the write-lore CTA, item 39
// RULED 10 Aug 2026 -> the sticky filter bar (search plus approval
// state, world or faction, and recency facets, no separate sort) ->
// left-aligned editorial labels, the standard design-system section-
// label treatment (LORE HEADER, RULING CHANGED, 10 Aug 2026 defect
// ruling: Lore no longer centers, matching the other eight pages) ->
// two creation-card grids, Community Lore then Your Lore -> load-more
// on the community grid -> bottom banner routing to Home, the loop's
// closing banner. The write-lore CTA opens the creation modal
// (modal-frame plus KitFormField fields and KitAlertStrip approval
// notice, item 39 RULED 10 Aug 2026), unrelated to page flow order.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

// Standard section-label treatment (StudioPageHeaderView's eyebrow
// recipe, LORE HEADER RULING): gold uppercase, one short gold rule to
// its right via the after: pseudo-element, never a line on the left,
// no arrow or caret. Reused here for the two grid section labels
// (Community Lore, Your Lore), which are page-local labels, not the
// page eyebrow itself (that's StudioPageHeaderView, below).
function SectionLabel({ children }) {
  return (
    <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
      {children}
    </p>
  );
}

function EmptySection({ message }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] py-[var(--space-10)] text-center">
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {message}
      </p>
    </div>
  );
}


function TimelineGrid({ items = [] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => item.onOpen?.()}
          className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/30 text-left transition hover:border-[var(--gold-ornament)]/40"
        >
          <div className="grid min-h-36 grid-cols-[7rem_1fr]">
            <div className="overflow-hidden border-r border-[var(--line)]" aria-hidden="true">
              {item.imageSrc ? (
                <div
                  className="h-full w-full bg-cover bg-center opacity-80 transition group-hover:opacity-100"
                  style={{ backgroundImage: `url(${item.imageSrc})` }}
                />
              ) : (
                <KitArtPlaceholderView size="sm" identityKey={item.identityKey || "TIMELINE"} />
              )}
            </div>
            <div className="min-w-0 p-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
                <span>{item.publicEnabled ? "Public Timeline" : "Internal Timeline"}</span>
                <span className="text-[var(--ink-faint)]">•</span>
                <span className="text-[var(--ink-faint)]">{item.entryCount} Lore</span>
              </div>
              <p className="mt-2 break-words font-display text-xl text-[var(--ink)]">{item.title}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">{item.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function CardGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4">
      {items.map((item) => (
        <KitCreationCardView key={item.id} {...item} />
      ))}
    </div>
  );
}

export default function LoreView({
  topBanner,
  filterBar,
  timelineItems = [],
  timelineError = null,
  timelineEmptyMessage = null,
  onBuildTimeline = null,
  communityItems = [],
  communityError = null,
  communityEmptyMessage = null,
  communityLoadMore,
  mineItems = [],
  mineError = null,
  mineEmptyMessage = null,
  errorMessage = null,
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
            eyebrow="The Archive"
            title="Lore"
            description="Read the world, write into it, and let the best of it become part of play."
          />
        }
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={filterBar?.searchValue ?? ""}
            searchPlaceholder={filterBar?.searchPlaceholder}
            onSearchChange={filterBar?.onSearchChange}
            filterGroups={filterBar?.filterGroups ?? []}
            selectedValues={filterBar?.selectedValues ?? {}}
            onFilterToggle={filterBar?.onFilterToggle}
            sortOptions={[]}
          />
        }
        bannerSlot={
          <KitPromoBannerView
            treatment="bottom"
            bottomVariant="uniform"
            eyebrow={bottomBanner?.eyebrow}
            title={bottomBanner?.title}
            line=""
            ctaLabel={bottomBanner?.ctaLabel}
            imageSrc={bottomBanner?.imageSrc ?? null}
            onCtaClick={() => bottomBanner?.onCtaClick?.()}
          />
        }
      >
        <KitPromoBannerView
          treatment="top"
          eyebrow={topBanner?.eyebrow}
          title={topBanner?.title}
          line=""
          ctaLabel={topBanner?.ctaLabel}
          imageSrc={topBanner?.imageSrc ?? null}
          onCtaClick={() => topBanner?.onCtaClick?.()}
        />

        {errorMessage ? (
          <KitAlertStripView tone="danger" title={errorMessage} body="Try refreshing the page." />
        ) : (
          <>
            <div className="flex flex-col gap-[var(--space-4)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionLabel>Your Timelines</SectionLabel>
                <button type="button" onClick={() => onBuildTimeline?.()} className="cf-btn cf-btn--primary">
                  Build Timeline
                </button>
              </div>
              {timelineError ? (
                <KitAlertStripView
                  tone="danger"
                  title="Your Timelines could not be loaded."
                  body={timelineError}
                />
              ) : timelineEmptyMessage ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-5 py-8 text-center">
                  <p className="text-sm text-[var(--ink-dim)]">{timelineEmptyMessage}</p>
                  <button type="button" onClick={() => onBuildTimeline?.()} className="cf-btn mt-4">
                    Build your first Timeline
                  </button>
                </div>
              ) : (
                <TimelineGrid items={timelineItems} />
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <SectionLabel>Community Lore</SectionLabel>
              {communityError ? (
                <KitAlertStripView
                  tone="danger"
                  title="Community Lore could not be loaded."
                  body={communityError}
                />
              ) : communityEmptyMessage ? (
                <EmptySection message={communityEmptyMessage} />
              ) : (
                <>
                  <CardGrid items={communityItems} />
                  <KitLoadMoreView
                    isLoading={communityLoadMore?.isLoading}
                    hasMore={communityLoadMore?.hasMore}
                    remainingCount={communityLoadMore?.remainingCount ?? null}
                    onLoadMore={() => communityLoadMore?.onLoadMore?.()}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <SectionLabel>Your Lore</SectionLabel>
              {mineError ? (
                <KitAlertStripView
                  tone="danger"
                  title="Your Lore could not be loaded."
                  body={mineError}
                />
              ) : mineEmptyMessage ? (
                <EmptySection message={mineEmptyMessage} />
              ) : (
                <CardGrid items={mineItems} />
              )}
            </div>
          </>
        )}
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
