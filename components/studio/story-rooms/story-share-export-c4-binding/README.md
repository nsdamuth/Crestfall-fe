# Story Export / Share → C4 binding semantics

Status: pure presentation-binding contract and realistic fixtures only.

This package reconciles the current Crestfall Story Room export/share behavior
with the FE lane's existing **C4 Chat Session Dialogs** package.

It does **not** modify the C4 package.

## Target presentation authority

The FE lane already owns:

```text
components/studio/chat/chat-session-dialogs/**
```

That package defines the designed C4 dialog contract for:

- Export
- Share
- Report
- Delete Story
- summary-pending state

This binding imports C4's public constants so it cannot silently invent a second
set of range presets, export formats, share modes, or dialog kind names.

## Current Crestfall defaults carried forward

```text
Export preset: RECENT_50
Export format: TXT
Share preset: RECENT_50
Share mode: TEMPORARY
```

Range presets:

```text
CURRENT_BEAT
CURRENT_SCENE
RECENT_25
RECENT_50
CUSTOM
```

Export formats:

```text
TXT
MARKDOWN
```

Share modes:

```text
TEMPORARY
PERSISTENT_REVIEWED
```

## Custom range boundary options

Current Crestfall behavior derives custom start/end options from visible
transcript messages:

- empty bodies are omitted;
- system messages are omitted;
- labels are numbered in visible order;
- speaker defaults to `Story`;
- body whitespace is collapsed;
- preview text is truncated after 72 characters.

On dialog open, the first and last visible messages are the natural default
custom boundaries.

For `CUSTOM`, both boundaries are required. The current validation message is:

```text
Choose both a start message and an end message.
```

For non-custom presets, start/end IDs are sent as `null`.

## Share result normalization

The two backend workflows do not return identical raw shapes.

### Temporary

Current backend result:

```text
chat_temporary_share_result_v1
```

includes:

- share ID
- token
- status
- expiresAt
- message count

It does not need to be treated as the presentation authority for `shareMode`.
This binding fills the C4 presentation result from the requested mode:

```text
TEMPORARY
```

### Persistent reviewed

Current backend result:

```text
chat_persistent_share_result_v1
```

carries:

```text
ACTIVE
REJECTED
FAILED
```

plus `PERSISTENT_REVIEWED` and the Llama Guard review result.

C4 receives only the display result state. Review execution and details remain
Chassis/backend authority.

### Revoked

When a link is revoked, C4 receives:

```text
status: REVOKED
shareUrl: ""
expiresAt: ""
```

The old direct Revoke action is not copied. C4's ruled destructive-law flow uses
`revokeConfirmOpen` plus request / confirm / cancel callbacks.

## Share URL and clipboard

This package deliberately does **not** construct:

```text
/share/chat/<token>
```

and does not call the clipboard.

The Chassis application layer owns public-origin/routing knowledge and clipboard
or platform side effects. It supplies a display-ready `shareUrl` and semantic
callbacks.

## Export download

This package does not create Blobs or browser download links.

Crestfall continues to own:

- transcript range resolution
- visibility filtering
- export generation
- filename/mime/content
- Blob/object URL creation
- browser download side effect

The FE package emits only export intent.

## Temporary vs persistent safety

Crestfall/backend remains authoritative for:

- temporary-share stored safety provenance
- SFW qualification
- persistent Llama Guard review
- token generation
- one-hour temporary expiry
- share persistence
- revoke persistence
- public snapshot serving

None of those rules move into FE.

## Protected scopes untouched

This patch does not modify:

- `components/studio/chat/**`
- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
