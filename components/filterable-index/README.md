# Filterable Index LOOM package

## Purpose

This package separates the reusable public archive filter surface from
Next.js URL ownership and Crestfall's `LoreCard` implementation.

## Boundary

```text
FilterableIndex.jsx
  Binding Shell
  ├─ usePathname / useRouter / useSearchParams
  └─ LoreCard injection

filterable-index/
  FilterableIndex.view.jsx
    Portable Skin
  useFilterableIndexViewModel.js
    Chassis / URL-shaped filtering state
  FilterableIndex.contract.js
  FilterableIndex.fixtures.js
  filterableIndexDiagnostics.mjs
```

## Chassis responsibilities

The ViewModel preserves and owns:

- `q` search parsing and projection
- comma-separated `tags` parsing and projection
- route-provided dropdown filter keys
- case-insensitive search and equality matching
- array-valued filter matching
- tag intersection behavior
- visible-tag derivation after search and dropdown filtering
- unique sorted dropdown values
- asset-base path resolution
- `cardText` → `subtitle` fallback
- no-scroll URL replacement intent

Changing search or a dropdown clears active tags, matching the original
behavior. Selecting **Clear** removes the complete query string.

## Portable Skin responsibilities

The View renders only:

- the search control
- dropdown controls
- the horizontally scrollable tag rail
- the filtered card region
- the empty-result message

It does not import Next.js navigation, `LoreCard`, Crestfall data modules,
client APIs, Supabase, or PostGraphile.

## Production integrations

The unchanged root import remains used by:

```text
/characters
/locations
/factions
/stories
/chronicle
```

Each route continues to supply its own entries, dropdown definitions, and
empty-state wording.

## Preview

Development only:

```text
/dev/ui-preview/filterable-index
```

The preview uses local fixtures and a local card renderer. It does not read
production data or alter the browser URL.
