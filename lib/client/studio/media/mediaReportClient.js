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

export async function createMediaReport(
  { imageOutputId, reasonKey, reasonText = "" },
  fallbackMessage = "Report could not be submitted."
) {
  if (!imageOutputId) {
    throw new Error("Image output id is required.");
  }

  if (!reasonKey) {
    throw new Error("Report reason is required.");
  }

  const response = await fetch("/api/media/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageOutputId,
      reasonKey,
      reasonText,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload?.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.report || null;
}