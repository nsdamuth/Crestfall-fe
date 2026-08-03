# Account Stub Page

## Purpose

`AccountStubPage` is the bounded placeholder surface shared by Account routes
whose product settings are intentionally not connected yet.

The public import path remains:

```text
components/studio/account/AccountStubPage.jsx
```

That file is a small Binding Shell that supplies the current Account navigation
and disconnected-placeholder notice to the portable View.

## Current consumers

```text
app/studio/account/appearance/page.js
app/studio/account/notifications/page.js
app/studio/account/privacy/page.js
app/studio/account/safety/page.js
app/studio/account/subscription/page.js
```

## Ownership boundary

The Binding Shell owns:

- the current `/studio/account` back and return destinations;
- the current Back to Account and Return to Account labels;
- the current explanation that these settings are frontend placeholders.

The View owns:

- Back-link and page-header composition;
- placeholder card presentation;
- optional placeholder-notice presentation;
- the final Return to Account link;
- responsive card-grid and text wrapping;
- defensive handling of a non-array `cards` value.

The View does not own:

- billing, subscriptions, invoices, or payment behavior;
- appearance or saved preference behavior;
- notification services;
- privacy, blocking, moderation, or content-safety behavior;
- account APIs, service calls, or persistence;
- the content supplied by each Account route.

No ViewModel is required because the caller supplies complete visible page
content and the Shell supplies the fixed Account navigation contract.

## Contract

```text
ACCOUNT_STUB_PAGE_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/account-stub-page
```

The preview renders direct View-contract fixtures with local hash navigation.
It must return `notFound()` in production.

## Live regression targets

```text
Studio → Account → Subscription
Studio → Account → Appearance
Studio → Account → Notifications
Studio → Account → Privacy
Studio → Account → Safety & Content
```

All five pages must retain their current placeholder copy and remain
unconnected to backend account behavior.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
