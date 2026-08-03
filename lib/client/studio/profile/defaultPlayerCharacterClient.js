function getErrorMessage(payload, fallback) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallback
  );
}

export async function setDefaultPlayerCharacter(playerCharacterId) {
  const response = await fetch("/api/profile/me", {
    method: "PATCH",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      default_player_character_id: playerCharacterId,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload, "Default Player Character could not be saved.")
    );
  }

  return payload?.data || payload;
}

export async function clearDefaultPlayerCharacter() {
  return setDefaultPlayerCharacter(null);
}