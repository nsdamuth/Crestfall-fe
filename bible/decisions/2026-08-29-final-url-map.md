# DECISION: final URL map for the nine pages, OPEN

Date drafted: 29 Aug 2026 (R7, Home PRD approval session). Gate:
other (address architecture, pre-cutover). Decider: Brian. Status:
OPEN, unruled. Drafted per bible/templates/GATES.md.

Standing facts this decision sits on:

- The nine pages build and stay at /studio/v2/<page> until the
  all-nine-at-once cutover; no page cuts over alone
  (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md section 6).
- Whatever is ruled here, the rename happens in ONE move at cutover:
  /studio/v2/** addresses are never renamed piecemeal.
- Routes are Chassis lane (FE-REVIEW-01; bible/LANES.md). This
  document proposes and records; the route work itself is a future
  CR to Nick, flagged in bible/prds/2026-08-29-home.md and to be
  filed in docs/CONTRACT-REQUESTS.md once this map is ruled. Nothing
  is filed by this draft.

## The three options

| # | Option | Real cost (time, packages touched, rework risk) |
|---|---|---|
| 1 | Clean top-level paths (RECOMMENDED): /home, /stories, /adventures, /studio, /images, /vault, /community, /creators, /lore | Largest rename distance from today, but one mechanical move at cutover; shortest, most shareable, most crawlable addresses; matches the nine-page model naming exactly. Cost rider: /studio collides with today's live root, so the legacy /studio/** pages must retire (already the ruled post-live sweep) and the Chassis must own redirects from every old address; that redirect table is the bulk of the CR |
| 2 | Section-grouped paths: /play/home, /play/stories, /play/adventures, /create/studio, /create/images, /create/vault, /explore/community, /explore/creators, /explore/lore | Encodes the three-section model in the address; no collision with /studio legacy root. Cost: longer addresses users retype, section membership frozen into URLs (moving a page between sections later breaks links), and the sidebar already communicates grouping, so the URL carries it twice |
| 3 | Keep the /studio prefix, drop v2: /studio/home, /studio/stories, and so on | Smallest rename distance and simplest redirects. Cost: "/studio/studio" or an inconsistent exception for the Studio page; the prefix is a legacy artifact with no product meaning post-cutover; least clean for sharing and search |

Recommended: option 1, because the nine pages ARE the site after
cutover and their addresses should read like it; the collision cost
lands in a redirect table the post-live sweep needs anyway.

## Ruling

OPEN. Selected: none yet. Reply per the vocabulary (GO rules option
1 as recommended; NO asks for a new set; HOLD names the trigger).
Feedback on all three is required when ruled; the two rejections
carry the most signal.

## Carried into

When ruled: a CR to Nick in docs/CONTRACT-REQUESTS.md (the rename
and redirect table, one move at cutover), and the cutover step list
in docs/CRESTFALL-PRODUCT-MODEL-UXUI.md section 6.
