"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import { projectCommunityCreations } from "@/lib/shared/presentation/communityPresentation";
import AdventuresView from "./adventures/Adventures.view";
import { ADVENTURES_SORT_OPTIONS } from "./adventures/adventuresContent.mock";

const PAGE_SIZE = 12;

function toAdventureCard(item, engagement, router) {
  return {
    cardKind: "creation",
    assetKind: "adventure",
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    badges: item.isCanon ? [{ label: "Canon", variant: "canon" }] : [],
    stats: {
      plays: item.plays,
      hearts: item.hearts,
      saves: item.saves,
      followers: null,
    },
    liked: engagement.isCreationLiked(item),
    bookmarked: engagement.isCreationBookmarked(item),
    onOpenAssetDetail: () =>
      router.push(`/studio/creations/${encodeURIComponent(item.id)}`),
    onLike: () => engagement.toggleCreationLike(item),
    onBookmark: () => engagement.toggleCreationBookmark(item),
    // Direct Storyline/Adventure launch is intentionally withheld here.
    // Current production startStoryFromCreation supports CHARACTER and
    // ROOM_TEMPLATE roots, while Storyline runtime authority exists behind
    // the Story runtime without a user-facing launch endpoint yet. Omitting
    // onPlay makes KitCreationCard expose its honest expand fallback rather
    // than pretending the first child Story is equivalent to an Adventure.
  };
}

export default function AdventuresLive({ creations = [], loadError = null } = {}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(ADVENTURES_SORT_OPTIONS[0].value);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const adventures = useMemo(
    () =>
      projectCommunityCreations(creations).filter(
        (item) => String(item.type || "").toUpperCase() === "STORYLINE"
      ),
    [creations]
  );
  const engagement = useCreationEngagementState(adventures);

  const filtered = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const scoped = query
      ? adventures.filter((item) =>
          [item.title, item.subtitle, item.description, item.creatorHandle]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : adventures;
    const sorted = [...scoped];

    if (sortValue === "most-played") {
      sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (sortValue === "recently-added") {
      sorted.sort((a, b) => (b.recency || 0) - (a.recency || 0));
    } else {
      sorted.sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
    }

    return sorted;
  }, [adventures, searchValue, sortValue]);

  const catalogItems = filtered
    .slice(0, visibleCount)
    .map((item) => toAdventureCard(item, engagement, router));
  const hasMore = visibleCount < filtered.length;
  const combinedError = loadError || engagement.engagementMessage || null;

  return (
    <AdventuresView
      topBanner={{
        eyebrow: "Adventures",
        title: "Seasons worth committing to.",
        ctaLabel: "Build an Adventure",
        imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Saeha Veyrune.png"),
        onCtaClick: () => router.push("/studio/create/storyline"),
      }}
      filterBar={{
        searchValue,
        searchPlaceholder: "Search Adventures",
        onSearchChange: (value) => {
          setSearchValue(value);
          setVisibleCount(PAGE_SIZE);
        },
        sortOptions: ADVENTURES_SORT_OPTIONS,
        selectedSort: sortValue,
        onSortChange: (value) => {
          setSortValue(value);
          setVisibleCount(PAGE_SIZE);
        },
      }}
      catalogItems={catalogItems}
      emptyMessage={
        !combinedError && filtered.length === 0
          ? searchValue.trim()
            ? `No Adventures match "${searchValue.trim()}".`
            : "No Adventures have been published yet."
          : null
      }
      errorMessage={combinedError}
      loadMore={{
        isLoading: false,
        hasMore,
        remainingCount: hasMore ? filtered.length - visibleCount : null,
        onLoadMore: () =>
          setVisibleCount((current) => Math.min(current + PAGE_SIZE, filtered.length)),
      }}
      bottomBanner={{
        eyebrow: "Create",
        title: "Every Adventure starts in Studio.",
        ctaLabel: "Open Studio",
        imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Enox Nix.png"),
        onCtaClick: () => router.push("/studio"),
      }}
      notice={null}
      onCloseNotice={null}
      harnessSlot={null}
    />
  );
}
