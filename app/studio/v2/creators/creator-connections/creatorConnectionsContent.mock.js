// Stand-in feed for the Creators connections sub-page, same precedent
// as ../creator-profile/creatorProfileContent.mock.js: a deterministic
// fixture record per owning handle, no fetch, no services-api. Handles
// intentionally match the same subset (vermillion, whiteviolin,
// nightloom, moonglass) so a profile-to-connections navigation in the
// fixture-driven preview resolves to a record that reads like the same
// creator, not a coincidence of matching IDs.

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

function connection(handle, displayName, avatarSrc, isFollowing) {
  return { id: handle, handle, displayName, avatarSrc, isFollowing };
}

export const CREATOR_CONNECTIONS = {
  vermillion: {
    handle: "vermillion",
    displayName: "Vermillion",
    followers: [
      connection("whiteviolin", "White Violin", creatorArt("whiteviolin"), true),
      connection("nightloom", "Nightloom", null, false),
      connection("moonglass", "Moonglass", null, false),
      connection("yagirltee", "yagirltee", creatorArt("vermillion-9"), true),
      connection("fixture-reader-1", "Fixture Reader One", null, false),
      connection("fixture-reader-2", "Fixture Reader Two", creatorArt("vermillion-10"), false),
      connection("fixture-reader-3", "Fixture Reader Three", null, true),
    ],
    following: [
      connection("whiteviolin", "White Violin", creatorArt("whiteviolin"), true),
      connection("nightloom", "Nightloom", null, true),
      connection("fixture-reader-4", "Fixture Reader Four", null, true),
    ],
  },
  whiteviolin: {
    handle: "whiteviolin",
    displayName: "White Violin",
    followers: [
      connection("vermillion", "Vermillion", creatorArt("vermillion"), false),
      connection("fixture-reader-5", "Fixture Reader Five", null, true),
    ],
    following: [
      connection("vermillion", "Vermillion", creatorArt("vermillion"), true),
      connection("moonglass", "Moonglass", null, false),
    ],
  },
  nightloom: {
    handle: "nightloom",
    displayName: "Nightloom",
    followers: [],
    following: [
      connection("vermillion", "Vermillion", creatorArt("vermillion"), true),
    ],
  },
  moonglass: {
    handle: "moonglass",
    displayName: "Moonglass",
    followers: [
      connection("vermillion", "Vermillion", creatorArt("vermillion"), false),
    ],
    following: [],
  },
};

export function resolveCreatorConnections(handle = "") {
  const key = String(handle || "").replace(/^@/, "").toLowerCase();
  return CREATOR_CONNECTIONS[key] || null;
}
