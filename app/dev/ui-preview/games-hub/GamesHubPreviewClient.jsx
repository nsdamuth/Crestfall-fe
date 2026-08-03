"use client";

import { useMemo, useState } from "react";

import GamesHubView from "@/components/studio/games/games-hub/GamesHub.view";
import {
  gamesHubEmptyFixture,
  gamesHubErrorFixture,
  gamesHubLoadingFixture,
  gamesHubRawGamesFixture,
} from "@/components/studio/games/games-hub/GamesHub.fixtures";
import {
  getGamesHubViewProps,
  normalizeGameForHub,
} from "@/components/studio/games/games-hub/useGamesHubViewModel";

function PreviewViewModeToggle({ value, onChange, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-1">
      <span className="px-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </span>
      {["grid", "list"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange?.(mode)}
          className={`rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.14em] ${
            value === mode
              ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
              : "text-[var(--muted)]"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

export default function GamesHubPreviewClient() {
  const [fixtureKey, setFixtureKey] = useState("loaded");
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [startingGameId, setStartingGameId] = useState(null);
  const [playError, setPlayError] = useState("");
  const [lastAction, setLastAction] = useState("No game action yet.");

  const fixture =
    fixtureKey === "empty"
      ? gamesHubEmptyFixture
      : fixtureKey === "loading"
        ? gamesHubLoadingFixture
        : fixtureKey === "error"
          ? gamesHubErrorFixture
          : {
              games: gamesHubRawGamesFixture.map((game, index) =>
                normalizeGameForHub(game, index, Date.parse("2026-08-01T21:00:00Z"))
              ),
              status: "loaded",
            };

  const viewProps = useMemo(
    () =>
      getGamesHubViewProps({
        ...fixture,
        mobileToolsOpen,
        activeFilter,
        query,
        viewMode,
        startingGameId,
        playError,
        onToggleMobileTools: () => setMobileToolsOpen((current) => !current),
        onQueryChange: setQuery,
        onActiveFilterChange: setActiveFilter,
        onViewModeChange: setViewMode,
        onGameAction: (game) => {
          setPlayError("");
          setStartingGameId(game.id);
          setLastAction(
            game.playState === "CONTINUE"
              ? `Continue ${game.title}`
              : `Start ${game.title}`
          );
          window.setTimeout(() => setStartingGameId(null), 500);
        },
      }),
    [
      fixture,
      mobileToolsOpen,
      activeFilter,
      query,
      viewMode,
      startingGameId,
      playError,
    ]
  );

  function chooseFixture(key) {
    setFixtureKey(key);
    setMobileToolsOpen(false);
    setActiveFilter("ALL");
    setQuery("");
    setViewMode("grid");
    setStartingGameId(null);
    setPlayError("");
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            ["loaded", "Loaded"],
            ["empty", "Empty"],
            ["loading", "Loading"],
            ["error", "Error"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseFixture(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                fixtureKey === key
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlayError("Story Template could not be played.")}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            Play Error
          </button>
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
          {lastAction}
        </p>

        <GamesHubView
          {...viewProps}
          ViewModeToggleComponent={PreviewViewModeToggle}
        />
      </div>
    </main>
  );
}
