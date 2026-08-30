# DECISION: feedback intake is a self-scoring Sheet, reviewed async

Date: 30 Aug 2026. Gate: other (tooling and process ruling).
Decider: Brian. Status: RULED.

## Provenance note, read this first

This file did not exist when the 30 Aug ruling was given. The
instruction was to replace a weekly-cadence line in it, but no such
file and no such line was found anywhere in Crestfall-fe or
crestfall-main. The ruling text below is recorded verbatim as
given. Nothing about a prior weekly cadence is reconstructed here,
because no record of it was found to cite. If a superseded ruling
exists in another repo or in Notion, link it here; until then this
document is the first written record of the decision, not an
amendment to one.

## The ruling

Feedback intake is a self-scoring Sheet, event-driven on submit,
with no fixed schedule. Brian reviews at will. Items he picks enter
the dev pipeline through the normal gate. The formula upgrades to
real RICE when live usage data exists post-alpha.

## What that means in practice

- No weekly triage meeting and no standing review slot. The Sheet
  reorders itself the moment a response arrives, so the top of the
  list is always current without anyone convening.
- Review is pull, not push. Brian opens the Prioritized tab when he
  wants work, takes what he wants from the top, and marks the rest
  as he sees fit.
- Selection is not admission. An item Brian picks still enters the
  dev pipeline through the normal gate; the score sorts the queue,
  it never authorizes work on its own.
- The interim formula is deliberately crude:
  severity (1 to 5) x 2, plus 3 if the type is Bug, plus 1 if
  submitted within the last 14 days. It ranks; it does not pretend
  to measure.
- RICE (reach, impact, confidence, effort) replaces it once live
  usage data exists post-alpha. Reach and confidence are
  unmeasurable before that, so adopting RICE now would mean
  inventing two of its four terms.

## Implementation

The scorer is bible/tools/feedback-prioritizer.gs, a Google Apps
Script pasted into the Crestfall Feedback responses Sheet. Its
header comment carries the paste-in steps, including the
installable on-submit trigger, which must be added by hand.

Behavior worth knowing about:

- It runs on form submit and from a "Crestfall, Rescore all" menu
  item.
- It maintains a Prioritized tab sorted by score descending.
- The Status column (New, In pipeline, Done, Skip) is hand-edited
  and is carried across every rescore. The script never overwrites
  it. A hidden column holds the source row number, which is how a
  status survives a rebuild.
- The recency point is computed at run time, not continuously. Any
  new submission rescores every row, so it stays current in normal
  use; after a quiet stretch, Rescore all refreshes it.

## LINKS

| What | Where |
|---|---|
| Form (responder view) | https://forms.gle/EU8CUp1nxYWTUXg46 |
| Responses Sheet | https://docs.google.com/spreadsheets/d/15A3o4999yEuU2E48oCbCc9B9V9BBA4ugnm7famnj4WM/ |
| Uploads folder | Brian's Drive, restricted, auto-managed |

Access: the Form and the Sheet are both restricted to Brian's
account. No agent has direct access to either. Until a connector is
ruled, an agent reads this data only from exports Brian pastes in.
Nothing in this repo should be written as though the Sheet were
readable from a session.

## Live status

Prioritizer v2 installed in the Sheet's Apps Script and verified
live on 30 Aug 2026: a test row scored 10, and hand-set statuses
survived a rescore.

Authority note: the live version is v2, and it lives in the Sheet's
own Apps Script editor, not in this repo. The repo copy at
bible/tools/feedback-prioritizer.gs is kept as reference only. If
the two ever disagree, the Sheet wins, and the repo copy is the
stale one.

## Trail

- Ruled by Brian, 30 Aug 2026.
- Implementation of record: v2 in the Sheet's Apps Script editor.
- Reference copy, not authoritative: bible/tools/feedback-prioritizer.gs.
- Status line: bible/STATUS.md.
