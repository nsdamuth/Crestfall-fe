# Crestfall Home PRD — Sol Attack Round 1
## Detailed Findings F-001 through F-009

**Date:** 2026-08-29  
**Session:** `CF-CRESTFALL-EDITING-S01-2026-08-29`  
**Review target:** `bible/prds/2026-08-29-home.md` v0.2  
**Review mode:** Read-only attack/review  
**FE authority inspected:** `Crestfall-fe-current(20260829-160416).zip`  
**Services authority inspected:** `services-current(20260829-055820).zip`

---

## Current branch context

At the time of this review:

- `design/fe-dev` remains at:
  - `371b46564c7f1ef2713f4100416ae067b90a696d`
- `main` is at:
  - `293b7ae09a9846b27d35dc51c8dd9fefdf06fe79`
- `main` contains `design/fe-dev` through:
  - `293b7ae0 Merge branch 'design/fe-dev'`
- Local and remote heads agree.
- The working tree was clean.
- `design/fe-dev` remains a valid independently addressable staging branch even though its contents have now been merged into `main`.

This review therefore treats the nine findings below as the **active Home PRD review backlog**, not as branch-recovery work.

---

# Executive summary

**Round 1 verdict: BLOCK**

The review produced:

- **1 Critical**
- **6 High**
- **2 Medium**

The BLOCK verdict does **not** mean nine large systems are broken.

Seven findings affect the Home PRD or present Home implementation contract directly and should be resolved before the PRD becomes implementation authority:

- F-001
- F-002
- F-003
- F-004
- F-005
- F-006
- F-009

Two findings primarily record current or future authority and should not unnecessarily stall present work once explicitly ruled:

- F-007
- F-008

---

# F-001 — CRITICAL
## Home filter persistence is assigned to the wrong LOOM layer

### Location

- Home PRD AC6
- CR-030
- Home Binding Shell / ViewModel boundary
- Crestfall LOOM

### Finding

The PRD currently instructs the **Home Binding Shell** to own `localStorage` persistence for:

```text
cf.home.creationsFilter
```

That violates the active Crestfall LOOM boundary.

### Why this is a problem

The Binding Shell is meant to stay thin. Its responsibilities are limited to things such as:

- invoking the ViewModel,
- passing the ViewModel contract into the View,
- adapting route or parent inputs.

The shell should not become the owner of application-relevant persistent state or lifecycle effects.

The selected Home creation filter is application state because it:

- survives rendering,
- affects presentation and candidate selection,
- persists between page visits,
- needs read/write synchronization.

That responsibility belongs in the **ViewModel**, or in a persistence client/adapter invoked by the ViewModel.

### Current incorrect shape

```text
Home View
  ↓
Binding Shell
  ↓
localStorage
```

### Required shape

```text
Home View
  ↓
Binding Shell
  ↓
useHomeViewModel
  ↓
persistence adapter / localStorage
```

### Important clarification

The finding does **not** reject `localStorage` as the current interim persistence mechanism.

The issue is strictly **ownership**.

### Required correction

Update the PRD/CR so that:

- the Binding Shell remains thin,
- `useHomeViewModel` owns initialization and synchronization,
- or the ViewModel delegates persistence to a client adapter.

### Work lane

**Frontend / PRD**

### Services API change required?

**No.**

### Disposition

**Must fix before implementation authority.**

---

# F-002 — HIGH
## `private | internal | public | canon` is not one current backend visibility enum

### Location

- Home PRD AC6
- CR-014 / CR-030
- Creation lifecycle/access authority

### Finding

The PRD describes:

```text
private
internal
public
canon
```

as though they can be applied directly as values of one live creation visibility field.

They cannot.

### Current backend authority

Current creation authority separates multiple concepts:

```text
visibility
status
canonStatus
```

Creator-controlled visibility currently includes states such as:

```text
PRIVATE
UNLISTED
```

Published/canon behavior is derived through lifecycle and access authority rather than from one four-value enum.

For example, canon is not safely represented as:

```js
creation.visibility === "CANON"
```

### Why this matters

A Home implementation that directly compares a UI filter to `creation.visibility` could:

- omit legitimate public/canon work,
- misclassify approved creations,
- incorrectly expose internal/unlisted creations,
- create inconsistent behavior with Vault/Community/runtime authority.

### What Home actually needs

Home needs an explicit **presentation projection**, conceptually:

```text
PRIVATE
INTERNAL
PUBLIC
CANON
```

