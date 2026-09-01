async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

export async function fetchStudioNotifications({ limit = 20 } = {}) {
  const normalizedLimit = Math.max(
    1,
    Math.min(Number.parseInt(String(limit || 20), 10) || 20, 50)
  );

  const response = await fetch(
    `/api/studio/notifications?limit=${normalizedLimit}`,
    {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getApiErrorMessage(payload, "Notifications could not be loaded.")
    );
  }

  return Array.isArray(payload?.data?.notifications)
    ? payload.data.notifications
    : [];
}
