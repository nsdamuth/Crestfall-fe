CRESTFALL-FE SESSION REPORT: BUILD-0823, SEVEN-PASS DESIGN BUILD
23 Aug 2026, from Claude Code (Sonnet), executing docs/plans/BUILD-PLAN-2026-08-23.md. For Brian and Nick.

STATE
- Branch design/ds1-claude-design-sync, starting tip 8bfbf96, working
  tree clean at session start. Seven passes, one commit each, all
  seven pushed. Production build exit 0 before every commit; final
  full sweep (build, lint, em-dash, out-of-contract greps) run again
  at close, zero new violations found across all 74 files touched
  this build.
- Every pass echoed against the build plan's manifest below, marked
  DONE or STOPPED. Nothing STOPPED; every item landed as planned or
  as a recorded, lawful deviation (listed under SKIPPED/DEVIATIONS).

PASSES COMPLETED

PASS 1: Container law. DONE.
- Minted the container law at the single width authority
  (components/studio/studio-shell/StudioShell.view.jsx): every
  /studio page's content column is max-width var(--container)
  (1200px), centered, on the existing fluid padding ramp. No new
  token; --container and --measure were already locked. Supersedes
  BUILD-BLUEPRINT 2.16(l), recorded in both DESIGN-TOKENS.md and
  BUILD-BLUEPRINT.md.

PASS 2: Chat surface. DONE (the largest pass).
- New law: the gap-6 clamp (--chat-speaker-name, OKLCH relative-color
  recipe, lightness clamped 0.70 to 0.88, chroma capped 0.12) and the
  tinted bubble recipe (--chat-bubble-fill 9%, --chat-bubble-line
  22%, --chat-avatar-fill 12%, --radius-bubble 16px), all in
  app/theme.css and docs/DESIGN-TOKENS.md. Supersedes the proposed
  --chat-msg-* palette family on the display side.
- ChatShell: removed both chat-local headers; StudioShell's top bar
  and sidebar now the only chrome. Added one in-flow story header
  (title, one meta line, coin chip). Fixed the dead coin chip
  (StoryChatPage was passing coinBalanceLabel to a prop ChatShell
  never read).
- Cast panel renamed Party throughout FE copy. Fixed 5 slots, vertical
  rows, dashed "Open slot - 5 max" placeholders. Set Player Character,
  Random Liked, and Delete Story removed from this panel. Scene art
  well is icon-only, no caption (missing-image law), opens a stub via
  FixtureActionNotice pending its own CR.
- New package: chat-party-roster (contract 1.0.0), the selection
  surface opened by double-clicking a member or tapping an open slot.
  Uses KitModalFrame variant="modal" (its ruled responsive behavior)
  rather than variant="sheet"; logged as a deviation below.
- State panel: management row (Share, Export, Delete icon-only 38px
  controls); Delete Story relocated here from the party panel, quiet
  trigger with the danger-confirm sheet. World, Knowledge, and
  Mechanics render as quiet key-value rows with fade-line section
  labels, replacing the boxed StateCards.
- Composer rebuilt around one action-bar grid at both breakpoints:
  Menu / Auto / Party / Dialogue (with a Dialogue/Action/Suggestion
  mode picker). "Next Speaker" and the full speaker-selection strip
  are removed. Composing indicator moved to chat-transcript ("Composing...").
- KitModalFrame gained an additive sheetGrabber prop (1.2.0 to 1.3.0).
- Rating label fixed to "Young Adult" in the chat meta line
  (terminology.js untouched, see DEVIATIONS).

PASS 3: List views. DONE.
- Promoted the five-bucket type filter (previously copy-pasted
  identically in Vault and Community) to
  lib/shared/presentation/typeBuckets.js, ratifying it as the standard
  wherever a list mixes asset kinds and resolving Community's prior
  unratified-extension flag.
- Filter line, sticky docking, search, sort, and two-up density were
  already conformant on all seven list pages per this session's
  exploration; verified, not rebuilt.

PASS 4: Studio hub and sidebar. DONE.
- Studio hub: removed the altitude ladder (LevelSelector tablist,
  Guided Build pane, Full Studio tool-card grid). One calm scroll,
  three zones: CREATE (the four live doors plus Player Character's
  Soon door, plus "Prefer full control? Start in the advanced
  editor"), BUILD (Build a Story, Build an Adventure), PUBLISH (one
  line to the Vault). Soon doors now render a real disabled attribute,
  not just aria-disabled with a live onClick.
