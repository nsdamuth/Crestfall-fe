# PRD: <feature name>

Purpose: the one-pager every feature starts from, promoted to a full
PRD only when it crosses lanes. Filled by: the lane proposing the
feature, before Gate 1.

## Tier A, one-pager (default for every feature)

title (one sentence)
problem (the pain, who has it, evidence: quote, ticket, data)
success_metrics (2-3, each with baseline, target, window)
non_goals (explicit out of scope, written before scope creeps in)
user_stories (P0 only)
acceptance_criteria (each as Given/When/Then plus a verify command; subjective ones tagged NEEDS HUMAN REVIEW and listed separately)
risks_open_questions
announcement_draft (the in-app what's-new copy, written before build)
rollout (staging, release channel)
owner_lane (which lane drives this feature)
gate_status (Gate 2 sign-off state: DRAFT, IN REVIEW, SIGNED, date and by whom)

## Tier B, full PRD (required only when chassis-blocking or cross-lane)

Adds, on top of every Tier A field above:

key_flows_and_edge_cases
technical_constraints (link to PLAN.md)
contracts_touched (CR numbers in docs/CONTRACT-REQUESTS.md; this PRD never restates or replaces a CR, it cites one, and files a new one first if none exists yet)
parity_echo (page-scoped PRDs only, R5 improvement 1, 29 Aug 2026: every docs/APP-FUNCTION-MAP.csv row assigned to the page echoed as present, deliberately excluded with its ruling cited, or flagged; plus any ruled control the map does not yet carry)
faq (working-backwards style)
change_log

Tier B trigger: this PRD is chassis-blocking (per the shared tracker's
chassis-blocking label, pending Nick's confirmation, see
bible/decisions/2026-08-26-templates-v2.md) or touches both lanes.

## Review

Cross-model review log: bible/PLAN-REVIEW-LOG.md, using the schema in
bible/templates/PLAN-REVIEW-LOG.md, rounds complete before sign-off.
Signed by: Brian (always), Nick (when the Chassis is touched).

## Optional (carried from v1, not part of the v2 field list)

- outcome: what a user can do after this ships that they cannot do
  today. Distinct from success_metrics (which is measured) and from
  problem (which is the pain before the fix); kept for the cases
  where a plain sentence says it faster than a metric can.
- lane_split: a per-lane breakdown of who builds what, more detailed
  than the single owner_lane field ("Front end (Brian/Claude): ...",
  "Chassis (Nick): ..."). Use when a Tier B PRD needs the split
  spelled out beyond contracts_touched.
- contract_needs (Tier A convenience pointer): for a Tier A PRD that
  is not chassis-blocking but still touches one CR, cite it here
  rather than promoting the whole PRD to Tier B.
- decisions_pending: for every real choice still open inside this
  PRD, exactly three options, one recommended with the reason, two
  rejected with the reason not, each with its cost. Record the
  ruling in bible/decisions/ using bible/templates/GATES.md.
  OPEN FOR RENDER variant (R5 improvement 2, 29 Aug 2026): a visual
  choice that will be ruled at a render sitting carries no paper
  recommendation; instead it specifies each option for side-by-side
  render (three-way at the sitting, competitor-pattern variants
  gathered at render time count as options), and the ruling is
  recorded after the sitting, never in the PRD text.
