# Contrast matrix, wave X1

Generated 12 Aug 2026 for the Fable Gate 2 Contrast Law
(`docs/plans/FABLE-GATE-2-STUDIO.md`, ruling N6, ratified option A).
Every locked ink, gold, and status token in `docs/DESIGN-TOKENS.md`
computed as WCAG 2 relative-luminance contrast against every locked
surface token, dark theme (the theme the draft Contrast Law and
ruling N6 were computed against). Method: sRGB relative luminance per
`app/theme.css` hex values, contrast = (L1+0.05)/(L2+0.05), no
rounding before the PASS/FAIL cut (a computed 4.497:1 is FAIL at
4.5, not a rounding pass). Generated artifact, not hand-maintained;
regenerate from `app/theme.css` if a locked value ever changes.

`--tag-fill-ink` is included for completeness because it is a locked
ink-family token, but its ruled role (`docs/DESIGN-TOKENS.md`) is
text sitting ON a gold fill, never against a canvas/surface token
directly; its FAIL rows below are expected and out of scope, not a
product defect.

## Full matrix

| Token | Surface | Ratio | 4.5:1 | 3:1 |
|---|---|---|---|---|
| `--ink` | `--canvas` | 16.24:1 | PASS | PASS |
| `--ink` | `--surface-1` | 15.02:1 | PASS | PASS |
| `--ink` | `--surface-2` | 14.07:1 | PASS | PASS |
| `--ink` | `--surface-3` | 13.03:1 | PASS | PASS |
| `--ink` | `--surface-4` | 12.03:1 | PASS | PASS |
| `--ink` | `--surface-footer` | 15.00:1 | PASS | PASS |
| `--ink-dim` | `--canvas` | 7.90:1 | PASS | PASS |
| `--ink-dim` | `--surface-1` | 7.30:1 | PASS | PASS |
| `--ink-dim` | `--surface-2` | 6.84:1 | PASS | PASS |
| `--ink-dim` | `--surface-3` | 6.33:1 | PASS | PASS |
| `--ink-dim` | `--surface-4` | 5.85:1 | PASS | PASS |
| `--ink-dim` | `--surface-footer` | 7.30:1 | PASS | PASS |
| `--ink-faint` | `--canvas` | 5.53:1 | PASS | PASS |
| `--ink-faint` | `--surface-1` | 5.11:1 | PASS | PASS |
| `--ink-faint` | `--surface-2` | 4.79:1 | PASS | PASS |
| `--ink-faint` | `--surface-3` | 4.43:1 | FAIL | PASS |
| `--ink-faint` | `--surface-4` | 4.09:1 | FAIL | PASS |
| `--ink-faint` | `--surface-footer` | 5.10:1 | PASS | PASS |
| `--gold-action` | `--canvas` | 9.69:1 | PASS | PASS |
| `--gold-action` | `--surface-1` | 8.95:1 | PASS | PASS |
| `--gold-action` | `--surface-2` | 8.39:1 | PASS | PASS |
| `--gold-action` | `--surface-3` | 7.77:1 | PASS | PASS |
| `--gold-action` | `--surface-4` | 7.17:1 | PASS | PASS |
| `--gold-action` | `--surface-footer` | 8.95:1 | PASS | PASS |
| `--gold-ornament` | `--canvas` | 8.86:1 | PASS | PASS |
| `--gold-ornament` | `--surface-1` | 8.19:1 | PASS | PASS |
| `--gold-ornament` | `--surface-2` | 7.67:1 | PASS | PASS |
| `--gold-ornament` | `--surface-3` | 7.11:1 | PASS | PASS |
| `--gold-ornament` | `--surface-4` | 6.56:1 | PASS | PASS |
| `--gold-ornament` | `--surface-footer` | 8.19:1 | PASS | PASS |
| `--gold-bright` | `--canvas` | 13.66:1 | PASS | PASS |
| `--gold-bright` | `--surface-1` | 12.63:1 | PASS | PASS |
| `--gold-bright` | `--surface-2` | 11.83:1 | PASS | PASS |
| `--gold-bright` | `--surface-3` | 10.95:1 | PASS | PASS |
| `--gold-bright` | `--surface-4` | 10.11:1 | PASS | PASS |
| `--gold-bright` | `--surface-footer` | 12.62:1 | PASS | PASS |
| `--gold-deep` | `--canvas` | 4.69:1 | PASS | PASS |
| `--gold-deep` | `--surface-1` | 4.34:1 | FAIL | PASS |
| `--gold-deep` | `--surface-2` | 4.06:1 | FAIL | PASS |
| `--gold-deep` | `--surface-3` | 3.76:1 | FAIL | PASS |
| `--gold-deep` | `--surface-4` | 3.48:1 | FAIL | PASS |
| `--gold-deep` | `--surface-footer` | 4.34:1 | FAIL | PASS |
| `--tag-fill-ink` | `--canvas` | 1.10:1 | FAIL | FAIL |
| `--tag-fill-ink` | `--surface-1` | 1.02:1 | FAIL | FAIL |
| `--tag-fill-ink` | `--surface-2` | 1.05:1 | FAIL | FAIL |
| `--tag-fill-ink` | `--surface-3` | 1.13:1 | FAIL | FAIL |
| `--tag-fill-ink` | `--surface-4` | 1.23:1 | FAIL | FAIL |
| `--tag-fill-ink` | `--surface-footer` | 1.02:1 | FAIL | FAIL |
| `--status-success` | `--canvas` | 6.46:1 | PASS | PASS |
| `--status-success` | `--surface-1` | 5.97:1 | PASS | PASS |
| `--status-success` | `--surface-2` | 5.59:1 | PASS | PASS |
| `--status-success` | `--surface-3` | 5.18:1 | PASS | PASS |
| `--status-success` | `--surface-4` | 4.78:1 | PASS | PASS |
| `--status-success` | `--surface-footer` | 5.96:1 | PASS | PASS |
| `--status-warning` | `--canvas` | 6.07:1 | PASS | PASS |
| `--status-warning` | `--surface-1` | 5.61:1 | PASS | PASS |
| `--status-warning` | `--surface-2` | 5.26:1 | PASS | PASS |
| `--status-warning` | `--surface-3` | 4.87:1 | PASS | PASS |
| `--status-warning` | `--surface-4` | 4.50:1 (4.497 unrounded) | FAIL | PASS |
| `--status-warning` | `--surface-footer` | 5.61:1 | PASS | PASS |
| `--status-danger` | `--canvas` | 4.95:1 | PASS | PASS |
| `--status-danger` | `--surface-1` | 4.57:1 | PASS | PASS |
| `--status-danger` | `--surface-2` | 4.28:1 | FAIL | PASS |
| `--status-danger` | `--surface-3` | 3.97:1 | FAIL | PASS |
| `--status-danger` | `--surface-4` | 3.66:1 | FAIL | PASS |
| `--status-danger` | `--surface-footer` | 4.57:1 | PASS | PASS |

