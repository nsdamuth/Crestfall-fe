# Crestfall Story Transcript Summary, Export, and Share
## Implementation Record and Final LOOM Frontend Absorption Handoff

**Work package:** `CF_ST_SUMMARY_EXPORT_SHARE_WORK_PACKAGE_P1`  
**Status:** Complete and validated  
**Completion date:** 2026-08-04  
**Product area:** Story Rooms / Chronicle State / Transcript utilities  
**Architecture:** FE/View → ViewModel/client → FE API proxy → services-api → PostGraphile → DB

---

# Part 1 — Approved Scope

This work package implemented the following approved Story Room transcript capabilities:

1. Current Beat / Current Scene summary
2. Private visible-transcript export
3. Temporary unlisted transcript sharing
4. Persistent Llama-Guard-reviewed unlisted transcript sharing
5. Final presentation/media fidelity for shared snapshots

The work remained bounded to transcript summary, export, and sharing. It did not add public discovery, profile publication, community listing, search indexing, sitemap inclusion, or social-feed exposure.

All public share pages remain unlisted and carry explicit anti-indexing controls.

---

# Part 2 — Implementation Record

## 2.1 Current Beat / Current Scene Summary

The `/summary` flow was implemented as a persisted Story transcript message rather than a sidebar-only utility.

### Final behavior

- Produces a concise 2–4 paragraph recap.
- Summarizes only the current Story boundary.
- Does not continue the Story.
- Does not invent dialogue or facts.
- Does not mutate turn runtime, registries, Memory Palace, Scene state, or Beat state.
- Appears directly in the transcript as a blue System message.
- Displays a local `Preparing scene recap…` placeholder while generation is in progress.
- Is excluded from future prompt history.

### Persisted contract

```text
senderType: SYSTEM
providerRole: assistant
messageKind: STATE_SUMMARY
metadata.sceneRecap: true
metadata.memoryEligible: false
```

`STATE_SUMMARY` was selected because it conforms to the existing database message-kind constraint.

### Prompt/history isolation

Future transcript composition excludes summary messages through:

```text
messageKind === STATE_SUMMARY
or metadata.sceneRecap === true
```

### Validation status

- Summary persistence validated.
- Transcript rendering validated.
- Prompt-history exclusion validated.
- No normal turn mutation observed.

---

## 2.2 Transcript Range Foundation

A shared visible-transcript range resolver was established for summary, export, and share workflows.

### Supported presets

```text
CURRENT_BEAT
CURRENT_SCENE
RECENT_25
RECENT_50
CUSTOM
```

### Limits

```text
Maximum selected messages: 200
Maximum selected characters: 100,000
Candidate scan limit: 240
```

### Visibility behavior

The resolver excludes:

- hidden transcript messages;
- private/internal-only messages;
- ordinary System messages not intended for export/share;
- messages outside the selected boundary.

For share snapshots, approved SFW automatic event-media messages may be included through the explicit `includeMediaMessages` path.

---

## 2.3 Private Transcript Export

Private transcript export was added to Chronicle State.

### Formats

```text
TXT
Markdown
```

### Behavior

- Uses the shared visible-transcript range resolver.
- Exports only messages visible to the owner in the selected range.
- Does not create a public URL.
- Does not change Story state.
- Does not require a database migration.
- Preserves speaker ordering and readable paragraph spacing.

### Interface

The export dialog uses an opaque black modal treatment with a dark overlay to prevent background text from visually bleeding through.

### Validation status

- TXT export validated.
- Markdown export validated.
- Range selection validated.
- Modal readability validated.

---

## 2.4 Temporary Unlisted Share

Temporary sharing creates a frozen, immutable, unlisted transcript snapshot.

### Link behavior

```text
Duration: one hour
Access: anyone with the opaque URL
Authentication: not required
Discoverability: none
Owner revocation: supported
```

### Security and indexing controls

The public route applies:

```text
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
Cache-Control: private, no-store, max-age=0, must-revalidate
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
```

### Token handling

- A cryptographically random opaque token is generated.
- Only the SHA-256 token hash is stored in the database.
- The raw token is returned only to the creating client.

### Immutable snapshot behavior

The public route reads only the stored snapshot. It does not query the live Story transcript.

Regenerate, Continue, or later Story turns therefore do not alter an existing share.

