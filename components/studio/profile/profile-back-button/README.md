# Profile Back Button

## Public Shell

```text
components/studio/profile/ProfileBackButton.jsx
```

The Shell preserves the existing public prop:

```text
fallbackHref
```

## ViewModel / Chassis

```text
useProfileBackButtonViewModel.js
```

The ViewModel owns:

- the Next.js router;
- browser-history inspection;
- using `router.back()` when prior history is available;
- navigating to the supplied fallback route otherwise;
- the default `/studio/community` fallback.

## Portable View / Skin

```text
ProfileBackButton.view.jsx
```

The View owns:

- the circular icon-button presentation;
- the Arrow Left icon;
- the accessible label;
- safe invocation of `onGoBack`.

The View does not import routing, inspect `window.history`, know the profile
route, or choose fallback navigation.

## Contract and Fixtures

```text
ProfileBackButton.contract.js
ProfileBackButton.fixtures.js
```

Contract version:

```text
PROFILE_BACK_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover the default label, a longer accessibility label, and a missing
action callback.

## Isolated Preview

```text
/dev/ui-preview/profile-back-button
```

The preview renders the portable View directly. Clicking the button updates
local preview feedback only and never changes browser history or routes.

## Live Validation

1. Open a public creator profile from Community and click Back.
2. Confirm the browser returns to the prior page.
3. Open the profile in a fresh tab or direct navigation and confirm Back uses
   `/studio/community` when there is no usable prior history.
4. Confirm the profile page layout and icon styling remain unchanged.
