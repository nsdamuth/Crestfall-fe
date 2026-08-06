import { buildCreatorStopItems, CREATOR_STOP_IDS } from "./CreatorStops.contract";

function buildFixture(activeStop, overrides = {}) {
  const stopItems = buildCreatorStopItems(activeStop);
  const activeIndex = Math.max(
    0,
    stopItems.findIndex((stop) => stop.active)
  );

  return {
    activeStop,
    activeIndex,
    stopItems,
    isLastStop: activeStop === "payoff",
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    ...overrides,
  };
}

export const creatorStopsFirstFixture = buildFixture("name");

export const creatorStopsMidFixture = buildFixture("face");

export const creatorStopsLastFixture = buildFixture("payoff", {
  isLastStop: true,
});

export const creatorStopsSavingFixture = buildFixture("seal", {
  saveStatus: "saving",
  saveDisabled: true,
});

export const creatorStopsSavedMessageFixture = buildFixture("seal", {
  saveMessage: "Saved.",
});

export { CREATOR_STOP_IDS };
