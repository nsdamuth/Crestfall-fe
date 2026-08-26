# DECISION: bible templates v2, recorded 26 Aug 2026

Status: accepted

## Context

Research pass, 26 Aug 2026: the v1 template set (bible/templates/,
landed on design/bible-collab-v1) was thin on review discipline, had
no stopping rule for adversarial review rounds, and FEATURES.csv had
no schema fit for a generated changelog or a multi-channel release.
This pass tightens PRD.md into two tiers, rewrites
PLAN-REVIEW-LOG.md's schema and adds a stopping rule, expands
GATES.md into a reference for the three standing gates plus a new
pre-integrate check, and freezes a wider FEATURES.csv schema.

## Decision

- PRD.md: two-tier (Tier A one-pager default; Tier B full PRD for
  chassis-blocking or cross-lane work), fields per
  bible/templates/PRD.md.
- PLAN-REVIEW-LOG.md: new finding table schema (finding_id, round,
  reviewer, severity, location, claim, evidence, disposition,
  rationale, owner, resolved_in), a four-step severity rubric
  (critical, high, medium, low), and a stopping rule: a round closes
  at zero new critical or high findings; hard cap three rounds; open
  criticals past round three go to Brian as a HANDOFF, never a
  fourth round; verdict vocabulary APPROVE, APPROVE WITH COMMENTS,
  BLOCK; every round opens with a packet completeness check.
- GATES.md: the reply vocabulary defined in one place (GO, NO, HOLD,
  HANDOFF); Gates 1 through 3 each state who rules, what evidence is
  required, and what a pass looks like; a new pre-integrate check
  compares each lane's PLAN.md interfaces_declared before merge and
  lists any overlap for a side-by-side read; the Brief GATES block
  rule restated.
- FEATURES.csv schema freeze: id, title, body_markdown, type, labels,
  audience, public, channels, version, status, published_at,
  scheduled_for, image_url, slug, issue_ref, pr_ref. type is new,
  improved, or fixed. channels is a pipe-separated subset of
  panel|modal|digest|public. status is draft, scheduled, or
  published.
- RELEASE-NOTES.md: Added, Changed, Fixed, Removed sections, one
  line per FEATURES row, generated drafts treated as raw material
  only, a human pass required before publishing.
- BRIEF.md and HANDOFF.md: field lists tightened per
  bible/templates/BRIEF.md and bible/templates/HANDOFF.md;
  HANDOFF.md is now explicitly the Sol packet schema.

## Consequences

- Every template file gained a purpose and filled-by header line.
- Fields the new lists did not cover were kept under an "Optional"
  heading in each file rather than dropped, so no v1 discipline is
  silently lost; see the execution report for which fields moved.
- The FEATURES.csv type enum has no "removed" value; RELEASE-NOTES.md's
  Removed section is flagged as an open gap, not resolved here.
- The Model, Effort, and Permission-mode header in BRIEF.md is not
  part of the v2 field list but is required elsewhere as standing
  law (docs/FRONTEND-SOP.md section 9, docs/PROJECT-INSTRUCTIONS.md
  "Claude Code briefs"); it stays at the top of the template,
  unburied, labeled Optional only because this pass's field list
  does not name it.

## Alternatives considered

- Keep the v1 templates as they were: rejected, no stopping rule
  existed for review rounds and FEATURES.csv had no schema a
  generated changelog could consume.
- Adopt a generic external spec-kit file set wholesale: rejected,
  that shape assumes a single-lane repo with its own CLI tooling;
  this repo's two-lane, cross-model review process and its existing
  law stack (CLAUDE.md, docs/FRONTEND-SOP.md,
  docs/CONTRACT-REQUESTS.md) already cover most of what such a kit
  would add, and swapping wholesale would duplicate law this repo
  already treats as canonical.

## Pre-carried for Round 2

The chassis-blocking label, once it exists as a real label on the
shared tracker, becomes the source of truth for which PRDs are Tier
B; docs/CONTRACT-REQUESTS.md regenerates from it rather than being
hand-maintained in parallel, pending Nick's confirmation of the
tracker and this mechanism. docs/CONTRACT-REQUESTS.md itself is not
edited by this pass.
