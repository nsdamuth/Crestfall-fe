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
Batch 2 landed the same day (upgrade CTA and rhythm): rows one step
up to 44 with 8 gaps, labels one type step up, the coins block centered
between equal dividers over the one gold Upgrade button (label
"Upgrade" in every state, opening the existing purchase flow for now),
low balance below 5 coins turns only the balance row amber, collapsed
shows the balance badge above the gold button; Vault archive glyph
everywhere, "Storys" fixed, the four icon lint errors cleared. The
low-balance threshold reads the frontend's image generation cost
constant (5) until the Chassis serves it. Terms links to the existing
Terms page on every surface. Batch 2 fixes (same day): collapsed rail
drops the reserved title rows (divider plus one group gap only,
group-by-group alignment), collapsed coins is the gold button alone
(tooltip "Upgrade", no badge), expanded Upgrade uses the shared
primary recipe as is at full block width, and the coins info dialog
carries an equal inset on all sides so Got it no longer sits flush.
Coin balance gold fix (same day): glyph and number read in the rail's
ornament gold; the amber low state applies only above zero and below
the generation cost, never at zero (it had been firing at zero).
Home quick fix (same day): sort options read Plays, Likes, Saves,
Newest and the trigger reads "Sort: <value>"; labels only. Adventures
page header added in the Stories pattern (eyebrow Play, title
Adventures, description "Play through published seasons, or build one
of your own.") after Brian authorized new copy; copy open for
fine-tuning. Every other section page carries its header; Home uses
its welcome hero by design. Coins section spacing
(same day, screenshot): the divider between Feedback & Updates and
Signed in moved up so the gap below the section matches the gap
above it, desktop and mobile drawer. Sticky seam (same day, Brian's
screenshots): the shared filter bar now tucks 1px under the top bar
so the sub-pixel seam that opens at browser zooms other than 100% is
covered on every page; geometry at 100% measured zero gap before and
after.
NEXT ACTION: Sol attack round on the Home PRD
(bible/prds/2026-08-29-home.md; packet
bible/handoffs/HANDOFF-SOL-2026-08-29.md).
OWNERS: Brian, design and gates. Nick, Chassis, merge, staging, deploy. Claude, FE drafts and builds. Sol, review only.
FE/FILTERS 6 Sep 2026: plan ratified, one shared bar with a Filter
button opening a chip-group panel (popover at 700 and up, sheet below)
plus "Sort: <value>" and the view toggle, Community first. Kit landed
(KitFilterPanel 1.0.0, KitStudioFilterBar 2.1.0 with the dropdown
fallback behind one prop, KitFilterChip 1.1.0, the anchored-panel hook
shared with KitDropdown), taxonomy display fixes ("Stories &
Adventures", "Rulebook"), BUILD-BLUEPRINT 2.16(b) amended, CR-058 to
CR-063 filed. Community wired and STOPPED for Brian's browser review
(390 emulated then 1440); Vault, Stories, Lore, Creators, Adventures,
Images, Home follow the Community verdict.
FE/FILTERS 6 Sep 2026: Community refined (gold, Activity, sections
trimmed, Title Case, spacing, focus); sort set Plays/Likes/Remixes/
Newest; remix metric parked to fe/remix-metric.
FE/FILTERS 6 Sep 2026: shared bar and panel live on all eight pages;
Rules Codex sitewide; Saves retired; Remixes pending CR-059; em dash
backlog parked.
FE/FILTERS 6 Sep 2026: all ruled sort and filter options render regardless of data; Creators adds Followers; ready for PR to staging.
FE/MEDIA-STUDIO 9 Sep 2026: branch fe/media-studio off staging; references renamed to numbered slugs with NOTES.md (docs/references/media-studio); sidebar Images becomes Media, page eyebrow Create, title Media Studio, new description; composer rebuilt on contract 2.0.0 (Image / Video toggle with Video on Soon, Generate and Remix tabs, five asset tiles with no Player slot and a gold glow on Character, Custom prompt, inline options with render style step tooltips, Count 2 to 256 beside a Generate button reading the coin cost, sticky footer, no coins block); rulings at the plan gate: count list 2, 4, 8, 16, 32, 64, 128, 256 default 2, toggle is a rounded square not a pill, coin gate follows count times 5; RULING 9 Sep 2026: render checks run only when the brief asks for one, the default review is Brian in the browser after push (docs/FRONTEND-SOP.md section 8, CLAUDE.md Verification); gap file docs/handoffs/MEDIA-STUDIO-BACKEND.md. NEXT ACTION: Brian browser review of the Media Studio composer.
FE/MEDIA-STUDIO 9 Sep 2026, browser review round 1 applied: page description "Generate images and video from your assets. Manage, reuse, and share them all in one place."; tiles read (required) or (optional); render style context line removed; one closed "Image settings" disclosure holds Render style, Camera / Framing, Wardrobe theme, Aspect ratio, Advanced, Negative prompt; every Advanced slider kept (staging and HEAD share the same ids: detailLevel, foundationDetail, polishDetail, referenceInfluence, styleBalance) with copy cut to label plus an "i" tooltip; footer is a sibling of the scroll region with the count control (layers glyph plus number, menu opens upward, 8 and above greyed "Not available yet") on its own row and Generate on its own line; no horizontal scroll in the rail; wider section spacing; mobile composer opens as a bottom sheet (ImagesV2ComposerSheet on KitModalFrame variant sheet) from a Compose button on the sticky bar above the bottom nav, with the count row and Generate pinned to the sheet bottom; grid and list toggle sits at the right edge of the filter bar on mobile. Item 11 finding: the page drops coins and library only when /api/profile/me or /api/studio/image-generation/jobs fail (401 from the local auth session or 500 from services-api on 4000); no frontend change. Item 10 blur: no code path blurs those buttons; Brian's own screenshot shows Dark Reader injected on localhost:3001, the likely cause. NEXT ACTION: Brian browser review round 2.
