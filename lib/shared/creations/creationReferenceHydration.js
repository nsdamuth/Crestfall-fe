import {
  getDefaultCreationImageForType,
  getFirstCreationImageUrl,
} from "./creationMedia.js";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function getCreationReferenceId(reference = {}) {
  const source = normalizeObject(reference);

  return normalizeString(
    source.creationId ||
      source.creation_id ||
      source.targetCreationId ||
      source.target_creation_id ||
      source.profileCreationId ||
      source.profile_creation_id ||
      source.id
  );
}

export function indexCreationSummaries(creations = []) {
  const index = new Map();

  (Array.isArray(creations) ? creations : []).forEach((creation) => {
    const id = normalizeString(creation?.id || creation?.creationId);
    if (id) index.set(id, creation);
  });

  return index;
}

function getCreationTitle(creation = {}) {
  const data = normalizeObject(creation?.data);
  return normalizeString(creation?.title || data.name || data.title);
}

function getCreationDescription(creation = {}) {
  const data = normalizeObject(creation?.data);
  return normalizeString(
    creation?.description || data.description || data.summary
  );
}

function getCreationImageUrl(creation = {}) {
  const type = normalizeString(creation?.type).toUpperCase();

  return (
    getFirstCreationImageUrl(
      creation,
      getDefaultCreationImageForType(type)
    ) || ""
  );
}

/**
 * Resolve display identity for a saved Creation reference without changing the
 * relationship authority. Existing attachment ids, notes, and metadata remain
 * intact; only current Creation identity/presentation fields are refreshed.
 */
export function hydrateCreationReference(
  reference,
  summariesById,
  { fallbackType = "" } = {}
) {
  if (!reference || typeof reference !== "object") return reference;

  const creationId = getCreationReferenceId(reference);
  if (!creationId) return reference;

  const summary =
    summariesById instanceof Map ? summariesById.get(creationId) : null;
  if (!summary) return reference;

  const summaryTitle = getCreationTitle(summary);
  const summaryType = normalizeString(summary?.type).toUpperCase();
  const summaryDescription = getCreationDescription(summary);
  const summaryImageUrl = getCreationImageUrl(summary);

  return {
    ...reference,
    creationId: normalizeString(reference.creationId) || creationId,
    title: summaryTitle || normalizeString(reference.title) || creationId,
    type:
      summaryType ||
      normalizeString(reference.type).toUpperCase() ||
      normalizeString(fallbackType).toUpperCase(),
    description:
      summaryDescription ||
      normalizeString(reference.description || reference.subtitle),
    imageUrl:
      summaryImageUrl ||
      normalizeString(reference.imageUrl || reference.image_url),
  };
}
