"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square } from "lucide-react";

import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import usePersistentViewMode from "@/components/studio/usePersistentViewMode";
import ViewModeToggleView from "@/components/studio/view-mode-toggle/ViewModeToggle.view";
import { deleteStoryRoom } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";
import {
  projectCreationsToStoryStartables,
  projectStoryRoomToContinueItem,
  resolveStoryContinueImageSrc,
} from "@/lib/shared/presentation/storiesPresentation";
import { useStoryLaunchController } from "@/components/studio/story-rooms/hooks/useStoryLaunchController";
import StoryLaunchRequirementsSheet from "./StoryLaunchRequirementsSheet";

const PAGE_SIZE = 12;
const KIND_LABELS = Object.freeze({
  character: "Character",
  story: "Story",
  adventure: "Adventure",
});
const VISIBILITY_LABELS = Object.freeze({
  PRIVATE: "Private",
  INTERNAL: "Internal",
  PUBLIC: "Public",
  CANON: "Canon",
});
const TYPE_OPTIONS = Object.freeze([
  { value: "character", label: "Characters" },
  { value: "story", label: "Stories" },
  { value: "adventure", label: "Adventures" },
]);
const STATUS_OPTIONS = Object.freeze([
  { value: "startable", label: "Startable" },
  { value: "templates", label: "Story Templates" },
  { value: "archived", label: "Archived" },
]);
const VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "INTERNAL", label: "Internal" },
  { value: "PUBLIC", label: "Public" },
  { value: "CANON", label: "Canon" },
]);
const SORT_OPTIONS = Object.freeze([
  { value: "recent", label: "Latest activity" },
  { value: "title", label: "Title A to Z" },
]);

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

function EmptyState({ title, body }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-12)] text-center">
      <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
        {title}
      </p>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {body}
      </p>
    </div>
  );
}

