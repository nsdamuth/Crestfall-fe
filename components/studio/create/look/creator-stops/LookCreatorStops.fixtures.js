import { buildLookStopItems, LOOK_STOP_IDS } from "./LookCreatorStops.contract";

function buildFixture(activeStop, overrides = {}) {
  const stopItems = buildLookStopItems(activeStop);
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
export const lookCreatorStopsEmptyFixture = buildFixture("name");

export const EMPTY_LOOK_FORM_STATE = {
  name: "",
  vibe: "",
  garments: "",
  palette: "",
};

// Filled: the final stop, every field carrying content, ready to
// save.
export const lookCreatorStopsFilledFixture = buildFixture("look", {
  isLastStop: true,
  hasUnsavedChanges: true,
});

export const FILLED_LOOK_FORM_STATE = {
  name: "Midnight Court Regalia",
  vibe: "Quiet menace under formal restraint. Old money dressed for a funeral it arranged.",
  garments: "Floor-length coat, high collar, fingerless gloves",
  palette: "Charcoal wool, oxblood leather, tarnished silver hardware.",
};

// Mid-flow saved: a confirmed save from a non-final stop, the Saved
// confirmation only, the rest of the footer unchanged.
export const lookCreatorStopsMidSavedFixture = buildFixture("vibe", {
  justSaved: true,
});

// Final-stop saved: a confirmed save from "look", the Saved
// confirmation plus the two-action post-save footer.
export const lookCreatorStopsFinalSavedFixture = buildFixture("look", {
  isLastStop: true,
  justSaved: true,
});

export { LOOK_STOP_IDS };
