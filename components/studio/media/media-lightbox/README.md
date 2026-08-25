# Media Lightbox

## Purpose

Provides the shared full-screen media viewer used by Creation profiles, Image
Studio history, and Creation image libraries while separating media identity,
browser orchestration, details/report clients, and deletion rules from the
portable Skin.

## BREAKING CHANGE, v2.0.0, RULED 22 Aug 2026 (ED1G sw12, Brian ruling 4)

v1.1.0 shipped a prop removal (`onDelete`) as an additive minor bump;
SOP section 5 classes removals as breaking. Reissued honestly as
2.0.0 with no further prop-surface change from 1.1.0. Any consumer
still passing `onDelete` must migrate to `onRequestDelete` /
`onCancelDelete` / `onConfirmDelete`.

## B7 viewer final, RULED 22 Aug 2026 (Fable law review, ED1F propagation plan group G3)

Contract bump 1.0.0 to 1.1.0 (superseded by the 2.0.0 breaking
reissue above). Supersedes the prior two-sidebar layout
(a left thumbnail rail plus a right "Actions" panel) with the B7
column shared with `KitImageOverlay` (`components/kit/image-overlay`):
a lawful 2px veil at `--chrome-wash`, a two-line glass header
(`--panel-glass`, centered title, then the six-icon row: delete,
report, details, download, bookmark, like), the image, a gold-ink
bottom bar (Generate Variant, Reassign Asset, Share), and the
thumbnail strip beneath it when more than one item is open. This
surface does not compose `KitModalFrame`, so the veil and the
close control (outside top-right on desktop, a floating 44px glass
control bottom-right at 390) are owned directly in this package's own
View, unlike `KitImageOverlay`'s cross-boundary note. Delete moves
from `window.confirm` to the package's own B5 danger-confirm panel,
current permanent-delete copy; CR-054 recovery remains separate; the ViewModel now owns
`deleteConfirmOpen` state and exposes `onRequestDelete` /
`onCancelDelete` / `onConfirmDelete` in place of the old `onDelete`.
Reassign Asset is live when an eligible owned source image is supplied; otherwise the action remains disabled.

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
- deletion confirmation (`deleteConfirmOpen` state) and callback payloads
- image-details loading
- moderation-report submission
- details/report/delete-confirm dialog state and active-item reset behavior

## Portable Skin ownership

The View owns the full-screen layout, the B7 glass header and bottom bar, the
thumbnail strip, media presentation, action buttons, the B5 delete-confirm
panel, details and report dialogs, and accessibility labels. It does not
import a Crestfall client, use Next.js routing directly, or interpret raw
image-generation payloads.

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
