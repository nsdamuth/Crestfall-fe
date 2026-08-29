"use client";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitDestinationTileView from "@/components/kit/destination-tile/KitDestinationTile.view";
import KitRailView from "@/components/kit/rail/KitRail.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

function RailCard({ item }) {
  return item.cardKind === "creator" ? (
    <KitCreatorCardView {...item} />
  ) : (
    <KitCreationCardView {...item} />
  );
}

function Rail({ rail, headControlSlot = null }) {
  if (!rail?.items?.length) return null;

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
  errorMessage = null,
  warningMessage = null,
  notice = null,
  onCloseNotice = null,
}) {
  return (
    <>
      <KitStudioPageView
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
          eyebrow={continueItem ? "Continue" : topBanner?.eyebrow}
          title={continueItem ? continueItem.title : topBanner?.title}
          line={
            continueItem
              ? `Last played ${continueItem.lastPlayedLabel} · ${continueItem.kindLabel}`
              : ""
          }
          ctaLabel={continueItem ? "Continue" : topBanner?.ctaLabel}
          imageSrc={(continueItem ? continueItem.imageSrc : null) ?? topBanner?.imageSrc ?? null}
          imageAnchor={
            (continueItem ? continueItem.imageAnchor : topBanner?.imageAnchor) ||
            undefined
          }
          onCtaClick={() =>
            (continueItem ? continueItem.onContinue : topBanner?.onCtaClick)?.()
          }
          secondaryCtaLabel={
            continueItem
              ? continueItem.secondaryCtaLabel
              : topBanner?.secondaryCtaLabel ?? ""
          }
          onSecondaryCtaClick={() =>
            (continueItem
              ? continueItem.onSecondaryCtaClick
              : topBanner?.onSecondaryCtaClick)?.()
          }
        />

        {errorMessage ? (
          <KitAlertStripView
            tone="danger"
            title="Home discovery could not be loaded."
            body={errorMessage}
          />
        ) : null}

        {warningMessage ? (
          <KitAlertStripView
            tone="warning"
            title="Some Home sections could not be refreshed."
            body={warningMessage}
          />
        ) : null}

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

        <Rail
          rail={topRatedRail}
          headControlSlot={
            topRatedRail?.items?.length ? (
              <KitDropdownView
                label="Sort"
                options={sortControl?.options ?? []}
                selectedValues={sortControl?.selectedValue ? [sortControl.selectedValue] : []}
                isMultiSelect={false}
                isDisabled={false}
                onToggleOption={(value) => sortControl?.onChange?.(value)}
              />
            ) : null
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
