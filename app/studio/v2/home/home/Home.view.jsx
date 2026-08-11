"use client";

// Home, the ruled guidepost (docs/CRESTFALL-DESIGN-CONTEXT.md, 10 Aug
// 2026 ruling; docs/SPRINT-G-PLAN.md section 1). Portable View:
// presentation only, no data access, no routing decisions, no
// business rules. Composition, top to bottom, exhaustive: medium top
// banner (promo-banner top treatment, galaxy on) -> Continue strip
// (nothing when empty) -> eight destination tiles -> four KitRail
// instances, the top rail alone seating the sort dropdown -> medium
// bottom banner routing to Stories.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitDestinationTileView from "@/components/kit/destination-tile/KitDestinationTile.view";
import KitRailView from "@/components/kit/rail/KitRail.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

function RailCard({ item }) {
  if (item.cardKind === "creator") {
    return <KitCreatorCardView {...item} />;
  }
  return <KitCreationCardView {...item} />;
}

function Rail({ rail, headControlSlot = null }) {
  return (
    <KitRailView
      label={rail.label}
      viewAllLabel={rail.viewAllLabel}
      onViewAll={rail.onViewAll}
      headControlSlot={headControlSlot}
    >
      {rail.items.map((item) => (
        <RailCard key={item.id} item={item} />
      ))}
    </KitRailView>
  );
}

export default function HomeView({
  topBanner,
  continueItem = null,
  destinationTiles = [],
  topRatedRail,
  recentlyAddedRail,
  fromTheCommunityRail,
  creatorsToFollowRail,
  sortControl,
  bottomBanner,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
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
          showGalaxy
          eyebrow={topBanner?.eyebrow}
          title={topBanner?.title}
          line=""
          ctaLabel={topBanner?.ctaLabel}
          imageSrc={topBanner?.imageSrc ?? null}
          onCtaClick={() => topBanner?.onCtaClick?.()}
        />

        {continueItem && (
          <KitPromoBannerView
            treatment="card"
            eyebrow="Continue"
            title={continueItem.title}
            line={`Last played ${continueItem.lastPlayedLabel} · ${continueItem.kindLabel}`}
            ctaLabel="Continue"
            imageSrc={continueItem.imageSrc ?? null}
            onCtaClick={() => continueItem.onContinue?.()}
          />
        )}

        {destinationTiles.length > 0 && (
          <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4">
            {destinationTiles.map((tile) => (
              <KitDestinationTileView
                key={tile.id}
                label={tile.label}
                supportingLine={tile.supportingLine}
                imageSrc={tile.imageSrc ?? null}
                onOpen={() => tile.onOpen?.()}
              />
            ))}
          </div>
        )}

        <Rail
          rail={topRatedRail}
          headControlSlot={
            <KitDropdownView
              label="Sort"
              options={sortControl?.options ?? []}
              selectedValues={sortControl?.selectedValue ? [sortControl.selectedValue] : []}
              isMultiSelect={false}
              isDisabled={false}
              onToggleOption={(value) => sortControl?.onChange?.(value)}
            />
          }
        />
        <Rail rail={recentlyAddedRail} />
        <Rail rail={fromTheCommunityRail} />
        <Rail rail={creatorsToFollowRail} />
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
