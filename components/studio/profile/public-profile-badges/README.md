# Public Profile Badges

LOOM boundary for the badge collection displayed in the public profile Badges tab.

## Public entry point

```text
components/studio/profile/PublicProfileBadges.jsx
```

The Binding Shell normalizes application badge records through the ViewModel and passes a display-only contract to the portable View.

## Files

```text
PublicProfileBadges.view.jsx
usePublicProfileBadgesViewModel.js
PublicProfileBadges.contract.js
PublicProfileBadges.fixtures.js
```

## View contract

```text
badges: Array<{
  id,
  slug,
  label,
  description,
  category,
  categoryLabel,
  imageUrl,
  awardedAt,
  sortOrder
}>
```

The View knows nothing about profiles, PostGraphile, database assignments, authorization, or badge-award policy. A missing `imageUrl` renders a styled text badge. A future `imageUrl` renders a small badge image while retaining the label as accessible text.

## Preview

```text
/dev/ui-preview/public-profile-badges
```

The preview is blocked in production with `notFound()`.

## Production badge artwork

The initial production badge artwork is served from:

```text
/public/images/badges/<badge-slug>.webp
```

`imageUrl` remains data-driven. The View does not map slugs to files and does not own badge-art policy. Database badge definitions provide the URL through the public-profile service payload.

The art-system specification is maintained in:

```text
docs/architecture/badges/README.md
```
