import {
  isTimelineCreationType,
  normalizeOptionalTimelineNumber,
  normalizeTimelineDefinition,
  sortTimelineEntries,
} from "./timelineContract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getLoreDocument(creation) {
  const data = normalizeObject(creation?.data);
  return normalizeObject(data.lore_document || data.loreDocument);
}

export function projectOwnedLoreForTimeline(creation) {
  if (!creation?.id || normalizeString(creation.type).toUpperCase() !== "LORE") {
    return null;
  }

  const document = getLoreDocument(creation);

  return {
    loreCreationId: String(creation.id),
    id: String(creation.id),
    type: "LORE",
    title: normalizeString(creation.title) || "Untitled Lore",
    description: normalizeString(creation.description),
    subtitle: normalizeString(document.subtitle),
    era: normalizeString(document.era),
    displayDate: normalizeString(document.displayDate || document.display_date),
    timelineOrder: normalizeOptionalTimelineNumber(
      document.timelineOrder ?? document.timeline_order
    ),
    visibility: normalizeString(creation.visibility).toUpperCase(),
    status: normalizeString(creation.status).toUpperCase(),
    availability: "AVAILABLE",
    imageSrc:
      creation.imageUrl ||
      creation.imageSrc ||
      creation.featuredMedia?.[0]?.imageUrl ||
      creation.featuredMedia?.[0]?.url ||
      null,
  };
}

export function buildOwnedTimelineProjection({
  timelineCreation,
  ownedLore = [],
} = {}) {
  if (!timelineCreation?.id || !isTimelineCreationType(timelineCreation.type)) {
    return null;
  }

  const data = normalizeObject(timelineCreation.data);
  const timeline = normalizeTimelineDefinition(data.timeline);
  const loreById = new Map();

  for (const creation of Array.isArray(ownedLore) ? ownedLore : []) {
    const lore = projectOwnedLoreForTimeline(creation);
    if (lore) loreById.set(lore.loreCreationId, lore);
  }

  const sortedEntries = sortTimelineEntries({
    entries: timeline.entries,
    loreById,
    direction: timeline.sortDirection,
  });

  return {
    timeline: {
      id: String(timelineCreation.id),
      type: "TIMELINE",
      title: normalizeString(timelineCreation.title) || "Untitled Timeline",
      description: normalizeString(timelineCreation.description),
      visibility: normalizeString(timelineCreation.visibility).toUpperCase(),
      status: normalizeString(timelineCreation.status).toUpperCase(),
      publicEnabled: timeline.publicEnabled === true,
      sortDirection: timeline.sortDirection,
      groupingMode: timeline.groupingMode,
      chapters: Array.isArray(timeline.chapters)
        ? timeline.chapters.map((chapter) => ({ ...chapter }))
        : [],
      groupByEra: timeline.groupingMode === "ERA",
    },
    entries: sortedEntries.map((entry) => {
      const lore = loreById.get(entry.loreCreationId) || null;
      const orderOverride = normalizeOptionalTimelineNumber(entry.orderOverride);
      const chapterId = normalizeString(entry.chapterId || entry.chapter_id);
      const timelineOrder = normalizeOptionalTimelineNumber(lore?.timelineOrder);
      const effectiveOrder = orderOverride ?? timelineOrder;

      if (!lore) {
        return {
          loreCreationId: entry.loreCreationId,
          title: "Unavailable Lore",
          description: "",
          subtitle: "",
          era: "",
          displayDate: "",
          timelineOrder: null,
          orderOverride,
          chapterId,
          effectiveOrder,
          visibility: "",
          status: "",
          availability: "MISSING",
          imageSrc: null,
        };
      }

      return {
        ...lore,
        orderOverride,
        chapterId,
        effectiveOrder,
      };
    }),
  };
}
