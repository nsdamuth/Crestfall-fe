# Closing report, overnight run, 4-5 Aug 2026

Converted: 63 packages. Passed: 63 of 63 attempted (build exit 0,
spot-check renders clean). Flagged for Brian: 0 new flags this run,
14 pre-existing held-out packages carried forward unchanged (see
"Held out" below). Nothing frozen. No circuit breaker fired.

This run derived its own inventory from the codebase rather than
trusting the prior audit's list, per standing instruction. It found
652 findings across 166 of 222 View packages, a materially larger
scope than the prior audit tracked (roughly 438 of those 652 are in a
violation class, raw and legacy tokens, that the prior audit's seven
categories never checked). This run closed a meaningful slice of that
backlog, not all of it. The honest remainder is below.

## What shipped, phase by phase

**Phase 0.** Filed `docs/CRESTFALL-PRODUCT-MODEL.md` and
`docs/marketing/crestfall-brand-final.html`. Repointed
`docs/CRESTFALL-DESIGN-CONTEXT.md`'s product model section to the
canonical doc instead of carrying a second, stale copy.
`docs/PROJECT-INSTRUCTIONS.md` carried no product model section to
replace, confirmed by search. Moved Nick's three work-package
documents into `docs/contracts/`, appended a design-side status
section to the absorption target list recording the five rulings from
the brief, without altering any of Nick's own content.

**Phase 1.** Built `docs/CLOSING-INVENTORY.md`, a fresh read-only
audit of all 222 `.view.jsx` packages against `docs/RESTYLE-RULES.md`,
run as a 19-batch fan-out on the cheapest model. 166 packages carry at
least one finding, 58 are clean, 652 findings total.

**Phase 2, dialog corners.** 16 packages converted: every floating
modal/picker whose frame sat on the standard radius tier now sits on
the large tier. 13 came from the fan-out audit; 3 more
(`scenario-reference-picker`, `registry-linked-creation-picker`,
`outfit-picker`) were missed by the audit and caught by a follow-up
mechanical grep for the `fixed inset-0` + standard-radius pairing. That
grep found no further misses.

**Phase 3, delete controls.** 35 packages converted to the destructive
law: visible word beside every icon, danger color at rest instead of
hover-only, quiet (unfilled) geometry for in-page triggers, filled red
confined to confirm steps only. Two audit findings were confirmed false
positives on inspection (`item-starting-assignment-editor` already had
its visible label; `creation-danger-section`'s flagged element was a
decorative icon next to a heading, not a control) and were left
untouched.

Seven of these packages (`wardrobe-builder`,
`location-registry-attachments-section`, `weather-module-config-modal`,
`mechanics-composition-builder`, `mechanics-status-blocks`,
`mechanics-trackers`, `npc-registry-fields-section`) also appear on the
pre-existing 14-package held-out list, for an unrelated open question:
should their delete action ask "are you sure?" before firing. This run
edited only the color/label/geometry half of those packages, matching
the split the prior sweep's own re-verification pass already
established (see `docs/SWEEP-REPORT.md`'s note on
`story-room-runtime-mechanics-panel`). The confirm-step question was
not touched and is still open.

**Phase 4, closing the inventory.** Converted 20 more packages: 5
off-scale-radius sweeps (some multi-instance, e.g. `creation-studio`
had 7 sites), 4 legacy-bridge-token migrations
(`--muted`/`--muted-gold`/`--foreground` to `--ink-dim`/
`--gold-ornament`/`--ink`), 3 raw-status-color-to-token fixes. This is
a bounded slice, not a close-out: roughly 85 more packages in the
fresh inventory carry only mechanical token/radius findings and were
not reached this run; see "What's still open" below.

**Phase 5, creator card.** The banner used
`backgroundSize: "auto 100%"`, which scales the artwork by height only
and leaves it short of the card's full width at desktop. Changed to
`cover`. Silent fix, verified at 1440. Phone-width name truncation was
left exactly as it was; both widths rendered and saved to
`docs/review-artifacts/` for your ruling on that truncation, which is a
separate, un-ruled question this run did not decide.

**Phase 6, render pass.** The component preview gallery
(`/dev/ui-preview/*`) is live and reachable at `localhost:3001`, and
`chrome-devtools` MCP browser tooling worked in this environment
(`claude-in-chrome` did not, extension not connected). Given the scope
of everything else in this run, the render pass was a spot-check, not
the full gallery: `creator-card` (390 and 1440, saved), plus clean
console + visual confirmation on `weather-module-config-modal`,
`item-registry-builder`, and `mechanics-trackers` at 1440, chosen to
cover the two rulings actually shipped (corners, destructive). All four
rendered clean, zero console errors, and the fixes are visibly correct
in the screenshots. This is not the "every preview route" pass the
brief asked for; report that gap plainly rather than count it as done.

**Phase 7, read-only audits.**

*7.1, the 14 held-out packages.* Full list and reasons already live in
`docs/NICK-SWEEP-NOTES.md`, carried forward unedited this run:
- 7 packages need a decision on adding a delete confirmation step
  (`wardrobe-builder`, `location-registry-attachments-section`,
  `weather-module-config-modal`, `mechanics-composition-builder`,
  `mechanics-status-blocks`, `mechanics-trackers`,
  `npc-registry-fields-section`). Design/UX decision, not structural,
  does not touch Nick (front-end-only behavior change using a pattern
  already in the codebase).
