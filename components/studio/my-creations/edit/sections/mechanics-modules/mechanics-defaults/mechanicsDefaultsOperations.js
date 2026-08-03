import {
  getMechanicsDefaultBucketConfig,
  normalizeMechanicsDefaultEntry,
  normalizeMechanicsDefaults,
  slugifyMechanicsDefaultId,
} from "./mechanicsDefaultsNormalization.js";

function uniqueDefaultId(prefix, entries = []) {
  const existing = new Set(entries.map((entry) => String(entry?.id || "")));
  let index = entries.length + 1;
  let candidate = `${prefix}_${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }
  return candidate;
}

export function replaceMechanicsDefaultsBucket(defaults, bucketKey, entries) {
  const normalized = normalizeMechanicsDefaults(defaults);
  return normalizeMechanicsDefaults({
    ...normalized,
    [bucketKey]: Array.isArray(entries) ? entries : [],
  });
}

export function addMechanicsDefaultEntry(defaults, bucketKey) {
  const normalized = normalizeMechanicsDefaults(defaults);
  const config = getMechanicsDefaultBucketConfig(bucketKey);
  const entries = normalized[bucketKey] || [];
  const nextEntry = normalizeMechanicsDefaultEntry(
    {
      id: uniqueDefaultId(bucketKey.slice(0, -1), entries),
      label: config.placeholderLabel,
      initial: config.defaultInitial,
    },
    bucketKey,
    entries.length
  );
  return replaceMechanicsDefaultsBucket(normalized, bucketKey, [
    ...entries,
    nextEntry,
  ]);
}

export function patchMechanicsDefaultEntry(
  defaults,
  bucketKey,
  entryIndex,
  patch
) {
  const normalized = normalizeMechanicsDefaults(defaults);
  const entries = normalized[bucketKey] || [];
  return replaceMechanicsDefaultsBucket(
    normalized,
    bucketKey,
    entries.map((entry, index) =>
      index === entryIndex
        ? normalizeMechanicsDefaultEntry(
            {
              ...entry,
              ...patch,
              ...(patch?.id !== undefined
                ? {
                    id: slugifyMechanicsDefaultId(
                      patch.id,
                      `${bucketKey.slice(0, -1)}_${entryIndex + 1}`
                    ),
                  }
                : {}),
            },
            bucketKey,
            index
          )
        : entry
    )
  );
}

export function removeMechanicsDefaultEntry(defaults, bucketKey, entryIndex) {
  const normalized = normalizeMechanicsDefaults(defaults);
  return replaceMechanicsDefaultsBucket(
    normalized,
    bucketKey,
    (normalized[bucketKey] || []).filter((_entry, index) => index !== entryIndex)
  );
}
