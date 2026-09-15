# KitNotice

The shared confirmation-note kit piece (ASSET-FOLDERS plan, package
AF1, 14 Sep 2026). One transient line confirming that a mutation
happened: create, rename, move, add, remove, or delete (R5 of the
Folders brief, every one of those six actions shows a confirmation
note). Contract 1.0.0.

## What it shows

- One line, `role="status"`, two tones only: `neutral` (create,
  rename, move, add, remove) and `danger` (delete). No third tone.
- An optional 44px dismiss control at the right edge.
- An empty `message` renders nothing; the note never shows an empty
  shell.

## Width

`w-full max-w-[28rem] mx-auto`, one class pair, no media query: the
note fills its container inside the page's own `--space-5` gutter at
390, and once the container is wide enough to show the gap (1440, the
page column) it centers and caps at a fixed width. Radius is
`--radius-lg`, the tier for a full-width, floating surface.

## Boundary

```text
AF5 (Media) / AF6 (Vault), out of this package's scope
  -> KitNotice (Binding Shell, components/kit/KitNotice.jsx)
       -> useKitNoticeViewModel     message/tone/onDismiss normalization
       -> useKitNoticeAutoClear     the 1600ms auto-clear hook, unwired here
       -> KitNotice.view.jsx        presentation only
```

## Timing

`useKitNoticeAutoClear`, exported from `useKitNoticeViewModel.js`,
holds one message for `NOTICE_AUTO_CLEAR_MS` (1600ms) then clears
itself, matching `components/kit/share/useKitShareController.js:18`
(`STATUS_RESET_MS`), so a folder confirmation and the share sheet's
"Link copied" line read at the same pace. Calling `show()` again while
a timer is running resets the window rather than stacking a second
note; no stacking is in contract.

## Mounting

```jsx
const notice = useKitNoticeAutoClear();
// notice.show("Folder created.")
<KitNotice message={notice.message} tone="neutral" onDismiss={notice.clear} />
```

## Fixtures

default, long, empty. `kitNoticeDiagnostics.mjs` asserts the tone
fold, the ViewModel normalization, the 1600ms window, the three named
fixture states, and that the View carries no state, no raw literal,
and the width/radius/token rules
(`node --test components/kit/notice/kitNoticeDiagnostics.mjs`).

## Out of scope

Stacking more than one note, undo, an icon set, and any page wiring
(AF5 and AF6 mount and time this piece on Media and Vault).
