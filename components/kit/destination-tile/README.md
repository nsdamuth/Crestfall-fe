# Kit Destination Tile LOOM Package

**Contract:** `KitDestinationTile.contract.js` (v1.0.0)

## Purpose

The Home destination tile: a compact picture tile carrying a section
name and one short supporting line, routing outward on tap. Ruled
10 Aug 2026 as OPEN item 37's option A
(`docs/SPRINT-G-PLAN.md`): "a new kit package, built once," consumed
eight times by Home, one tile per non-Home section (Stories,
Adventures, Studio, Images, Vault, Community, Creators, Lore). Home
itself is not built by this package; this is the tile only.

## Boundary

```text
KitDestinationTile.jsx
  -> useKitDestinationTileViewModel.js
  -> KitDestinationTile.view.jsx
```

- The ViewModel normalizes `label` and `supportingLine` to strings,
  `imageSrc` to a string-or-null, and defends `onOpen` to
  function-or-null.
- The View is presentation only: no `useEffect`, no fetch, no router.
  It renders one tappable surface; the caller (Home) supplies the
  navigation callback.
- The caller owns all data (which eight sections, their art, their
  copy) and where `onOpen` routes.

## Card law inheritance

- **Art anchor**: `object-position: center 18%`, the same anchor as
  `creation-card` (`docs/BUILD-BLUEPRINT.md` 2.6 second revision),
  keeping the primary subject in frame on a cropped tile.
- **No-art fallback**: `--surface-2`, matching the creation-card
  no-art rule and `docs/CRESTFALL-DESIGN-CONTEXT.md`'s card law
  ("any kit card surface without art sits on the lighter elevated
  surface token").
- **Corner tier**: STANDARD, `--radius-md`, the grid-sibling tier
  (`docs/DESIGN-TOKENS.md` "Spacing, radius, sizing"). The tile is a
  grid sibling in Home's eight-tile block, never a floating or
  full-width surface.
- **Over-art text**: title `--art-ink`, supporting line
  `--art-ink-dim`, the only two colors legal over artwork.

## Not inherited from creation-card

No overlay actions (like, save, expand): the tile is a single
navigation surface, not an asset card with per-card reactions. No
badges, no stats. The whole tile is the tap target.

## Aspect ratio, package-local, not previously ruled

`aspect-[4/3]`, chosen to read as a compact landscape tile distinct
from the portrait (`3/4`) creation-card. This is a build-time choice
inside the option-A ruling's "compact picture tile" description, not
a separate ruling; if Brian wants a different proportion at the Home
render gate, this is a one-line change confined to this package.

## New tokens

None. Uses `--surface-2`, `--line`, `--radius-md`, `--art-ink`,
`--art-ink-dim`, `--text-lead`/`--lh-lead`, `--text-label`/`--lh-label`,
`--space-1/2/3/8`, `--glow-hover`, `--dur-hover`, and `kit-focus`, all
already locked.

## Package assets

- `KitDestinationTile.contract.js`
- `KitDestinationTile.fixtures.js` (all eight Home-set sections with
  art, one no-art fallback, one longest label, one longest supporting
  line)
- `useKitDestinationTileViewModel.js`
- `/dev/ui-preview/kit-destination-tile`

Fixture-only; `onOpen` is a no-op in every fixture and in the preview.
