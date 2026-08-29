# FE Convergence Audit, 29 Aug 2026

Read only audit. No files were edited in the working tree; this report and
the bible/STATUS.md update are the only two writes made, both by explicit
approval. Sprint-h anchor: design/sprint-h-final, tip 1236a3dd (HANDOFF-NICK
doc), 23 Aug 2026. Converged branch checked against: origin/main, tip
9039758 ("LORE + chat fixes"), 29 Aug 2026.

## Gates

G1. Working tree untouched. Proof: `git status --porcelain` returned empty
before and after the audit.

G2. No new branches. Proof: `git branch --list | wc -l` returned 204 at the
end; no `git branch -b`, `git checkout -b`, or `git switch -c` command was
run at any point in this session. The audit was git show, git diff, git
log, and git ls-tree only.

G3. Converged branch identified by evidence. `git fetch --all --prune`
pulled `84e4b68..9039758 main -> origin/main`, the only branch with commits
after 26 Aug 2026. `git for-each-ref --sort=-committerdate refs/remotes`
shows origin/main at 29 Aug 2026, ahead of every design/* branch. `git
log --oneline origin/design/sprint-h-final..origin/main` lists 27 commits
including `5ccd07c Merge branch 'design/sprint-h-final'`, proving
sprint-h-final was merged into main, not superseded by a different
default branch. `git merge-base --is-ancestor origin/design/sprint-h-final
origin/main` returns true (exit 0). Separately, `git merge-base
--is-ancestor origin/sync/merge_1 origin/main` returns false: sync/merge_1
is not an ancestor of main. `git merge-base origin/sync/merge_1
origin/main` resolves to `092cb37`, an older common ancestor, meaning
main's convergence pass folded in equivalent work by other commits rather
than a literal merge of sync/merge_1. Anyone reconciling Nick's "47/47
packages accepted" claim against sync/merge_1 directly should know that
branch was never merged as such.

G4. Package survival table below, each row with its proving command.

G5. Two files written, both shown to Brian for approval before writing:
this file and bible/STATUS.md.

G6. Zero em dashes. Proof: a grep count for the em dash character run
against this file and against bible/STATUS.md both return 0.

## Sprint-h anchor check

STATUS.md (26 Aug 2026 entry) cites design/sprint-h-final as `a816172`.
The actual tip is `1236a3dd`. `git rev-list --count a816172..1236a3dd`
returns 1: `a816172` is the immediate parent of the tip (the
ds1-claude-design-sync merge commit), and `1236a3dd` is one commit past
it (the HANDOFF-NICK doc commit). This is a one-commit staleness in
STATUS.md, not the eight-commit gap the audit brief assumed. The
build-0823 session's 8 commits (2f2d484 through 394ac8e) all land
between `8bfbf96` and `a816172`, i.e. before the cited SHA, not after it.
STATUS.md's anchor is corrected below.

## Package survival table

| Package | Verdict | Evidence command |
|---|---|---|
| chat-cast-panel | SURVIVED, byte identical | `git diff --stat 1236a3dd 9039758 -- components/studio/chat/chat-cast-panel/` (empty); `git ls-tree` blob SHAs match |
| chat-npc-manager | SURVIVED, byte identical | same pattern, `chat-npc-manager/` |
| chat-state-panel | SURVIVED, byte identical | same pattern, `chat-state-panel/` |
| chat-shell | SURVIVED, additive | `git diff 1236a3dd 9039758 -- components/studio/chat/chat-shell/ChatShell.contract.js` shows version 1.1.0 to 1.2.0, one new optional `formatHelp` prop, same pattern as the existing `partyRoster` prop |
| StoryRoomsHub | SURVIVED, byte identical | `git diff --stat 1236a3dd 9039758 -- components/studio/story-rooms/story-rooms-hub/` (empty) |
| StoryRoomCastPanel | SUPERSEDED, additive | contract 1.0.0 to 1.2.0; new Manage Cast modal replaces an inline action rail; `git diff 1236a3dd 9039758 -- components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.contract.js` |
| StoryRoomChatShell | SUPERSEDED, additive | contract v1 to v1.2; new Status Surface Host and pre-first-message Player Character picker added as new sibling files; view still imports no fetch or service code |
| StoryRoomStatePanel | SUPERSEDED, additive | contract 1.0.0 to 1.1.0; `onPress` added to action items; doc comment tightened on export and share boundary |
| MediaLightbox | SURVIVED, additive | contract 2.0.0 to 2.2.0: Reassign Asset made live, Rename added; `git diff 1236a3dd 9039758 -- components/studio/media/media-lightbox/MediaLightbox.contract.js` |
| CreationImageLibraryPage | SURVIVED, additive | contract 1.1.0 to 1.3.0: live share, reassignment feedback, Library Pass owner panel added |
| Studio sidebar | SUPERSEDED | nine items and their groups intact; the Studio item's own href changed from /studio/v2/studio to /studio; a new Feedback and Updates/Terms and Policies support group was added; `git diff 1236a3dd 9039758 -- components/studio/studio-sidebar/` |
| Five bucket filter | SUPERSEDED | `lib/shared/presentation/typeBuckets.js` still exports the five asset kind buckets as a library utility, but the user facing Type filter on Community and Vault list pages was replaced by a five domain group taxonomy (`app/studio/v2/catalog/creationCatalogFilterTaxonomy.js`) with different, broader groupings |
| Quick create shell | MISSING under that name | `git ls-tree -r --name-only 1236a3dd \| grep -i quick-create` and the same against 9039758 both return nothing; no path containing "quick-create" exists on either side, so this needs a follow up name search (candidates: the /studio/create route, EditorIndexClient.jsx) before it can be called gone |
| Creator card three slot strip | SURVIVED | `components/kit/creator-card/` and `components/studio/community/creator-card/` file lists identical; only a `likes` stat and a `canFollow` gate were added to KitCreatorCard.view.jsx |
| Container law | SUPERSEDED, weakened | `git diff 1236a3dd 9039758 -- components/studio/studio-shell/StudioShell.view.jsx` shows the single width authority section lost both `mx-auto` and `max-w-[var(--container)]`; two later commits (dc99576 Mass sync, 2906e3f restoring home) made this change; `max-w-[var(--container)]` still appears ad hoc on several individual v2 pages, but the central cap in DESIGN-TOKENS.md's stated authority location is gone |
| Studio hub three zone scroll | SUPERSEDED | the three zone content survives as the body of a new "Quick Start" mode, but the 23 Aug decision to drop the altitude ladder was reversed: commit dc99576 adds a StudioModeSelector with Quick Start, Guided Build, and Full Studio tabs, restoring the ladder the build-0823 pass removed |
| Ratings display word, Young Adult | SURVIVED, propagated | `git grep -n "Young Adult" 9039758` finds all original occurrences intact plus two new surfaces built after the fork (AccountV2Live.view.jsx, ChatShell.fixtures.js); no stray "Teen" label found |

## Never auto merge detail

The four chat packages (cast panel, npc manager, shell, state panel) and
the four Story Room packages (hub, cast panel, chat shell, state panel),
plus MediaLightbox and CreationImageLibraryPage, were checked for the
specific failure mode the flag exists to catch: backend or chassis logic
migrating into a View component. None was found.

In every package, `.view.jsx` files were grepped for `fetch(`, `axios`,
and `@/lib` style backend imports on both sprint-h-final and main; all
came back empty except for expected UI library imports (lucide-react
icons). New client and server wiring in this convergence pass
(`lib/client/studio/media/imageOutputClient.js`,
`lib/client/studio/story-rooms/storyRoomClient.js` grown to 757 lines,
`lib/client/studio/creations/libraryPassClient.js`, the new
`lib/shared/story-rooms/` and `lib/shared/timelines/` contract files) is
consumed exclusively by ViewModel hooks (`useMediaLightboxViewModel.js`,
`useStoryRoomChatShellViewModel.js`, `useCreationLibraryPassOwnerViewModel.js`,
and similar), never directly by a View. Contract version numbers were
bumped in every case a prop shape changed; none of the eight packages
were silently rewritten without a version bump.

The size of Sol's Story Room change (roughly 4,900 insertions across 54
files by one subagent's count) likely explains why it was flagged for
manual review rather than any actual boundary breach found here. Two
functional design decisions were reversed elsewhere in the convergence
and are worth Brian's separate attention: the container law weakening
(StudioShell.view.jsx) and the Studio hub altitude ladder restoration
(Studio.view.jsx via StudioModeSelector). Neither is a LOOM violation,
both are product and layout decisions that overrode a ruled sprint-h
design choice without a visible gate in this history.

## Terminology check

`lib/shared/presentation/terminology.js` diff between sprint-h-final and
main is one line: a new `TIMELINE: "Timeline"` entry. All four ruled
display words from the brief were checked directly on main:

- Story: `ROOM_TEMPLATE: "Story"`, present.
- Adventure: `STORYLINE: "Adventure"`, present.
- Everyone / Young Adult / Adult: `CONTENT_RATING_DISPLAY_NAMES` maps
  SFW to "Everyone", MATURE to "Young Adult", EXPLICIT to "Adult", all
  present, matching the 23 Aug ruling.
- Rulebook: this string does not appear in terminology.js on either
  branch. `git grep -ni rulebook 9039758` finds it only in
  docs/CLOSING-INVENTORY.md referring to the design rulebook document,
  not a content type display word. RULES_CODEX maps to "Rules Codex" on
  both branches. This looks like an error in the audit brief's premise,
  not a regression; flagging it rather than guessing which term was
  meant.

No reverted or wrong terminology found.

## Recommended branch point for the new FE dev branch

Cut the new FE dev branch from origin/main at 9039758. It is the branch
Nick and Sol actually converged into, it contains sprint-h-final as an
ancestor (proven under G3), and every package this audit checked
survived or was superseded additively, not reverted or stubbed. The two
open product questions (container law, Studio hub altitude ladder) do
not block a branch cut; they are ruling items for Brian, not missing
code. The quick-create shell needs a short follow up search before
anyone can say confidently whether it survived under a new name or was
genuinely dropped.
