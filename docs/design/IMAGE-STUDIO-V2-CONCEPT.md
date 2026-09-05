# Image Studio v2 concept preview

Written 5 Sep 2026 on branch `design/image-studio-v2-concept`. This is a
fixture-only concept, not a feature. It exists so Brian can click through
the whiteboard flow on one page and decide what to build for real.

## The flow

Create Assets, then Craft Images, then Assign and Publish.

Craft Images has four steps on the whiteboard: build image (today's
Generate panel), edit (pick a detected segment, write a prompt for that
region, optionally let an ingredient drive the edit), remix scene (two or
more Characters, one Location, an Outfit per Character, scene direction,
aspect ratio), then edit again. Assign and Publish sets the result as the
key reference image for a Character, Location, Outfit, Story, or
Adventure, and picks a visibility: Private, Internal, Public, or Canon.

## What was built

One preview route, `app/dev/ui-preview/image-studio-v2`, renders four
modes from one page with a mode switch: Generate, Edit, Remix, Assign.
Assign opens a drawer over the canvas. A Filled / Empty toggle at the top
swaps every mode between its filled fixture and its empty fixture.

Generate reuses today's composer View exactly as it ships
(`ImageStudioComposerView` with `imageStudioComposerDefaultFixture`), so
the ingredient tiles, options, prompt, coins line, and Generate button are
the production ones. Edit, Remix, and Assign reuse today's
`IngredientSlotView` tiles for every Character, Outfit, Location, and
edit ingredient slot, and today's `CrestfallSelect` for the aspect ratio.

Open it once a dev server runs on port 3001:
`http://localhost:3001/dev/ui-preview/image-studio-v2`. The page returns
not found in a production build, like every other preview route.

Flag for Brian: memory from an earlier session says `/dev/ui-preview`
is retired and review happens only on real signed-in pages. This brief
asked for the preview route explicitly, so it was built there. Nothing
outside `app/dev/ui-preview` was touched.

## What is fixture-only

Everything. No contract, no ViewModel, no Binding Shell, nothing under
`lib/`, no route changes, no package changes. Specifically:

- The result canvas and the session history strip are gradient
  placeholders, not images.
- Segment thumbnails are gradient tiles with a dashed region box. No
  detection runs. The segment list is a hand-written fixture of five
  regions (Face, Hair, Outfit, Left hand, Background).
- Quick actions on the edit bar (Precise edit, Recolor, Remove, Crop to
  region) only write to the preview feedback line.
- Remix never sends anything. The "Sent with this remix" manifest is a
  fixture list that shows the idea: roles and names travel, not copied
  descriptions.
- Assign and Publish never writes. Targets per type are fixtures.
  "Assigning is free" in the coins line is a placeholder sentence, not a
  pricing fact.
- Coin costs shown (3 per edit, 8 per remix) are invented for layout.
  Today's composer shows 5 per image from its own fixture.

## Kit pieces and file paths

All new Views live in one folder so they can be promoted or deleted as a
unit: `components/studio/image-studio/v2-concept/`.

| Piece | View | Fixtures |
| --- | --- | --- |
| ModeSwitch | `ModeSwitch.view.jsx` | `ModeSwitch.fixtures.js` (`modeSwitchDefaultFixture`, `modeSwitchEditFixture`) |
| SegmentList | `SegmentList.view.jsx` | `SegmentList.fixtures.js` (`segmentListFilledFixture`, `segmentListEmptyFixture`) |
| RegionEditBar | `RegionEditBar.view.jsx` | `RegionEditBar.fixtures.js` (`regionEditBarFilledFixture`, `regionEditBarEmptyFixture`) |
| RemixComposer | `RemixComposer.view.jsx` | `RemixComposer.fixtures.js` (`remixComposerFilledFixture`, `remixComposerEmptyFixture`) |
| AssignPublishDrawer | `AssignPublishDrawer.view.jsx` | `AssignPublishDrawer.fixtures.js` (`assignPublishDrawerFilledFixture`, `assignPublishDrawerEmptyFixture`) |

Page composition: `app/dev/ui-preview/image-studio-v2/page.jsx` (server
guard) and `ImageStudioV2PreviewClient.jsx` (client state, mode switch,
variant toggle, feedback line).

Reused as-is, not modified:

- `components/studio/image-studio/image-studio-composer/ImageStudioComposer.view.jsx` and its fixtures
- `components/studio/image-studio/ingredient-slot/IngredientSlot.view.jsx` and its fixtures
- `components/ui/CrestfallSelect.jsx`

## Each mode and its states

