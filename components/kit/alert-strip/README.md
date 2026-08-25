# Kit Alert Strip LOOM Package

**Contract:** `KitAlertStrip.contract.js`

## Purpose

The full-width in-flow notice strip ruled by
`docs/BUILD-BLUEPRINT.md` 2.11: exactly four tones, every tone
shipping its own word (the status usage law forbids signaling by
color alone). Neutral IS the info tone; no info color exists and
none is minted. The neutral bed (`--fill-whisper`, `1px --line`)
matches the proof's one sanctioned explainer container, the
`.stripinfo` strip in `create-hub.html`.

## Boundary

```text
KitAlertStrip.jsx
  -> useKitAlertStripViewModel.js
  -> KitAlertStrip.view.jsx
```

- The View renders the tone it is given; it never decides when an
  alert should show or what triggered it. That judgment belongs to
  the consuming page or form.
- The optional inline action and the optional dismiss control are
  each fully absent (not just disabled) when their handler prop is
  omitted.

## Tones

- **success:** `--status-success-bed` bed, `--status-success-border`
  border, `--status-success` icon and lead word, `--ink` body.
- **warning:** the warning triad, same shape. Reserved: used only
  where no other signal works.
- **danger:** the danger triad, same shape.
- **neutral:** ink family text on `--fill-whisper` with a `1px
  --line` border, `--gold-ornament` icon (the proof's gold-ornament
  icon witness).

## States

The strip itself is REST only. The inline action is a text button
carrying rest, hover (tone-tinted), focus, pressed, and no disabled
state (it is absent, not disabled, when it has no handler). The
dismiss control is an icon button with the same five-state shape.

## Package assets

- `KitAlertStrip.contract.js`
- `KitAlertStrip.fixtures.js`
- `useKitAlertStripViewModel.js`
- `/dev/ui-preview/kit-alert-strip`

Fixture-only; no query, persistence, or navigation is wired.
