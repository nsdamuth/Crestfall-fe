// v1 to v2 (10 Aug 2026, Studio brief S2, docs/STUDIO-SPEC.md section
// 3.2): additive only. CharacterCreatorModal gains fieldScope
// ("full" | "quick", default "full", pixel-stable at default);
// CreatorStopsView gains onSaveAndOpenEditor, rendered on the payoff
// stop in both scopes. No removal, no rename, no handler signature
// change on any existing prop.
//
// v2 to v3 (11 Aug 2026, the save-and-reaccess loop, ruled, two-tier):
// additive only. CreatorStopsView gains three props for the shared
// quick-create shape's post-save state: `justSaved` (bool, default
// false); `onContinueInEditor` (the "Keep editing" action, routes to
// the advanced editor for the just-saved item); `onDone` (the "Done"
// action, closes the modal in place, no navigation). `justSaved` is
// driven entirely by the consumer, which is expected to clear it the
// moment the form changes again after a save, so the confirmation is
// not sticky across further edits.
//
// The post-save state is two-tier, keyed on `isLastStop`:
// - `justSaved` true on any stop that is NOT the final stop (isLastStop
//   false): the Saved confirmation renders in place of the usual
//   unsaved/error status, and the rest of the footer (Back, Save,
//   Next) is exactly the v2 footer, unchanged.
// - `justSaved` true on the final stop (isLastStop true): the Saved
//   confirmation renders AND the footer swaps to exactly two actions,
//   Keep editing and Done, in place of Back/Save/Finish and save/Save
//   and open editor.
// A single-stop quick create is always on its final stop, so it gets
// the two-action footer on every save with no special casing; this is
// the shape later quick creates (Worlds, Looks, Stories) inherit.
// Before any save, the footer is the unchanged v2 footer in both
// cases. No removal, no rename, no handler signature change on any
// existing prop.
//
// v3 to v4 (world-quick-create fixes, RULED): additive
// only. The package-private STOP_ICONS map (CreatorStops.view.jsx)
// gains four entries for the Worlds quick create's non-"name" stop
// ids: premise (BookOpen), setting (Compass), tone (Palette), look
// (ImageIcon). This is presentation-only icon coverage inside the
// existing stop-item shape (stop.iconKey already existed; only which
// keys resolve to a non-default icon changes); it is not part of this
// file's exported surface, since STOP_ICONS was never exported.
// Character's seven existing icon entries (name, kind, face,
// silhouette, heart, seal, payoff) are unchanged. No prop added,
// removed, or renamed on CreatorStopsView itself.
//
// v4 to v5 (look-quick-create brief, RULED): additive
// only. The package-private STOP_ICONS map (CreatorStops.view.jsx)
// gains three entries for the Looks quick create's non-"name",
// non-"look" stop ids: vibe (Sparkles), garments (Shirt), palette
// (Palette, the same icon World's "tone" entry already uses, reused
// deliberately since this stop is literally a color palette).
// Character's and World's existing icon entries are unchanged. No
// prop added, removed, or renamed on CreatorStopsView itself.
//
// v5 to v6 (story-quick-create brief, RULED): additive
// only. The package-private STOP_ICONS map (CreatorStops.view.jsx)
// gains two entries for the Stories quick create's non-"name",
// non-"setting" stop ids: cast (Users), cover (ImageIcon, reused from
// "payoff" and "look", since this is also a preview/art stop).
// "setting" already resolved to Compass from the World entry; no new
// entry needed there, reused as-is. Every prior package's icon
// entries are unchanged. No prop added, removed, or renamed on
// CreatorStopsView itself.
// v6 to v7 (23 Aug 2026, build-0823 pass 5, RULED, shell
// conformance): MAJOR (a prop is removed). CreatorStopsView gains
// `closeAriaLabel` (string, default "Close character creator",
// additive): each of the four modals now passes its own creator
// name instead of the prior hardcoded Character-only string, fixing
// the mislabeled close control on World/Look/Story. `onSaveAndOpenEditor`
// is REMOVED: the last-stop footer's "Save and open the advanced
// editor" button duplicated "Finish and save" (both called the same
// handler) and is dropped, keeping the footer to two actions.
// `onContinueInEditor`'s saved-state button relabels "Keep editing"
// to "Open in advanced editor" (same handler, already routes to
// /studio/v2/editor/{id}); no signature change. The panel surface
// moves onto `--grad-panel-lift` (B3); the header/footer hairlines
// move onto `--line-fade`; "Unsaved changes" loses its `hidden
// sm:inline` gate and renders at every width; under 700px the panel
// is a full-height sheet (R4), full-bleed vertically and
// horizontally with internal thumb scrolling, replacing the prior
// inset-floating panel at phone width.
export const CREATOR_STOPS_VIEW_CONTRACT_VERSION = "creator-stops.view.v7";

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
