function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeOptionId(option = {}) {
  return normalizeString(option?.id || option?.value);
}

export function resolveLocationConnectionEndpointSelection({
  registryCreationId = "",
  locationEntryId = "",
  localEntries = [],
  referencedLocationOptions = [],
} = {}) {
  const normalizedRegistryCreationId = normalizeString(registryCreationId);
  const normalizedLocationEntryId = normalizeString(locationEntryId);

  const candidates = normalizedRegistryCreationId
    ? normalizeArray(referencedLocationOptions)
    : normalizeArray(localEntries);

  const selected = candidates.find(
    (option) => normalizeOptionId(option) === normalizedLocationEntryId
  );

  return {
    registryCreationId: normalizedRegistryCreationId,
    locationEntryId: normalizeOptionId(selected),
    locationCreationId: normalizeString(
      selected?.creationId || selected?.creation_id
    ),
  };
}
