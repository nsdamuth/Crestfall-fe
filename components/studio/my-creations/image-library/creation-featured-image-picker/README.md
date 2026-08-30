# Creation Featured Image Picker

Loom-separated modal for selecting either an eligible creation image-library
entry or an explicit Crestfall Stock asset as a creation's featured image.

## Structure

- `../CreationFeaturedImagePickerModal.jsx`: binding Shell preserving the existing public import path.
- `CreationFeaturedImagePickerModal.view.jsx`: portable, API-free presentation.
- `useCreationFeaturedImagePickerViewModel.js`: image loading, eligibility filtering, normalization, pagination, and save orchestration.
- `CreationFeaturedImagePickerModal.contract.js`: versioned semantic View boundary.
- `CreationFeaturedImagePickerModal.fixtures.js`: isolated visual states.
- `app/dev/ui-preview/creation-featured-image-picker/`: development-only fixture preview.

## Boundary

The View receives display-ready source tabs and cards and emits semantic source
and image-selection actions. It does not know API response shapes, image-library
storage fields, stock persistence fields, eligibility rules, creation IDs, slot
keys, or persistence behavior.

The ViewModel preserves the Crestfall path through the existing client API
module and frontend API proxy. `Your Images` continues to use the creation-owned
image-library slot contract. `Crestfall Stock` uses the dedicated stock-media
slot boundary, so choosing stock artwork is always explicit and never recreates
automatic fallback behavior. The parent continues to receive the original
`onSelected({ slotKey, slotLabel, image })` callback payload.

## Crestfall Stock browse controls

The Stock source is metadata-driven and scales beyond the initial retained V1
cover set. The ViewModel exposes title/tag/use search, category filters,
orientation labels, descriptions, result counts, and local paging. The View
renders only display-ready browse controls and never interprets stock API
payloads directly. Choosing Stock remains an explicit creator action; these
assets never become automatic creation fallbacks.


## Current selection awareness

The picker derives the active slot selection from the existing image-library
response. An explicit Crestfall Stock override takes precedence over any older
library slot record. The modal opens on the source that currently owns the
slot, promotes that image into the first visible page, and marks it as Selected.
Re-selecting the same image is a no-op rather than another persistence write.
This is presentation/ViewModel state only; no additional Services contract is
required.
