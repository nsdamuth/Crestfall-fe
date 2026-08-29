"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildStoryRoomStatusSurfacePresentation,
} from "./storyRoomStatusSurfacePresentation";

const ACTOR_HUD_COLLAPSE_PREFERENCE_PREFIX =
  "crestfall.story-room.actor-hud.collapsed";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getActorHudCollapsePreferenceKey(room = {}) {
  const roomId = String(room?.id || "").trim();
  return roomId
    ? `${ACTOR_HUD_COLLAPSE_PREFERENCE_PREFIX}:${roomId}`
    : "";
}

function normalizePlacement(value) {
  const normalized = String(value || "BOTTOM").trim().toUpperCase();
  return normalized === "TOP" ? "TOP" : "BOTTOM";
}

export default function useStoryRoomStatusSurfaceHostViewModel({
  surfaces = [],
  placement = "BOTTOM",
  room = null,
} = {}) {
  const resolvedPlacement = normalizePlacement(placement);
  const [expandedSurfaceIds, setExpandedSurfaceIds] = useState(() => new Set());
  const [actorHudCollapsed, setActorHudCollapsed] = useState(false);
  const actorHudPreferenceKey = useMemo(
    () => getActorHudCollapsePreferenceKey(room),
    [room?.id]
  );

  useEffect(() => {
    if (!actorHudPreferenceKey) {
      setActorHudCollapsed(false);
      return;
    }

    try {
      setActorHudCollapsed(
        window.localStorage.getItem(actorHudPreferenceKey) === "1"
      );
    } catch {
      setActorHudCollapsed(false);
    }
  }, [actorHudPreferenceKey]);

  const projectedSurfaces = useMemo(
    () =>
      normalizeArray(surfaces)
        .filter(
          (surface) =>
            String(surface?.presentation?.host || "").toUpperCase() === "INLINE" &&
            normalizePlacement(surface?.presentation?.placement) === resolvedPlacement
        )
        .map(buildStoryRoomStatusSurfacePresentation),
    [resolvedPlacement, surfaces]
  );

  const onToggleActorHudVisibility = useCallback(() => {
    setActorHudCollapsed((current) => {
      const next = !current;

      if (actorHudPreferenceKey) {
        try {
          window.localStorage.setItem(actorHudPreferenceKey, next ? "1" : "0");
        } catch {
          // Presentation preference persistence is best-effort only.
        }
      }

      return next;
    });
  }, [actorHudPreferenceKey]);

  const onToggleSurface = useCallback((surfaceId) => {
    setExpandedSurfaceIds((current) => {
      const next = new Set(current);
      if (next.has(surfaceId)) next.delete(surfaceId);
      else next.add(surfaceId);
      return next;
    });
  }, []);

  return {
    placement: resolvedPlacement,
    surfaces: projectedSurfaces.map((surface) => ({
      ...surface,
      expanded: expandedSurfaceIds.has(surface.id),
      collapsed:
        surface.variant === "ACTOR_MECHANICS" && actorHudCollapsed,
    })),
    onToggleSurface,
    onToggleActorHudVisibility,
  };
}