- Sidebar refinement (Brian, 23 Aug walk), all in preview mode only,
  flag-off production untouched:
  1. Notifications CTA removed from the economy widget's expanded and
     collapsed modes; notifications live in the top bar bell only.
  2. Coins area compacted to one row (count plus a small Buy Coins
     chip), replacing the boxed section with stacked buttons.
  3. Signed-in row gains inline Discord and Settings icons; Log out
     is a quiet row directly beneath.
  4. Legacy group removed from preview mode entirely.
  5. Vault's iconKey reverted castle to archive (the repo's standing
     archive/vault glyph).
  6. Nav density tightened (--control-sm rows, --text-label type,
     --space-2 group gap) so the sidebar fits common desktop heights
     with no internal scroll.

PASS 5: Quick creates and editor entry. DONE.
- Shared CreatorStopsView (Character, World, Look, Story) moved onto
  --grad-panel-lift and --line-fade dividers, gained a per-creator
  closeAriaLabel (fixing the hardcoded "Close character creator"
  aria-label on the other three creators), the unsaved-changes word
  now renders at every width, and the panel becomes a full-height
  sheet under 700px (R4).
- Removed the redundant last-stop "Save and open the advanced editor"
  button (it called the same handler as "Finish and save"). The
  saved-state's "Keep editing" button is relabeled "Open in advanced
  editor" (same onContinueInEditor handler, already routed to
  /studio/v2/editor/{id}); this is the lawful exit, keeping the
  footer to two actions.
- The Studio hub's new advanced-editor line is the editor index's
  first live in-app entry point; its stale header comment (promising
  a "Full Studio primary door" that was never built) corrected.

PASS 6: Walk defects. DONE.
- KitCreatorCard's media strip mirrors the KitAssetDetailPopup 3-slot
  treatment from 16dac8b exactly: three slots always render, the
  ratified icons-v7.svg#i-59 placeholder fills empty slots, the strip
  no longer hides at zero thumbnails.
- Every quick-create preview panel's Generate CTA (Character, World,
  Look, Story) drops the coin/token cost from the button label into a
  quiet note beneath it. The chat composer's Scene Image button
  already conformed from pass 2.

PASS 7: Close. DONE.
- Full production build, exit 0. Full lint (no new errors or
  warnings introduced; every flagged item traced to a file this
  build did not touch). Em-dash and DESIGN-TOKENS "Out of contract"
  greps run across all 74 touched files: zero new hits.
- Editor-family conformance check (code-level read, no redesign)
  below.

