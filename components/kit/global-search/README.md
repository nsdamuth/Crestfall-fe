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
- Keyboard: arrows move, Enter opens, Escape closes. No shortcut opens
  the search (browser review round 2, R1).
- The panel shows only once the field has text; an empty field opens
  nothing at any width. The panel carries no instruction text: no
  helper block, no footer; the no-results copy is exactly "Nothing
  matches yet." (browser review round 2, R2).
- Under 700px the field opens a sheet at about 80 percent of the
  viewport (`KitModalFrame` variant sheet) with the input pinned at
  the top and the results scrolling below; every row is 44px or
  taller. At 700px and up only the results list scrolls, capped at
  about five rows plus a section title, with the section titles
  sticky. Both caps are defined
  once in `kitGlobalSearchLayout.js` (follow-up 1, 10 Sep 2026); the
  View carries no height literal.
- Honest data: a section a route cannot serve carries status "soon"
  and renders disabled with the Soon chip and the title "Not available
  yet"; a row with no destination renders the same way.

## Boundary

```text
StudioTopBar.view.jsx
  -> KitGlobalSearch (Binding Shell, components/kit/KitGlobalSearch.jsx)
       -> useKitGlobalSearchViewModel (value, open flag, active row,
          grammar, keyboard, dismissal)
       -> KitGlobalSearch.view.jsx (field, popover, sheet, sections,
          rows, suggestion rows, loading, empty, error, soon)
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

`KitGlobalSearch.fixtures.js`: default, empty, closed (empty field, no
panel), loading, error, soon, scoped ("my lilith"), prefixed
("character: lilith"), suggestions (":"), longest.

## Copy

Sentence case, American English, no em dashes. Placeholder "Search..."
at every width, accessible name "Search" (RULED, follow-up 1). Section
titles "Your items" and "Community". Empty: exactly "Nothing matches
yet." (RULED, browser review round 2). Error: "Search could not load.
Try again in a moment." Loading: "Loading your items and the
community". Soon: "Not available yet" with the Soon chip. No helper
block and no footer anywhere in the panel.

## Diagnostics

```bash
npm run diagnostics:loom:global-search
```

## Review

No preview route (RULED: review only on real signed-in pages). Brian
reviews in the browser on any studio page after push.
