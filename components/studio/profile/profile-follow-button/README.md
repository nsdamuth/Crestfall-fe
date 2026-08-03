# Profile Follow Button

## Public Shell

```text
components/studio/profile/ProfileFollowButton.jsx
```

The Shell preserves the existing public props:

```text
username
initialIsFollowing
canFollow
onFollowChange
```

It remains the public import used by the profile connections page.

## ViewModel / Chassis

```text
useProfileFollowButtonViewModel.js
```

The ViewModel owns:

- local follow state initialized from `initialIsFollowing`;
- idle, saving, and failed request status;
- POST versus DELETE intent;
- the username-based profile follow client call;
- normalization of the returned `isFollowing` value;
- the existing `onFollowChange` callback;
- the existing route refresh after a successful mutation.

Failed requests preserve the prior follow state and restore the interactive
button, matching the previous behavior.

## Portable View / Skin

```text
ProfileFollowButton.view.jsx
```

The View owns:

- hidden presentation when follow is unavailable;
- the existing button markup and classes;
- Follow, Following, and Saving labels;
- disabled presentation during a save;
- semantic invocation of `onToggleFollow`.

The View does not receive the username or raw API data and does not call APIs,
inspect authentication, refresh routes, or persist follow state.

## Client Boundary

```text
lib/client/studio/profile/profileFollowClient.js
```

The client preserves the existing same-origin endpoint:

```text
/api/profiles/[username]/follow
```

It uses POST to follow and DELETE to unfollow. This username-based endpoint is
kept separate from the profile-ID reaction client because they are distinct
existing contracts.

## Contract and Fixtures

```text
ProfileFollowButton.contract.js
ProfileFollowButton.fixtures.js
```

Contract version:

```text
PROFILE_FOLLOW_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover available, following, saving-follow, saving-unfollow, and hidden
states.

## Isolated Preview

```text
/dev/ui-preview/profile-follow-button
```

The preview renders the portable View directly. Clicking the button changes
preview-local state only and sends no request.

## Diagnostics

```bash
npm run diagnostics:loom:profile-follow-button
```

The diagnostic checks the Shell, View, ViewModel, client boundary, fixtures,
production preview guard, and the existing live caller import.

## Live Validation

Validate on a public creator's Followers or Following page:

1. Follow a creator from a connection card.
2. Confirm the label changes to `Following`.
3. Confirm the refreshed page retains the new state.
4. Unfollow the creator.
5. Confirm the label returns to `Follow`.
6. Confirm no button renders when `canFollow` is false.
