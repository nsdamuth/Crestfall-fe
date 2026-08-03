"use client";

import { useMemo, useState } from "react";

import StoryRoomsHubView from "@/components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view";
import {
  storyRoomsHubDeleteErrorFixture,
  storyRoomsHubEmptyFixture,
  storyRoomsHubLoadErrorFixture,
  storyRoomsHubLoadingFixture,
  storyRoomsHubPopulatedFixture,
} from "@/components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.fixtures";
import { getStoryRoomsHubViewProps } from "@/components/studio/story-rooms/story-rooms-hub/useStoryRoomsHubViewModel";

const STATES = Object.freeze({
  populated: storyRoomsHubPopulatedFixture,
  loading: storyRoomsHubLoadingFixture,
  empty: storyRoomsHubEmptyFixture,
  "load-error": storyRoomsHubLoadErrorFixture,
  "delete-error": storyRoomsHubDeleteErrorFixture,
});

function PreviewLink({ href, children, ...props }) {
  return (
    <a href={href} {...props} onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

function PreviewViewModeToggle({ value, onChange, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-1">
      <span className="px-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </span>
      {[
        ["grid", "Grid"],
        ["list", "List"],
      ].map(([mode, modeLabel]) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange?.(mode)}
          className={`rounded-lg px-3 py-2 text-xs ${
            value === mode
              ? "bg-[var(--muted-gold)]/20 text-[var(--foreground)]"
              : "text-[var(--muted)]"
          }`}
        >
          {modeLabel}
        </button>
      ))}
    </div>
  );
}

export default function StoryRoomsHubPreviewClient() {
  const [stateKey, setStateKey] = useState("populated");
  const [rooms, setRooms] = useState(STATES.populated.rooms);
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [deletingRooms, setDeletingRooms] = useState(false);

  const selectedFixture = STATES[stateKey];
  const activeRooms = stateKey === "populated" || stateKey === "delete-error"
    ? rooms
    : selectedFixture.rooms;

  const viewProps = useMemo(
    () =>
      getStoryRoomsHubViewProps({
        ...selectedFixture,
        rooms: activeRooms,
        activeFilter,
        query,
        viewMode,
        mobileToolsOpen,
        manageMode,
        selectedRoomIds,
        deletingRooms,
        deleteError: deleteError || selectedFixture.deleteError,
      }),
    [
      selectedFixture,
      activeRooms,
      activeFilter,
      query,
      viewMode,
      mobileToolsOpen,
      manageMode,
      selectedRoomIds,
      deletingRooms,
      deleteError,
    ]
  );

  function selectState(nextStateKey) {
    const nextFixture = STATES[nextStateKey];

    setStateKey(nextStateKey);
    setRooms(nextFixture.rooms);
    setActiveFilter(nextFixture.activeFilter);
    setQuery(nextFixture.query);
    setViewMode(nextFixture.viewMode);
    setMobileToolsOpen(nextFixture.mobileToolsOpen);
    setManageMode(nextFixture.manageMode);
    setSelectedRoomIds(nextFixture.selectedRoomIds);
    setDeleteError("");
    setDeletingRooms(false);
  }

  function toggleManageMode() {
    setDeleteError("");
    setManageMode((current) => {
      const next = !current;

      if (!next) {
        setSelectedRoomIds([]);
      }

      return next;
    });
  }

  function toggleRoomSelection(roomId) {
    setSelectedRoomIds((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  }

  function deleteSelectedRooms() {
    if (!selectedRoomIds.length || deletingRooms) return;

    if (stateKey === "delete-error") {
      setDeleteError("Storys could not be deleted.");
      return;
    }

    setDeletingRooms(true);
    const selected = new Set(selectedRoomIds);

    setRooms((current) => current.filter((room) => !selected.has(room.id)));
    setSelectedRoomIds([]);
    setManageMode(false);
    setDeletingRooms(false);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2">
          {Object.keys(STATES).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectState(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                stateKey === key
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/15 text-[var(--muted)] hover:border-[var(--muted-gold)]/40"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <StoryRoomsHubView
          {...viewProps}
          onToggleMobileTools={() =>
            setMobileToolsOpen((current) => !current)
          }
          onQueryChange={setQuery}
          onActiveFilterChange={setActiveFilter}
          onViewModeChange={setViewMode}
          onToggleManageMode={toggleManageMode}
          onToggleRoomSelection={toggleRoomSelection}
          onDeleteSelectedRooms={deleteSelectedRooms}
          InternalLinkComponent={PreviewLink}
          ViewModeToggleComponent={PreviewViewModeToggle}
        />
      </div>
    </main>
  );
}
