const MIN_MEANINGFUL_SCORE = 30;

const IGNORED_DATA_KEYS = new Set([
  "activeSection",
  "draftUiState",
  "featuredMedia",
  "featured_media",
  "featuredImages",
  "featured_images",
  "imageLibrary",
  "image_library",
  "media",
  "mediaSlots",
  "media_slots",
  "preview",
  "ui",
]);

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function normalizeString(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function cleanDataForComparison(value) {
  if (Array.isArray(value)) {
    return value.map(cleanDataForComparison);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((next, key) => {
      if (IGNORED_DATA_KEYS.has(key)) return next;

      const cleanValue = cleanDataForComparison(value[key]);

      if (cleanValue === undefined) return next;

      next[key] = cleanValue;
      return next;
    }, {});
}

function stableStringify(value) {
  if (value == null) return "";

  try {
    return JSON.stringify(cleanDataForComparison(value));
  } catch {
    return String(value || "");
  }
}

function scoreStringChange(beforeValue, afterValue, baselineScore = 0) {
  const beforeText = normalizeString(beforeValue);
  const afterText = normalizeString(afterValue);

  if (beforeText === afterText) return 0;

  const lengthDelta = Math.abs(afterText.length - beforeText.length);

  return Math.max(lengthDelta, baselineScore);
}

function mergeCreationWithUpdates(beforeCreation, updates) {
  const beforeData = isPlainObject(beforeCreation?.data)
    ? beforeCreation.data
    : {};

  const updateData = isPlainObject(updates?.data) ? updates.data : undefined;

  return {
    ...beforeCreation,
    ...updates,
    data: updateData === undefined ? beforeData : updateData,
  };
}

export function evaluateMeaningfulCreationUpdate({
  beforeCreation,
  updates,
}) {
  const afterCreation = mergeCreationWithUpdates(beforeCreation, updates);

  let score = 0;

  score += scoreStringChange(beforeCreation?.title, afterCreation?.title, 20);
  score += scoreStringChange(
    beforeCreation?.description,
    afterCreation?.description,
    20
  );

  const beforeDataText = stableStringify(beforeCreation?.data || {});
  const afterDataText = stableStringify(afterCreation?.data || {});

  if (beforeDataText !== afterDataText) {
    const dataLengthDelta = Math.abs(afterDataText.length - beforeDataText.length);
    score += Math.max(dataLengthDelta, 30);
  }

  return {
    isMeaningful: score >= MIN_MEANINGFUL_SCORE,
    score,
    reason: score >= MIN_MEANINGFUL_SCORE ? "meaningful_content_changed" : "minor_change",
  };
}