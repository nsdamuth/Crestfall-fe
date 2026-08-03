import { fetchOwnedCreations } from "@/lib/client/studio/creations/creationClient";

export async function fetchImageStudioIngredientCreations(allowedTypes = []) {
  const uniqueTypes = [...new Set(allowedTypes.filter(Boolean))];

  if (!uniqueTypes.length) return [];

  const creationGroups = await Promise.all(
    uniqueTypes.map((type) => fetchOwnedCreations({ type }))
  );

  return creationGroups.flat();
}

export async function createImageGenerationJob(payload) {
  const response = await fetch("/api/studio/image-generation/jobs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null);

  if (!response.ok || !responsePayload?.ok) {
    const errorMessage =
      responsePayload?.error?.message ||
      responsePayload?.error ||
      "Image generation job could not be created.";

    throw new Error(errorMessage);
  }

  return responsePayload.data;
}

export async function fetchImageGenerationHistory({
    limit = 12,
    cursor = null,
  } = {}) {
    const params = new URLSearchParams();

    if (limit) {
      params.set("limit", String(limit));
    }

    if (cursor) {
      params.set("cursor", cursor);
    }

    const query = params.toString();
    const response = await fetch(
      `/api/studio/image-generation/jobs${query ? `?${query}` : ""}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const responsePayload = await response.json().catch(() => null);

    if (!response.ok || !responsePayload?.ok) {
      const errorMessage =
        responsePayload?.error?.message ||
        responsePayload?.error ||
        "Image generation history could not be loaded.";

      throw new Error(errorMessage);
    }

    return responsePayload.data;
}
export async function fetchImageStudioAccountStatus() {
  const response = await fetch("/api/profile/me", {
    method: "GET",
    cache: "no-store",
  });

  const responsePayload = await response.json().catch(() => null);

  if (!response.ok || responsePayload?.error) {
    const errorMessage =
      responsePayload?.error?.message ||
      responsePayload?.error ||
      "Image Studio account status could not be loaded.";

    throw new Error(errorMessage);
  }

  const profile = responsePayload?.data?.profile || {};
  const rawBalance = profile.coin_balance ?? profile.coinBalance ?? 0;
  const coinBalance = Number.parseInt(rawBalance, 10);

  return {
    coinBalance: Number.isFinite(coinBalance) ? coinBalance : 0,
  };
}