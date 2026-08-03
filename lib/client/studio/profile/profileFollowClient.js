async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function setProfileFollowByUsername(
  { username, active },
  fallbackMessage = "Follow action could not be completed."
) {
  const response = await fetch(
    `/api/profiles/${encodeURIComponent(username)}/follow`,
    {
      method: active ? "POST" : "DELETE",
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data || null;
}
