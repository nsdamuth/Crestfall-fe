# Kit Asset Detail Popup LOOM package

**Contract:** `KitAssetDetailPopup.contract.js` (`1.0.0`)

## Purpose

The destination every `character`, `story`, and `adventure` media card
opens (`docs/BUILD-BLUEPRINT.md` section 2.15, specced 9 Aug 2026,
built this pass per `docs/SPRINT-A-PLAN.md` section 3). Replaces the
Community mockup's marked `AssetDetailPlaceholder`.

## Boundary

```text
KitAssetDetailPopup.jsx
  -> KitModalFrame (components/kit/KitModalFrame.jsx)
  -> useKitAssetDetailPopupViewModel.js
  -> KitAssetDetailPopup.view.jsx
```

The shell composes `KitModalFrame` (`variant="modal"`,
`panelClassName="w-full max-w-xl"`) wrapping the popup's own content
view. The popup renders no close control of its own; the frame owns
dismissal (backdrop click, Escape, close control).

## Anatomy

- **Header**: full-width art-bleed block, `aspect-[5/3]`,
  `object-cover object-[center_18%]`, bottom fade from `--canvas`,
  title over the art in `font-display` at `--text-subhead`, subtitle
  in `--text-ui` `--art-ink-dim`, badge row above the title
  (`surface="art"`).
- **Body**: `p-[var(--space-6)]` content padding, description
  measure-capped, stat row beneath it (same icons and order as the
  card: plays, hearts, saves, followers).
- **Footer**: primary CTA (label derived from `assetKind`: Play for
  character and story, Continue for adventure), Share (icon plus the
  word, Ruling 6), Save (icon plus the word, toggled state reads
  "Saved" with the gold text plus light fill wash per the
  selection-state law, `aria-pressed`).

## Open flags carried to OPEN FOR BRIAN

- Whether `character` and `story` need distinct primary-action copy
  (both read "Play" tonight).
- Whether a Love action belongs on this popup (2.15's footer names
  primary, Share, and Save only; the popup ships without Love while
  the card face and the image overlay both have one).

## Package assets

- `KitAssetDetailPopup.contract.js`
- `KitAssetDetailPopup.fixtures.js`
- `useKitAssetDetailPopupViewModel.js`
- `/dev/ui-preview/kit-asset-detail-popup`

Fixture-only; no query, persistence, or navigation is wired.
