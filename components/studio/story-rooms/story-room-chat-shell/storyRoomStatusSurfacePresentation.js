function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

export function getPersistentStatusSurfaceDomains(surfaces = []) {
  return [
    ...new Set(
      normalizeArray(surfaces)
        .flatMap((surface) => normalizeArray(surface?.readouts))
        .filter((readout) => readout?.status === "RESOLVED")
        .map((readout) => normalizeUpper(readout?.source?.domain))
        .filter(Boolean)
    ),
  ];
}

export function buildStoryRoomStatusShortLabel(label) {
  const normalized = normalizeString(label);
  if (!normalized) return "";

  const words = normalized
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 1) {
    return words
      .map((word) => word[0])
      .join("")
      .slice(0, 4)
      .toUpperCase();
  }

  if (normalized.length <= 4) return normalized.toUpperCase();
  return normalized.slice(0, 3).toUpperCase();
}

function resolvedReadouts(surface) {
  return normalizeArray(surface?.readouts).filter(
    (readout) => readout?.status === "RESOLVED" && readout?.displayValue !== ""
  );
}

function isActorMechanicsSurface(surface) {
  return (
    surface?.variant === "ACTOR_MECHANICS" ||
    (surface?.systemGenerated === true && surface?.subject?.actorCreationId)
  );
}

export function buildStoryRoomStatusSurfacePresentation(surface = {}) {
  const readouts = resolvedReadouts(surface);
  const actorMechanics = isActorMechanicsSurface(surface);

  if (!actorMechanics) {
    return {
      id: normalizeString(surface?.id) || "status-surface",
      title: normalizeString(surface?.title),
      placement: normalizeUpper(surface?.presentation?.placement) || "BOTTOM",
      variant: "CONFIGURED",
      sourceLabel: normalizeString(surface?.source?.label),
      actorTitle: "",
      progression: [],
      pools: [],
      primaryStats: [],
      details: [],
      readouts,
      hasDetails: false,
    };
  }

  const progression = [];
  const pools = [];
  const primaryStats = [];
  const details = [];

  readouts.forEach((readout) => {
    const domain = normalizeUpper(readout?.source?.domain);
    const kind = normalizeUpper(readout?.source?.kind);
    const decorated = {
      ...readout,
      shortLabel: buildStoryRoomStatusShortLabel(readout?.label),
    };

    if (readout?.derived === true) {
      details.push(decorated);
      return;
    }

    if (domain === "PROGRESSION") {
      progression.push(decorated);
      return;
    }

    if (domain === "STATS_POOLS" && kind === "POOL") {
      pools.push(decorated);
      return;
    }

    if (domain === "STATS_POOLS" && kind === "STAT") {
      primaryStats.push(decorated);
      return;
    }

    details.push(decorated);
  });

  return {
    id: normalizeString(surface?.id) || "system_actor_mechanics",
    title: normalizeString(surface?.title),
    placement: normalizeUpper(surface?.presentation?.placement) || "BOTTOM",
    variant: "ACTOR_MECHANICS",
    sourceLabel: normalizeString(surface?.source?.label),
    actorTitle:
      normalizeString(surface?.subject?.actorTitle) ||
      normalizeString(surface?.title) ||
      "Player Character",
    progression,
    pools,
    primaryStats,
    details,
    readouts,
    hasDetails: details.length > 0,
  };
}
