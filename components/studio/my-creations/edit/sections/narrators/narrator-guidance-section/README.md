# Narrator Guidance Section

## Purpose

This feature separates the Narrator edit guidance form into the Crestfall Loom
Shell / ViewModel / View boundary while preserving the existing Creation Edit
public API and stored data semantics.

## Files

```text
NarratorGuidanceSection.jsx                         # Binding Shell
narrator-guidance-section/
  NarratorGuidanceSection.view.jsx                  # Portable View
  useNarratorGuidanceSectionViewModel.js            # Application mapping
  NarratorGuidanceSection.contract.js               # Versioned View contract
  NarratorGuidanceSection.fixtures.js               # Isolated View states
  README.md                                          # This handoff
```

Development preview:

```text
/dev/ui-preview/narrator-guidance-section
```

The preview route is blocked in production.

## Public application API

```jsx
<NarratorGuidanceSection
  form={form}
  updateDataField={updateDataField}
/>
```

## Ownership boundary

The ViewModel owns:

- reading the raw Narrator creation form;
- the `form.data` fallback;
- mapping the stored `narrator_guidance` value into display text;
- mapping the stored `avoid_guidance` value into display text;
- mapping semantic View callbacks back to the existing data-field names.

The portable View owns:

- the Narrator Guidance heading;
- the reusable-guidance text area;
- the avoid-guidance text area;
- placeholders and responsive presentation;
- safe semantic callback invocation.

The View does not know Narrator JSON storage fields, creation save behavior,
PostGraphile, services, or database semantics.

## Validation

Validate both:

1. `/dev/ui-preview/narrator-guidance-section`
2. Creation Edit → Narrator → Narrator Guidance

Change both guidance fields, save, refresh, and confirm that the stored values
remain unchanged from the pre-conversion behavior.
