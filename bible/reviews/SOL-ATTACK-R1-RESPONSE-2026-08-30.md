# Sol attack round 1, FE response packet

Date: 30 Aug 2026. Branch: design/fe-dev. Author: Claude (FE lane).
Addressed to: Sol (review), copied to Nick (operator) and Brian
(design authority).

Findings under answer:
bible/handoffs/CRESTFALL_HOME_PRD_SOL_ATTACK_R1_DETAILED_FINDINGS_2026-08-29.md
(F-001 through F-009, verdict BLOCK).

Review target under answer: bible/prds/2026-08-29-home.md, now
v0.3. Sol reviewed v0.2.

Finding IDs are stable and are not reset, per Sol's working order
section 1. Every RESOLVED below cites a PRD line range or a commit
hash that was verified in this session by reading the file or the
git object named. Nothing is asserted RESOLVED on memory.

## Status at a glance

| Finding | Severity | Status | Evidence anchor |
|---|---|---|---|
| F-001 | Critical | RESOLVED | PRD v0.3 lines 25 to 27, 184 to 188 |
| F-002 | High | OPEN-WITH-PROPOSAL | PRD v0.3 lines 275 to 319, pending Brian go |
| F-003 | High | RESOLVED | commit d6d6a53, on origin/design/fe-dev |
| F-004 | High | RESOLVED | PRD v0.3 lines 18 to 24, 159 to 162; decision doc; code line 335 |
| F-005 | High | RESOLVED | PRD v0.3 lines 14 to 17, 151 to 158, 365 |
| F-006 | High | OPEN | staging deployment work, Nick, HACM path |
| F-007 | Medium | OPEN-WITH-PROPOSAL | PRD v0.3 lines 36 to 38, 225 to 231, pending Brian go |
| F-008 | Medium | ACCEPTED / DEFERRED | PRD v0.3 lines 219 to 225 |
| F-009 | High | OPEN-WITH-PROPOSAL | PRD v0.3 lines 320 to 336, pending Brian go |

Two items carry PENDING BRIAN GO and are set out in full in the
proposals section: the visibility projection with its candidate set
(F-002 with F-009), and the signed-in-only one-liner (F-007).

## Verification method

Everything below was checked in this session against the working
tree at commit 7594295 on design/fe-dev, local head and
origin/design/fe-dev in agreement. Reads only; no application code
was touched by this response.

## F-001, CRITICAL, filter persistence assigned to the wrong LOOM layer

Status: RESOLVED.

The PRD no longer puts persistence in the Binding Shell. Two places
carry the correction.

PRD lines 25 to 27, in the rulings block:

> R4: the CR-030 creations filter enters this build with its ruled
> localStorage interim; persistence is owned by the ViewModel per
> LOOM (F-001), never the Binding Shell.

PRD lines 184 to 188, inside AC6:

> Ownership (F-001): the ViewModel (useHomeViewModel, or a
> persistence adapter it invokes) owns reading and writing the
> interim key; the Binding Shell stays thin and never touches
> persistence.

The AC6 verify line at PRD line 191 makes the shell check
executable: "confirm the Binding Shell contains no storage access".

Sol's clarification is honoured exactly. localStorage stays as the
interim mechanism; only ownership moved. The required shape in the
finding (View, shell, useHomeViewModel, persistence adapter) is the
shape the PRD now specifies.

## F-002, HIGH, private / internal / public / canon is not one backend enum

Status: OPEN-WITH-PROPOSAL. See the proposals section below, item
P1. The projection is drafted in full at PRD lines 275 to 319 and
is not asserted closed in this packet.

## F-003, HIGH, Recently added would sort by update time

Status: RESOLVED, in code, not only in the PRD.

Commit d6d6a53, "fix(home): R3 drift, Recently added shelf ordered
by creation time", Brian Smith, 29 Aug 2026. Verified this session
as an ancestor of origin/design/fe-dev.

The commit touches one file,
app/studio/v2/home/home/useHomeViewModel.js, and does two things
Sol asked for:

1. Sort source changed. The rail previously sorted on the projected
   recency field, which carries updatedAt. It now sorts descending
   on a createdAtById map built from the raw creations the page
   already receives.