derived from the authoritative backend fields.

Example conceptual input:

```text
visibility + status + canonStatus
```

producing one or more Home display buckets.

### Product decisions still required

The PRD must explicitly rule overlap and precedence.

Examples:

- Does a canon creation appear in both `PUBLIC` and `CANON`?
- Or is `CANON` exclusive and higher precedence?
- What exact current backend combination maps to `INTERNAL`?
- Does `UNLISTED + APPROVED` mean INTERNAL?
- What happens to draft/private creator-owned work?

### Required correction

Define a deterministic UI projection rather than claiming these are the backend enum.

### Work lane

**Product ruling + Frontend**

### Services API change required?

**Probably not for Home.**

Existing fields appear sufficient for a frontend projection.

### Disposition

**Must fix before implementation authority.**

---

# F-003 — HIGH
## “Recently added” would currently sort by update time, not creation time

### Location

- Home PRD AC4 / R3
- `communityPresentation.js`
- `useHomeViewModel.js`

### Finding

The existing Home rail is currently semantically correct as:

```text
Recently updated
```

because its recency is derived from:

```text
updatedAt
```

The new PRD wants to rename the rail to:

```text
Recently added
```

without clearly changing the source timestamp.

### Why this is wrong

If a five-year-old creation is edited today, it can become the newest item by `updatedAt`.

That is valid for:

```text
Recently updated
```

but false for:

```text
Recently added
```

### Existing backend support

The current Services summary already exposes both:

```text
createdAt
updatedAt
```

So no backend field is missing.

### Required correction

For the `Recently added` rail:

```text
sort descending by createdAt
```

The frontend presentation model should preserve both timestamps distinctly.

Suggested semantics:

```text
createdAt  → Recently added
updatedAt  → update/recency metadata where appropriate
```

### Work lane

**Frontend**

### Services API change required?

**No.**

### Disposition

**Must fix.**

---

# F-004 — HIGH
## “Top rated” has no truthful current ranking definition

### Location

- Home PRD AC4 / R3
- Current Home recommendation logic
- Community summary contract

### Finding

The PRD requires a shelf named:

```text
Top rated
```

but the current implementation does not have a real rating metric matching that name.

### Current Home recommendation behavior

The existing recommendation order roughly considers:

1. featured state,
2. canon state,
3. weighted engagement,
4. recency.

Current UI sorting also includes options such as:

- Recommended
- Most played
- Newest

That is not the same thing as a defined “rating.”

### Additional contract problem

The current FE recommendation formula references saves/bookmarks.

But the current Services community creation summary returns engagement values such as:

- likes,
- messages,
- images,
- videos,

and does **not** currently supply saves/bookmarks to this path.

So the save term effectively contributes zero.

### Why this matters

A user-facing label like:

```text
Top rated
```

implies a stable, explainable ranking.

Without a defined score it becomes misleading and impossible to test consistently.

### Required ruling

Choose one of two paths.

#### Option A — truthful interim label

Keep the existing behavior and call the rail:

```text
Recommended
```

until the future curated/rated feed exists.

#### Option B — define Top Rated now

Explicitly define:

- inputs,
- weights,
- tie breakers,
- treatment of canon/featured state,
- whether saves participate,
- how missing data is handled.

If saves are part of the score, Services must expose them on this path.

### Recommended interim direction

Use:

```text
Recommended
```

unless product has a real rating definition ready now.

### Work lane

**Product + Frontend**

Potential backend work only if the chosen score requires currently unavailable metrics.

### Services API change required?

**Not necessarily.**

### Disposition

**Must rule before implementation authority.**

---

# F-005 — HIGH
## The pre-cutover Studio destination must be specified exactly

### Location

- Home PRD AC3 / R2
- Current route tree
- Final URL-map ruling

### Finding

The PRD refers loosely to a:

```text
/studio/v2 Studio hub
```

But current route authority is more specific.

### Current route truth

The current V2 Studio tool route is:

```text
/studio/v2/studio
```

There is no authoritative page at:

```text
/studio/v2
```

Current Home still points its Studio tile to:

```text
/studio
```

### Final URL-map ruling

The final top-level route rename is deliberately parked until the **all-nine cutover**.

Therefore we must not opportunistically rename or redirect the current route family early.

### Required interim contract

For this staging/build cycle:

```text
Home Studio tile
    ↓
/studio/v2/studio
```

### Explicitly avoid

Do not use:

```text
/studio/v2
```

Do not perform the final:

