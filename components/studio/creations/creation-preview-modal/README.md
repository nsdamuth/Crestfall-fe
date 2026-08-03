# Creation Preview Modal LOOM package

## Boundary

`CreationPreviewModal.jsx` is the Binding Shell. It owns Next.js `Link`, router navigation, `ModalShell`, and the existing Crestfall status, stats, credits, and share components.

`CreationPreviewModal.view.jsx` is the Portable Skin. It renders only display-ready preview state, injected application components, and semantic callbacks.

`useCreationPreviewModalViewModel.js` is the Chassis. It owns:

- Creation title, creator, credits, tag, and route normalization.
- Featured-media alias resolution and the four-image limit.
- Per-Creation carousel position and the final catalogue slide.
- Description truncation at 520 characters.
- Chat-capability and public-share policy projection.
- Story Room creation and navigation orchestration.
- Default Player Character mutation state and feedback.
- Like and Bookmark callback adaptation.

## Preserved behavior

The package preserves Owner, Community/Public, and Picker contexts; edit and catalogue links; one-to-four featured images; the final “Want to see more?” slide; description expansion; status and stats; creator attribution and credits; likes, bookmarks, chat, share, Image Library, and Set Default PC actions; and the existing empty-media fallback.

## Preview

Development only:

`/dev/ui-preview/creation-preview-modal`

## Deferred work

Mechanics Module field decomposition remains deferred until the final cumulative reassessment.
