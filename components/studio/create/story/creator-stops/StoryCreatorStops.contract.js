// The Stories quick create, v1.0.0, new package (RULED, the Q3 story
// quick-create brief). Built using the Looks quick create
// (components/studio/create/look/creator-stops/) as the proven
// template, itself the same strict template of the Character quick
// create (components/studio/create/character/creator-stops/): same
// modal shell, same stop/step composition, same save-and-reaccess
// loop. Two differences from every prior consumer: the field list,
// and two of the five fields (cast, setting) are pickers rather than
// free text.
//
// Field allocation: docs/APP-FUNCTION-INVENTORY.md does not cover a
// standalone Story or ROOM_TEMPLATE creation type's own field list
// (checked; no hits for either term beyond a Play-destination mapping
// row and a section-naming aside). Per the brief's own ruled fallback,
// this package uses the given list: name, premise, cast, setting,
// cover (the art/preview stop).
//
// Picker pattern: cast (multi-select) and setting (single-select)
// both use KitPickerModal (components/kit/picker-modal/), the kit's
// existing branded, fixture-fed selection modal (already built to
// support both single and multi select in one component, composed on
// KitModalFrame). No other selection pattern for choosing owned
// assets is live-wired anywhere in the app yet: the legacy
// SelectedCharactersPanel (components/studio/room-templates/
// selected-characters-panel/) is a selected-chips summary with an
// onOpenCharacterPicker callback and no picker implementation behind
// it, off the v2 token system. KitPickerModal is reused unmodified,
// per the brief's instruction to use the simplest branded selection
// control already in the kit rather than invent a new pattern. It
// renders as its own KitModalFrame overlay, stacked on top of
// CreatorStopsView (same z-50 stacking context, later in DOM paint
// order), opened from a trigger button on the cast/setting stop
// rather than folded into CreatorStopsView's secondaryPanel takeover,
// since KitPickerModal is already a complete, self-contained modal.
//
// Field order, per the brief: the given order is the stop order.
// "cover" is the final stop, matching the Character, World, and Look
// precedent of ending on the preview panel.
//
// Save-and-reaccess loop: this package renders CreatorStopsView
// (components/studio/create/character/creator-stops/CreatorStops.view,
// contract creator-stops.view.v6, reached by this package's own
// story-quick-create brief) directly, unmodified and unforked, per
// the brief's explicit instruction. StoryCreatorModal supplies
// isLastStop (true only on "cover"), so the two-tier post-save
// state applies automatically: a save on any earlier stop shows the
// Saved confirmation only; a save on "cover" additionally swaps the
// footer to Keep editing / Done.
//
// Backend creation type: "ROOM_TEMPLATE" (lib/shared/creations/
// creationTypePolicy.js, label "Story"), the existing type this app's
// data model already uses for Stories, per the brief's instruction to
// map the new Studio hub door onto the existing ROOM_TEMPLATE type.
// No new type introduced.
export const STORY_CREATOR_STOPS_CONTRACT_VERSION = "1.0.0";

export const STORY_STOPS = Object.freeze([
  Object.freeze({ id: "name", label: "The name", iconKey: "name" }),
  Object.freeze({ id: "premise", label: "The premise", iconKey: "premise" }),
  Object.freeze({ id: "cast", label: "The cast", iconKey: "cast" }),
  Object.freeze({ id: "setting", label: "The setting", iconKey: "setting" }),
  Object.freeze({ id: "cover", label: "The cover", iconKey: "cover" }),
]);

export const STORY_STOP_IDS = Object.freeze(STORY_STOPS.map((stop) => stop.id));

// Character limit for the one free-text field, RULED (the Q3 story
// quick-create brief, package-local until a backend schema rules
// otherwise): visible via FieldLabel's counter slot. Transplanted
// from the Worlds/Looks template's folding-field limit (500).
export const STORY_FIELD_LIMITS = Object.freeze({
  name: 80,
  premise: 500,
});

// Mirrors buildLookStopItems (Look's LookCreatorStops.contract.js),
// itself mirroring buildWorldStopItems and buildCreatorStopItems,
// exactly, over STORY_STOPS instead: package-local, not imported,
// since each contract governs a different stop list.
export function buildStoryStopItems(activeStop, maxReachedIndex = -1) {
  const activeIndex = Math.max(
    0,
    STORY_STOPS.findIndex((stop) => stop.id === activeStop)
  );
  const furthestIndex = Math.max(activeIndex, maxReachedIndex);

  return STORY_STOPS.map((stop, index) => ({
    ...stop,
    active: stop.id === activeStop,
    seen: index <= furthestIndex,
    reachable: index <= furthestIndex,
  }));
}
