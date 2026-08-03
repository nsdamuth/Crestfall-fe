# Default Player Character Picker

Loom-separated modal for choosing one owned Player Character for an existing
Crestfall workflow.

## Structure

- `../DefaultPlayerCharacterPickerModal.jsx`: binding Shell preserving the existing public import path.
- `DefaultPlayerCharacterPickerModal.view.jsx`: portable, API-free presentation.
- `useDefaultPlayerCharacterPickerViewModel.js`: loading, search, creation normalization, image fallback, and parent selection orchestration.
- `DefaultPlayerCharacterPickerModal.contract.js`: versioned semantic View boundary.
- `DefaultPlayerCharacterPickerModal.fixtures.js`: isolated visual states.
- `app/dev/ui-preview/default-player-character-picker/`: development-only fixture preview.

## Boundary

The View receives display-ready Player Character cards and emits
`onChoosePlayerCharacter(playerCharacterId)`. It does not know the
`PLAYER_CHARACTER` creation query, raw creation `data`, featured-media fallback
rules, profile storage fields, story-room mutation behavior, or the payload
shape expected by existing parents.

The ViewModel continues to use the existing Crestfall client API module and
preserves the existing public `onSelect(playerCharacter)` callback payload:

```text
{
  id,
  title,
  description,
  visibility,
  status,
  content_rating,
  imageUrl
}
```

## Existing live consumers

- `components/studio/account/StudioAccountProfile.jsx`
- `components/studio/story-rooms/StoryRoomCastPanel.jsx`

Neither consumer needs to change for this Loom conversion.
