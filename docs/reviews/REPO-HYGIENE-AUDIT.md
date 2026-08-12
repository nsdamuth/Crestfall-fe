# Repo hygiene audit

Written 12 Aug 2026 on branch `design/repo-hygiene-audit`, off
`origin/design/sprint-h-final`. Read-only audit, one deliverable: this
file. No other file in the repo was touched to produce it. Scope:
every file in `docs/` (including `contracts/`, `marketing/`,
`reviews/`, `architecture/`, `_archive/`) plus stray instruction/doc
files at repo root. `docs/review-artifacts/` and
`docs/_legacy-reference/` do not exist in this worktree at audit time
(the latter is gitignored per `.gitignore` and may exist in other
worktrees; CLAUDE.md already notes it may or may not be present
locally, so its absence here is not itself a finding).

Method: four parallel read-only crawls (sprint plans/briefs;
reports/inventories/census; contracts/architecture/reviews/root files;
LOOM component-shape compliance), plus direct reads of the four law
docs, `docs/SPRINT-H-PLAN.md`, and `docs/BUILD-BLUEPRINT.md` by this
session. 60 files inventoried total (57 under `docs/`, 3 at repo
root). No subagent wrote, moved, deleted, or committed anything.

---

## 1. Inventory and classification

One row per file. Classification is exactly one of KEEP-LIVE, ARCHIVE,
DELETE, REGENERATE, or DUPLICATE-OF-\<file\>.

### 1.1 Law docs (the four CLAUDE.md points to, plus the active sprint plan and its cited blueprint)

| File | Classification | Reason |
|---|---|---|
| `CLAUDE.md` | KEEP-LIVE | The single entry point; law. |
| `docs/DESIGN-TOKENS.md` | KEEP-LIVE | Token law, named by CLAUDE.md #1. |
| `docs/FRONTEND-SOP.md` | KEEP-LIVE | Process law, named by CLAUDE.md #2. |
| `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` | KEEP-LIVE | Product model, named by CLAUDE.md #3, reissued 9 Aug 2026. |
| `docs/SPRINT-H-PLAN.md` | KEEP-LIVE | Self-declares: "this file is the active sprint plan and therefore law." Named by CLAUDE.md #4 as the active sprint plan. |
| `docs/BUILD-BLUEPRINT.md` | KEEP-LIVE | Not one of the four law docs but load-bearing by citation: DESIGN-TOKENS.md cites its chapter 1 as the source of the ladder/state primitive rulings; FRONTEND-SOP.md cites its section 3.4 (parity-echo instrument) and route law 3.3(d); CRESTFALL-PRODUCT-MODEL-UXUI.md section 6 cites it directly. Actively regenerated (last closing pass 9-12 Aug 2026 range per cross-references). |

### 1.2 Standing reference docs

| File | Classification | Reason |
|---|---|---|
| `docs/APP-FUNCTION-MAP.csv` | KEEP-LIVE | Named directly in CLAUDE.md as standing reference; cited by FRONTEND-SOP sections 13-14 as contract/done-definition law. Actively maintained (12 Aug touch). |
| `docs/APP-FUNCTION-INVENTORY.md` | KEEP-LIVE | Named directly in CLAUDE.md as standing reference. One stale internal citation (see Conflicts 2.7). |
| `docs/COMPONENT-CENSUS.csv` | REGENERATE | FRONTEND-SOP section 10 names it as required progressive-context reading "before touching any component package," but it has not been regenerated since 10 Aug 2026 20:57, predating Sprint H (11-12 Aug) v2 component work. An agent following the standing instruction today loads stale data. |
| `docs/COMPONENT-CENSUS.md` | REGENERATE | Generated rollup of the CSV above ("do not hand edit, regenerate after editing the CSV"). Same staleness, same fix (regenerate both together). Not a duplicate of the CSV; it is its declared readable view. |

### 1.3 Contracts

| File | Classification | Reason |
|---|---|---|
| `docs/contracts/CONTRACT-TEMPLATE.md` | KEEP-LIVE | Cited by FRONTEND-SOP section 14 as the template every signed feature contract must use. |
| `docs/contracts/CF_ST_FE_ABSORPTION_TARGET_LIST_SUPPLEMENT_V1.md` | ARCHIVE | Point-in-time (4 Aug 2026) backend-authored target list against a repo-layout assumption (`/Crestfall`, `/Crestfall-fe`) that does not match this repo's actual path; not cited by any law doc. |
| `docs/contracts/CF_ST_SUMMARY_EXPORT_SHARE_IMPLEMENTATION_AND_LOOM_HANDOFF_V1.md` | ARCHIVE | Self-marked "Complete and validated," 4 Aug 2026 point-in-time handoff record, not process law. |
| `docs/contracts/CF_ST_SUMMARY_EXPORT_SHARE_WORK_PACKAGE_P1.md` | ARCHIVE | Explicitly superseded by the Implementation Record above (same feature, later status); its own Parts 2-3 are unfilled draft templates, never completed. |

### 1.4 Architecture

| File | Classification | Reason |
|---|---|---|
| `docs/architecture/CRESTFALL_LOOM_PATTERN.md` | KEEP-LIVE | Cited directly by FRONTEND-SOP section 1 as the LOOM shape/boundary authority. |

### 1.5 Reviews

