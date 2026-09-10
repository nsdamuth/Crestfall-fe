# Global search reference notes, 10 Sep 2026

Brian's requirements for the top bar global search (FE/GLOBAL-SEARCH
session 1), the rulings from the plan gate, what the repo and the
Chassis can serve today, and what was learned from reference patterns.
Later sessions read this file before touching the search. Reference
screenshots land in this folder as numbered slugs
(01-discord-search-filters.png, 02-raycast-results-list.png, and so
on), one line per image added here as they arrive.

## Brian's requirements (the brief, 10 Sep 2026)

- One search field in the top bar searches everything: assets
  (characters, player characters, poses, outfits, locations, presets),
  stories, adventures, community profiles and creators, lore, and
  generated media.
- Results open in a panel directly below the field as the user types.
  Row grammar like Raycast: icon, title, then on the right the type and
  the page it lives on.
- Two sections with plain titles: the user's own items first, then
  community. Each section shows 3 to 5 rows in the panel's bounding
  box; scrolling inside the panel reveals more; typing narrows.
- Scope words steer the sections: "my lilith" shows only the user's
  own; "global lilith" or "community lilith" shows only community.
  Typed type prefixes narrow to one type, Discord style, presented as
  suggestions when the user types a colon.
- Keyboard: arrows move, Enter opens, Escape closes; a shortcut opens
  the search from anywhere.
- Choosing a row navigates to that item's page with that item selected
  or filtered in place, using the page's existing filter or route
  parameter. Never a guessed URL.
- Empty and error states: calm copy, no shame, a hint of the scope
  words and prefixes.
- Mobile and every width: on phones the field opens a full-height sheet
  with the input pinned at the top and the results scrolling below;
  44px targets; no overflow; no clipped panel at any width; the results
  panel never wider than the viewport.
- Kit shape: LOOM, every value through the design system, contract and
  fixtures. Built into the real top bar. No preview routes.
- Copy: American English, sentence case, no em dashes, coins is the
  only word for the currency, retired words never.
- Data honesty: own items from data the app already fetches or from
  list routes that exist; community only through a route that exists.
  Where no route exists, the section renders the honest Soon treatment
  (disabled, Soon chip, title "Not available yet") and the gap file
  states the route the frontend wants.

## Rulings at the plan gate (GO, 10 Sep 2026)

1. Result row layout, option 1: one line, icon, title, then
   right-aligned "Type · Page" in quiet ink at 700px and up; the meta
   drops to a second line under the title on phones. Rejected: a type
   chip with the page as a second line (two visual systems, chips are
   reserved for filters); the page named once in the section title
   (the page varies inside a section).
2. Prefix vocabulary and scope words, option 1: scope words `my` and
   `community` (`mine` and `global` accepted as synonyms); eleven
   singular colon-terminated prefixes: character:, player:, pose:,
   outfit:, location:, preset:, story:, adventure:, creator:, lore:,
   media:. Typing a colon with no recognised word before it shows the
   eleven prefixes as suggestion rows. Scope word and prefix combine
   ("my character: lilith"). Rejected: plurals and short aliases
   (double the vocabulary, a mistyped alias silently becomes search
   text); a chip row instead of typed prefixes (Brian ruled typed
   prefixes, and chips would compete with the filter bar grammar).
3. Open shortcut, option 1: Cmd+K on Mac, Ctrl+K elsewhere, hinted
   quietly inside the field at 700px and up. Rejected: slash (the chat
   composer already uses slash for commands); both keys (two shortcuts
   to hint and document for one field).
4. Data approach, option 1: fetch once on first open, filter in the
   browser. The top bar adapter loads the own lists and the community
   lists in parallel when the panel first opens, holds them for the
   session, refreshes on the next open after five minutes, and filters
   in memory as the user types. Rejected: fetch on every keystroke
   (the routes take no query, so each keystroke would re-download the
   whole catalog); community rendered Soon until a search route lands
   (the community routes exist and the Community page already searches
   them client-side).

Carried in the plan, not a fourth decision: generated media is
searchable by its prompt text, but no page can open with one output
selected, so media rows render Soon with "Not available yet" this
session.

## Premises verified in the repo and the Chassis (10 Sep 2026)

- No search route exists anywhere in the Chassis: no `/v1/search`, no
  text parameter on any list route, no full-text or ILIKE query. Every
  search in the product filters an already downloaded list in the
  browser.
