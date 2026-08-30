function normalizePublicBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function normalizeStoragePath(value) {
  return typeof value === "string" ? value.trim().replace(/^\/+/, "") : "";
}

function getOutputId(output = {}) {
  return String(output.id || output.image_output_id || output.imageOutputId || "").trim();
}

function getStoredVariantMetadata(output = {}, variant) {
  const providerMetadata = output.provider_metadata || output.providerMetadata || {};
  const storage = providerMetadata?.storage || {};
  return storage?.[variant] || null;
}

export function getImageOutputProxyUrl(output = {}, variant = null) {
  const id = getOutputId(output);
  if (!id) return null;

  const base = `/api/media/images/${encodeURIComponent(id)}/file`;
  return variant ? `${base}?variant=${encodeURIComponent(variant)}` : base;
}

export function getImageOutputDisplayUrl(output = {}) {
  if (output.display_url) return output.display_url;
  if (output.displayUrl) return output.displayUrl;

  const proxyUrl = getImageOutputProxyUrl(output, "display");
  if (proxyUrl) return proxyUrl;

  if (output.thumbnail_url) return output.thumbnail_url;
  if (output.thumbnailUrl) return output.thumbnailUrl;

  const storageProvider = String(
    output.storage_provider || output.storageProvider || ""
  )
    .trim()
    .toLowerCase();

  const storagePath = normalizeStoragePath(
    output.storage_path || output.storagePath
  );

  if (storageProvider !== "r2" || !storagePath) {
    return null;
  }

  const publicBaseUrl = normalizePublicBaseUrl(
    process.env.R2_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL
  );

  if (!publicBaseUrl) {
    return null;
  }

  return `${publicBaseUrl}/${storagePath}`;
}

export function getImageOutputCardUrl(output = {}) {
  return (
    output.card_url ||
    output.cardUrl ||
    getImageOutputProxyUrl(output, "card") ||
    getImageOutputDisplayUrl(output)
  );
}

export function getImageOutputThumbnailUrl(output = {}) {
  return (
    output.thumbnail_url ||
    output.thumbnailUrl ||
    getImageOutputProxyUrl(output, "thumbnail") ||
    getImageOutputCardUrl(output)
  );
}

export function getImageOutputLockedPreviewUrl(output = {}) {
  if (output.locked_preview_url || output.lockedPreviewUrl) {
    return output.locked_preview_url || output.lockedPreviewUrl;
  }

  if (!getStoredVariantMetadata(output, "lockedPreview")) {
    return null;
  }

  return getImageOutputProxyUrl(output, "lockedPreview");
}

export function getImageOutputOriginalUrl(output = {}) {
  return (
    output.original_url ||
    output.originalUrl ||
    getImageOutputProxyUrl(output, null) ||
    null
  );
}
