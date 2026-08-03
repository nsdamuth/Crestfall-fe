const STORYLINE_SAVE_RESPONSE_VERSION =
  "storyline_save_response_v1";

const ENVELOPE_KEYS = Object.freeze([
  "creation",
  "createdCreation",
  "updatedCreation",
  "savedCreation",
  "data",
  "result",
  "payload",
  "response",
  "json",
  "jsonb",
  "createCreationJsonAsActor",
  "createCreation",
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : null;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parsePossibleJson(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function normalizeCreationRecord(value) {
  let candidate = parsePossibleJson(value);

  if (Array.isArray(candidate)) {
    candidate = candidate[0] || null;
  }

  const record = normalizeObject(candidate);

  if (!record) {
    return null;
  }

  const id =
    normalizeString(record.id) ||
    normalizeString(record.row_id) ||
    normalizeString(record.rowId) ||
    normalizeString(record.creation_id) ||
    normalizeString(record.creationId);

  if (!id) {
    return null;
  }

  return {
    ...record,
    id,
  };
}

export function extractStorylineCreationFromResponse(payload) {
  const queue = [
    {
      value: payload,
      depth: 0,
    },
  ];
  const visited = new Set();

  while (queue.length) {
    const current = queue.shift();
    const value = parsePossibleJson(current.value);

    if (
      value &&
      typeof value === "object"
    ) {
      if (visited.has(value)) {
        continue;
      }

      visited.add(value);
    }

    const creation = normalizeCreationRecord(value);

    if (creation) {
      return creation;
    }

    if (current.depth >= 8) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length) {
        queue.push({
          value: value[0],
          depth: current.depth + 1,
        });
      }

      continue;
    }

    const objectValue = normalizeObject(value);

    if (!objectValue) {
      continue;
    }

    for (const key of ENVELOPE_KEYS) {
      if (
        Object.prototype.hasOwnProperty.call(objectValue, key) &&
        objectValue[key] !== undefined &&
        objectValue[key] !== null
      ) {
        queue.push({
          value: objectValue[key],
          depth: current.depth + 1,
        });
      }
    }
  }

  return null;
}

export function getStorylineSaveResponseVersion() {
  return STORYLINE_SAVE_RESPONSE_VERSION;
}

export {
  STORYLINE_SAVE_RESPONSE_VERSION,
};
