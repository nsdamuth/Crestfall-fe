async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getImageOutputApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function deleteImageOutput(
  imageOutputId,
  {
    deleteReason = null,
  } = {},
  fallbackMessage = "Image could not be deleted."
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  const response = await fetch(
    `/api/media/images/${encodeURIComponent(imageOutputId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteReason,
      }),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getImageOutputApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.image || null;
}