import { buildWorldStopItems, WORLD_STOP_IDS } from "./WorldCreatorStops.contract";

function buildFixture(activeStop, overrides = {}) {
  const stopItems = buildWorldStopItems(activeStop);
  const activeIndex = Math.max(
    0,
    stopItems.findIndex((stop) => stop.active)
  );

  return {
    activeStop,
    activeIndex,
    stopItems,
    isLastStop: activeStop === "look",
    saveDisabled: false,
    hasUnsavedChanges: false,
    confirmDiscardOpen: false,
    isSaving: false,
    saveError: null,
    justSaved: false,
    ...overrides,
  };
}

// Empty: the first stop, nothing entered yet.
export const worldCreatorStopsEmptyFixture = buildFixture("name");

export const EMPTY_WORLD_FORM_STATE = {
  name: "",
  essence: "",
  setting: "",
  tone: "",
};

// Filled: the final stop, every field carrying content, ready to
// save.
export const worldCreatorStopsFilledFixture = buildFixture("look", {
  isLastStop: true,
  hasUnsavedChanges: true,
});

export const FILLED_WORLD_FORM_STATE = {
  name: "Crestfall",
  essence:
    "A drowned coastal city ruled by a council of merchant houses, one generation past a war nobody won.",
  setting: "Gaslamp fantasy, flooded archipelago",
  tone: "Wry and weary. Grand ruins, small people, gallows humor.",
};

// Mid-flow saved: a confirmed save from a non-final stop, the Saved
// confirmation only, the rest of the footer unchanged.
export const worldCreatorStopsMidSavedFixture = buildFixture("essence", {
  justSaved: true,
});

// Final-stop saved: a confirmed save from "look", the Saved
// confirmation plus the two-action post-save footer.
export const worldCreatorStopsFinalSavedFixture = buildFixture("look", {
  isLastStop: true,
  justSaved: true,
});

export { WORLD_STOP_IDS };
