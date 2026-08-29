export const TIMELINE_CREATION_TYPE = "TIMELINE";
export const TIMELINE_CONTRACT_VERSION = "timeline_contract_v1";
export const TIMELINE_MAX_ENTRIES = 512;
export const TIMELINE_SORT_DIRECTIONS = Object.freeze(["ASC", "DESC"]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeOptionalTimelineNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function isTimelineCreationType(value) {
  return normalizeString(value).toUpperCase() === TIMELINE_CREATION_TYPE;
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
  };
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
    groupByEra:
      source.groupByEra === false || source.group_by_era === false ? false : true,
    entries: normalizeArray(source.entries)
      .slice(0, TIMELINE_MAX_ENTRIES)
      .map(normalizeTimelineEntry)
      .filter(Boolean),
  };
}

export function validateTimelineDefinition(value) {
  const source = normalizeObject(value);
  const rawEntries = normalizeArray(source.entries);
  const errors = [];
  const seen = new Set();

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
    const rawOrder =
      rawEntryObject.orderOverride ?? rawEntryObject.order_override;
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
  });

  return {
    data: normalizeTimelineDefinition(value),
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
