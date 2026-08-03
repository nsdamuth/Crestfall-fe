# Creation Featured Image Picker

Loom-separated modal for selecting one eligible image-library entry as a
creation's featured image.

## Structure

- `../CreationFeaturedImagePickerModal.jsx`: binding Shell preserving the existing public import path.
- `CreationFeaturedImagePickerModal.view.jsx`: portable, API-free presentation.
- `useCreationFeaturedImagePickerViewModel.js`: image loading, eligibility filtering, normalization, pagination, and save orchestration.
- `CreationFeaturedImagePickerModal.contract.js`: versioned semantic View boundary.
- `CreationFeaturedImagePickerModal.fixtures.js`: isolated visual states.
- `app/dev/ui-preview/creation-featured-image-picker/`: development-only fixture preview.

## Boundary

The View receives display-ready cards and emits `onChooseImage(imageId)`. It
does not know API response shapes, image-library storage fields, eligibility
rules, creation IDs, slot keys, or persistence behavior.

The ViewModel preserves the Crestfall path through the existing client API
module and frontend API proxy. The parent continues to receive the original
`onSelected({ slotKey, slotLabel, image })` callback payload.