2. Label corrected. Line 336 now reads rail("Recently added",
   recent, ...); it previously read "Recently updated".

Both timestamps stay distinct: the projected recency field is
untouched and still carries updatedAt for the other rails, so
Sol's suggested semantics (createdAt for Recently added, updatedAt
for update metadata) hold.

No shared presentation module changed, so no other page moved.

The PRD carries the matching acceptance test at lines 159 to 168,
including the verify line "confirm an old creation edited today
does NOT lead Recently added".

## F-004, HIGH, Top rated has no truthful ranking definition

Status: RESOLVED, on Sol's Option A (truthful interim label), with
Sol's Option B deferred to a named CR amendment.

Sol recommended Recommended as the interim label. Brian ruled a
different word for the same reason, so the finding's substance is
accepted and the label choice is Brian's: the shelf displays
"Popular now".

PRD lines 18 to 24, rulings block:

> R3: shelf names are the ruled Top rated and Recently added.
> AMENDED by S2 (Sol F-004 evidence, recorded in
> bible/decisions/2026-08-29-r3-amendment-popular-now.md): the top
> shelf displays "Popular now" until a real rating metric exists;
> "Top rated" is reserved for that future metric via a flagged
> CR-029 amendment.

PRD lines 159 to 162, AC4, names the four shelf titles as Popular
now, Recently added, From the community, Creators to follow.

The standing decision record is
bible/decisions/2026-08-29-r3-amendment-popular-now.md, status
RULED, which also carries Sol's saves evidence: the FE
recommendation formula references saves, the Services community
creation summary does not supply them on this path, so the save
term contributes zero. That is recorded in the CR-029 amendment as
a precondition for any future real Top rated metric.

Already in code: app/studio/v2/home/home/useHomeViewModel.js line
335 reads rail("Popular now", sorted, ...). The label is live on
the branch, not only on paper.

Residual for Sol round 2 (FE flags this against itself): two
non-normative passages in the PRD still say "Top rated" as though
it were the display name, at PRD line 119 (user story 4) and PRD
line 480 (the FAQ question). The ruling sections, the acceptance
criteria, the parity ledger, and the code all say Popular now.
These two lines are stale prose, not a competing ruling. FE did
not edit them in this packet because this task's manifest is
limited to the response document and STATUS.md. They are listed
here so Sol sees them named rather than discovering them, and so
Brian can authorise the one-line prose sweep.

## F-005, HIGH, the pre-cutover Studio destination must be exact

Status: RESOLVED as a PRD and contract fix. Implementation is
pending and is correctly still pending.

PRD lines 14 to 17, rulings block:

> R2: the Studio destination tile routes to the Studio hub;
> AMENDED by the F-005 mechanical fix to the exact route
> /studio/v2/studio (no /studio/v2 index page exists; no early
> rename, no compatibility redirects).

PRD lines 151 to 158, AC3:

> The Studio tile routes to the exact route /studio/v2/studio
> (RULED R2, 29 Aug 2026; exact route per the F-005 fix:
> /studio/v2 has no page, and no early rename or compatibility
> redirect is added ahead of the CR-057 cutover move).

PRD line 365, parity ledger row 6, repeats the exact route and
records that the function-map row updates in the build commit.

All three of Sol's prohibitions are written into the PRD: no
/studio/v2, no early /studio/v2/studio to /studio cutover, no
compatibility redirects.

Stated plainly so round 2 is not surprised: the live code has not
moved yet. app/studio/v2/home/home/useHomeViewModel.js line 36
still carries href: "/studio", and Home.contract.js line 23 still
carries canonicalCreationWorkspace: "/studio". That is by design
under the PRD's own header rule, "no build starts on an unsigned
PRD". F-005 is closed as a contract defect; the tile move is build
work that lands with the Home build commit.

## F-006, HIGH, the remote fixture / render gate is not executable

Status: OPEN.

FE accepts all three of Sol's gaps without argument: the
/dev/ui-preview route calls notFound() under NODE_ENV production,
the preview client renders Home with no fixture injection, and no
longest-content fixture exists.

