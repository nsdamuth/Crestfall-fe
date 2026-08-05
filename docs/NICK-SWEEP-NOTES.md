# Nick sweep notes (DRAFT)

Written by the overnight mechanical sweep, 4 Aug 2026. Marked DRAFT for
Brian's review before this goes to Nick. Plain language, no token names
where a description will do.

## What this covers

The overnight run converted the app's corner rounding, button shapes,
and delete-button colors onto the new design tokens, checked its own
work twice, and rendered every real page in the app to look for
regressions. It found 14 spots it will not touch on its own, and three
unrelated bugs it stumbled into along the way. This file is about all
of that, not the styling work itself, which is in docs/SWEEP-REPORT.md.

## Fourteen spots that need a decision before anyone touches them

Every one of these was flagged, not guessed at, because the fix isn't
a plain "change this number" swap.

**Ten of them are the same question, asked ten times: should a delete
or remove button ask "are you sure?" before it fires?** Right now none
of them do, they just delete immediately. The app already has a working
pattern for this elsewhere (a plain browser confirmation popup), so
turning it on is small, cheap work once someone says yes. One of the
ten (the weather module's "Remove" button, which currently wipes out
every tracker and guard on a location in one click, not just one item)
is the one worth doing first if only one gets done.

Packages: wardrobe builder, the location-registry attachments section,
the weather module config modal, the mechanics composition builder
(three separate buttons), mechanics status blocks, mechanics trackers,
and the NPC registry fields section.

**Two are "which look do we want" questions, not confirm-step
questions:**
- The character template's "core path complete" banner needs one of
  three approved banner looks picked for it.
- The story room chat panel has two findings where our own audit
  offered two different fixes instead of picking one, or offered none;
  it needs an actual look at the rendered screen to decide.

**Two are sizing calls on corner rounding that our rules don't cover
yet:**
- Custom ingredient editor's close button and the wardrobe builder both
  have a rounding value with no matching size tier.
- Mechanics status blocks and mechanics trackers both have two
  differently-shaped buttons sitting next to each other with no stated
  target shape.

**Two are "does this count as small nested art or a full-size panel"
questions:**
- A small clothing thumbnail nested inside a larger card.
- The "my creations" package has a background darkness and a blur
  effect that don't state which lighter/heavier version they should be.

**One is a layout call:** the public profile hero page has a stats
block sitting somewhere our banner-layout rules don't have a slot for.
It's not a one-line fix, it's a real "where does this go" decision.

## Contract and ViewModel impact

Almost none of this touches contracts (the documented prop shapes for
each component). Adding a confirm-step using the browser's built-in
confirmation popup is a change inside a component's logic file, not to
its props, based on how the same pattern already works elsewhere in
this codebase. If Brian wants a custom-styled confirm dialog instead of
the plain browser popup, that's a bigger job and would likely need new
props, but nobody has asked for that yet, so treat it as a "small job"
question until told otherwise.

## Bugs found along the way, not part of this sweep's job

Found while rendering every page to check the styling work, not
introduced by it, and not touched:

1. Two entire pages are broken: any story-URL under **/chronicle/** and
   any story-URL under **/stories/** crash with an error screen. The
   files that are supposed to build those pages are completely empty,
   zero bytes, dated before this sweep started. This is a real "this
   page doesn't work" bug, worth fixing regardless of anything else.
2. A card component used on the homepage and a few browsing pages
   throws a harmless-but-real code warning every time it renders (a
   React "key" mistake). Doesn't break anything visually, but it's a
   small, free code fix.
3. The locations listing page shows two broken image placeholders
   instead of real cover art, with a failed image request in the
   background. Looks like missing or misnamed image files, not a
   styling problem.

None of these three are anything this sweep was asked to fix, and none
of them were caused by it. Flagging them here so they don't get lost.

## Update, overnight closing pass, 4-5 Aug 2026

Bug 1 above, the two empty-page routes, is still broken. Confirmed
zero-byte, not touched.

Absorption gap check, read-only: the presentation shells for the Story
transcript work are already ahead of schedule. `StoryRoomStatePanel`,
`StoryRoomMessage`, `StoryRoomTranscript` and their ViewModels,
including `useStoryRoomChat`, already exist in this repo (that hook is
one directory level different from the path in your absorption doc:
it's under `components/studio/story-rooms/hooks/`, not a top-level
`hooks/` folder). What's still entirely missing is every summary,
export, and share API proxy route, and the public share page at
`app/share/chat/[token]/route.js`. That's the real remaining scope for
the absorption sprint.

Postgraphile check, read-only: the container is up on port 5678 and
`services-api` is already calling it for several domains (community,
creations, profile, engagement, games, chat, image-generation, media),
not mocks. This front end already has `CRESTFALL_API_INTERNAL_URL`
pointed at services-api and at least one route
(`/api/community/creations`) confirmed live end to end this session.
If the plan is "read live data instead of fixtures," the fast first
step is a grep for which FE API routes still return local mocks,
since several already don't.
