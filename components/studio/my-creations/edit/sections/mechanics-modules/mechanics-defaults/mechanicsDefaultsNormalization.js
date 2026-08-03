import { MECHANICS_DEFAULT_BUCKETS } from "./MechanicsDefaults.contract.js";

export function asMechanicsDefaultsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizeMechanicsDefaultsString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMechanicsDefaultsNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeMechanicsDefaultsBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeMechanicsDefaultsString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

export function slugifyMechanicsDefaultId(value, fallback = "default") {
  const slug = normalizeMechanicsDefaultsString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

export function getMechanicsDefaultBucketConfig(bucketKey) {
  return (
    MECHANICS_DEFAULT_BUCKETS.find((bucket) => bucket.key === bucketKey) ||
    MECHANICS_DEFAULT_BUCKETS[0]
  );
}

function getBucketSource(source, bucketKey) {
  if (Array.isArray(source[bucketKey])) return source[bucketKey];
  const aliases = {
    flags: ["defaultFlags", "default_flags"],
    counters: ["defaultCounters", "default_counters"],
    stages: ["defaultStages", "default_stages"],
  }[bucketKey] || [];

  for (const alias of aliases) {
    if (Array.isArray(source[alias])) return source[alias];
  }

  return [];
}

export function normalizeMechanicsDefaultEntry(
  entry,
  bucketKey,
  fallbackIndex = 0
) {
  const source = asMechanicsDefaultsObject(entry);
  const bucketConfig = getMechanicsDefaultBucketConfig(bucketKey);
  const fallbackId = `${bucketKey.slice(0, -1) || "default"}_${fallbackIndex + 1}`;
  const id =
    normalizeMechanicsDefaultsString(source.id || source.key) || fallbackId;
  let initial = source.initial ?? source.value ?? bucketConfig.defaultInitial;

  if (bucketKey === "flags") {
    initial = normalizeMechanicsDefaultsBoolean(
      initial,
      Boolean(bucketConfig.defaultInitial)
    );
  } else if (bucketKey === "counters") {
    initial = normalizeMechanicsDefaultsNumber(
      initial,
      Number(bucketConfig.defaultInitial) || 0
    );
  } else {
    initial =
      normalizeMechanicsDefaultsString(initial) ||
      String(bucketConfig.defaultInitial || "auto");
  }

  return {
    ...source,
    id,
    label:
      normalizeMechanicsDefaultsString(source.label || source.title) ||
      normalizeMechanicsDefaultsString(source.id || source.key) ||
      `${bucketConfig.singularLabel} ${fallbackIndex + 1}`,
    initial,
  };
}

export function normalizeMechanicsDefaults(defaults = {}) {
  const source = asMechanicsDefaultsObject(defaults);

  return {
    ...source,
    flags: getBucketSource(source, "flags").map((entry, index) =>
      normalizeMechanicsDefaultEntry(entry, "flags", index)
    ),
    counters: getBucketSource(source, "counters").map((entry, index) =>
      normalizeMechanicsDefaultEntry(entry, "counters", index)
    ),
    stages: getBucketSource(source, "stages").map((entry, index) =>
      normalizeMechanicsDefaultEntry(entry, "stages", index)
    ),
  };
}

export function countMechanicsDefaultEntries(defaults = {}) {
  const normalized = normalizeMechanicsDefaults(defaults);
  return MECHANICS_DEFAULT_BUCKETS.reduce(
    (count, bucket) => count + normalized[bucket.key].length,
    0
  );
}
