export const CREATOR_STOPS_VIEW_CONTRACT_VERSION = "creator-stops.view.v1";

export const CREATOR_STOPS = Object.freeze([
  Object.freeze({ id: "name", label: "The name", iconKey: "name" }),
  Object.freeze({ id: "kind", label: "The kind", iconKey: "kind" }),
  Object.freeze({ id: "face", label: "The face", iconKey: "face" }),
  Object.freeze({ id: "silhouette", label: "The silhouette", iconKey: "silhouette" }),
  Object.freeze({ id: "heart", label: "The heart", iconKey: "heart" }),
  Object.freeze({ id: "seal", label: "The seal", iconKey: "seal" }),
  Object.freeze({ id: "payoff", label: "The payoff", iconKey: "payoff" }),
]);

export const CREATOR_STOP_IDS = Object.freeze(CREATOR_STOPS.map((stop) => stop.id));

export function buildCreatorStopItems(activeStop, maxReachedIndex = -1) {
  const activeIndex = Math.max(
    0,
    CREATOR_STOPS.findIndex((stop) => stop.id === activeStop)
  );
  const furthestIndex = Math.max(activeIndex, maxReachedIndex);

  return CREATOR_STOPS.map((stop, index) => ({
    ...stop,
    active: stop.id === activeStop,
    seen: index <= furthestIndex,
    reachable: index <= furthestIndex,
  }));
}
