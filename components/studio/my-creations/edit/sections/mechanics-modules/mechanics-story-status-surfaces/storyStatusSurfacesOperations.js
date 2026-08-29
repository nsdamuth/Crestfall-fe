import {
  normalizeStoryStatusSurface,
  normalizeStoryStatusSurfaceIdentifier,
  normalizeStoryStatusSurfaceReadout,
  normalizeStoryStatusSurfaces,
} from "./storyStatusSurfacesNormalization.js";

function uniqueId(items, prefix) {
  const existing = new Set(items.map((item) => String(item?.id || "")));
  let index = items.length + 1;
  let candidate = `${prefix}_${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }
  return candidate;
}

export function addStoryStatusSurface(surfaces) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const id = uniqueId(normalized, "surface");
  return [
    ...normalized,
    normalizeStoryStatusSurface(
      {
        id,
        title: `Status Surface ${normalized.length + 1}`,
        enabled: true,
        presentation: { host: "INLINE", placement: "BOTTOM" },
        readouts: [],
      },
      normalized.length
    ),
  ];
}

export function patchStoryStatusSurface(surfaces, surfaceIndex, patch) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  return normalized.map((surface, index) =>
    index === surfaceIndex
      ? normalizeStoryStatusSurface(
          {
            ...surface,
            ...patch,
            ...(patch?.id !== undefined
              ? {
                  id: normalizeStoryStatusSurfaceIdentifier(
                    patch.id,
                    `surface_${surfaceIndex + 1}`
                  ),
                }
              : {}),
            presentation: {
              ...surface.presentation,
              ...(patch?.presentation || {}),
            },
          },
          index
        )
      : surface
  );
}

export function removeStoryStatusSurface(surfaces, surfaceIndex) {
  return normalizeStoryStatusSurfaces(surfaces).filter(
    (_surface, index) => index !== surfaceIndex
  );
}

export function moveStoryStatusSurface(surfaces, surfaceIndex, direction) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const targetIndex = surfaceIndex + (direction < 0 ? -1 : 1);
  if (
    surfaceIndex < 0 ||
    surfaceIndex >= normalized.length ||
    targetIndex < 0 ||
    targetIndex >= normalized.length
  ) {
    return normalized;
  }
  const next = [...normalized];
  [next[surfaceIndex], next[targetIndex]] = [next[targetIndex], next[surfaceIndex]];
  return next;
}

export function addStoryStatusSurfaceReadout(surfaces, surfaceIndex) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const surface = normalized[surfaceIndex];
  if (!surface) return normalized;
  const readoutId = uniqueId(surface.readouts, "readout");
  return patchStoryStatusSurface(normalized, surfaceIndex, {
    readouts: [
      ...surface.readouts,
      normalizeStoryStatusSurfaceReadout(
        {
          id: readoutId,
          label: `Readout ${surface.readouts.length + 1}`,
          enabled: true,
          prefix: "",
          suffix: "",
          missingLabel: "Unavailable",
          source: {
            domain: "MECHANICS",
            bindingId: "",
            valueId: "",
            kind: "POOL",
            bucket: "COUNTER",
          },
        },
        surface.readouts.length
      ),
    ],
  });
}

export function patchStoryStatusSurfaceReadout(
  surfaces,
  surfaceIndex,
  readoutIndex,
  patch
) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const surface = normalized[surfaceIndex];
  if (!surface?.readouts?.[readoutIndex]) return normalized;
  const readouts = surface.readouts.map((readout, index) =>
    index === readoutIndex
      ? normalizeStoryStatusSurfaceReadout(
          {
            ...readout,
            ...patch,
            ...(patch?.id !== undefined
              ? {
                  id: normalizeStoryStatusSurfaceIdentifier(
                    patch.id,
                    `readout_${readoutIndex + 1}`
                  ),
                }
              : {}),
            source: {
              ...readout.source,
              ...(patch?.source || {}),
            },
          },
          index
        )
      : readout
  );
  return patchStoryStatusSurface(normalized, surfaceIndex, { readouts });
}

export function removeStoryStatusSurfaceReadout(
  surfaces,
  surfaceIndex,
  readoutIndex
) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const surface = normalized[surfaceIndex];
  if (!surface) return normalized;
  return patchStoryStatusSurface(normalized, surfaceIndex, {
    readouts: surface.readouts.filter((_readout, index) => index !== readoutIndex),
  });
}

export function moveStoryStatusSurfaceReadout(
  surfaces,
  surfaceIndex,
  readoutIndex,
  direction
) {
  const normalized = normalizeStoryStatusSurfaces(surfaces);
  const surface = normalized[surfaceIndex];
  if (!surface) return normalized;
  const targetIndex = readoutIndex + (direction < 0 ? -1 : 1);
  if (
    readoutIndex < 0 ||
    readoutIndex >= surface.readouts.length ||
    targetIndex < 0 ||
    targetIndex >= surface.readouts.length
  ) {
    return normalized;
  }
  const readouts = [...surface.readouts];
  [readouts[readoutIndex], readouts[targetIndex]] = [
    readouts[targetIndex],
    readouts[readoutIndex],
  ];
  return patchStoryStatusSurface(normalized, surfaceIndex, { readouts });
}
