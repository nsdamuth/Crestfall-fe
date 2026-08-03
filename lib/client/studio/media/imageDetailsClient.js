async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.error ||
    payload?.message ||
    fallbackMessage
  );
}

export async function fetchImageOutputDetails(
  imageOutputId,
  fallbackMessage = "Image details could not be loaded."
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  const response = await fetch(
    `/api/media/images/${encodeURIComponent(imageOutputId)}/details`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload?.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.details || null;
}