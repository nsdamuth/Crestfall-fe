# PRD: <feature name>

Status: DRAFT | IN REVIEW | SIGNED (date, by whom)

## Problem
What is broken or missing, in plain language, one paragraph.

## Outcome
What a user can do after this ships that they cannot do today.

## Lane split
- Front end (Brian/Claude): ...
- Chassis (Nick): ...

## Contract needs
Point at CR numbers in docs/CONTRACT-REQUESTS.md. That file is the
only mechanism for Chassis contract changes; this PRD never restates
or replaces a CR, it cites one. New need with no CR yet: file the CR
first, then cite it here.

## Decisions pending (three options each)
For every real choice: exactly three options, one recommended with
the reason, two rejected with the reason not, each with its cost.
Record the ruling in bible/decisions/ using templates/GATES.md.

## Out of scope
What this PRD deliberately does not cover.

## Verification
How the finished work will be proven, per docs/FRONTEND-SOP.md
section 8 for FE work; the Chassis side states its own proof.

## Review
Cross-model review log: bible/PLAN-REVIEW-LOG.md, rounds complete
before sign-off. Signed by: Brian (always), Nick (when the Chassis
is touched).
