async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getSplitApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestLocationRegistrySplitApi({
  creationId,
  action,
  body,
  fallbackMessage,
}) {
  const response = await fetch(
    `/api/creations/${encodeURIComponent(creationId)}/location-registry-split/${action}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    }
  );
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(
      getSplitApiErrorMessage(payload, fallbackMessage)
    );
    error.status = response.status;
    error.code = payload?.error?.code || null;
    error.details = payload?.error?.details || null;
    throw error;
  }

  return payload;
}

export async function planLocationRegistrySplit(
  creationId,
  { groups = [] } = {}
) {
  const payload = await requestLocationRegistrySplitApi({
    creationId,
    action: "plan",
    body: { groups },
    fallbackMessage: "Location Registry split validation could not be completed.",
  });

  return payload?.data?.plan || null;
}

export async function commitLocationRegistrySplit(
  creationId,
  {
    groups = [],
    creatorConfirmed = false,
    expectedSourceFingerprint = "",
    expectedPlanFingerprint = "",
  } = {}
) {
  const payload = await requestLocationRegistrySplitApi({
    creationId,
    action: "commit",
    body: {
      groups,
      creatorConfirmed,
      expectedSourceFingerprint,
      expectedPlanFingerprint,
    },
    fallbackMessage: "Location Registry split could not be applied.",
  });

  return payload?.data || null;
}
