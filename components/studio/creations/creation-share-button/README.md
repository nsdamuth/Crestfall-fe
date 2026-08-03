# Creation Share Button

## Public Shell

```text
components/studio/creations/CreationShareButton.jsx
```

The Shell preserves the existing public props:

```text
href
label
copiedLabel
disabled
```

## ViewModel / Chassis

```text
useCreationShareButtonViewModel.js
```

The ViewModel owns:

- creation-share URL normalization;
- resolution against the current browser origin;
- Clipboard API use;
- the existing textarea/`execCommand` fallback;
- transient idle, copied, and error state;
- the existing 1.6-second status reset;
- custom default and copied labels;
- preserving the explicit disabled state; a missing URL retains the existing no-op click behavior.

## Portable View / Skin

```text
CreationShareButton.view.jsx
```

The View owns:

- Share icon and button presentation;
- display-ready status text;
- disabled presentation;
- safe invocation of `onShare`.

The View does not receive the URL and does not access `window`, `navigator`, the
clipboard, creation records, APIs, routing, or persistence.

## Contract and Fixtures

```text
CreationShareButton.contract.js
CreationShareButton.fixtures.js
```

Contract version:

```text
CREATION_SHARE_BUTTON_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures cover idle, copied, copy-failed, disabled, custom-label, and long-label
states.

## Isolated Preview

```text
/dev/ui-preview/creation-share-button
```

The preview renders the portable View directly. Clicking Share updates local
preview status only and does not access the clipboard or load a creation.

## Live Validation

Validate both existing placements:

1. Open a creation profile/detail page and click Share.
2. Confirm the button changes to Copied and resets after approximately 1.6 seconds.
3. Paste the clipboard and confirm the full creation URL.
4. Open a creation preview modal and repeat the share test.
5. Confirm the explicit disabled state remains unavailable when reproduced.
