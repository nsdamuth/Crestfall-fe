# Creation Edit Sticky Action Bar

**RETIRED for the v2 editor, 12 Aug 2026 (ED1,
docs/plans/FABLE-GATE-2-STUDIO.md, contract law s13). Contract stays
at 1.0.0, not bumped; retirement recorded here, not in the version
number.** `app/studio/v2/editor/**` no longer mounts this package: its
save affordance is replaced by `editor-save-bar` (N2, top-docked,
appears only when dirty); its visibility/review/canon controls move
into the Publishing group (`creation-publishing-section`, now 1.1.0,
carrying Submit for Public/Canon Review and the relocated Unlist for
Editing and Cancel Review, each behind a confirm step); the inert
emerald Public toggle is dropped, status reads through the new
editor-header's visibility chip instead. This package is UNCHANGED
and still live on the legacy `/studio/my-creations/[id]/edit` route
via `components/studio/my-creations/CreationEditShell.jsx`, which
this wave does not touch.

## Purpose

This Loom feature separates the Creation Edit save, visibility, review, and
lifecycle presentation from the application rules that determine which actions
are currently available.

## Public Shell

```text
components/studio/my-creations/edit/CreationEditStickyActionBar.jsx
```

The public Shell preserves the existing props used by `CreationEditShell`:

```jsx
<CreationEditStickyActionBar
  form={form}
  updateField={updateField}
  onSave={handleSave}
  saveStatus={saveStatus}
  saveMessage={saveMessage}
  onOpenPublishing={openPublishing}
  onUnlistForEditing={handleUnlistForEditing}
  onCancelReview={handleCancelReview}
  reviewStatus={reviewStatus}
/>
```

## Ownership

The ViewModel owns:

- creation visibility, lifecycle, and canon interpretation;
- edit-lock messages;
- save, review, unlist, and cancel availability;
- busy and feedback-state normalization;
- mapping semantic View callbacks to the existing application callbacks.

The portable View owns:

- the sticky action-bar layout;
- status-summary presentation;
- visibility buttons;
- review, unlist, save, and cancel button presentation;
- success and error feedback styling.

The View does not save a creation, submit or cancel review, unlist content,
change publication policy, or interpret raw creation records.

## Preview

```text
/dev/ui-preview/creation-edit-sticky-action-bar
```

The preview is blocked in production and uses contract-shaped fixture data.
Its actions only update local preview feedback.
