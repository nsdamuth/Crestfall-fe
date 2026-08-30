# STATUS, 29 Aug 2026

LIVE: production is Crestfall.Studio main via Railway. STAGING: design/fe-dev.
TRACKER: GitHub Issues.
OWNERS: Brian, design and gates. Nick, Chassis, merge, staging, deploy. Claude, FE drafts and builds. Sol, review only.
CONTAINER LAW: Brian's 29 Aug ruling is live on design/fe-dev; --container-wide (1440) caps v2 page content at KitStudioPageView, StudioShell and Story Chat stay fluid.
ENGAGEMENT LOOP: fixed 29 Aug in useCreationEngagementState.js (creationIds memo keyed on the id list, not array reference); build verified exit 0.
IMAGE PACKAGE: sent to Nick 29 Aug as bible/handoffs/HANDOFF-NICK-IMAGES-2026-08-29.md and SELECTOR-IMAGE-CATALOG-2026-08-29.csv, with a staging-parity ask.
NEXT ACTION: waiting on Nick N1-N3 plus staging answers, and Sol round 2 on the Home PRD v0.3.
STAGING URL: none recorded; requested from Nick, logged here once received.
STAGING MODEL, working assumption per Brian 29 Aug, NOT confirmed: crestfall-studio.com is the staged new site, believed served from the branch named "staging"; crestfallstudio.com is the future live domain. The branch name is believed, not verified. This is a working model only, recorded so work can proceed; it does not close the STAGING URL question above, which stays open and awaits Nick's confirmation of the domain, the branch, and the deploy path.
SOL R1 RESPONSE: bible/reviews/SOL-ATTACK-R1-RESPONSE-2026-08-30.md. F-001/F-003/F-004/F-005 RESOLVED with evidence; F-002/F-007/F-009 RULED BY BRIAN 30 Aug 2026 (S1 projection plus candidate set and S3 signed-in-only ratified as written, display-layer-only framing attached, Sol verification of O1 to O4 still open); F-006 OPEN (Nick staging, HACM path); F-008 accepted-deferred. Nothing waits on Brian. Packet ready to send to Sol, not yet sent.
TERMINOLOGY, RULED Brian 30 Aug 2026: "Studio Home" is the signed-in webapp home page (current polish target); "Marketing site" is the signed-out public surface (lead gen, blog, landing pages, sign-up, payments), Phase 4, out of scope until the webapp is complete; bare "Home" in any doc means Studio Home. Glossary: bible/CONTEXT.md.
FEEDBACK INTAKE, RULED Brian 30 Aug 2026: self-scoring Sheet, event-driven on submit, no fixed schedule; Brian reviews at will and picked items enter the dev pipeline through the normal gate; interim formula is severity x2 plus 3 for Bug plus 1 if under 14 days old, upgrading to real RICE when live usage data exists post-alpha. Scorer: bible/tools/feedback-prioritizer.gs (paste-in steps in its header; on-submit trigger added by hand). Record: bible/decisions/2026-08-30-feedback-pipeline.md.
