# Crestfall Story Transcript FE Absorption Target List
## Supplemental LOOM Migration Handoff

**Supplement to:** `CF_ST_SUMMARY_EXPORT_SHARE_IMPLEMENTATION_AND_LOOM_HANDOFF_V1.md`  
**Repository layout assumed:**

```text
/Crestfall
/Crestfall-fe
```

**Purpose:**  
Provide the frontend/LOOM migration developer with an explicit list of Views, ViewModels, hooks, client modules, FE API routes, and public-rendering surfaces that must be inspected and reconciled when moving the completed Story transcript Summary, Export, Temporary Share, Persistent Reviewed Share, and Share Presentation Fidelity work into `/Crestfall-fe`.

---

# 1. Migration Principle

The AI developer should not treat this as a broad frontend rewrite.

The correct migration strategy is:

```text
inspect source in /Crestfall
→ inspect existing destination in /Crestfall-fe
→ reconcile only missing behavior
→ preserve LOOM boundaries
→ validate each surface
```

The developer should avoid:

- replacing working destination files blindly;
- moving backend/service authority into the FE repository;
- duplicating existing portable Views;
- changing API contracts;
- changing share lifecycles;
- changing safety policy;
- replacing immutable snapshot reads with live transcript reads;
- inventing new directories unless required by the existing FE structure.

---

# 2. Primary View Targets

## 2.1 Chronicle State Panel

### Source

```text
/Crestfall/components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx
```

### Feature responsibilities currently rendered here

- Summary controls
- Transcript export dialog
- Share Snapshot dialog
- Temporary versus persistent share mode selector
- Transcript range selector
- Custom-range fields
- Pending states
- Error states
- Active result state
- Revoked result state
- Rejected result state
- Failed result state
- Copy-link control
- Revoke control

### Supporting portable-package files to compare

```text
StoryRoomStatePanel.contract.js
StoryRoomStatePanel.fixtures.js
README.md
diagnostics files
```

### Important visual behavior to preserve

Temporary mode:

```text
Temporary Unlisted Link
Create link
Creating...
```

Persistent mode:

```text
Persistent Reviewed Link
Create link
Reviewing...
Persistent until revoked
```

The mode selector already explains the duration/review behavior. The primary button should remain neutral:

```text
Create link
```

---

## 2.2 Story Room Message Renderer

### Source

```text
/Crestfall/components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx
```

### Presentation behavior represented by this View

- Player message treatment
- Character message treatment
- Narrator message treatment
- System message treatment
- Semantic dialogue and narration
- Inline emphasis
- Strong emphasis
- Whisper treatment
- Status-block presentation
- Character palette colors
- Automatic event-media presentation

### Supporting files

```text
useStoryRoomMessageViewModel.js
StoryRoomMessage.contract.js
StoryRoomMessage.fixtures.js
README.md
autoEventMediaMessageDiagnostics.mjs
```

### Migration note

The developer should compare the existing `/Crestfall-fe` ViewModel before moving anything.

Do not copy the ViewModel blindly if the destination already contains the LOOM-compliant contract. Reconcile only the missing presentation fields or media behavior.

---

## 2.3 Story Room Transcript Renderer

### Source

```text
/Crestfall/components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx
```

### Presentation responsibilities

- Transcript row composition
- Opening hero image
- Visible-message presentation
- Load Earlier presentation
- Message-ordering surface
- Automatic event-media placement

### Supporting files

```text
useStoryRoomTranscriptViewModel.js
StoryRoomTranscript.contract.js
storyRoomTranscriptOrdering.js
README.md
autoEventMediaTranscriptOrderingDiagnostics.mjs
storyOpeningHeroImageDiagnostics.mjs
```

### Important ordering behavior

Automatic event media must preserve:

```text
BEFORE_TRIGGERING_MESSAGE
AFTER_TRIGGERING_MESSAGE
```

The migration must not flatten media into a generic unordered attachment list.

---

## 2.4 Story Room Chat Shell View

### Source package

```text
/Crestfall/components/studio/story-rooms/story-room-chat-shell/
```

### Likely primary View

```text
StoryRoomChatShell.view.jsx
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-chat-shell/
```

### Responsibility

The shell should compose:

- transcript;
- composer;
- Chronicle State panel;
- cast/media panels;
- mobile surfaces.

It should not own:

- share-token creation;
- API calls;
- transcript filtering;
- Llama Guard review;
- database status transitions.

---

# 3. ViewModel and Binding Targets

## 3.1 State Panel ViewModel

### Source

```text
/Crestfall/components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js
```

### Responsibilities to preserve

```text
shareMode
sharePreset
shareStartMessageId
shareEndMessageId
sharePending
shareError
shareResult
```

### Behavioral responsibilities

- Select temporary or persistent create action.
- Select matching revoke action.
- Derive pending labels.
- Derive active/rejected/failed/revoked presentation state.
- Prevent duplicate create/revoke actions while pending.
- Prepare display-ready dialog state for the View.

### Approximate display-ready contract

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

