# Visual References Section

## Portable LOOM boundary

```text
VisualReferencesSection.jsx                       Binding Shell
        ↓
useVisualReferencesSectionViewModel.js             ViewModel / Chassis
        ↓
VisualReferencesSection.view.jsx                   Portable View / Skin
```

The portable View owns the two reference cards, empty and error presentation, image previews, refresh control, and the application-owned picker slot.

The ViewModel owns:

- loading the creation image library through the existing image-library ViewModel;
- normalizing legacy image-output and display-URL shapes;
- reading and updating the stored `visual_references` object;
- mapping the anime and realistic reference buckets;
- picker state and selected-image handling;
- semantic card labels, empty messages, and callbacks.

The Binding Shell owns `CreationReferenceImagePickerModal`. The portable View does not import the picker, image-library hook, creation form, or persistence callback.

## Stored fields preserved

The conversion preserves:

```text
creation.data.visual_references.anime_image_output_id
creation.data.visual_references.realistic_image_output_id
```

Clearing a reference continues to store `null` for that field while preserving the other reference value.

## Development preview

```text
/dev/ui-preview/visual-references-section
```

The preview renders assigned, empty, unavailable-preview, error, and missing-callback states without loading a real creation image library.
