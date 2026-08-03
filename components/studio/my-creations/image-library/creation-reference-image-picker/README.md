# Creation Reference Image Picker

## Purpose

Allows a Crestfall creation workflow to choose an eligible image-library
output as a semantic visual reference while keeping presentation independent
from image-library and form-storage behavior.

## Feature structure

```text
CreationReferenceImagePickerModal.jsx
creation-reference-image-picker/
  CreationReferenceImagePickerModal.view.jsx
  useCreationReferenceImagePickerViewModel.js
  CreationReferenceImagePickerModal.contract.js
  CreationReferenceImagePickerModal.fixtures.js
  README.md
```

The existing `CreationReferenceImagePickerModal.jsx` import path remains the
Binding Shell.

## Public application props

```text
creationId
referenceLabel
onClose()
onSelected({ image, imageOutputId })
```

The Shell and ViewModel preserve this existing application-facing contract.
The portable View does not receive a creation ID, raw image-library payload,
or storage field name.

## View ownership

The View owns:

- modal structure and responsive image grid
- headings, copy, loading, error, empty, and unavailable-preview states
- refresh, close, load-more, and image-choice controls
- display-ready image URLs, alternative text, and metadata labels

The View does not:

- call APIs or import Crestfall client modules
- load a creation or its image library
- evaluate image eligibility or visibility
- normalize output-ID or URL field variants
- know visual-reference JSONB fields
- update or save a creation

## ViewModel ownership

The ViewModel:

- loads the creation image library through the existing image-library ViewModel
- preserves the existing visible-image pagination behavior
- filters eligible images with usable output IDs
- normalizes display URLs and metadata labels for the View
- translates a semantic View selection back to the existing raw-image callback

## Isolated preview

```text
/dev/ui-preview/creation-reference-image-picker
```

The route is unavailable in production and does not authenticate, call an API,
load a creation, or persist a reference.
