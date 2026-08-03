function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeTrackerString(value) {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

export function normalizeTrackerNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function clampTrackerNumber(
  value,
  fallback = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY
) {
  const number = normalizeTrackerNumber(value, fallback);
  return Math.min(max, Math.max(min, number));
}

export function slugifyTrackerId(value, fallback = "entry") {
  const slug = normalizeTrackerString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || fallback;
}

export function createUniqueTrackerId(prefix, items = []) {
  const used = new Set(
    asArray(items)
      .map((item) => normalizeTrackerString(asObject(item).id))
      .filter(Boolean)
  );

  let index = used.size + 1;
  let candidate = `${prefix}_${index}`;

  while (used.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }

  return candidate;
}

export function normalizeMechanicsTrackerPhase(phase, fallbackIndex = 0) {
  const source = asObject(phase);
  const fallbackId = `phase_${fallbackIndex + 1}`;

  return {
    ...source,
    id: normalizeTrackerString(source.id) || fallbackId,
    label:
      normalizeTrackerString(source.label) ||
      normalizeTrackerString(source.id) ||
      `Phase ${fallbackIndex + 1}`,
    min: normalizeTrackerNumber(source.min, 0),
    max: normalizeTrackerNumber(source.max, 100),
  };
}

export function normalizeMechanicsTrackerMutationHint(hint, fallbackIndex = 0) {
  const source = asObject(hint);
  const fallbackId = `hint_${fallbackIndex + 1}`;

  return {
    ...source,
    id: normalizeTrackerString(source.id) || fallbackId,
    eventTypes: asArray(source.eventTypes || source.event_types)
      .map((value) => normalizeTrackerString(value).toUpperCase())
      .filter(Boolean),
    triggers: asArray(source.triggers)
      .map((value) => normalizeTrackerString(value))
      .filter(Boolean),
    delta: normalizeTrackerNumber(source.delta ?? source.amount, 1),
    reason: normalizeTrackerString(source.reason),
  };
}

export function normalizeMechanicsTracker(tracker, fallbackIndex = 0) {
  const source = asObject(tracker);
  const fallbackId = `tracker_${fallbackIndex + 1}`;
  const min = normalizeTrackerNumber(source.min, 0);
  const max = normalizeTrackerNumber(source.max, 100);

  return {
    ...source,
    id: normalizeTrackerString(source.id) || fallbackId,
    kind: normalizeTrackerString(source.kind) || "meter",
    label:
      normalizeTrackerString(source.label) ||
      normalizeTrackerString(source.id) ||
      `Tracker ${fallbackIndex + 1}`,
    min,
    max,
    initial: clampTrackerNumber(source.initial, min, min, max),
    phases: asArray(source.phases).map(normalizeMechanicsTrackerPhase),
    mutationHints: asArray(source.mutationHints || source.mutation_hints).map(
      normalizeMechanicsTrackerMutationHint
    ),
  };
}

export function normalizeMechanicsTrackers(trackers) {
  return asArray(trackers).map((tracker, index) =>
    normalizeMechanicsTracker(tracker, index)
  );
}

export function summarizeMechanicsTracker(tracker, trackerIndex = 0) {
  const safeTracker = normalizeMechanicsTracker(tracker, trackerIndex);
  const pluralize = (count, singular, plural = `${singular}s`) =>
    `${count} ${count === 1 ? singular : plural}`;

  return [
    `${safeTracker.min}–${safeTracker.max}`,
    `starts ${safeTracker.initial}`,
    pluralize(safeTracker.phases.length, "phase"),
    pluralize(safeTracker.mutationHints.length, "hint"),
  ].join(" · ");
}