The View should not need to know endpoint paths, room IDs, token hashing, Llama Guard model names, or PostGraphile function names.

---

## 3.2 Story Room Chat Hook

### Source

```text
/Crestfall/components/studio/story-rooms/hooks/useStoryRoomChat.js
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/hooks/useStoryRoomChat.js
```

### Actions to preserve or reconcile

```text
summarizeCurrentBoundary
createTranscriptExport
createTemporaryShare
revokeTemporaryShare
createPersistentShare
revokePersistentShare
```

### Boundary

The hook may orchestrate client calls and local state.

It must not:

- call PostGraphile directly;
- call Supabase for product data;
- construct share-token hashes;
- run Llama Guard;
- implement transcript-range filtering.

---

## 3.3 Chat Shell ViewModel

### Source

```text
/Crestfall/components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js
```

### Expected destination

```text
/Crestfall-fe/components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js
```

### Responsibility

Pass the relevant prepared actions and display state into the State Panel package.

Preserve explicit bindings for:

```text
onCreateTemporaryShare
onRevokeTemporaryShare
onCreatePersistentShare
onRevokePersistentShare
```

The shell ViewModel should remain a small, explicit binding layer.

---

# 4. FE Client Target

## 4.1 Story Room Client

### Source

```text
/Crestfall/lib/client/studio/story-rooms/storyRoomClient.js
```

### Expected destination

```text
/Crestfall-fe/lib/client/studio/story-rooms/storyRoomClient.js
```

### Methods to preserve or reconcile

```text
summarizeStoryRoomCurrentBoundary
createVisibleStoryRoomTranscriptExport
createTemporaryStoryRoomShare
revokeTemporaryStoryRoomShare
createPersistentStoryRoomShare
revokePersistentStoryRoomShare
```

### Boundary

This module should remain the FE client layer.

It should call the FE API proxy routes and should not own business logic.

---

# 5. FE API Proxy Targets

These routes belong in `/Crestfall-fe` when that repository owns the Next.js application and FE API proxy layer.

## 5.1 Summary

### Source

```text
/Crestfall/app/api/studio/story-rooms/[id]/summary/route.js
```

### Expected destination

```text
/Crestfall-fe/app/api/studio/story-rooms/[id]/summary/route.js
```

---

## 5.2 Transcript Export

### Source

```text
/Crestfall/app/api/studio/story-rooms/[id]/transcript-export/route.js
```

### Expected destination

```text
/Crestfall-fe/app/api/studio/story-rooms/[id]/transcript-export/route.js
```

---

## 5.3 Temporary Share

### Source

```text
/Crestfall/app/api/studio/story-rooms/[id]/temporary-share/route.js
/Crestfall/app/api/studio/story-rooms/[id]/temporary-share/[shareId]/route.js
```

### Expected destination

```text
/Crestfall-fe/app/api/studio/story-rooms/[id]/temporary-share/route.js
/Crestfall-fe/app/api/studio/story-rooms/[id]/temporary-share/[shareId]/route.js
```

---

## 5.4 Persistent Reviewed Share

### Source

```text
/Crestfall/app/api/studio/story-rooms/[id]/persistent-share/route.js
/Crestfall/app/api/studio/story-rooms/[id]/persistent-share/[shareId]/route.js
```

### Expected destination

```text
/Crestfall-fe/app/api/studio/story-rooms/[id]/persistent-share/route.js
/Crestfall-fe/app/api/studio/story-rooms/[id]/persistent-share/[shareId]/route.js
```

### Proxy-route requirement

These routes should remain thin:

```text
authenticate
→ forward request to services-api
→ normalize response/error
```

They should not own transcript filtering, safety review, snapshot construction, token creation, or persistence.

---

# 6. Public Shared-Page Target

## 6.1 Public Transcript Share Renderer

### Source

```text
/Crestfall/app/share/chat/[token]/route.js
```

### Expected destination

```text
/Crestfall-fe/app/share/chat/[token]/route.js
```

### Current implementation

The route currently returns server-rendered HTML rather than composing a normal JSX portable View.

### Acceptable migration paths

#### Option A — Move intact first

Move the route without redesign so the public behavior remains stable.

#### Option B — Extract presentation into a portable View

The route may retain:

- token lookup;
- unavailable-state resolution;
- headers;
- response construction.

A portable View may own:

- page composition;
- transcript card rendering;
- hero image;
- media rendering;
- temporary/persistent copy.

### Required behavior to preserve

```text
snapshot-only rendering
unauthenticated access
noindex headers
no-store caching
no-referrer behavior
temporary expiry copy
persistent reviewed copy
player-right alignment
character/narrator-left alignment
system treatment
semantic formatting
palette colors
automatic event images
opening hero image
revoked/rejected/failed unavailability
```

### Critical prohibition

Do not replace the frozen snapshot read with a live Story transcript request.

---

# 7. Files That Must Remain in `/Crestfall`

These files are backend/service authority and should not be moved into `/Crestfall-fe`.