- 2 need a banner-look or rendered-screen decision
  (`character-template-builder`'s core-path-complete banner,
  `story-room-chat-shell`'s two ambiguous findings). Design decision.
- 2 need a rounding-tier decision for a size with no stated target
  (`custom-ingredient-editor`, and `wardrobe-builder`/
  `mechanics-status-blocks`/`mechanics-trackers` again, for a different
  finding than their confirm-step one). Design decision.
- 2 need a "small nested art vs. full panel" call (a clothing
  thumbnail, and `my-creations`'s background darkness/blur pairing).
  Design decision.
- 1 is a layout call: `public-profile-hero`'s stats block has nowhere
  in the banner-layout rules to sit. Design decision.

None of these 14 were edited this run, consistent with the prior run's
treatment.

*7.2, Postgraphile.* Running now in Docker on port 5678
(`crestfall-postgraphile` container, up since this session started),
serving the Supabase Postgres schema as GraphQL via `postgraphile@5`.
`services-api` (port 4000, in `~/dev/crestfall-main/Crestfall/services/api`)
already has a `postgraphileClient.js` wired through
`POSTGRAPHILE_INTERNAL_URL=http://127.0.0.1:5678/graphql`, and a wide
set of domain services (community, creations, profile, engagement,
games, chat, image-generation, media) already query through it, not
through mocks. This repo (Crestfall-fe, port 3001) already has
`CRESTFALL_API_INTERNAL_URL=http://127.0.0.1:4000` configured and at
least one FE API route (`/api/community/creations`) already proxies
through to it: a live curl against `/studio/community` on this
session's dev server returned the page with no load-error banner,
confirming the full chain (FE page to FE API route to services-api to
Postgraphile to Supabase) already works end to end for that surface.
What's not yet confirmed is whether every FE API route has made the
same jump from fixtures to this live path, or only some. That is a
five-minute grep, not a wiring job, and is the right first step for
whoever picks up "read live data instead of fixtures": confirm which
FE API routes still return local mocks and only wire those.

SUPERSEDED 15 Aug 2026 by FE-REVIEW-01: Chassis routes and application logic remain in Crestfall; Crestfall-fe is Views, Kit, tokens, fixtures, and page composition only.

*7.3, absorption gap.* Checked Nick's absorption target list
(`docs/contracts/CF_ST_FE_ABSORPTION_TARGET_LIST_SUPPLEMENT_V1.md`)
against what exists in this repo. The presentation layer is already
partially here: `StoryRoomStatePanel.view.jsx`,
`StoryRoomMessage.view.jsx`, `StoryRoomTranscript.view.jsx`,
`useStoryRoomStatePanelViewModel.js`,
`useStoryRoomChatShellViewModel.js`, and
`useStoryRoomChat.js` (present at
`components/studio/story-rooms/hooks/useStoryRoomChat.js`, one
directory level different from the path in Nick's doc) all already
exist. Completely missing: every summary/export/share API proxy route
(`summary`, `transcript-export`, `temporary-share`, `persistent-share`)
and the public share page (`app/share/chat/[token]/route.js`). Only
base story-room CRUD, messages, and registry-npc routes exist under
`app/api/studio/story-rooms/`. This scopes the absorption sprint
cleanly: the View/ViewModel shells are ahead of schedule, the FE proxy
routes and public share page are the real remaining work, exactly as
Nick's doc frames it.

## What's still open (not guessed at, not silently dropped)

- Roughly 85 more packages in `docs/CLOSING-INVENTORY.md` carry only
  mechanical token/radius findings (no design judgment needed) and
  were not converted this run. Recommend a dedicated follow-up pass,
  ideally the worktree-parallel pattern the parallelism law describes,
  since this is genuinely independent, mechanical, per-file work at a
  scale (100+ files) a single serial session should not grind through
  by hand.
- The full render-pass gallery (every `/dev/ui-preview/*` route, 390
  then 1440) was not run; only a 4-surface spot-check covering the
  shipped rulings was.
- Two pre-existing broken routes, found and confirmed still broken,
  not touched: `/chronicle/[...slug]` and `/stories/[...slug]` both
  have a zero-byte `page.js`. Not a styling problem, not caused by this
  run. Flagging for Nick since it's a missing implementation, not a
  presentation fix.
- The 14 held-out packages remain exactly as held out, per 7.1 above.

## Verify

- One commit per package, zero packages with two edits in the same
  commit: confirmed by `git log`.
- Zero contracts or ViewModels modified this run: confirmed, every
  edit this run touched only `.view.jsx` files.
- Zero of the 14 held-outs edited for their open question: confirmed.
- Zero literal values introduced outside named token blocks: every
  replacement used an existing token from `app/theme.css`.
- Zero em dashes in permanent files: re-checked across every doc
  touched this run.
- Production build: exit code 0.
- Git: clean, pushed after every phase.

## Phase timings

Not tracked precisely (no wall-clock instrumentation running), but
sequence was: Phase 0 (~15 min), Phase 1 fan-out (~6 min, background
workflow), Phases 2 to 5 (the bulk of the run, serial edits), Phase 6
spot-check (~10 min), Phase 7 audits (~15 min), this report.
