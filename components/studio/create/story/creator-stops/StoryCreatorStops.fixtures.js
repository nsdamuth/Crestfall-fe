import { buildStoryStopItems, STORY_STOP_IDS } from "./StoryCreatorStops.contract";

// Fixture-driven cast and setting sources for the picker stops
// (docs/FRONTEND-SOP.md section 2, fixture-first): stands in for the
// person's owned characters and locations until CR-driven live
// fetching lands, per the brief's own "fixture-driven for now"
// instruction. Shaped to KitPickerModalItem (id, title, subtitle,
// imageSrc, badgeLabel).
export const FIXTURE_CHARACTERS = [
  { id: "char-1", title: "Lux", subtitle: "Living presence, own work" },
  { id: "char-2", title: "Ashira", subtitle: "Living presence, own work" },
  { id: "char-3", title: "Rev", subtitle: "Player identity, own work" },
];

export const FIXTURE_LOCATIONS = [
  { id: "loc-1", title: "Crestfall", subtitle: "World, own work" },
  { id: "loc-2", title: "Aethelgard", subtitle: "World, own work" },
];

function buildFixture(activeStop, overrides = {}) {
  const stopItems = buildStoryStopItems(activeStop);
  const activeIndex = Math.max(
    0,
    stopItems.findIndex((stop) => stop.active)
  );

  return {
    activeStop,
    activeIndex,
    stopItems,
    isLastStop: activeStop === "cover",
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
export const storyCreatorStopsEmptyFixture = buildFixture("name");

export const EMPTY_STORY_FORM_STATE = {
  name: "",
  premise: "",
  castIds: [],
  settingId: null,
};

// Filled: the final stop, every field carrying content, ready to
// save.
export const storyCreatorStopsFilledFixture = buildFixture("cover", {
  isLastStop: true,
  hasUnsavedChanges: true,
});

export const FILLED_STORY_FORM_STATE = {
  name: "The Long Watch at Crestfall",
  premise: "A council seat has come open at midnight, and three factions want it before dawn.",
  castIds: ["char-1", "char-2"],
  settingId: "loc-1",
};

// Mid-flow saved: a confirmed save from a non-final stop, the Saved
// confirmation only, the rest of the footer unchanged.
export const storyCreatorStopsMidSavedFixture = buildFixture("premise", {
  justSaved: true,
});

// Final-stop saved: a confirmed save from "cover", the Saved
// confirmation plus the two-action post-save footer.
export const storyCreatorStopsFinalSavedFixture = buildFixture("cover", {
  isLastStop: true,
  justSaved: true,
});

export { STORY_STOP_IDS };
