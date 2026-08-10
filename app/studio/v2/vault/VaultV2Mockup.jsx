"use client";

// The full Vault composition, fixture-driven, presentation only.
// Rendered by /studio/v2/vault (pre-parity staging address) and
// mirrored at /dev/ui-preview/vault-v2-page. Build order row 3
// (docs/BUILD-BLUEPRINT.md 3.1): full skeleton, list AND grid
// creation-card layouts, introduces the own-work badge context. The
// standalone edit tree (my-creations/[id]/edit) stays out of scope
// under the CR-007/CR-008 partial hold; no edit, delete, or bulk
// affordance appears anywhere on this page. No live data, no API
// calls, no real navigation.
import { useMemo, useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";
import KitAssetDetailPopup from "@/components/kit/KitAssetDetailPopup";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import FixtureActionNotice from "../FixtureActionNotice";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Visibility badge label per the product model's ruled four-state
// enum (section 5). Canon items carry the Canon badge instead of a
// visibility badge (tag economy 2.16(c): Canon always informs).
const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  INTERNAL: "Internal",
  PUBLIC: "Public",
};

// Sixteen or more fixture items (plan section 7.3): owned work across
// all four visibilities plus several saved-from-others public items.
const FIXTURE_VAULT_ITEMS = [
  { id: "v1", assetKind: "character", title: "Ashwynn Vale", subtitle: "Character", imageSrc: canonArt("Alyera Valecourt"), isOwn: true, visibility: "PRIVATE", plays: 40, hearts: 3, saves: 1, recency: 20, description: "A private draft, not yet shared." },
  { id: "v2", assetKind: "story", title: "The Hollow Road", subtitle: "Story", imageSrc: creatorArt("vermillion-2"), extraMedia: [creatorArt("vermillion-6"), creatorArt("vermillion-7")], isOwn: true, visibility: "PRIVATE", plays: 12, hearts: 1, saves: 0, recency: 19, description: "An unfinished story, private while drafting.", credits: [{ id: "v2-credit-narrator", kindLabel: "Narrator", creatorHandle: "@vermillion", creatorHref: "/studio/profile/vermillion", assetTitle: null }] },
  { id: "v3", assetKind: "adventure", title: "Salt Marsh Run", subtitle: "Adventure", imageSrc: creatorArt("vermillion-4"), extraMedia: [creatorArt("vermillion-5")], isOwn: true, visibility: "PRIVATE", plays: 5, hearts: 0, saves: 0, recency: 18, description: "A private adventure sketch.", credits: [{ id: "v3-credit-location", kindLabel: "Location", creatorHandle: "@Crestfall", creatorHref: "/studio/profile/Crestfall", assetTitle: "Salt Marsh" }] },
  { id: "v4", assetKind: "image", title: "Study, Untitled", subtitle: "Image", imageSrc: creatorArt("vermillion-5"), isOwn: true, visibility: "PRIVATE", plays: null, hearts: 2, saves: 0, recency: 17 },
  { id: "v5", assetKind: "character", title: "Corwin Bex", subtitle: "Character", imageSrc: canonArt("Jax Riker"), isOwn: true, visibility: "INTERNAL", plays: 180, hearts: 22, saves: 6, recency: 16, description: "Shared with the internal test group only." },
  { id: "v6", assetKind: "story", title: "Nine Coin Night", subtitle: "Story", imageSrc: creatorArt("vermillion-6"), isOwn: true, visibility: "INTERNAL", plays: 240, hearts: 40, saves: 10, recency: 15, description: "Internal-only story, feedback pending." },
  { id: "v7", assetKind: "image", title: "Palette Test", subtitle: "Image", imageSrc: creatorArt("vermillion-7"), isOwn: true, visibility: "INTERNAL", plays: null, hearts: 9, saves: 2, recency: 14 },
  { id: "v8", assetKind: "adventure", title: "The Ferry Contract", subtitle: "Adventure", imageSrc: creatorArt("vermillion-9"), isOwn: true, isRemix: true, visibility: "INTERNAL", plays: 60, hearts: 8, saves: 3, recency: 13, description: "Remixed from another creator's adventure, internal playtest build." },
  { id: "v9", assetKind: "character", title: "Delphine Roux", subtitle: "Character", imageSrc: canonArt("Rachel Sentry"), isOwn: true, visibility: "PUBLIC", plays: 3400, hearts: 610, saves: 220, recency: 12, description: "Released to the community." },
  { id: "v10", assetKind: "story", title: "Coldwater Vigil", subtitle: "Story", imageSrc: creatorArt("vermillion-10"), isOwn: true, visibility: "PUBLIC", plays: 5200, hearts: 900, saves: 340, recency: 11, description: "A finished, published story." },
  { id: "v11", assetKind: "image", title: "Harbor at Dusk", subtitle: "Image", imageSrc: creatorArt("vermillion-11"), isOwn: true, visibility: "PUBLIC", plays: null, hearts: 210, saves: 80, recency: 10 },
  { id: "v12", assetKind: "character", title: "Lilith", subtitle: "Character", imageSrc: canonArt("Lilith"), isOwn: true, visibility: "CANON", isCanon: true, plays: 10880, hearts: 2210, saves: 960, recency: 9, description: "A canon character woven into the founding myth of the realm." },
  { id: "v13", assetKind: "story", title: "The First Exile", subtitle: "Story", imageSrc: creatorArt("vermillion-3"), isOwn: true, visibility: "CANON", isCanon: true, plays: 9800, hearts: 1240, saves: 510, recency: 8, description: "A canon story arc, released community-wide." },
  { id: "v14", assetKind: "character", title: "Kaela Veynskald", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Kaela Veynskald"), isOwn: false, visibility: "PUBLIC", plays: 5120, hearts: 880, saves: 190, recency: 7, description: "Saved from the Community, not your own work." },
  { id: "v15", assetKind: "story", title: "The Wandering Blade", subtitle: "Story · by @whiteviolin", imageSrc: creatorArt("whiteviolin"), isOwn: false, isRemix: true, visibility: "PUBLIC", plays: 2700, hearts: 324, saves: 81, recency: 6, description: "Saved from the Community, not your own work." },
  { id: "v16", assetKind: "image", title: "Vesper Ash Render", subtitle: "Image · by @vermillion", imageSrc: creatorArt("vermillion-8"), isOwn: false, visibility: "PUBLIC", plays: null, hearts: 410, saves: 120, recency: 5 },
  { id: "v17", assetKind: "adventure", title: "Neon Harbor Cycle", subtitle: "Adventure · by @vermillion", imageSrc: creatorArt("vermillion-12"), isOwn: false, visibility: "PUBLIC", plays: 512, hearts: 88, saves: 19, recency: 4, description: "Saved from the Community, not your own work." },
  { id: "v18", assetKind: "character", title: "Maya Chen", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Maya Chen"), isOwn: false, visibility: "PUBLIC", plays: 3300, hearts: 410, saves: 140, recency: 3, description: "Saved from the Community, not your own work." },
];

const TYPE_OPTIONS = [
  { value: "character", label: "Characters" },
  { value: "story", label: "Stories" },
  { value: "adventure", label: "Adventures" },
  { value: "image", label: "Images" },
];

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "INTERNAL", label: "Internal" },
  { value: "PUBLIC", label: "Public" },
  { value: "CANON", label: "Canon" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Newest" },
  { value: "popular", label: "Most played" },
  { value: "saved", label: "Most saved" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
};

const PAGE_SIZE = 8;

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
        Nothing here yet
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Create something, or save work you love from the Community.
      </p>
    </div>
  );
}

