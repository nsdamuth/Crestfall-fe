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

export async function fetchCurrentCoinBalance() {
  const response = await fetch("/api/profile/me", {
    method: "GET",
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error) {
    throw new Error(
      getApiErrorMessage(payload, "Coin balance could not be loaded.")
    );
  }

  const profile = payload?.data?.profile || {};
  const balance = Number.parseInt(
    profile.coin_balance ?? profile.coinBalance ?? 0,
    10
  );

  return Number.isFinite(balance) ? balance : 0;
}

export async function donateProfileCoins({
  recipientProfileId,
  amountGross,
  message = "",
  isAnonymous = false,
}) {
  const response = await fetch("/api/profile/donations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientProfileId,
      amountGross,
      message,
      isAnonymous,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload?.ok) {
    throw new Error(
      getApiErrorMessage(payload, "Donation could not be completed.")
    );
  }

  return payload?.data?.donation || null;
}