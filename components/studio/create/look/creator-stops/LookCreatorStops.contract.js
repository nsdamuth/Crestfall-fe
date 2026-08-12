// The Looks quick create, v1.0.0, new package this pass (RULED, the
// Q2 look quick-create brief). Built using the Worlds quick create
// (components/studio/create/world/creator-stops/) as the proven
// template, itself the same strict template of the Character quick
// create (components/studio/create/character/creator-stops/): same
// modal shell, same stop/step composition, same save-and-reaccess
// loop, only the field list differs.
//
// Field allocation: docs/APP-FUNCTION-INVENTORY.md does not cover a
// standalone Outfit/Look creation type's own field list (checked; it
// documents Character's clothing-selection controls, "Default
// Clothing / Select Outfit / Select Wardrobe / Clear", not a Looks
// asset type). Per the brief's own ruled fallback, this package uses
// the given list: name, vibe, garments, palette, look (the
// art/preview stop).
//
// Field order, per the brief: the given order is the stop order.
// "look" is the final stop, matching the World and Character
// precedent of ending on the preview panel.
//
// Field-position mapping to the World template, for anyone diffing
// the two packages: name (TextField) -> name (TextField); vibe
// (FoldingTextField) -> premise (FoldingTextField); garments
// (TextField) -> setting (TextField); palette (FoldingTextField) ->
// tone (FoldingTextField); look (preview stop) -> look (preview
// stop). Same control shape per position, only the field differs.
//
// Save-and-reaccess loop: this package renders CreatorStopsView
// (components/studio/create/character/creator-stops/CreatorStops.view,
// contract creator-stops.view.v5 after this pass) directly, unmodified
// and unforked, per the brief's explicit instruction. LookCreatorModal
// supplies isLastStop (true only on "look"), so the two-tier post-save
// state applies automatically: a save on any earlier stop shows the
// Saved confirmation only; a save on "look" additionally swaps the
// footer to Keep editing / Done.
//
// Backend creation type: "OUTFIT" (lib/shared/creations/
// creationTypePolicy.js), the existing type this app's data model
// already uses for outfit/clothing assets, per the brief's instruction
// to map onto the existing outfit door and type rather than inventing
// a new one. No new type introduced.
export const LOOK_CREATOR_STOPS_CONTRACT_VERSION = "1.0.0";

export const LOOK_STOPS = Object.freeze([
  Object.freeze({ id: "name", label: "The name", iconKey: "name" }),
  Object.freeze({ id: "vibe", label: "The vibe", iconKey: "vibe" }),
  Object.freeze({ id: "garments", label: "The garments", iconKey: "garments" }),
  Object.freeze({ id: "palette", label: "The palette", iconKey: "palette" }),
  Object.freeze({ id: "look", label: "The look", iconKey: "look" }),
]);

export const LOOK_STOP_IDS = Object.freeze(LOOK_STOPS.map((stop) => stop.id));

// Character limits per field, RULED (this pass, package-local until a
// backend schema rules otherwise): visible on every folding and
// non-folding text field via FieldLabel's counter slot. Transplanted
// from the World template's per-position limits (name 80,
// folding-field 500, single-line-field 120, folding-field 300).
export const LOOK_FIELD_LIMITS = Object.freeze({
  name: 80,
  vibe: 500,
  garments: 120,
  palette: 300,
});

// Mirrors buildWorldStopItems (World's WorldCreatorStops.contract.js),
// itself mirroring buildCreatorStopItems (Character's
// CreatorStops.contract.js) exactly, over LOOK_STOPS instead:
// package-local, not imported, since each contract governs a
// different stop list.
export function buildLookStopItems(activeStop, maxReachedIndex = -1) {
  const activeIndex = Math.max(
    0,
    LOOK_STOPS.findIndex((stop) => stop.id === activeStop)
  );
  const furthestIndex = Math.max(activeIndex, maxReachedIndex);

  return LOOK_STOPS.map((stop, index) => ({
    ...stop,
    active: stop.id === activeStop,
    seen: index <= furthestIndex,
    reachable: index <= furthestIndex,
  }));
}
