"use client";

// The full Vault composition, fixture-driven, presentation only.
// Rendered by /studio/v2/vault (pre-parity staging address) and
// mirrored at /dev/ui-preview/vault-v2-page. Build order row 3
// (docs/BUILD-BLUEPRINT.md 3.1): full skeleton, list AND grid
// creation-card layouts, introduces the own-work badge context.
//
// Vault edit path, RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5,
// Studio brief S5): the CR-007/CR-008 partial hold LIFTS for the
// single edit path, own-work items only. Opening a saved asset from
// the popup goes straight to /studio/v2/editor/[id]. No fork, no
// choice dialog. No other edit, delete, or bulk affordance appears
// anywhere on this page; the rest of the prior hold stands. No live
// data, no API calls otherwise, no other real navigation.
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
import FixtureActionNotice from "../FixtureActionNotice";
import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { archiveCreation, deleteCreation } from "@/lib/client/studio/creations/creationClient";
import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";
import { canArchiveVaultItem, canDeleteVaultItem } from "@/lib/shared/presentation/vaultPresentation";
import {
  buildDomainFilterGroups,
  buildTagFilterOptions,
  getCatalogCreationType,
  getCatalogTags,
  getSelectedCatalogCreationTypes,
} from "../catalog/creationCatalogFilterTaxonomy.js";

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

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "INTERNAL", label: "Internal" },
  { value: "PUBLIC", label: "Public" },
  { value: "CANON", label: "Canon" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "REJECTED", label: "Rejected" },
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
  error: "Error",
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

// Start Creating restored (10 Aug 2026 parity audit, section 7): the
// original my-creations hub's empty state always carried this
// next-step action; the v2 empty state had dropped it to copy only.
function EmptyState({ onStartCreating, body = "Create something, or save work you love from the Community." }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-12)] text-center">
      <GeometricMark className="h-[var(--space-14)] w-[var(--space-14)]" />
      <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        Nothing here yet
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {body}
      </p>
      <button type="button" onClick={onStartCreating} className="cf-btn cf-btn--secondary mt-[var(--space-2)]">
        Start Creating
      </button>
    </div>
  );
}

