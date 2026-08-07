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
    saveDisabled: false,
    hasUnsavedChanges: false,
    confirmDiscardOpen: false,
    isSaving: false,
    saveError: null,
    ...overrides,
  };
}

export const creatorStopsFirstFixture = buildFixture("name");

export const creatorStopsMidFixture = buildFixture("face");

export const creatorStopsLastFixture = buildFixture("payoff", {
  isLastStop: true,
});

export const creatorStopsSavingFixture = buildFixture("payoff", {
  isLastStop: true,
  isSaving: true,
});

export const creatorStopsSaveErrorFixture = buildFixture("payoff", {
  isLastStop: true,
  hasUnsavedChanges: true,
  saveError: true,
});

export const creatorStopsUnsavedFixture = buildFixture("seal", {
  hasUnsavedChanges: true,
});

export const creatorStopsConfirmDiscardFixture = buildFixture("seal", {
  hasUnsavedChanges: true,
  confirmDiscardOpen: true,
});

export { CREATOR_STOP_IDS };
