export const IMAGE_OUTPUT_MEDIA_IDENTITY_KEY = "crestfallMediaIdentity";
export const IMAGE_OUTPUT_DISPLAY_NAME_MAX_LENGTH = 120;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function getProviderMetadata(source) {
  return normalizeObject(
    source?.providerMetadata ||
      source?.provider_metadata ||
      source?.output?.providerMetadata ||
      source?.output?.provider_metadata ||
      source?.rawOutput?.providerMetadata ||
      source?.rawOutput?.provider_metadata
  );
}

function getJobSettings(source) {
  return normalizeObject(
    source?.job?.settingsSnapshot ||
      source?.job?.settings_snapshot ||
      source?.settingsSnapshot ||
      source?.settings_snapshot
  );
}

export function getImageOutputMediaIdentity(source) {
  const providerMetadata = getProviderMetadata(source);
  const providerIdentity = normalizeObject(
    providerMetadata[IMAGE_OUTPUT_MEDIA_IDENTITY_KEY]
  );
  const jobIdentity = normalizeObject(getJobSettings(source).mediaIdentity);

  return {
    ...jobIdentity,
    ...providerIdentity,
  };
}

export function normalizeImageOutputDisplayName(value) {
  return normalizeString(value).slice(0, IMAGE_OUTPUT_DISPLAY_NAME_MAX_LENGTH);
}

export function getImageOutputCustomDisplayName(source) {
  return normalizeImageOutputDisplayName(
    getImageOutputMediaIdentity(source).displayName
  );
}

export function getImageOutputDefaultTitleBase(
  source,
  fallbackBase = "Generated Image"
) {
  return (
    normalizeString(getImageOutputMediaIdentity(source).defaultTitleBase) ||
    normalizeString(fallbackBase) ||
    "Generated Image"
  );
}

export function getImageOutputGeneratedAt(source) {
  return (
    source?.outputCreatedAt ||
    source?.output_created_at ||
    source?.createdAt ||
    source?.created_at ||
    source?.output?.createdAt ||
    source?.output?.created_at ||
    source?.job?.completedAt ||
    source?.job?.completed_at ||
    source?.job?.createdAt ||
    source?.job?.created_at ||
    null
  );
}

export function formatImageOutputGeneratedDate(value) {
  const raw = normalizeString(value);
  if (!raw) return "";

  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return "";

  return new Date(parsed).toISOString().slice(0, 10);
}

export function getImageOutputDisplayTitle(
  source,
  { fallbackBase = "Generated Image" } = {}
) {
  const customDisplayName = getImageOutputCustomDisplayName(source);
  if (customDisplayName) return customDisplayName;

  const base = getImageOutputDefaultTitleBase(source, fallbackBase);
  const date = formatImageOutputGeneratedDate(getImageOutputGeneratedAt(source));

  return date ? `${base} — ${date}` : base;
}

export function applyImageOutputDisplayNameResult(source, result = {}) {
  const providerMetadata = {
    ...getProviderMetadata(source),
    ...(result?.providerMetadata || {}),
  };
  const nextSource = {
    ...source,
    providerMetadata,
    provider_metadata: providerMetadata,
  };

  if (source?.output && typeof source.output === "object") {
    nextSource.output = {
      ...source.output,
      providerMetadata,
      provider_metadata: providerMetadata,
    };
  }

  return nextSource;
}
