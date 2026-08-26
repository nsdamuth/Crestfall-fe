# BRIEF: <task name>

1. Model: <Opus | Fable | Sonnet>
2. Effort: <low | medium | high>
3. Permission mode: <plan first | edits allowed | full auto>

## GATES (three to six checkable statements; the brief is not done
until every box is checked, each proven by its command)

- [ ] Production build exits 0. Prove: `npm run build` ends "exit 0".
- [ ] Zero em dashes in any touched doc. Prove: the em dash grep in
      docs/FRONTEND-SOP.md section 2 returns nothing for touched files.
- [ ] Rendered at 390 then 1440, every fixture state, no overflow,
      no console errors. Prove: screenshots handed back per the QA
      gate (section 12).
- [ ] (add task-specific gates, each with its proving command)

## The task
Intent and constraints in plain language. Manifest parts from the
PLAN this brief executes. The agent reads the repo first; if the
brief's premise does not match what it finds, it stops and reports
(docs/FRONTEND-SOP.md section 9).

## Out of bounds
Files and decisions this brief must not touch.

## Report format
Echo the manifest part by part, DONE or STOPPED, then the gate
checklist with proof per line.