### Stored safety provenance gate

Normal transcript messages qualify only when they have recognized stored SFW safety provenance:

```text
SAFETY_ENFORCE_INBOUND_CLASSIFIED
PHASE_1_PROVIDER_RESPONSE_SANITIZED
AUTO_EVENT_MEDIA_LIBRARY_SELECTION
```

Trusted scenario opening messages qualify only when all required opening-scene provenance is present:

```text
messageKind = OPENING_SCENE
providerRole = assistant
metadata.source = scenario.opening_messages
senderType = CHARACTER or NARRATOR
metadata.resolvedSpeakerType matches senderType
metadata.sourceCreationId exists
metadata.sourceParticipantId exists
redactionStatus = NONE
```

This preserves strict handling of arbitrary legacy messages while allowing established Crestfall scenario openings.

### Validation status

- Creation validated.
- Incognito access validated.
- One-hour expiry contract validated.
- Frozen snapshot behavior validated.
- Revocation validated.
- Safety-provenance enforcement validated.

---

## 2.5 Shared Snapshot Presentation and Media Fidelity

The public share renderer was upgraded from plain text to a render-safe transcript snapshot.

### Preserved presentation

- Character and Narrator messages aligned left.
- Player messages aligned right.
- System messages retain distinct blue treatment.
- Semantic narration and dialogue segments are preserved.
- Emphasis, strong, whisper, and legacy inline markup are rendered.
- Status blocks remain visually separated.
- Character palette families are resolved to safe snapshot colors.
- Paragraph spacing and quoted-block presentation are preserved.

### Preserved media

- Approved SFW automatic event images are included.
- Existing before/after triggering-message order is preserved.
- Image URL, thumbnail URL, dimensions, alt text, and location captions are snapshotted.
- Opening hero images are included when present and SFW.
- Images are rendered from the frozen snapshot, not the live Story.

### Snapshot version

```text
chat_transcript_snapshot_v2
```

### Validation status

- Formatting validated.
- Palette/color treatment validated.
- Player/NPC alignment validated.
- Automatic event-media rendering validated.
- Opening hero rendering validated.
- Frozen media behavior validated.

---

## 2.6 Persistent Reviewed Unlisted Share

Persistent sharing adds a durable unlisted URL that is activated only after Llama Guard approval.

### Lifecycle

```text
PENDING_REVIEW
→ ACTIVE
→ REVOKED
```

Failure outcomes:

```text
REJECTED
FAILED
```

### Share mode

```text
PERSISTENT_REVIEWED
```

### Review behavior

1. The immutable snapshot is created first.
2. The exact frozen transcript publication text is sent to Llama Guard.
3. The database record remains `PENDING_REVIEW`.
4. `ALLOW` activates the link.
5. A blocking classification produces `REJECTED`.
6. Review/provider failure produces `FAILED`.
7. The raw token is returned only when the share becomes `ACTIVE`.

### Review metadata

The share record stores:

- review provider;
- review model;
- review decision;
- raw/mapped categories;
- computed severity;
- provider timing details;
- review start/completion timestamps;
- failure code and message when applicable.

### Validated production result

The validated test returned:

```text
share_mode: PERSISTENT_REVIEWED
status: ACTIVE
review_provider: llama_guard
review_model: meta-llama/Llama-Guard-3-8B
review_decision: ALLOW
expires_at: null
```

### Public behavior

- Persistent links do not expire.
- They remain available until revoked.
- They use the same frozen P4D snapshot renderer.
- They remain unlisted and non-indexable.
- Pending, rejected, failed, and revoked snapshots cannot be rendered.

### Current execution model

The Llama Guard review currently runs synchronously during the creation request.

The database still records the full lifecycle:

```text
PENDING_REVIEW → ACTIVE / REJECTED / FAILED
```

Moving persistent review to a dedicated asynchronous worker remains a future scalability option, not part of this completed package.

### Validation status

- PostGraphile function exposure validated.
- Llama Guard invocation validated.
- `ALLOW → ACTIVE` transition validated.
- Persistent no-expiry behavior validated.
- Public rendering validated.
- Owner revocation path implemented.
- Review details persisted.

---

# Part 3 — Persistence and PostGraphile Record

## Tables

```text
public.chat_transcript_snapshots
public.chat_transcript_shares
```

