function normalizePublicBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function normalizeStoragePath(value) {
  return typeof value === "string" ? value.trim().replace(/^\/+/, "") : "";
}

export function getImageOutputDisplayUrl(output = {}) {
  if (output.display_url) return output.display_url;
  if (output.thumbnail_url) return output.thumbnail_url;
  if (output.displayUrl) return output.displayUrl;
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