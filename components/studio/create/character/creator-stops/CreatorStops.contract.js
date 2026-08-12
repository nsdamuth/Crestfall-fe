// v1 to v2 (10 Aug 2026, Studio brief S2, docs/STUDIO-SPEC.md section
// 3.2): additive only. CharacterCreatorModal gains fieldScope
// ("full" | "quick", default "full", pixel-stable at default);
// CreatorStopsView gains onSaveAndOpenEditor, rendered on the payoff
// stop in both scopes. No removal, no rename, no handler signature
// change on any existing prop.
//
// v2 to v3 (11 Aug 2026, the save-and-reaccess loop, ruled): additive
// only. CreatorStopsView gains three props for the shared quick-create
// shape's post-save state: `justSaved` (bool, default false), which on
// a confirmed save swaps the footer to exactly two actions in place of
// Back/Save/Next/Finish and save/Save and open editor; `onContinueInEditor`
// (the "Keep editing" action, routes to the advanced editor for the
// just-saved item); `onDone` (the "Done" action, closes the modal in
// place, no navigation). Before a save, the footer is the unchanged v2
// footer. `justSaved` is driven entirely by the consumer, which is
// expected to clear it the moment the form changes again after a save,
// so the confirmation and two-action footer are not sticky across
// further edits. No removal, no rename, no handler signature change on
// any existing prop.
export const CREATOR_STOPS_VIEW_CONTRACT_VERSION = "creator-stops.view.v3";

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
