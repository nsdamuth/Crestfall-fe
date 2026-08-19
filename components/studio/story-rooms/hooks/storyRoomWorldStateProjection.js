function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Resolve the room/story World State Location for Chronicle State.
 *
 * Runtime room Location authority is distinct from NPC mobility scene focus.
 * Once locationRuntime.current exists, it must win over the Story template's
 * starting Location. NPC mobility must never project an individual actor's
 * physical Location back into room-level World State.
 */
export function resolveStoryRoomWorldLocationTitle({
  stateData = {},
  room = {},
} = {}) {
  const safeStateData = normalizeObject(stateData);
  const safeRoom = normalizeObject(room);
  const locationRuntime = normalizeObject(safeStateData.locationRuntime);
  const currentLocation = normalizeObject(locationRuntime.current);
  const authoredLocation = normalizeObject(safeStateData.location);

  return (
    normalizeString(
      currentLocation.canonicalName ||
        currentLocation.title ||
        currentLocation.name
    ) ||
    normalizeString(authoredLocation.title) ||
    (normalizeString(safeRoom.locationId)
      ? "Location Attached"
      : "Unspecified Location")
  );
}
