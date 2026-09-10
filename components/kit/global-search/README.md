# KitGlobalSearch

The top bar global search. One field searches everything the app can
list today; results open in a panel directly below the field as the
user types. Built in FE/GLOBAL-SEARCH session 1 (10 Sep 2026) from the
rulings recorded in `docs/references/global-search/NOTES.md`.

## Purpose

- Two sections with plain titles: "Your items" first, then
  "Community". Each shows a few rows in the panel's bounding box;
  scrolling inside the panel reveals more; typing narrows.
- Row grammar (Raycast): icon, title, then "Type · Page" right-aligned
  in quiet ink at 700px and up, as a second line under the title on
  phones.
- Scope words steer the sections ("my lilith", "community lilith",
  "global lilith"). Typed prefixes narrow to one type, Discord style
  ("character: lilith"); typing a colon shows the prefixes as
  suggestion rows. The grammar lives in `kitGlobalSearchQuery.js`.
- Keyboard: arrows move, Enter opens, Escape closes; Cmd+K (Mac) or
  Ctrl+K opens the search from anywhere on the page.
- Under 700px the field opens a full-height sheet (`KitModalFrame`
  variant sheet) with the input pinned at the top and the results
  scrolling below; every row is 44px or taller.
- Honest data: a section a route cannot serve carries status "soon"
  and renders disabled with the Soon chip and the title "Not available
  yet"; a row with no destination renders the same way.

## Boundary

```text
StudioTopBar.view.jsx
  -> KitGlobalSearch (Binding Shell, components/kit/KitGlobalSearch.jsx)
       -> useKitGlobalSearchViewModel (value, open flag, active row,
          grammar, keyboard, shortcut, dismissal)
       -> KitGlobalSearch.view.jsx (field, popover, sheet, sections,
          rows, suggestion rows, hint, loading, empty, error, soon)
            -> ../KitModalFrame (phone sheet)
            -> ../form-field/SoonChip
            -> ../dropdown/useAnchoredPanel (PHONE_WIDTH_QUERY only)
```

Data never enters this package by fetch. The caller (the top bar
adapter, `components/studio/studio-top-bar/useGlobalSearchAdapter.js`)
passes two source groups, `own` and `community`, each
`{ items, status, errorMessage }`, plus `onRequestData` (fired when the
panel opens, so the caller can load on first open) and `onNavigate`
(fired with a row's href when the user chooses it). The View never
imports next/navigation.

## States (fixtures)

`KitGlobalSearch.fixtures.js`: default, empty, loading, error, soon,
scoped ("my lilith"), prefixed ("character: lilith"), suggestions
(":"), longest.

## Copy

Sentence case, American English, no em dashes. Placeholder "Search
everything". Section titles "Your items" and "Community". Empty:
"Nothing matches yet. Try fewer words, or narrow with my, community, or
a type like character:". Error: "Search could not load. Try again in a
moment." Loading: "Loading your items and the community". Soon:
"Not available yet" with the Soon chip.

## Diagnostics

```bash
npm run diagnostics:loom:global-search
```

## Review

No preview route (RULED: review only on real signed-in pages). Brian
reviews in the browser on any studio page after push.
