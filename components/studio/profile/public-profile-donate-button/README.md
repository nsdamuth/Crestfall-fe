# Public Profile Donate Button Loom Feature

## Public entry point

```text
components/studio/profile/PublicProfileDonateButton.jsx
```

The existing public component remains the Binding Shell and preserves:

```jsx
<PublicProfileDonateButton profile={profile} />
```

## Layer ownership

### View

`PublicProfileDonateButton.view.jsx` owns:

- Donate trigger presentation
- dialog and form layout
- amount, balance, tax, message, and anonymous controls
- busy, success, and error presentation
- safe semantic callback invocation

The View does not receive the raw profile, access the Studio account provider,
call donation clients, refresh routes, calculate donation amounts, or persist
application state.

### ViewModel

`usePublicProfileDonateButtonViewModel.js` owns:

- dialog and form state
- the 100-coin minimum
- the current zero-tax calculation
- Studio account balance refresh and display
- validation against the minimum and current balance
- `donateProfileCoins(...)`
- sender-balance synchronization
- route refresh after success
- raw profile ID and username handling

### Contract and fixtures

The View contract is versioned as:

```text
PUBLIC_PROFILE_DONATE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures are direct View-contract objects and contain no real profile or
account data.

## Preview

```text
/dev/ui-preview/public-profile-donate-button
```

The preview is unavailable in production. Its actions update local preview
state only and never load a Studio account, call the donation client, spend
coins, refresh a profile, or persist data.

## Live validation

Test the Donate control on a public creator profile. Verify account-balance
loading, minimum and insufficient-balance validation, message and anonymous
controls, successful donation feedback, balance updates, dialog close behavior,
and the resulting Activity entry when available.
