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
FE/TUNING 6 Sep 2026: Home fine-tuning batch 1 landed as 2b271680
(section lists replace tiles and rails, Home contract 4.0.0) and the
next-section banner chain as f7a12029, branch fe/tuning. Review-mode
overlay stays opt-in via CRESTFALL_ENABLE_REVIEW_MODE=true in .env.local
(off in production).
FE/SIDEBAR 6 Sep 2026: sidebar fine-tuning batch 1 landed as eeb57184
(group spacing, Support heading gone, Feedback under coins, Terms as
footer text, coin display law with the stacked Buy Coins block,
collapsed rail mirrors expanded, mobile drawer parity) and the banner
carry-over as 7018891c (Images bottom banner to Vault, Home bottom
banner takes the Play copy), branch fe/sidebar off staging. Brian
reviews in the browser; no render checks in that pass. Expanded header
keeps its one-row lockup, the shift on toggle accepted at the gate.
NEXT ACTION: Sol attack round on the Home PRD
(bible/prds/2026-08-29-home.md; packet
bible/handoffs/HANDOFF-SOL-2026-08-29.md).
OWNERS: Brian, design and gates. Nick, Chassis, merge, staging, deploy. Claude, FE drafts and builds. Sol, review only.
