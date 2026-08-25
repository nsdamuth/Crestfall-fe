import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getPublicCreationProfilePageData(
  creationId
) {
  const normalizedCreationId =
    typeof creationId === "string"
      ? creationId.trim()
      : "";

  if (!normalizedCreationId) {
    return {
      creation: null,
      media: [],
      loadError:
        "Creation id is required.",
    };
  }

  try {
    const payload = await feApiRequest({
      path: `/api/creations/${encodeURIComponent(
        normalizedCreationId
      )}/preview`,
    });

    const preview =
      payload?.data || null;

    if (!preview?.creation) {
      return {
        creation: null,
        media: [],
        loadError: null,
      };
    }

    return {
      creation: {
        ...preview.creation,

        creator:
          preview.creator || null,

        connectedAssets:
          preview.connectedAssets ||
          [],

        credits:
          preview.credits || [],

        gamePresentation:
          preview.gamePresentation || null,
      },

      media:
        preview.media || [],

      loadError: null,
    };
  } catch (error) {
    if (error?.status === 404) {
      return {
        creation: null,
        media: [],
        loadError: null,
      };
    }

    return {
      creation: null,
      media: [],
      loadError:
        error?.payload?.error?.message ||
        error?.payload?.error ||
        error?.message ||
        "Creation catalogue could not be loaded.",
    };
  }
}