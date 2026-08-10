"use client";

// The full Images composition, fixture-driven, presentation only.
// Rendered by /studio/v2/images (pre-parity staging address) and
// mirrored at /dev/ui-preview/images-v2-page. Per docs/SPRINT-D-PLAN.md
// section 2 (absorbs and supersedes SPRINT-B-PLAN, updated to inherit
// R1 through R7 of the 10 Aug 2026 modal-system gate): the LIBRARY
// BROWSE HUB fixture-first, same shape as Community, Creators, and
// Vault. The composer surface (prompt bar, batch controls, ingredient
// picker) has no ruling assigning it a home here; no composer stub is
// invented, its CSV rows land Flagged. No live data, no API calls, no
// real navigation.
import { useMemo, useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import FixtureActionNotice from "../FixtureActionNotice";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Eighteen fixture images (plan section 3): at least three per linked-
// asset option including four unlinked, both styles, varied counts,
// three long titles. Subtitle is fixture-grade display copy, not a
// terminology-module lookup (no asset-kind label map exists there;
// every sibling v2 page's fixtures already write this copy directly).
const FIXTURE_IMAGES = [
  { id: "img1", title: "Vesper Ash Render", imageSrc: creatorArt("vermillion-8"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 410, saves: 120, recency: 18 },
  { id: "img2", title: "Lilith, Throne Study", imageSrc: canonArt("Lilith"), linkedAsset: { kind: "character", label: "Character" }, style: "realistic", hearts: 2210, saves: 960, recency: 17 },
  { id: "img3", title: "Kaela, Field Sketch", imageSrc: canonArt("Kaela Veynskald"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 880, saves: 190, recency: 16 },
  { id: "img4", title: "Elowen, Half-Light", imageSrc: canonArt("Elowen"), linkedAsset: { kind: "character", label: "Character" }, style: "realistic", hearts: 1630, saves: 440, recency: 15 },
  { id: "img5", title: "Corwin, Backstage Pass", imageSrc: canonArt("Jax Riker"), linkedAsset: { kind: "character", label: "Character" }, style: "anime", hearts: 22, saves: 6, recency: 14 },
  { id: "img6", title: "The First Exile, Cover Study", imageSrc: creatorArt("vermillion-3"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 1240, saves: 510, recency: 13 },
  { id: "img7", title: "Coldwater Vigil, Opening Scene", imageSrc: creatorArt("vermillion-10"), linkedAsset: { kind: "story", label: "Story" }, style: "anime", hearts: 900, saves: 340, recency: 12 },
  { id: "img8", title: "Nine Coin Night, Table Read", imageSrc: creatorArt("vermillion-6"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 40, saves: 10, recency: 11 },
  { id: "img9", title: "The Hollow Road, Waypoint", imageSrc: creatorArt("vermillion-2"), linkedAsset: { kind: "story", label: "Story" }, style: "anime", hearts: 1, saves: 0, recency: 10 },
  { id: "img10", title: "The Wandering Blade, Draft Two", imageSrc: creatorArt("whiteviolin"), linkedAsset: { kind: "story", label: "Story" }, style: "realistic", hearts: 324, saves: 81, recency: 9 },
  { id: "img11", title: "Neon Harbor Cycle, District Overlook", imageSrc: creatorArt("vermillion-12"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "realistic", hearts: 88, saves: 19, recency: 8 },
  { id: "img12", title: "Salt Marsh Run, Rain Study", imageSrc: creatorArt("vermillion-4"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "anime", hearts: 0, saves: 0, recency: 7 },
  { id: "img13", title: "The Ferry Contract, Dock Lights", imageSrc: creatorArt("vermillion-9"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "realistic", hearts: 8, saves: 3, recency: 6 },
  { id: "img14", title: "The Long Road West, Trail Marker at the Edge of the Known Map", imageSrc: creatorArt("sassy"), linkedAsset: { kind: "adventure", label: "Adventure" }, style: "anime", hearts: 203, saves: 66, recency: 5 },
  { id: "img15", title: "Study, Untitled", imageSrc: creatorArt("vermillion-5"), linkedAsset: null, style: "anime", hearts: 2, saves: 0, recency: 4 },
  { id: "img16", title: "Palette Test", imageSrc: creatorArt("vermillion-7"), linkedAsset: null, style: "realistic", hearts: 9, saves: 2, recency: 3 },
  { id: "img17", title: "Harbor at Dusk, an Unassigned Reference Kept for Later Palette Matching", imageSrc: creatorArt("vermillion-11"), linkedAsset: null, style: "anime", hearts: 210, saves: 80, recency: 2 },
  { id: "img18", title: "Loose Concept, No Home Yet", imageSrc: creatorArt("vermillion-13"), linkedAsset: null, style: "realistic", hearts: 3, saves: 1, recency: 1 },
];

const LINKED_ASSET_OPTIONS = [
  { value: "character", label: "Characters" },
  { value: "story", label: "Stories" },
  { value: "adventure", label: "Adventures" },
  { value: "unlinked", label: "Unlinked" },
];

const STYLE_OPTIONS = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Newest" },
  { value: "hearts", label: "Most hearted" },
  { value: "saved", label: "Most saved" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
};

const PAGE_SIZE = 12;

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
      {Array.from({ length: 12 }, (_, index) => (
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
        No images yet
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Create one and it will land here.
      </p>
    </div>
  );
}

export default function ImagesV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lovedIds, setLovedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [overlayImage, setOverlayImage] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);

  const filterGroups = useMemo(() => {
    const pool = fixtureMode === "empty" ? [] : FIXTURE_IMAGES;
    return [
      {
        id: "linkedAsset",
        label: "Linked asset",
        isMultiSelect: true,
        options: LINKED_ASSET_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) =>
            option.value === "unlinked"
              ? !item.linkedAsset
              : item.linkedAsset?.kind === option.value
          ).length,
        })),
      },
      {
        id: "style",
        label: "Style",
        isMultiSelect: true,
        options: STYLE_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => item.style === option.value).length,
        })),
      },
    ];
  }, [fixtureMode]);

  const filteredItems = useMemo(() => {
    if (fixtureMode === "empty") return [];

    const query = searchValue.trim().toLowerCase();
    const linkedAssetValues = selectedValues.linkedAsset || [];
    const styleValues = selectedValues.style || [];

    const filtered = FIXTURE_IMAGES.filter((item) => {
      if (linkedAssetValues.length) {
        const matches = linkedAssetValues.some((value) =>
          value === "unlinked" ? !item.linkedAsset : item.linkedAsset?.kind === value
        );
        if (!matches) return false;
      }
      if (styleValues.length && !styleValues.includes(item.style)) return false;
      if (query) {
        const haystack = `${item.title} ${item.linkedAsset?.label || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "hearts") {
      sorted.sort((a, b) => b.hearts - a.hearts);
    } else if (selectedSort === "saved") {
      sorted.sort((a, b) => b.saves - a.saves);
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

  const toggleLoved = toggleId(setLovedIds);
  const toggleSaved = toggleId(setSavedIds);

  function subtitleFor(item) {
    return item.linkedAsset ? `Image, linked to ${item.linkedAsset.label}` : "Image";
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
            title="Images"
            description="Craft the look once, pin it, and everything after stays on model."
          />
        }
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={searchValue}
            searchPlaceholder="Search your images"
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
            eyebrow="Create"
            title="Everything you keep lives in the Vault."
            line=""
            ctaLabel="Open the Vault"
            imageSrc={encodeURI("/tmp-mockup-images/alpha-test-creator-images/vermillion-8.png")}
            onCtaClick={() =>
              setActionNotice({
                label: "Open the Vault",
                message:
                  "This banner routes to the Vault when the new pages cut over. Nothing was opened in this preview.",
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
                  assetKind="image"
                  title={item.title}
                  subtitle={subtitleFor(item)}
                  imageSrc={item.imageSrc}
                  badges={[]}
                  stats={{ plays: null, hearts: item.hearts, saves: item.saves, followers: null }}
                  liked={lovedIds.includes(item.id)}
                  bookmarked={savedIds.includes(item.id)}
                  onOpenImageOverlay={() =>
                    setOverlayImage({ id: item.id, imageSrc: item.imageSrc, title: item.title })
                  }
                  onOpenAssetDetail={() =>
                    setOverlayImage({ id: item.id, imageSrc: item.imageSrc, title: item.title })
                  }
                  onLike={() => toggleLoved(item.id)}
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
          isLoved={lovedIds.includes(overlayImage.id)}
          isSaved={savedIds.includes(overlayImage.id)}
          onLove={() => toggleLoved(overlayImage.id)}
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

      <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
