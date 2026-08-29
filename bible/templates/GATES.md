# GATES

Purpose: reference for the reply vocabulary, the three standing
gates, and the pre-integrate check, plus a fillable record for one
gate ruling below the line. Filled by: read by everyone; the record
section is filled by whoever prepares the options, ruled by Brian.

## Reply vocabulary

- GO: proceed exactly as recommended.
- NO: rejected, needs a new option set.
- HOLD: paused, revisit at the named trigger.
- HANDOFF: escalate to a live conversation or the other lane.

## Gate 1: sprint pick

who_rules: Brian.
evidence_required: three candidate sprints, one recommended, real
  cost stated per option.
pass_looks_like: one sprint selected, ruling recorded in
  bible/decisions/.

## Gate 2: PRD sign-off

who_rules: Brian, plus Nick when the Chassis is touched.
evidence_required: a signed PRD (bible/templates/PRD.md), and a
  cross-model review log (bible/templates/PLAN-REVIEW-LOG.md) with
  zero open critical or high findings, or a Brian HANDOFF ruling on
  any that remain past the hard cap.
pass_looks_like: PRD status moves to SIGNED; no build starts before
  this.

## Gate 3: live staging review

who_rules: Brian, with Nick available.
evidence_required: a staged build, every acceptance criterion
  checked live, every flag listed with its fix or its waiver.
pass_looks_like: flags are fixed or explicitly waived; release
  proceeds.

## Pre-integrate check (new, between Build and Integrate)

Each lane's PLAN.md interfaces_declared list is compared before
merge. Any file or contract both lanes' plans name is an overlap:
list it below for a side-by-side read, never an automatic merge.

overlap_table: file or contract | FE plan | Chassis plan | resolution

## Brief GATES block rule

Every bible/templates/BRIEF.md carries three to six checkable
statements in its GATES block, each with the exact command that
proves it. See bible/templates/BRIEF.md.

---

## GATE RECORD: <gate name>

Date: <date>. Gate: sprint pick | PRD sign-off | live staging review
| pre-integrate | other. Decider: Brian.

### The three options

| # | Option | Real cost (time, packages touched, rework risk) |
|---|---|---|
| 1 | ... (RECOMMENDED) | ... |
| 2 | ... | ... |
| 3 | ... | ... |

### Ruling

Selected: option <N>.
Why this one: ...
Why not option <X>: ...
Why not option <Y>: ...
(Feedback on all three is required; the two rejections carry the
most signal. Never proceed past a gate without all three.)

### Carried into

The artifact this ruling is pre-carried into (PRD, PLAN, or BRIEF).
