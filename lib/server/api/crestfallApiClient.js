export async function crestfallApiRequest({
  path,
  method = "GET",
  body = null,
  headers = {},
}) {
  const baseUrl = process.env.CRESTFALL_API_INTERNAL_URL;
  const secret = process.env.CRESTFALL_API_INTERNAL_SECRET;

  if (!baseUrl) {
    throw new Error(
      "CRESTFALL_API_INTERNAL_URL is not configured."
    );
  }

  if (!secret) {
    throw new Error(
      "CRESTFALL_API_INTERNAL_SECRET is not configured."
    );
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      "x-crestfall-internal-secret": secret,
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        payload?.error ||
        payload?.message ||
        `Crestfall API request failed with status ${response.status}.`
    );

    error.status = response.status;
    error.payload = payload;

    throw error;
  }

  return payload;
}