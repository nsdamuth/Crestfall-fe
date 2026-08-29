"use client";

import { useMemo } from "react";

import {
  normalizeStoryStatusSurfaces,
  summarizeStoryStatusSurface,
} from "./storyStatusSurfacesNormalization.js";
import {
  addStoryStatusSurface,
  addStoryStatusSurfaceReadout,
  moveStoryStatusSurface,
  moveStoryStatusSurfaceReadout,
  patchStoryStatusSurface,
  patchStoryStatusSurfaceReadout,
  removeStoryStatusSurface,
  removeStoryStatusSurfaceReadout,
} from "./storyStatusSurfacesOperations.js";

export default function useStoryStatusSurfacesViewModel({
  statusSurfaces,
  onChange,
  foldSignal,
  mechanicsSourceOptions = [],
}) {
  const normalized = useMemo(
    () => normalizeStoryStatusSurfaces(statusSurfaces),
    [statusSurfaces]
  );

  function commit(nextSurfaces) {
    onChange?.(normalizeStoryStatusSurfaces(nextSurfaces));
  }

  return {
    statusSurfaces: normalized.map((surface, index) => ({
      ...surface,
      summary: summarizeStoryStatusSurface(surface, index),
    })),
    foldSignal,
    mechanicsSourceOptions,
    addSurface() {
      commit(addStoryStatusSurface(normalized));
    },
    patchSurface(surfaceIndex, patch) {
      commit(patchStoryStatusSurface(normalized, surfaceIndex, patch));
    },
    removeSurface(surfaceIndex) {
      commit(removeStoryStatusSurface(normalized, surfaceIndex));
    },
    moveSurface(surfaceIndex, direction) {
      commit(moveStoryStatusSurface(normalized, surfaceIndex, direction));
    },
    addReadout(surfaceIndex) {
      commit(addStoryStatusSurfaceReadout(normalized, surfaceIndex));
    },
    patchReadout(surfaceIndex, readoutIndex, patch) {
      commit(
        patchStoryStatusSurfaceReadout(
          normalized,
          surfaceIndex,
          readoutIndex,
          patch
        )
      );
    },
    removeReadout(surfaceIndex, readoutIndex) {
      commit(
        removeStoryStatusSurfaceReadout(normalized, surfaceIndex, readoutIndex)
      );
    },
    moveReadout(surfaceIndex, readoutIndex, direction) {
      commit(
        moveStoryStatusSurfaceReadout(
          normalized,
          surfaceIndex,
          readoutIndex,
          direction
        )
      );
    },
  };
}
