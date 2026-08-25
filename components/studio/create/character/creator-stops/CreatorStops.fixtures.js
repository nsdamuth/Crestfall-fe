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

// The save-and-reaccess loop, RULED 11 Aug 2026, two-tier: a confirmed
// save from a non-final stop shows the Saved confirmation only, the
// rest of the footer (Back, Save, Next) unchanged.
export const creatorStopsMidSavedFixture = buildFixture("face", {
  justSaved: true,
});

// A confirmed save from the final stop additionally swaps the footer
// to the two-action post-save state, Keep editing and Done.
export const creatorStopsJustSavedFixture = buildFixture("payoff", {
  isLastStop: true,
  justSaved: true,
});

export const creatorStopsUnsavedFixture = buildFixture("seal", {
  hasUnsavedChanges: true,
});

export const creatorStopsConfirmDiscardFixture = buildFixture("seal", {
  hasUnsavedChanges: true,
  confirmDiscardOpen: true,
});

export { CREATOR_STOP_IDS };