```text
/studio/v2/studio → /studio
```

cutover early.

Do not add compatibility redirects just because route names appear inconsistent.

### Work lane

**Frontend / PRD**

### Services API change required?

**No.**

### Disposition

**Must fix.**

---

# F-006 — HIGH
## The PRD’s required remote fixture/render gate is not currently executable

### Location

- Home PRD AC2 / C2 / rollout gate
- Home preview harness
- Home fixtures
- staging deployment

### Finding

The PRD requires stable remote fixture/render review, but the current preview mechanism cannot satisfy the described gate as written.

### Problem 1 — preview route is disabled in production mode

The current route:

```text
/dev/ui-preview/home-v2-page
```

calls `notFound()` when:

```text
NODE_ENV === "production"
```

A Railway staging deployment is likely to run a production build, so this route cannot simply be assumed to work remotely.

### Problem 2 — Home fixtures are not actually injected by the preview wrapper

The preview client currently renders:

```jsx
<Home />
```

without a mechanism that selects/injects the required Home fixture state.

So the route existing locally does not mean QA can remotely choose the exact test scenario.

### Problem 3 — the PRD claims a longest-content fixture that does not exist

Current Home fixture coverage includes states equivalent to:

- full,
- empty continue,
- empty rails,
- error.

There is no explicit:

```text
longest-content
```

fixture matching the PRD requirement.

### Why this matters

The PRD cannot make stable remote render verification a blocking acceptance gate if the harness cannot generate the required states on the staging deployment.

### Required correction

Create a staging-safe preview/test mechanism capable of rendering at least:

1. warm/full state,
2. cold/empty state,
3. error state,
4. longest-content stress state,

at required widths such as:

```text
390px
1440px
```

without unintentionally publishing a development harness on production Crestfall.

### Connection to staging URL work

This finding directly depends on the stable `design/fe-dev` deployment.

The correct HACM workflow is:

```text
Sol inspects deployment/source authority
    ↓
Sol gives exact operator step
    ↓
Nick executes against Git/Railway
    ↓
Nick returns observed state
    ↓
Sol validates and gives next step
```

Lack of direct Railway access by Sol is not itself a blocker.

### Work lane

**Frontend preview harness + operator deployment setup**

### Services API change required?

**No.**

### Disposition

**Must fix before remote render gate can pass.**

---

# F-007 — MEDIUM
## Signed-out Home behavior is already constrained by the parent `/studio/**` route

### Location

- Home PRD signed-out edge case
- `app/studio/layout.js`

### Finding

The PRD currently treats signed-out Home behavior as an open Home-level question.

Under the current route tree, that is not fully open.

### Current authority

The parent Studio layout checks authentication and returns:

```text
SignedOutStudioGate
```

for unauthenticated access under:

```text
/studio/**
```

Therefore:

```text
/studio/v2/home
```

does not independently decide what a signed-out user sees.

### Why this matters

A future product decision like:

> show a public cold-start Home to signed-out users

would require a routing/chassis/auth decision above the Home View.

It is not a simple Home component state.

### Required correction

For the current staging cycle, document:

```text
Home requires sign-in under current /studio/** authority.
```

If a public Home is wanted later, make that a separate route/chassis decision.

### Work lane

**Documentation / Product authority**

Potential frontend chassis work only if auth behavior intentionally changes.

### Services API change required?

**No current change.**

### Disposition

**Record current reality.**

This should not remain a hard implementation blocker once explicitly ruled.

---

# F-008 — MEDIUM
## Future muted-creator exclusion requires an actor-aware community feed

### Location

- Home muted-creator edge case
- CR-028 / CR-029
- Services community list authority

### Finding

The current public community discovery request is effectively actorless.

The server does not receive a meaningful current-user actor on the existing public list path.

### Why this matters

A future requirement such as:

```text
User A muted Creator B
```

followed by:

```text
exclude Creator B's creations from User A's discovery feed
```

requires the server to know that the requesting actor is User A.

Without actor context, server-side per-account mute filtering is impossible.

### Current consequence

This does **not** mean current Home discovery is broken.

It means future CR-028 / CR-029 cannot claim server-side mute exclusion until discovery becomes actor-aware.

### Future required shape

Conceptually:

```text
Authenticated user
    ↓
actor-aware FE API request
    ↓
Services API
    ↓
community feed/list as actor
    ↓
mute/block filtering
    ↓
public eligible creations
```

### Work lane

**Future Services API + FE transport**

### Services API change required now?

