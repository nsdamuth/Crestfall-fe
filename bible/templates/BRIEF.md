# BRIEF: <task name>

Purpose: the executable unit handed to one agent for one focused
piece of work. Filled by: the lane preparing the work, before any
edit starts.

## Required (per docs/FRONTEND-SOP.md section 9 and
docs/PROJECT-INSTRUCTIONS.md; three separate numbered actions before
the paste block, never buried inside the brief text)

1. Model: <Opus | Fable | Sonnet>
2. Effort: <low | medium | high>
3. Permission mode: <plan first | edits allowed | full auto>

## GATES (three to six checkable statements per bible/templates/GATES.md's
Brief GATES block rule; each proven by its own command)

- [ ] Production build exits 0. Prove: `npm run build` ends "exit 0".
- [ ] Zero em dashes in any touched doc. Prove: the em dash grep in
      docs/FRONTEND-SOP.md section 2 returns nothing for touched files.
- [ ] Rendered at 390 then 1440, every fixture state, no overflow,
      no console errors. Prove: screenshots handed back per the QA gate.
- [ ] (add task-specific gates, each with its proving command)

objective (one outcome, one sentence)

context_links (PRD, PLAN, CLAUDE.md, and any law doc this task must
  follow)

in_scope (what this brief covers)

out_of_scope (files and decisions this brief must not touch)

interfaces (contracts this lane must honor; cite the CR or contract
  file, never restate it)

acceptance_and_verify (each acceptance criterion from the PRD or
  PLAN, paired with its exact verify command)

report_back (changed files, command output, remaining limitations;
  echo each task from the PLAN's manifest as DONE or STOPPED)

Last step, always: update bible/STATUS.md before reporting done.
