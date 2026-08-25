CRESTFALL-FE HANDOFF: BUILD-0823 CLOSE-OUT AND TRUNK MERGE
23 Aug 2026, from Claude Code (Sonnet), close-out session. Supersedes docs/handoffs/HANDOFF-ED1F-NICK-2026-08-22.md. For Nick, readable by Sol.

VERIFIED STATE
- design/sprint-h-final is now the merged trunk at merge commit
  a816172 (parents f5b07d2 and 394ac8e). Production build exit 0 on
  the merged tree, verified in this session before the merge commit
  landed.
- Trunk now contains everything the 22 Aug handoff described (the
  ED1F propagation, G1-G7 law review, and the ED1G burn-down: all 13
  de-nesting findings closed, the mechanics de-nest lanes, the sw4
  type-ladder cleanup) PLUS the full eight-commit build-0823 session
  merged in whole: build-0823(1) through build-0823(7) (container
  law; the chat surface rebuild; list-view five-bucket-filter
  conformance; the Studio hub three-zone restructure and sidebar
  refinement; quick-create shell conformance and advanced-editor
  entry; the creator-card three-slot strip and Generate CTA cost
  note; the pass close and session report) and build-0823(8) (the
  Young Adult ratings display word, ruled in this close-out session,
  ahead of the merge).
- The merge itself was conflict-free: ds1 and trunk had touched
  disjoint content since their common ancestor (4723dd7), so git's
  automatic merge already resolved to ds1's build-0823 state on every
  component, token, fixture, and page file, with trunk's own
  unique work (the docs/handoffs/HANDOFF-ED1F-NICK-2026-08-22.md file
  itself) carried through untouched. No manual conflict resolution
  was needed.
- Full session detail, pass by pass, lives in
  docs/handoffs/SESSION-REPORT-2026-08-23-BUILD.md (already on
  trunk).
- Auth-free verification routes (dev-only, notFound() in production)
  for this session's work: /dev/ui-preview/chat-v2-page (both fixture
  states and the live mock page), chat-cast-panel, chat-composer,
  chat-state-panel, chat-party-roster (new), chat-message,
  chat-transcript, chat-npc-manager, chat-session-dialogs,
  studio-v2-page, studio-sidebar, studio-economy-widget,
  kit-creator-card, modal-frame. Every v2 page's own *-v2-page preview
  mirror is unchanged in address.

RECONCILIATION ITEMS
- The two collision files named in the 22 Aug handoff are still open
  and still apply, sync/merge_1 (origin/sync/merge_1, tip 74454fa)
  remains unmerged and untouched by this session:
  1. components/studio/media/media-lightbox/: your branch adds a real
     MediaLightboxImageReassignmentBinding; trunk still ships Reassign
     Asset as a disabled stub under CR-055. Unchanged since 22 Aug.
  2. components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx:
     both sides touched it; trunk's diff was small and additive
     (placeholder law). Unchanged since 22 Aug.
- NEW this session, chat-package overlap: read-only inspection of
  origin/sync/merge_1 against its own merge-base with trunk shows it
  independently touches chat-cast-panel (contract, view, README),
  chat-npc-manager (contract, view, README), chat-shell (contract,
  README, and a useChatShellViewModel.js file that does not exist on
  trunk today), and chat-state-panel (contract, view, README). The
  build-0823 session rewrote all four of these packages in full
  (Party panel, the new chat-party-roster selection surface, the
  state-panel management row, the composer action bar). This is a
  real, material collision, not a formality: your branch's edits and
  this session's edits touch the same files with different intent.
  Recommend a side-by-side diff read before any merge attempt, not an
  automatic one.
- Three stub CRs still open, unchanged in substance by this session:
  CR-054 (soft-delete recovery window, 7 to 30 days, ships with an
  "[X] days" placeholder pending your ruling), CR-055 (Reassign Asset
  endpoint, FE ships an honest disabled stub, see the MediaLightbox
  collision above), CR-056 (Archive operation on owned creations,
  presentation stub, no endpoint exists).
- CR-042 (server-side list search/filter/sort) remains open and
  non-blocking. This session's Pass 3 verified client-side
  search/filter/sort works correctly against fixtures on all seven
  v2 list pages and promoted the five-bucket type filter to a shared
  module (lib/shared/presentation/typeBuckets.js); none of that
  reaches CR-042's server-side scope.

PRODUCT-BEHAVIOR RULINGS FOR NICK
- Cast renamed Party throughout FE copy, hard cap of 5 members. The
  new chat-party-roster package (contract 1.0.0) is the add/remove
  selection surface; membership is mock state on the page ViewModel
  pending a real party-membership endpoint.
- Set Player Character removed from the chat surface entirely in this
  build (it was already gated to turnCount === 0). It is not replaced
  by an equivalent control; if a "narrator-chat flow" entry point is
  still wanted for this action, it needs its own brief, not assumed
  from this session's work.
