"use client";

// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Parity echo: not yet run. This page assembles the kit-batch and
// community-v2 packages on the ruled page grid; it does not yet
// re-implement every docs/APP-FUNCTION-MAP.csv row assigned to
// Explore > Community (search, type/rating filters, sort, curation
// row, creation cards, Load 12 more). That echo is a build-order
// task, not this fixture-assembly pass.

import { useMemo, useState } from "react";

import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlayView from "@/components/kit/image-overlay/KitImageOverlay.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";

function previewSvg(stopA, stopB) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${stopA}" />
          <stop offset="1" stop-color="${stopB}" />
        </linearGradient>
      </defs>
      <rect width="720" height="960" fill="url(#g)" />
      <circle cx="360" cy="320" r="150" fill="#d9bd82" opacity="0.75" />
    </svg>
  `);
  return `data:image/svg+xml,${svg}`;
}

const BANNER_IMAGE = previewSvg("#100d0a", "#5b4321");

const FIXTURE_CREATIONS = [
  {
    id: "c1",
    assetKind: "character",
    title: "Lilith",
    subtitle: "Character · by @Crestfall",
    imageSrc: previewSvg("#100d0a", "#5b4321"),
    badges: [{ label: "Canon", variant: "canon" }],
    stats: { plays: 1088, hearts: 221, saves: 96, followers: null },
  },
  {
    id: "c2",
    assetKind: "story",
    title: "The First Exile",
    subtitle: "Story · by @Crestfall",
    imageSrc: previewSvg("#0d1016", "#1c2a3a"),
    badges: [{ label: "Public", variant: "status" }],
    stats: { plays: 841, hearts: 163, saves: 44, followers: null },
  },
  {
    id: "c3",
    assetKind: "adventure",
    title: "Neon Harbor Cycle",
    subtitle: "Adventure · by @vermillion",
    imageSrc: previewSvg("#101017", "#241c10"),
    badges: [{ label: "Internal", variant: "status" }],
    stats: { plays: 512, hearts: 88, saves: 19, followers: null },
  },
  {
    id: "c4",
    assetKind: "character",
    title: "Kaira, Princess-Errant",
    subtitle: "Character · by @yagirltee",
    imageSrc: previewSvg("#1c1712", "#3a2a10"),
    badges: [{ label: "Public", variant: "status" }],
    stats: { plays: 4100, hearts: 492, saves: 123, followers: null },
  },
  {
    id: "c5",
    assetKind: "image",
    title: "Aethelred Tower",
    subtitle: "Image · by @vermillion",
    imageSrc: previewSvg("#0d1410", "#1a2f22"),
    badges: [],
    stats: { plays: null, hearts: 41, saves: 12, followers: null },
  },
  {
    id: "c6",
    assetKind: "story",
    title: "The Wandering Blade",
    subtitle: "Story · by @vermillion",
    imageSrc: previewSvg("#141014", "#2a1c2f"),
    badges: [{ label: "Public", variant: "status" }],
    stats: { plays: 2700, hearts: 324, saves: 81, followers: null },
  },
];

const FILTER_GROUPS = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "character", label: "Characters", count: 5 },
      { value: "story", label: "Stories", count: 9 },
      { value: "adventure", label: "Adventures", count: 1 },
      { value: "image", label: "Images", count: 1 },
    ],
  },
  {
    id: "rating",
    label: "Rating tier",
    options: [
      { value: "sfw", label: "SFW", count: 15 },
      { value: "mature", label: "Mature", count: 1 },
    ],
  },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most played" },
  { value: "recent", label: "Newest" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
};

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="aspect-[3/4] animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-2)]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-8)] text-center">
      <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        Nothing matches
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Clear the search or filters to see everything again.
      </p>
    </div>
  );
}

function AssetDetailPlaceholder({ title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)]">
      <div className="max-w-sm rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-6)] text-center shadow-[var(--shadow-modal)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Placeholder destination
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
          Asset detail popup for &quot;{title}&quot;
        </h2>
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Specced in docs/BUILD-BLUEPRINT.md section 2.15, not built
          this batch. This marked placeholder stands in for the real
          popup.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="cf-btn cf-btn--secondary mt-[var(--space-5)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function CommunityV2Page() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [assetDetailTitle, setAssetDetailTitle] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  const creations = useMemo(
    () => (fixtureMode === "empty" ? [] : FIXTURE_CREATIONS),
    [fixtureMode]
  );
  const visibleCreations = creations.slice(0, visibleCount);
  const hasMore = visibleCount < creations.length;

  function toggleFilter(groupId, value) {
    setSelectedValues((current) => {
      const currentValues = current[groupId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value];
      return { ...current, [groupId]: nextValues };
    });
  }

  function loadMore() {
    setIsLoadingMore(true);
    setVisibleCount((count) => Math.min(count + 4, creations.length));
    setIsLoadingMore(false);
  }

  return (
    <div className="mx-auto flex max-w-[var(--container)] flex-col gap-[var(--space-6)] px-[var(--space-4)] py-[var(--space-6)] md:px-[var(--space-6)] lg:px-[var(--space-10)]">
      <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          Fixture mode
        </span>
        {Object.entries(FIXTURE_MODES).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFixtureMode(key)}
            className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
              fixtureMode === key
                ? "border-[var(--gold-action)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <StudioPageHeaderView
        eyebrow="Explore"
        title="Community"
        description="Public creations and the people behind them. Featured surfaces the realm's best work, ready to play or remix."
      />

      <KitStudioFilterBarView
        searchValue={searchValue}
        searchPlaceholder="Search creations"
        onSearchChange={setSearchValue}
        filterGroups={FILTER_GROUPS}
        selectedValues={selectedValues}
        onFilterToggle={toggleFilter}
        sortOptions={SORT_OPTIONS}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        viewModeSlot={
          <ViewModeToggleView value={layout} label="Layout" onChange={setLayout} />
        }
      />

      {fixtureMode === "loading" && <LoadingGrid />}

      {fixtureMode === "empty" && <EmptyState />}

      {fixtureMode === "default" && (
        <>
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-2 gap-[var(--space-3)] md:grid-cols-3 lg:grid-cols-4"
                : "flex flex-col gap-[var(--space-3)]"
            }
          >
            {visibleCreations.map((creation) => (
              <KitCreationCardView
                key={creation.id}
                layout={layout}
                assetKind={creation.assetKind}
                title={creation.title}
                subtitle={creation.subtitle}
                imageSrc={creation.imageSrc}
                badges={creation.badges}
                stats={creation.stats}
                liked={likedIds.includes(creation.id)}
                bookmarked={savedIds.includes(creation.id)}
                onOpenImageOverlay={() =>
                  setOverlayImage({ imageSrc: creation.imageSrc, title: creation.title })
                }
                onOpenAssetDetail={() => setAssetDetailTitle(creation.title)}
                onShare={() => {}}
                onLike={() =>
                  setLikedIds((current) =>
                    current.includes(creation.id)
                      ? current.filter((id) => id !== creation.id)
                      : [...current, creation.id]
                  )
                }
                onBookmark={() =>
                  setSavedIds((current) =>
                    current.includes(creation.id)
                      ? current.filter((id) => id !== creation.id)
                      : [...current, creation.id]
                  )
                }
              />
            ))}
          </div>

          <KitLoadMoreView
            isLoading={isLoadingMore}
            hasMore={hasMore}
            remainingCount={creations.length - visibleCount}
            onLoadMore={loadMore}
          />
        </>
      )}

      <KitPromoBannerView
        treatment="bottom"
        bottomVariant="uniform"
        eyebrow="The realm runs deeper"
        title="Meet the makers."
        line="Follow the creators shaping the realm. New work lands from them every day."
        ctaLabel="Browse Creators"
        imageSrc={BANNER_IMAGE}
        onCtaClick={() => {}}
      />

      {overlayImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)]">
          <KitImageOverlayView
            imageSrc={overlayImage.imageSrc}
            title={overlayImage.title}
            isLoved={false}
            isSaved={false}
            onLove={() => {}}
            onSave={() => {}}
            onShare={() => {}}
            onClose={() => setOverlayImage(null)}
          />
        </div>
      )}

      {assetDetailTitle && (
        <AssetDetailPlaceholder
          title={assetDetailTitle}
          onClose={() => setAssetDetailTitle(null)}
        />
      )}
    </div>
  );
}