Generate. Filled: today's default composer fixture. Empty: same fixture
(the composer already carries its own empty and unavailable states on its
own preview route, so this page does not duplicate them).

Edit. Filled: five segments, Outfit selected, a region prompt, an Outfit
ingredient driving the edit, Apply edit enabled. The selected segment
also draws a dashed box on the canvas. Empty: no segments, the empty card
explains what to do, the prompt and quick actions are disabled, Apply
edit is disabled.

Remix. Filled: two Characters each with an Outfit tile (one Outfit
empty, showing "Character default" in the manifest), one Location, scene
direction, 16:9, manifest of five roles, Remix scene enabled. Empty: two
required Character tiles, one required Location tile, no direction, no
manifest, warning text, Remix scene disabled. Add Character is a button
that only reports to the feedback line.

Assign. Filled: drawer open, Character type selected, Seraphine Vale
chosen, Public visibility, publish enabled. Empty: Adventure type with no
assets, no target, Private, publish disabled with a hint. Changing type
clears the chosen target. On a 390 wide viewport the drawer is a bottom
sheet; at 1440 it is a right-side panel of 440 px.

## Terminology used

From `lib/shared/presentation/terminology.js`, read only: the creation
type STORYLINE displays as "Adventure", and OUTFIT as "Outfit". The
drawer's Adventure target therefore means a Storyline record. The
scenario category ADVENTURE displays as "Scenario" and is not what the
drawer means. Visibility labels Private, Internal, Public, and Canon come
from the whiteboard, not from terminology.js, which has no visibility
map. That is an open question below.

## Tokens and conventions

Every color, radius, and effect is a token from `app/theme.css`:
surfaces 1 to 4, line and line-strong, ink, ink-dim, ink-faint,
gold-ornament, gold-action, gold-deep, neutral-5 and 6, scrim and
scrim-strong, focus-ring, shadow-modal, radius-xs to lg and full,
control-md, state-disabled-opacity, status-warning-text, canvas.

Nothing had to be substituted. Two notes:

- Gold alpha tints (`/10`, `/45`) are written the same way the existing
  `IngredientSlotView` writes them, as Tailwind opacity on the token.
- Selected state uses a `gold-action` border and the check mark, since
  there is no dedicated selected-ring token beyond `focus-ring`.

Icons: the repo has no Lucide sprite file. Every studio component imports
Lucide icons from `lucide-react`, so these Views do the same. If a sprite
is the intended law, that is a repo-wide change and not made here.

Buttons: primary actions use the shared `cf-btn cf-btn--primary` class
that today's Generate button uses. No button text is uppercase. The
only uppercase text is the eyebrow labels, matching the existing
composer eyebrows.

There is no generic Kit drawer. The audit found only a domain drawer in
story rooms and a sheet variant of the Kit modal frame. The
AssignPublishDrawer here is its own View with the same scrim and surface
tokens the workbench bottom sheet uses.

## Competitor facts, for the doc only

OurDream tags up to six reference images as @img1 to @img6 inside a
required prompt and forces the user to paste a location description.
Grok Imagine shows auto-detected segments with thumbnails plus Precise
Edit, Colors, Remove Background, Make Video, and Crop.

Our advantage: ingredients already are references with roles. A
Character slot is not @img3, it is a Character whose description travels
with it. Remix therefore needs no pasted descriptions and no image
numbering, and the region edit can be driven by an Outfit rather than by
an anonymous upload.

## Open questions that need engine facts

None of these were guessed in the prototype. Each is a fixture until the
engine answers.

1. Segment detection: does the image engine return regions with masks,
   labels, and confidence, and can it return a thumbnail crop per region?
   The SegmentList assumes label, detail, and a region box.
2. Region edit contract: what does a masked edit request take (mask id,
   prompt, optional reference asset), and what does it cost in coins?
3. Remix contract: how many Characters can one scene take, is one Outfit
   per Character enforced by the engine or by us, and how are per-asset
   descriptions attached without copying text into the prompt?
4. Ratio for remix: is the ratio list the same as the composer's
   aspect-ratio field, or does scene generation support a different set?
5. Key reference image: which record types accept a key image today
   (Character, Location, Outfit, Story, Storyline shown as Adventure),
   and is it one image per record or one per visibility tier?
6. Visibility values: are Private, Internal, Public, and Canon real
   enum values on the media record, does Canon require a review step,
   and does any visibility change cost coins?
7. Edit again: after a remix, do detected segments persist per result,
   or does detection re-run on each new image?
8. History: does the session history need to distinguish Generate,
   Edit, and Remix results, and are edits stored as new media rows or as
   versions of the source?
