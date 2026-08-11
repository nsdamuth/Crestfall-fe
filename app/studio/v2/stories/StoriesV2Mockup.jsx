"use client";

// The full Stories composition, fixture-driven, presentation only.
// Rendered by /studio/v2/stories (pre-parity staging address) and
// mirrored at /dev/ui-preview/stories-v2-page. Per docs/SPRINT-D-PLAN.md
// section 3 (W3): the hub only, chat room [id] excluded by the
// standing sweep-scope ruling (blueprint 3.1 row 4). No live data, no
// API calls, no real navigation.
import { useMemo, useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitAssetDetailPopup from "@/components/kit/KitAssetDetailPopup";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";
import FixtureActionNotice from "../FixtureActionNotice";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

const KIND_LABELS = { character: "Character", story: "Story", adventure: "Adventure" };

const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  INTERNAL: "Internal",
  PUBLIC: "Public",
};

// Sixteen fixture items (plan 3.3): four in progress (two stories, one
// adventure, one character chat) leading in the Continue group,
// twelve startable across all three kinds, all four visibilities, and
// a mix of rating tiers, three long titles. Media arrays exercise the
// popup carousel on at least two items; credits arrays on at least
// two (one with five credits, exercising the R1 collapse).
const FIXTURE_STORIES = [
  { id: "cont1", isContinue: true, kind: "story", title: "The Hollow Road", imageSrc: creatorArt("vermillion-2"), lastPlayed: "2 hours ago", recency: 20 },
  { id: "cont2", isContinue: true, kind: "story", title: "Nine Coin Night", imageSrc: creatorArt("vermillion-6"), lastPlayed: "yesterday", recency: 19 },
  { id: "cont3", isContinue: true, kind: "adventure", title: "Salt Marsh Run", imageSrc: creatorArt("vermillion-4"), lastPlayed: "3 days ago", recency: 18 },
  { id: "cont4", isContinue: true, kind: "character", title: "Ashwynn Vale", imageSrc: canonArt("Alyera Valecourt"), lastPlayed: "last week", recency: 17 },

  { id: "s1", kind: "character", title: "Corwin Bex", imageSrc: canonArt("Jax Riker"), visibility: "PRIVATE", ratingTier: "EVERYONE", plays: 180, hearts: 22, saves: 6, recency: 16, description: "A private draft, not yet shared." },
  { id: "s2", kind: "character", title: "Delphine Roux", imageSrc: canonArt("Rachel Sentry"), visibility: "INTERNAL", ratingTier: "TEEN", plays: 3400, hearts: 610, saves: 220, recency: 15, description: "Shared with the internal test group only." },
  { id: "s3", kind: "character", title: "Maya Chen", imageSrc: canonArt("Maya Chen"), visibility: "PUBLIC", ratingTier: "ADULT", plays: 3300, hearts: 410, saves: 140, recency: 14, description: "Released to the community." },
  { id: "s4", kind: "character", title: "Lilith", imageSrc: canonArt("Lilith"), visibility: "CANON", isCanon: true, ratingTier: "EVERYONE", plays: 10880, hearts: 2210, saves: 960, recency: 13, description: "A canon character woven into the founding myth of the realm." },
  { id: "s5", kind: "story", title: "Coldwater Vigil", imageSrc: creatorArt("vermillion-10"), visibility: "PRIVATE", ratingTier: "TEEN", plays: 5200, hearts: 900, saves: 340, recency: 12, description: "A finished, unpublished story." },
  { id: "s6", kind: "story", title: "The Wandering Blade", imageSrc: creatorArt("whiteviolin"), visibility: "INTERNAL", ratingTier: "EVERYONE", plays: 2700, hearts: 324, saves: 81, recency: 11, description: "Internal-only story, feedback pending." },
  { id: "s7", kind: "story", title: "The Lantern-Keeper of the Vermillion Coast, Third Attempt", imageSrc: creatorArt("vermillion-3"), visibility: "PUBLIC", ratingTier: "ADULT", plays: 9800, hearts: 1240, saves: 510, recency: 10, description: "A recovered draft, revised twice, released to the community.", media: [creatorArt("vermillion-3"), creatorArt("vermillion-6")] },
  { id: "s8", kind: "story", title: "The First Exile", imageSrc: creatorArt("vermillion-9"), visibility: "CANON", isCanon: true, ratingTier: "EVERYONE", plays: 9800, hearts: 1240, saves: 510, recency: 9, description: "A canon story arc, released community-wide.", credits: [
    { id: "s8-credit-1", kindLabel: "Narrator", creatorHandle: "@vermillion", creatorHref: "/studio/profile/vermillion", assetTitle: null },
    { id: "s8-credit-2", kindLabel: "Location", creatorHandle: "@map_room", creatorHref: "/studio/profile/map_room", assetTitle: "Greywater Crossing" },
    { id: "s8-credit-3", kindLabel: "Outfit", creatorHandle: "@golden_thread", creatorHref: "/studio/profile/golden_thread", assetTitle: "Exile's Coat" },
    { id: "s8-credit-4", kindLabel: "Pose", creatorHandle: "@anonymous_contributor", creatorHref: null, assetTitle: null },
    { id: "s8-credit-5", kindLabel: "Score", creatorHandle: "@map_room", creatorHref: "/studio/profile/map_room", assetTitle: "Exile Theme" },
  ] },
  { id: "s9", kind: "adventure", title: "A Deliberately Long Adventure Title Used to Stress the Card's Two-Line Clamp", imageSrc: creatorArt("vermillion-13"), visibility: "PRIVATE", ratingTier: "EVERYONE", plays: 5, hearts: 0, saves: 0, recency: 8, description: "A private adventure sketch." },
  { id: "s10", kind: "adventure", title: "The Ferry Contract", imageSrc: creatorArt("vermillion-9"), visibility: "INTERNAL", ratingTier: "ADULT", plays: 60, hearts: 8, saves: 3, recency: 7, description: "Internal playtest build." },
  { id: "s11", kind: "adventure", title: "The Long Road West, Recovered From an Abandoned Branch", imageSrc: creatorArt("sassy"), visibility: "PUBLIC", ratingTier: "TEEN", plays: 1250, hearts: 203, saves: 66, recency: 6, description: "Released to the community, revived from an old draft." },
  { id: "s12", kind: "adventure", title: "Neon Harbor Cycle", imageSrc: creatorArt("vermillion-12"), visibility: "CANON", isCanon: true, ratingTier: "EVERYONE", plays: 512, hearts: 88, saves: 19, recency: 5, description: "A branching adventure through the harbor district.", media: [creatorArt("vermillion-12"), creatorArt("vermillion-14"), creatorArt("vermillion-15")], credits: [
    { id: "s12-credit-1", kindLabel: "Location", creatorHandle: "@vermillion", creatorHref: "/studio/profile/vermillion", assetTitle: "Neon Harbor District" },
    { id: "s12-credit-2", kindLabel: "Character", creatorHandle: "@Crestfall", creatorHref: "/studio/profile/Crestfall", assetTitle: "Lilith" },
  ] },
];

