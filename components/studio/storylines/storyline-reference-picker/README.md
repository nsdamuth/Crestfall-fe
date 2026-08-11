# Storyline Reference Picker LOOM bundle

This bundle converts `StorylineReferencePickerModal` into the Crestfall LOOM
Chassis / Skin pattern.

- `StorylineReferencePickerModal.jsx` is the thin application Binding Shell. It
  wires the ViewModel straight to the View; no portal binding of its own.
- `useStorylineReferencePickerViewModel.js` is the Chassis. It owns tab/query
  state, normalization, filtering, selected-reference protection, and
  returning the original selected reference object.
- `StorylineReferencePickerModal.view.jsx` is the Portable Skin. It composes
  `KitModalFrame` (`components/kit/KitModalFrame`) rather than a bespoke
  overlay, receiving display-ready tabs/items and semantic callbacks only.
- The contract and fixtures document the portable interface.
- `/dev/ui-preview/storyline-reference-picker` is development-only.

NESTED MODAL LAW (docs/BUILD-BLUEPRINT.md, the R1 credits pattern,
generalized 10 Aug 2026): this picker opens from inside the Adventures
"Build an Adventure" modal (`StorylineBuilderShell`, itself on `KitModalFrame`).
It now opens on the same `KitModalFrame` branding as the modal beneath it
(portal, Escape, backdrop dismiss, and body-scroll lock are all inherited
from `KitModalFrame`/`ModalShell`, not reimplemented here), stays scrollable,
and carries an explicit "Back to Storyline" control at the top of the panel
so the return path is never just an anonymous close icon.

Preserved behavior includes the Story/Scenario tabs, query filtering, selected
reference disabling, Escape-to-close, body scroll restoration, and the
existing `stories`, `scenarios`, `selectedReferenceIds`, `onSelect`, and
`onClose` public API.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
