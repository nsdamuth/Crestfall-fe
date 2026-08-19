# Location Registry Split presentation semantics

Status: semantic presentation contract and realistic fixtures only.

This package brings the current deterministic Location Registry split workflow
into the FE lane without copying the legacy split modal, analyzer, client,
application ViewModel, or API routes.

## Permanent boundary

Crestfall owns:

- deterministic split analysis
- source-integrity analysis
- overlap/selection authority
- server-authoritative plan generation
- inbound-reference validation
- source and plan fingerprints
- stale-plan rejection
- creator-confirmed commit request
- child Registry creation
- source Registry relationship rewrites
- atomic persistence and rollback
- refresh/reload after commit

Crestfall-fe owns presentation of the display-ready analysis and execution state.

This package therefore contains pure projection helpers and fixtures only. It
does not plan or commit a split.

## Current product guarantees represented

The presentation contract carries:

- source counts for Locations, Connections, People & Presence, Weather, and
  child Registry references
- source-integrity errors
- deterministic authored-containment candidates
- candidate overlap blocking
- retained scope Location
- moved descendant Location IDs/names
- internal connections
- boundary rewrites
- People & Presence bindings
- Weather Scope references
- nested child-reference rewrites
- stable-ID preservation
- server validation state
- execution blockers
- source/plan fingerprint presence
- before/after integrity counts
- explicit creator confirmation
- destructive final confirmation copy

The split is source-mutating. A successful commit may create selected child
Location Registries and rewrite source Registry relationships in one atomic
transaction. The final action therefore carries destructive confirmation
semantics.

## Visual integration ruling

FE-REVIEW-01 ruled that the final UI is:

- a dedicated portable package
- composed on `KitModalFrame`
- two-step analysis/preview then reviewed confirmation
- sheet under 700px
- danger treatment for the final destructive confirmation

Those visual files are intentionally not added here.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
