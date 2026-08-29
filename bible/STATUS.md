# STATUS, 29 Aug 2026

LIVE: production is Crestfall.Studio main via Railway.
STAGING: design/fe-dev, created off origin/main at 9039758, per
docs/reviews/FE-CONVERGENCE-AUDIT-2026-08.md. design/bible-collab-v1
(6c832d4) is merged in, no conflicts.
STAGING URL: none recorded; requested from Nick (Home PRD external
input 1, bible/prds/2026-08-29-home.md); recorded here the day it
exists.
TRACKER: GitHub Issues.
Sprint-h anchor for reference: design/sprint-h-final, tip 1236a3dd
(the 26 Aug entry cited a816172, one commit short of the actual tip).
NEXT ACTION: Sol round 2 on the Home PRD v0.3 (round 1 BLOCK
answered; log bible/PLAN-REVIEW-LOG.md; packet
bible/handoffs/HANDOFF-SOL-2026-08-29.md).
OWNERS: Brian, design and gates. Nick, Chassis, merge, staging, deploy. Claude, FE drafts and builds. Sol, review only.
CONTAINER LAW: Brian ruled 29 Aug 2026, amending the 24 Aug fluid-shell
supersession in docs/DESIGN-TOKENS.md. StudioShell and Story Chat stay
fluid; every v2 page's foreground content is now capped and centered at
one new provisional token, --container-wide (1440), applied at
KitStudioPageView. Build verified exit 0.
BUG FIX, 29 Aug 2026: infinite render loop in
components/studio/engagement/hooks/useCreationEngagementState.js fixed.
Root cause: creationIds was memoized on the `creations` array reference;
several call sites pass a fresh array each render (spread, inline `[]`),
so the sync effect refired every render and its empty-state branch kept
creating new Set() instances, forcing another render. Fixed by keying
the memo on the serialized id list instead of array identity. Build
verified exit 0.