**No.**

### Services API change required later?

**Yes, when mute-aware discovery is implemented.**

### Disposition

**Accepted deferred / future contract warning.**

---

# F-009 — HIGH
## “Just mine” and private/internal filtering cannot work against the current rail candidate set

### Location

- Home PRD AC6
- `getHomePageData.js`
- `useHomeViewModel.js`
- community presentation

### Finding

Home currently receives two separate collections:

```text
ownedCreations
communityCreations
```

But the three discovery rails are currently built from:

```text
communityCreations
```

only.

### Why this matters

The public community collection does not contain the user's entire private/unlisted owned creation set.

Therefore a filter such as:

```text
Just mine
+
Private
```

cannot be implemented by simply filtering the existing rail items.

The required creations are not in that candidate set.

### Required interim candidate-set rule

The PRD needs to define how Home combines owned and community sources.

Conceptually:

```text
public community creations
          +
user-owned creations
          ↓
deduplicate by creation ID
          ↓
derive ownership
          ↓
derive Home visibility bucket
          ↓
apply ownership / visibility filters
          ↓
rank/project rail items
```

### Deduplication is mandatory

A user's own PUBLIC creation may exist in both:

```text
ownedCreations
communityCreations
```

Home must display it once, not twice.

### Relationship to F-002

F-009 depends directly on the visibility projection from F-002.

After combining sources, every item needs a deterministic Home-facing state such as:

```text
ownership = mine | others
displayVisibility = private | internal | public | canon
```

before filters are applied.

### Questions the PRD must answer

- Is `Just mine` an ownership filter independent from visibility?
- Does `Mine + Public` include the user's own canon items?
- Are canon items exclusive to `Canon`, or also included in `Public`?
- How are PRIVATE and UNLISTED mapped?
- Which collection wins if duplicated records differ slightly?
- Does ranking happen before or after filtering?

### Work lane

**Frontend ViewModel + Product/PRD**

### Services API change required?

**No immediate change appears necessary.**

The two source collections already exist.

### Disposition

**Must fix before implementation authority.**

---

# Positive authority check
## Story resume route is correct

No finding was raised against the Home Story continuation path.

The current active Story Chat route remains:

```text
/studio/story-rooms/[id]
```

Home currently resolves the latest eligible room and resumes there.

This is consistent with current accepted route authority.

Do **not** redirect this behavior to:

```text
/studio/v2/stories/[id]
```

The unfinished V2 Stories chat surface is not active runtime authority.

---

# Recommended triage

| Finding | Severity | Current status | Primary lane | Recommended treatment |
|---|---|---|---|---|
| F-001 | Critical | Open | FE / PRD | Must fix |
| F-002 | High | Open | Product + FE | Must define projection |
| F-003 | High | Open | FE | Must use `createdAt` |
| F-004 | High | Open | Product + FE | Must define or rename |
| F-005 | High | Open | FE / PRD | Must use exact route |
| F-006 | High | Open | FE + deployment QA | Must make gate executable |
| F-007 | Medium | Open | Product/docs | Record current signed-in authority |
| F-008 | Medium | Deferred | Future Services + FE | Actor-aware feed when CR lands |
| F-009 | High | Open | Product + FE ViewModel | Must define union/dedupe/filter rule |

---

# Recommended working order

## 1. FE revises the Home PRD against stable IDs

Respond to:

```text
F-001 through F-009
```

Do not reset finding IDs in Round 2.

Each finding should become one of:

```text
RESOLVED
ACCEPTED / DEFERRED
OPEN
```

with evidence.

## 2. Establish stable `design/fe-dev` preview

Keep:

```text
design/fe-dev
```

as the independently deployable FE staging line.

Do not treat the merge into `main` as a reason to remove that staging branch.

## 3. Fix the staging fixture/render contract

Resolve F-006 so Gate C2 / Gate 3 can actually be executed remotely.

## 4. Run Sol Round 2

Re-check each stable F-ID against:

- revised PRD,
- current FE source,
- current Services authority where relevant.

## 5. Implement only after review closure

Do not start broad Home refactoring while the PRD still contains unresolved authority contradictions.

---

# Round 1 final verdict

```text
BLOCK
```

Reason:

The Home PRD is directionally usable, but it currently contains enough boundary, data-model, route, ranking, and test-gate ambiguity that it should **not yet be treated as implementation-authoritative**.

The main corrective burden is in **PRD/FE clarification**, not in rebuilding backend systems.