| File | Classification | Reason |
|---|---|---|
| `docs/reviews/BANNER-AUDIT.md` | KEEP-LIVE | Dated 11 Aug 2026, still-open findings (weak-image issues, version-citation fixes named but not yet applied); cited by CRESTFALL-DESIGN-CONTEXT.md's CC5 ruling summary as the full record. |
| `docs/reviews/SCALE-REVIEW-H.md` | KEEP-LIVE | Read-only performance audit, findings still open (B2, CR-042); cited by CRESTFALL-DESIGN-CONTEXT.md's CC4 ruling as the source of the fix pass. |

### 1.6 Marketing

| File | Classification | Reason |
|---|---|---|
| `docs/marketing/crestfall-brand-final.html` | ARCHIVE | Standalone brand-identity page belonging to the "Marketing site with a CMS" workstream, explicitly "Not scheduled" per CRESTFALL-DESIGN-CONTEXT.md; not referenced by any law doc. |

### 1.7 Reports, inventories, sweep artifacts

| File | Classification | Reason |
|---|---|---|
| `docs/CLOSING-INVENTORY.md` | KEEP-LIVE | 4 Aug 2026 violation inventory, still the most current full per-package finding set; DESIGN-TOKENS.md cites it by name as usable at the line-item level. Its own "deleted at end of life" self-description has not been honored (still present 8 days later) - flag for the archive wave, not a reclassification. |
| `docs/CLOSING-REPORT.md` | ARCHIVE | Narrative report of the run that produced CLOSING-INVENTORY.md; superseded operationally by later sweep/sprint work. |
| `docs/PARITY-AUDIT.md` | ARCHIVE | v1.0.0, 10 Aug 2026; superseded one day later by PARITY-ECHO-FULL.md, which re-verifies every claim against current code. |
| `docs/PARITY-ECHO-FULL.md` | KEEP-LIVE | v1.1.0, 11 Aug 2026, the current parity-tracking document; sections outside its two updated ones are self-flagged "not re-verified" (partial staleness the file itself admits). |
| `docs/SWEEP-PROGRESS.md` | ARCHIVE | Resume checkpoint for a closed overnight sweep run; self-described as a generated artifact for deletion at end of life. |
| `docs/SWEEP-REPORT.md` | ARCHIVE | Final report of the same closed sweep; superseded in scope by CLOSING-REPORT/CLOSING-INVENTORY's later, larger pass. |
| `docs/HARVEST-GAPS.md` | ARCHIVE | Fed the now-closed sweep; its skip-list items are resolved in CLOSING-INVENTORY/CLOSING-REPORT. |
| `docs/NICK-BLOCKERS.md` | ARCHIVE, gap flagged | Record-only doc; two of its five items (mobile profile crash, name-counter/404 bugs) have no corresponding entry in the now-canonical CONTRACT-REQUESTS.md - verify before archiving (Conflict 2.5). |
| `docs/NICK-SWEEP-NOTES.md` | ARCHIVE, gap flagged | DRAFT handoff explainer, its 10 "add a delete confirm-step" decisions have no CR equivalent in CONTRACT-REQUESTS.md (Conflict 2.6). |
| `docs/HANDOFF-NEXT-CHAT.md` | ARCHIVE | One-time session handoff (10 Aug 2026), superseded by Sprint H work already landed 11-12 Aug. |
| `docs/VAULT-EDIT-TREE-CLASSIFICATION.md` | ARCHIVE | One-time classification pass (11 Aug 2026), explicitly self-scoped as "owned by this pass alone"; its findings are folded into PARITY-ECHO-FULL.md v1.1.0. |
| `docs/RAW-LITERALS.md` | ARCHIVE | Coarser, undated literal-count inventory superseded by CLOSING-INVENTORY.md's later, more actionable per-package findings. |
| `docs/MOCKUP-DECISIONS.md` | ARCHIVE | 9 Aug 2026 ADOPT/ADAPT/SKIP ruling register against legacy proof HTML; its rulings are meant to be folded into DESIGN-TOKENS/RESTYLE-RULES, not itself law. |
| `docs/STUDIO-SPEC.md` | KEEP-LIVE | v1.0.0, 10 Aug 2026; actively referenced by open CRs (CR-007, CR-008, CR-031) still live in CONTRACT-REQUESTS.md. Carries an unresolved conflict with the product model (2.8). |
| `docs/SHELL-INVENTORY.md` | ARCHIVE | Self-labeled "Reference only, retargeted in step 4 of the phase 2 skin brief" - an early-phase planning artifact from a since-completed phase. |
| `docs/DEEP-MAP-CREATOR.md` | ARCHIVE | Generated rollup of the CSV below; one-time deep audit of the Character-creation control tree, not named as a standing reference by any law doc (unlike COMPONENT-CENSUS.csv). |
| `docs/DEEP-MAP-CREATOR.csv` | ARCHIVE | Source data for the rollup above; same disposition. |
| `docs/CONTRACT-REQUESTS.md` | KEEP-LIVE | Actively maintained (12 Aug 2026 touch, CR-001 through CR-042); named live by FRONTEND-SOP section 5. Well-disciplined: partially-resolved items self-flag their own drift rather than going silently stale. |

### 1.8 Sprint plans and briefs

