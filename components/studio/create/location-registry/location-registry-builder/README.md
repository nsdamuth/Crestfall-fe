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
