"use client";

// The full Creators composition, fixture-driven, presentation only.
// Rendered by /studio/v2/creators (pre-parity staging address) and
// mirrored at /dev/ui-preview/creators-v2-page. Build order row 2
// (docs/BUILD-BLUEPRINT.md 3.1): reuses page 1's skeleton wholesale
// (filter bar, load-more), introduces the creator-card species in
// page composition. No live data, no API calls, no real navigation.
import { useCallback, useMemo, useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

// Twelve or more fixture creators (plan section 6.3): handles,
// follower/play/work counts, zero to three thumbnails, avatars mixed
// with initial fallbacks (avatarSrc: null renders the handle's first
// letter per KitCreatorCardView).
const FIXTURE_CREATORS = [
  { id: "cr1", handle: "@vermillion", avatarSrc: creatorArt("vermillion"), followers: 4820, plays: 21400, works: 25, recency: 20, thumbnails: [creatorArt("vermillion-2"), creatorArt("vermillion-3"), creatorArt("vermillion-8")] },
  { id: "cr2", handle: "@whiteviolin", avatarSrc: creatorArt("whiteviolin"), followers: 3110, plays: 9800, works: 12, recency: 19, thumbnails: [creatorArt("whiteviolin-2")] },
  { id: "cr3", handle: "@yagirltee", avatarSrc: creatorArt("yagirltee"), followers: 2650, plays: 7400, works: 9, recency: 18, thumbnails: [creatorArt("vermillion-9"), creatorArt("vermillion-10")] },
  { id: "cr4", handle: "@sassy", avatarSrc: creatorArt("sassy"), followers: 1980, plays: 3120, works: 6, recency: 17, thumbnails: [] },
  { id: "cr5", handle: "@rev", avatarSrc: creatorArt("rev"), followers: 1540, plays: 2600, works: 5, recency: 16, thumbnails: [creatorArt("vermillion-11")] },
  { id: "cr6", handle: "@nightloom", avatarSrc: null, followers: 5600, plays: 15200, works: 18, recency: 15, thumbnails: [creatorArt("vermillion-12"), creatorArt("vermillion-13"), creatorArt("vermillion-14")] },
  { id: "cr7", handle: "@amberquill", avatarSrc: canonArt("Kaela Veynskald"), followers: 990, plays: 1800, works: 4, recency: 14, thumbnails: [creatorArt("vermillion-15")] },
  { id: "cr8", handle: "@driftwood", avatarSrc: null, followers: 3400, plays: 6100, works: 10, recency: 13, thumbnails: [creatorArt("vermillion-16"), creatorArt("vermillion-17")] },
  { id: "cr9", handle: "@ravenwatch", avatarSrc: canonArt("Selena Velvet"), followers: 2200, plays: 4900, works: 8, recency: 12, thumbnails: [creatorArt("vermillion-18"), creatorArt("vermillion-19"), creatorArt("vermillion-20")] },
  { id: "cr10", handle: "@lanterngate", avatarSrc: null, followers: 780, plays: 1200, works: 3, recency: 11, thumbnails: [] },
  { id: "cr11", handle: "@cinderfall", avatarSrc: creatorArt("vermillion-21"), followers: 6700, plays: 24800, works: 30, recency: 10, thumbnails: [creatorArt("vermillion-22"), creatorArt("vermillion-24")] },
  { id: "cr12", handle: "@moonglass", avatarSrc: null, followers: 410, plays: 640, works: 2, recency: 9, thumbnails: [creatorArt("vermillion-25")] },
  { id: "cr13", handle: "@verdigris", avatarSrc: canonArt("Dr. Elara Kade"), followers: 1320, plays: 2450, works: 5, recency: 8, thumbnails: [creatorArt("vermillion-4")] },
];

const SORT_OPTIONS = [
  { value: "followers", label: "Most followed" },
  { value: "plays", label: "Most played" },
  { value: "hearts", label: "Most hearted" },
  { value: "recent", label: "Recently active" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
};

const PAGE_SIZE = 9;

function GeometricMark({ className = "h-[var(--space-10)] w-[var(--space-10)]" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`${className} text-[var(--ink-faint)]`}>
      <use href="/assets/icons/icons-v7.svg#i-59" />
    </svg>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-[var(--space-3)] min-[700px]:grid-cols-2 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => (
        <div
          key={index}
          className="flex aspect-[4/3] animate-pulse items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)]"
        >
          <GeometricMark />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-12)] text-center">
      <GeometricMark className="h-[var(--space-14)] w-[var(--space-14)]" />
      <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        No creators match
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Clear the search to see everyone again.
      </p>
    </div>
  );
}