| File | Classification | Reason |
|---|---|---|
| `docs/BATCH-TWO-ORDER.md` | ARCHIVE | Generated audit artifact (429 findings ordered into sub-batches); self-described as deletable at end of life; named in SPRINT-3-PLAN's own archive list. |
| `docs/BATCH-TWO-SCOPE.md` | ARCHIVE | Source audit for the above; same disposition. Both cite `docs/RESTYLE-RULES.md`'s "Rulings" as their rule authority, which current CLAUDE.md says is not law (Conflict 2.1). |
| `docs/REDESIGN-ORDER.md` | ARCHIVE | Frozen point-in-time render-distance audit; named in SPRINT-3-PLAN's archive list; several findings already re-ruled by Sprint D. |
| `docs/SPRINT-3-PLAN.md` | ARCHIVE | Ship-gate items long executed (T1, T5-T9 closed); scope fully absorbed by the sprint chain through H. Carries a stale cross-reference (Conflict 2.7) and an internal settled/open contradiction (Conflict 2.2). |
| `docs/SPRINT-A-PLAN.md` | ARCHIVE | Executed, then materially revised by Sprint D's R4 (mobile modal law) with no supersession notice on this file (Conflict 2.3). |
| `docs/SPRINT-A-POLISH-PLAN.md` | ARCHIVE | Executed, then its R4 image-overlay treatment explicitly rejected by name in Sprint D 1.2, with no supersession notice on this file (Conflict 2.4). |
| `docs/SPRINT-A-POLISH-SONNET-BRIEF.md` | ARCHIVE | Execution artifact for the plan above; same staleness inherited. |
| `docs/SPRINT-A-SONNET-BRIEF.md` | ARCHIVE | Execution artifact for SPRINT-A-PLAN.md; same staleness inherited. |
| `docs/SPRINT-B-PLAN.md` | DELETE | Own header: "SUPERSEDED 10 Aug 2026 by docs/SPRINT-D-PLAN.md... Do not execute from this document." Never executed under this name; content correctly absorbed into Sprint D. Cleanest self-superseding file in the set - the model other stale files should have followed. |
| `docs/SPRINT-B-SONNET-BRIEF.md` | DELETE | Own header: "SUPERSEDED 10 Aug 2026 by docs/SPRINT-D-SONNET-BRIEF.md... Do not run this brief." Never run. |
| `docs/SPRINT-D-PLAN.md` | ARCHIVE | Confirmed COMPLETE (R1-R5, R7 fixes verified with commit hashes in SPRINT-E-PLAN.md); the most internally self-consistent doc in the set. |
| `docs/SPRINT-D-SONNET-BRIEF.md` | ARCHIVE | Execution artifact for the above; confirmed complete. |
| `docs/SPRINT-E-PLAN.md` | ARCHIVE, completion unverifiable | Review-gate fixes (R1-R5, R7) confirmed DONE; whether the R6 `image-creator-panel` build itself shipped could not be confirmed from docs alone (Conflict 2.9) - verify against `components/kit/` before treating as fully closed. |
| `docs/SPRINT-E-SONNET-BRIEF.md` | ARCHIVE, same caveat | Execution artifact for the above; same unresolved completion flag. |
| `docs/SPRINT-F-PLAN.md` | ARCHIVE | Confirmed COMPLETE both internally (render pass + defect-fix pass appended in-file) and externally (SPRINT-G-PLAN.md lists `rail` as shipped, law migrated into BUILD-BLUEPRINT.md 2.18). Model example of durable content correctly migrated out before archiving. |
| `docs/SPRINT-G-PLAN.md` | REGENERATE (partial-supersession, undocumented) | Wave 1 (Home) confirmed complete; Waves 2-4 (kit fill, Lore/Adventures, Studio) were silently re-planned into SPRINT-H-PLAN.md without a supersession notice on this file (Conflict 2.5) - the single most actionable finding of this audit. |
| `docs/SWEEP-PROGRESS.md`, `docs/SWEEP-REPORT.md` | (see 1.7) | Listed once, not repeated here. |

### 1.9 Product model, process, root files

