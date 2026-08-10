# Kit Credits LOOM Package

**Contract:** `KitCredits.contract.js` (`1.0.0`)

## Purpose

Attribution (R11, `docs/SPRINT-A-POLISH-PLAN.md` section 5), ported
from the old-design credits panel
(`components/studio/creations/creation-credits/`, read-only
reference, never edited) onto current tokens. Renders the same
"{kindLabel} from {handle}" rows, with the handle linked when an
href exists, plus an optional dim asset-title line.

## Boundary

```text
KitCredits.jsx
  -> useKitCreditsViewModel.js
  -> KitCredits.view.jsx
```

`KitCredits.jsx` injects `next/link` as `LinkComponent`, exactly as
the old package does.

## Anatomy

`--surface-1` bed, `1px --line` border, `--radius-md`,
`p-[var(--space-4)]`. Gold "Credits" label, plain uppercase, no rule
mark and no divider (a panel label carries no mark; it is neither of
the R7 section-label scopes). Rows `grid gap-[var(--space-3)]`, each
"{kindLabel} from {handle}" at `--text-ui` `--ink-dim`, handle in
`--ink` hover `--gold-ornament` when linked, plus an optional
`--ink-faint` asset-title line.

**Empty list renders null**, never the old design's literal `0`
text-node bug (`CreationPreviewModal.view.jsx` line 411:
`{credits.length && CreditsComponent ? ...}`). The old design is not
touched; this package fixes the bug by never copying it.

## Where handles route

Handles link to the LIVE old-design profile route
`/studio/profile/[username]`, exactly where the old design routes
credit handles today. Under the strangler pattern, old pages stay
routable; inventing a v2 profile destination is Creators-page future
work, not this package's job. This cross-design link is deliberate.

## Package assets

- `KitCredits.contract.js`
- `KitCredits.fixtures.js` (mixed, allLinked, unlinkedHandle,
  noAssetTitle, longestContent, empty)
- `useKitCreditsViewModel.js`
- `/dev/ui-preview/kit-credits`

Fixture-only; no query, persistence, or navigation is wired.
