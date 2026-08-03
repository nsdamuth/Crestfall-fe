# Storyline Node List Editor LOOM bundle

This bundle converts `StorylineNodeListEditor` into the Crestfall LOOM
Chassis / Skin pattern.

- `StorylineNodeListEditor.jsx` is the thin application Binding Shell. It owns
  the application `StorylineReferencePickerModal` slot.
- `useStorylineNodeListEditorViewModel.js` is the Chassis. It owns Storyline
  normalization, validation, mode resolution, node ordering, reference-node
  creation, trigger creation and mutation, terminal-node policy rules, warning
  filtering, and normalized `onChange` payloads.
- `StorylineNodeListEditor.view.jsx` is the Portable Skin. It receives
  display-ready nodes, legal options, validation messages, semantic callbacks,
  and an optional picker slot only.
- The contract and fixtures document the portable interface and configured,
  empty, and legacy Storyline inputs.
- `/dev/ui-preview/storyline-node-list-editor` is development-only.

Preserved behavior includes `full`, `sequence`, and `transitions` modes; Story
and Scenario reference selection; duplicate protection through the existing
picker; node ordering and deletion; completion guidance; terminal-node locking;
transition descriptions; ANY/ALL trigger modes; trigger editing; open-world and
pressure guidance; validation errors; draft-readiness warnings; and the existing
`data`, `onChange`, `stories`, `scenarios`, `loadError`, and `mode` API used by
Storyline Create and Creation Edit.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