| File | Classification | Reason |
|---|---|---|
| `docs/CRESTFALL-DESIGN-CONTEXT.md` | KEEP-LIVE | Explicitly not law but the most current, actively maintained (regenerated 12 Aug 2026, same day as audit) orientation doc; defers to the four law docs on conflict. |
| `docs/CRESTFALL-PRODUCT-MODEL.md` | ARCHIVE (self-declared superseded) | File's own banner: "SUPERSEDED, 9 Aug 2026... kept for the unit ladder... and the visibility model, which the UXUI doc restates and does not contradict." Stale parts confirmed: page-architecture description, no terminology/shared-component-pattern content (both live only in the UXUI doc). |
| `docs/PROJECT-INSTRUCTIONS.md` | KEEP-LIVE, not a competing instruction file | Explicitly scoped to a different assistant surface (the claude.ai strategy chat, not Claude Code); states it stays in sync with CLAUDE.md rather than competing with it. |
| `docs/ROADMAP.md` | KEEP-LIVE | Standing status doc, updated in the same commit as the work it records; named in FRONTEND-SOP section 10. |
| `docs/RESTYLE-RULES.md` | ARCHIVE (correctly self-labeled already) | Self-demoted 7 Aug 2026: "historical changelog, not law, never cited as an execution authority." CLAUDE.md independently confirms under "Not law." Correctly classified in place; still actively mis-cited as authority by two archived files (Conflict 2.1). |
| `docs/_archive/AGENTS.md` | ARCHIVE (correctly placed) | Already in `_archive/`; self-declares supersession by CLAUDE.md/FRONTEND-SOP; repo-wide check found no other file citing it as law. |
| `/README.md` (repo root) | DELETE | Generic, unmodified `create-next-app` boilerplate; zero Crestfall-specific content; misleading (references defaults that don't match this project's actual setup, e.g. port 3000 vs this repo's 3001). Not a governance violation, just dead weight that misinforms a fresh clone. |
| `/Crestfall-FE-README.md` (repo root) | ARCHIVE, flagged as a genuine competing instruction file | Contains a full independent "Guidance for AI assistants" section (architecture rules, file-reading order, change rules, validation rules, PR checklist) overlapping FRONTEND-SOP.md's territory, with no supersession notice pointing to CLAUDE.md. See Conflict 2.1 (root). |

---

## 2. Conflicting or overlapping guidance

Numbered for reference in the execution plan (section 6). "Wins" names
the file that governs when the two disagree.

1. **Competing instruction file at repo root.** `Crestfall-FE-README.md` carries its own "Guidance for AI assistants" section (architecture/file-reading/change/validation rules, PR checklist) that duplicates FRONTEND-SOP.md's territory without pointing to CLAUDE.md or being marked archived - unlike `docs/_archive/AGENTS.md`, which correctly self-declares supersession. This is a live violation of CLAUDE.md's own forbidden clause: "No duplicate instruction files... any other agent-instruction file found in this repo is archived, not followed." **CLAUDE.md wins.**
2. **`docs/RESTYLE-RULES.md` cited as rule authority by two archived files.** `BATCH-TWO-SCOPE.md` and `BATCH-TWO-ORDER.md` both frame RESTYLE-RULES.md's "Rulings - 4 Aug 2026" as the ruling authority they audit against. Current CLAUDE.md states RESTYLE-RULES.md is a historical changelog, never cited as execution authority. **DESIGN-TOKENS.md wins**, its settled content already folded in per RESTYLE-RULES.md's own self-demotion.
3. **T7 wash-value ("settled" vs. "open") contradiction.** `SPRINT-3-PLAN.md` states T7 is "RULED... now SETTLED, no longer provisional." Every sprint plan from A onward (A, A-Polish, D) lists "the lighter wash value for artwork under a tag bed" as a standing open item. DESIGN-TOKENS.md's own `--scrim` entry states `.40 is settled, not provisional` (Ruling 7, 7 Aug 2026) but leaves the door open for Brian to adjust the value after viewing it live. **DESIGN-TOKENS.md wins** as the authoritative current status; the open-item language in A/A-Polish/D should be read as "value fixed, adjustment window still live," not "unruled." Flag for Brian to confirm this reading is correct, since four docs in a row treated it as open.
4. **Mobile modal law stale in two un-superseded files.** `SPRINT-A-PLAN.md` and `SPRINT-A-POLISH-PLAN.md` both specify a bottom-docked sheet under 700px for the modal frame. Sprint D's ratified R4 replaces this with full-screen maximize on mobile, and CRESTFALL-PRODUCT-MODEL-UXUI.md section 3.5 states the current law directly ("maximize the full screen vertically and horizontally at phone width"). Neither A-series file carries a superseded notice the way `SPRINT-B-PLAN.md` correctly does. **SPRINT-D-PLAN.md / CRESTFALL-PRODUCT-MODEL-UXUI.md win.**
5. **Image-overlay treatment rejected by name in a later doc.** `SPRINT-A-POLISH-PLAN.md`'s R4 image-viewer spec (`--surface-4` panel, letterboxed canvas bed) is explicitly rejected in `SPRINT-D-PLAN.md` section 1.2 ("exactly what R2 rejects... the `--surface-4` panel R2 bans"). **SPRINT-D-PLAN.md wins.**
6. **`SPRINT-G-PLAN.md` not marked superseded despite three of its four waves being re-planned.** Its Wave 1 (Home) is confirmed complete; Waves 2-4 (kit-fill, Lore/Adventures, Studio) were silently re-planned into SPRINT-H-PLAN.md's waves H2a/H2b/H2c/H3/H4/H5, with SPRINT-H-PLAN.md restating the same open items (39-41) "re-based to the Sprint H waves." A reader following SPRINT-G-PLAN.md's wave order today would duplicate or contradict Sprint H's plan. **SPRINT-H-PLAN.md wins**, and is the currently active law by CLAUDE.md #4 regardless.
7. **Stale cross-reference in an otherwise-archived doc.** `SPRINT-3-PLAN.md`'s "Post-merge governance" section names `docs/CRESTFALL-PRODUCT-MODEL.md` as a governing doc; current CLAUDE.md says that file is superseded by `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`. Expected drift for an already-archived file; noted for completeness only, no action needed beyond archiving.
8. **`docs/STUDIO-SPEC.md` vs. `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 4.4.** STUDIO-SPEC.md's own "Relationship to standing documents" section states it supersedes the product model's wording about the advanced editor being "a state of the Studio page" (STUDIO-SPEC now rules it its own page) and says the product model's "next reissue should fold this in." That fold-in has not happened - a live, named gap between two still-active documents. Exactly the kind of gap CLAUDE.md's "when a decision is not written down, stop and report" clause exists to catch. **Unresolved - flag for Brian**, not silently resolved by this audit.
9. **`docs/APP-FUNCTION-INVENTORY.md` cites the superseded product model.** Its "Destination-page mapping" section (line 69) reads "the ruled nine-page model (`docs/CRESTFALL-PRODUCT-MODEL.md`)" - should point to `CRESTFALL-PRODUCT-MODEL-UXUI.md`, which owns this content now. **CRESTFALL-PRODUCT-MODEL-UXUI.md wins**; this is a one-line citation fix, not a content conflict.
10. **`docs/COMPONENT-CENSUS.csv`/`.md` staleness vs. FRONTEND-SOP section 10's progressive-context law.** The law doc directs agents to load this CSV "before touching any component package," but it has not been regenerated since 10 Aug 2026 20:57, predating at least three new v2 packages shipped in Sprint H (per HANDOFF-NEXT-CHAT.md, VAULT-EDIT-TREE-CLASSIFICATION.md). An agent following the standing instruction today gets stale data with no warning. **Needs regeneration**, not a classification change.
11. **`docs/NICK-BLOCKERS.md` items with no CR equivalent.** Two of its five recorded bugs (`/studio/profile` mobile crash; name-counter/404 placeholder-image bugs) have no corresponding entry in the now-canonical `docs/CONTRACT-REQUESTS.md` backlog. Unresolved: either these were fixed off-book, or they are live bugs missing from the CR system. **Flag for Brian before archiving this file** - archiving it without action risks losing two unresolved bugs.
12. **`docs/NICK-SWEEP-NOTES.md`'s 10 delete-confirm-step decisions have no CR equivalent.** Same pattern as #11: this draft handoff names 10 still-open decisions with no formal CR filed. **Flag for Brian before archiving.**
13. **`docs/reviews/BANNER-AUDIT.md` self-flags stale version citations elsewhere.** `docs/BUILD-BLUEPRINT.md` line 1741 and `docs/CRESTFALL-DESIGN-CONTEXT.md` lines 281/422/442 still cite "promo-banner contract 1.2.0" when the contract is now 1.3.0, and `docs/APP-FUNCTION-MAP.csv` rows 1047-1048 carry the same stale string. Out of this audit's edit scope (read-only), but a real, self-identified staleness in three live-law-adjacent files. **Needs a version-string correction pass, separate from this audit.**
14. **Sprint E build completion cannot be confirmed from docs alone.** The `image-creator-panel` kit package Sprint E was meant to build does not appear in either Sprint G's or Sprint H's "kit state" inventories of shipped packages. **Needs a direct check against `components/kit/`** before SPRINT-E-PLAN.md/SPRINT-E-SONNET-BRIEF.md are archived as fully-closed rather than partially-open.

Total distinct conflict/gap flags: **14** (numbered above). Two additional **broken references** are tracked separately in section 3.

---

## 3. Law docs vs. repo reality

Every file, route, or script CLAUDE.md and FRONTEND-SOP.md cite was
checked against the live repo.

**Confirmed to exist, as cited:**
- `app/design-system.css` lines 165-176 (focus-ring rule)
- `app/globals.css` - contains `@source not "../docs";` at line 13
- `app/dev/ui-preview/` - exists as a route folder
- `lib/shared/flags/sidebarV2Preview.js` - exists, matches section 18's description
- `components/studio/studio-sidebar/StudioSidebar.view.jsx` - exists
- `docs/contracts/CONTRACT-TEMPLATE.md` - exists
- `docs/architecture/CRESTFALL_LOOM_PATTERN.md` - exists
- `docs/_legacy-reference/` - absent in this worktree, but CLAUDE.md itself already notes this is expected (gitignored, may not be present locally); not a broken reference.

**Broken references found (referenced by a law doc, do not exist anywhere in the repo):**
1. `docs/CRESTFALL-CONTENT-STANDARDS.md` - named as a "companion" in `CRESTFALL-PRODUCT-MODEL-UXUI.md`'s header. Does not exist.
2. `docs/LOOM-WORKFLOW-GUIDE.md` - named in the same header line. Does not exist. (`docs/architecture/CRESTFALL_LOOM_PATTERN.md` is the closest live substitute but is not the same filename/path; `docs/BUILD-BLUEPRINT.md`'s own header already independently notes this exact gap and used the LOOM pattern doc in its place.)

Both broken references sit in the same header line of a law doc
(`CRESTFALL-PRODUCT-MODEL-UXUI.md` "Companions:" line) and should be
corrected in the doc's next reissue: drop `LOOM-WORKFLOW-GUIDE.md` in
favor of the real path, and either write `CRESTFALL-CONTENT-STANDARDS.md`
or drop the citation until it exists.

Stale-instruction flag count: **2** (the broken references above).
Item 13 in section 2 (stale contract-version citations) is a content
staleness inside otherwise-valid files, tracked there rather than
here.

---

## 4. LOOM process readiness

Scope checked: 260 `*.view.jsx` packages under `components/` (of 601
total `.jsx` files), cross-referenced against sibling ViewModel,
contract, fixtures, README, and the one-level-up Binding Shell; all
258 contract files checked for `CONTRACT_VERSION` on line 1; all 268
`app/dev/ui-preview/` route directories checked for coverage and
production gating.

**Overall health:** ~70% of the 260 LOOM packages (181) are strictly
compliant with all five files plus Shell in the canonical name and
location. Of the remaining ~30%, roughly half are false positives from
a systemic, consistent alternate Shell-naming convention (below), not
real gaps.

**Packages missing required pieces (genuine gaps):**
- Missing contract and/or fixtures outright: `KitCreditsModal`,
 `KitContinueRow`, `CreationStudio`, `LookPreview`, `CoverPreview`,
 `WorldPreview`, `MechanicsCommandEffectCard`, and seven mechanics
 JSON-editor modals (`ActorMechanicsProfileJsonEditorModal`,
 `ProgressionJsonEditorModal`, `RulesCodexJsonEditorModal`,
 `StatsPoolsJsonEditorModal`, `MechanicsJsonEditorModal`,
 `MechanicsPresetApplicationModal`, `MechanicsTrackersSection`).
- Missing README: `CreatorStops` and its six sibling `*-stop`
 packages (`FaceStop`, `HeartStop`, `KindStop`, `NameStop`,
 `PayoffStop`, `SealStop`, `SilhouetteStop`), plus `LookPreview`,
 `CoverPreview`, `WorldPreview`.
- Missing ViewModel, verified intentional (pure presentational,
 Shell passes props straight through - legitimate per LOOM pattern
 section 13, but the SOP checklist doesn't formally exempt this
 case): `AccountStubPage`, `CreateTypeCard`, `ModalActions`
 (npc-registry), `ModalShell` (npc-registry), `SelectionCard`
 (room-template/room-templates), `CreationCredits`,
 `CreationTagFilterRow`, `CreationPickerPanel`, `ProfileAvatar`,
 `ProfileBanner`, `StoryRoomMobileDrawer`, `StudioActionCard`,
 `StudioBackLink`, `StudioComingSoon`, `StudioPageHeader`,
 `CharacterTemplateGallery`, `ViewModeToggle`.

**Things in the repo structure that will confuse the pattern going forward:**
1. **Shell naming/location deviates systemically in two subtrees.**
 `*-builder` packages under `components/studio/create/*` use
 `FeatureNameBuilderShell.jsx` instead of the documented
 `FeatureName.jsx` (e.g. `LoreBuilderShell.jsx`,
 `NarratorBuilderShell.jsx`, `ScenarioBuilderShell.jsx`,
 `AssetBuilderShell.jsx`, `RulesCodexBuilderShell.jsx`,
 `ActorMechanicsProfileBuilderShell.jsx`). Separately,
 `components/studio/my-creations/edit/sections/*` shells are named
 after a truncated legacy name that drops the domain prefix (e.g.
 `AdvancedSection.jsx` binds `CharacterAdvancedSection.view.jsx`).
 Both are internally consistent within their own subtree (verified
 functionally correct, not broken) but both make the literal
 `find … -iname "FeatureName.jsx"` check FRONTEND-SOP section 1 item
 1 prescribes report false negatives. `mechanics-command-core`
 places its Shell inside the feature folder rather than one level
 up - a third, different deviation.
2. **21 of 258 contracts fail the literal `CONTRACT_VERSION` line-1
 check**, split between a competing naming convention
 (`..._LOOM_CONTRACT` / `..._VIEW_CONTRACT` exports, e.g.
 `MECHANICS_DEFAULTS_LOOM_CONTRACT`) and files that lead with a
 comment or unrelated constant before any version export
 (`CreatorStops.contract.js`, `HeartStop.contract.js`,
 `LoreBuilder.contract.js`, and 12 others).
3. **Fixture "required states" cannot be verified mechanically.**
 Fixtures overwhelmingly use domain-semantic export names rather
 than the literal words default/empty/error/loading/longest from
 FRONTEND-SOP section 1 item 5. A literal keyword grep would flag
 256 of 257 fixture files as non-compliant, but spot-checks show
 real, meaningful state coverage under different names. This is a
 process risk for whoever next tries to mechanically enforce
 "definition of done" item 5 - the check as written cannot be
 grepped and needs per-file review, or the SOP's check needs
 loosening to match actual practice.
4. **Preview-route coverage is strong and not a risk**: 268
 `app/dev/ui-preview/*` routes essentially 1:1 with the 260 View
 packages; all sampled `page.jsx` files correctly gate on
 `NODE_ENV`/`notFound()`.
5. **The non-LOOM legacy surface is large but cleanly bounded**: ~340
 `.jsx` files under `components/` have no `.view.jsx` counterpart,
 concentrated entirely in `components/blocks/*`,
 `components/content/*`, `components/policies/*`, and root-level
 marketing/shell files (`SiteHeader.jsx`, `SiteFooter.jsx`,
 `PageShell.jsx`, `Breadcrumbs.jsx`, `DetailPage.jsx`, `LoreCard.jsx`,
 etc.). The split falls cleanly along "studio/kit/ui" (LOOM) vs.
 "public marketing site" (pre-LOOM) directory lines - this is a
 known, bounded gap, not a confusing one, and should be named
 explicitly as out-of-migration-scope rather than left implicit.

Bottom line: LOOM adoption inside its actual scope (studio/kit/ui) is
strong. The two things most likely to trip up a new agent are the
Shell-naming deviations in `*-builder` and `edit/sections/*` (breaks
literal path checks) and the fixture-state check's reliance on literal
keywords that real fixture files don't use.

---

## 5. Proposed target `docs/` structure

Permanent law set stays flat at `docs/` root, exactly the six files
CLAUDE.md and the standing-reference section already name, nothing
added without a CLAUDE.md edit:

```
CLAUDE.md (repo root, unchanged)
docs/
 DESIGN-TOKENS.md
 FRONTEND-SOP.md
 CRESTFALL-PRODUCT-MODEL-UXUI.md
 BUILD-BLUEPRINT.md
 APP-FUNCTION-MAP.csv
 APP-FUNCTION-INVENTORY.md
 COMPONENT-CENSUS.csv
 COMPONENT-CENSUS.md
 CONTRACT-REQUESTS.md
 ROADMAP.md
 CRESTFALL-DESIGN-CONTEXT.md
 PROJECT-INSTRUCTIONS.md (different lane, kept for that reason)

 sprints/ (new: current + one-back only)
 SPRINT-H-PLAN.md (moves here once no longer "the" active plan naming convention changes; while active, CLAUDE.md #4 continues to name it directly by path - folder move is cosmetic, not a law change)

 contracts/
 CONTRACT-TEMPLATE.md
 (feature contracts, unchanged)

 architecture/
 CRESTFALL_LOOM_PATTERN.md

 reviews/ (live, open-finding reviews only)
 BANNER-AUDIT.md
 SCALE-REVIEW-H.md
 REPO-HYGIENE-AUDIT.md (this file)

 marketing/
 crestfall-brand-final.html

 _archive/
 sprints/ (new: closed sprint plans/briefs, by sprint letter)
 SPRINT-3-PLAN.md, SPRINT-A-*.md, SPRINT-B-*.md, SPRINT-D-*.md, SPRINT-E-*.md, SPRINT-F-PLAN.md, SPRINT-G-PLAN.md
 reports/ (new: closed one-time reports/audits/sweeps)
 CLOSING-REPORT.md, PARITY-AUDIT.md, SWEEP-PROGRESS.md, SWEEP-REPORT.md,
 HARVEST-GAPS.md, NICK-BLOCKERS.md, NICK-SWEEP-NOTES.md, HANDOFF-NEXT-CHAT.md,
 VAULT-EDIT-TREE-CLASSIFICATION.md, RAW-LITERALS.md, MOCKUP-DECISIONS.md,
 SHELL-INVENTORY.md, DEEP-MAP-CREATOR.md, DEEP-MAP-CREATOR.csv,
 BATCH-TWO-ORDER.md, BATCH-TWO-SCOPE.md, REDESIGN-ORDER.md,
 CRESTFALL-PRODUCT-MODEL.md, RESTYLE-RULES.md
 contracts/
 CF_ST_FE_ABSORPTION_TARGET_LIST_SUPPLEMENT_V1.md
 CF_ST_SUMMARY_EXPORT_SHARE_IMPLEMENTATION_AND_LOOM_HANDOFF_V1.md
 CF_ST_SUMMARY_EXPORT_SHARE_WORK_PACKAGE_P1.md
 AGENTS.md (unchanged, already here)
```

Rules going forward, to keep this from re-accumulating: (a) a sprint
plan or brief gets a one-line "SUPERSEDED \<date\> by \<file\>" banner
the moment the next sprint's plan makes it obsolete, matching the
pattern `SPRINT-B-PLAN.md` already models correctly - this is a
process gap, not a folder-structure gap, and no folder move fixes it
on its own; (b) one-time audits/reports move to `_archive/reports/`
the same week they close, not eight days later; (c) nothing enters
`docs/` root that isn't one of the twelve permanent-law-set files
above without a CLAUDE.md edit.

---

## 6. Ranked execution plan (proposal only - executes nothing today)

Waves are ordered by risk reduction per unit of effort. Each wave
lists its exact file list. **No file is touched by this audit or this
report.** Execution requires a separate human GO per FRONTEND-SOP
section 9.

### Wave 1 - Fix the live governance gap (highest value, lowest risk)
Move `Crestfall-FE-README.md` to `docs/_archive/` (or delete it after
confirming no unique content), since it is a live violation of
CLAUDE.md's own "no duplicate instruction files" rule sitting at repo
root undetected. Delete or replace `/README.md` (boilerplate,
misleads a fresh clone). Fix the two broken references in
`CRESTFALL-PRODUCT-MODEL-UXUI.md`'s header (section 3). Files:
`Crestfall-FE-README.md`, `README.md`, `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md`.

### Wave 2 - Regenerate the two stale standing-reference docs
Regenerate `docs/COMPONENT-CENSUS.csv` and `docs/COMPONENT-CENSUS.md`
against current `components/` state so FRONTEND-SOP section 10's
progressive-context instruction stops handing agents 2-day-stale data.
Files: `docs/COMPONENT-CENSUS.csv`, `docs/COMPONENT-CENSUS.md`.

### Wave 3 - Resolve the three flagged-but-unresolved content gaps (needs Brian, not mechanical)
Confirm and either close or formally file: (a) `docs/NICK-BLOCKERS.md`
items 2 and 5 against `CONTRACT-REQUESTS.md`; (b)
`docs/NICK-SWEEP-NOTES.md`'s 10 delete-confirm-step decisions; (c)
`docs/STUDIO-SPEC.md` vs. `CRESTFALL-PRODUCT-MODEL-UXUI.md` section
4.4 fold-in. Verify Sprint E's `image-creator-panel` build status
against `components/kit/` directly. No files moved in this wave; it
produces the CR entries or ruling notes that make Wave 4's archiving
safe.

### Wave 4 - Archive closed sprint plans and briefs
Move to `docs/_archive/sprints/`:
`docs/BATCH-TWO-ORDER.md`, `docs/BATCH-TWO-SCOPE.md`,
`docs/REDESIGN-ORDER.md`, `docs/SPRINT-3-PLAN.md`,
`docs/SPRINT-A-PLAN.md`, `docs/SPRINT-A-POLISH-PLAN.md`,
`docs/SPRINT-A-POLISH-SONNET-BRIEF.md`, `docs/SPRINT-A-SONNET-BRIEF.md`,
`docs/SPRINT-D-PLAN.md`, `docs/SPRINT-D-SONNET-BRIEF.md`,
`docs/SPRINT-E-PLAN.md`, `docs/SPRINT-E-SONNET-BRIEF.md`,
`docs/SPRINT-F-PLAN.md`, `docs/SPRINT-G-PLAN.md`. Before moving
`SPRINT-G-PLAN.md`, add the one-line supersession banner it is
currently missing (Conflict 2.6), naming `SPRINT-H-PLAN.md`'s waves
H2a/H2b/H2c/H3/H4/H5 as the successor for its Waves 2-4.

### Wave 5 - Delete the self-superseded files
Delete (not archive - they explicitly say "do not execute/run this
document" and were never executed): `docs/SPRINT-B-PLAN.md`,
`docs/SPRINT-B-SONNET-BRIEF.md`.

### Wave 6 - Archive closed reports, inventories, and sweep artifacts
Move to `docs/_archive/reports/`: `docs/CLOSING-REPORT.md`,
`docs/PARITY-AUDIT.md`, `docs/SWEEP-PROGRESS.md`,
`docs/SWEEP-REPORT.md`, `docs/HARVEST-GAPS.md`,
`docs/NICK-BLOCKERS.md`, `docs/NICK-SWEEP-NOTES.md`,
`docs/HANDOFF-NEXT-CHAT.md`, `docs/VAULT-EDIT-TREE-CLASSIFICATION.md`,
`docs/RAW-LITERALS.md`, `docs/MOCKUP-DECISIONS.md`,
`docs/SHELL-INVENTORY.md`, `docs/DEEP-MAP-CREATOR.md`,
`docs/DEEP-MAP-CREATOR.csv`, `docs/CRESTFALL-PRODUCT-MODEL.md`,
`docs/RESTYLE-RULES.md`. Gate on Wave 3 completing for the two
Nick-facing files (do not lose the unresolved-bug flags).
`docs/CLOSING-INVENTORY.md` is excluded from this wave and stays
KEEP-LIVE (still the current line-item violation reference); revisit
its disposition only once its findings are fully absorbed into a
newer inventory.

### Wave 7 - Archive closed contracts and marketing
Move to `docs/_archive/contracts/`:
`docs/contracts/CF_ST_FE_ABSORPTION_TARGET_LIST_SUPPLEMENT_V1.md`,
`docs/contracts/CF_ST_SUMMARY_EXPORT_SHARE_IMPLEMENTATION_AND_LOOM_HANDOFF_V1.md`,
`docs/contracts/CF_ST_SUMMARY_EXPORT_SHARE_WORK_PACKAGE_P1.md`. Move
`docs/marketing/crestfall-brand-final.html` to `docs/_archive/` (or a
future `marketing/` workstream folder once that work is scheduled).

### Wave 8 - Correct the stale contract-version citations (mechanical, low risk, cross-file)
Update the three files `docs/reviews/BANNER-AUDIT.md` already
self-flags as citing "promo-banner contract 1.2.0" instead of the
current 1.3.0: `docs/BUILD-BLUEPRINT.md` line 1741,
`docs/CRESTFALL-DESIGN-CONTEXT.md` lines 281/422/442, and
`docs/APP-FUNCTION-MAP.csv` rows 1047-1048. Not touched by this audit
(read-only); listed here so it isn't lost.

### Wave 9 - LOOM shape cleanup (process fix, not a doc move)
Two options for Brian, not decided here: (a) rename the
`*-builder` Shells and `edit/sections/*` Shells to match
`CRESTFALL_LOOM_PATTERN.md`'s documented convention, or (b) amend the
pattern doc to formally document the alternate convention as legal.
Either closes the false-negative risk in FRONTEND-SOP section 1 item
1's literal path check. Separately, fill in the ~10 genuine
contract/fixtures/README gaps listed in section 4. Not a docs/ folder
change; listed here because it was audited in the same pass and
belongs on the same execution backlog.

---

## REPORT

**Counts per classification** (60 files/folders inventoried):
- KEEP-LIVE: 19
- ARCHIVE: 35
- DELETE: 3
- REGENERATE: 3
- DUPLICATE-OF: 0 (the two candidate pairs, COMPONENT-CENSUS.md/.csv
 and DEEP-MAP-CREATOR.md/.csv, are confirmed generated-rollup
 companions of their CSV, not true duplicates)

**Conflict flags:** 14 (section 2)

**Stale-instruction flags:** 2 broken references (section 3); a
further content-staleness item (stale contract-version citations
across 3 files) is tracked as conflict #13 rather than double-counted
here.

**Top 5 risks to future agent accuracy:**
1. `Crestfall-FE-README.md` is a live, undetected violation of
 CLAUDE.md's "no duplicate instruction files" rule - a new agent
 could read it as law and follow a stale, parallel process.
2. `docs/SPRINT-G-PLAN.md`'s Waves 2-4 were silently re-planned into
 Sprint H with no supersession notice - a new agent could build
 against the wrong (abandoned) wave plan.
3. `docs/COMPONENT-CENSUS.csv`/`.md` are named as required
 pre-work reading by FRONTEND-SOP section 10 but are stale by two
 days of active Sprint H builds - an agent following the standing
 instruction gets wrong data with no warning.
4. Two `docs/SPRINT-A-*` files describe a mobile modal behavior and
 an image-overlay treatment that Sprint D explicitly superseded and
 in one case explicitly rejected by name, with no supersession
 banner on the older files.
5. The LOOM Shell-naming deviation in `*-builder` and
 `edit/sections/*` subtrees breaks the literal path check
 FRONTEND-SOP section 1 item 1 prescribes, risking false "not
 LOOM-shaped" flags on functionally correct packages.

**Single highest-value cleanup wave:** Wave 1 - archiving
`Crestfall-FE-README.md`, retiring the boilerplate root `README.md`,
and fixing the two broken companion-doc references in
`CRESTFALL-PRODUCT-MODEL-UXUI.md`. It is the smallest wave (3 files),
touches nothing load-bearing, and closes the one finding in this audit
that is a direct, active violation of CLAUDE.md's own stated law
rather than ordinary sprint-doc drift.
