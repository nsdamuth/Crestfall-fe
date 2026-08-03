# Storyline Reference Picker LOOM bundle

This bundle converts `StorylineReferencePickerModal` into the Crestfall LOOM
Chassis / Skin pattern.

- `StorylineReferencePickerModal.jsx` is the thin application Binding Shell. It
  owns the React DOM portal binding.
- `useStorylineReferencePickerViewModel.js` is the Chassis. It owns portal
  lifecycle, body-scroll locking, Escape dismissal, tab/query state,
  normalization, filtering, selected-reference protection, and returning the
  original selected reference object.
- `StorylineReferencePickerModal.view.jsx` is the Portable Skin. It receives
  display-ready tabs/items and semantic callbacks only.
- The contract and fixtures document the portable interface.
- `/dev/ui-preview/storyline-reference-picker` is development-only.

Preserved behavior includes the Story/Scenario tabs, query filtering, selected
reference disabling, portal z-index, Escape-to-close, body scroll restoration,
and the existing `stories`, `scenarios`, `selectedReferenceIds`, `onSelect`, and
`onClose` public API.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
