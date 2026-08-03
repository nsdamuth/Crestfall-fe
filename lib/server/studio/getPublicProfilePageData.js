import { notFound } from "next/navigation";
import { feApiRequest } from "@/lib/server/api/feApiRequest";

export async function getPublicProfilePageData(
  username
) {
  try {
    const payload = await feApiRequest({
      path: `/api/profiles/${encodeURIComponent(
        username
      )}/public`,
    });

    return {
      profile: payload?.data?.profile || {},
      creations:
        payload?.data?.creations || [],
      badges:
        payload?.data?.badges || [],
      stats: payload?.data?.stats || [],
      followCounts:
        payload?.data?.followCounts || {
          followers: 0,
          following: 0,
        },
      followState:
        payload?.data?.followState || {
          isFollowing: false,
          canFollow: false,
          isOwnProfile: false,
        },
      loadError:
        payload?.data?.loadError || null,
    };
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    return {
      profile: {
        username,
      },
      creations: [],
      badges: [],
      stats: [],
      followCounts: {
        followers: 0,
        following: 0,
      },
      followState: {
        isFollowing: false,
        canFollow: false,
        isOwnProfile: false,
      },
      loadError:
        error.message ||
        "Public profile could not be loaded.",
    };
  }
}