const TYPE_OPTIONS = [
  { value: "character", label: "Character" },
  { value: "story", label: "Story" },
  { value: "adventure", label: "Adventure" },
];

const STATUS_OPTIONS = [
  { value: "inProgress", label: "In progress" },
  { value: "startable", label: "Startable" },
];

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "INTERNAL", label: "Internal" },
  { value: "PUBLIC", label: "Public" },
  { value: "CANON", label: "Canon" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Latest activity" },
  { value: "title", label: "Title A to Z" },
];

const FIXTURE_MODES = { default: "Default", empty: "Empty", loading: "Loading", error: "Error" };

// Search restores original field coverage (title, subtitle, type,
// status, visibility, rating, scenario, narrator, location, last
// message, cast per the 10 Aug 2026 parity audit): the v2 fixture
// model carries no scenario/narrator/location/last-message/cast
// fields, so title, type, status, visibility, rating, description,
// and last-played are the honest equivalent set.
function searchableText(item) {
  return [
    item.title,
    KIND_LABELS[item.kind],
    item.isContinue ? "In progress" : "Startable",
    item.visibility ? VISIBILITY_LABELS[item.visibility] : "",
    item.ratingTier
      ? CONTENT_RATING_TIERS.find((tier) => tier.tier === item.ratingTier)?.label
      : "",
    item.description,
    item.lastPlayed,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const PAGE_SIZE = 12;
const CONTINUE_VISIBLE_CAP = 3;

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
        Nothing startable yet
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Create a character, story, or adventure and it will land here.
      </p>
    </div>
  );
}

