async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getGamesApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestGamesApi({
  endpoint,
  method = "GET",
  body,
  fallbackMessage,
}) {
  const response = await fetch(endpoint, {
    method,
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error || payload?.ok === false) {
    throw new Error(getGamesApiErrorMessage(payload, fallbackMessage));
  }

  return payload;
}

export async function fetchGames() {
  const responsePayload = await requestGamesApi({
    endpoint: "/api/studio/games",
    method: "GET",
    fallbackMessage: "Games could not be loaded.",
  });

  return responsePayload?.data?.games || [];
}