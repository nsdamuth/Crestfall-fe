"use client";

// The V2 Community composition. The dev preview remains fixture-driven,
// while /studio/v2/community injects live public creation summaries and
// persists Like/Save reactions through the Crestfall Chassis. Presentation
// filtering stays local so the same Skin can be exercised in fixture and
// live modes.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";
import KitAssetDetailPopup from "@/components/kit/KitAssetDetailPopup";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";
import {
  buildDomainFilterGroups,
  buildTagFilterOptions,
  getCatalogCreationType,
  getCatalogTags,
  getSelectedCatalogCreationTypes,
} from "../catalog/creationCatalogFilterTaxonomy.js";
import FixtureActionNotice from "../FixtureActionNotice";
import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Creator-handle link, restored 11 Aug 2026 (design/community-parity,
// parity audit candidate 6): FIXTURE_CREATIONS carries no dedicated
// creator field, only the handle embedded in `subtitle` ("Type - by
// @handle"). The handle is real data already displayed on every card;
// this only extracts it and builds the profile href using the exact
// convention already present elsewhere in this same fixture array
// (each `credits[].creatorHref` is `/studio/profile/{handle}`, e.g.
// "@vermillion" -> "/studio/profile/vermillion"). No data invented.
function creatorFromSubtitle(subtitle) {
  const match = /@([A-Za-z0-9_]+)/.exec(subtitle || "");
  if (!match) return null;
  return { handle: `@${match[1]}`, href: `/studio/profile/${match[1]}` };
}

// Rating values use the presentation tiers (lib/shared/presentation/
// terminology.js): EVERYONE, TEEN, and ADULT are all live, one to one
// against SFW/MATURE/EXPLICIT (CR-027, ruled final 9 Aug 2026). These
// fixture ratingTier values are illustrative only, not the result of
// the required content audit named in CR-027.
// isFeatured added 10 Aug 2026 (h-restore, ruling 2): the community
// curation candidate needs a real field to filter honestly; recency
// (already present, backs the Newest sort) doubles as the Recently
// Updated curation signal since no separate updatedAt field exists
// yet (CR-033 filed for a real updatedAt timestamp).
const FIXTURE_CREATIONS = [
  { id: "c1", assetKind: "character", title: "Lilith", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Lilith"), isCanon: true, isFeatured: true, ratingTier: "ADULT", isRemixable: false, plays: 10880, hearts: 2210, saves: 960, recency: 18, description: "A canon character woven into the founding myth of the realm. Her presence anchors any scene she enters." },
  { id: "c2", assetKind: "character", title: "Elowen", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Elowen"), isCanon: true, isFeatured: false, ratingTier: "EVERYONE", isRemixable: false, plays: 8400, hearts: 1630, saves: 440, recency: 17, description: "A wandering herbalist with a canon-tied backstory, built for gentle, exploratory play." },
  { id: "c3", assetKind: "character", title: "Kaela Veynskald", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Kaela Veynskald"), isCanon: true, isFeatured: true, ratingTier: "EVERYONE", isRemixable: false, plays: 5120, hearts: 880, saves: 190, recency: 16, description: "A frontier captain holding the northern line, written for tactical and diplomatic scenes alike." },
  { id: "c4", assetKind: "character", title: "The Seer", subtitle: "Character · by @Crestfall", imageSrc: canonArt("The Seer"), isCanon: true, isFeatured: false, ratingTier: "ADULT", isRemixable: false, plays: 4100, hearts: 492, saves: 123, recency: 15, description: "An oracle whose counsel always costs the asker something. Canon-tied, mature themes." },
  { id: "c5", assetKind: "story", title: "The First Exile", subtitle: "Story · by @vermillion", imageSrc: creatorArt("vermillion-3"), extraMedia: [creatorArt("vermillion-8"), creatorArt("vermillion-9")], isCanon: false, isFeatured: true, ratingTier: "EVERYONE", isRemixable: true, plays: 9800, hearts: 1240, saves: 510, recency: 14, description: "A community-authored story following the exile of a border scholar, told across three acts.", credits: [{ id: "c5-credit-narrator", kindLabel: "Narrator", creatorHandle: "@vermillion", creatorHref: "/studio/profile/vermillion", assetTitle: null }] },
  { id: "c6", assetKind: "story", title: "The Wandering Blade", subtitle: "Story · by @whiteviolin", imageSrc: creatorArt("whiteviolin"), isCanon: false, isFeatured: false, ratingTier: "ADULT", isRemixable: true, plays: 2700, hearts: 324, saves: 81, recency: 13, description: "A mercenary's road story through contested territory, remixable for your own cast." },
  { id: "c7", assetKind: "adventure", title: "Neon Harbor Cycle", subtitle: "Adventure · by @vermillion", imageSrc: creatorArt("vermillion-12"), extraMedia: [creatorArt("vermillion-13")], isCanon: false, isFeatured: true, ratingTier: "ADULT", isRemixable: true, plays: 512, hearts: 88, saves: 19, recency: 12, description: "A branching adventure through the harbor district, built for repeat play with shifting outcomes.", credits: [{ id: "c7-credit-location", kindLabel: "Location", creatorHandle: "@vermillion", creatorHref: "/studio/profile/vermillion", assetTitle: "Neon Harbor District" }, { id: "c7-credit-character", kindLabel: "Character", creatorHandle: "@Crestfall", creatorHref: "/studio/profile/Crestfall", assetTitle: "Lilith" }] },
  { id: "c8", assetKind: "adventure", title: "The Long Road West", subtitle: "Adventure · by @sassy", imageSrc: creatorArt("sassy"), isCanon: false, isFeatured: false, ratingTier: "EVERYONE", isRemixable: false, plays: 1250, hearts: 203, saves: 66, recency: 11, description: "A caravan-escort adventure across open frontier, family-friendly throughout." },
  { id: "c9", assetKind: "image", title: "Vesper Ash Render", subtitle: "Image · by @vermillion", imageSrc: creatorArt("vermillion-8"), isCanon: false, isFeatured: false, ratingTier: "EVERYONE", isRemixable: true, plays: null, hearts: 410, saves: 120, recency: 10 },
  { id: "c10", assetKind: "image", title: "Harborlight Study", subtitle: "Image · by @vermillion", imageSrc: creatorArt("vermillion-15"), isCanon: false, isFeatured: false, ratingTier: "EVERYONE", isRemixable: true, plays: null, hearts: 96, saves: 30, recency: 9 },
  { id: "c11", assetKind: "character", title: "Maya Chen", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Maya Chen"), isCanon: true, isFeatured: false, ratingTier: "EVERYONE", isRemixable: false, plays: 3300, hearts: 410, saves: 140, recency: 8, description: "A canon investigator working cases at the edge of the known world." },
  { id: "c12", assetKind: "character", title: "Selena Velvet", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Selena Velvet"), isCanon: true, isFeatured: false, ratingTier: "ADULT", isRemixable: false, plays: 2900, hearts: 350, saves: 96, recency: 7, description: "A canon performer whose stage persona hides a sharper edge, mature themes." },
  { id: "c13", assetKind: "story", title: "Kaira, Princess-Errant", subtitle: "Story · by @yagirltee", imageSrc: creatorArt("yagirltee"), isCanon: false, isFeatured: false, ratingTier: "EVERYONE", isRemixable: true, plays: 4100, hearts: 492, saves: 123, recency: 6, description: "A runaway royal story, told episodically, remixable for a co-op cast." },
  { id: "c14", assetKind: "image", title: "Cinder Veil", subtitle: "Image · by @rev", imageSrc: creatorArt("rev"), isCanon: false, isFeatured: false, ratingTier: "ADULT", isRemixable: false, plays: null, hearts: 44, saves: 9, recency: 5 },
  { id: "c15", assetKind: "character", title: "Dr. Elara Kade", subtitle: "Character · by @Crestfall", imageSrc: canonArt("Dr. Elara Kade"), isCanon: true, isFeatured: false, ratingTier: "EVERYONE", isRemixable: false, plays: 1800, hearts: 260, saves: 71, recency: 4, description: "A canon field physician written for slower, character-driven scenes." },
  { id: "c16", assetKind: "story", title: "Whiteviolin Nocturne", subtitle: "Story · by @whiteviolin", imageSrc: creatorArt("whiteviolin-2"), isCanon: false, isFeatured: false, ratingTier: "ADULT", isRemixable: true, plays: 760, hearts: 130, saves: 25, recency: 3, description: "A late-night story cycle set in a city that never quite sleeps, mature themes." },
];

// Curation remains independent from creation type. Live items use their
// projected recentlyUpdated signal; fixture rows retain the existing recency
// threshold so the design harness still exercises the state.
const RECENTLY_UPDATED_THRESHOLD = 12;

const CURATION_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "canon", label: "Canon" },
  { value: "recentlyUpdated", label: "Recently Updated" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most played" },
  { value: "recent", label: "Newest" },
  { value: "hearts", label: "Most hearted" },
  { value: "saved", label: "Most saved" },
];

// Rendering filter, RULED 10 Aug 2026 (section 5 of ruling: "restores
// as-is"). Original values (All Styles / Anime / Realistic / Either /
// Auto); no per-item renderStyle field exists on the fixture model
// yet, so it is derived deterministically from id parity below rather
// than hand-authored per row. CR-034 filed for a real renderStyle
// field on the creation record.
const RENDERING_OPTIONS = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
  { value: "either", label: "Either" },
  { value: "auto", label: "Auto" },
];

function renderingStyleFor(item) {
  if (["anime", "realistic", "either", "auto"].includes(item?.renderingStyle)) {
    return item.renderingStyle;
  }

  const cycle = ["anime", "realistic", "either", "auto"];
  const seed = Number.parseInt(String(item?.id || "").replace(/\D/g, ""), 10) || 0;
  return cycle[seed % cycle.length];
}

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
  error: "Error",
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

export default function CommunityV2Mockup({
  creations = null,
  loadError = null,
  live = false,
} = {}) {
  const router = useRouter();
  const sourceCreations = Array.isArray(creations) ? creations : FIXTURE_CREATIONS;
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [overlayImage, setOverlayImage] = useState(null);
  const [assetDetailId, setAssetDetailId] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [lovedOverlayIds, setLovedOverlayIds] = useState([]);
  const engagementState = useCreationEngagementState(live ? sourceCreations : []);
  const effectiveMode = live ? (loadError ? "error" : "default") : fixtureMode;

  const filterGroups = useMemo(() => {
    const pool = effectiveMode === "empty" || effectiveMode === "error" ? [] : sourceCreations;

    return [
      ...buildDomainFilterGroups(pool),
      {
        id: "curation",
        label: "Curation",
        isMultiSelect: true,
        options: CURATION_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => {
            if (option.value === "featured") return item.isFeatured;
            if (option.value === "canon") return item.isCanon;
            return live ? item.recentlyUpdated : item.recency >= RECENTLY_UPDATED_THRESHOLD;
          }).length,
        })),
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
      {
        id: "rendering",
        label: "Rendering",
        isMultiSelect: true,
        options: RENDERING_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => renderingStyleFor(item) === option.value).length,
        })),
      },
      {
        id: "tags",
        label: "Tags",
        isMultiSelect: true,
        options: buildTagFilterOptions(pool),
      },
    ];
  }, [effectiveMode, live, sourceCreations]);

  const filteredCreations = useMemo(() => {
    if (effectiveMode === "empty" || effectiveMode === "error") return [];

    const query = searchValue.trim().toLowerCase();
    const types = getSelectedCatalogCreationTypes(selectedValues);
    const curation = selectedValues.curation || [];
    const ratings = selectedValues.rating || [];
    const renderingValues = selectedValues.rendering || [];
    const selectedTags = selectedValues.tags || [];

    const filtered = sourceCreations.filter((item) => {
      const itemType = getCatalogCreationType(item);
      const itemTags = getCatalogTags(item);
      const normalizedTags = new Set(itemTags.map((tag) => tag.toLowerCase()));

      if (types.length && !types.includes(itemType)) return false;
      if (ratings.length && !ratings.includes(item.ratingTier)) return false;
      if (renderingValues.length && !renderingValues.includes(renderingStyleFor(item))) return false;
      if (curation.includes("featured") && !item.isFeatured) return false;
      if (curation.includes("canon") && !item.isCanon) return false;
      if (
        curation.includes("recentlyUpdated") &&
        !(live ? item.recentlyUpdated : item.recency >= RECENTLY_UPDATED_THRESHOLD)
      ) return false;
      if (selectedTags.length && !selectedTags.some((tag) => normalizedTags.has(tag))) return false;

      if (
        query &&
        !`${item.title} ${item.subtitle} ${item.description || ""} ${itemTags.join(" ")}`
          .toLowerCase()
          .includes(query)
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
    } else if (selectedSort === "hearts") {
      sorted.sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
    } else if (selectedSort === "saved") {
      sorted.sort((a, b) => (b.saves || 0) - (a.saves || 0));
    }
    return sorted;
  }, [effectiveMode, live, sourceCreations, searchValue, selectedValues, selectedSort]);

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

  const toggleFixtureLiked = toggleId(setLikedIds);
  const toggleFixtureSaved = toggleId(setSavedIds);
  const toggleLovedOverlay = toggleId(setLovedOverlayIds);

  function isLiked(creation) {
    return live
      ? engagementState.isCreationLiked(creation)
      : likedIds.includes(creation.id);
  }

  function isSaved(creation) {
    return live
      ? engagementState.isCreationBookmarked(creation)
      : savedIds.includes(creation.id);
  }

  function toggleLiked(creation) {
    if (live) {
      engagementState.toggleCreationLike(creation);
      return;
    }

    toggleFixtureLiked(creation.id);
  }

  function toggleSaved(creation) {
    if (live) {
      engagementState.toggleCreationBookmark(creation);
      return;
    }

    toggleFixtureSaved(creation.id);
  }

  async function handlePlay(creation) {
    if (!live) {
      setActionNotice({
        label: "Play",
        message: `Playing "${creation.title}" starts its session when live wiring lands. Nothing was started in this preview.`,
      });
      return;
    }

    if (!isChatCapableCreationType(creation.type)) {
      setAssetDetailId(creation.id);
      return;
    }

    try {
      const payload = await startStoryFromCreation(creation.rawCreation || creation);
      const roomId = payload?.room?.id;

      if (!roomId) {
        throw new Error("Story was created without a room id.");
      }

      router.push(`/studio/story-rooms/${encodeURIComponent(roomId)}`);
    } catch (error) {
      setActionNotice({
        label: "Start Story",
        message: error?.message || "Story could not be started.",
      });
    }
  }

  async function handleShare(creation) {
    if (!live) {
      setActionNotice({
        label: "Share",
        message: "Sharing is wired when the page goes live. Nothing leaves this preview.",
      });
      return;
    }

    const href = `/studio/creations/${encodeURIComponent(creation.id)}`;
    const absoluteHref =
      typeof window !== "undefined"
        ? new URL(href, window.location.origin).toString()
        : href;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: creation.title, url: absoluteHref });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(absoluteHref);
        setActionNotice({ label: "Share", message: "Public catalogue link copied." });
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        setActionNotice({
          label: "Share",
          message: error?.message || "Share link could not be prepared.",
        });
      }
    }
  }

  function handleViewCatalogue(creation) {
    if (live) {
      router.push(`/studio/creations/${encodeURIComponent(creation.id)}`);
      return;
    }

    setActionNotice({
      label: "View catalogue",
      message:
        "The creator catalogue opens when live wiring lands. Nothing was opened in this preview.",
    });
  }

  return (
    <>
    <KitStudioPageView
      harnessSlot={
        live ? null : (
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
        )
      }
      headerSlot={
        <StudioPageHeaderView
          eyebrow="Explore"
          title="Community"
          description="Every public creation the community has released. Discover, claim, and make it yours."
        />
      }
      filterBarSlot={
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
          sortOptions={live ? SORT_OPTIONS.filter((option) => option.value !== "saved") : SORT_OPTIONS}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
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
          title="Follow the creators behind every world you love."
          line=""
          ctaLabel="Browse creators"
          // Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
          // banner-audit sitting): Charlotte Steele.png, reassigned off
          // Lilith.png so Community does not share a banner with
          // Creators, Creator Profile, and Creator Connections, all one
          // click apart (see docs/reviews/BANNER-AUDIT.md for the full
          // survey and reasoning).
          imageSrc={encodeURI(
            "/tmp-mockup-images/canon-character-images/Charlotte Steele.png"
          )}
          onCtaClick={() =>
            live
              ? router.push("/studio/v2/creators")
              : setActionNotice({
                  label: "Browse creators",
                  message:
                    "This banner routes to Creators when the new pages cut over. Nothing was opened in this preview.",
                })
          }
        />
      }
    >
      {effectiveMode === "error" && (
        <KitAlertStripView
          tone="danger"
          title="Community could not be loaded."
          body={loadError || "Try refreshing the page."}
        />
      )}

      {effectiveMode === "loading" && <LoadingGrid />}

      {live && engagementState.engagementMessage && (
        <KitAlertStripView
          tone="danger"
          title="Community action could not be saved."
          body={engagementState.engagementMessage}
        />
      )}

      {effectiveMode !== "loading" && effectiveMode !== "error" && filteredCreations.length === 0 && (
        <EmptyState />
      )}

      {effectiveMode !== "loading" && effectiveMode !== "error" && filteredCreations.length > 0 && (
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
                liked={isLiked(creation)}
                bookmarked={isSaved(creation)}
                onOpenImageOverlay={() =>
                  setOverlayImage({
                    id: creation.id,
                    imageSrc: creation.imageSrc,
                    title: creation.title,
                  })
                }
                onOpenAssetDetail={() => setAssetDetailId(creation.id)}
                onLike={() => toggleLiked(creation)}
                onBookmark={() => toggleSaved(creation)}
                onPlay={
                  (!live && (creation.assetKind === "story" || creation.assetKind === "adventure")) ||
                  (live && isChatCapableCreationType(creation.type))
                    ? () => handlePlay(creation)
                    : undefined
                }
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
    </KitStudioPageView>

    {overlayImage && (
        <KitImageOverlay
          imageSrc={overlayImage.imageSrc}
          title={overlayImage.title}
          isLoved={live ? isLiked(overlayImage) : lovedOverlayIds.includes(overlayImage.id)}
          isSaved={isSaved(overlayImage)}
          onLove={() => (live ? toggleLiked(overlayImage) : toggleLovedOverlay(overlayImage.id))}
          onSave={() => toggleSaved(overlayImage)}
          onShare={() => handleShare(overlayImage)}
          onClose={() => setOverlayImage(null)}
        />
      )}

      {assetDetailId && (() => {
        const creation = sourceCreations.find((item) => item.id === assetDetailId);
        if (!creation) return null;

        const media = [creation.imageSrc, ...(creation.extraMedia || [])]
          .filter(Boolean)
          .map((src, index) => ({ id: `${creation.id}-media-${index + 1}`, src }));

        return (
          <KitAssetDetailPopup
            assetKind={creation.assetKind}
            title={creation.title}
            subtitle={creation.subtitle}
            creator={creation.creator || creatorFromSubtitle(creation.subtitle)}
            media={media}
            badges={creation.isCanon ? [{ label: "Canon", variant: "canon" }] : []}
            stats={{
              plays: creation.plays,
              hearts: creation.hearts,
              saves: creation.saves,
              followers: null,
            }}
            description={creation.description}
            tags={creation.tags || []}
            isLiked={isLiked(creation)}
            isSaved={isSaved(creation)}
            onLike={() => toggleLiked(creation)}
            onPrimaryAction={
              (!live && (creation.assetKind === "story" || creation.assetKind === "adventure")) ||
              (live && isChatCapableCreationType(creation.type))
                ? () => handlePlay(creation)
                : undefined
            }
            onShare={() => handleShare(creation)}
            onSave={() => toggleSaved(creation)}
            onViewCatalogue={() => handleViewCatalogue(creation)}
            credits={creation.credits || []}
            onClose={() => setAssetDetailId(null)}
          />
        );
      })()}

      <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
