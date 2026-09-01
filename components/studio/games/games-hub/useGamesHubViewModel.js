"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import usePersistentViewMode from "@/components/studio/usePersistentViewMode";
import { fetchGames } from "@/lib/client/studio/games/gamesClient";
import { playStoryTemplate } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

export const gamesHubFilters = Object.freeze([
  { id: "ALL", label: "All" },
  { id: "CONTINUE", label: "Continue" },
  { id: "OFFICIAL_CANON", label: "Official" },
  { id: "CANON_COMPATIBLE", label: "Canon-Compatible" },
  { id: "COMMUNITY_SANDBOX", label: "Community" },
  { id: "FEATURED", label: "Featured" },
]);

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

export function getRoomIdFromGameHref(href) {
  if (!href || typeof href !== "string") return null;

  const match = href.match(/\/studio\/(?:v2\/stories|story-rooms)\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function formatGameTimestamp(value, now = Date.now()) {
  if (!value) return "Recently";

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return String(value);

  const diffMs = now - timestamp.getTime();
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

export function normalizeGameForHub(game = {}, index = 0, now = Date.now()) {
  const continueRoomId =
    normalizeText(game.continueRoomId) || getRoomIdFromGameHref(game.href);
  const rawCast = Array.isArray(game.cast) ? game.cast : [];
  const cast = rawCast.map((item) => normalizeText(item)).filter(Boolean);
  const id = normalizeText(game.id || game.templateId, `game-${index}`);

  return {
    id,
    templateId: normalizeText(game.templateId || game.id),
    title: normalizeText(game.title, "Untitled Story"),
    subtitle: normalizeText(game.subtitle, "Playable Story Template"),
    description: normalizeText(game.description, "A playable Crestfall story."),
    badge: normalizeText(game.badge, continueRoomId ? "Continue" : "Playable"),
    playState: continueRoomId ? "CONTINUE" : normalizeText(game.playState, "NEW"),
    continueRoomId: continueRoomId || null,
    activeRoomCount: Number.isFinite(Number(game.activeRoomCount))
      ? Number(game.activeRoomCount)
      : 0,
    canonRelationship: normalizeText(
      game.canonRelationship,
      "COMMUNITY_SANDBOX"
    ),
    contentRating: normalizeText(game.contentRating, "SFW"),
    featured: Boolean(game.featured),
    scenario: normalizeText(game.scenario, "Flexible Scenario"),
    narrator: normalizeText(game.narrator, "Crestfall Engine"),
    cast: cast.length ? cast : ["Flexible Cast"],
    href: normalizeText(game.href) || null,
    lastActive: formatGameTimestamp(game.lastActive, now),
    messages: Number.isFinite(Number(game.messages)) ? Number(game.messages) : 0,
  };
}

export function filterGamesForHub({ games = [], activeFilter = "ALL", query = "" } = {}) {
  const normalizedQuery = normalizeText(query).toLowerCase();

  return games.filter((game) => {
    const matchesFilter =
      activeFilter === "ALL" ||
      (activeFilter === "FEATURED" && game.featured) ||
      (activeFilter === "CONTINUE" && game.playState === "CONTINUE") ||
      game.canonRelationship === activeFilter;

    const searchableText = [
      game.title,
      game.subtitle,
      game.description,
      game.scenario,
      game.narrator,
      game.badge,
      game.contentRating,
      game.canonRelationship,
      ...(Array.isArray(game.cast) ? game.cast : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesFilter &&
      (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}

export function getGamesHubViewProps({
  games = [],
  mobileToolsOpen = false,
  activeFilter = "ALL",
  query = "",
  viewMode = "grid",
  startingGameId = null,
  playError = "",
  status = "loading",
  loadError = "",
  onToggleMobileTools = null,
  onQueryChange = null,
  onActiveFilterChange = null,
  onViewModeChange = null,
  onGameAction = null,
} = {}) {
  const normalizedGames = Array.isArray(games) ? games : [];
  const filteredGames = filterGamesForHub({
    games: normalizedGames,
    activeFilter,
    query,
  });

  return {
    mobileToolsOpen: Boolean(mobileToolsOpen),
    activeFilter: normalizeText(activeFilter, "ALL"),
    query: String(query ?? ""),
    viewMode: viewMode === "list" ? "list" : "grid",
    startingGameId: startingGameId || null,
    playError: normalizeText(playError),
    loading: normalizeText(status, "loading").toLowerCase() === "loading",
    loadError: normalizeText(loadError),
    filters: gamesHubFilters,
    filteredGames,
    continueGames: normalizedGames.filter(
      (game) => game.playState === "CONTINUE"
    ),
    featuredGames: normalizedGames.filter((game) => game.featured),
    onToggleMobileTools,
    onQueryChange,
    onActiveFilterChange,
    onViewModeChange,
    onGameAction,
  };
}

export function useGamesHubViewModel({
  loadGames = fetchGames,
  startTemplate = playStoryTemplate,
} = {}) {
  const router = useRouter();
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = usePersistentViewMode({
    storageKey: "crestfall.games.viewMode",
    desktopDefault: "grid",
    mobileDefault: "list",
  });
  const [startingGameId, setStartingGameId] = useState(null);
  const [playError, setPlayError] = useState("");
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setLoadError("");

      try {
        const loadedGames = await loadGames();
        if (cancelled) return;

        const now = Date.now();
        setGames(
          (Array.isArray(loadedGames) ? loadedGames : []).map((game, index) =>
            normalizeGameForHub(game, index, now)
          )
        );
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setGames([]);
        setLoadError(error?.message || "Games could not be loaded.");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [loadGames]);

  async function handleGameAction(game) {
    if (!game) return;

    setPlayError("");

    if (game.playState === "CONTINUE") {
      const roomId = game.continueRoomId || getRoomIdFromGameHref(game.href);
      if (roomId) {
        router.push(buildStoryChatHref(roomId));
        return;
      }
    }

    if (!game.templateId) {
      setPlayError("This game is not wired to a playable Story Template yet.");
      return;
    }

    setStartingGameId(game.id);

    try {
      const data = await startTemplate({ templateId: game.templateId });
      const roomId = data?.room?.id;

      if (!roomId) {
        throw new Error("Story was created without a room id.");
      }

      router.push(buildStoryChatHref(roomId));
    } catch (error) {
      setPlayError(error?.message || "Story Template could not be played.");
      setStartingGameId(null);
    }
  }

  return getGamesHubViewProps({
    games,
    mobileToolsOpen,
    activeFilter,
    query,
    viewMode,
    startingGameId,
    playError,
    status,
    loadError,
    onToggleMobileTools: () => setMobileToolsOpen((current) => !current),
    onQueryChange: setQuery,
    onActiveFilterChange: setActiveFilter,
    onViewModeChange: setViewMode,
    onGameAction: handleGameAction,
  });
}
