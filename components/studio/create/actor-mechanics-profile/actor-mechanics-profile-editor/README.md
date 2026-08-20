# Actor Mechanics Profile Editor — LOOM Boundary

## Scope

This feature is the creator-facing surface for:

```text
actor_mechanics_profile_contract_v0
actor_mechanics_profile_binding_v0
```

The editor authors a controlled Actor Mechanics Profile value. Its Binding
Shell may open the existing owned-creation picker for graph-managed definition
profiles, while the portable View remains API-free and persistence-free.

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
- graph-managed picker state for `STATS`, `PROGRESSION`, `SKILLS`, `MAGIC`, and
  `ABILITIES` bindings;
- conversion of selected creations into transient reusable-definition references
  for the controlled draft;
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

## Graph-authoritative creation references

The following bindings may select one owned reusable definition creation per
binding:

```text
STATS        → STATS_POOLS_PROFILE
PROGRESSION  → PROGRESSION_PROFILE
SKILLS       → SKILLS_PROFILE
MAGIC        → ABILITY_SPELL_PROFILE
ABILITIES    → ABILITY_SPELL_PROFILE
WALLET       → WALLET_PROFILE
```

The persisted Actor Mechanics Profile does **not** store those `CREATION`
reference objects. The authoritative relationship is stored in
`creation_asset_edges` as `USES_MECHANICS_PROFILE`, keyed by the binding id.
Services-api resolves the current target creation through PostGraphile and
projects a transient `CREATION` reference back into the editor/runtime shape so
existing LOOM controls continue to operate on current titles and contract data.

Non-creation references such as `BUILTIN_MODULE` and `REGISTRY` remain profile
data because they are not creation-graph relationships. Mutable actor state is
unchanged and remains outside this asset.

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


## Ability & Spell Profile references

`MAGIC` and `ABILITIES` bindings may each select one owned `ABILITY_SPELL_PROFILE`.
The selection is graph-authoritative and the editor receives the current target as
a transient projection. Selecting a profile does not initialize known/unlocked
state, mastery, cooldowns, charges, resource balances, or any other actor-owned
runtime state.


## Wallet Profile reference

`WALLET` bindings may select one owned `WALLET_PROFILE` through the dedicated
Creation picker. The reference stores the reusable
`wallet_profile_contract_v0` definition only. Live actor balances, revisions,
and transaction history remain actor-owned runtime state.
