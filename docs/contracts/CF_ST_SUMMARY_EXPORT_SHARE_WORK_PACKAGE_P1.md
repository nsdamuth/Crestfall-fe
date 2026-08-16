# Crestfall Work Package — Scene Summary, Transcript Export, and Unlisted Share Snapshots

**Work Package ID:** `CF-ST-SUMMARY-EXPORT-SHARE-V1`  
**Status:** Proposed / P1 Draft  
**Primary Features:** `CF-ST-014 — Scene Recap`, `CF-ST-015 — Visible Transcript Export`, Unlisted Share Snapshots  
**Architecture:** Crestfall strict MVVM/service boundary  
**Frontend Coordination:** LOOM GUI team handoff required  
**Prepared:** 2026-08-04

---

# Document Structure

This work package is intentionally divided into three maintained parts.

## Part 1 — Proposed Work and Frontend Coordination Brief

The initial implementation proposal, scope, architecture, contracts, expected frontend surfaces, and items the LOOM GUI team should consider before or during implementation.

## Part 2 — Implementation Record

Updated during delivery with the actual patches, SQL, routes, services, contracts, implementation decisions, validation results, and deviations from the P1 proposal.

## Part 3 — Final LOOM Frontend Absorption Handoff

Completed at the end of the work package with the exact frontend components, Views, ViewModels, contracts, client methods, routes, styles, and interaction patterns created or changed so the GUI team can absorb them into its ongoing LOOM workflow.

---

# PART 1 — PROPOSED WORK AND FRONTEND COORDINATION BRIEF

## 1. Purpose

This work package introduces three related but separate capabilities:

1. **Current scene / story-beat summary**
2. **Private visible transcript export**
3. **Immutable unlisted share snapshots**

These capabilities will reuse a common transcript-range and visibility-filtering foundation, but they must remain separate user workflows.

The work package must preserve the following distinctions:

- A summary is a user-facing recap of the current scene or story beat.
- An export is a private owner-generated file.
- A share is an immutable snapshot accessible by link.
- Export must not create a share.
- Share must not expose the live Story Room.
- Shared pages must not be intentionally indexed or listed.
- Llama Guard determines durable-share eligibility; it does not grant discoverability.
- Structured runtime truth remains authoritative and separate from generated narrative summaries.

## 2. Governing Architecture

All product-data paths must follow:

```text
FE View
→ ViewModel/client
→ FE API proxy
→ services-api
→ PostGraphile
→ database
```

Direct Supabase access is allowed only for authentication/session handling.

### View

- Presentation and semantic intent
- Controls, dialogs, selectors, loading states, errors, and accessible labels
- No business logic
- No direct API calls
- No transcript filtering or privacy decisions

### ViewModel

- UI state
- Range-selection state
- Validation
- Action orchestration
- Response normalization
- Feedback and failure handling
- Translation between backend contracts and View props

### Client / FE API

- Normalized request contracts
- Authenticated proxying
- No feature business logic in the FE API route

### services-api

- Authorization
- Visibility filtering
- Range resolution
- Summary context assembly
- Snapshot composition
- Privacy scrubbing
- Safety eligibility
- Llama Guard orchestration
- Persistence and lifecycle enforcement

### PostGraphile / Database

- Durable snapshot, export, and certification state
- Actor-authorized mutations
- Idempotency
- Expiry and revocation
- Immutable snapshot content
- Public-link lookup rules

## 3. Scope

## 3.1 Slice A — Current Beat Summary

Add a `/summary` command that summarizes only the current story beat or active scene boundary.

### Intended behavior

The command resolves the narrowest reliable active boundary:

```text
current beat
→ current scene
→ latest deterministic transition boundary
→ bounded recent visible-message fallback
```

It must never silently summarize the entire Story Room.

### Summary contents

The user-facing summary should include, when available:

- Events that occurred in the current beat
- Current location
- Current world time
- Active participants
- Important changed state
- Important items
- Relationship developments
- Active objectives
- Unresolved questions
- Immediate tensions or decisions
- Current beat or scene purpose

### Structured truth

Structured state must be read from deterministic runtime/state systems, including relevant:

- Story runtime
- Beat/scene state
- Location state
- Time/calendar state
- Inventory/item state
- Relationship state
- Quest/event state
- Active participant state

