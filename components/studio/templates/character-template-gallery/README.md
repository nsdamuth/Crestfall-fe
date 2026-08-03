# Character Template Gallery

## Purpose

`CharacterTemplateGallery` is the bounded Character Templates library surface.
It displays the current built-in archetype cards, disabled future actions, and
the route into the Character Template builder.

The public import path remains:

```text
components/studio/templates/CharacterTemplateGallery.jsx
```

That file is a small Binding Shell supplying Crestfall-owned static template
content and the current create-template route.

## Current consumer

```text
app/studio/templates/characters/page.js
```

## Ownership boundary

The Binding Shell owns:

- the current built-in template inventory;
- current sidebar wording;
- the Character Template builder route;
- current future-action labels.

The portable View owns:

- template-card presentation;
- responsive card and sidebar layout;
- disabled Use Template and Duplicate controls;
- the Create Template link presentation;
- defensive empty and missing-copy states.

The View does not own:

- template loading or discovery;
- built-in, private, public, or community template policy;
- using or duplicating a template;
- creation-builder behavior;
- APIs, permissions, services, or persistence.

No ViewModel is required because the Shell supplies a complete display contract
and the current View owns no application state.

## Contract

```text
CHARACTER_TEMPLATE_GALLERY_VIEW_CONTRACT_VERSION = "1.0.0"
```

## Development preview

```text
/dev/ui-preview/character-template-gallery
```

The preview renders contract-shaped fixtures only. The route must return
`notFound()` in production.

## Live regression target

```text
Studio → Templates → Character Templates
```

The four built-in cards, disabled future actions, supporting sidebar, and Create
Template route must retain their existing behavior.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
