# Studio Shell ↔ Public Studio Anonymous Access binding

Status: additive FE presentation binding only.

This package connects the already accepted anonymous Public Studio semantics to
the existing FE-owned Studio Shell contract.

It deliberately does **not** replace or edit:

```text
StudioShell.view.jsx
useStudioShellViewModel.js
StudioShell.contract.js
```

## Existing FE shell authority

The current portable shell contract remains:

```text
STUDIO_SHELL_VIEW_CONTRACT_VERSION = 1.0.0
```

It owns the visual canvas and receives application-owned slots:

```text
sidebarSlot
mobileNavSlot
topBarSlot
children
```

That is enough to express most of the current anonymous/public shell behavior
without giving FE routing or authentication authority.

## Anonymous public slot policy

For a Chassis-authorized anonymous public surface:

```text
sidebar  -> HIDDEN
mobile   -> HIDDEN
top bar  -> PUBLIC_STUDIO_HEADER_SLOT
```

The public header model remains:

```text
Crestfall
Studio
Community
Sign In
```

The Chassis Binding Shell may populate the `topBarSlot` with the FE-owned public
header treatment.

## Authenticated shell

Authenticated users retain:

```text
AUTHENTICATED_SIDEBAR_SLOT
AUTHENTICATED_MOBILE_NAV_SLOT
AUTHENTICATED_TOP_BAR_SLOT
```

even when they are viewing Community, a public Creation, or a public Creator
Profile.

## Protected-route state

The binding can represent:

```text
AUTHENTICATION_REQUIRED
```

but it does not render a redirect.

The Chassis route group remains responsible for preventing anonymous access to
protected Studio routes.

## Public media

The accepted semantic remains:

```text
ALLOW_SERVICE_AUTHORITY_TO_DECIDE_VISIBILITY
```

The shell must not hide otherwise-public media merely because the viewer lacks a
session.

services-api remains authoritative for actual media visibility.

## Current FE layout gap

The current source anonymous shell uses a different canvas geometry than the
authenticated Studio:

- centered content;
- wider max-width;
- compact top spacing;
- no private navigation chrome.

The current portable `StudioShell.view.jsx` has fixed authenticated-style
section spacing and no layout-variant prop.

This binding therefore records:

```text
layout.variant = ANONYMOUS_PUBLIC
currentStudioShellSupportsVariant = false
pendingFeVisualExtension = true
```

It does **not** overload existing slots or copy source CSS to conceal that gap.

The FE lane should later add the ruled layout variant to the portable shell.

## Permanent boundary

Crestfall owns:

- `(public-studio)` route grouping
- protected Studio route grouping
- redirect behavior
- Supabase session lookup
- `StudioAccountProvider` enablement
- private account loading
- application slot construction
- services-side public media authority

Crestfall-fe owns:

- Studio Shell visual composition
- public header visual composition
- anonymous layout variant
- Sign In / Community visual actions

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