## Share modes

```text
TEMPORARY
PERSISTENT_REVIEWED
```

## Share statuses

```text
PENDING_REVIEW
ACTIVE
REJECTED
FAILED
REVOKED
```

## PostGraphile functions

Temporary:

```text
create_temporary_chat_transcript_share_as_actor
get_temporary_chat_transcript_share_by_token_hash
revoke_temporary_chat_transcript_share_as_actor
```

Persistent:

```text
create_persistent_chat_transcript_share_as_actor
complete_persistent_chat_transcript_share_review_as_actor
revoke_persistent_chat_transcript_share_as_actor
```

All persistent function payloads were confirmed through GraphQL introspection and expose `result`.

---

# Part 4 — Final User-Facing Interface

The Chronicle State share dialog now supports:

```text
Temporary one-hour link
Persistent reviewed link
```

The primary action label is intentionally neutral:

```text
Create link
```

Pending labels remain mode-specific:

```text
Creating...
Reviewing...
```

The dialog communicates duration/review behavior in the selected mode description rather than repeating it in the button.

---

# Part 5 — Final LOOM Frontend Absorption Handoff

## 5.1 LOOM Boundary

The feature is functionally complete. The remaining LOOM work is presentation absorption and package normalization only.

No product behavior, safety policy, persistence lifecycle, API contract, or public-route behavior should be redesigned during absorption.

### Authority boundaries

**Portable View owns:**

- dialog composition;
- labels and descriptions;
- selector presentation;
- pending/error/result presentation;
- button layout;
- responsive/mobile presentation;
- public shared-page visual presentation.

**ViewModel owns:**

- active share mode;
- selected transcript range;
- custom-range message identifiers;
- pending state;
- error state;
- share result state;
- create/revoke action selection;
- temporary vs persistent action dispatch;
- derived labels/status state.

**Client/API/service layers own:**

- authenticated requests;
- opaque token generation;
- transcript range resolution;
- safety provenance;
- Llama Guard execution;
- snapshot construction;
- persistence;
- public lookup;
- revocation.

The portable View must not inspect raw DB records, call APIs, run safety checks, construct tokens, or infer lifecycle policy.

---

## 5.2 Existing FE Composition

Primary Story Room integration flows through:

```text
useStoryRoomChat
→ useStoryRoomChatShellViewModel
→ useStoryRoomStatePanelViewModel
→ StoryRoomStatePanel.view.jsx
```

Client calls flow through:

```text
lib/client/studio/story-rooms/storyRoomClient.js
→ app/api/studio/story-rooms/[id]/...
→ services-api
→ PostGraphile
```

Public share rendering remains at:

```text
app/share/chat/[token]/route.js
```

---

## 5.3 Recommended LOOM Absorption Target

Absorb the share/export/summary controls into the existing Chronicle State portable package rather than creating a parallel feature package.

Suggested conceptual grouping inside the State Panel package:

```text
StoryRoomStatePanel.view.jsx
useStoryRoomStatePanelViewModel.js
StoryRoomStatePanel.contract.js
StoryRoomStatePanel.fixtures.js
share/export diagnostics
README.md
```

Do not create a second independent modal system unless the GUI team explicitly determines that a shared modal primitive already exists and can be adopted without changing behavior.

---

## 5.4 Contract Fields to Preserve

The portable State Panel View should receive display-ready share dialog state shaped approximately as:

```js
{
  open,
  mode,
  preset,
  startMessageId,
  endMessageId,
  pending,
  error,
  result,
  rangeOptions,
  modeOptions,
  canCreate,
  canRevoke,
  onModeChange,
  onPresetChange,
  onStartMessageIdChange,
  onEndMessageIdChange,
  onCreate,
  onRevoke,
  onClose
}
```

The View should not need to know:

- endpoint paths;
- room IDs;
- share token hashing;
- Llama Guard model names;
- PostGraphile function names;
- database statuses beyond display-ready result state;
- transcript filtering rules;
- safety-provenance rules.

---

## 5.5 Visual Semantics to Preserve

### Temporary share

- Eyebrow: `Temporary Unlisted Link`
- Description states that the link lasts one hour.
- Result states expiration.
- Neutral action: `Create link`
- Pending action: `Creating...`

### Persistent share