export default function VaultV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [overlayImage, setOverlayImage] = useState(null);
  const [assetDetailId, setAssetDetailId] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);

  const activeVisibilityValues = selectedValues.visibility || [];

  const filterGroups = useMemo(() => {
    const pool = fixtureMode === "empty" ? [] : FIXTURE_VAULT_ITEMS;
    return [
      {
        id: "type",
        label: "Type",
        isMultiSelect: true,
        // Remix folded in as an additional option row (R10, RULED 10
        // Aug 2026, docs/BUILD-BLUEPRINT.md 2.16(k) fold-in semantics):
        // the standalone Remixable dropdown stays retired.
        options: [
          ...TYPE_OPTIONS.map((option) => ({
            ...option,
            count: pool.filter((item) => item.assetKind === option.value).length,
          })),
          {
            value: "remix",
            label: "Remix",
            count: pool.filter((item) => item.isRemix).length,
          },
        ],
      },
      {
        id: "visibility",
        label: "Visibility",
        isMultiSelect: true,
        options: VISIBILITY_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => item.visibility === option.value).length,
        })),
      },
    ];
  }, [fixtureMode]);

  const filteredItems = useMemo(() => {
    if (fixtureMode === "empty") return [];

    const query = searchValue.trim().toLowerCase();
    const typeValues = selectedValues.type || [];
    const remixOnly = typeValues.includes("remix");
    const types = typeValues.filter((value) => value !== "remix");
    const visibilities = selectedValues.visibility || [];

    const filtered = FIXTURE_VAULT_ITEMS.filter((item) => {
      if (types.length && !types.includes(item.assetKind)) return false;
      if (remixOnly && !item.isRemix) return false;
      if (visibilities.length && !visibilities.includes(item.visibility)) return false;
      if (query && !`${item.title} ${item.subtitle}`.toLowerCase().includes(query)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "popular") {
      sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (selectedSort === "saved") {
      sorted.sort((a, b) => (b.saves || 0) - (a.saves || 0));
    } else {
      sorted.sort((a, b) => b.recency - a.recency);
    }
    return sorted;
  }, [fixtureMode, searchValue, selectedValues, selectedSort]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

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
        current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
      );
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);

  // Badges follow the own-work context (plan section 7.3): owned
  // items carry their visibility badge or Canon where canon;
  // saved-from-others items carry no visibility badge (they are not
  // own work). Never a badge restating an active filter selection:
  // when the Visibility filter has an active selection, the matching
  // visibility badge is suppressed on cards that would otherwise show
  // it.
  function badgesFor(item) {
    if (!item.isOwn) return [];
    if (item.isCanon) {
      return activeVisibilityValues.includes("CANON")
        ? []
        : [{ label: "Canon", variant: "canon" }];
    }
    if (activeVisibilityValues.includes(item.visibility)) return [];
    return [{ label: VISIBILITY_LABELS[item.visibility], variant: "status" }];
  }

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
              aria-pressed={fixtureMode === key}
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
          eyebrow="Create"
          title="Vault"
          description="Everything yours, and everything you have claimed, always findable."
        />
      }
      filterBarSlot={
        <KitStudioFilterBarView
          searchValue={searchValue}
          searchPlaceholder="Search your vault"
          onSearchChange={(value) => {
            setSearchValue(value);
            setVisibleCount(PAGE_SIZE);
          }}
          filterGroups={filterGroups}
          selectedValues={selectedValues}
          onFilterToggle={toggleFilter}
          sortOptions={SORT_OPTIONS}
          selectedSort={selectedSort}
          onSortChange={(value) => {
            setSelectedSort(value);
            setVisibleCount(PAGE_SIZE);
          }}
          viewModeSlot={
            <ViewModeToggleView value={layout} label="Layout" onChange={setLayout} />
          }
        />
      }
      bannerSlot={
        <KitPromoBannerView
          treatment="bottom"
          bottomVariant="uniform"
          eyebrow="Explore"
          title="See what the rest of the realm has released."
          line=""
          ctaLabel="Browse the Community"
          imageSrc={encodeURI("/tmp-mockup-images/canon-character-images/Lilith.png")}
          onCtaClick={() =>
            setActionNotice({
              label: "Browse the Community",
              message:
                "This banner routes to Community when the new pages cut over. Nothing was opened in this preview.",
            })
          }
        />
      }
    >
        {fixtureMode === "loading" && <LoadingGrid />}

        {fixtureMode !== "loading" && filteredItems.length === 0 && <EmptyState />}

        {fixtureMode !== "loading" && filteredItems.length > 0 && (
          <>
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4"
                  : "grid grid-cols-1 gap-[var(--space-3)] min-[1100px]:grid-cols-2"
              }
            >
              {visibleItems.map((item) => (
                <KitCreationCardView
                  key={item.id}
                  layout={layout}
                  assetKind={item.assetKind}
                  title={item.title}
                  subtitle={item.subtitle}
                  imageSrc={item.imageSrc}
                  badges={badgesFor(item)}
                  stats={{
                    plays: item.plays,
                    hearts: item.hearts,
                    saves: item.saves,
                    followers: null,
                  }}
                  liked={likedIds.includes(item.id)}
                  bookmarked={savedIds.includes(item.id)}
                  onOpenImageOverlay={() =>
                    setOverlayImage({ id: item.id, imageSrc: item.imageSrc, title: item.title })
                  }
                  onOpenAssetDetail={() => setAssetDetailId(item.id)}
                  onLike={() => toggleLiked(item.id)}
                  onBookmark={() => toggleSaved(item.id)}
                />
              ))}
            </div>

            <KitLoadMoreView
              isLoading={false}
              hasMore={hasMore}
              remainingCount={filteredItems.length - visibleCount}
              onLoadMore={() =>
                setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredItems.length))
              }
            />
          </>
        )}
    </KitStudioPageView>

    {overlayImage && (
      <KitImageOverlay
        imageSrc={overlayImage.imageSrc}
        title={overlayImage.title}
        isLoved={likedIds.includes(overlayImage.id)}
        isSaved={savedIds.includes(overlayImage.id)}
        onLove={() => toggleLiked(overlayImage.id)}
        onSave={() => toggleSaved(overlayImage.id)}
        onShare={() =>
          setActionNotice({
            label: "Share",
            message:
              "Sharing is wired when the page goes live. Nothing leaves this preview.",
          })
        }
        onClose={() => setOverlayImage(null)}
      />
    )}

    {assetDetailId && (() => {
      const item = FIXTURE_VAULT_ITEMS.find((entry) => entry.id === assetDetailId);
      if (!item) return null;

      const media = [item.imageSrc, ...(item.extraMedia || [])]
        .filter(Boolean)
        .map((src, index) => ({ id: `${item.id}-media-${index + 1}`, src }));

      return (
        <KitAssetDetailPopup
          assetKind={item.assetKind}
          title={item.title}
          subtitle={item.subtitle}
          media={media}
          badges={badgesFor(item)}
          stats={{
            plays: item.plays,
            hearts: item.hearts,
            saves: item.saves,
            followers: null,
          }}
          description={item.description}
          isLiked={likedIds.includes(item.id)}
          isSaved={savedIds.includes(item.id)}
          onLike={() => toggleLiked(item.id)}
          onPrimaryAction={() =>
            setActionNotice({
              label: item.assetKind === "image" ? "Open" : "Play",
              message: `Opening "${item.title}" is wired when live wiring lands. Nothing was started in this preview.`,
            })
          }
          onShare={() =>
            setActionNotice({
              label: "Share",
              message:
                "Sharing is wired when the page goes live. Nothing leaves this preview.",
            })
          }
          onSave={() => toggleSaved(item.id)}
          onViewCatalogue={() =>
            setActionNotice({
              label: "View catalogue",
              message:
                "The creator catalogue opens when live wiring lands. Nothing was opened in this preview.",
            })
          }
          credits={item.credits || []}
          onClose={() => setAssetDetailId(null)}
        />
      );
    })()}

    <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