The generated prose may describe this state but must not replace or mutate it.

### Summary presentation

P1 proposal:

- Display the recap outside the canonical transcript.
- Prefer a modal, drawer, or dedicated summary panel.
- Do not insert it as an NPC, Narrator, player, or normal Story Room message.
- Do not create a fake player turn.
- Do not advance runtime state.
- Do not write to Memory Palace unless separately approved later.

### Proposed action contract

```json
{
  "actionType": "SUMMARIZE_CURRENT_BEAT",
  "roomId": "uuid",
  "clientRequestId": "uuid"
}
```

Resolved response should include:

```json
{
  "boundary": {
    "type": "BEAT",
    "beatId": "string-or-null",
    "sceneId": "string-or-null",
    "startMessageId": "uuid",
    "endMessageId": "uuid"
  },
  "structuredFacts": {},
  "summary": "User-facing recap text",
  "generatedAt": "timestamp"
}
```

Exact names must follow the current chat contracts after inspection.

## 3.2 Slice B — Private Visible Transcript Export

Activate the existing **Export Chat** stub as a workflow independent from sharing.

### Export behavior

- Owner-only
- No public URL
- Server-generated
- Visibility-filtered
- Privacy-scrubbed
- Uses only the selected frozen range at export time
- Does not mutate the Story Room
- Does not create a durable share snapshot unless later explicitly approved

### Initial export formats

P1 target:

- Plain text
- Markdown

HTML, PDF, or other formats are out of initial scope unless separately approved.

### Range choices

The UI should support:

- Current beat
- Current scene
- Most recent 25 visible messages
- Most recent 50 visible messages
- Custom start and stop messages

Default behavior:

- Start from the newest eligible visible message.
- Work backward to the configured default limit.

### Proposed limits

These are P1 proposals and should be confirmed during implementation:

```text
Default visible-message limit: 50
Maximum visible-message limit: 200
Maximum rendered transcript text: 100,000 characters
```

The character ceiling remains authoritative even when fewer than 200 messages are selected.

### Export filtering

The export must exclude:

- System prompts
- Provider prompts
- Hidden engine messages
- Moderation diagnostics
- Safety internals
- Private actor state
- Private Memory Palace content
- Private participant notes
- Hidden transcript events
- Deleted/redacted content not visible to the owner
- Generation payloads
- Internal IDs unless needed for an explicit owner-debug export, which is out of scope

The export should preserve:

- Story Room title
- Included participant display names
- Selected visible transcript order
- Rendered speaker labels
- Visible narration/dialogue text
- Optional creation timestamp
- Optional selected-range description

## 3.3 Slice C — Temporary Unlisted Share Snapshot

Add a short-lived, immutable, unlisted share link.

### Purpose

Allow the owner to share a selected frozen transcript range without creating a long-lived publication.

### Duration

P1 target:

```text
Default expiration: 1 hour
```

Expiration should be enforced by the server and database.

Expired shares should return either `410 Gone` or `404 Not Found`; the final choice must be documented in Part 2.

### Safety rule

A temporary share may avoid a new aggregate Llama Guard scan only when every selected message has valid current safety provenance and the complete range passes deterministic share eligibility checks.

Eligibility must require:

- No hidden/internal messages
- No redacted or blocked message
- No failed safety result
- No missing or stale safety provenance
- Permitted content rating
- Owner authorization
- Valid range limits

If any requirement fails:

- Require the durable reviewed-share workflow, or
- Refuse the selected range

Temporary sharing must not become a safety-review bypass.

### Temporary-share protections

- Unguessable opaque token
- No sequential public ID
- One-hour expiry
- Immediate owner revocation
- No public listing
- No profile listing
- No community listing
- No sitemap inclusion
- No internal site-search inclusion
- `noindex`
- `nofollow`
- `noarchive`
- `nosnippet`
- `noimageindex`
- `X-Robots-Tag` headers
- Strict cache controls
- No anonymous enumeration
- Optional future maximum-view count, not required for P1

### User-facing language

Recommended copy:

> Anyone with this link can view the selected snapshot until it expires. It will not be listed publicly or submitted for search indexing.

## 3.4 Slice D — Persistent Unlisted Share Snapshot

Add a durable shareable link for an immutable snapshot.