// Scope 1 section label (docs/BUILD-BLUEPRINT.md 2.16(o)): gold
// uppercase label with one short solid gold rule to its right.
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-[var(--space-3)]">
      <p className="flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {children}
      </p>
      <div className="h-px w-[var(--space-8)] flex-none bg-[var(--gold-ornament)]" />
    </div>
  );
}

function ContinueCard({ item, onContinue }) {
  return (
    <KitPromoBannerView
      treatment="card"
      eyebrow="Continue"
      title={item.title}
      line={`Last played ${item.lastPlayed} · ${KIND_LABELS[item.kind]}`}
      ctaLabel="Continue"
      imageSrc={item.imageSrc}
      onCtaClick={onContinue}
    />
  );
}

export default function StoriesV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [continueExpanded, setContinueExpanded] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [assetDetailId, setAssetDetailId] = useState(null);
  // R4 (10 Aug 2026 review gate): controls whose real behavior waits
  // on live wiring open a non-persisting notice instead of doing
  // nothing.
  const [actionNotice, setActionNotice] = useState(null);

  const activeVisibilityValues = selectedValues.visibility || [];

  const continueItems = useMemo(() => {
    if (fixtureMode === "empty" || fixtureMode === "error") return [];
    const query = searchValue.trim().toLowerCase();
    return FIXTURE_STORIES.filter((item) => item.isContinue).filter(
      (item) => !query || searchableText(item).includes(query)
    );
  }, [fixtureMode, searchValue]);

  const startablePool = useMemo(
    () =>
      fixtureMode === "empty" || fixtureMode === "error"
        ? []
        : FIXTURE_STORIES.filter((item) => !item.isContinue),
    [fixtureMode]
  );

  const filterGroups = useMemo(() => {
    const inProgressCount =
      fixtureMode === "empty" || fixtureMode === "error"
        ? 0
        : FIXTURE_STORIES.filter((item) => item.isContinue).length;
    return [
      {
        id: "type",
        label: "Type",
        isMultiSelect: true,
        options: TYPE_OPTIONS.map((option) => ({
          ...option,
          count: startablePool.filter((item) => item.kind === option.value).length,
        })),
      },
      {
        id: "status",
        label: "Status",
        isMultiSelect: true,
        options: STATUS_OPTIONS.map((option) => ({
          ...option,
          count: option.value === "inProgress" ? inProgressCount : startablePool.length,
        })),
      },
      {
        id: "visibility",
        label: "Visibility",
        isMultiSelect: true,
        options: VISIBILITY_OPTIONS.map((option) => ({
          ...option,
          count: startablePool.filter((item) => item.visibility === option.value).length,
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
          count: startablePool.filter((item) => item.ratingTier === tier.tier).length,
        })),
      },
    ];
  }, [fixtureMode, startablePool]);

  const filteredStartable = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const typeValues = selectedValues.type || [];
    const statusValues = selectedValues.status || [];
    const visibilities = selectedValues.visibility || [];
    const ratings = selectedValues.rating || [];

    // Status is a shelf-scoped facet (plan 3.2: filters apply to the
    // startable shelf, the Continue group ignores them): the shelf
    // pool contains only startable items by construction, so
    // selecting "In progress" here correctly yields an empty shelf
    // result rather than reaching into the Continue group above it.
    // Logged as a built default, not a resolved ruling.
    if (statusValues.length && !statusValues.includes("startable")) return [];

    const filtered = startablePool.filter((item) => {
      if (typeValues.length && !typeValues.includes(item.kind)) return false;
      if (visibilities.length && !visibilities.includes(item.visibility)) return false;
      if (ratings.length && !ratings.includes(item.ratingTier)) return false;
      if (query && !searchableText(item).includes(query)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => b.recency - a.recency);
    }
    return sorted;
  }, [searchValue, selectedValues, selectedSort, startablePool]);

  const visibleItems = filteredStartable.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStartable.length;
  const visibleContinueItems = continueExpanded ? continueItems : continueItems.slice(0, CONTINUE_VISIBLE_CAP);

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

  // Badges follow the own-work context (plan 3.2): visibility badges
  // are legal here (every item is the player's own creation); Canon
  // items carry the Canon badge instead. Never a badge restating an
  // active filter selection.
  function badgesFor(item) {
    if (item.isCanon) {
      return activeVisibilityValues.includes("CANON") ? [] : [{ label: "Canon", variant: "canon" }];
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
            eyebrow="Play"
            title="Stories"
            description="Pick up where you left off, or start something new."
          />
        }
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={searchValue}
            searchPlaceholder="Search your stories"
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
            eyebrow="Play"
            title="Worlds worth committing to."
            line=""
            ctaLabel="Browse Adventures"
            imageSrc={encodeURI("/tmp-mockup-images/alpha-test-creator-images/vermillion-13.png")}
            onCtaClick={() =>
              setActionNotice({
                label: "Browse Adventures",
                message:
                  "This banner routes to Adventures when the new pages cut over. Nothing was opened in this preview.",
              })
            }
          />
        }
      >
        {fixtureMode === "error" && (
          <KitAlertStripView
            tone="danger"
            title="Stories could not be loaded."
            body="Try refreshing the page."
          />
        )}

        {fixtureMode === "loading" && <LoadingGrid />}

        {fixtureMode !== "loading" && fixtureMode !== "error" && continueItems.length > 0 && (
          <div className="flex flex-col gap-[var(--space-4)]">
            {visibleContinueItems.map((item) => (
              <ContinueCard
                key={item.id}
                item={item}
                onContinue={() =>
                  setActionNotice({
                    label: "Continue",
                    message: `Resuming "${item.title}" opens its chat when live wiring lands. Nothing was opened in this preview.`,
                  })
                }
              />
            ))}
            {!continueExpanded && continueItems.length > CONTINUE_VISIBLE_CAP && (
              <button
                type="button"
                onClick={() => setContinueExpanded(true)}
                className="kit-focus self-start text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]"
              >
                Show all in progress ({continueItems.length})
              </button>
            )}
          </div>
        )}

        {fixtureMode !== "loading" && fixtureMode !== "error" && (
          <div className="flex flex-col gap-[var(--space-4)]">
            <SectionLabel>Start something</SectionLabel>

            {filteredStartable.length === 0 ? (
              <EmptyState />
            ) : (
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
                      assetKind={item.kind}
                      title={item.title}
                      subtitle={KIND_LABELS[item.kind]}
                      imageSrc={item.imageSrc}
                      badges={badgesFor(item)}
                      stats={{ plays: item.plays, hearts: item.hearts, saves: item.saves, followers: null }}
                      liked={likedIds.includes(item.id)}
                      bookmarked={savedIds.includes(item.id)}
                      onOpenImageOverlay={() => setAssetDetailId(item.id)}
                      onOpenAssetDetail={() => setAssetDetailId(item.id)}
                      onLike={() => toggleLiked(item.id)}
                      onBookmark={() => toggleSaved(item.id)}
                    />
                  ))}
                </div>

                <KitLoadMoreView
                  isLoading={false}
                  hasMore={hasMore}
                  remainingCount={filteredStartable.length - visibleCount}
                  onLoadMore={() =>
                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredStartable.length))
                  }
                />
              </>
            )}
          </div>
        )}
      </KitStudioPageView>

      {assetDetailId && (() => {
        const item = FIXTURE_STORIES.find((entry) => entry.id === assetDetailId);
        if (!item) return null;

        const media = [item.imageSrc, ...(item.media || []).filter((src) => src !== item.imageSrc)]
          .filter(Boolean)
          .map((src, index) => ({ id: `${item.id}-media-${index + 1}`, src }));

        return (
          <KitAssetDetailPopup
            assetKind={item.kind}
            title={item.title}
            subtitle={KIND_LABELS[item.kind]}
            media={media}
            badges={badgesFor(item)}
            stats={{ plays: item.plays, hearts: item.hearts, saves: item.saves, followers: null }}
            description={item.description}
            isLiked={likedIds.includes(item.id)}
            isSaved={savedIds.includes(item.id)}
            onLike={() => toggleLiked(item.id)}
            onPrimaryAction={() =>
              setActionNotice({
                label: "Play",
                message: `Playing "${item.title}" starts its session when live wiring lands. Nothing was started in this preview.`,
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
