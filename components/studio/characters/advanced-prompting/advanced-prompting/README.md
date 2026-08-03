# Advanced Prompting Editor Loom Feature

**Status:** Loom-separated; live validation required after applying the patch

**Stored creator-directives contract:** `character.creatorDirectives.v1`

**View contract:** `1.0.0`

## Purpose

This feature provides optional expert authoring for
`creation.data.creator_directives` while keeping stored creator-directive data,
security metadata, compilation output, and persistence outside the portable
View.

## Structure

```text
AdvancedPromptingEditor.jsx
advanced-prompting/
  AdvancedPromptingEditor.view.jsx
  useAdvancedPromptingViewModel.js
  AdvancedPromptingEditor.contract.js
  AdvancedPromptingEditor.fixtures.js
  README.md
```

## Public binding interface

The existing Shell path remains authoritative:

```text
components/studio/characters/advanced-prompting/AdvancedPromptingEditor.jsx
```

Create and edit parents continue to provide:

```jsx
<AdvancedPromptingEditor value={creatorDirectives} onChange={handleChange} />
```

The public `value` / `onChange` behavior is unchanged by the Loom normalization.

## ViewModel ownership

The ViewModel owns:

- normalization of the stored creator-directives object;
- the `character.creatorDirectives.v1` data contract;
- section expansion state;
- per-section and combined character budgets;
- translation of raw security metadata into display-ready View state;
- dirty security-status decisions;
- immutable controlled-value updates emitted through `onChange`.

## Portable View ownership

The View owns:

- Creator Directives markup and styling;
- enabled, inactive, approved, sanitized, rescan, review, and blocked visuals;
- section disclosure presentation;
- text-area presentation and character counters;
- safe invocation of semantic callbacks.

The View does not know the stored creator-directives object, parent form field
names, `compiled` data, security storage keys such as
`sanitized_fragment_count`, API routes, or persistence behavior.

## Fixtures

`AdvancedPromptingEditor.fixtures.js` exports direct View-contract objects for:

- disabled;
- enabled and empty;
- approved;
- needs rescan;
- approved with sanitization;
- review required;
- blocked;
- near-limit content.

Fixture callbacks are preview-safe and do not save application data.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/advanced-prompting
```

The route renders the portable View from fixtures and returns `notFound()` in
production. Preview interactions remain local and do not authenticate, load a
character, run a security scan, compile directives, or persist changes.

## Live validation

### Character Create

1. Open Character Create and reach Review.
2. Expand Advanced Creator Guidance.
3. Enable Advanced Prompting.
4. Enter and clear text in multiple sections.
5. Confirm per-section and combined limits still apply.
6. Save the character.
7. Refresh and confirm the saved directives remain correct.

### Character Edit

1. Open an existing character and select Advanced Guidance.
2. Confirm existing directives hydrate correctly.
3. Modify, clear, enable, and disable directives.
4. Save the character.
5. Refresh and confirm the saved directives remain correct.

The feature counts as fully validated only after both the isolated preview and
these live workflows are satisfactory.
