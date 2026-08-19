# Creation Preview Modal LOOM package

## Boundary

`CreationPreviewModal.jsx` is the Binding Shell. It owns Next.js `Link`, router navigation, `ModalShell`, and the existing Crestfall status, stats, credits, and share components.

`CreationPreviewModal.view.jsx` is the Portable Skin. It renders only display-ready preview state, injected application components, and semantic callbacks.

`useCreationPreviewModalViewModel.js` is a deployment mirror of the
authoritative Crestfall application ViewModel. Application behavior remains
owned by `Crestfall`; the FE repository keeps this mirror synchronized so the
independently deployed Skin app can bind the portable View. It owns:

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

## Story opening Location wiring

`ROOM_TEMPLATE` previews now consume the accepted:

```text
story_start_opening_location.presentation.v1
```

presentation contract.

For `PLAYER_SELECT` Stories, the existing **Chat** action opens the starting
Location picker instead of creating the room immediately. The picker itself is a
portable FE View.

Allowed IDs, authoritative validation, room creation, opening hard-state commit,
and navigation remain Chassis-owned.

The FE `storyRoomClient.js` and Creation Preview application ViewModel are
deployment mirrors for the independently deployed FE app. They are not new
business-logic authority in `Crestfall-fe`.
