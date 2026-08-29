async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestTimeline(endpoint, fallbackMessage, { method = "GET", body = null } = {}) {
  const response = await fetch(endpoint, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, fallbackMessage));
    error.status = response.status;
    error.code = payload?.error?.code || null;
    error.details = payload?.error?.details || null;
    throw error;
  }

  return payload?.data || null;
}

export async function fetchOwnedTimelineProjection(timelineId) {
  if (!timelineId) throw new Error("Timeline id is required.");

  return requestTimeline(
    `/api/creations/${encodeURIComponent(timelineId)}/timeline`,
    "Timeline could not be loaded."
  );
}

export async function fetchPublicTimelineProjection(timelineId) {
  if (!timelineId) throw new Error("Timeline id is required.");

  return requestTimeline(
    `/api/timelines/${encodeURIComponent(timelineId)}/publication`,
    "Public Timeline could not be loaded."
  );
}


export async function createTimelineDraft(payload) {
  return requestTimeline(
    "/api/creations",
    "Timeline could not be created.",
    { method: "POST", body: payload }
  );
}

export async function updateTimelineDraft(timelineId, payload) {
  if (!timelineId) throw new Error("Timeline id is required.");

  return requestTimeline(
    `/api/creations/${encodeURIComponent(timelineId)}`,
    "Timeline could not be saved.",
    { method: "PATCH", body: payload }
  );
}