- List routes that exist and are proxied in this repo, all taking no
  query text: owned creations (`/api/creations?view=summary`),
  community creations (`/api/community/creations`), stories in
  progress (`/api/studio/story-rooms`), community creators
  (`/api/community/creators`), the user's own generated media
  (`/api/studio/image-generation/jobs?limit=60`, capped at 60 per page
  server-side). Community lore reaches the frontend through community
  creations with type LORE. No route lists community media.
- Destinations that select an item: `/studio/v2/editor/[id]` (any
  owned creation; a timeline renders the timeline builder),
  `/studio/creations/[id]` (public creation or lore publication),
  `/studio/v2/stories/[id]` (a story in progress),
  `/studio/v2/creators/[handle]`, `/studio/v2/lore/timelines/[id]`.
  Every list page filter (Vault, Community, Stories, Adventures, Lore,
  Images, Creators) is state-only with no URL parameter, so "filtered
  in place" is not available on any page today. The Images page
  ignores the `?creation=` the Vault emits.
- The shell fetches no lists (only account and capabilities); there is
  no SWR or react-query cache. The adapter fetches on first open.

## Type to destination (what a chosen row opens)

| Type | Own row opens | Community row opens |
|---|---|---|
| Character, Player character, Pose, Outfit, Location, Image preset | `/studio/v2/editor/[id]`, page label "Editor" | `/studio/creations/[id]`, page label "Creation page" |
| Story (template) | `/studio/v2/editor/[id]`, "Editor" | `/studio/creations/[id]`, "Creation page" |
| Story (in progress) | `/studio/v2/stories/[id]`, "Stories" | none |
| Adventure | `/studio/v2/editor/[id]`, "Editor" | `/studio/creations/[id]`, "Creation page" |
| Creator | none | `/studio/v2/creators/[handle]`, "Creators" |
| Lore (publication) | `/studio/v2/editor/[id]`, "Editor" | `/studio/creations/[id]`, "Creation page" |
| Lore (timeline) | `/studio/v2/lore/timelines/[id]`, "Lore" | none (TIMELINE is not in the community allowlist) |
| Media | Soon, no destination selects an output | Soon, no route |

## Data per type (what the search reads today)

| Type | Own source | Community source |
|---|---|---|
| Assets (six types) | `/api/creations?view=summary` | `/api/community/creations` |
| Story | `/api/studio/story-rooms` plus ROOM_TEMPLATE creations | ROOM_TEMPLATE creations |
| Adventure | STORYLINE creations | STORYLINE creations |
| Creator | none | `/api/community/creators` |
| Lore | LORE and TIMELINE creations | LORE creations |
| Media | `/api/studio/image-generation/jobs?limit=60` | none, gap |

The gap file is `docs/handoffs/GLOBAL-SEARCH-BACKEND.md`.

## Reference patterns (Mobbin, pulled 10 Sep 2026)

- Gusto's search palette shows the title on the first line and a
  breadcrumb-style destination line under it ("Reports, Reports
  library"), which is the phone treatment used here: the meta drops
  under the title when the row is too narrow for one line.
- StackAI's palette right-aligns a quiet type label ("Tab") on every
  row and keeps a keyboard-hint footer, the desktop treatment used
  here.
- Customer.io's search adds a category filter chip and a hint footer
  reading the keys; the category idea maps to the typed prefixes and
  the footer to the keyboard hint line.
- Whop's search groups results under type tabs with a footer reading
  navigate, select, close; the tabs were rejected at the gate in favor
  of typed prefixes.
- Slopes and Hypelist (phone) pin the input at the top of a sheet with
  the list scrolling under it and the keyboard below, the phone shape
  used here.

## Frontend follow-ups (not backend gaps)

- The Images page needs an output parameter (for example `?output=`)
  that opens the viewer on one item, so media rows can navigate. Until
  it exists the rows render Soon.
- Once a page reads a filter from the URL (none does today), the
  search can route to that page filtered in place instead of to the
  item's page; the destination table above changes then, and only
  then.

## Copy

Placeholder "Search everything". Section titles "Your items" and
"Community". Hint (empty query): "Type to search everything. Narrow
with my or community, or a type like character:". Empty: "Nothing
matches yet. Try fewer words, or narrow with my, community, or a type
like character:". Error: "Search could not load. Try again in a
moment." Loading: "Loading your items and the community". Soon: "Not
available yet" with the Soon chip. Keyboard hint: "Up and down to move,
Enter to open, Esc to close".
