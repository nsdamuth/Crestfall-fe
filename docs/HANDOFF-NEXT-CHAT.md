# Handoff to next chat

Written 9 Aug 2026, end of the demo prep pass, branch
`design/demo-prep` (off `design/kit-polish`).

## State summary

The kit rebuild (`docs/BUILD-BLUEPRINT.md` chapter 2) is the current
design system: full-bleed cards, one branded-dropdown filter line,
selection-state and focus laws, a corrected three-tier rating system
(Everyone and Adult live, Teen disabled pending CR-027), and card
surfaces without art now sitting on the lighter `--surface-2`
elevated token against canvas. `/studio/v2/community` is the only
nine-page-architecture route built so far, fixture-driven and
pre-parity, mirrored auth-free at `/dev/ui-preview/community-v2-page`.
This pass also added a flag-gated preview of the full nine-destination
sidebar nav (`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, on for dev/staging,
off in production, documented in `docs/FRONTEND-SOP.md` section 18):
Community routes live, the other eight destinations render quiet
until their pages ship, and today's working sidebar collapses into a
Legacy group beneath, fully reversible with the flag off. Two project
docs were regenerated from current ruled state
(`docs/CRESTFALL-DESIGN-CONTEXT.md`, `docs/PROJECT-INSTRUCTIONS.md`)
and this handoff was written to carry the open threads forward.

## Sprint map

**Kit revision / kit polish passes (9 Aug 2026):** the eleven
`components/kit/` packages and their governing rulings (card, filter
line, tag economy, mobile, focus, banner hierarchy, list density,
ratings, selection-state, grid/list toggle, remixable fold) are
landed; see `docs/CRESTFALL-DESIGN-CONTEXT.md` for the full list.

**Nine-page build order** (`docs/BUILD-BLUEPRINT.md` section 3.1),
Community built first because it builds the whole browse kit once:

1. Community, built, pre-parity (`/studio/v2/community`)
2. Creators, not started (no lock; reuses page 1's skeleton)
3. Vault, not started (partial hold on the standalone edit tree,
   CR-007/CR-008)
4. Stories, not started (no lock)
5. Images, not started (no lock)
6. Studio, not started (waits on Nick's CR-026 quick-create pass)
7. Adventures, not started (waits on Nick's CR-025 rename)
8. Home, not started (ruled composition exists, section 4.1)
9. Lore, not started (most net-new contract surface, needs Nick's
   CR-015 first)

**This pass (demo prep):** ratings semantic correction, card-without-art
surface ruling, sidebar preview flag, doc regeneration. See git log
on `design/demo-prep` for exact commits.

## Two open picks awaiting Brian

Both live in fixtures today for a rendered side-by-side choice, never
decided by an agent:

1. **Creation-card overlay-action placement.** `actionPlacement`:
   `overlay-top` vs `scrim-row`, both shipped in
   `KitCreationCard.fixtures.js`.
2. **Lighter wash value for artwork under a tag bed.** Carried over
   from the batch-two sweep, provisional until Brian rules it from a
   rendered card.

## Open CRs for Nick

Full detail in `docs/CONTRACT-REQUESTS.md`. Later-pass, non-blocking
unless noted:

- **CR-027**, content-rating three-vs-four-tier question, corrected
  this pass: whether the backend should seat an actual Teen tier, and
  whether EXPLICIT-tagged content migrates or gets permanently folded
  under the Adult/R ceiling with MATURE.
- **CR-024/CR-025**, Room Template to Story and Storyline to Adventure
  backend renames (display layer already reads the new names; CR-025
  blocks the Adventures page conversion until it lands).
- **CR-026**, Nick's review pass over the Character QUICK/ADVANCED
  field allocation before the Studio page builds.
- **CR-023**, Community vs Adventures structural model, feed/link
  data-model questions still open under an already-ruled copy split.
- **CR-013**, duplicate drawer nav tree retirement (`StudioMobileNav`
  and `StudioSidebar` still render separate copies; a one-element
  merge is agreed in shape, not landed).
- **CR-015**, lore pipeline confirmation, blocks the Lore page (last
  in the build order).
- Standing lower-priority queue: CR-001, CR-002, CR-003, CR-005,
  CR-009, CR-011, CR-012, CR-014, CR-016 through CR-022. None block
  current work; each is logged with its own verify-with-Nick note in
  `docs/CONTRACT-REQUESTS.md`.

Two CRs are Brian's, not Nick's, and are the "two open picks" above
in a different frame: CR-007 and CR-008 (one edit surface or two;
what the standalone editor exposes that the seven-stop creator does
not).

## Opener line for the new chat

```
Continuing Crestfall-fe on design/demo-prep. Read docs/HANDOFF-NEXT-CHAT.md first, then docs/CRESTFALL-DESIGN-CONTEXT.md for current design law. Two picks are waiting on you (overlay-action placement, tag-bed wash value); everything else is ready to keep moving. What's next?
```