### Publication eligibility

The complete selected snapshot must pass the approved Llama Guard workflow before the persistent link becomes active.

Llama Guard approval means:

- Eligible for link-based sharing
- Not automatically discoverable
- Not indexed
- Not listed
- Not added to community surfaces
- Not added to profiles

### Persistent-share protections

- Immutable frozen snapshot
- Unguessable URL
- Owner revocation
- Report/takedown path
- No sitemap inclusion
- No site-search inclusion
- No public profile listing
- No community discovery
- `noindex`
- `nofollow`
- `noarchive`
- `nosnippet`
- `noimageindex`
- `X-Robots-Tag` headers
- Reduced or disabled caching where appropriate
- No live dependency on the Story Room transcript

### Rogue indexers and scrapers

Robots directives are advisory and cannot stop a malicious scraper with the URL.

The design must therefore rely on layered exposure reduction:

- Opaque high-entropy links
- No public link graph
- No enumeration
- No sitemap
- No discovery surfaces
- Revocation
- Expiration for temporary shares
- Restricted metadata
- Isolated renderer where feasible

A separate share hostname may be considered later, for example:

```text
share.crestfall.net
```

This is an architectural option, not an automatic P1 requirement.

## 4. Common Snapshot Builder

Export and both share modes should use a common server-side snapshot composition service.

### Responsibilities

- Authorize the requesting owner
- Resolve the requested range
- Enforce maximum messages and characters
- Load only eligible visible messages
- Preserve transcript order
- Normalize public speaker data
- Preserve approved presentation segments
- Remove private/internal metadata
- Record source message IDs internally
- Produce an immutable snapshot document
- Produce a stable content hash
- Record visibility/safety provenance
- Return a normalized snapshot contract

### Conceptual snapshot contract

```json
{
  "version": "chat_share_snapshot_v1",
  "roomId": "uuid",
  "ownerId": "uuid",
  "title": "Story title",
  "range": {
    "type": "CUSTOM",
    "startMessageId": "uuid",
    "endMessageId": "uuid",
    "visibleMessageCount": 42
  },
  "participants": [],
  "messages": [],
  "contentRating": "SFW",
  "contentHash": "sha256",
  "createdAt": "timestamp"
}
```

The public renderer must receive only the public snapshot representation, not internal ownership, certification, or source metadata.

## 5. Share Lifecycle

### Temporary share

```text
DRAFT
→ ACTIVE
→ EXPIRED or REVOKED
```

### Persistent reviewed share

```text
DRAFT
→ PENDING_REVIEW
→ APPROVED
→ ACTIVE
→ REVOKED
```

Failure states may include:

```text
REJECTED
FAILED
```

Exact status values must follow existing Crestfall lifecycle conventions where practical.

## 6. Visibility and Privacy Rules

A single visibility policy must govern:

- Summary transcript context
- Private export
- Temporary share
- Persistent share
- Public share rendering

The policy must consider:

- Transcript visibility
- Message kind
- Sender type
- Redaction status
- Moderation status
- Private metadata
- Participant-specific visibility
- Engine-only events
- Automatic media
- System notices
- Memory Palace visibility
- Current user authorization

The browser DOM is never the source of truth for export or share eligibility.

## 7. Frontend Work Expected — LOOM GUI Team Coordination

This section describes the frontend work currently expected so the GUI team can account for the feature surfaces before implementation begins.

These are proposed surfaces, not a claim that the final implementation will use these exact files or structures.

## 7.1 Existing entry points likely involved

- Story Room side-panel summary/memory area
- Existing **Export Chat Soon** button
- Existing **Share Snapshot Soon** button
- Story Room transcript
- Story Room shell ViewModel
- Story Room command/composer flow for `/summary`
- FE API proxy layer
- Client methods under Story Room client services

## 7.2 Proposed new or expanded Views

### Scene Summary View

Responsibilities:

- Render current beat/scene boundary label
- Show loading, success, empty, and error states
- Render structured facts separately from narrative recap
- Allow close and refresh
- Avoid transcript-message styling that implies a speaker

Possible form:

- Modal
- Side-panel section
- Drawer

The GUI team should determine the final presentation pattern while preserving semantic separation from the transcript.

### Export Range Dialog View