The PRD stopped claiming the gate is executable. PRD lines 232 to
236 record the longest-content fixture as not existing, and PRD
lines 451 to 456 and 531 name the FE task home-preview-staging-gate
as the precondition for every remote render gate.

The blocking half is not FE's. It is the stable design/fe-dev
staging deployment, which is the operator step in Sol's own HACM
path: Sol inspects, Sol gives the exact operator step, Nick
executes against Git and Railway, Nick returns observed state, Sol
validates.

Reported to Sol as Brian's account, and marked here as not
independently verifiable from this repo: Nick took the staging
deployment work in his message of 30 Aug 2026. No 30 Aug message
from Nick is committed anywhere in this repository, so FE records
it as reported rather than as evidence. What the repo does show,
at bible/STATUS.md, is consistent with the work being open and
owned by Nick: "STAGING URL: none recorded; requested from Nick,
logged here once received", and a staging model recorded as a
working assumption that is explicitly not confirmed.

F-006 therefore stays OPEN and cannot be closed by FE alone. It
closes when the staging URL exists and the four states (warm,
cold, error, longest content) render remotely at 390 and 1440
without publishing a development harness on production Crestfall.

## F-007, MEDIUM, signed-out Home is constrained by /studio/**

Status: OPEN-WITH-PROPOSAL. See the proposals section, item P2.
The one-line ruling Sol asks for is drafted and is at PRD lines 36
to 38 and 225 to 231; this packet does not assert it closed.

## F-008, MEDIUM, muted-creator exclusion needs an actor-aware feed

Status: ACCEPTED / DEFERRED, matching Sol's own disposition
("Accepted deferred / future contract warning").

FE agrees with the finding as stated: the current public discovery
path is actorless, so server-side per-account mute exclusion is
impossible until discovery becomes actor-aware, and CR-028 and
CR-029 cannot claim it before then.

PRD lines 219 to 225, key flows and edge cases:

> Contract warning (ACCEPTED-DEFERRED, F-008): the current public
> discovery path is actorless, so server-side per-account mute
> exclusion is impossible until discovery becomes actor-aware;
> CR-028 and CR-029 carry this warning and cannot claim
> server-side mute exclusion before that lands.

Nothing in the present Home build depends on this. It is a future
Services plus FE transport contract, owned by Nick when the
mute-aware discovery CR lands. It should not stall round 2.

## F-009, HIGH, Just mine and private / internal filtering

Status: OPEN-WITH-PROPOSAL. See the proposals section, item P1;
F-009 travels with F-002 because the candidate set is meaningless
without the projection, exactly as Sol's finding says.

## Proposals pending Brian go

Both items below are drafted in the PRD and are recorded there
under ruling labels S1 and S3 dated 29 Aug 2026. This packet
re-surfaces them as PROPOSED and PENDING BRIAN GO because the
30 Aug brief directs FE to put them to Brian for an explicit
confirmation before Sol round 2 treats them as settled. FE has not
altered, weakened, or re-decided either one; the text below is the
PRD text. Under CLAUDE.md, silence is never approval and never
ratification, so FE will not represent these to Sol as closed
until Brian answers.

### P1, the visibility projection and the shelf candidate set (F-002 and F-009)

Plain reading first. The filter's four words, Private, Internal,
Public, Canon, are labels Home works out for itself from three
facts the backend already stores. They are not a backend field and
nothing here renames anything in the backend. A creation is filed
into exactly one of the four buckets, and the first rule that
matches wins.

Authority this was drafted from, read in the converged Crestfall
repo: lib/server/creations/constants.js (visibility PRIVATE,
UNLISTED, PUBLIC; status DRAFT, IN_REVIEW, APPROVED, REJECTED,
ARCHIVED; canonStatus NONE, CANDIDATE, COMPATIBLE, OFFICIAL), the
publishing section ViewModel (only OFFICIAL is treated as canon,
and a creation can be APPROVED while PRIVATE or UNLISTED), and the
internal-editing service (APPROVED work moves to UNLISTED plus
DRAFT for link-share editing). The Services list predicate is not
locally inspectable because the community route proxies to
/v1/community/creations, so everything resting on it is marked
OPEN below and is not assumed.

