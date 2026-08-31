# Public Home

**Status:** public landing-page presentation package
**View contract:** `1.0.0`

## Purpose

Provides the public `/` splash page for Crestfall Studio. The page is deliberately
separate from the signed-in Studio application shell: it has no Studio sidebar,
no archive navigation, and one primary product entry action.

The visual direction is the restrained dark Crestfall Studio language: near-black
canvas, cream ink, muted gold ornament, a low-opacity flower line-art hero, and
three wide alternating story panels. Artwork supports the hierarchy rather than
acting as the page background or border system.

## Structure

```text
app/page.js
  Thin public route binding

components/public-home/
  PublicHome.view.jsx
    Portable presentation
  PublicHome.contract.js
    Stable prop boundary
  PublicHome.fixtures.js
    Deterministic page copy, routes, and existing asset references
  README.md
```

## Navigation contract

The only primary product CTA is:

```text
/studio/v2/home
```

The footer intentionally contains legal/support destinations only:

- `/terms/privacy-policy`
- `/terms/service`
- `/terms`
- `/contact`

There are no public-home links to Lore, Characters, Locations, Factions, Stories,
or Chronicle.

## Data and runtime ownership

This is a static public presentation surface. It performs no data loading and no
backend access. `PublicHome.view.jsx` does not import Next router primitives,
Crestfall clients, Supabase, or application services.

## Artwork

The story pillars use fixture-owned artwork so image swaps and focal-point tuning
do not change the portable View:

- `/assets/public-home/crestfall-create-dalethia.webp` — creator/worldbuilding pillar, with Dalethia as the primary focal point.
- `/assets/public-home/crestfall-play-airship.webp` — stories/adventures pillar.
- `/assets/covers/crestfall-camellia-cover.png` — archive/legacy pillar and white-flower brand motif.

The first two files are landing-specific optimized WebP derivatives. Desktop panels
let the artwork extend beneath the copy edge and use a directional black fade rather
than a hard 50/50 seam. `imagePosition` is fixture-owned so focal crops remain
responsive without baking layout decisions into the image files.

## Validation

The production route itself is the preview target:

```text
/
```

Run the focused public-home diagnostic and repository guardrails after applying
the patch.
