"use client";

import { useCallback, useMemo, useState } from "react";

import {
  buildStoryRoomStatusSurfacePresentation,
} from "./storyRoomStatusSurfacePresentation";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePlacement(value) {
  const normalized = String(value || "BOTTOM").trim().toUpperCase();
  return normalized === "TOP" ? "TOP" : "BOTTOM";
}

export default function useStoryRoomStatusSurfaceHostViewModel({
  surfaces = [],
  placement = "BOTTOM",
} = {}) {
  const resolvedPlacement = normalizePlacement(placement);
  const [expandedSurfaceIds, setExpandedSurfaceIds] = useState(() => new Set());

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
    })),
    onToggleSurface,
  };
}