Responsibilities:

- Preset selection
- Custom start/stop selection
- Visible message-count preview
- Character-count warning
- Export format
- Submit/cancel
- Validation and errors

### Share Snapshot Dialog View

Responsibilities:

- Temporary versus persistent mode
- Range selection
- Expiry explanation
- Llama Guard review explanation for persistent shares
- Non-indexing explanation
- Attribution option if approved
- Submit/cancel
- Certification state
- Generated link
- Copy-link action
- Revoke action

### Shared Snapshot Public View

Responsibilities:

- Render frozen title, participants, scenario context when included, and visible messages
- Preserve approved narration/dialogue formatting
- Avoid authenticated Story Room controls
- Avoid edit, regenerate, continue, report, memory, or engine controls
- Render expiry/revocation/unavailable states
- Include robots and cache directives through route metadata/headers

## 7.3 Proposed ViewModel responsibilities

### Summary ViewModel

- Invoke summary action
- Track request lifecycle
- Normalize structured facts
- Hold recap presentation state
- Prevent duplicate requests
- Ignore stale responses on room change

### Export ViewModel

- Resolve preset/custom range state
- Validate range
- Display estimated message/character counts
- Request server export
- Handle file delivery
- Preserve selection on recoverable errors

### Share ViewModel

- Resolve mode and range
- Explain temporary versus persistent behavior
- Manage certification lifecycle
- Poll or refresh review status only if required
- Handle copied-link feedback
- Revoke snapshot
- Prevent stale status from a previous room/snapshot

## 7.4 Proposed contracts

The GUI team should expect contracts for:

- Range presets
- Custom message boundaries
- Range preview
- Summary result
- Export request/result
- Share eligibility
- Share creation result
- Review/certification status
- Public snapshot renderer
- Expiry/revocation state

All contracts should be explicit and small enough for LOOM absorption.

## 7.5 Interaction requirements

- Export and Share remain separate controls.
- Summary remains separate from both.
- Buttons must expose tooltips and accessible labels.
- Async actions must prevent duplicate clicks.
- Errors must not mutate or clear the transcript.
- Navigating between Story Rooms must clear stale local request ownership.
- Public snapshot pages must not expose authenticated Story Room actions.
- Temporary and persistent sharing must use clearly different wording.

## 8. Proposed Backend Service Areas

Exact paths depend on current code inspection.

Conceptual service areas:

```text
services/api/src/services/chat/summary/
services/api/src/services/chat/transcriptExport/
services/api/src/services/chat/shareSnapshots/
```

A common range/visibility/snapshot service may be placed under the existing chat domain rather than creating unnecessary directories.

No new directory should be created without confirming current organization and live callers.

Potential responsibilities:

- `resolveChatTranscriptRange`
- `filterVisibleTranscriptMessages`
- `buildChatSnapshot`
- `summarizeCurrentStoryBoundary`
- `createTranscriptExport`
- `createTemporaryShare`
- `submitPersistentShareForReview`
- `resolvePublicShareSnapshot`
- `revokeShareSnapshot`
- `expireTemporaryShares`

These are conceptual names only.

## 9. Proposed Persistence

Exact schema must be based on current migrations and naming conventions.

Likely durable concepts:

### Chat snapshot

- Snapshot ID
- Owner ID
- Room ID
- Immutable snapshot JSON
- Content hash
- Range metadata
- Message count
- Character count
- Content rating
- Created timestamp

### Share record

- Share ID
- Snapshot ID
- Mode
- Status
- Opaque token hash
- Expires timestamp
- Revoked timestamp
- Review/certification metadata
- Llama Guard result reference
- Created and updated timestamps

### Export record

A durable export record is optional. P1 should avoid storing private export files unless needed.

Possible minimal audit fields:

- Owner
- Room
- Selected range
- Format
- Generated timestamp

Do not persist exported content redundantly unless a concrete need is established.

## 10. Safety and Certification

### Summary

- Uses already visible transcript and structured state
- Generated output passes normal outbound safety checks
- Does not become authoritative state
- Does not become public automatically

### Export

- Private owner action
- No public publication review required
- Still applies visibility and privacy filtering
- Does not include unsafe internal metadata

### Temporary share

