"use client";

// The full Community composition, fixture-driven, presentation only.
// Rendered by /studio/v2/community (pre-parity staging address) and
// mirrored at /dev/ui-preview/community-v2-page so any session can
// verify the whole page without auth. All facets from
// docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 3.1 (entity type, rating
// tier, popularity, recency, remixable) are represented and work
// against the fixtures below; no live data, no API calls, no real
// navigation.
import { useMemo, useState } from "react";

import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlayView from "@/components/kit/image-overlay/KitImageOverlay.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Rating values use the presentation tiers (lib/shared/presentation/
// terminology.js): EVERYONE and ADULT map to real backend values,
// TEEN is a disabled row with no backend value yet (CR-027).
const FIXTURE_CREATIONS = [
  { id: "c1", assetKind: "character", title: "Lilith", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Lilith"), isCanon: true, ratingTier: "ADULT", isRemixable: false, plays: 10880, hearts: 2210, saves: 960, recency: 18 },
  { id: "c2", assetKind: "character", title: "Elowen", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Elowen"), isCanon: true, ratingTier: "EVERYONE", isRemixable: false, plays: 8400, hearts: 1630, saves: 440, recency: 17 },
  { id: "c3", assetKind: "character", title: "Kaela Veynskald", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Kaela Veynskald"), isCanon: true, ratingTier: "EVERYONE", isRemixable: false, plays: 5120, hearts: 880, saves: 190, recency: 16 },
  { id: "c4", assetKind: "character", title: "The Seer", subtitle: "Character · by @Crestfall", imageSrc: canonArt("The Seer"), isCanon: true, ratingTier: "ADULT", isRemixable: false, plays: 4100, hearts: 492, saves: 123, recency: 15 },
  { id: "c5", assetKind: "story", title: "The First Exile", subtitle: "Story · by @vermillion", imageSrc: creatorArt("vermillion-3"), isCanon: false, ratingTier: "EVERYONE", isRemixable: true, plays: 9800, hearts: 1240, saves: 510, recency: 14 },
  { id: "c6", assetKind: "story", title: "The Wandering Blade", subtitle: "Story · by @whiteviolin", imageSrc: creatorArt("whiteviolin"), isCanon: false, ratingTier: "ADULT", isRemixable: true, plays: 2700, hearts: 324, saves: 81, recency: 13 },
  { id: "c7", assetKind: "adventure", title: "Neon Harbor Cycle", subtitle: "Adventure · by @vermillion", imageSrc: creatorArt("vermillion-12"), isCanon: false, ratingTier: "ADULT", isRemixable: true, plays: 512, hearts: 88, saves: 19, recency: 12 },
  { id: "c8", assetKind: "adventure", title: "The Long Road West", subtitle: "Adventure · by @sassy", imageSrc: creatorArt("sassy"), isCanon: false, ratingTier: "EVERYONE", isRemixable: false, plays: 1250, hearts: 203, saves: 66, recency: 11 },
  { id: "c9", assetKind: "image", title: "Vesper Ash Render", subtitle: "Image · by @vermillion", imageSrc: creatorArt("vermillion-8"), isCanon: false, ratingTier: "EVERYONE", isRemixable: true, plays: null, hearts: 410, saves: 120, recency: 10 },
  { id: "c10", assetKind: "image", title: "Harborlight Study", subtitle: "Image · by @vermillion", imageSrc: creatorArt("vermillion-15"), isCanon: false, ratingTier: "EVERYONE", isRemixable: true, plays: null, hearts: 96, saves: 30, recency: 9 },
  { id: "c11", assetKind: "character", title: "Maya Chen", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Maya Chen"), isCanon: true, ratingTier: "EVERYONE", isRemixable: false, plays: 3300, hearts: 410, saves: 140, recency: 8 },
  { id: "c12", assetKind: "character", title: "Selena Velvet", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Selena Velvet"), isCanon: true, ratingTier: "ADULT", isRemixable: false, plays: 2900, hearts: 350, saves: 96, recency: 7 },
  { id: "c13", assetKind: "story", title: "Kaira, Princess-Errant", subtitle: "Story · by @yagirltee", imageSrc: creatorArt("yagirltee"), isCanon: false, ratingTier: "EVERYONE", isRemixable: true, plays: 4100, hearts: 492, saves: 123, recency: 6 },
  { id: "c14", assetKind: "image", title: "Cinder Veil", subtitle: "Image · by @rev", imageSrc: creatorArt("rev"), isCanon: false, ratingTier: "ADULT", isRemixable: false, plays: null, hearts: 44, saves: 9, recency: 5 },
  { id: "c15", assetKind: "character", title: "Dr. Elara Kade", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Dr. Elara Kade"), isCanon: true, ratingTier: "EVERYONE", isRemixable: false, plays: 1800, hearts: 260, saves: 71, recency: 4 },
  { id: "c16", assetKind: "story", title: "Whiteviolin Nocturne", subtitle: "Story · by @whiteviolin", imageSrc: creatorArt("whiteviolin-2"), isCanon: false, ratingTier: "ADULT", isRemixable: true, plays: 760, hearts: 130, saves: 25, recency: 3 },
];

const TYPE_OPTIONS = [
  { value: "character", label: "Characters" },
  { value: "story", label: "Stories" },
  { value: "adventure", label: "Adventures" },
  { value: "image", label: "Images" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most played" },
  { value: "recent", label: "Newest" },
  { value: "saved", label: "Most saved" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
};

const PAGE_SIZE = 8;

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4 min-[700px]:gap-[var(--space-4)]">
      {Array.from({ length: 8 }, (_, index) => (
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
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-12)] text-center">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)] backdrop-blur-[var(--blur-panel)]">
      <div className="max-w-sm rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-6)] text-center shadow-[var(--shadow-modal)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Placeholder destination
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
          Asset detail popup for &quot;{title}&quot;
        </h2>
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Specced in docs/BUILD-BLUEPRINT.md section 2.15, not built
          this batch. Share, save, and play live here when it ships.
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

export default function CommunityV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [overlayImage, setOverlayImage] = useState(null);
  const [assetDetailTitle, setAssetDetailTitle] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [lovedOverlayIds, setLovedOverlayIds] = useState([]);

  const filterGroups = useMemo(() => {
    const pool = fixtureMode === "empty" ? [] : FIXTURE_CREATIONS;
    return [
      {
        id: "type",
        label: "Type",
        isMultiSelect: true,
        // Remixable folded in as an additional option group (9 Aug
        // 2026 kit polish pass); the standalone Remixable dropdown is
        // retired.
        options: [
          ...TYPE_OPTIONS.map((option) => ({
            ...option,
            count: pool.filter((item) => item.assetKind === option.value).length,
          })),
          {
            value: "remixable",
            label: "Remixable only",
            count: pool.filter((item) => item.isRemixable).length,
          },
        ],
      },
      {
        id: "rating",
        label: "Rating",
        isMultiSelect: true,
        options: CONTENT_RATING_TIERS.map((tier) => ({
          value: tier.tier,
          label: tier.label,
          tooltip: tier.tooltip,
          isDisabled: Boolean(tier.isDisabled),
          count: tier.isDisabled
            ? null
            : pool.filter((item) => item.ratingTier === tier.tier).length,
        })),
      },
    ];
  }, [fixtureMode]);

  const filteredCreations = useMemo(() => {
    if (fixtureMode === "empty") return [];

    const query = searchValue.trim().toLowerCase();
    const typeValues = selectedValues.type || [];
    const remixOnly = typeValues.includes("remixable");
    const types = typeValues.filter((value) => value !== "remixable");
    const ratings = selectedValues.rating || [];

    const filtered = FIXTURE_CREATIONS.filter((item) => {
      if (types.length && !types.includes(item.assetKind)) return false;
      if (ratings.length && !ratings.includes(item.ratingTier)) return false;
      if (remixOnly && !item.isRemixable) return false;
      if (
        query &&
        !`${item.title} ${item.subtitle}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "popular") {
      sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (selectedSort === "recent") {
      sorted.sort((a, b) => b.recency - a.recency);
    } else if (selectedSort === "saved") {
      sorted.sort((a, b) => (b.saves || 0) - (a.saves || 0));
    }
    return sorted;
  }, [fixtureMode, searchValue, selectedValues, selectedSort]);

  const visibleCreations = filteredCreations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCreations.length;

  function toggleFilter(groupId, value) {
    setSelectedValues((current) => {
      const currentValues = current[groupId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value];
      return { ...current, [groupId]: nextValues };
    });
    setVisibleCount(PAGE_SIZE);
  }

  function toggleId(setter) {
    return (id) =>
      setter((current) =>
        current.includes(id)
          ? current.filter((entry) => entry !== id)
          : [...current, id]
      );
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);
  const toggleLovedOverlay = toggleId(setLovedOverlayIds);

  return (
    <div className="mx-auto flex max-w-[var(--container)] flex-col gap-[var(--space-6)] px-[var(--space-4)] py-[var(--space-6)] min-[700px]:px-[var(--space-6)] min-[1100px]:px-[var(--space-10)]">
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

      <StudioPageHeaderView
        eyebrow="Explore"
        title="Community"
        description="Every public creation the community has released. Discover, claim, and make it yours."
      />

      <KitStudioFilterBarView
        searchValue={searchValue}
        searchPlaceholder="Search creations"
        onSearchChange={(value) => {
          setSearchValue(value);
          setVisibleCount(PAGE_SIZE);
        }}
        filterGroups={filterGroups}
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

      {fixtureMode !== "loading" && filteredCreations.length === 0 && <EmptyState />}

      {fixtureMode !== "loading" && filteredCreations.length > 0 && (
        <>
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4"
                : "grid grid-cols-1 gap-[var(--space-3)] min-[1100px]:grid-cols-2"
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
                badges={
                  // Tag economy (2.16(c)): Canon always informs; no
                  // visibility badge in this public context; never a
                  // badge restating an active filter.
                  creation.isCanon ? [{ label: "Canon", variant: "canon" }] : []
                }
                stats={{
                  plays: creation.plays,
                  hearts: creation.hearts,
                  saves: creation.saves,
                  followers: null,
                }}
                liked={likedIds.includes(creation.id)}
                bookmarked={savedIds.includes(creation.id)}
                actionPlacement="overlay-top"
                onOpenImageOverlay={() =>
                  setOverlayImage({
                    id: creation.id,
                    imageSrc: creation.imageSrc,
                    title: creation.title,
                  })
                }
                onOpenAssetDetail={() => setAssetDetailTitle(creation.title)}
                onLike={() => toggleLiked(creation.id)}
                onBookmark={() => toggleSaved(creation.id)}
              />
            ))}
          </div>

          <KitLoadMoreView
            isLoading={false}
            hasMore={hasMore}
            remainingCount={filteredCreations.length - visibleCount}
            onLoadMore={() =>
              setVisibleCount((count) =>
                Math.min(count + PAGE_SIZE, filteredCreations.length)
              )
            }
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
        imageSrc={encodeURI(
          "/tmp-mockup-images/canon-character-images/Serapha Veyloria.png"
        )}
        onCtaClick={() => {}}
      />

      {overlayImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)] backdrop-blur-[var(--blur-panel)]">
          <KitImageOverlayView
            imageSrc={overlayImage.imageSrc}
            title={overlayImage.title}
            isLoved={lovedOverlayIds.includes(overlayImage.id)}
            isSaved={savedIds.includes(overlayImage.id)}
            onLove={() => toggleLovedOverlay(overlayImage.id)}
            onSave={() => toggleSaved(overlayImage.id)}
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
