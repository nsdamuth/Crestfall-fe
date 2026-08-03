import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getPublicLorePublicationPageData(creationId) {
  const normalizedCreationId =
    typeof creationId === "string" ? creationId.trim() : "";

  if (!normalizedCreationId) {
    return {
      creation: null,
      media: [],
      loadError: "Lore Asset id is required.",
    };
  }

  try {
    const payload = await feApiRequest({
      path: `/api/lore/${encodeURIComponent(
        normalizedCreationId
      )}/publication`,
    });
    const publication = payload?.data || null;

    if (!publication?.creation) {
      return { creation: null, media: [], loadError: null };
    }

    return {
      creation: {
        ...publication.creation,
        creator: publication.creator || publication.creation.creator || null,
        connectedAssets: publication.connectedAssets || [],
        credits: publication.credits || [],
      },
      media: publication.media || [],
      loadError: null,
    };
  } catch (error) {
    if (error?.status === 404) {
      return { creation: null, media: [], loadError: null };
    }

    return {
      creation: null,
      media: [],
      loadError:
        error?.payload?.error?.message ||
        error?.payload?.error ||
        error?.message ||
        "Published Lore revision could not be loaded.",
    };
  }
}
