import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

function buildHeaders(userId) {
  return {
    "x-crestfall-user-id": userId,
  };
}

export async function getOwnedTimelineProjection({ userId, timelineId }) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(timelineId)}/timeline`,
    method: "GET",
    headers: buildHeaders(userId),
  });
}

export async function getPublicTimelineProjection({ timelineId }) {
  return crestfallApiRequest({
    path: `/v1/timelines/${encodeURIComponent(timelineId)}/publication`,
    method: "GET",
  });
}
