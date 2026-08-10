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

import ModalShell from "@/components/ui/ModalShell";
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
// terminology.js): EVERYONE, TEEN, and ADULT are all live, one to one
// against SFW/MATURE/EXPLICIT (CR-027, ruled final 9 Aug 2026). These
// fixture ratingTier values are illustrative only, not the result of
// the required content audit named in CR-027.
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

// Loading and empty geometric marks, RULED 10 Aug 2026 (kit polish 3
// pass): scaled up from the kit polish 2 pass's raw h-8/h-10 so they
// read clearly at both 390 and 1440 without dominating the card;
// var(--space-10) (40px, +25% from 32) for the smaller loading-tile
// mark, var(--space-14) (56px, +40% from 40) for the larger empty-
// state mark, both inside the manifest's ruled 25 to 50 percent
// range.
function GeometricMark({ className = "h-[var(--space-10)] w-[var(--space-10)]" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`${className} text-[var(--ink-faint)]`}>
      <use href="/assets/icons/icons-v7.svg#i-59" />
    </svg>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4 min-[700px]:gap-[var(--space-4)]">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="flex aspect-[3/4] animate-pulse items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)]"
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
        Nothing matches
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Clear the search or filters to see everything again.
      </p>
    </div>
  );
}

// Modal dismissal, RULED 10 Aug 2026 (kit polish 3 pass,
// docs/BUILD-BLUEPRINT.md 2.5): every modal surface closes on its own
// close control, Escape, and a backdrop click, all three. This
// placeholder and the image overlay below it predate the unified
// modal frame (2.5) and hand-rolled their own scrim divs with no
// backdrop or Escape handling; both now route through ModalShell
// (components/ui/ModalShell.jsx), which already implements the ruled
// behavior (backdrop click checked against event.target so a click
// inside the panel never bubbles into a close, Escape, and the
// existing scroll lock), rather than re-implementing it locally.
function AssetDetailPlaceholder({ title, onClose }) {
  return (
    <ModalShell
      onClose={onClose}
      ariaLabelledBy="community-asset-detail-title"
      panelClassName="max-w-sm rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-6)] text-center shadow-[var(--shadow-modal)]"
    >
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Placeholder destination
      </p>
      <h2
        id="community-asset-detail-title"
        className="mt-[var(--space-2)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]"
      >
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
    </ModalShell>
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

  // Page padding, RULED 10 Aug 2026 (kit polish 3 pass): every other
  // section keeps the page's own max-w-container, centered, padded
  // column; the sticky filter bar carries neither. A max-w wrapper
  // centers itself with an mx-auto margin whenever the available
  // column is wider than the cap, and that centering margin cannot
  // be cancelled by a fixed-token negative margin the way ordinary
  // padding can (its size depends on runtime viewport width, not a
  // token). Nesting the bar inside the capped column was the root
  // cause of its leftover inset (most visible with the sidebar
  // collapsed, since collapsing frees enough width for the cap to
  // engage at 1440 when it otherwise would not). The bar now sits
  // outside every max-w wrapper, a full-width sibling that only has
  // to escape StudioShell's own section padding (its negative margin
  // below); its own inner padding keeps its controls visually
  // aligned with the capped column around it.
  const PAGE_COLUMN =
    "mx-auto max-w-[var(--container)] px-[var(--space-4)] min-[700px]:px-[var(--space-6)] min-[1100px]:px-[var(--space-10)]";

  return (
    <div className="flex flex-col gap-[var(--space-6)] py-[var(--space-6)]">
      <div className={`flex flex-col gap-[var(--space-6)] ${PAGE_COLUMN}`}>
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
      </div>

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

      <div className={`flex flex-col gap-[var(--space-6)] ${PAGE_COLUMN}`}>
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
      </div>

      <div className={PAGE_COLUMN}>
        <KitPromoBannerView
          treatment="bottom"
          bottomVariant="uniform"
          eyebrow="Explore"
          title="Follow the creators behind every world you love."
          line=""
          ctaLabel="Browse creators"
          // Banner art, RULED 10 Aug 2026 (kit polish 3 pass): Lilith.png
          // replaces the portrait-oriented Serapha Veyloria.png, the only
          // genuinely wide, single-subject draft asset in the set (see
          // KitPromoBanner.fixtures.js for the full survey and reasoning).
          imageSrc={encodeURI(
            "/tmp-mockup-images/canon-character-images/Lilith.png"
          )}
          onCtaClick={() => {}}
        />
      </div>

      {overlayImage && (
        <ModalShell onClose={() => setOverlayImage(null)}>
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
        </ModalShell>
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