PROPOSED projection, evaluated top to bottom, first match wins:

| Precedence | Backend facts | Home display bucket |
|---|---|---|
| 1 | canonStatus = OFFICIAL, any visibility, any status | CANON, exclusive, never also PUBLIC |
| 2 | canonStatus in NONE, CANDIDATE, COMPATIBLE, and visibility = PUBLIC, and status = APPROVED | PUBLIC |
| 3 | same canonStatus set, visibility = UNLISTED, any status, including the APPROVED link-share state and the moved-to-internal-editing DRAFT state | INTERNAL |
| 4 | same canonStatus set, visibility = PRIVATE, any status | PRIVATE |
| OPEN | visibility = PUBLIC with status not APPROVED | OPEN for round 2; the transitions read this session never produce these combinations, but their absence is unproven; if any exists in live data its bucket needs a ruling, not a guess |

Consequences that follow from the table, stated so they are not
re-litigated later:

- CANDIDATE and COMPATIBLE are not canon. They fall through to the
  visibility rows, matching the chassis code where only OFFICIAL is
  treated specially.
- "Just mine" is a pure ownership filter and combines with any
  bucket. Mine plus Public excludes the user's own canon work,
  because Canon is exclusive; that work answers only to Mine plus
  Canon.

PROPOSED candidate set for the three creation shelves, which is
the direct answer to F-009. The shelves draw from the union of
both collections Home already receives, never from the community
list alone:

1. Union ownedCreations and communityCreations.
2. Deduplicate by creation id; the owned copy wins, so the user's
   own public work appears once with its ownership intact.
3. Derive per item: ownership (mine when the id is in
   ownedCreations, otherwise others) and the display bucket per
   the projection table.
4. Apply the CR-030 filter: ownership first, then bucket. Filtering
   always precedes ranking.
5. Rank and project the surviving items into the shelves.

Still OPEN for Sol round 2 under this proposal, as confirmations
rather than guesses:

- O1: the exact eligibility predicate of the Services
  /v1/community/creations list. Expected to be visibility PUBLIC
  plus status APPROVED plus moderation gates; expected, verify
  first, since the local repo only proxies it.
- O2: whether visibility PUBLIC ever coexists with a status other
  than APPROVED in live data.
- O3: whether canonStatus CANDIDATE or COMPATIBLE carries any Home
  display consequence beyond falling through to its visibility
  bucket.
- O4: whether ARCHIVED items are eligible for the shelves at all.
  Their bucket is defined above; their eligibility is a product and
  Services question.

PENDING BRIAN GO.

### P2, signed-out Home under current /studio/** authority (F-007)

Plain reading first. Home cannot decide for itself what a
signed-out visitor sees, because the page sits under /studio and
the parent studio layout already turns signed-out visitors away
before Home is reached. So this is not an open Home question; it is
an already-decided routing fact that the PRD should simply write
down.

PROPOSED one-line ruling, which is the line Sol asks for verbatim:

> Home requires sign-in under current /studio/** authority.

With the scope note the PRD carries at lines 225 to 231: the
parent studio layout returns the signed-out gate for every
/studio/** address, so /studio/v2/home never decides this alone,
and a public cold-start Home for signed-out visitors is a separate
future route and chassis decision, out of this PRD.

PENDING BRIAN GO.

## What FE asks of Sol for round 2

1. Re-check F-001, F-003, F-004, F-005 against PRD v0.3 and commit
   d6d6a53 and confirm they can be marked closed.
2. Hold F-002, F-007, F-009 as proposals until Brian's go is
   recorded, then re-check them against the same stable IDs.
3. Treat F-006 as jointly owned and blocked on the staging
   deployment, on the HACM path Sol defined, with Nick executing.
4. Treat F-008 as deferred and not a round 2 blocker, per Sol's own
   disposition.
5. Confirm or correct O1 through O4, which are the only places
   where FE declined to guess.

Round 1 verdict BLOCK is not contested. FE's position is that the
corrective burden was PRD clarification, as Sol said, and that
four of the nine are now mechanically closed with evidence.
