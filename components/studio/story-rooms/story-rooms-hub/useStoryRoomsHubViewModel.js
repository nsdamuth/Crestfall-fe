"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import usePersistentViewMode from "@/components/studio/usePersistentViewMode";
import {
  deleteStoryRoom,
  fetchStoryRooms,
} from "@/lib/client/studio/story-rooms/storyRoomClient";

export const STORY_ROOMS_HUB_FILTERS = Object.freeze([
  { id: "ACTIVE", label: "Active" },
  { id: "TEMPLATE", label: "Templates" },
  { id: "PRIVATE", label: "Private" },
  { id: "ARCHIVED", label: "Archived" },
]);

export const STORY_ROOMS_VIEW_MODE_STORAGE_KEY =
  "crestfall.storyRooms.viewMode";

const DEFAULT_LOAD_ERROR = "Stories could not be loaded.";
const DEFAULT_DELETE_ERROR = "Storys could not be deleted.";

function getRoomId(room) {
  return room?.id;
}

export function formatRoomTimestamp(value, now = Date.now()) {
  if (!value) return "Recently";

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return String(value);
  }

  const diffMs = Number(now) - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return timestamp.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function normalizeRoomForHub(room = {}, index = 0, now = Date.now()) {
  const id = getRoomId(room) ?? `story-room-${index}`;

  return {
    id,
    href: `/studio/story-rooms/${id}`,
    title: room.title || "Private Story",
    subtitle: room.subtitle || "Private Story",
    type: room.type || "Active Room",
    status: room.status || "ACTIVE",
    visibility: room.visibility || "PRIVATE",
    contentRating: room.contentRating || "SFW",
    scenario: room.scenario || "Character Chat",
    narrator: room.narrator || "Crestfall Engine",
    location: room.location || "Unspecified Location",
    roomMode: room.roomMode || "Private Character Chat",
    cast: Array.isArray(room.cast) && room.cast.length ? room.cast : ["You"],
    lastMessage: room.lastMessage || "Open the story to continue.",
    lastActive: formatRoomTimestamp(room.lastActive, now),
    messages: Number.isFinite(Number(room.messages)) ? Number(room.messages) : 0,
  };
}