- Requires valid existing per-message safety provenance
- Applies deterministic aggregate eligibility
- Rejects stale/missing/blocked ranges
- No new Llama Guard pass only when all safety requirements are satisfied

### Persistent share

- Requires aggregate Llama Guard review
- Remains inactive until approved
- Stores certification evidence separately from public snapshot output
- Revocation and takedown remain possible after approval

## 11. Non-Goals

This work package does not include:

- Live public Story Rooms
- Search-engine discoverability
- Community feed publication
- Profile share galleries
- Collaborative editing
- Branch creation
- Transcript mutation
- Message deletion
- Message editing
- Public comments
- Likes/bookmarks on shared snapshots
- Automatic Memory Palace writes from summaries
- Whole-room summaries
- Automatic SEO metadata generation
- PDF export in the initial slice
- Permanent public access without owner-controlled revocation

## 12. Delivery Order

### Patch 1 — Current beat summary

- Inspect current beat/scene contracts
- Define boundary resolver
- Add `/summary`
- Add summary presentation surface
- Validate no transcript/runtime mutation

### Patch 2 — Common transcript range and visibility foundation

- Server-side range selection
- Visible transcript filtering
- Range preview contract
- Limits and validation

### Patch 3 — Private transcript export

- TXT/Markdown generation
- Export dialog
- File delivery
- Privacy validation

### Patch 4 — Temporary unlisted share

- Immutable snapshot
- One-hour expiry
- Noindex headers
- Link generation/revocation
- Safety-provenance eligibility

### Patch 5 — Persistent reviewed share

- Aggregate Llama Guard submission
- Certification lifecycle
- Persistent unlisted link
- Revocation/takedown
- Public renderer

### Patch 6 — Hardening

- Concurrency
- Stale requests
- Expiry race conditions
- Idempotency
- Revocation
- Cache behavior
- Public-route headers
- Focused diagnostics

Each patch must remain bounded and validated before continuing.

## 13. Required Validation

### Summary

- Current beat only
- Scene fallback works
- Bounded recent fallback works
- No whole-room accidental summary
- Structured truth and prose remain separate
- No runtime mutation
- No transcript insertion unless separately approved

### Export

- Only selected visible messages
- Correct order
- Correct speaker labels
- No private metadata
- Limits enforced
- Custom start/stop works
- Owner authorization enforced

### Temporary share

- Opaque URL
- One-hour expiry
- Revocation
- No listing
- `noindex`, `nofollow`, `noarchive`, `nosnippet`, `noimageindex`
- Strict cache behavior
- Safety-provenance rejection when invalid
- Expired link unavailable

### Persistent share

- Inactive before Llama Guard approval
- Immutable after activation
- No indexing/listing
- Revocation works
- Report/takedown path works
- Live Story Room changes do not alter snapshot

### LOOM frontend

- Views remain presentation-only
- ViewModels own state and actions
- No direct data calls from Views
- No direct Supabase product-data calls
- Stale responses cannot affect a new room
- Accessibility labels and keyboard behavior verified

---

# PART 2 — IMPLEMENTATION RECORD

This section must be updated during implementation.

## 14. Accepted Decisions

| Decision | Final Choice | Date | Notes |
|---|---|---|---|
| Summary presentation surface | Pending |  |  |
| Summary fallback boundary | Pending |  |  |
| Default export message limit | Pending |  |  |
| Maximum export message limit | Pending |  |  |
| Maximum export character limit | Pending |  |  |
| Export formats | Pending |  |  |
| Temporary share expiry | Proposed: 1 hour |  |  |
| Expired route response | Pending |  |  |
| Persistent share review workflow | Pending |  |  |
| Share hostname | Pending / optional |  |  |
| Public renderer route | Pending |  |  |

## 15. Delivered Patches

| Patch | Scope | Files | Validation | Status |
|---|---|---|---|---|
|  |  |  |  |  |

## 16. Standalone SQL

| SQL File | Purpose | Applied | PostGraphile Restart | Result |
|---|---|---|---|---|
|  |  |  |  |  |

## 17. Implemented Routes and Contracts

### FE API routes

```text
Pending
```

### services-api routes

```text
Pending
```

### PostGraphile functions

```text
Pending
```

### Public snapshot routes

```text
Pending
```

## 18. Deviations from P1