NEW LAWS MINTED THIS BUILD
- Container law (DESIGN-TOKENS.md, "Container law, RULED 23 Aug
  2026"): max-width var(--container) at the StudioShell content
  section, superseding BUILD-BLUEPRINT 2.16(l).
- Gap-6 clamp and the tinted bubble recipe (DESIGN-TOKENS.md, "Chat
  surface tokens and the gap-6 law"): --chat-bubble-fill,
  --chat-bubble-line, --chat-avatar-fill, --chat-speaker-name,
  --radius-bubble.
- KitModalFrame sheetGrabber (1.3.0), additive.

EDITOR-FAMILY CONFORMANCE CHECK (Pass 7, code-level read against ED1E/ED1F)
Spot-checked components/studio/my-creations/editor-header/EditorHeader.view.jsx
and app/studio/v2/editor/editor/Editor.view.jsx against
docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md sections 6 (hero) and 7
(sticky rail):
- Hero identity block (eyebrow tier 2, title tier 1, KitBadge
  visibility chip, one seated action row of equal secondary
  buttons): confirmed present, with the implementation directly
  citing "Section 6, D10" and "Section 6, D11" in its own code
  comments.
- SlotRail (filled slots plus exactly one add tile, no broken-image
  wells, active slot marked on its own thumb): confirmed present,
  matching D10 exactly.
- Sticky rail (no max-h, no overflow-y-auto, sticky offset below the
  top bar, order save block / switcher / ToC): confirmed present,
  citing "Section 7... D12" in its own code comments.
Result: CLEAN PASS on every spot-checked item. No divergence found.
This was a targeted read (hero and rail sections only, the sections
most load-bearing for a visual sitting), not an exhaustive line-by-
line audit of every ED1E/ED1F field recipe; the editor family was not
otherwise touched or redesigned in this build.

THREE PRODUCT-BEHAVIOR ITEMS FOR NICK
1. Cast renamed Party, hard cap of 5 members. The party roster
   (new chat-party-roster package) is the add/remove surface;
   membership is mock state on the FE page ViewModel pending a real
   party-membership endpoint.
2. Set Player Character removed from the chat surface entirely in
   this build (it was already gated to turnCount === 0 and is not
   replaced by an equivalent control here); if a "narrator-chat flow"
   entry point is still wanted, it needs its own brief.
3. Random Liked removed with no replacement. Delete Story relocated
   from the party panel to the state panel's management row (icon
   plus word, same destructive confirm-sheet pattern, no change to
   what gets deleted).

Composer mode surface note: the Dialogue chip presents Dialogue,
Action, and Suggestion. CHAT_COMPOSER_MODES gained SUGGESTION this
pass; OOC and DIRECT remain contract-legal values but are not offered
by this picker. Flagged for a ruling on whether OOC/DIRECT need their
own surfaced entry point later.

SKIPPED / DEVIATIONS, WITH REASON
- chat-party-roster uses KitModalFrame variant="modal", not
  variant="sheet": the modal variant is already the ruled responsive
  frame (centered 560px at 700px and up, bottom-anchored under
  700px), matching the spec's desktop/mobile requirement from one
  component. Trade: no grabber at any width (grabber is sheet-only).
  Logged in the package's own README.
- Rating label reads "Young Adult" in the chat meta line.
  lib/shared/presentation/terminology.js (the ruled CR-027 vocabulary,
  Everyone / Teen / Adult) is NOT edited; this is a vocabulary
  divergence, not a bug fix, and needs its own ruling before the two
  are reconciled.
- Scene-image picker (party panel's art well) opens the shared
  FixtureActionNotice stub, per the HIDE/STUB law, pending its own CR
  for the real image selector.
- Adventures and Lore two-up density: not extended. Neither page has
  a list/grid mode toggle at all (grid only), so "two-up where
  already lawful" does not reach them without first adding
  ViewModeToggleView, which is new construction, not conformance.
- Full Studio tool-card grid (11 cards, 10 Soon): dropped entirely by
  the three-zone hub ruling, not migrated or stubbed. Its one live
  path (Character) is already covered by the CREATE zone.
- Sidebar nav density recipe: minted entirely from existing tokens
  (no new value invented), but this build ran with no render-
  verification steps per the 23 Aug brief, so the recipe has not been
  seen live. Flagged for Brian's next render sitting.
- Editor-family conformance check (Pass 7) was a targeted read of the
  hero and sticky-rail sections only, not an exhaustive audit of
  every ED1E/ED1F field recipe (label rows, field states, modal
  standard, etc.). No divergence found in what was checked; the
  remainder is unverified, not confirmed clean.

CONTRACT VERSION BUMPS (component contracts touched this build)
- chat-cast-panel: 1.0.0 to 2.0.0 (MAJOR, props removed:
  playerCharacterAction, randomLikedAction, deleteAction, and their
  handlers; renamed castMembers to partyMembers).
- chat-composer: 1.0.0 to 2.0.0 (MAJOR, modeOptions/speakerOptions
  removed, action-bar anatomy replaces the speaker strip).
- chat-state-panel: 1.0.0 to 1.1.0 (MINOR, delete action id and
  deleteConfirm/onDeleteRoom added).
- chat-message: 1.0.0 to 1.1.0 (MINOR, speakerColor additive).
- chat-shell: 1.0.0 to 1.1.0 (MINOR, header restructure, partyRoster
  prop group added).
- chat-party-roster: new, 1.0.0.
- kit modal-frame: 1.2.0 to 1.3.0 (MINOR, sheetGrabber additive).
- StoryChatPage (page contract): 1.0.0 to 1.1.0 (MINOR, additive
  wiring).
- Studio (page contract): 1.3.0 to 2.0.0 (MAJOR, levels/
  activeLevelId/storyBridge/guidedBuildSoon/toolGroups removed;
  onOpenAdvancedEditor/onBuildStory/onBuildAdventure/onOpenVault
  added).
- studio-sidebar: studio-sidebar.view.v1 to v2 (behavior change,
  preview mode only; flag-off byte-identical to v1).
- studio-economy-widget: 1.0.0 to 1.1.0 (MINOR, no prop removed;
  expanded/collapsed rendering changed).
- creator-stops (shared view, all four quick creates):
  creator-stops.view.v6 to v7 (MAJOR, onSaveAndOpenEditor removed;
  closeAriaLabel added).
- kit creator-card: 1.0.0 to 1.1.0 (MINOR, behavior only, no prop
  shape change).

FILES TOUCHED PER PASS: see the seven build-0823(N) commit messages
on this branch for the exact file list per pass; docs/APP-FUNCTION-MAP.csv
carries a row for every control added, removed, or relocated.

FINAL
- Final commit build-0823(7) on this file's own commit, pushed to
  origin/design/ds1-claude-design-sync.
- Manifest echo: all seven passes DONE, zero STOPPED.