```text
/Crestfall/services/api/src/services/chat/resolveVisibleChatTranscriptRange.js
/Crestfall/services/api/src/services/chat/createVisibleChatTranscriptExport.js
/Crestfall/services/api/src/services/chat/summarizeCurrentStoryBoundary.js
/Crestfall/services/api/src/services/chat/createTemporaryChatTranscriptShare.js
/Crestfall/services/api/src/services/chat/createPersistentChatTranscriptShare.js
/Crestfall/services/api/src/services/chat/chatRepository.js
/Crestfall/services/api/src/routes/chatRoute.js
/Crestfall/services/api/src/services/safety/**
/Crestfall/services/api/src/server.js
```

The following also remain backend-owned:

- SQL migrations;
- PostGraphile functions;
- snapshot persistence;
- share lifecycle transitions;
- opaque token hashing;
- Llama Guard execution;
- safety-provenance enforcement;
- public token lookup.

---

# 8. Recommended AI Execution Order

```text
1. Compare StoryRoomStatePanel portable package
2. Compare StoryRoomMessage portable package
3. Compare StoryRoomTranscript portable package
4. Reconcile StoryRoomChatShell composition
5. Reconcile State Panel ViewModel
6. Reconcile useStoryRoomChat
7. Reconcile StoryRoomChatShell ViewModel
8. Move/reconcile storyRoomClient
9. Move FE API proxy routes
10. Move or extract public share renderer
11. Run focused diagnostics
12. Run exact browser regression tests
```

---

# 9. Priority Target Summary

## Highest-priority View

```text
story-room-state-panel/StoryRoomStatePanel.view.jsx
```

## Transcript-fidelity Views

```text
story-room-message/StoryRoomMessage.view.jsx
story-room-transcript/StoryRoomTranscript.view.jsx
```

## Required ViewModels and bindings

```text
story-room-state-panel/useStoryRoomStatePanelViewModel.js
story-room-chat-shell/useStoryRoomChatShellViewModel.js
hooks/useStoryRoomChat.js
```

## Required FE client and API proxy

```text
lib/client/studio/story-rooms/storyRoomClient.js
app/api/studio/story-rooms/[id]/summary/route.js
app/api/studio/story-rooms/[id]/transcript-export/route.js
app/api/studio/story-rooms/[id]/temporary-share/**
app/api/studio/story-rooms/[id]/persistent-share/**
```

## Public page

```text
app/share/chat/[token]/route.js
```

---

# 10. Focused Diagnostics Required After Absorption

1. State Panel View renders both share modes from contract-shaped state.
2. View does not import client/API/service modules.
3. ViewModel selects temporary or persistent create action correctly.
4. ViewModel selects matching revoke action correctly.
5. Persistent pending label renders as `Reviewing...`.
6. Temporary pending label renders as `Creating...`.
7. Primary action remains `Create link`.
8. Active persistent result renders `Persistent until revoked`.
9. Rejected and failed states do not render a public URL.
10. Custom range controls appear only for `CUSTOM`.
11. Modal remains opaque and readable.
12. Message View preserves semantic presentation.
13. Transcript View preserves media ordering.
14. Opening hero image still renders.
15. Public share route keeps anti-indexing headers.

---

# 11. Manual Browser Regression

## Story Room route

```text
/studio/story-rooms/[room-id]
```

### Summary

- Trigger current Beat or Scene summary.
- Confirm `Preparing scene recap…`.
- Confirm blue System summary appears.
- Confirm later turns do not treat it as normal prompt history.

### Export

- Test Recent 25.
- Test Recent 50.
- Test Custom.
- Export TXT.
- Export Markdown.
- Confirm no public URL is created.

### Temporary share

- Select `Temporary one-hour link`.
- Create link.
- Open incognito.
- Confirm images, formatting, and colors.
- Confirm expiration copy.
- Revoke.
- Confirm URL becomes unavailable.

### Persistent share

- Select `Persistent reviewed link`.
- Create link.
- Confirm `Reviewing...`.
- Confirm URL appears only after approval.
- Open incognito.
- Confirm `Persistent until revoked`.
- Add another Story turn.
- Confirm snapshot remains frozen.
- Revoke.
- Confirm URL becomes unavailable.

### Public headers

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

# 12. Completion Criterion

The frontend absorption is complete when:

- all listed Views and binding layers are reconciled into `/Crestfall-fe`;
- no backend authority has been moved into the FE repository;
- existing LOOM package boundaries remain intact;
- public share rendering remains snapshot-only;
- temporary and persistent share flows pass browser regression;
- focused diagnostics pass;
- no API or persistence contract has changed.

---

# Design side status, 4 Aug 2026

Rulings recorded here, design side only. Nothing above this section is
changed by these rulings.

- Absorption runs as its own sprint, following Nick's execution order
  in section 8 above.
- Behavior, contracts, share lifecycles, safety provenance, and
  snapshot-only public reads are frozen. Presentation only is ours.
- Public share page takes Option A from section 6.1: move intact
  first, extract to a portable View later as a separate pass.
- The recap is absorbed as built, an in-transcript System message.
- System messages take the house System treatment, not blue. The
  design system has no info color by ruling.
