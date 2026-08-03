import { notFound } from "next/navigation";
import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getPublicProfileConnectionsPageData(
  username
) {
  try {
    const payload = await feApiRequest({
      path: `/api/profiles/${encodeURIComponent(
        username
      )}/connections`,
    });

    return {
      profile:
        payload?.data?.profile || {
          username,
        },

      followCounts:
        payload?.data?.followCounts || {
          followers: 0,
          following: 0,
        },

      followers:
        payload?.data?.followers || [],

      following:
        payload?.data?.following || [],

      loadError: null,
    };
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    return {
      profile: {
        username,
      },
      followCounts: {
        followers: 0,
        following: 0,
      },
      followers: [],
      following: [],
      loadError:
        error?.message ||
        "Profile connections could not be loaded.",
    };
  }
}