export function filterStoryRooms({
  rooms = [],
  activeFilter = "ACTIVE",
  query = "",
} = {}) {
  const normalizedQuery = String(query ?? "").trim().toLowerCase();

  return rooms.filter((room) => {
    const matchesFilter =
      activeFilter === "ACTIVE"
        ? room.status === "ACTIVE"
        : activeFilter === "TEMPLATE"
          ? room.status === "TEMPLATE"
          : activeFilter === "PRIVATE"
            ? room.visibility === "PRIVATE"
            : activeFilter === "ARCHIVED"
              ? room.status === "ARCHIVED"
              : true;

    const searchableText = [
      room.title,
      room.subtitle,
      room.type,
      room.status,
      room.visibility,
      room.contentRating,
      room.scenario,
      room.narrator,
      room.location,
      room.lastMessage,
      ...room.cast,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });
}

export function getStoryRoomsHubViewProps({
  rooms = [],
  loading = false,
  loadError = "",
  deleteError = "",
  deletingRooms = false,
  mobileToolsOpen = false,
  activeFilter = "ACTIVE",
  query = "",
  viewMode = "grid",
  manageMode = false,
  selectedRoomIds = [],
  now = Date.now(),
} = {}) {
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const normalizedRooms = safeRooms.map((room, index) =>
    normalizeRoomForHub(room, index, now)
  );
  const selectedIds = new Set(
    Array.isArray(selectedRoomIds) ? selectedRoomIds : []
  );
  const visibleRooms = filterStoryRooms({
    rooms: normalizedRooms,
    activeFilter,
    query,
  }).map((room) => ({
    ...room,
    selected: selectedIds.has(room.id),
  }));
  const selectedCount = selectedIds.size;

  return {
    filters: STORY_ROOMS_HUB_FILTERS,
    activeFilter,
    activeFilterLabel:
      STORY_ROOMS_HUB_FILTERS.find(
        (filter) => filter.id === activeFilter
      )?.label || "Active",
    query,
    viewMode,
    mobileToolsOpen,
    manageMode,
    deletingRooms,
    selectedCount,
    canDeleteSelected: selectedCount > 0 && !deletingRooms,
    visibleRooms,
    hasRooms: normalizedRooms.length > 0,
    latestRoomHref: normalizedRooms[0]?.href || "",
    createTemplateHref: "/studio/create/room-template",
    loadError: String(loadError || ""),
    deleteError: String(deleteError || ""),
    showLoading: Boolean(loading),
    showEmpty: !loading && visibleRooms.length === 0,
    libraryEyebrow: "Room Library",
    libraryDescription:
      "Storys are active playable sessions. Stories are reusable setups that package characters, scenarios, narrators, and openings.",
    desktopSearchPlaceholder:
      "Search rooms, scenarios, narrators, cast...",
    mobileSearchPlaceholder: "Search rooms...",
    loadingTitle: "Loading Storys",
    loadingMessage: "Crestfall is loading your active story sessions.",
    emptyTitle: "No rooms found",
    emptyMessage:
      "Active Storys and reusable stories will appear here once the backend is connected.",
  };
}

export function confirmStoryRoomDeletion() {
  if (typeof window === "undefined") return false;

  return window.confirm(
    [
      "Delete selected Storys?",
      "",
      "This permanently deletes the selected chat sessions and their messages.",
      "Underlying characters, templates, scenarios, narrators, and locations are not deleted.",
      "Interaction totals will remain.",
      "",
      "This cannot be undone.",
    ].join("\n")
  );
}

export function useStoryRoomsHubViewModel({
  loadStoryRooms = fetchStoryRooms,
  removeStoryRoom = deleteStoryRoom,
  confirmDelete = confirmStoryRoomDeletion,
} = {}) {
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = usePersistentViewMode({
    storageKey: STORY_ROOMS_VIEW_MODE_STORAGE_KEY,
    desktopDefault: "grid",
    mobileDefault: "list",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [manageMode, setManageMode] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [deletingRooms, setDeletingRooms] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRooms() {
      setLoading(true);
      setLoadError("");

      try {
        const loadedRooms = await loadStoryRooms();

        if (cancelled) return;

        setRooms(Array.isArray(loadedRooms) ? loadedRooms : []);
      } catch (error) {
        if (cancelled) return;

        setRooms([]);
        setLoadError(error?.message || DEFAULT_LOAD_ERROR);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, [loadStoryRooms]);

  const toggleManageMode = useCallback(() => {
    setDeleteError("");
    setManageMode((current) => {
      const next = !current;

      if (!next) {
        setSelectedRoomIds([]);
      }

      return next;
    });
  }, []);

  const toggleRoomSelection = useCallback((roomId) => {
    setSelectedRoomIds((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  }, []);

  const deleteSelectedRooms = useCallback(async () => {
    if (!selectedRoomIds.length || deletingRooms) return;
    if (!confirmDelete(selectedRoomIds)) return;

    const selectedIds = [...selectedRoomIds];

    setDeletingRooms(true);
    setDeleteError("");

    try {
      for (const roomId of selectedIds) {
        await removeStoryRoom(roomId);
      }

      const selectedSet = new Set(selectedIds);

      setRooms((current) =>
        current.filter((room) => !selectedSet.has(getRoomId(room)))
      );
      setSelectedRoomIds([]);
      setManageMode(false);
    } catch (error) {
      setDeleteError(error?.message || DEFAULT_DELETE_ERROR);
    } finally {
      setDeletingRooms(false);
    }
  }, [confirmDelete, deletingRooms, removeStoryRoom, selectedRoomIds]);

  const viewProps = useMemo(
    () =>
      getStoryRoomsHubViewProps({
        rooms,
        loading,
        loadError,
        deleteError,
        deletingRooms,
        mobileToolsOpen,
        activeFilter,
        query,
        viewMode,
        manageMode,
        selectedRoomIds,
      }),
    [
      rooms,
      loading,
      loadError,
      deleteError,
      deletingRooms,
      mobileToolsOpen,
      activeFilter,
      query,
      viewMode,
      manageMode,
      selectedRoomIds,
    ]
  );

  return {
    ...viewProps,
    onToggleMobileTools: () => setMobileToolsOpen((current) => !current),
    onQueryChange: setQuery,
    onActiveFilterChange: setActiveFilter,
    onViewModeChange: setViewMode,
    onToggleManageMode: toggleManageMode,
    onToggleRoomSelection: toggleRoomSelection,
    onDeleteSelectedRooms: deleteSelectedRooms,
  };
}
