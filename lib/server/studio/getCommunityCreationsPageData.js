import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getCommunityCreationsPageData() {
  try {
    const payload = await feApiRequest({
      path: "/api/community/creations",
    });

    return {
      creations: payload?.data?.creations || [],
      loadError: null,
    };
  } catch (error) {
    return {
      creations: [],
      loadError:
        error?.payload?.error?.message ||
        error?.message ||
        "Community creations could not be loaded.",
    };
  }
}