- Eyebrow: `Persistent Reviewed Link`
- Description states that Llama Guard review occurs before activation.
- Result states `Persistent until revoked`.
- Neutral action: `Create link`
- Pending action: `Reviewing...`

### Result states

```text
ACTIVE
REVOKED
REJECTED
FAILED
```

Display copy should remain user-facing and avoid exposing internal provider payloads or category codes.

---

## 5.6 Public Share Page Absorption

The current public route is a server-rendered HTML implementation with completed behavior and styling.

A future GUI/LOOM absorption may move the presentation into a portable renderer, but it must preserve:

- snapshot-only reads;
- unauthenticated access;
- noindex headers;
- no-store caching;
- no-referrer behavior;
- message alignment;
- palette colors;
- semantic formatting;
- automatic event-media order;
- hero image rendering;
- temporary expiration copy;
- persistent reviewed copy;
- revoked/rejected/failed unavailability.

The GUI team must not replace the immutable snapshot with live transcript reads.

---

## 5.7 LOOM Diagnostics Required

Add or preserve focused diagnostics for:

1. State Panel View renders both share modes from contract-shaped state.
2. View does not import client/API/service modules.
3. ViewModel selects temporary or persistent create action.
4. ViewModel selects matching revoke action.
5. Persistent pending label renders as `Reviewing...`.
6. Temporary pending label renders as `Creating...`.
7. Primary action label remains `Create link`.
8. Active persistent result renders `Persistent until revoked`.
9. Rejected and failed results never render a public URL.
10. Custom range controls appear only for `CUSTOM`.
11. Share modal remains opaque and readable.
12. Public snapshot renderer preserves media and semantic presentation.

---

## 5.8 Manual Browser Regression After LOOM Absorption

### Route

```text
/studio/story-rooms/[room-id]
```

### Summary

1. Open Chronicle State.
2. Trigger current Beat or Scene summary.
3. Confirm `Preparing scene recap…`.
4. Confirm blue System recap appears.
5. Send another Story turn.
6. Confirm the recap does not act as normal prompt history.

### Export

1. Open transcript export.
2. Select Recent 25, Recent 50, and Custom.
3. Export TXT and Markdown.
4. Confirm only visible selected messages appear.
5. Confirm no public link is created.

### Temporary share

1. Select `Temporary one-hour link`.
2. Select a range.
3. Create link.
4. Open incognito.
5. Confirm formatting and images.
6. Confirm `Expires` is displayed.
7. Revoke.
8. Confirm the URL becomes unavailable.

### Persistent reviewed share

1. Select `Persistent reviewed link`.
2. Create link.
3. Confirm `Reviewing...`.
4. Confirm URL appears only after approval.
5. Open incognito.
6. Confirm `Persistent until revoked`.
7. Add another Story turn.
8. Confirm snapshot remains unchanged.
9. Revoke.
10. Confirm the URL becomes unavailable.

### Public headers

For both temporary and persistent links:

```bash
curl -I FULL_SHARE_URL
```

Expected:

```text
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
Cache-Control: private, no-store, max-age=0, must-revalidate
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
```

---

# Part 6 — Non-Goals and Frozen Decisions

The following are explicitly outside this completed package:

- discoverable/public Story listings;
- community feed publication;
- profile publication;
- search-engine indexing;
- sitemap inclusion;
- likes, comments, or engagement on shared snapshots;
- collaborative editing of shared snapshots;
- live-updating shared transcripts;
- changing an existing snapshot after creation;
- replacing Llama Guard with another review provider;
- background-worker conversion;
- analytics or view counters;
- custom vanity share URLs;
- share-password support.

These may be proposed as separate work packages only.

---

# Part 7 — Completion Statement

The Story transcript Summary, Export, Temporary Share, Persistent Reviewed Share, and Share Presentation Fidelity work package is complete.

The implementation now provides:

- in-transcript current-boundary summaries;
- private TXT and Markdown exports;
- immutable one-hour unlisted links;
- immutable persistent Llama-Guard-reviewed unlisted links;
- owner revocation;
- strict anti-indexing behavior;
- preserved Story transcript formatting, colors, hero images, and automatic event media;
- strict FE → API → services-api → PostGraphile → DB boundaries.

The feature is ready for final LOOM frontend absorption without further product or architecture redesign.
