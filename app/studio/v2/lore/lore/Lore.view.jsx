"use client";

// Lore (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.9; docs/SPRINT-G-
// PLAN.md section 4; docs/SPRINT-H-PLAN.md section 5.7). Portable
// View: presentation only, no data access, no routing decisions, no
// business rules. Composition, top to bottom, exhaustive: top banner
// (promo-banner top treatment) with the write-lore CTA, item 39
// RULED 10 Aug 2026 -> the sticky filter bar (search plus approval
// state, world or faction, and recency facets, no separate sort) ->
// centered editorial section labels, the one page in the set that
// centers them (headerAlign="center" seat on KitStudioPageView) ->
// two creation-card grids, Community Lore then Your Lore -> load-more
// on the community grid -> bottom banner routing to Home, the loop's
// closing banner.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

function SectionLabel({ children }) {
  return (
    <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
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
  communityItems = [],
  communityEmptyMessage = null,
  communityLoadMore,
  mineItems = [],
  mineEmptyMessage = null,
  bottomBanner,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
        headerAlign="center"
        headerSlot={
          <div className="flex flex-col gap-[var(--space-2)]">
            <SectionLabel>The Archive</SectionLabel>
            <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)]">
              Lore
            </h1>
            <p className="mx-auto max-w-[44rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              Read the world, write into it, and let the best of it become part of play.
            </p>
          </div>
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

        <div className="flex flex-col gap-[var(--space-4)]">
          <div className="flex flex-col items-center text-center">
            <SectionLabel>Community Lore</SectionLabel>
          </div>
          {communityEmptyMessage ? (
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
          <div className="flex flex-col items-center text-center">
            <SectionLabel>Your Lore</SectionLabel>
          </div>
          {mineEmptyMessage ? <EmptySection message={mineEmptyMessage} /> : <CardGrid items={mineItems} />}
        </div>
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
