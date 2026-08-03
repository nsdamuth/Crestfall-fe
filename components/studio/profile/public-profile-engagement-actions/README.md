# Public Profile Engagement Actions

## Public Shell

```text
components/studio/profile/PublicProfileEngagementActions.jsx
```

The Shell preserves the existing public props:

```text
profile
className
```

## ViewModel / Chassis

```text
usePublicProfileEngagementActionsViewModel.js
```

The ViewModel owns:

- conversion of the single profile into the profile-engagement hook input;
- profile visibility based on the profile identifier;
- Like, Save, and Follow state from `useProfileEngagementState`;
- engagement error-message normalization;
- composition of `useCreatorEngagementActionsViewModel`;
- mapping engagement actions back to the original profile record.

## Portable View / Skin

```text
PublicProfileEngagementActions.view.jsx
```

The View owns:

- the optional engagement error alert;
- wrapper layout and supplied `className`;
- composition of `CreatorEngagementActions.view.jsx`.

The View does not receive the raw profile record and does not call engagement
APIs, inspect authentication, refresh profile data, or persist state.

## Contract and Fixtures

```text
PublicProfileEngagementActions.contract.js
PublicProfileEngagementActions.fixtures.js
```

Contract version:

```text
PUBLIC_PROFILE_ENGAGEMENT_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover default, active, error, partial-action, no-action, hidden, and
`className="contents"` states.

## Isolated Preview

```text
/dev/ui-preview/public-profile-engagement-actions
```

The preview renders the portable View directly. Like, Save, and Follow modify
preview-local state only. No profile is loaded and no engagement request is
sent.

## Live Validation

Validate the feature on a public creator profile:

1. Like the creator.
2. Save the creator.
3. Follow the creator.
4. Confirm active states update.
5. Confirm an engagement error still appears above the actions when reproduced.
6. Confirm the actions remain aligned with Donate and Share when the Shell is
   rendered with `className="contents"`.
