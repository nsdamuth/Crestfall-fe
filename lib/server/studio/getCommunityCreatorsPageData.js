import { feApiRequest } from "@/lib/server/api/feApiRequest";
import { getCommunityPageData } from "@/lib/server/studio/getCommunityPageData";

function normalizeUsername(value) {
  return typeof value === "string"
    ? value.trim().replace(/^@/, "").toLowerCase()
    : "";
}

async function getViewerFollowContext() {
  try {
    const profilePayload = await feApiRequest({
      path: "/api/profile/me",
    });

    const viewerUsername = normalizeUsername(
      profilePayload?.data?.profile?.username
    );

    if (!viewerUsername) {
      return {
        viewerUsername: null,
        followingUsernames: [],
      };
    }

    const connectionsPayload = await feApiRequest({
      path: `/api/profiles/${encodeURIComponent(viewerUsername)}/connections`,
    });

    const following = Array.isArray(connectionsPayload?.data?.following)
      ? connectionsPayload.data.following
      : [];

    return {
      viewerUsername,
      followingUsernames: following
        .map((entry) => normalizeUsername(entry?.username || entry?.handle))
        .filter(Boolean),
    };
  } catch (error) {
    // Public creator discovery remains usable when there is no authenticated
    // viewer. Follow controls simply render unavailable until auth is present.
    if (error?.status === 401) {
      return {
        viewerUsername: null,
        followingUsernames: [],
      };
    }

    return {
      viewerUsername: null,
      followingUsernames: [],
    };
  }
}

export async function getCommunityCreatorsPageData() {
  const [community, viewer] = await Promise.all([
    getCommunityPageData(),
    getViewerFollowContext(),
  ]);

  return {
    creators: community.creators,
    creations: community.creations,
    viewerUsername: viewer.viewerUsername,
    followingUsernames: viewer.followingUsernames,
    loadError: community.loadError,
  };
}
