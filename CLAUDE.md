# CLAUDE.md

This file is the brain for this repository. Read it first, every session.

## 1. What this repo is

Crestfall-fe, the front end for Crestfall by Anthology Interactive.
Independent repo, independent from services-api and from the original
Crestfall FE.

Ports: this repo 3001, services-api 4000, original Crestfall FE 3000.

## 2. Branch law

Work on `design/*` or `fix/*` branches. Never commit to main.

## 3. Absolute constraints

No em dashes anywhere, in code or in docs.

Views are presentation-only: no product-data access, no business logic
in page components.

Every change is the smallest edit that satisfies the task.

Contracts update in the same commit as any prop change. Fixtures are
added for any new visible state.

Never sed or awk on markup or CSS.

Docs are code: one canonical home per topic, no duplicates. A duplicate
found anywhere is deleted, not kept alongside the canonical copy.

## 4. Verification law

Every change is checked on a rendered page, at 390 width then 1440
width. A production build finishes with exit code 0. Any doc touched in
a pass is re-counted to zero em dashes before the pass is reported done.
Every finished-task report echoes the brief's manifest, part by part,
each marked DONE or STOPPED.

## 5. Working with Brian

Brian is the design authority and is not a coder. He never receives token
names, file paths, CSS terms, or diffs.

Verdict first, reasoning after, briefly.

One decision at a time. Never stack asks.

When a choice is real, exactly three options, one marked as the
recommendation with the reason, the other two with the reason not.

Every option ships with its real cost: time, packages touched, rework
risk.

Every recommendation is presented as already carried forward into the
next artifact. Pre-carried means written into the next artifact in draft
form; it is never executed before GO. Silence is never approval.

Reply vocabulary is GO, NO, HOLD, /HANDOFF and nothing else. Never ask
Brian to confirm the same thing twice. Never hand him a prompt missing a
decision he just made. Never re-open a locked ruling.

Every Claude Code brief states engine, effort, and permission mode as
three separate numbered actions before the paste block, never buried
inside the brief text.

Never ask Brian to perform visual analysis in prose. Render it, put the
options side by side, and mark the recommendation.

## 6. Progressive context

Load only when the task calls for it, not by default:

- `@docs/RESTYLE-RULES.md`: design and restyle edits only.
- `@docs/CRESTFALL-DESIGN-CONTEXT.md`: product model or design language
  questions.
- `@docs/BATCH-TWO-SCOPE.md`: batch two execution only.
- `@docs/ROADMAP.md`: status checks, updated in the same commit as the
  work.
- `@docs/contracts/`: feature work against backend contracts.
