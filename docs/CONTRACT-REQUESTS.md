# Contract requests

Standing backlog for work the design side cannot do without backend, state,
or ViewModel functionality that does not exist yet. Each entry logs the
feature blocked, the missing functionality Nick would need to build or
expose, and the design intent once it exists. Design never builds the fix
itself here; it stubs the UI honestly or pauses the affected component and
logs the gap below.

Scope note: a contract file created by a branch, inside a package nothing
outside it consumes, is presentation and stays editable under the normal
rules. This backlog is for shared contracts, anything Nick owns, and
anything genuinely blocked on backend work.

## Open requests

### CR-001, movement_style missing from creator form schema

Feature blocked: the heart stop's behavior field reads and writes
`movement_style` (`components/studio/create/character/BehaviorStep.jsx`),
but `movement_style` is not a key in the creator form's initial field set
(`components/studio/create/character/constants/form.js`, 53 keys).

Missing functionality: `constants/form.js`'s `initialForm` needs a 54th key,
`movement_style`, with a default value and a signed contract entry
describing its shape and versioned name.

Design intent once it exists: the field continues to render exactly where
it does today; no new UI is required, only the schema catching up to what
is already wired.

### CR-002, rendering_style missing from creator form schema

Feature blocked: the seal stop and the review step read `rendering_style`
(`review-step/useCharacterReviewStepViewModel.js`,
`review-step/CharacterReviewStep.fixtures.js`), but `rendering_style` is
not a key in `constants/form.js`'s initial field set either.

Missing functionality: whether to add `rendering_style` as a 55th field is
a schema decision Nick and Brian need to rule on together; not decided here.

Design intent once it exists: same as CR-001, the field renders where the
review step already expects it once the schema carries the key.

### CR-003, no way to move a saved character into a story

Feature blocked: the final stop of every creator (creator-stops' payoff
stop, and any other creator that reaches a saved end state) has no path
from a finished, saved character into a story. "Continue into a story" on
the payoff stop opens a secondary panel that says this is coming soon; it
does not pick, create, or resume a story.

Missing functionality: Nick would need to expose a way to attach a saved
character (or other playable asset) to a story, an endpoint or state shape
that records which story a character is in, and a way to resume that
placement from a different device than the one the character was made on.

Design intent once it exists: every creator that produces a playable asset
type ends with a path into building or continuing a story with what it
just made, resumable across devices. Non-playable asset types, such as
clothing, may not need this path and are not assumed to get one
automatically. Story selection itself needs its own design once the
underlying data model exists; this request is the gate on that design
starting, not a spec for the picker.