export default function VaultV2Mockup({
  items = null,
  bookmarkCandidates = [],
  loadError = null,
  savedSourceError = null,
  live = false,
} = {}) {
  const router = useRouter();
  const ownedItems = Array.isArray(items) ? items : FIXTURE_VAULT_ITEMS;
  const savedCandidates = Array.isArray(bookmarkCandidates) ? bookmarkCandidates : [];
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
  const [openKebabId, setOpenKebabId] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);
  const engagementCandidates = useMemo(() => {
    if (!live) return [];

    const byId = new Map();
    [...ownedItems, ...savedCandidates].forEach((item) => {
      if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
    });
    return [...byId.values()];
  }, [live, ownedItems, savedCandidates]);
  const engagementState = useCreationEngagementState(engagementCandidates);
  const sourceItems = useMemo(() => {
    if (!live) return ownedItems;

    const ownedIds = new Set(ownedItems.map((item) => item?.id).filter(Boolean));
    const saved = savedCandidates.filter(
      (item) =>
        item?.id &&
        !ownedIds.has(item.id) &&
        engagementState.isCreationBookmarked(item)
    );

    return [...ownedItems, ...saved];
  }, [live, ownedItems, savedCandidates, engagementState.bookmarkedCreationIds]);
  const effectiveMode = live ? (loadError ? "error" : "default") : fixtureMode;

  const activeVisibilityValues = selectedValues.visibility || [];

  const filterGroups = useMemo(() => {
    const pool = effectiveMode === "empty" || effectiveMode === "error" ? [] : sourceItems;

    return [
      ...buildDomainFilterGroups(pool),
      {
        id: "visibility",
        label: "Visibility",
        isMultiSelect: true,
        options: VISIBILITY_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter((item) => item.visibility === option.value).length,
        })),
      },
      {
        id: "status",
        label: "Status",
        isMultiSelect: true,
        options: STATUS_OPTIONS.map((option) => ({
          ...option,
          count: pool.filter(
            (item) => item.isOwn && String(item.status || "").toUpperCase() === option.value
          ).length,
        })),
      },
      {
        id: "tags",
        label: "Tags",
        isMultiSelect: true,
        options: buildTagFilterOptions(pool),
      },
    ];
  }, [effectiveMode, sourceItems]);

  const filteredItems = useMemo(() => {
    if (effectiveMode === "empty" || effectiveMode === "error") return [];

    const query = searchValue.trim().toLowerCase();
    const types = getSelectedCatalogCreationTypes(selectedValues);
    const visibilities = selectedValues.visibility || [];
    const statuses = selectedValues.status || [];
    const selectedTags = selectedValues.tags || [];

    const filtered = sourceItems.filter((item) => {
      const itemType = getCatalogCreationType(item);
      const itemStatus = String(item.status || "").trim().toUpperCase();
      const itemTags = getCatalogTags(item);
      const normalizedTags = new Set(itemTags.map((tag) => tag.toLowerCase()));

      if (types.length && !types.includes(itemType)) return false;
      if (visibilities.length && !visibilities.includes(item.visibility)) return false;
      if (statuses.length && (!item.isOwn || !statuses.includes(itemStatus))) return false;
      if (selectedTags.length && !selectedTags.some((tag) => normalizedTags.has(tag))) return false;

      const haystack = `${item.title} ${item.subtitle} ${item.description || ""} ${
        VISIBILITY_LABELS[item.visibility] || ""
      } ${itemStatus} ${itemTags.join(" ")}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
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
  }, [effectiveMode, sourceItems, searchValue, selectedValues, selectedSort]);

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

  const toggleFixtureLiked = toggleId(setLikedIds);
  const toggleFixtureSaved = toggleId(setSavedIds);

  function isLiked(item) {
    return live ? engagementState.isCreationLiked(item) : likedIds.includes(item.id);
  }

  function isSaved(item) {
    return live ? engagementState.isCreationBookmarked(item) : savedIds.includes(item.id);
  }

  function toggleLiked(item) {
    if (live) {
      engagementState.toggleCreationLike(item);
      return;
    }

    toggleFixtureLiked(item.id);
  }

  function toggleSaved(item) {
    if (live) {
      engagementState.toggleCreationBookmark(item);
      return;
    }

    toggleFixtureSaved(item.id);
  }

  async function handlePlay(item) {
    if (!live) {
      setActionNotice({
        label: "Play",
        message: `Opening "${item.title}" is wired when live wiring lands. Nothing was started in this preview.`,
      });
      return;
    }

    if (!isChatCapableCreationType(item.type)) {
      setAssetDetailId(item.id);
      return;
    }

    try {
      const payload = await startStoryFromCreation(item.rawCreation || item);
      const roomId = payload?.room?.id;

      if (!roomId) {
        throw new Error("Story was created without a room id.");
      }

      router.push(buildStoryChatHref(roomId));
    } catch (error) {
      setActionNotice({
        label: "Start Story",
        message: error?.message || "Story could not be started.",
      });
    }
  }

  function handleEdit(item) {
    router.push(`/studio/v2/editor/${encodeURIComponent(item.id)}?origin=vault`);
  }

  function handleGenerateImage(item) {
    router.push(`/studio/v2/images?creation=${encodeURIComponent(item.id)}`);
  }

  async function handleShare(item) {
    if (!live) {
      setActionNotice({
        label: "Share",
        message: "Sharing is wired when the page goes live. Nothing leaves this preview.",
      });
      return;
    }

    if (!["PUBLIC", "CANON"].includes(item.visibility)) {
      setActionNotice({
        label: "Share",
        message: "This creation is not public yet. Publish it before sharing a public catalogue link.",
      });
      return;
    }

    const href = `/studio/creations/${encodeURIComponent(item.id)}`;
    const absoluteHref = typeof window !== "undefined" ? new URL(href, window.location.origin).toString() : href;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: item.title, url: absoluteHref });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(absoluteHref);
        setActionNotice({ label: "Share", message: "Public catalogue link copied." });
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        setActionNotice({ label: "Share", message: error?.message || "Share link could not be prepared." });
      }
    }
  }

  function handleViewCatalogue(item) {
    if (live && item.isOwn) {
      router.push(`/studio/my-creations/${encodeURIComponent(item.id)}/image-library`);
      return;
    }

    if (live && ["PUBLIC", "CANON"].includes(item.visibility)) {
      router.push(`/studio/creations/${encodeURIComponent(item.id)}`);
      return;
    }

    setActionNotice({
      label: "View catalogue",
      message: "The creator catalogue opens when live wiring lands. Nothing was opened in this preview.",
    });
  }

  async function handleArchive(item) {
    if (!live || !canArchiveVaultItem(item)) return;

    try {
      await archiveCreation(item.id);
      setAssetDetailId(null);
      setActionNotice({ label: "Archive", message: `"${item.title}" was archived.` });
      router.refresh();
    } catch (error) {
      setActionNotice({ label: "Archive", message: error?.message || "Creation could not be archived." });
    }
  }

  async function handleDelete(item) {
    if (!live || !canDeleteVaultItem(item)) return;
    if (typeof window !== "undefined" && !window.confirm(`Delete "${item.title}" permanently?`)) return;

    try {
      await deleteCreation(item.id);
      setAssetDetailId(null);
      setActionNotice({ label: "Delete", message: `"${item.title}" was deleted.` });
      router.refresh();
    } catch (error) {
      setActionNotice({ label: "Delete", message: error?.message || "Creation could not be deleted." });
    }
  }

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
          eyebrow="Create"
          title="Vault"
          description={
            live
              ? "Everything you create, plus public work you save from Community, stays findable here."
              : "Everything yours, and everything you have claimed, always findable."
          }
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
          // Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
          // banner-audit sitting): Jax Riker.png, reassigned off
          // Lilith.png so Vault does not share a banner with Creators,
          // Creator Profile, Creator Connections, and Community, all
          // one click apart (see docs/reviews/BANNER-AUDIT.md).
          imageSrc={encodeURI("/tmp-mockup-images/canon-character-images/Jax Riker.png")}
          onCtaClick={() =>
            live
              ? router.push("/studio/v2/community")
              : setActionNotice({
                  label: "Browse the Community",
                  message:
                    "This banner routes to Community when the new pages cut over. Nothing was opened in this preview.",
                })
          }
        />
      }
    >
        {effectiveMode === "error" && (
          <KitAlertStripView
            tone="danger"
            title="Vault could not be loaded."
            body={loadError || "Try refreshing the page."}
          />
        )}

        {effectiveMode === "loading" && <LoadingGrid />}

        {live && savedSourceError && !loadError && (
          <KitAlertStripView
            tone="warning"
            title="Saved community work could not be loaded."
            body={`${savedSourceError} Your own creations are still available.`}
          />
        )}

        {live && engagementState.engagementMessage && (
          <KitAlertStripView
            tone="danger"
            title="Vault action could not be saved."
            body={engagementState.engagementMessage}
          />
        )}

        {effectiveMode !== "loading" && effectiveMode !== "error" && filteredItems.length === 0 && (
          <EmptyState
            body={live ? "Create something in Studio, or save public work from Community." : undefined}
            onStartCreating={() =>
              live
                ? router.push("/studio")
                : setActionNotice({
                    label: "Start Creating",
                    message:
                      "This opens the creation picker when live wiring lands. Nothing was opened in this preview.",
                  })
            }
          />
        )}

        {effectiveMode !== "loading" && effectiveMode !== "error" && filteredItems.length > 0 && (
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
                  creationType={item.type}
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
                  liked={isLiked(item)}
                  bookmarked={isSaved(item)}
                  onOpenImageOverlay={() =>
                    setOverlayImage({ ...item, imageSrc: item.imageSrc, title: item.title })
                  }
                  onOpenAssetDetail={() => setAssetDetailId(item.id)}
                  onLike={() => toggleLiked(item)}
                  onBookmark={() => toggleSaved(item)}
                  onPlay={
                    (!live && (item.assetKind === "story" || item.assetKind === "adventure")) ||
                    (live && isChatCapableCreationType(item.type))
                      ? () => handlePlay(item)
                      : undefined
                  }
                  isOwner={Boolean(live && item.isOwn)}
                  promoteOwnerActions={Boolean(live && item.isOwn)}
                  kebabOpen={openKebabId === item.id}
                  onToggleKebab={() =>
                    setOpenKebabId((current) => (current === item.id ? null : item.id))
                  }
                  onCloseKebab={() => setOpenKebabId(null)}
                  onEdit={live && item.isOwn ? () => handleEdit(item) : undefined}
                  onGenerateImage={live && item.isOwn ? () => handleGenerateImage(item) : undefined}
                  onShare={live && item.isOwn ? () => handleShare(item) : undefined}
                  onArchive={live && item.isOwn && canArchiveVaultItem(item) ? () => handleArchive(item) : undefined}
                  onDelete={live && item.isOwn && canDeleteVaultItem(item) ? () => handleDelete(item) : undefined}
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
        isLoved={isLiked(overlayImage)}
        isSaved={isSaved(overlayImage)}
        onLove={() => toggleLiked(overlayImage)}
        onSave={() => toggleSaved(overlayImage)}
        onShare={() => handleShare(overlayImage)}
        onClose={() => setOverlayImage(null)}
      />
    )}

    {assetDetailId && (() => {
      const item = sourceItems.find((entry) => entry.id === assetDetailId);
      if (!item) return null;

      const media = item.detailMedia?.length
        ? item.detailMedia
        : [item.imageSrc, ...(item.extraMedia || [])]
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
          isLiked={isLiked(item)}
          isSaved={isSaved(item)}
          onLike={() => toggleLiked(item)}
          onPrimaryAction={() =>
            live
              ? isChatCapableCreationType(item.type)
                ? handlePlay(item)
                : handleViewCatalogue(item)
              : item.assetKind === "image"
                ? setActionNotice({
                    label: "Open",
                    message: `Opening "${item.title}" is wired when live wiring lands. Nothing was started in this preview.`,
                  })
                : handlePlay(item)
          }
          onShare={() => handleShare(item)}
          onSave={() => toggleSaved(item)}
          onViewCatalogue={() => handleViewCatalogue(item)}
          credits={item.credits || []}
          onClose={() => setAssetDetailId(null)}
          onEdit={item.isOwn ? () => handleEdit(item) : undefined}
        />
      );
    })()}

    <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
