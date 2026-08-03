function normalizeBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function deleteStoredImageObjectViaServicesApi({
  storageProvider,
  storagePath,
}) {
  const baseUrl = normalizeBaseUrl(process.env.CRESTFALL_API_INTERNAL_URL);
  const secret = normalizeString(process.env.CRESTFALL_API_INTERNAL_SECRET);

  if (!baseUrl) {
    return {
      deleted: false,
      error: "CRESTFALL_API_INTERNAL_URL is not configured.",
    };
  }

  if (!secret) {
    return {
      deleted: false,
      error: "CRESTFALL_API_INTERNAL_SECRET is not configured.",
    };
  }

  if (!storageProvider || !storagePath) {
    return {
      deleted: false,
      error: "Storage provider or storage path is missing.",
    };
  }

  const response = await fetch(`${baseUrl}/internal/image-storage/output`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-crestfall-internal-secret": secret,
    },
    body: JSON.stringify({
      storageProvider,
      storagePath,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      deleted: false,
      error:
        payload?.error?.message ||
        payload?.error ||
        payload?.message ||
        `Storage delete failed with status ${response.status}.`,
    };
  }

  return {
    deleted: true,
    error: null,
    result: payload?.data || null,
  };
}