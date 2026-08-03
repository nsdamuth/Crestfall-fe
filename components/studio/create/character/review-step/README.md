# Character Review Step LOOM package

This package separates the Character Creator review surface into the standard Crestfall LOOM boundary.

## Boundary

- `../ReviewStep.jsx` is the thin Binding Shell. It injects the Crestfall-owned `AdvancedPromptingEditor`.
- `useCharacterReviewStepViewModel.js` owns publishing-option projection, adult-age normalization, advanced-field callbacks, Kibbe/color-palette labels, and summary projection.
- `CharacterReviewStep.view.jsx` is the portable Skin. It renders semantic props and the injected advanced-prompting region.
- `CharacterReviewStep.contract.js` and `CharacterReviewStep.fixtures.js` document the versioned view contract and representative states.

## Production integration

The existing Character Creator continues to mount `ReviewStep` at:

```text
/studio/create/character
```

The package preserves these Character draft fields:

```text
visibility
content_rating
rendering_style
age
greeting
scenario
relationship_to_player
backstory
appearance_notes
personality_notes
extra_runtime_notes
creator_directives
```

Age remains optional, but a non-empty numeric value below 18 is normalized to the string `"18"` on blur.

## Development preview

```text
/dev/ui-preview/character-review-step
```

The preview is unavailable in production and uses local fixture state only.

## Focused diagnostics

```bash
npm run diagnostics:loom:character-review-step
```
