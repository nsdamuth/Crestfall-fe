# Studio Account Profile LOOM Boundary

## Public Shell

`components/studio/account/StudioAccountProfile.jsx`

The existing import remains the application Binding Shell. It composes the
portable View with the application-owned `ProfileMediaManager`,
`StudioAccountMetrics`, and `DefaultPlayerCharacterPickerModal` Shells.

## Portable View

`StudioAccountProfile.view.jsx` owns the account-profile visual hierarchy,
field presentation, loading/error/saved states, default-PC summary, and the
future age-verification notice. It receives semantic field values and callbacks.
It does not call APIs, inspect Supabase, map database/API field names, load
Player Characters, or import other feature Shells.

## ViewModel / Chassis

`useStudioAccountProfileViewModel.js` owns:

- current account loading;
- API payload normalization;
- camel-cased authoring form state;
- update-payload mapping;
- saving and error/status state;
- SFW-only preference gating;
- default Player Character selection state;
- semantic callbacks exposed to the View.

## Data path

```text
StudioAccountProfileView
→ useStudioAccountProfileViewModel
→ studioAccountClient
→ /api/profile/me
→ services-api
→ PostGraphile
→ DB
```

Authentication remains owned by the existing Next.js API proxy and centralized
Supabase server helper. No direct Supabase access was added to the feature.

## Application-owned slots

The portable View accepts `profileMediaContent` and `accountMetricsContent`
slots. This keeps the View from importing foreign Binding Shells while
preserving the current account-page layout.
