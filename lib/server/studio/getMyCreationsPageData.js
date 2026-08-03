import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getMyCreationsPageData() {
  try {
    const payload = await feApiRequest({
      path: "/api/creations?view=summary",
    });

    return {
      creations:
        payload?.data?.creations || [],
      loadError: null,
    };
  } catch (error) {
    return {
      creations: [],

      loadError:
        error?.payload?.error?.message ||
        error?.message ||
        "Creations could not be loaded.",
    };
  }
}