function DeleteRoomsConfirmSheet({ count, pending, onConfirm, onCancel }) {
  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm Story deletion">
      <div className="p-[var(--space-5)]">
        <h2 className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          Delete selected {count === 1 ? "Story" : "Stories"}?
        </h2>
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          This permanently deletes the selected chat sessions and their messages. Underlying Characters, Story Templates, Scenarios, Narrators, Locations, and Adventures are not deleted.
        </p>
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          This cannot be undone.
        </p>
        <div aria-hidden="true" className="mt-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />
        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <button type="button" onClick={onCancel} disabled={pending} className="cf-btn cf-btn--secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={pending} className="cf-btn cf-btn--danger-filled disabled:opacity-50">
            {pending ? "Deleting..." : `Delete ${count}`}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function normalizeSearchText(item) {
  return [
    item.title,
    item.subtitle,
    KIND_LABELS[item.kind],
    item.description,
    item.scenario,
    item.narrator,
    item.location,
    ...(Array.isArray(item.cast) ? item.cast : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function StoriesV2Live({
  rooms = [],
  ownedCreations = [],
  communityCreations = [],
  loadError = null,
  savedSourceError = null,
} = {}) {
  const router = useRouter();
  const [layout, setLayout] = usePersistentViewMode({
    storageKey: "cf.stories.viewMode",
    desktopDefault: "grid",
    mobileDefault: "list",
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedSort, setSelectedSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [visibleContinueCount, setVisibleContinueCount] = useState(PAGE_SIZE);
  const [manageRooms, setManageRooms] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingRooms, setDeletingRooms] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const continueItems = useMemo(
    () =>
      (Array.isArray(rooms) ? rooms : [])
        .map(projectStoryRoomToContinueItem)
        .sort((a, b) => b.recency - a.recency),
    [rooms]
  );
  const ownedStartables = useMemo(
    () => projectCreationsToStoryStartables(ownedCreations, { isOwn: true }),
    [ownedCreations]
  );
  const publicCandidates = useMemo(
    () => projectCreationsToStoryStartables(communityCreations, { isOwn: false }),
    [communityCreations]
  );
  const engagementCandidates = useMemo(() => {
    const byId = new Map();
    [...ownedStartables, ...publicCandidates].forEach((item) => {
      if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
    });
    return [...byId.values()];
  }, [ownedStartables, publicCandidates]);
  const engagement = useCreationEngagementState(engagementCandidates);
  const startableItems = useMemo(() => {
    const ownedIds = new Set(ownedStartables.map((item) => item.id));
    const savedPublic = publicCandidates.filter(
      (item) => !ownedIds.has(item.id) && engagement.isCreationBookmarked(item)
    );
    return [...ownedStartables, ...savedPublic];
  }, [ownedStartables, publicCandidates, engagement.bookmarkedCreationIds]);
  const creationById = useMemo(
    () => new Map(engagementCandidates.map((item) => [item.id, item])),
    [engagementCandidates]
  );
  const launchController = useStoryLaunchController();

  const query = searchValue.trim().toLowerCase();
  const filteredContinue = useMemo(
    () =>
      continueItems.filter(
        (item) => !query || normalizeSearchText(item).includes(query)
      ),
    [continueItems, query]
  );

  const statusValues = selectedValues.status || [];
  const typeValues = selectedValues.type || [];
  const visibilityValues = selectedValues.visibility || [];
  const ratingValues = selectedValues.rating || [];

  const filteredStartables = useMemo(() => {
    let pool = startableItems;

    if (statusValues.includes("archived")) {
      pool = pool.filter((item) => item.isArchived);
    } else {
      pool = pool.filter((item) => !item.isArchived);
      if (statusValues.includes("templates")) {
        pool = pool.filter((item) => item.type === "ROOM_TEMPLATE");
      }
    }

    const filtered = pool.filter((item) => {
      if (typeValues.length && !typeValues.includes(item.kind)) return false;
      if (visibilityValues.length && !visibilityValues.includes(item.visibility)) return false;
      if (ratingValues.length && !ratingValues.includes(item.ratingTier)) return false;
      if (query && !normalizeSearchText(item).includes(query)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (selectedSort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => b.recency - a.recency);
    return sorted;
  }, [
    query,
    ratingValues,
    selectedSort,
    startableItems,
    statusValues,
    typeValues,
    visibilityValues,
  ]);

  const filterGroups = useMemo(
    () => [
      {
        id: "type",
        label: "Type",
        isMultiSelect: true,
        options: TYPE_OPTIONS.map((option) => ({
          ...option,
          count: startableItems.filter((item) => item.kind === option.value && !item.isArchived).length,
        })),
      },
      {
        id: "status",
        label: "Status",
        isMultiSelect: true,
        options: STATUS_OPTIONS.map((option) => ({
          ...option,
          count:
            option.value === "templates"
              ? startableItems.filter((item) => item.type === "ROOM_TEMPLATE" && !item.isArchived).length
              : option.value === "archived"
                ? startableItems.filter((item) => item.isArchived).length
                : startableItems.filter((item) => !item.isArchived).length,
        })),
      },
      {
        id: "visibility",
        label: "Visibility",
        isMultiSelect: true,
        options: VISIBILITY_OPTIONS.map((option) => ({
          ...option,
          count: startableItems.filter((item) => item.visibility === option.value).length,
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
          count: startableItems.filter((item) => item.ratingTier === tier.tier).length,
        })),
      },
    ],
    [startableItems]
  );

  const visibleContinueItems = filteredContinue.slice(0, visibleContinueCount);
  const visibleItems = filteredStartables.slice(0, visibleCount);

  function toggleFilter(groupId, value) {
    setSelectedValues((current) => {
      const currentValues = current[groupId] || [];
      return {
        ...current,
        [groupId]: currentValues.includes(value)
          ? currentValues.filter((entry) => entry !== value)
          : [...currentValues, value],
      };
    });
    setVisibleCount(PAGE_SIZE);
  }

  function badgesFor(item) {
    if (item.isCanon || item.visibility === "CANON") {
      return [{ label: "Canon", variant: "canon" }];
    }
    if (!item.visibility) return [];
    return [{ label: VISIBILITY_LABELS[item.visibility] || item.visibility, variant: "status" }];
  }

  function continueRoom(item) {
    router.push(`/studio/story-rooms/${encodeURIComponent(item.roomId)}`);
  }

  function openStartable(item) {
    if (item.isOwn && !["PUBLIC", "CANON"].includes(item.visibility)) {
      router.push(`/studio/v2/editor/${encodeURIComponent(item.id)}?origin=stories`);
      return;
    }
    router.push(`/studio/creations/${encodeURIComponent(item.id)}`);
  }

  function startItem(item) {
    if (!item.playableNow) return;
    launchController.launch(item.rawCreation || item);
  }

  function toggleRoomSelection(roomId) {
    setSelectedRoomIds((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  }

  async function confirmDeleteRooms() {
    if (!selectedRoomIds.length || deletingRooms) return;
    setDeletingRooms(true);
    setDeleteError("");
    try {
      for (const roomId of selectedRoomIds) {
        await deleteStoryRoom(roomId);
      }
      // The server page owns the source list. A full refresh gives us the
      // authoritative post-delete ordering and message summaries.
      setDeleteConfirmOpen(false);
      setSelectedRoomIds([]);
      setManageRooms(false);
      router.refresh();
    } catch (error) {
      setDeleteError(error?.message || "Selected Stories could not be deleted.");
    } finally {
      setDeletingRooms(false);
    }
  }

  const combinedError = loadError || deleteError || launchController.launchError || engagement.engagementMessage;

  return (
    <>
      <KitStudioPageView
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
              setVisibleContinueCount(PAGE_SIZE);
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
            imageAnchor="center 45%"
            onCtaClick={() => router.push("/studio/v2/adventures")}
          />
        }
      >
        {combinedError ? (
          <KitAlertStripView tone="danger" title={combinedError} body="The rest of the page remains available where possible." />
        ) : savedSourceError ? (
          <KitAlertStripView
            tone="warning"
            title="Saved public Stories are temporarily unavailable."
            body="Your owned creations and active Story rooms are still available."
          />
        ) : null}

        {filteredContinue.length > 0 ? (
          <div className="flex flex-col gap-[var(--space-4)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
              <SectionLabel>Continue</SectionLabel>
              <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                <button
                  type="button"
                  aria-pressed={manageRooms}
                  onClick={() => {
                    setManageRooms((current) => !current);
                    setSelectedRoomIds([]);
                  }}
                  className={`cf-btn ${manageRooms ? "cf-btn--danger" : "cf-btn--secondary"}`}
                >
                  {manageRooms ? "Cancel manage" : "Manage rooms"}
                </button>
                {manageRooms ? (
                  <button
                    type="button"
                    disabled={!selectedRoomIds.length}
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="cf-btn cf-btn--danger disabled:opacity-50"
                  >
                    {selectedRoomIds.length
                      ? `Delete selected (${selectedRoomIds.length})`
                      : "Delete selected"}
                  </button>
                ) : null}
              </div>
            </div>

            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4"
                  : "grid grid-cols-1 gap-[var(--space-3)] min-[1100px]:grid-cols-2"
              }
            >
              {visibleContinueItems.map((item) => {
                const sourceCreation = item.sourceCreationId
                  ? creationById.get(item.sourceCreationId)
                  : null;
                return (
                  <div key={item.id} className="relative">
                    {manageRooms ? (
                      <button
                        type="button"
                        aria-pressed={selectedRoomIds.includes(item.id)}
                        aria-label={selectedRoomIds.includes(item.id) ? "Deselect Story" : "Select Story"}
                        onClick={() => toggleRoomSelection(item.id)}
                        className="absolute left-[var(--space-2)] top-[var(--space-2)] z-[4] flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--gold-bright)]"
                      >
                        {selectedRoomIds.includes(item.id) ? (
                          <CheckSquare size={16} aria-hidden="true" />
                        ) : (
                          <Square size={16} aria-hidden="true" />
                        )}
                      </button>
                    ) : null}
                    <KitCreationCardView
                      layout={layout}
                      assetKind={item.kind}
                      title={item.title}
                      subtitle={item.subtitle || KIND_LABELS[item.kind]}
                      imageSrc={resolveStoryContinueImageSrc(item, sourceCreation)}
                      badges={badgesFor(item)}
                      stats={{ plays: item.rawRoom?.messages ?? 0, hearts: null, saves: null, followers: null }}
                      liked={sourceCreation ? engagement.isCreationLiked(sourceCreation) : false}
                      bookmarked={sourceCreation ? engagement.isCreationBookmarked(sourceCreation) : false}
                      onOpenAssetDetail={() => (manageRooms ? toggleRoomSelection(item.id) : continueRoom(item))}
                      onLike={
                        sourceCreation
                          ? () => engagement.toggleCreationLike(sourceCreation)
                          : () => setActionMessage("This session has no source creation to Like.")
                      }
                      onBookmark={
                        sourceCreation
                          ? () => engagement.toggleCreationBookmark(sourceCreation)
                          : () => setActionMessage("This session has no source creation to Save.")
                      }
                      onContinue={() => (manageRooms ? toggleRoomSelection(item.id) : continueRoom(item))}
                    />
                  </div>
                );
              })}
            </div>

            <KitLoadMoreView
              isLoading={false}
              hasMore={visibleContinueCount < filteredContinue.length}
              remainingCount={Math.max(filteredContinue.length - visibleContinueCount, 0)}
              onLoadMore={() =>
                setVisibleContinueCount((count) =>
                  Math.min(count + PAGE_SIZE, filteredContinue.length)
                )
              }
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-[var(--space-4)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
            <SectionLabel>Start something</SectionLabel>
            <button
              type="button"
              onClick={() => router.push("/studio/create/room-template")}
              className="cf-btn cf-btn--secondary"
            >
              New Story
            </button>
          </div>

          {filteredStartables.length === 0 ? (
            <EmptyState
              title="Nothing startable yet"
              body="Create a Character or Story, or save public work from Community."
            />
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
                    subtitle={item.subtitle || KIND_LABELS[item.kind]}
                    imageSrc={item.imageSrc}
                    badges={badgesFor(item)}
                    stats={{ plays: item.plays, hearts: item.hearts, saves: item.saves, followers: null }}
                    liked={engagement.isCreationLiked(item)}
                    bookmarked={engagement.isCreationBookmarked(item)}
                    onOpenAssetDetail={() => openStartable(item)}
                    onLike={() => engagement.toggleCreationLike(item)}
                    onBookmark={() => engagement.toggleCreationBookmark(item)}
                    onPlay={!item.isArchived && item.playableNow ? () => startItem(item) : null}
                  />
                ))}
              </div>

              <KitLoadMoreView
                isLoading={false}
                hasMore={visibleCount < filteredStartables.length}
                remainingCount={Math.max(filteredStartables.length - visibleCount, 0)}
                onLoadMore={() =>
                  setVisibleCount((count) =>
                    Math.min(count + PAGE_SIZE, filteredStartables.length)
                  )
                }
              />
            </>
          )}
        </div>
      </KitStudioPageView>

      {actionMessage ? (
        <KitModalFrame variant="sheet" onClose={() => setActionMessage("")} ariaLabel="Story action">
          <div className="p-[var(--space-5)]">
            <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
              {actionMessage}
            </p>
            <div className="mt-[var(--space-4)] flex justify-end">
              <button type="button" onClick={() => setActionMessage("")} className="cf-btn cf-btn--primary">
                Close
              </button>
            </div>
          </div>
        </KitModalFrame>
      ) : null}

      <StoryLaunchRequirementsSheet picker={launchController.picker} />

      {deleteConfirmOpen ? (
        <DeleteRoomsConfirmSheet
          count={selectedRoomIds.length}
          pending={deletingRooms}
          onConfirm={confirmDeleteRooms}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}
