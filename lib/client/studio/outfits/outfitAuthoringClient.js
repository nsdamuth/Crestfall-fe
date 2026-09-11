function readJsonResponse(response) {
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

export async function convertOutfitNormalPromptToAdvanced(normalPrompt) {
  const response = await fetch("/api/studio/outfits/advanced-prompt-conversion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ normalPrompt }),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(
        payload,
        "The Outfit prompt could not be converted to Advanced mode."
      )
    );
    error.status = response.status;
    error.code = payload?.error?.code || null;
    error.details = payload?.error?.details || null;
    throw error;
  }

  return payload?.data?.conversion || null;
}
