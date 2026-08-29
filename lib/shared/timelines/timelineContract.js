export const TIMELINE_CREATION_TYPE = "TIMELINE";
export const TIMELINE_CONTRACT_VERSION = "timeline_contract_v2";
export const TIMELINE_MAX_ENTRIES = 512;
export const TIMELINE_MAX_CHAPTERS = 64;
export const TIMELINE_SORT_DIRECTIONS = Object.freeze(["ASC", "DESC"]);
export const TIMELINE_GROUPING_MODES = Object.freeze(["CHAPTERS", "ERA", "NONE"]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

export function normalizeOptionalTimelineNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function isTimelineCreationType(value) {
  return normalizeString(value).toUpperCase() === TIMELINE_CREATION_TYPE;
}

export function normalizeTimelineChapter(value, index = 0) {
  const source = normalizeObject(value);
  return {
    id: normalizeString(source.id || source.chapterId || source.chapter_id),
    title: normalizeString(source.title || source.label),
    order:
      normalizeOptionalTimelineNumber(
        source.order ?? source.chapterOrder ?? source.chapter_order
      ) ?? index,
  };
}

export function normalizeTimelineEntry(value) {
  const source = normalizeObject(value);
  const loreCreationId = normalizeString(
    source.loreCreationId ||
      source.lore_creation_id ||
      source.creationId ||
      source.creation_id
  );

  if (!loreCreationId) return null;

  return {
    loreCreationId,
    orderOverride: normalizeOptionalTimelineNumber(
      source.orderOverride ?? source.order_override
    ),
    chapterId: normalizeString(source.chapterId || source.chapter_id),
  };
}

function normalizeGroupingMode(source) {
  const explicit = normalizeUpper(source.groupingMode || source.grouping_mode);
  if (TIMELINE_GROUPING_MODES.includes(explicit)) return explicit;

  // timeline_contract_v1 compatibility.
  if (source.groupByEra === false || source.group_by_era === false) return "NONE";
  return "ERA";
}

export function normalizeTimelineDefinition(value) {
  const source = normalizeObject(value);
  const normalizedDirection = normalizeString(
    source.sortDirection || source.sort_direction
  ).toUpperCase();

  return {
    contractVersion: TIMELINE_CONTRACT_VERSION,
    publicEnabled: source.publicEnabled === true || source.public_enabled === true,
    sortDirection: TIMELINE_SORT_DIRECTIONS.includes(normalizedDirection)
      ? normalizedDirection
      : "ASC",
    groupingMode: normalizeGroupingMode(source),
    chapters: normalizeArray(source.chapters)
      .slice(0, TIMELINE_MAX_CHAPTERS)
      .map(normalizeTimelineChapter)
      .filter((chapter) => chapter.id && chapter.title),
    entries: normalizeArray(source.entries)
      .slice(0, TIMELINE_MAX_ENTRIES)
      .map(normalizeTimelineEntry)
      .filter(Boolean),
  };
}

export function validateTimelineDefinition(value) {
  const source = normalizeObject(value);
  const rawEntries = normalizeArray(source.entries);
  const rawChapters = normalizeArray(source.chapters);
  const errors = [];
  const seen = new Set();
  const seenChapters = new Set();
  const normalized = normalizeTimelineDefinition(value);

  const explicitGrouping = normalizeUpper(source.groupingMode || source.grouping_mode);
  if (explicitGrouping && !TIMELINE_GROUPING_MODES.includes(explicitGrouping)) {
    errors.push({
      code: "TIMELINE_GROUPING_MODE_INVALID",
      path: "groupingMode",
      message: "Timeline grouping mode must be CHAPTERS, ERA, or NONE.",
    });
  }

  if (rawChapters.length > TIMELINE_MAX_CHAPTERS) {
    errors.push({
      code: "TIMELINE_CHAPTER_LIMIT_EXCEEDED",
      path: "chapters",
      message: `Timelines cannot exceed ${TIMELINE_MAX_CHAPTERS} chapters.`,
    });
  }

  rawChapters.slice(0, TIMELINE_MAX_CHAPTERS).forEach((rawChapter, index) => {
    const chapter = normalizeTimelineChapter(rawChapter, index);
    const rawChapterObject = normalizeObject(rawChapter);
    const path = `chapters[${index}]`;

    if (!chapter.id) {
      errors.push({
        code: "TIMELINE_CHAPTER_ID_REQUIRED",
        path: `${path}.id`,
        message: "Each Timeline chapter needs an id.",
      });
    } else if (seenChapters.has(chapter.id)) {
      errors.push({
        code: "TIMELINE_CHAPTER_ID_DUPLICATE",
        path: `${path}.id`,
        message: "Timeline chapter ids must be unique.",
      });
    }
    seenChapters.add(chapter.id);

    if (!chapter.title) {
      errors.push({
        code: "TIMELINE_CHAPTER_TITLE_REQUIRED",
        path: `${path}.title`,
        message: "Timeline chapters require a title.",
      });
    }

    const rawOrder =
      rawChapterObject.order ??
      rawChapterObject.chapterOrder ??
      rawChapterObject.chapter_order;
    if (
      rawOrder !== null &&
      rawOrder !== undefined &&
      rawOrder !== "" &&
      !Number.isFinite(Number(rawOrder))
    ) {
      errors.push({
        code: "TIMELINE_CHAPTER_ORDER_INVALID",
        path: `${path}.order`,
        message: "Timeline chapter order must be a finite number.",
      });
    }
  });

  const chapterIds = new Set(normalized.chapters.map((chapter) => chapter.id));

  if (rawEntries.length > TIMELINE_MAX_ENTRIES) {
    errors.push({
      code: "TIMELINE_ENTRY_LIMIT_EXCEEDED",
      path: "entries",
      message: `Timelines cannot exceed ${TIMELINE_MAX_ENTRIES} Lore entries.`,
    });
  }

  rawEntries.slice(0, TIMELINE_MAX_ENTRIES).forEach((rawEntry, index) => {
    const entry = normalizeTimelineEntry(rawEntry);
    const path = `entries[${index}]`;

    if (!entry?.loreCreationId) {
      errors.push({
        code: "TIMELINE_LORE_REFERENCE_REQUIRED",
        path: `${path}.loreCreationId`,
        message: "Each Timeline entry must reference one Lore Asset.",
      });
      return;
    }

    if (seen.has(entry.loreCreationId)) {
      errors.push({
        code: "TIMELINE_LORE_REFERENCE_DUPLICATE",
        path: `${path}.loreCreationId`,
        message: "A Lore Asset can appear only once in a Timeline.",
      });
    }
    seen.add(entry.loreCreationId);

    const rawEntryObject = normalizeObject(rawEntry);
    const rawOrder = rawEntryObject.orderOverride ?? rawEntryObject.order_override;
    if (
      rawOrder !== null &&
      rawOrder !== undefined &&
      rawOrder !== "" &&
      !Number.isFinite(Number(rawOrder))
    ) {
      errors.push({
        code: "TIMELINE_ORDER_OVERRIDE_INVALID",
        path: `${path}.orderOverride`,
        message: "Timeline order overrides must be finite numbers or empty.",
      });
    }

    if (entry.chapterId && !chapterIds.has(entry.chapterId)) {
      errors.push({
        code: "TIMELINE_ENTRY_CHAPTER_NOT_FOUND",
        path: `${path}.chapterId`,
        message: "Timeline entries may reference only chapters defined by this Timeline.",
      });
    }
  });

  return {
    data: normalized,
    errors,
  };
}

export function getLoreDocumentFromCreation(creation) {
  const data = normalizeObject(creation?.data);
  return normalizeObject(data.lore_document || data.loreDocument);
}

export function getTimelineEntryChronologyValue(entry, loreCreation) {
  const normalizedEntry = normalizeTimelineEntry(entry);
  const override = normalizeOptionalTimelineNumber(normalizedEntry?.orderOverride);
  if (override !== null) return override;

  const document = getLoreDocumentFromCreation(loreCreation);
  return normalizeOptionalTimelineNumber(document.timelineOrder);
}

export function sortTimelineEntries({
  entries = [],
  loreById = new Map(),
  direction = "ASC",
} = {}) {
  const sortDirection =
    normalizeString(direction).toUpperCase() === "DESC" ? "DESC" : "ASC";

  return normalizeArray(entries)
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => {
      const leftEntry = normalizeTimelineEntry(left.entry);
      const rightEntry = normalizeTimelineEntry(right.entry);
      const leftLore = leftEntry ? loreById.get(leftEntry.loreCreationId) : null;
      const rightLore = rightEntry ? loreById.get(rightEntry.loreCreationId) : null;
      const leftValue = getTimelineEntryChronologyValue(leftEntry, leftLore);
      const rightValue = getTimelineEntryChronologyValue(rightEntry, rightLore);

      // Unplaced Lore always remains at the end regardless of sort direction.
      if (leftValue === null && rightValue === null) return left.index - right.index;
      if (leftValue === null) return 1;
      if (rightValue === null) return -1;
      if (leftValue === rightValue) return left.index - right.index;

      return sortDirection === "DESC"
        ? rightValue - leftValue
        : leftValue - rightValue;
    })
    .map(({ entry }) => normalizeTimelineEntry(entry))
    .filter(Boolean);
}
