# Item Starting Assignment Editor LOOM bundle

This bundle converts `ItemStartingAssignmentEditor` into the Crestfall LOOM
Chassis / Skin pattern.

- `ItemStartingAssignmentEditor.jsx` is the thin application Binding Shell. It
  owns the application `RegistryLinkedCreationPickerModal` slot.
- `useItemStartingAssignmentEditorViewModel.js` is the Chassis. It owns Item
  starting-assignment normalization, legacy JSONB aliases, holder options,
  linked-Creation type validation, picker state, nested placement normalization,
  placement ordering, blank-row cleanup, generated placement IDs, and normalized
  `onChange` payloads.
- `ItemStartingAssignmentEditor.view.jsx` is the Portable Skin. It receives
  display-ready holder and placement state, legal options, semantic callbacks,
  and an optional picker slot only.
- The contract and fixtures document unassigned, Story inventory, linked
  Character, and legacy Location inputs.
- `/dev/ui-preview/item-starting-assignment-editor` is development-only and
  uses a local fixture picker rather than loading production Creations.

Preserved storage includes `startingAssignment.holderType`,
`holderCreationId`, `holderCreationType`, `holderTitle`,
`placement.specificity`, `placement.path`, `placement.note`, and the mirrored
legacy `placementNote` field. Existing snake_case aliases and legacy placement
shapes continue to normalize through `itemRegistryUtils.js`.

The public `entry` and `onChange` API used by Item Registry Create and Creation
Edit is unchanged. The editor does not fetch or persist; its application picker
continues to own Creation loading and selection.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
