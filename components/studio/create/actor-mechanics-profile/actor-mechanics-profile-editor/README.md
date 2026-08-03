# Actor Mechanics Profile Editor — LOOM Boundary

## Scope

This feature is the creator-facing surface for:

```text
actor_mechanics_profile_contract_v0
actor_mechanics_profile_binding_v0
```

The editor authors a controlled Actor Mechanics Profile value. Its Binding
Shell may open the existing owned-creation picker for a `STATS` binding, but the
portable View remains API-free and persistence-free.

The editor does not create actor state, execute Advanced Mechanics, hydrate chat
runtime, or change provider context.

## LOOM structure

```text
ActorMechanicsProfileEditor.jsx
├── useActorMechanicsProfileEditorViewModel.js
├── ActorMechanicsProfileEditor.view.jsx
└── RegistryLinkedCreationPickerModal
```

The persistence-aware builder composes the same editor ViewModel:

```text
ActorMechanicsProfileBuilderShell
→ useActorMechanicsProfileBuilderViewModel
→ useActorMechanicsProfileEditorViewModel
→ ActorMechanicsProfileBuilderView
→ ActorMechanicsProfileEditorView
```

### Binding Shell

`ActorMechanicsProfileEditor.jsx` preserves the public component boundary,
invokes the ViewModel, renders the portable View, and mounts the nested creation
picker when requested.

`ActorMechanicsProfileBuilderShell.jsx` performs the same picker composition for
the create flow so the builder View does not import another feature's Binding
Shell.

### ViewModel / Chassis

The ViewModel owns:

- controlled-value normalization;
- preset application;
- actor-owner normalization and optional parent-supplied owner locking;
- binding and reusable-reference mutations;
- `STATS` binding picker state;
- conversion of a selected `STATS_POOLS_PROFILE` creation into a compact
  reusable-definition reference;
- activation-domain parsing;
- fixed owner-scoped state policy;
- Beyond Scale capability-policy compatibility;
- client-side validation and issue grouping;
- disclosure state;
- display-ready metrics and callbacks.

The existing picker ViewModel owns the client call that lists owned creations.
The Actor Mechanics Profile editor does not duplicate that path.

### Portable View / Skin

The View owns:

- layout and responsive presentation;
- preset, identity, owner, policy, and binding controls;
- the semantic **Select Stats & Pools Profile** action;
- read-only display of the selected Stats & Pools creation reference;
- generic reference controls for other domains;
- counters, badges, warnings, errors, empty, disabled, and locked-owner states;
- accessibility labels;
- safe invocation of semantic callbacks.

The View does not know:

- API routes, client modules, services-api, PostGraphile, or Supabase;
- database columns or JSONB storage;
- creation ownership or authorization rules;
- Advanced Mechanics execution;
- runtime state hydration;
- context planning or provider prompts.

## Controlled interface

```jsx
<ActorMechanicsProfileEditor
  value={profileDraft}
  onChange={setProfileDraft}
  ownerContext={optionalLockedActorContext}
/>
```

Optional locked owner context:

```js
{
  locked: true,
  bindingMode: "BOUND_ACTOR",
  ownerType: "PLAYER_CHARACTER",
  ownerId: "...",
  ownerTitle: "Mira Vale"
}
```

## Stats & Pools reference

A `STATS` binding may select one owned `STATS_POOLS_PROFILE` creation. The
editor saves only:

```text
referenceType
sourceId
version
title
canonical type/version metadata
```

It does not copy Stats & Pools definitions or create mutable actor values.
Services-api resolves and validates the actual owned creation during create and
update writes; client metadata is not authoritative.

## State isolation

The editor does not expose state-policy mutation. Every authored value remains
fixed to:

```text
isolation: OWNER_SCOPED
namespaceStrategy: OWNER_AND_BINDING
sharedDefinitionsAllowed: true
sharedMutableStateAllowed: false
```

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/actor-mechanics-profile-editor
```

The route renders the portable View from direct View-contract fixtures and
returns `notFound()` in production. Its Stats & Pools selection action is a
local fixture simulation and does not call an API.

## Next integration boundary

After live validation, definition hydration through Actor Mechanics Profile
runtime selection must be a separate patch. Actor-owned state persistence,
formula evaluation, and deterministic mutations remain later independent
steps.

## JSON authoring companion

The editor exposes a LOOM JSON modal through:

```text
ActorMechanicsProfileEditorView
→ ActorMechanicsProfileJsonEditorModal
→ useActorMechanicsProfileJsonEditorViewModel
→ actorMechanicsProfileJsonEditor.validation
```

Validate & Apply replaces only the controlled editor value. The normal
create/edit page Save action remains authoritative for persistence. Existing
references may be preserved exactly, but the modal cannot select or invent new
external identifiers. Mutable actor state is rejected.

Development preview:

```text
/dev/ui-preview/actor-mechanics-profile-json-editor
```
