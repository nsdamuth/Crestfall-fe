# Story Room Auto-Event Media ↔ Transcript binding

Status: **WIRED**.

W16 closes the authoritative auto-event media → Story transcript seam.

The transcript ViewModel now consumes
`story_room_auto_event_media_transcript_binding_v1` as the single FE authority
for event-media detection, Character vs Location media projection,
trigger-relative ordering, unbound-media retention, and opening-hero projection.

Ordinary text messages continue through the existing
`getStoryRoomMessageViewProps` path unchanged.

The portable Story Room Message contract advances `1.1.0 -> 1.2.0` with only
the media semantics required here: `MEDIA`, `AUTO_EVENT_MEDIA`, Character/Location
event-image subtypes, and the display-ready media object.

Location event images default before their triggering message; Character event
images default after it. Explicit authored `presentationOrder` still wins.

The transcript also renders the authoritative opening hero at the true beginning
of the loaded transcript.

Chassis/services remain authoritative for trigger detection, image generation,
persisted media-message creation, visibility, display URL, triggering-message
identity, and opening-hero source metadata.

W16 deliberately does not absorb unrelated transcript/message features such as
copy, regenerate, continue, report, or summary-pending UI.
