"use client";

// Shared Creators page composition. The dev preview stays fixture-driven;
// /studio/v2/creators injects live Crestfall creator summaries and canonical
// follow state. Presentation filtering remains local so fixture and live modes
// exercise the same V2 Skin.
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreatorCardView from "@/components/kit/creator-card/KitCreatorCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitImageOverlay from "@/components/kit/KitImageOverlay";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";
import FixtureActionNotice from "../FixtureActionNotice";

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

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

const FIXTURE_SORT_OPTIONS = [
  { value: "followers", label: "Most followed" },
  { value: "plays", label: "Most played" },
  { value: "hearts", label: "Most hearted" },
  { value: "recent", label: "Recently active" },
];

const LIVE_SORT_OPTIONS = [
  { value: "followers", label: "Most followed" },
  { value: "hearts", label: "Most hearted" },
  { value: "works", label: "Most works" },
];

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
  error: "Error",
};

const PAGE_SIZE = 9;
const VIEW_MODE_STORAGE_KEY = "cf.creators.viewMode";

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


function CreatorListRow({ creator, cardProps, isFollowing, onFollow, onViewProfile }) {
  const displayName = creator.displayName || creator.handle || "Crestfall Creator";
  const summary = creator.summary || "Crestfall creator.";

  return (
    <article className="group flex flex-col gap-[var(--space-3)] border-b border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-4)] transition-colors hover:bg-[var(--surface-1)] min-[800px]:flex-row min-[800px]:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-[var(--space-3)]">
        <span className="flex h-[var(--space-12)] w-[var(--space-12)] flex-none items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--surface-3)]">
          {creator.avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={creator.avatarSrc} alt="" width={48} height={48} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-[length:var(--text-lead)] text-[var(--ink-dim)]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            <h3 className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
              {displayName}
            </h3>
            {creator.canonContributor ? (
              <span className="rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--fill)] px-[var(--space-2)] py-[2px] text-[10px] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
                Canon
              </span>
            ) : null}
          </div>
          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {creator.handle}
          </p>
          <p className="mt-[var(--space-1)] line-clamp-1 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {summary}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-faint)] min-[800px]:justify-end">
        <span><span className="tabular-nums text-[var(--ink-dim)]">{cardProps?.stats?.followers ?? 0}</span> followers</span>
        <span><span className="tabular-nums text-[var(--ink-dim)]">{cardProps?.stats?.likes ?? 0}</span> likes</span>
        <span><span className="tabular-nums text-[var(--ink-dim)]">{cardProps?.stats?.works ?? 0}</span> works</span>
      </div>

      <div className="flex flex-none gap-[var(--space-2)] min-[800px]:ml-auto">
        <button
          type="button"
          disabled={!creator.canFollow}
          onClick={() => onFollow?.()}
          className={`cf-btn min-w-[7rem] ${creator.canFollow && isFollowing ? "cf-btn--primary" : "cf-btn--secondary"}`}
        >
          {!creator.canFollow ? "You" : isFollowing ? "Following" : "Follow"}
        </button>
        <button type="button" onClick={() => onViewProfile?.()} className="cf-btn cf-btn--secondary min-w-[7rem]">
          View profile
        </button>
      </div>
    </article>
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

function normalizeFixtureThumbnail(creator, thumbnail, index) {
  if (thumbnail && typeof thumbnail === "object") {
    return {
      id: thumbnail.id || `${creator.id}-thumb-${index}`,
      imageSrc: thumbnail.imageSrc || null,
      alt: thumbnail.alt || `${creator.handle} recent work ${index + 1}`,
      creationId: thumbnail.creationId || null,
      title: thumbnail.title || creator.handle,
    };
  }

  return {
    id: `${creator.id}-thumb-${index}`,
    imageSrc: thumbnail,
    alt: `${creator.handle} recent work ${index + 1}`,
    creationId: null,
    title: creator.handle,
  };
}

export default function CreatorsV2Mockup({
  live = false,
  creators = [],
  loadError = null,
} = {}) {
  const router = useRouter();
  const [fixtureMode, setFixtureMode] = useState("default");
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState("followers");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sourceCreators = live ? creators : FIXTURE_CREATORS;
  const effectiveMode = live ? (loadError ? "error" : "default") : fixtureMode;
  const [followingIds, setFollowingIds] = useState(() =>
    sourceCreators.filter((creator) => creator.isFollowing).map((creator) => creator.id)
  );
  const [overlayImage, setOverlayImage] = useState(null);
  const [lovedThumbIds, setLovedThumbIds] = useState([]);
  const [savedThumbIds, setSavedThumbIds] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (stored === "grid" || stored === "list") setLayout(stored);
    } catch {}
  }, []);

  function changeLayout(nextLayout) {
    if (nextLayout !== "grid" && nextLayout !== "list") return;
    setLayout(nextLayout);
    try {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, nextLayout);
    } catch {}
  }

  const filteredCreators = useMemo(() => {
    if (effectiveMode === "empty" || effectiveMode === "error") return [];

    const query = searchValue.trim().toLowerCase();
    const filtered = sourceCreators.filter((creator) =>
      query
        ? `${creator.handle || ""} ${creator.username || ""}`.toLowerCase().includes(query)
        : true
    );

    const sorted = [...filtered];
    if (selectedSort === "plays") {
      sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (selectedSort === "hearts") {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (selectedSort === "works") {
      sorted.sort((a, b) => (b.works || 0) - (a.works || 0));
    } else if (selectedSort === "recent") {
      sorted.sort((a, b) => (b.recency || 0) - (a.recency || 0));
    } else {
      sorted.sort((a, b) => (b.followers || 0) - (a.followers || 0));
    }
    return sorted;
  }, [effectiveMode, searchValue, selectedSort, sourceCreators]);

  const visibleCreators = filteredCreators.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCreators.length;

  async function toggleFollowing(creator) {
    if (!live) {
      setFollowingIds((current) =>
        current.includes(creator.id)
          ? current.filter((entry) => entry !== creator.id)
          : [...current, creator.id]
      );
      return;
    }

    if (!creator.canFollow || !creator.username) return;

    const currentlyFollowing = followingIds.includes(creator.id);
    const nextFollowing = !currentlyFollowing;

    setFollowingIds((current) =>
      nextFollowing
        ? [...new Set([...current, creator.id])]
        : current.filter((entry) => entry !== creator.id)
    );

    try {
      await setProfileFollowByUsername({
        username: creator.username,
        active: nextFollowing,
      });
    } catch (error) {
      setFollowingIds((current) =>
        currentlyFollowing
          ? [...new Set([...current, creator.id])]
          : current.filter((entry) => entry !== creator.id)
      );
      setActionNotice({
        label: nextFollowing ? "Follow creator" : "Unfollow creator",
        message: error?.message || "Follow state could not be saved.",
      });
    }
  }

  const creatorCardPropsById = useMemo(() => {
    const map = new Map();
    for (const creator of sourceCreators) {
      map.set(creator.id, {
        stats: {
          followers: creator.followers,
          likes: creator.likes ?? null,
          plays: creator.plays,
          works: creator.works,
        },
        thumbnails: (creator.thumbnails || [])
          .map((thumbnail, index) => normalizeFixtureThumbnail(creator, thumbnail, index))
          .filter((thumbnail) => thumbnail.imageSrc),
      });
    }
    return map;
  }, [sourceCreators]);

  const cardHandlersById = useMemo(() => {
    const map = new Map();
    for (const creator of sourceCreators) {
      map.set(creator.id, {
        onFollow: () => toggleFollowing(creator),
        onThumbnailOpen: (thumbnailId) => {
          const thumbnail = (creator.thumbnails || [])
            .map((entry, index) => normalizeFixtureThumbnail(creator, entry, index))
            .find((entry) => entry.id === thumbnailId);

          if (!thumbnail) return;

          if (live && thumbnail.creationId) {
            router.push(`/studio/creations/${encodeURIComponent(thumbnail.creationId)}`);
            return;
          }

          setOverlayImage({
            id: thumbnail.id,
            imageSrc: thumbnail.imageSrc,
            title: thumbnail.title || creator.handle,
          });
        },
        onViewProfile: () =>
          router.push(
            `/studio/v2/creators/${encodeURIComponent(
              creator.username || creator.handle.replace(/^@/, "")
            )}`
          ),
      });
    }
    return map;
  }, [live, router, sourceCreators, followingIds]);

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
            sortOptions={live ? LIVE_SORT_OPTIONS : FIXTURE_SORT_OPTIONS}
            selectedSort={selectedSort}
            onSortChange={(value) => {
              setSelectedSort(value);
              setVisibleCount(PAGE_SIZE);
            }}
            viewModeSlot={
              <ViewModeToggleView value={layout} label="Creator layout" onChange={changeLayout} />
            }
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
            onCtaClick={() => {
              if (live) {
                router.push("/studio/v2/lore");
                return;
              }
              setActionNotice({
                label: "Read the lore",
                message:
                  "This banner routes to Lore when the new pages cut over. Nothing was opened in this preview.",
              });
            }}
          />
        }
      >
        {effectiveMode === "error" && (
          <KitAlertStripView
            tone="danger"
            title="Creators could not be loaded."
            body={loadError || "Try refreshing the page."}
          />
        )}

        {effectiveMode === "loading" && <LoadingGrid />}

        {effectiveMode !== "loading" &&
          effectiveMode !== "error" &&
          filteredCreators.length === 0 && <EmptyState />}

        {effectiveMode !== "loading" &&
          effectiveMode !== "error" &&
          filteredCreators.length > 0 && (
            <>
              {layout === "list" ? (
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)]">
                  {visibleCreators.map((creator) => {
                    const cardProps = creatorCardPropsById.get(creator.id);
                    const handlers = cardHandlersById.get(creator.id);
                    return (
                      <CreatorListRow
                        key={creator.id}
                        creator={{ ...creator, canFollow: live ? creator.canFollow : true }}
                        cardProps={cardProps}
                        isFollowing={followingIds.includes(creator.id)}
                        onFollow={handlers.onFollow}
                        onViewProfile={handlers.onViewProfile}
                      />
                    );
                  })}
                </div>
              ) : (
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
                        canFollow={live ? creator.canFollow : true}
                        onThumbnailOpen={handlers.onThumbnailOpen}
                        onFollow={handlers.onFollow}
                        onViewProfile={handlers.onViewProfile}
                      />
                    );
                  })}
                </div>
              )}

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
          isLoved={lovedThumbIds.includes(overlayImage.id)}
          isSaved={savedThumbIds.includes(overlayImage.id)}
          onLove={() =>
            setLovedThumbIds((ids) =>
              ids.includes(overlayImage.id)
                ? ids.filter((id) => id !== overlayImage.id)
                : [...ids, overlayImage.id]
            )
          }
          onSave={() =>
            setSavedThumbIds((ids) =>
              ids.includes(overlayImage.id)
                ? ids.filter((id) => id !== overlayImage.id)
                : [...ids, overlayImage.id]
            )
          }
          onShare={() =>
            setActionNotice({
              label: "Share",
              message: "Sharing is wired when the page goes live. Nothing leaves this preview.",
            })
          }
          onClose={() => setOverlayImage(null)}
        />
      )}

      <FixtureActionNotice notice={actionNotice} onClose={() => setActionNotice(null)} />
    </>
  );
}
