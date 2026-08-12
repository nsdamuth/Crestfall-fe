// The Worlds quick create, v1.0.0, new package this pass (RULED, the
// Q1 world quick-create brief). Strict template of the Character quick
// create (components/studio/create/character/creator-stops/): same
// modal shell, same stop/step composition, same save-and-reaccess
// loop, only the field list differs.
//
// Field allocation: docs/APP-FUNCTION-INVENTORY.md does not cover
// Worlds (checked, no hits beyond an unrelated "real-world visual
// heritage" phrase). Per the brief's own fallback instruction, this
// package uses the smallest sensible set: name, essence/premise,
// setting or genre, tone, look (the art/preview stop). This is an
// ASSUMPTION for Brian to rule on, not a canonical allocation read
// from a source document.
//
// Field order, per the brief: name first, essence or premise next,
// look and tone last. This package orders the two "last" fields tone
// then look, so the look stop (the preview/art stop) is the true
// final stop, matching the Character quick create's payoff-stop
// precedent of ending on the preview panel.
//
// Save-and-reaccess loop: this package renders CreatorStopsView
// (components/studio/create/character/creator-stops/CreatorStops.view,
// contract creator-stops.view.v3) directly, unmodified and unforked,
// per the brief's explicit instruction. WorldCreatorModal supplies
// isLastStop (true only on "look"), so the two-tier post-save state
// applies automatically: a save on any earlier stop shows the Saved
// confirmation only; a save on "look" additionally swaps the footer
// to Keep editing / Done.
//
// Backend creation type: "LOCATION" (lib/shared/creations/
// creationTypePolicy.js), the existing type this app's data model
// already uses for world-space assets. No new type introduced.
export const WORLD_CREATOR_STOPS_CONTRACT_VERSION = "1.0.0";

export const WORLD_STOPS = Object.freeze([
  Object.freeze({ id: "name", label: "The name", iconKey: "name" }),
  Object.freeze({ id: "essence", label: "The essence", iconKey: "essence" }),
  Object.freeze({ id: "setting", label: "The setting", iconKey: "setting" }),
  Object.freeze({ id: "tone", label: "The tone", iconKey: "tone" }),
  Object.freeze({ id: "look", label: "The look", iconKey: "look" }),
]);

export const WORLD_STOP_IDS = Object.freeze(WORLD_STOPS.map((stop) => stop.id));

// Character limits per field, RULED (this pass, package-local until a
// backend schema rules otherwise): visible on every folding and
// non-folding text field via FieldLabel's counter slot.
export const WORLD_FIELD_LIMITS = Object.freeze({
  name: 80,
  essence: 500,
  setting: 120,
  tone: 300,
});

// Mirrors buildCreatorStopItems (Character's CreatorStops.contract.js)
// exactly, over WORLD_STOPS instead of CREATOR_STOPS: package-local,
// not imported, since the two contracts govern different stop lists.
export function buildWorldStopItems(activeStop, maxReachedIndex = -1) {
  const activeIndex = Math.max(
    0,
    WORLD_STOPS.findIndex((stop) => stop.id === activeStop)
  );
  const furthestIndex = Math.max(activeIndex, maxReachedIndex);

  return WORLD_STOPS.map((stop, index) => ({
    ...stop,
    active: stop.id === activeStop,
    seen: index <= furthestIndex,
    reachable: index <= furthestIndex,
  }));
}
