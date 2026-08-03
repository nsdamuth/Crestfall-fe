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

function toCoinBalance(value) {
  const balance = Number.parseInt(value, 10);

  return Number.isFinite(balance) ? balance : 0;
}

function normalizeStudioAccountPayload(payload) {
  const profile = payload?.data?.profile || {};

  return {
    user: payload?.data?.user || null,
    profile,
    coinBalance: toCoinBalance(
      profile.coin_balance ?? profile.coinBalance ?? 0
    ),
  };
}

export async function fetchCurrentStudioAccount() {
  const response = await fetch("/api/profile/me", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getApiErrorMessage(payload, "Studio account could not be loaded.")
    );
  }

  return normalizeStudioAccountPayload(payload);
}

export async function updateCurrentStudioAccount(updates) {
  const response = await fetch("/api/profile/me", {
    method: "PATCH",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getApiErrorMessage(payload, "Studio account could not be updated.")
    );
  }

  return normalizeStudioAccountPayload(payload);
}

export async function fetchStudioAccountMetrics() {
  const response = await fetch("/api/account/metrics", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getApiErrorMessage(payload, "Account metrics could not be loaded.")
    );
  }

  return payload?.data?.metrics || {};
}
