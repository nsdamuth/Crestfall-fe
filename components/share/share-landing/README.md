# ShareLanding

The public share landing (fe/share-og brief 1, D2, RULED 13 Sep 2026).
One composition serves the three landing families from the URL
research map: `/c/:id/:slug` (character), `/story/:id/:slug`,
`/adventure/:id/:slug`. Contract 1.0.0.

## Purpose

- Signed out: the card's content as page text (featured image, Canon
  and kind badges, title, "by @maker", excerpt) and one gold action,
  "Play free", linking to `/login?next=<this page, ref included>&ref=<sharer>`
  so the visitor returns here after sign in with the sharer's handle
  preserved (the Chassis honors both under CR-074).
- Signed in: the action reads "Play" and opens the existing creation
  page, `/studio/creations/:id`, where today's play path lives. A
  direct launch from the landing is a later brief.
- Open Graph and Twitter tags through `generateMetadata`, the image
  being `/api/share-card/:id`, the canonical URL the family path
  without `ref`.
- 404 for anything the public read refuses (private, Internal,
  missing) and for a creation that carries no card. A family that does
  not match the creation's kind, or a stale slug, redirects to the
  canonical path with `ref` kept.

## Widths

- 390 by 844: single column inside the `--space-5` gutter, art at 5:3
  with `--radius-lg`, badges, title at `--text-title`, byline, excerpt,
  a full-width gold action at 44px.
- 1440: a 64rem container, two columns from 1024 up, art left at 28rem
  (4:5), words and the action right, vertically centered, title at
  `--text-display`.

## Boundary

```text
app/c/[id]/[[...slug]]/page.jsx, app/story/..., app/adventure/...
  -> app/share-landing/ShareLandingPage.jsx (server composition: load,
     family and slug checks, session read, action, metadata)
       -> lib/server/studio/getPublicCreationProfilePageData (the
          existing public loader, wrapped in React cache)
       -> components/kit/share/shareCardModel (the one card model)
       -> components/kit/share/shareUrl (paths, ref, sign-in return)
       -> ShareLanding.view.jsx (presentation only)
            -> components/kit/badge/KitBadge.view
```

## Copy

- "Crestfall" (eyebrow), "Canon", the kind word (Character, Story,
  Adventure), "Play free", "Play", "Skip to the action".

## Fixtures

signed-out, signed-in, story, no-image, longest, error.
