# AGENTS.md

House law for this repository. This file is process — how work gets done.
Design law lives in `RESTYLE-RULES.md`, not here.

## 1. What this repo is

Crestfall-fe, the front end for Crestfall by Anthology Interactive.

Independent repo. Brian owns it, including merges to main.

Ports: this repo 3001, services-api 4000, original Crestfall FE 3000.

## 2. Who is who

Brian is the design authority and is not a coder. Plain language always:
never token names, file paths, or CSS terms back at him.

Nick owns backend, contracts, and ViewModels.

## 3. Naming

The coding agent is called Claude Code, never Fable. Fable 5 is a model
name only, used at strategic review gates.

## 4. What may be edited

`components/**` is the source of truth. `app/dev/ui-preview/**` is a
fixture-driven test harness, never product, never judged as product,
never logged as a defect. Portable Views and fixtures may be edited
freely. Contracts and ViewModels are never edited without flagging Nick
first.

## 5. Branch and commit law

Branch `design/<feature>` or `fix/<feature>`. Never commit to main. One
item, one commit. Nothing costs more than one item to undo.

## 6. Parallel work

Parallel agents read, audit, and screenshot. All edits serial in the
main session. Reading passes SHOULD be parallelized; reading is the slow
part of a sweep and cannot break anything.

## 7. Escalation, the anti-rework rule

When work meets something the rules do not cover, STOP on that item. Do
not guess, do not invent a rule to keep moving. Flag it and carry on
with work that IS covered. Full stop only when the flag touches a shared
shell other packages sit inside. Report flags as numbered open
questions. Brian rules them. The agent never selects its own model.

## 8. Forbidden

Never sed or awk on HTML or CSS. Never "don't ask again" or
always-allow, which rewrites the permissions file from a stale snapshot.

## 9. Verification law

Every task ends with a check the agent performs itself on a rendered
page at 390 then 1440. A file read is never proof. Documentation tasks
verify by reporting finished section headings.

## 10. What a finished task reports

Files changed, routes tested, screenshots at 390 and 1440, confirmation
no contract changed, confirmation no backend touched, the flag list from
section 7.

## 11. Doc maintenance

A ruling that changes AGENTS.md or RESTYLE-RULES.md is written into that
file in the same commit as the work it governs. Never later.

## 12. Where design law lives

RESTYLE-RULES.md in this repo. AGENTS.md is process, that is craft.