export default function CreatorsV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState("followers");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [followingIds, setFollowingIds] = useState([]);
  const [overlayImage, setOverlayImage] = useState(null);

  const filteredCreators = useMemo(() => {
    if (fixtureMode === "empty") return [];

    const query = searchValue.trim().toLowerCase();
    const filtered = FIXTURE_CREATORS.filter((creator) =>
      query ? creator.handle.toLowerCase().includes(query) : true
    );

    const sorted = [...filtered];
    if (selectedSort === "plays") {
      sorted.sort((a, b) => b.plays - a.plays);
    } else if (selectedSort === "hearts") {
      // Hearted stat is not carried on the creator-card contract
      // (KitCreatorCard stats{} is followers/plays/works only); this
      // sort orders by works as the closest available proxy until a
      // hearts stat is ruled for creators, logged in the report.
      sorted.sort((a, b) => b.works - a.works);
    } else if (selectedSort === "recent") {
      sorted.sort((a, b) => b.recency - a.recency);
    } else {
      sorted.sort((a, b) => b.followers - a.followers);
    }
    return sorted;
  }, [fixtureMode, searchValue, selectedSort]);

  const visibleCreators = filteredCreators.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCreators.length;

  const toggleFollowing = useCallback((id) => {
    setFollowingIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  }, []);

  // Perf audit (Sprint A polish, Phase 6): FIXTURE_CREATORS is a
  // stable module-level array, so each creator's stats and thumbnail
  // props only need to be built once rather than on every render
  // (every keystroke of search previously rebuilt these for all
  // thirteen cards). isFollowing is looked up separately since it is
  // the one per-card value that actually changes.
  const creatorCardPropsById = useMemo(() => {
    const map = new Map();
    for (const creator of FIXTURE_CREATORS) {
      map.set(creator.id, {
        stats: { followers: creator.followers, plays: creator.plays, works: creator.works },
        thumbnails: creator.thumbnails.map((imageSrc, index) => ({
          id: `${creator.id}-thumb-${index}`,
          imageSrc,
          alt: `${creator.handle} recent work ${index + 1}`,
        })),
      });
    }
    return map;
  }, []);

  // Stable per-card callbacks, built once (creator objects themselves
  // are stable references from the module-level fixture array;
  // toggleFollowing and setOverlayImage are both stable setters).
  const cardHandlersById = useMemo(() => {
    const map = new Map();
    for (const creator of FIXTURE_CREATORS) {
      map.set(creator.id, {
        onFollow: () => toggleFollowing(creator.id),
        onThumbnailOpen: (thumbnailId) => {
          const thumbnail = creator.thumbnails.find(
            (_, index) => `${creator.id}-thumb-${index}` === thumbnailId
          );
          if (thumbnail) {
            setOverlayImage({ id: thumbnailId, imageSrc: thumbnail, title: creator.handle });
          }
        },
        onViewProfile: () => {},
      });
    }
    return map;
  }, [toggleFollowing]);

  return (
    <>
    <KitStudioPageView
      harnessSlot={
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
                  ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      }
      headerSlot={
        <StudioPageHeaderView
          eyebrow="Explore"
          title="Creators"
          description="Find whose worlds you love and keep them close."
        />
      }
      filterBarSlot={
        <KitStudioFilterBarView
          searchValue={searchValue}
          searchPlaceholder="Search creators"
          onSearchChange={(value) => {
            setSearchValue(value);
            setVisibleCount(PAGE_SIZE);
          }}
          filterGroups={[]}
          selectedValues={{}}
          onFilterToggle={() => {}}
          sortOptions={SORT_OPTIONS}
          selectedSort={selectedSort}
          onSortChange={(value) => {
            setSelectedSort(value);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      }
      bannerSlot={
        <KitPromoBannerView
          treatment="bottom"
          bottomVariant="uniform"
          eyebrow="Explore"
          title="Read the world the community is writing."
          line=""
          ctaLabel="Read the lore"
          imageSrc={encodeURI("/tmp-mockup-images/canon-character-images/Lilith.png")}
          onCtaClick={() => {}}
        />
      }
    >
        {fixtureMode === "loading" && <LoadingGrid />}

        {fixtureMode !== "loading" && filteredCreators.length === 0 && <EmptyState />}

        {fixtureMode !== "loading" && filteredCreators.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-[var(--space-3)] min-[700px]:grid-cols-2 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-3">
              {visibleCreators.map((creator) => {
                const cardProps = creatorCardPropsById.get(creator.id);
                const handlers = cardHandlersById.get(creator.id);
                return (
                  <KitCreatorCardView
                    key={creator.id}
                    handle={creator.handle}
                    avatarSrc={creator.avatarSrc}
                    stats={cardProps.stats}
                    thumbnails={cardProps.thumbnails}
                    isFollowing={followingIds.includes(creator.id)}
                    onThumbnailOpen={handlers.onThumbnailOpen}
                    onFollow={handlers.onFollow}
                    onViewProfile={handlers.onViewProfile}
                  />
                );
              })}
            </div>

            <KitLoadMoreView
              isLoading={false}
              hasMore={hasMore}
              remainingCount={filteredCreators.length - visibleCount}
              onLoadMore={() =>
                setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredCreators.length))
              }
            />
          </>
        )}
    </KitStudioPageView>

    {overlayImage && (
      <KitImageOverlay
        imageSrc={overlayImage.imageSrc}
        title={overlayImage.title}
        isLoved={false}
        isSaved={false}
        onLove={() => {}}
        onSave={() => {}}
        onShare={() => {}}
        onClose={() => setOverlayImage(null)}
      />
    )}
    </>
  );
}
