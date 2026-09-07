"use client";

import { useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitRailView from "@/components/kit/rail/KitRail.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";
import { isLegacyDefaultCreationImageSrc } from "@/lib/shared/creations/creationMedia";


function HomeHeroBanner({ welcomeName = "Player", children }) {
  const [sheenPass, setSheenPass] = useState(0);
  const triggerSheen = () => setSheenPass((value) => value + 1);

  return (
    <div
      className="group/home-hero relative mt-[var(--space-4)] rounded-[var(--radius-lg)]"
      onMouseEnter={triggerSheen}
      onMouseLeave={triggerSheen}
    >
      {children}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--gold-ornament)_66%,transparent)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.24),0_12px_30px_rgba(0,0,0,0.22)]"
      />

      <div className="pointer-events-none absolute left-[var(--space-5)] top-[var(--space-5)] z-[3] min-[700px]:left-[var(--space-8)] min-[700px]:top-[var(--space-6)]">
        <p className="cf-art-text-readable font-display text-[clamp(1.55rem,2.35vw,2.65rem)] leading-[1.05] tracking-[-0.015em] text-[var(--art-ink)]">
          Welcome back, {welcomeName}.
        </p>
      </div>

      {sheenPass > 0 ? (
        <div
          key={sheenPass}
          aria-hidden="true"
          className="cf-home-hero-sheen pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[var(--radius-lg)]"
        >
          <span className="absolute inset-y-[-20%] left-0 w-[38%] -skew-x-12 bg-gradient-to-r from-transparent via-[rgba(255,239,196,0.12)] to-transparent blur-[2px]" />
        </div>
      ) : null}
    </div>
  );
}

function RailCard({ item }) {
  // sortValues is view-model bookkeeping for the per-list Sort control;
  // it never reaches the card.
  const { cardKind, sortValues: _sortValues, ...cardProps } = item;
  return cardKind === "creator" ? (
    <KitCreatorCardView {...cardProps} />
  ) : (
    <KitCreationCardView {...cardProps} />
  );
}

function SectionRail({ rail }) {
  if (!rail?.items?.length) return null;

  const sortControl = rail.sortControl;
  const isCreatorRail = rail.items.every((item) => item.cardKind === "creator");

  return (
    <KitRailView
      label={rail.label}
      viewAllLabel={rail.viewAllLabel}
      onViewAll={rail.onViewAll}
      cellSize={isCreatorRail ? "creator" : "fluid"}
      headControlSlot={
        sortControl?.options?.length ? (
          // Trigger reads "Sort: <value>" (colon, space, current value),
          // RULED 6 Sep 2026 (Home quick fix). The dropdown renders the
          // label and the selected value side by side, so the colon
          // rides on the label; the shared kit is untouched.
          <KitDropdownView
            label="Sort:"
            options={sortControl.options}
            selectedValues={sortControl.selectedValue ? [sortControl.selectedValue] : []}
            isMultiSelect={false}
            isDisabled={false}
            onToggleOption={(value) => sortControl.onChange?.(value)}
          />
        ) : null
      }
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
  welcomeName = "Player",
  sectionRails = [],
  bottomBanner,
  errorMessage = null,
  warningMessage = null,
  notice = null,
  onCloseNotice = null,
}) {
  const coldStartBannerImage = topBanner?.imageSrc ?? null;
  const topBannerImageSrc = continueItem
    ? continueItem.imageSrc ?? null
    : coldStartBannerImage && !isLegacyDefaultCreationImageSrc(coldStartBannerImage)
      ? coldStartBannerImage
      : null;
  const useHomeWordmarkFallback = !topBannerImageSrc;
  const visibleRails = sectionRails.filter((rail) => rail?.items?.length);

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
        <HomeHeroBanner welcomeName={welcomeName}>
          <KitPromoBannerView
            treatment="top"
            enhanceTextReadability
            showGalaxy={!useHomeWordmarkFallback}
            eyebrow={continueItem ? "Continue" : topBanner?.eyebrow}
            title={continueItem ? continueItem.title : topBanner?.title}
            line={
              continueItem
                ? `Last played ${continueItem.lastPlayedLabel} · ${continueItem.kindLabel}`
                : ""
            }
            ctaLabel={continueItem ? "Continue" : topBanner?.ctaLabel}
            imageSrc={topBannerImageSrc}
            emptyArtworkVariant={useHomeWordmarkFallback ? "crestfall-gray-wordmark" : "default"}
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
        </HomeHeroBanner>

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

        {visibleRails.length ? (
          <div className="flex flex-col gap-[var(--space-8)]">
            {visibleRails.map((rail) => (
              <SectionRail key={rail.id} rail={rail} />
            ))}
          </div>
        ) : null}
      </KitStudioPageView>

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
