# Media Lightbox

## Purpose

Provides the shared full-screen media viewer used by Creation profiles, Image
Studio history, and Creation image libraries while separating media identity,
browser orchestration, details/report clients, and deletion rules from the
portable Skin.

## Feature structure

```text
MediaLightbox.jsx
media-lightbox/
  MediaLightbox.view.jsx
  useMediaLightboxViewModel.js
  MediaLightbox.contract.js
  MediaLightbox.fixtures.js
  mediaLightboxDiagnostics.mjs
  README.md
```

`MediaLightbox.jsx` remains the existing Binding Shell and injects Next.js
`Link` into the View.

## Chassis ownership

The ViewModel owns:

- legacy media ID, URL, thumbnail, title, and output-ID aliases
- active-media resolution
- local or parent-owned Like and Bookmark behavior
- browser sharing and clipboard fallback
- deletion confirmation and callback payloads
- image-details loading
- moderation-report submission
- details/report dialog state and active-item reset behavior

## Portable Skin ownership

The View owns the full-screen layout, desktop/mobile thumbnail rails, media
presentation, action buttons, details and report dialogs, and accessibility
labels. It does not import a Crestfall client, use Next.js routing directly, or
interpret raw image-generation payloads.

## Shared consumers

- Creation Profile Page
- Image Studio Media History
- Creation Image Library

## Isolated preview

```text
/dev/ui-preview/media-lightbox
```

The preview is unavailable in production. Details and Report still use the
normal application clients when selected because the public Binding Shell is
being exercised.

Mechanics Module field decomposition remains deferred until the final
cumulative LOOM reassessment.
