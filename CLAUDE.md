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

Briefs, not commands. The strategy chat writes intent and constraints; it
never hands Brian a shell command. Every command in this project is
authored by the agent, which reads the repo first and checks the request
against the standing rules. The agent's refusal is a required layer of
protection and must never be treated as friction. When an instruction's
premise does not match what the agent finds in the repo, the agent stops
and escalates rather than inventing work or complying anyway. This
behavior is correct and is not to be tuned out.

Never assert unverified state. No claim about branch state, file
contents, or how a page renders is made without having read or rendered
it in that session. Anything expected but unconfirmed is labeled
"expected, verify first" at the point it is stated, never as a trailing
caveat. A verdict is never built on top of an assumption.

## 6. Progressive context

Load only when the task calls for it, not by default:

- `@docs/RESTYLE-RULES.md`: design and restyle edits only.
- `@docs/CRESTFALL-DESIGN-CONTEXT.md`: product model or design language
  questions.
- `@docs/BATCH-TWO-SCOPE.md`: batch two execution only.
- `@docs/ROADMAP.md`: status checks, updated in the same commit as the
  work.
- `@docs/contracts/`: feature work against backend contracts.
- `@docs/APP-FUNCTION-MAP.csv`: before touching any page, the wiring
  behind every control on it. The markdown rollup is the readable view.
- `@docs/COMPONENT-CENSUS.csv`: before touching any component package,
  its usage count, pages, and contract/fixture state.

## 7. Parallelism law

PARALLELISM LAW (ruled 4 Aug 2026, supersedes edits-serial)

Roles. Fable 5 plans and rules at strategy gates only, never executes.
Opus plans sprints, writes briefs, and runs synthesis phases.
Sonnet executes edits. Haiku runs bulk mechanical reads and
single-rule checks inside workflows.

Fan out by default. Any task that is a list of more than twenty like
items runs as a dynamic workflow, not a serial pass. Read-only fan-out
for audits, harvests, screenshots, and verification is always allowed,
unlimited, on the cheapest model that can do the job.

Parallel edits are permitted when and only when each unit is one package
in its own worktree landing as one commit. One item, one commit survives
unchanged. Anything that cannot be isolated that way stays serial.

No agent grades its own work. Every editing workflow ships a verification
phase run by different agents than the ones that edited.

Every fan-out pilots on its first ten units and stops for a rendered check
before the remainder runs.

Renders are deliverables. Screenshots are handed back, never deleted.

Automatic orchestration mode stays off. Workflows are triggered
deliberately, per task.

Budget. Plan capacity is a resource to spend, not to preserve. Burn is
authorized to reach the Nick handoff. The only spend limit is a run that
cannot be verified or undone.

Escalation. A workflow that meets a rule it cannot apply mechanically
stops that unit and reports it. It never guesses.

Generated audit artifacts are exempt from the em dash law and are
deleted at end of life.

## 8. QA gate

QA GATE (ruled 4 Aug 2026)

A render is not a deliverable. A judgment is.

Every verification agent renders the package, then rules it against every
rule family assigned to it, returning PASS or FLAG with the specific rule
named on any FLAG.

A screenshot is never handed to Brian as a question. It is handed as
evidence behind a ruling already made.

Brian sees three things and nothing else: the count of packages passed,
every flagged item with what is wrong and the recommended fix, and a
contact sheet of passing renders for spot approval.

An agent that cannot rule a package flags it. It never asks Brian to look
and decide in its place.

Scope is verified, never inherited. Before any sweep phase, confirm the
scope document covers every surface the rules apply to, and report any
surface outside it.

Every preview link handed to Brian is verified to load first. A link that
404s is a failed report.

## 9. Contract law

Presentation may change. What a component reports may not. A View may
change how a choice is presented, for example tabs becoming a dropdown,
only while it continues to report the same selection to the same
handler. If a redesign appears to require a contract, ViewModel or
data-flow change, stop and escalate to Brian. Never decide it.

docs/APP-FUNCTION-MAP.csv is the ledger of what every control reports
and where it is wired. Check the control's row before restyling it;
its operation_name must still be reachable after the change.

## 10. Definition of done

Every feature starts with a PRD and a signed contract using
docs/contracts/CONTRACT-TEMPLATE.md, stored in the shared workspace so
both the backend and frontend lanes read the same document. No package
codes against an unsigned contract.

Every feature closes by updating docs/APP-FUNCTION-MAP.csv and
regenerating the markdown rollup. A feature that ships without that
update is not done.

## 11. Map refresh

The function map is regenerated at the start of every sprint, not once.
It is a living document, and its diff is how we detect what changed
upstream.

## 12. Visible change rule

Every sprint ends with before and after renders at 390 and 1440. Work
that changes nothing Brian can see does not close a sprint on its own.
