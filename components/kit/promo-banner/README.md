# Kit Promo Banner LOOM Package

**Contract:** `KitPromoBanner.contract.js` (v1.3.0)

## Hierarchy law (9 Aug 2026, kit revision)

`docs/BUILD-BLUEPRINT.md` 2.16(f): one primary CTA emphasized, the
description de-emphasized (`--art-ink-dim`, 30rem measure cap) and
the stack spaced on the ladder (`--space-2` inside the copy block,
`--space-4` before the CTA, `--space-8` body padding at 700px and
up). One PRIMARY decision per banner, never two: a single primary
button, `cf-btn--primary`. AMENDED 11 Aug 2026 (v1.2.0): an optional
quiet secondary action may sit beside it, `cf-btn--secondary` (border
only, no fill), visually subordinate and never a second primary; see
Package assets below.
The `top` treatment accepts `showGalaxy`, layering the existing
`.cf-galaxy` starfield (`--atm-constellation`, `--anim-galaxy`,
`--anim-twinkle`, reduced-motion safe) between the art and the veil.
At phone widths `top` and `card` relax to `aspect-[5/3]` so copy never
crowds at 390. `bottom` relaxes to `aspect-[1/1]` (R6, 10 Aug 2026,
kit polish 3 pass: taller than 5/3, more artwork shows, a 67 percent
height increase; desktop `35/12` unchanged). R6 names the bottom
promo banner only; `top` and `card` mobile proportions are untouched.

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
carries all five states. On the `bottom` treatment under 700px the
CTA also carries `cf-btn--banner-cta-compact` (R6, 10 Aug 2026, kit
polish 3 pass): a new `app/design-system.css` modifier, visually
lighter padding and type without dropping below the `--control-md`
touch floor. This is a new sibling class, not an edit to `.cf-btn`
itself; Tailwind utility classes cannot express this override on a
`.cf-btn` element, since `.cf-btn` is unlayered CSS and Tailwind's own
utilities live in a lower-priority cascade layer (confirmed
empirically, phase 4).

## v1.2.0, RULED 11 Aug 2026 (Home continue banner secondary CTA)

Optional `secondaryCtaLabel`/`onSecondaryCtaClick` ADDED, additive.
Renders a `cf-btn cf-btn--secondary` ghost button beside the primary
CTA (border only, no fill), visually subordinate; one primary per
banner still holds. Both buttons resolve to `cf-btn`'s default
`--control-md` height (44px), the mobile law floor. Omitted entirely
on every existing consumer, pixel-stable. First consumer: Home's top
continue banner, filled state only (`app/studio/v2/home/home/
Home.view.jsx`), routing to `/studio/v2/stories`.

## v1.3.0, RULED 11 Aug 2026 (banner-anchor ruling)

Optional `imageAnchor` ADDED, additive. An object-position string
applied to the art layer, default `"center 10%"`: banner art pins
toward the top of its frame with roughly a 10% downward bias so faces
and subjects stay visible, superseding the 10 Aug kit polish 3 pass's
fixed `object-[center_35%]` crop (measured against one asset whose
claimed dimensions turned out to be wrong; see
`KitPromoBanner.fixtures.js`). A caller overrides the anchor per image
only where the ruled default does not read well, for example a scene
image whose subject sits at mid-frame rather than near the top
(`kitPromoBannerCustomAnchorFixture`). Omitted entirely on every
existing consumer, defaults to the ruled anchor, pixel-stable
elsewhere. Full 14-slot survey: `docs/reviews/BANNER-AUDIT.md`.

## Compact continue row, RULED 11 Aug 2026 (Stories continue group density)

`KitContinueRow.view.jsx`, a sibling file in this same folder, not
part of the `KitPromoBannerView` contract (a different shape, list
row rather than banner/hero, no version number of its own). Small art
thumbnail left, title, "Last played" line, Continue button right,
full content width, list-density height.

**Stories is rows-only, RULED 11 Aug 2026 (retires the hero continue
banner).** The hero continue banner is RETIRED on Stories, superseding
the same-day banner-plus-rows treatment this section originally
described. Stories renders up to three most-recent in-progress items
as `KitContinueRow` rows (`CONTINUE_VISIBLE_CAP = 3`), capped, with a
"Show all in progress (N)" control revealing the rest; Stories carries
no continue banner at all, full or otherwise. Home is the only page in
the nine-page set that carries a continue banner (its top banner, both
cold-start and filled/continue states, see the `v1.2.0` section
above); Home does not consume `KitContinueRow`. Superseded (ED1G
review, 22 Aug 2026): Stories has since migrated to
`KitCreationCard`'s `onContinue` prop; `KitContinueRow` is now an
orphaned view with zero consumers.

## Package assets

- `KitPromoBanner.contract.js`
- `KitPromoBanner.fixtures.js`
- `useKitPromoBannerViewModel.js`
- `/dev/ui-preview/kit-promo-banner`

The preview renders all three treatments, including both `bottom`
sub-variants side by side for Brian's ruling.
