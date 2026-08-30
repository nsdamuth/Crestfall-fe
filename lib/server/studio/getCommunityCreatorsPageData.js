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

    const viewerProfile = profilePayload?.data?.profile || null;
    const viewerUsername = normalizeUsername(viewerProfile?.username);
    const viewerDisplayName =
      typeof (viewerProfile?.displayName || viewerProfile?.display_name) === "string"
        ? (viewerProfile.displayName || viewerProfile.display_name).trim()
        : "";

    if (!viewerUsername) {
      return {
        viewerUsername: null,
        viewerDisplayName: viewerDisplayName || null,
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
      viewerDisplayName: viewerDisplayName || viewerUsername,
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
        viewerDisplayName: null,
        followingUsernames: [],
      };
    }

    return {
      viewerUsername: null,
      viewerDisplayName: null,
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
    viewerDisplayName: viewer.viewerDisplayName,
    followingUsernames: viewer.followingUsernames,
    loadError: community.loadError,
  };
}