## Findings summary

Ratified and resolved by N6 (this wave):

- `--ink-faint` on `--surface-4`: 4.09:1, FAILS 4.5. Resolution:
  illegal for normal-size meaningful text there; `--ink-dim` used
  instead (5.85:1, PASS). `--ink-faint` stays legal on `--surface-1`
  (5.11:1) and `--surface-2` (4.79:1), and at any surface for large
  text (>=24px / >=18.66px bold, 3:1 threshold, which it clears
  everywhere).

Found by this matrix, NOT covered by N6's text (open, no ruling
authored here; STOP items, reported not resolved):

- `--ink-faint` on `--surface-3`: 4.43:1, FAILS 4.5. N6's text names
  only `--surface-4`. Whether the same dim-substitution applies to
  `--surface-3` is unruled.
- `--gold-deep` on every surface except `--canvas`: 4.34/4.06/3.76/
  3.48:1, all FAIL 4.5 (3.48 also fails 3:1 boundary math but
  `--gold-deep`'s ruled role is "pressed states; borders," not body
  text, so the 4.5 text threshold may not be the applicable test).
- `--status-warning` on `--surface-4`: 4.497:1 unrounded, FAILS 4.5.
- `--status-danger` on `--surface-2`/`--surface-3`/`--surface-4`:
  4.28/3.97/3.66:1, all FAIL 4.5.
- `--tag-fill-ink` against every surface: FAILS both thresholds
  everywhere, but its ruled role restricts it to text on a gold
  fill, never directly against a canvas/surface token, so these rows
  are expected and out of this law's scope.

These open items are not decided by this wave. X1 lands only the N6
pairing law above; the rest are reported to Brian as items needing
their own ruling before any sweep treats them as legal or illegal.
