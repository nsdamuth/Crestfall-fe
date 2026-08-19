# Location Registry Builder LOOM bundle

## Boundary

```text
LocationRegistryBuilder.jsx              Binding Shell
        ↓
useLocationRegistryBuilderViewModel      ViewModel / Chassis adapter
        ↓
LocationRegistryBuilderView              Portable View / Skin
```

The existing `useLocationRegistryBuilder` hook remains the application behavior and persistence authority for this patch. The LOOM ViewModel adapts that normalized registry state into semantic View props, display text, option sets, and callbacks.

## Preserved behavior

- create and Creation Edit modes;
- overview, locations, connections, people/presence, weather, and runtime tabs;
- linked Location assets and ad-hoc locations;
- parent/child location relationships;
- qualitative distance and route methods;
- NPC Registry entry presence bindings;
- weather scopes;
- prompt and runtime guidance;
- create/update save-session protection;
- standard `LOCATION_REGISTRY` payload and Creation Edit redirect.

## Portable View rules

`LocationRegistryBuilder.view.jsx` owns JSX, visual hierarchy, tabs, cards, modal presentation, form controls, loading/error presentation, and safe semantic callback invocation. It does not call APIs, clients, routers, persistence helpers, Supabase, or PostGraphile.

## Preview

Development only:

```text
/dev/ui-preview/location-registry-builder
```

The preview renders fixtures and does not connect to the owned Location/NPC catalogues or persistence.

## W9 shared Location Registry application foundation

The independently deployed FE app now carries deployment mirrors of current
`Crestfall` Location Registry application behavior:

```text
locationRegistryUtils.js
useLocationRegistryBuilder.js
useLocationRegistryBuilderViewModel.js
registryClient.js
locationRegistrySplitAnalysis.mjs
locationRegistryConnectionEndpointSelection.mjs
locationRegistrySplitClient.js
```

This wires the shared application foundation for hierarchy, direct Character +
NPC Registry presence authority, cross-Registry Location endpoints, and split
analysis/plan/commit orchestration.

The FE Builder remains on its existing `location-registry-builder.view.v1`
presentation contract. W9 intentionally does not copy the Chassis `view.v5`.

Saved-registry Split and Cross-Registry authoring require the current Registry
Creation ID. The source edit bridge supplies `currentCreationId={form.id || ""}`,
but `my-creations/edit/**` remains protected/frozen, so W9 leaves that bridge
explicitly `PENDING_PROTECTED_EDITOR_WIRING`.

## W10 People & Presence visual wiring

The People & Presence modal now exposes both canonical person authorities:
`Character` and `NPC Registry`.

Direct Character selection stores the Character UUID through the W9 application
foundation. NPC Registry selection stores the stable Registry-entry identity;
lightweight / ad-hoc NPCs remain Registry-owned.

The selected-person card distinguishes those authorities and shows current
status, visibility, and content-rating metadata when available.

`UNAVAILABLE`, `LEGACY_UNRESOLVED`, and `UNRESOLVED` references remain visible
with explicit recovery guidance.

The FE Builder keeps its existing styling and `view.v1` contract.

## W11 Cross-Registry connection visual wiring

The Connections modal now exposes `From Registry` and `To Registry` selectors.
Blank means `This Registry`; choosing another Registry switches the corresponding
Location selector to that Registry's hydrated Location options.

Connection cards use the W9 application projection for qualified labels and mark
cross-Registry boundaries.

Missing remote endpoints remain visible with stable identity-preservation
guidance.

The visual surface is wired. The protected Creation Edit bridge that supplies
the saved Location Registry `currentCreationId` remains pending and is not
modified by W11.

## W12 Split visual wiring

The FE Builder now contains the complete creator-confirmed Split presentation:

```text
Analyze Split
Split Registry Preview
Validate Selected Split
Confirm & Execute Split
```

It presents deterministic authored-containment candidates, source-integrity
blocks, overlap-safe selection, server plan fingerprints/preservation checks,
commit blockers, explicit destructive confirmation, and the committing close
guard.

Application authority remains the W9 Chassis mirror.

The visual surface is wired, while the protected Creation Edit bridge that
supplies the saved Registry `currentCreationId` remains pending.
