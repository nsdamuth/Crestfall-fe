const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,48}$/;

const CREDIT_KIND_LABELS = {
  CHARACTER: "Character",
  PLAYER_CHARACTER: "Player character",
  OUTFIT: "Clothing",
  CLOTHING: "Clothing",
  POSE: "Pose",
  LOCATION: "Location",
  IMAGE_PRESET: "Image preset",
  CHARACTER_TEMPLATE: "Character template",
  SCENARIO: "Scenario",
  NARRATOR: "Narrator",
  ROOM_TEMPLATE: "Room template",
};

export function normalizeProfileUsername(value) {
  if (typeof value !== "string") return "";

  const normalized = value.trim().replace(/^@/, "").toLowerCase();

  return USERNAME_PATTERN.test(normalized) ? normalized : "";
}

export function getProfileHrefForUsername(username) {
  const normalized = normalizeProfileUsername(username);

  return normalized ? `/studio/profile/${encodeURIComponent(normalized)}` : null;
}

function cleanDisplayHandle(value) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim().replace(/^@/, "");

  return trimmed ? `@${trimmed}` : "";
}

export function getCreationCreator(creation) {
  const data = creation?.data || {};

  const username = normalizeProfileUsername(
    creation?.creatorUsername ||
      creation?.creator_username ||
      creation?.ownerUsername ||
      creation?.owner_username ||
      data.creatorUsername ||
      data.creator_username ||
      data.ownerUsername ||
      data.owner_username
  );

const handle = username
  ? formatDisplayHandleFromUsername(username)
  : cleanDisplayHandle(
      creation?.creatorHandle ||
        creation?.creator_handle ||
        data.creatorHandle ||
        data.creator_handle
    );

  const href =
    creation?.creatorProfileHref ||
    creation?.creator_profile_href ||
    data.creatorProfileHref ||
    data.creator_profile_href ||
    getProfileHrefForUsername(username);

  return {
    username,
    handle,
    href: href || null,
  };
}
function formatDisplayHandleFromUsername(username) {
  const normalized = normalizeProfileUsername(username);

  if (!normalized) return "";

  return `@${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`;
}
export function isCreationCreditable(creationOrData) {
  const data = creationOrData?.data || creationOrData || {};

  return data.is_creditable !== false;
}

function normalizeCredit(rawCredit, index) {
  if (!rawCredit || typeof rawCredit !== "object") return null;

  const rawData =
    rawCredit.data && typeof rawCredit.data === "object" && !Array.isArray(rawCredit.data)
      ? rawCredit.data
      : {};

  const creditable =
    rawCredit.is_creditable ??
    rawCredit.creditable ??
    rawData.is_creditable ??
    rawData.creditable ??
    true;

  if (creditable === false) return null;

  const kind = String(
    rawCredit.kind ||
      rawCredit.role ||
      rawCredit.assetKind ||
      rawCredit.asset_kind ||
      rawCredit.assetType ||
      rawCredit.asset_type ||
      rawCredit.type ||
      "ASSET"
  ).toUpperCase();

  const creatorUsername = normalizeProfileUsername(
    rawCredit.creatorUsername ||
      rawCredit.creator_username ||
      rawCredit.ownerUsername ||
      rawCredit.owner_username ||
      rawData.creatorUsername ||
      rawData.creator_username ||
      rawData.ownerUsername ||
      rawData.owner_username
  );

  const creatorHandle = creatorUsername
    ? formatDisplayHandleFromUsername(creatorUsername)
    : cleanDisplayHandle(
        rawCredit.creatorHandle ||
          rawCredit.creator_handle ||
          rawCredit.creatorDisplayName ||
          rawCredit.creator_display_name ||
          rawData.creatorHandle ||
          rawData.creator_handle ||
          rawData.creatorDisplayName ||
          rawData.creator_display_name
      );


  if (!creatorHandle) return null;

  const creatorHref =
    rawCredit.creatorProfileHref ||
    rawCredit.creator_profile_href ||
    rawData.creatorProfileHref ||
    rawData.creator_profile_href ||
    getProfileHrefForUsername(creatorUsername);

  return {
    id:
      rawCredit.id ||
      rawCredit.assetId ||
      rawCredit.asset_id ||
      `${kind}-${index}`,
    kind,
    kindLabel: CREDIT_KIND_LABELS[kind] || kind.replaceAll("_", " "),
    assetId:
      rawCredit.assetId ||
      rawCredit.asset_id ||
      rawCredit.id ||
      "",
    assetTitle:
      rawCredit.assetTitle ||
      rawCredit.asset_title ||
      rawCredit.title ||
      rawCredit.name ||
      "",
    creatorUsername,
    creatorHandle,
    creatorHref: creatorHref || null,
  };
}
function toCreditCandidate(reference, kind) {
  if (!reference || typeof reference !== "object" || !reference.id) {
    return null;
  }

  return {
    ...reference,
    kind,
    assetId: reference.id,
    asset_id: reference.id,
    assetTitle: reference.title || reference.name || "Untitled Asset",
    asset_title: reference.title || reference.name || "Untitled Asset",
  };
}

function getExistingConnectedReferences(data) {
  const selectedCharacters = Array.isArray(data.selected_characters)
    ? data.selected_characters
    : [];

  const imagePresetAssets = [
    data.image_preset_assets,
    data.image_presets,
    data.selected_image_presets,
  ].find(Array.isArray) || [];

  const outfitAssets = [
    data.outfit_assets,
    data.outfits,
    data.selected_outfits,
    data.clothing_assets,
    data.selected_clothing,
  ].find(Array.isArray) || [];

  return [
    ...selectedCharacters.map((character) =>
      toCreditCandidate(character, character.type || "CHARACTER")
    ),

    toCreditCandidate(data.selected_scenario, "SCENARIO"),
    toCreditCandidate(data.selected_narrator, "NARRATOR"),
    toCreditCandidate(data.selected_location, "LOCATION"),

    ...imagePresetAssets.map((asset) =>
      toCreditCandidate(asset, "IMAGE_PRESET")
    ),

    ...outfitAssets.map((asset) =>
      toCreditCandidate(asset, asset.type || "OUTFIT")
    ),
  ].filter(Boolean);
}

function dedupeCredits(credits) {
  const seen = new Set();

  return credits.filter((credit) => {
    const key = [
      credit.kind,
      credit.assetId,
      credit.creatorUsername || credit.creatorHandle,
    ]
      .filter(Boolean)
      .join(":");

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export function getCreationCredits(creation) {
  const data = creation?.data || {};

  const explicitCredits =
    [
      creation?.credits,
      creation?.assetCredits,
      creation?.asset_credits,
      creation?.connectedAssets,
      creation?.connected_assets,
      data.credits,
      data.assetCredits,
      data.asset_credits,
      data.connectedAssets,
      data.connected_assets,
    ].find(Array.isArray) || [];

  const existingConnectedReferences = getExistingConnectedReferences(data);

  return dedupeCredits(
    [...explicitCredits, ...existingConnectedReferences]
      .map(normalizeCredit)
      .filter(Boolean)
  );
}