- Random Liked removed with no replacement. Delete Story relocated
  from the party panel to the state panel's management row (icon plus
  word, same destructive confirm-sheet pattern and copy, no change to
  what gets deleted).
- Composer mode surface: the Dialogue chip presents Dialogue, Action,
  and Suggestion. CHAT_COMPOSER_MODES gained a SUGGESTION value this
  session; OOC and DIRECT remain contract-legal values but are not
  offered by this picker. Open question for a ruling: whether
  OOC/DIRECT need their own surfaced entry point later.
- The ratings display word is now Young Adult platform-wide (ruled by
  Brian in this close-out session), superseding Teen. FE display
  layer only, in lib/shared/presentation/terminology.js: the backend
  enum value MATURE and the internal tier id TEEN are unchanged, only
  the rendered label word changed. Everyone and Adult are unchanged.
  This does NOT touch the separate, older Everyone/Mature/Explicit
  vocabulary still hardcoded across ~20 legacy (non-v2) creation
  builder files; those were out of scope for this ruling and remain
  as they were.
- The scene-image selector (Party panel's art well) opens the shared
  FixtureActionNotice stub per the HIDE/STUB law, pending its own CR
  for the real image picker.

NEW LAWS MINTED THIS SESSION
- Container law (docs/DESIGN-TOKENS.md, "Container law, RULED 23 Aug
  2026"): every /studio page's content column caps at
  max-width var(--container) (1200px), centered, on the existing
  fluid padding ramp, applied once at the StudioShell width
  authority. Supersedes docs/BUILD-BLUEPRINT.md 2.16(l).
- Gap-6 speaker-ink clamp and the chat recipe tokens
  (docs/DESIGN-TOKENS.md, "Chat surface tokens and the gap-6 law"):
  --chat-bubble-fill (9%), --chat-bubble-line (22%),
  --chat-avatar-fill (12%), --chat-speaker-name (an OKLCH
  relative-color clamp, lightness 0.70 to 0.88, chroma capped 0.12),
  --radius-bubble (16px). Supersedes the proposed --chat-msg-*
  palette family on the display side.
- KitModalFrame sheetGrabber (1.2.0 to 1.3.0), additive: an optional
  decorative grabber bar above a sheet's header row.
- Sidebar density values (preview mode only): nav rows resolve to
  --control-sm (32px) with the standing coarse-pointer 44px override,
  --text-label type, and a --space-2 group-to-group gap. Minted
  entirely from existing tokens, no new value invented, but this
  build ran with no render-verification steps, so the recipe has not
  been seen live. Flagged for Brian's next render sitting.
- Young Adult ratings display word (see PRODUCT-BEHAVIOR RULINGS
  above), lib/shared/presentation/terminology.js and
  docs/CONTRACT-REQUESTS.md CR-027.

DESIGN-DONE, BUILD-DEFERRED (post-sync)
The designed direction exists for these; none were built this
session, deliberately, per the three-zone Studio hub ruling and the
standing "no door routes to an old-system page" rule:
- Guided Build (the altitude-ladder pane this session's Studio hub
  restructure removed).
- Player Character quick create (the one Soon door remaining in the
  CREATE zone).
- Wardrobe, Pose, Scenario, Narrator, and the registry family
  (NPC/Location/Faction/Organization/Event/Quest/Item Registry): all
  were Soon cards in the now-removed Full Studio tool-card grid, not
  migrated or stubbed elsewhere.

ASK
- Merge sync/merge_1 against this trunk (a816172). The two
  previously-named collision files plus the newly-identified
  four-package chat overlap (chat-cast-panel, chat-npc-manager,
  chat-shell, chat-state-panel) need your read on which side is
  current truth before anything auto-resolves; this session did not
  attempt that merge.
- Reply with a staging ETA once sync/merge_1 lands, so fine-tuning
  (rating audit, live party-membership wiring, the CR-054/055/056
  endpoints) can run against live data.

STANDING NOTES
- Two DS-check items remain deferred, unresolved by this session
  (docs/plans/ED1G-FULL-REVIEW-FINDINGS.md section 8 item 10): (a)
  the Tailwind .space-y-* scan-exclusion fix, no check script exists
  in this repo (the check is the upstream Claude Design self-check),
  and ds-bundle/_ds_bundle.css still carries 14 --tw-space-y-*
  custom properties the self-check misreads as tokens; fix location
  undecided. (b) The @kind comment count disagrees between
  docs/plans/ED1F-DESIGN-DELTAS.md (33) and .design-sync/NOTES.md
  (38); zero @kind comments actually exist in the repo today, and
  NOTES.md parks the injection approach as an open decision. Both
  need a Brian ruling before either closes.
- The ds-bundle compiled mirror has no local regeneration script; it
  is external design-sync tool territory (docs/plans/
  ED1G-FULL-REVIEW-FINDINGS.md, section on remaining FAILED items).
  No CR has been filed for this yet; one should be, so the mirror's
  regeneration path has an owner.
