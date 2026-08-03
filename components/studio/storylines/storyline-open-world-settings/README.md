# Storyline Open-World Settings LOOM bundle

This bundle converts `StorylineOpenWorldSettings` into the Crestfall LOOM
Chassis / Skin pattern.

- `StorylineOpenWorldSettings.jsx` is the thin application Binding Shell.
- `useStorylineOpenWorldSettingsViewModel.js` is the Chassis. It owns
  `normalizeStorylineData`, transition-policy filtering and labels, immutable
  `openWorld` merging, and returning the complete normalized Storyline payload.
- `StorylineOpenWorldSettings.view.jsx` is the Portable Skin. It receives
  display-ready copy, transition options, values, and semantic callbacks only.
- The contract and fixtures document the portable interface and representative
  configured, default, and legacy inputs.
- `/dev/ui-preview/storyline-open-world-settings` is development-only.

Preserved behavior includes the existing default transition selector, exclusion
of `COMPLETE_STORYLINE` from non-final defaults, immutable continuity settings,
open-world guidance, pressure-cadence guidance, and the existing `data` /
`onChange` public API used by Storyline Create and Creation Edit.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
