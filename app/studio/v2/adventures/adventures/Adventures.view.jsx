"use client";

// Adventures (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.3; docs/SPRINT-G-
// PLAN.md section 3). Portable View: presentation only, no data
// access, no routing decisions, no business rules. Composition, top
// to bottom, exhaustive: top banner (promo-banner top treatment) with
// the build CTA -> studio-filter-bar (search, sort) -> creation-card
// grid, the public Adventure catalog -> load-more -> bottom banner
// routing to Studio. The rehosted Adventure builder opens as a
// modal-frame overlay, unrelated to page flow order.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";
import StorylineBuilderShell from "@/components/studio/storylines/StorylineBuilderShell";

function EmptyCatalog({ message }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] py-[var(--space-10)] text-center">
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {message}
      </p>
    </div>
  );
}

export default function AdventuresView({
  topBanner,
  filterBar,
  catalogItems = [],
  emptyMessage = null,
  errorMessage = null,
  loadMore,
  bottomBanner,
  isBuilderOpen = false,
  onCloseBuilder = null,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={filterBar?.searchValue ?? ""}
            searchPlaceholder={filterBar?.searchPlaceholder}
            onSearchChange={filterBar?.onSearchChange}
            filterGroups={[]}
            sortOptions={filterBar?.sortOptions ?? []}
            selectedSort={filterBar?.selectedSort ?? ""}
            onSortChange={filterBar?.onSortChange}
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
        ) : emptyMessage ? (
          <EmptyCatalog message={emptyMessage} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4">
              {catalogItems.map((item) => (
                <KitCreationCardView key={item.id} {...item} />
              ))}
            </div>

            <KitLoadMoreView
              isLoading={loadMore?.isLoading}
              hasMore={loadMore?.hasMore}
              remainingCount={loadMore?.remainingCount ?? null}
              onLoadMore={() => loadMore?.onLoadMore?.()}
            />
          </>
        )}
      </KitStudioPageView>

      {isBuilderOpen && (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-3xl"
          onClose={onCloseBuilder}
          ariaLabel="Build an Adventure"
        >
          <StorylineBuilderShell />
        </KitModalFrame>
      )}

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
