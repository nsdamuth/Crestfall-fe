# Kit Promo Banner LOOM Package

**Contract:** `KitPromoBanner.contract.js` (v1.1.0)

## Hierarchy law (9 Aug 2026, kit revision)

`docs/BUILD-BLUEPRINT.md` 2.16(f): one primary CTA emphasized, the
description de-emphasized (`--art-ink-dim`, 30rem measure cap) and
the stack spaced on the ladder (`--space-2` inside the copy block,
`--space-4` before the CTA, `--space-8` body padding at 700px and
up). One decision per banner: a single primary button, never two.
The `top` treatment accepts `showGalaxy`, layering the existing
`.cf-galaxy` starfield (`--atm-constellation`, `--anim-galaxy`,
`--anim-twinkle`, reduced-motion safe) between the art and the veil.
At phone widths every treatment relaxes to `aspect-[4/3]` so copy
never crowds at 390.

## Purpose

The three ruled banner treatments, finalized in
`docs/BUILD-BLUEPRINT.md` section 2.3 (RULED 9 Aug 2026): `top` (fade
from the bottom, copy bottom-left), `card` (fade from the left, copy
bottom-left), `bottom` (uniform screen by default, copy centered,
with a `bottom-fade` sub-variant for a render sitting). No fourth
treatment, no per-instance veil or copy-anchor settings.

## Boundary

```text
KitPromoBanner.jsx
  -> useKitPromoBannerViewModel.js
  -> KitPromoBanner.view.jsx
```

- The ViewModel validates `treatment` and `bottomVariant` against
  their constrained sets.
- The portable View owns the veil recipe and copy position per
  treatment; nothing about veil direction or copy anchor is
  configurable through props beyond selecting the treatment itself.
- The caller owns what page the banner sells and where its CTA
  navigates; it reports intent through `onCtaClick` only.

## Flagged, not copied

The legacy proof's `.continuecard`/`.endcap` set banner height with a
raw `min-height` in rem (`16rem`, `20rem`), a value with no ladder
step at that scale. This package uses `aspect-ratio` instead
(`21/9` for `top`/`bottom`, `16/9` for `card`), an intrinsic
proportion rather than a magnitude, avoiding the gap rather than
copying the literal. The line's `max-w-[30rem]` is carried over from
the same proof recipe and has no clean token mapping either; flagged
here rather than silently treated as ruled.

## Corner tier note

`top` and `bottom` are full-content-width surfaces (LARGE tier,
`--radius-lg`). `card` is an in-flow banner card sitting alongside
siblings (STANDARD tier, `--radius-md`), per the corners final ruling
naming "the continue card, and the in-flow banner card" under
STANDARD explicitly. This is not a visual accident; get the tier wrong
and the corner law is violated.

## States

The banner surface is REST only. The CTA (`cf-btn cf-btn--primary`)
carries all five states.

## Package assets

- `KitPromoBanner.contract.js`
- `KitPromoBanner.fixtures.js`
- `useKitPromoBannerViewModel.js`
- `/dev/ui-preview/kit-promo-banner`

The preview renders all three treatments, including both `bottom`
sub-variants side by side for Brian's ruling.
