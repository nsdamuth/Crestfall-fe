# Creator List Row

`CreatorListRow` is the bounded list-mode creator result used by the Community
creator browser.

## Files

```text
components/studio/community/CreatorListRow.jsx
components/studio/community/creator-list-row/
  CreatorListRow.view.jsx
  useCreatorListRowViewModel.js
  CreatorListRow.contract.js
  CreatorListRow.fixtures.js
  README.md
```

The existing public file remains the Binding Shell. The ViewModel translates a
raw creator record into display-ready identity, badge, stat, route, and nested
engagement-action props. The portable View owns only list-row presentation.

The engagement controls are composed from the already-separated portable
`CreatorEngagementActions.view.jsx`; its ViewModel is composed by the parent
ViewModel so the View does not import a binding Shell.

## Public application API

```jsx
<CreatorListRow
  creator={creator}
  liked={liked}
  bookmarked={bookmarked}
  followed={followed}
  onToggleLike={onToggleLike}
  onToggleBookmark={onToggleBookmark}
  onToggleFollow={onToggleFollow}
/>
```

The public API and raw-creator callback behavior are unchanged.

## Preview

```text
/dev/ui-preview/creator-list-row
```

The preview renders contract-shaped fixtures and keeps all engagement changes
in local state. It does not fetch creators, change engagement records, or save
profile data. The route returns `notFound()` in production.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
