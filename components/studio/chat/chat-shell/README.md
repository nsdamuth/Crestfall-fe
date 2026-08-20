# ChatShell LOOM Package

**Contract:** `ChatShell.contract.js` (v1.1.0)

Wave C5 (`docs/plans/FABLE-GATE-PLAN.md`). Ruling O6 option A ratified 12
Aug 2026: coin chip in the chat header plus fixture-fed upsell sheets
seated on gated actions.

This package is the top-level composition of the entire chat surface. It
does not introduce new interaction logic; it lays out and composes the
already-shipped wave C1-C4 packages (`chat-transcript`, `chat-composer`,
`chat-cast-panel`, which itself composes `chat-npc-manager`,
`chat-state-panel`, `chat-session-dialogs`) and the existing Studio
Economy Widget View into the three-region desktop layout with collapsible
rails and a mobile context header the crestfall-main baseline never had.

## Boundary

```
ChatShell.jsx (components/studio/chat/)
  -> useChatShellViewModel.js
  -> ChatShell.view.jsx
       -> ChatTranscript.view.jsx      (../chat-transcript, unmodified)
       -> ChatComposer.view.jsx        (../chat-composer, unmodified)
       -> ChatCastPanel.view.jsx       (../chat-cast-panel, unmodified)
       -> ChatStatePanel.view.jsx      (../chat-state-panel, unmodified)
       -> ChatSessionDialogs.view.jsx  (../chat-session-dialogs, unmodified)
       -> StudioEconomyWidget.view.jsx (studio-economy-widget, unmodified)
```

None of the composed C1-C4 contracts change in this wave. Every prop
group this package's contract exposes (`transcript`, `composer`,
`castPanel`, `statePanel`, `sessionDialogs`) is a direct, unreshaped
pass-through of that package's own View-contract props.

## Layout

- Desktop (`xl:` and above, 1280px): a three-region row, a 280px cast
  rail on the left, the transcript with a docked composer in the center,
  a 320px state rail on the right. Either rail collapses via a header
  toggle; collapsing hides the rail's desktop `<aside>` only (a
  `xl:hidden` wrapper class), never the sibling package's own mobile
  trigger, and a reveal strip with a chevron takes its place.
- Below `xl:`, the desktop header and both toggle buttons are hidden;
  `chat-cast-panel` and `chat-state-panel` fall back to their own
  already-shipped mobile sheet triggers (KitModalFrame R4/R7), unaffected
  by the desktop rail-collapse state.
- A mobile context header (title, scenario + mode subtitle, status
  pills, coin chip) renders below `xl:` only. The crestfall-main baseline
  had a desktop-only header with no mobile equivalent at all (C1); this
  closes that gap.
- The composer's rendered height is measured with a `ResizeObserver` (the
  one sanctioned presentation-only local state in this View, the same
  precedent as `chat-transcript`'s own internal windowing/scroll state)
  and fed into `chat-transcript`'s `composerHeightPx` prop, so the
  stream's bottom padding always equals the docked composer's real
  height rather than a fixed guess.

## Monetization seats, O6

- **Coin chip:** the header composes `StudioEconomyWidgetView` directly
  (the pure, presentation-only View, not its account-context-reading
  binding) in `layoutMode="mobileHeader"`, fed by this package's own
  `coinChip` prop group. Fixture-first: this package never reads
  `StudioAccountProvider` context itself.
- **Library Pass upsell sheet:** `libraryPassUpsell`, a new
  `KitModalFrame variant="sheet"` composed only in this package, fixture-
  fed, seated on the auto-event media pool gating described in the C1
  baseline inventory ("Library Passes gate auto-event media pools but
  purchase happens on the image-library page"). CR-046 is filed for real
  balance/entitlement data (wave C6).
- Scene Image gating itself is not duplicated here: `chat-composer`
  already shipped its own cost-and-confirm sheet for that moment in wave
  C2 (`sceneImageSeat` / `sceneImageConfirmSheet`); this package passes
  `composer` straight through unchanged.

## Fixtures

13 states in `ChatShell.fixtures.js`: cold open, active session,
streaming, rails collapsed, mobile context header, Report/Export/Share/
Delete-confirm dialogs each open, insufficient coins (Scene Image error
plus the Library Pass upsell sheet open), loading, error, and longest
content. Dialog and panel states are composed from the sibling packages'
own existing fixtures wherever one already fit; nothing was reshaped.

## Package assets

- `ChatShell.contract.js`
- `ChatShell.view.jsx`
- `useChatShellViewModel.js`
- `ChatShell.fixtures.js`
- `README.md`
- Binding shell: `../ChatShell.jsx`
- Preview route: `app/dev/ui-preview/chat-v2-page/**` (this wave's named
  preview address doubles as this package's preview surface, since this
  package is itself the full page composition)

## STOP items, none

Every value used resolves through an existing locked token; no new token
was needed for this package.


## W40 live Story Room coordination

The shell now coordinates the composer's mobile Cast/State actions with the controlled mobile sheets exposed by C3. Desktop rail disclosure remains unchanged; sibling packages still own their sheet presentation.
