# Creation Edit Sticky Action Bar

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
