# Profile Share Button

## Public Shell

```text
components/studio/profile/ProfileShareButton.jsx
```

The Shell preserves the existing public prop:

```text
username
```

## ViewModel / Chassis

```text
useProfileShareButtonViewModel.js
```

The ViewModel owns:

- username normalization;
- construction of the public profile URL;
- URL encoding for the username path segment;
- Clipboard API use;
- the existing textarea/`execCommand` fallback;
- transient idle, copied, and error state;
- the existing 1.6-second status reset;
- preserving the current missing-username no-op click behavior.

## Portable View / Skin

```text
ProfileShareButton.view.jsx
```

The View owns:

- Share icon and button presentation;
- display-ready status text;
- safe invocation of `onShare`.

The View does not receive the username and does not access `window`, `navigator`,
the clipboard, profile records, APIs, routing, or persistence.

## Contract and Fixtures

```text
ProfileShareButton.contract.js
ProfileShareButton.fixtures.js
```

Contract version:

```text
PROFILE_SHARE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover idle, copied, copy-failed, unavailable-action, and long-label
states.

## Isolated Preview

```text
/dev/ui-preview/profile-share-button
```

The preview renders the portable View directly. Clicking Share updates local
preview status only and does not access the clipboard or load a profile.

## Live Validation

1. Open a public creator profile.
2. Click Share.
3. Confirm the button changes to Copied and resets after approximately 1.6 seconds.
4. Paste the clipboard and confirm the full public profile URL.
5. Confirm Donate and engagement controls remain aligned and unchanged.