Record every meaningful deviation rather than silently rewriting the original proposal.

| P1 Proposal | Implemented Difference | Reason | Approved |
|---|---|---|---|
|  |  |  |  |

## 19. Test Results

### Browser tests

```text
Pending
```

### Database tests

```text
Pending
```

### Safety tests

```text
Pending
```

### Header/indexing tests

```text
Pending
```

### Expiry/revocation tests

```text
Pending
```

---

SUPERSEDED 15 Aug 2026 by FE-REVIEW-01: Chassis routes and application logic remain in Crestfall; Crestfall-fe is Views, Kit, tokens, fixtures, and page composition only.

# PART 3 — FINAL LOOM FRONTEND ABSORPTION HANDOFF

This section must be completed after implementation is finished.

Its purpose is to give the GUI team an exact inventory of frontend work that must be reviewed, retained, redesigned, relocated, or absorbed into the main LOOM frontend workflow.

## 20. Final Frontend Component Inventory

| File | Layer | Created/Modified | Responsibility | GUI Team Action |
|---|---|---|---|---|
|  | View / ViewModel / Contract / Client / Route |  |  |  |

## 21. Final User-Facing Surfaces

### Summary surface

- Final component:
- Final route/placement:
- Interaction pattern:
- Loading state:
- Error state:
- Empty state:
- Accessibility considerations:
- GUI absorption notes:

### Export surface

- Final component:
- Final route/placement:
- Range selector:
- Format selector:
- Delivery behavior:
- Accessibility considerations:
- GUI absorption notes:

### Share surface

- Final component:
- Final route/placement:
- Temporary/persistent choice:
- Certification state:
- Link state:
- Revoke state:
- Accessibility considerations:
- GUI absorption notes:

### Public snapshot renderer

- Final component:
- Public route:
- Header/metadata behavior:
- Expired/revoked state:
- Mobile behavior:
- GUI absorption notes:

## 22. Final ViewModel Inventory

| ViewModel / Hook | State Owned | Actions Owned | API Dependencies | Stale-Response Handling | GUI Team Notes |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 23. Final Contracts

| Contract | Producer | Consumer | Stable Fields | GUI Team Notes |
|---|---|---|---|---|
|  |  |  |  |  |

## 24. Final Styling and Interaction Notes

Document:

- Spacing
- Icon choices
- Tooltips
- Button hierarchy
- Dialogs/drawers
- Responsive behavior
- Transcript range affordances
- Loading states
- Error states
- Success states
- Link-copy feedback
- Expiration warnings
- Certification messaging
- Public renderer typography
- Narration/dialogue formatting
- Status block rendering
- Accessibility behavior

## 25. Temporary UI That Should Not Become Permanent

| Component | Temporary Behavior | Required GUI Follow-up |
|---|---|---|
|  |  |  |

## 26. Final GUI Team Checklist

- [ ] Review every new or modified View.
- [ ] Confirm View/ViewModel separation remains LOOM-compliant.
- [ ] Absorb approved controls into the main Story Room design system.
- [ ] Preserve backend contracts while adjusting presentation.
- [ ] Preserve accessibility labels and keyboard behavior.
- [ ] Preserve duplicate-request and stale-response protection.
- [ ] Preserve transcript visibility and privacy semantics.
- [ ] Preserve temporary versus persistent share language.
- [ ] Preserve non-indexing headers and public-renderer constraints.
- [ ] Confirm mobile and narrow side-panel behavior.
- [ ] Identify and remove temporary implementation styling.
- [ ] Update Story Room GUI documentation and component map.

---

# 27. Completion Criteria

This work package is complete only when:

- `/summary` summarizes the active beat/scene rather than the whole chat.
- Summary prose does not mutate authoritative state.
- Export is separate from sharing.
- Export includes only the selected user-visible transcript.
- Temporary sharing creates an immutable one-hour unlisted snapshot.
- Persistent sharing requires Llama Guard approval.
- No shared snapshot is intentionally indexed, listed, or discoverable.
- Expiry and revocation work.
- Public pages expose no private runtime data.
- All product-data access follows the Crestfall service boundary.
- Required browser, database, safety, and header tests pass.
- Part 2 contains the actual implementation record.
- Part 3 contains the exact final LOOM frontend absorption handoff.
