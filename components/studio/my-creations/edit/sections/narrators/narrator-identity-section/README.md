# Narrator Identity Section

## Purpose

This feature separates the Narrator edit identity form into the Crestfall Loom
Shell / ViewModel / View boundary while preserving the existing Creation Edit
public API and stored data semantics.

## Files

```text
NarratorIdentitySection.jsx                         # Binding Shell
narrator-identity-section/
  NarratorIdentitySection.view.jsx                  # Portable View
  useNarratorIdentitySectionViewModel.js            # Application mapping
  NarratorIdentitySection.contract.js               # Versioned View contract
  NarratorIdentitySection.fixtures.js               # Isolated View states
  README.md                                          # This handoff
```

Development preview:

```text
/dev/ui-preview/narrator-identity-section
```

The preview route is blocked in production.

## Public application API

```jsx
<NarratorIdentitySection
  form={form}
  updateDataField={updateDataField}
/>
```

## Ownership boundary

The ViewModel owns:

- reading the raw Narrator creation form;
- the `form.data` fallback;
- Narrator-name fallback to the creation title;
- tag-array formatting;
- comma-separated tag parsing;
- official tone-option values;
- mapping semantic View callbacks to `name`, `tags`, and `tone` data fields.

The portable View owns:

- the Narrator Identity heading;
- name and tag text fields;
- tone selector presentation;
- read-only creation-type presentation;
- responsive two-column layout;
- safe semantic callback invocation.

The View does not know Narrator JSON storage fields, creation save behavior,
PostGraphile, services, or database semantics.

## Validation

Validate both:

1. `/dev/ui-preview/narrator-identity-section`
2. Creation Edit → Narrator → Narrator Identity

Change the Narrator name, tags, and tone, save, refresh, and confirm that the
stored values remain unchanged from the pre-conversion behavior.
