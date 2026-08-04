# Crestfall design context

## What Crestfall is

Crestfall is a storytelling and character-creation platform by Anthology
Interactive. This repository, Crestfall-fe, is its front end — an
independent repo from the Crestfall services API and from the original
Crestfall FE.

## The product model

Assets are characters, player characters, locations, outfits, scenarios,
and lore. Everything starts private.

A Story is the named playable bucket that gathers assets into something
you can play.

An Adventure is the published state of a Story: public, playable,
remixable. There is no separate Adventure builder.

Visibility is one four-state enum everywhere: Private, Internal, Public,
Canon.

The words Arc and Codex are retired and never appear in copy.

KNOWN NAMING GAP: this repo's current code does not yet match the ruled
model. The playable bucket is named Room Template, and Adventure exists
as a Scenario category value rather than a published state. Renaming
these is Nick's, not the design side's, and is owed before launch. The
restyle does not touch it.

## Typography and design language

Two type families carry the whole system. Body and UI copy is set in
Inter (the sans token). Titles, page heads, and display moments are set
in Cormorant Garamond (the display token) — reserved for that role, not
used for body copy.

The accent color is gold, expressed through several tokens depending on
role (ornament, bright, action) rather than one flat value, so gold can
sit correctly on canvas, on artwork, or as an interactive accent without
losing contrast.

Three status colors exist for state only — success (warm sage), warning
(burnt amber), and danger (brick red) — never for decoration, charts, or
hover effects, and every use ships with a word beside it. There is no
fourth "info" color; informational copy reads through the neutral ink
scale like any other text.

Every value in the system is a token defined once and reused, not a
literal color or size repeated at each call site. RESTYLE-RULES.md is
the canonical source for what each token is and where it applies.

Three banner treatments exist, and only these three (ruled 4 Aug
2026, RESTYLE-RULES.md): (a) a bottom promo banner, full width at page
end, with a uniform screen and copy/CTA centered; (b) a banner card,
in-flow, with copy/CTA bottom-left and a fade from the left; (c) a top
banner at the page head, with text/CTA bottom-left and a fade from the
bottom. There is no fourth treatment and no per-instance settings —
fade direction and copy position are fixed by which of the three a
given banner is.

Corners come in two sizes only (ruled 4 Aug 2026, amended 4 Aug 2026),
sorted by role, not by size: standard, for every control (buttons,
inputs, chips, swatches) and every surface that sits in a grid
alongside siblings (cards, tiles, rows), and also for anything nested
inside a large-radius panel; large, for every surface that floats
above the page (modals, pickers, sheets, drawers, popovers) and every
in-flow surface that spans the full content width (the bottom promo
banner/endcap, empty states, the bulk bar). Nothing else.

OPEN QUESTION, not yet ruled: whether the continue card / in-flow
banner card takes the standard or large tier. RESTYLE-RULES.md's
Corners amendment currently states both at once (Open question 2) —
Brian rules which before batch two converts `.continuecard` or any
package built the same way. Shape carries meaning on top of the
corners rule regardless of how that question resolves:
fully rounded (a pill) is reserved for tags and icon buttons only —
every clickable button, everywhere, at every density, is a
soft-cornered rectangle, never a pill. That includes Follow and View
profile on the creators page, which read as pills today and need to
change. The rule of thumb: shape alone should tell the eye "this is a
label" from "this is a button you can press."

Destructive actions (delete, remove, discard) never get a different
size or shape from an ordinary button — same height, same corners,
same padding, never wider, never a lone button stranded on its own at
the bottom of a screen. An in-page delete trigger is quiet: no fill,
just the danger-red word next to a plain icon. Filled danger-red
appears in exactly one place — the confirming button inside a "are you
sure" step — and that is the only filled red anywhere in the app.
Every destructive action ships with a word next to it; an icon alone
is never enough.

## The LOOM file shape

Most converted UI packages follow one shape, with responsibilities kept
deliberately separate:

- **Binding Shell** (e.g. `StudioTopBar.jsx`) — owns Crestfall-specific
  integration: Next.js navigation, application state, host adapters,
  route behavior, ViewModel wiring.
- **ViewModel** (e.g. `useStudioTopBarViewModel.js`) — normalizes input
  and prepares props for the View.
- **Portable View** (e.g. `StudioTopBar.view.jsx`) — owns presentation
  only. A View does not touch database access, Supabase product data,
  services-api calls, persistence, router behavior, or business rules
  that belong to Crestfall services. It receives data and callbacks
  through props.
- **Contract** — documents the expected shape of props and behavior.
- **Fixtures** — provide local, deterministic states for previews and
  isolated testing, without depending on live APIs.

## The quality floor

A View is presentation-only and stays that way — no direct product-data
access, no bypassing the frontend API and services-api boundaries, no
business logic pulled into page components.

Changes are the smallest edit that satisfies the task. Existing props
and behavior are preserved unless the task requires a contract change;
when the prop surface changes, the contract is updated with it; when a
new visible state is needed, a fixture is added for it.

Every change is checked by the agent on a rendered page, not assumed
from a file read — at 390 width and then at 1440 width (768 is retired
from review). A production build should finish with exit code 0. The
repository may carry inherited lint findings; a task does not rewrite
unrelated areas just to make lint pass unless lint cleanup is the
assigned task.

## Where the sweep stands

Batch one (the first 20 packages, chosen by which had the most design
rule families to apply) is converted and pushed to
`design/global-sweep`. A full audit of all 299 packages against every
ruling to date is complete and recorded in `docs/BATCH-TWO-SCOPE.md` —
that audit, not a shorter earlier list, is batch two's scope. The
modal/large-panel corner-radius ambiguity is resolved (see the amended
Corners ruling in RESTYLE-RULES.md, Open question 1). Two things are
waiting on Brian before batch two converts anything: Open question 2
(does the continue card / in-flow banner card take standard or large
radius — the amendment currently asserts both), and general sign-off
on the newly ruled law itself.

## Process lives separately

How work gets done — branch and commit rules, what may be edited,
verification, escalation — is AGENTS.md's job, not this document's.
This file and RESTYLE-RULES.md cover the product and the design
language; AGENTS.md covers craft.
