# PLAN-REVIEW-LOG: Home PRD (bible/prds/2026-08-29-home.md)

Live review log per bible/templates/PLAN-REVIEW-LOG.md. Author:
Claude (FE lane). Reviewer: Sol. Archived under bible/decisions/
once the PRD is signed.

## Round 1

Reviewed: PRD v0.2 (commit 92f2c80, packet
bible/handoffs/HANDOFF-SOL-2026-08-29.md). Sol's verbatim findings:
bible/handoffs/CRESTFALL_HOME_PRD_SOL_ATTACK_R1_DETAILED_FINDINGS_2026-08-29.md
(supersedes any earlier summary). Packet completeness: Sol listed no
missing items; Sol additionally inspected FE and Services source
archives named in the findings header.

Round 1 verdict (Sol): BLOCK.

## Findings table

| finding_id | round | reviewer | severity | location | claim | evidence | disposition | rationale | owner | resolved_in |
|---|---|---|---|---|---|---|---|---|---|---|
| F-001 | 1 | Sol | critical | PRD AC6, CR-030, LOOM boundary | Filter persistence assigned to the Binding Shell violates LOOM; the ViewModel (or an adapter it invokes) must own it | LOOM boundary rules; shell responsibilities | accept | Ownership error, mechanism (localStorage interim) unaffected | Claude (FE) | PRD v0.3 AC6; CR-030 amendment note |
| F-002 | 1 | Sol | high | PRD AC6, CR-014/030 | private/internal/public/canon is not one backend enum; a deterministic UI projection from visibility, status, canonStatus is required | Services authority: visibility PRIVATE/UNLISTED/PUBLIC; statuses; canonStatus NONE/CANDIDATE/COMPATIBLE/OFFICIAL | accept | Ruled S1 (Brian): Canon exclusive and highest precedence; Internal maps from the unlisted link-share state | Brian ruling + Claude (FE) | PRD v0.3 projection section; O1 to O4 remain OPEN for round 2 |
| F-003 | 1 | Sol | high | PRD AC4, communityPresentation, useHomeViewModel | "Recently added" would sort by updatedAt, which is Recently updated semantics; must sort by createdAt | Both timestamps already on the Services summary | accept | Mechanical; both timestamps preserved distinctly | Claude (FE) | PRD v0.3 AC4 |
| F-004 | 1 | Sol | high | PRD AC4/R3, recommendation logic, community summary contract | "Top rated" has no truthful ranking definition; saves referenced by the FE formula are not supplied on this path | Recommendation order is featured/canon/engagement/recency; summary carries likes/messages/images/videos, no saves | accept | Ruled S2 (Brian, amends R3): display Popular now until a real rating metric exists; Top rated reserved via flagged CR-029 amendment | Brian ruling + Claude (FE) | PRD v0.3 AC4; bible/decisions/2026-08-29-r3-amendment-popular-now.md; CR-029 amendment note |
| F-005 | 1 | Sol | high | PRD AC3/R2, route tree, URL-map ruling | The Studio destination must be the exact current route /studio/v2/studio; no /studio/v2 page exists; no early rename or redirects | Current route authority; CR-057 parks the rename until cutover | accept | Mechanical wording fix | Claude (FE) | PRD v0.3 AC3 and parity row 6 |
| F-006 | 1 | Sol | high | PRD AC2/C2/rollout, preview harness, fixtures, staging | The remote fixture/render gate is not executable: preview route notFound in production, no fixture injection, no longest-content fixture | app/dev/ui-preview/home-v2-page/page.jsx; preview client renders Home bare; fixture inventory | accept | Becomes the named FE task home-preview-staging-gate plus an operator note in the Sol packet | Claude (FE) + Nick (operator) | PRD v0.3 technical_constraints; HANDOFF-SOL-2026-08-29.md round 2 section |
| F-007 | 1 | Sol | medium | PRD signed-out edge case, app/studio/layout.js | Signed-out behavior is already decided above Home: /studio/** returns the signed-out gate | Parent studio layout auth check | accept | Ruled S3 (Brian): recorded signed-in-only; public Home is a separate future route decision, out of this PRD | Brian ruling | PRD v0.3 key_flows |
| F-008 | 1 | Sol | medium | Muted-creator edge case, CR-028/029, Services list authority | Server-side mute exclusion is impossible while public discovery is actorless; future CRs cannot claim it until discovery is actor-aware | Current public list path carries no actor | defer | Accepted deferred per Brian: future contract warning carried on CR-028 and CR-029 | Nick (future Services) | CR-028/CR-029 warning notes |
| F-009 | 1 | Sol | high | PRD AC6, getHomePageData, useHomeViewModel | "Just mine" plus private/internal cannot work against the community-only rail candidate set; a union/dedupe/projection/filter rule is required | Rails built from communityCreations only; ownedCreations unused by the shelves | accept | Ruled S1 (Brian): union both collections, dedupe to the owned copy, derive ownership and bucket, filter before ranking | Brian ruling + Claude (FE) | PRD v0.3 candidate-set rule |

Round 1 verdict row: BLOCK (Sol, 29 Aug 2026).

## Round 1 FE response (stable IDs, per Sol's working order)

- F-001: RESOLVED. PRD v0.3 AC6 assigns persistence to
  useHomeViewModel or a persistence adapter it invokes; the Binding
  Shell is explicitly barred from storage access and the verify line
  checks it; CR-030 carries the matching amendment note.
  localStorage remains the interim mechanism, unchanged.
- F-002: RESOLVED, with named OPEN residuals. The deterministic
  projection is drafted from current authority (constants.js enums,
  publishing ViewModel, internal-editing transition) in the PRD's
  projection section, per ruling S1: Canon exclusive and highest
  precedence, Internal from the unlisted link-share state.
  Residuals O1 to O4 are OPEN for round 2, marked in place, none
  guessed.
- F-003: RESOLVED. Recently added orders by createdAt; both
  timestamps stay distinct in the presentation model; AC4's verify
  line includes the old-creation-edited-today check.
- F-004: RESOLVED by ruling S2, which amends R3 on Sol's evidence:
  the shelf displays Popular now until a real rating metric exists;
  Top rated is reserved for that metric via the flagged CR-029
  amendment (which also records that saves are not on this path).
  Amendment recorded at
  bible/decisions/2026-08-29-r3-amendment-popular-now.md.
- F-005: RESOLVED. The PRD names the exact route /studio/v2/studio
  everywhere (AC3, parity row 6) and forbids the early rename and
  compatibility redirects ahead of the CR-057 cutover move.
- F-006: RESOLVED at PRD level. The gate is no longer asserted as
  executable: the PRD records the three gaps and names the FE task
  home-preview-staging-gate (staging-safe preview, four states
  including a longest-content fixture this task creates, 390 and
  1440) as the precondition for every remote render gate; the
  operator note for the design/fe-dev deployment is in the updated
  Sol packet. The build work itself is pending, tracked as that
  named task.
- F-007: RESOLVED by ruling S3. Recorded as signed-in-only under
  current /studio/** authority; a public Home is a separate future
  route decision, outside this PRD.
- F-008: ACCEPTED-DEFERRED. Future contract warning added to CR-028
  and CR-029: no server-side mute exclusion claim until discovery
  is actor-aware.
- F-009: RESOLVED by ruling S1. The candidate-set rule (union,
  dedupe to the owned copy, derive ownership and bucket, filter
  before ranking) is in the PRD's projection section; Just mine is
  a pure ownership filter; Mine plus Public excludes own canon
  because Canon is exclusive.

Response artifact: PRD v0.3 on design/fe-dev (commit recorded in the
round 2 packet). Awaiting Sol round 2 against the same stable IDs.

## Round 1 ratification (Brian, 30 Aug 2026)

Response packet issued as
bible/reviews/SOL-ATTACK-R1-RESPONSE-2026-08-30.md, which re-put
S1 and S3 to Brian for explicit confirmation rather than treating
them as settled. Brian ratified both as written on 30 Aug 2026.

- F-002, F-009: RULED BY BRIAN 30 Aug 2026. The projection and the
  candidate set stand as written, with this binding framing: Nick's
  backend fields, enums, and filter and sort options are authority
  and are used as they exist today; the projection is display-layer
  only; FE fine-tuning may combine or restyle filter and sort
  controls for clean sticky bars and may adjust display names for
  clarity, but never invents new backend semantics. O1 to O4 remain
  open for Sol's verification.
- F-007: RULED BY BRIAN 30 Aug 2026. The sign-in ruling goes in as
  written.
- F-004 residual: the two stale "Top rated" display-name passages
  in the PRD (user story 4, FAQ) swept to "Popular now" on Brian's
  30 Aug authorisation. Parity ledger rows 12, 13 and 20 keep the
  string because it is the function-map control name, which changes
  with the map in the build commit.
- Terminology RULED 30 Aug 2026 and added to bible/CONTEXT.md:
  Studio Home is the signed-in webapp home page; Marketing site is
  the signed-out public surface, Phase 4; bare "Home" means Studio
  Home. The CONTEXT.md "Visibility" line, which had defined the four
  states as a backend enum (the F-002 error), was corrected to a
  display-layer projection in the same pass.
