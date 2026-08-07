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

### CR-004, signed-in Supabase user has no row in the backend's users table

Status: OPEN, with Nick.

Feature blocked: saving a character from the creator. The frontend correctly
authenticates and posts to `/v1/studio/creations` with a real user id, but
the write fails: Postgres rejects the insert with
`insert or update on table "creations" violates foreign key constraint
"creations_owner_id_fkey"`, `Key (owner_id)=(<the signed-in user's id>) is
not present in table "users"`. This is not a creator bug; every write for
this signed-in account will fail the same way until this account has a row
in services-api's `users` table.

Missing functionality: whichever step is supposed to create a `public.users`
row when a person signs in through Supabase auth (a trigger, a
provisioning endpoint, a backfill) did not run for this account, or does
not exist yet. Nick needs to confirm the intended provisioning path and
either run it for existing accounts or fix why it did not fire.

Design intent once it exists: no design change, this is pure plumbing. The
creator's save path is already correct and needs nothing further once
accounts are provisioned.

### CR-005, services-api can report success on a failed write

Status: OPEN, with Nick.

Feature blocked: none directly, but this masked the CR-004 failure as a
silent no-op instead of a visible error, and would do the same for any
other write that hits a masked GraphQL error. In
`services/api/src/clients/postgraphileClient.js`, `postgraphileRequest`
sets `error.status = response.status` whenever the GraphQL response
contains an `errors` entry, even though GraphQL servers return transport
status 200 for application-level errors. `creationsRoute.js`'s
`failFromError` then uses that status verbatim
(`Number.isInteger(error?.status) ? error.status : 500`), so a real write
failure is answered with HTTP 200 and an error body. The frontend's
`/api/creations` route now guards against this (see this branch's commit),
but the transport status leaving services-api is still wrong for every
caller, not just this one.

Missing functionality: `postgraphileRequest` needs to treat a GraphQL
`errors` entry as a failure status (for example 500, or a mapped status
from the GraphQL error's extensions) rather than trusting the outer HTTP
status when the body contains an error.

Design intent once it exists: no design change, this is a transport
correctness fix so "the request answered 200" reliably means "the write
succeeded" everywhere in the app, not just where the frontend has learned
to double-check.

## Ruled

### CR-006, seal stop's age field is empty, not pre-filled

Status: RULED, not yet implemented.

Feature blocked: none, the field works and does not cause the save failure
investigated for CR-004, confirmed by reading the actual Postgres error,
which was solely the owner_id foreign key. But the seal stop's age input
(`seal-stop/SealStop.view.jsx`) shows "18+" only as placeholder ghost
text; `formState.age` defaults to `""` and stays empty until the user
types, even though every Crestfall character is an adult.

Ruling: the age field pre-fills 18 by default. Every Crestfall character is
an adult and the field is required, so a real value belongs there instead
of ghost text a user could mistake for an entered value. Not yet
implemented; `CharacterCreatorModal.jsx`'s `INITIAL_FORM_STATE.age` still
defaults to `""` as of this entry.
