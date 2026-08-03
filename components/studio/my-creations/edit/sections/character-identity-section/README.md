# Character Identity Section

Portable LOOM boundary for the Character Identity section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/IdentitySection.jsx
```

The Shell preserves the existing public API:

```jsx
<IdentitySection form={form} updateDataField={updateDataField} />
```

## Responsibilities

### ViewModel

- reads the current creation form and `form.data`
- preserves the title fallback for an unset character name
- supplies current species, gender-presentation, rendering-style, and role options
- preserves the `EITHER` rendering default and Crestfall color-palette default
- limits custom identity values to the existing maximum length
- clamps committed ages to the adult minimum of 18
- maps semantic callbacks to the existing character data fields
- supplies the read-only creation type

### Binding Shell

- renders the existing Character Color Palette modal
- renders the existing Role Archetype option modal
- binds those application controls to semantic ViewModel values and callbacks
- renders the portable View

### Portable View

- renders identity fields and adult-age guidance
- conditionally renders custom species and gender fields
- places application-rendered color-palette and role-archetype controls
- invokes semantic callbacks defensively

The View does not inspect `form`, know JSON storage keys, import Crestfall modal
Shells, call persistence helpers, or infer creation lifecycle rules.

## Preview

```text
/dev/ui-preview/character-identity-section
```

The preview is development-only and returns `notFound()` in production.
