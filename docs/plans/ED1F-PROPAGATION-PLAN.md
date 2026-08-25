# ED1F propagation plan

Written 22 Aug 2026 by the Fable law review on branch
`design/ds1-claude-design-sync`, from the ruled
`docs/plans/ED1F-DESIGN-DELTAS.md` (same-day update), GATE-LOG.md's
MODAL FAMILY close and Gate 2 token law (read from the Crestfall
Editor DS Claude Design project; GATE-LOG.md does not exist on local
disk), the four law documents, `app/theme.css` and
`app/design-system.css` ground truth, and a full repo surface
inventory. Goal: every surface in Crestfall-fe renders the ratified
design system, executed as Sonnet passes over the groups below, ahead
of the Nick design review.

Ground truth the whole plan rests on, verified this session: none of
the Gate 2 twelve-row token law has landed in `app/theme.css` yet (no
`--line-fade`, no `--grad-card`, `--focus-ring` still the old
two-ring recipe at `app/theme.css:357`, `--status-success` still
`#7D9B6A` at line 72). The focus system today is three tiers plus a
suppression in `app/design-system.css` (global ring :167, `.cf-field`
1px gold :175, `.kit-focus` 1px neutral :188, search-field
suppression :194 on). The token files are mirrored byte-identical in
`ds-bundle/tokens/` plus a compiled `ds-bundle/_ds_bundle.css`, and a
`_ds_needs_recompile` marker exists.

## A. Ratified law set this plan propagates

From the delta file's ruled section C plus its A and B laws:

1. Ghost buttons render at weight 300 (A1). Whether 300 gets a
   `--weight-light` alias or stays a literal is decided in G1; either
   way the weight enters the font pipeline (it already loads for
   `--ink-typed`).
2. Blur triad, no cross-borrowing (A2, resolved): `--blur-chrome`
   12px on nav and top-bar chrome plus the editor sticky nav and
   mobile save row; `--blur-panel` 2px on panels and the viewer veil;
   `--blur-glass` 12px NEW, tooltips only.
3. Global focus ring (A3): the gold-ornament-border-plus-glow recipe
   ships under the EXISTING `--focus-ring` name. Kit-focus border
   brightening, the `.cf-field` quiet ring, and the search-field
   suppression all retire. Stated reading, approved at this review:
   the recipe changes, the trigger wiring does not; the global
   `:focus-visible` rule keeps its selector and the three override
   rules in `app/design-system.css` are deleted so everything falls
   through to the one global ring. Zero component-file edits; the
   dead `kit-focus`/`cf-field` class attributes in JSX are harmless
   and are swept in a later cleanup, not this pass.
4. Mobile modal law (A4): supersedes R4 under 700px; section C below.
5. The ten modal-family rulings B1 through B10 as captured, with the
   B4 and B6 token corrections (`--fill-whisper`, `--panel-glass`).
6. The Gate 2 twelve-row token law in full, including the
   `--status-success` revision to `oklch(.76 .08 135)` (closes
   CR-051) and `--focus-ring-editor` ABSORBED into the global
   `--focus-ring` (the editor-scoped name is never minted).
7. New tokens minted in G1: `--focus-ring-ongold`, `--blur-glass`,
   the danger 6 percent fill, the panel lift gradient
   (`#332d22` to `#2a251d`, name avoiding the existing
   `--grad-panel`), the creation-card gradient (`#241f16` to
   `#1b1711`, value only, application gated on F2), the option-card
   rest fill (`rgba(0,0,0,.22)`), plus the twelve-row law's own
   names. Light-theme interim per F1: each new visual token declares
   the same value in both themes, explicitly marked interim in its
   DESIGN-TOKENS row.
8. Viewer bottom-bar hover resolves to `--gold-bright` (locked role
   already includes hover lift); no new token.

## B. Law-document edit list (executed inside G1)

### docs/DESIGN-TOKENS.md

1. Motion and focus: replace the `--focus-ring` recipe (A3); amend
   "the ONLY focus token" to admit `--focus-ring-ongold` (gold-fill
   scope only); retire the `cf-field` quieter-variant sentence.
2. Contrast law: update the "one sanctioned focus mechanism" bullet;
   record the A3 propagation requirement (ring legibility verified on
   every surface depth, `--surface-1` through `--surface-4` plus the
   gradient card and rail surfaces, not only field beds); regenerate
   `docs/review-artifacts/contrast-matrix-x1.md` (both the focus
   recipe and the `--status-success` value changed, which is the
   matrix's own regeneration trigger).
3. Lines/fills/scrims, `--blur-chrome` row: REVERSE the R2
   image-viewer-veil exception; per B7 the viewer veil is now the
   `--chrome-wash` color at `--blur-panel` 2px ("lawful 2px veil, no
   glass extension"). Add the token-law row 10 scope (editor sticky
   nav, mobile save row). Rewrite the prose paragraph carrying the R2
   exception.
4. Lines/fills/scrims: add the `--blur-glass` row (12px, tooltips
   only, never anything else); the pairing prose becomes the
   three-token no-cross-borrowing law.
5. Surfaces, `--surface-4` row: modal panels move to the panel lift
   gradient; narrow the row's "every floating surface" claim
   accordingly (menus and popovers stay `--surface-4` pending F3).
6. Surfaces prose: scoped exception to the translucent-black-fill ban
   for the option-card rest token, legal on option-card rest state
   only.
7. Status colors prose: the "filled `--status-danger` button appears
   in exactly one place" clause updates; the confirm-step CTA is now
   the B5 recipe (border and ink `--status-danger`, 6 percent fill).
   `.cf-btn--danger-filled` is superseded; the in-page quiet-ghost
   trigger law is untouched.
8. Type: weight 300 enters the pipeline; the weights row amends;
   ghost buttons render at 300.
9. `--fill-whisper` legal-on gains option-card selected fill.
10. Gradients: the sanctioned list gains `--grad-card`, `--grad-rail`,
    the panel lift gradient, and the creation-card gradient (F2 gates
    the creation-card application, not the mint).
11. New token rows, each with name, both theme values (interim rule
    per F1), role, legal-on, never-on, status: `--text-input` and
    `--lh-input`; `--ink-typed`; `--fill-ghost`;
    `--control-editor-md` and `--control-editor-sm` (44px mobile
    floor holds; `--control-filter` broadened-use note per CR-053);
    revised `--status-success`; `--grad-card` and `--grad-rail`;
    `--bed-deep` and `--shadow-bed`; `--line-fade`; `--chrome-wash`;
    `--panel-glass`; `--focus-ring-ongold`; `--blur-glass`; the
    danger 6 percent fill; the panel lift gradient; the creation-card
    gradient; the option-card rest fill.
12. Elevation prose: `--shadow-bed` is an inset bed shadow; the
    exactly-two-floating-shadows ruling is untouched.

### docs/FRONTEND-SOP.md

1. Section 2 focus bullet: retire the sanctioned `cf-field` variant
   clause; the check points at the single global ring plus the ongold
   variant; refresh the stale `app/design-system.css:165-176` line
   references after the G1 edit.

### docs/BUILD-BLUEPRINT.md

1. 2.16(e) focus law: superseded in full by A3. Struck and kept for
   lineage, per that section's own convention. This is the kit-focus
   law A3 retires by name.
2. 2.16(p) R4: superseded under 700px; exact text in section C below.
3. 2.5 modal frame: the phone-maximize clause is superseded (A4); the
   frame surface moves from `--surface-4` to the panel lift gradient
   (B3); the fade-divider and footer-alignment laws (B1, B8) enter
   the anatomy.
4. 2.16(r) image viewer: the surround treatment, header, close
   placement, and action-shelf clauses are superseded by B7 (2px veil
   at the `--chrome-wash` color, two-line glass header with centered
   title and the six-icon row, close outside top-right on desktop and
   a floating 44px glass control bottom-right at 390, bottom bar
   Generate Variant, Reassign Asset, Share in `--gold-action` ink
   with `--gold-bright` hover, width-matched to the header). The
   zoom, pan, reset, and mobile-max-image clauses stand.
5. 2.16(d): the dropdown sheet clause is refined by A4
   (bottom-anchored at content height).
6. 1.7 note "`--focus-ring` remains the law and the only declaring
   token": amended for `--focus-ring-ongold`; the
   `--state-focus-ring` alias is unchanged.
7. 2.16(a) and (v) card law: NOT edited. The conflict with B6 is F2
   and waits for Brian.

### docs/CONTRACT-REQUESTS.md

1. CR-048 close: the blur triad plus the Gate 2 chrome-blur ruling
   answer it (surfaces and radius/opacity both ruled).
2. CR-049 close: the Gate 2 save-surface amendment retired the bottom
   bar; the rail-bottom pill plus Discard/Save is the ruling.
3. CR-050 update: the bloom pattern is GO as a reusable increment
   bloom; placement on Save is NO; placement of the pattern
   elsewhere stays open.
4. CR-051 close: sage ruled the success hue everywhere; token law
   row 6.
5. CR-052 update to ruled: all six sidebar deviations KEPT (B
   wholesale, 21 Aug); the economy-fixture sub-item stays open
   pending the StudioEconomyWidget scope decision.
6. CR-053 close: ratified in full by the twelve-row token law.
7. CR-054 NEW: soft-delete recovery window, renumbered from
   GATE-LOG.md's colliding "CR-052" use per Brian's ruling. Owner
   Nick; 7 to 30 days unruled; confirm copy carries "[X] days".
8. CR-047 update: the tooltip glass treatment is now ratified
   (`--blur-glass` 12px); the tooltip component design itself is
   still open for Brian.
9. CR-055, filed by G3 when the viewer builds: the B7 bottom bar's
   Reassign Asset action has no backend operation; it ships as an
   honest stub pending that CR.

## C. R4 supersession (executed inside G1)

Clause reversed: `docs/BUILD-BLUEPRINT.md` 2.16(p), "Mobile modal law
(R4), RULED 10 Aug 2026": "popup modals maximize the screen
vertically and horizontally ... never anchored to the bottom edge,
never small floating cards."

New law text, landing in 2.16(p) with the old text struck and kept
for lineage:

> (p) Mobile modal law, RULED 22 Aug 2026 (modal family close),
> supersedes R4 under 700px. Under 700px: the page behind a modal
> stays visible through the lawful blurred veil, never fully
> obscured; modal panels anchor to the bottom edge at their content's
> own height, never maximized full screen and never small floating
> cards; dismissing a modal with unsaved state routes through a
> confirm step, never a silent discard; every touch target inside a
> mobile modal holds the 44px floor; the mobile modal drawer inherits
> all six ruled sidebar deviations (economy fixture still pending its
> own scope decision). At 700px and up modals center per 2.5,
> unchanged. The image viewer keeps its own ruled mobile treatment
> per (r) as amended by B7; it is a chromeless surface, not a
> bottom-anchored panel.

Breakpoint confirmation: R4's own text says "on mobile" with no
number; the 1.11 grid law already rules the phone tier as up to
699px, so 700px is the app's one mobile boundary and the supersession
is FULL for R4's mobile scope, not partial. Confirmed as the law line
by Brian's pre-resolved ruling.

KitModalFrame propagation flag: `components/kit/modal-frame/`
implements the bottom-anchor content-height behavior; 2.5's phone
clause is edited in the same G1 pass. A behavior-only change needs no
contract bump under FRONTEND-SOP section 5 rules; if any prop is
added the version bumps minor. The package README records the ruling
either way.

## D. Twelve-row token law check: no contradictions

All twelve rows checked against every A/B law and candidate. No value
conflicts. Four interactions recorded:

1. Row 12 `--focus-ring-editor` is ABSORBED by A3: same recipe, ships
   under the existing global `--focus-ring` name; the editor-scoped
   name is never minted.
2. Row 11 `--panel-glass` is the kebab-menu glass value; the delta
   file's B6 candidate marking is corrected to cite it.
3. Row 3 `--fill-ghost` (.05) and `--fill-whisper` (.06) are distinct
   by design; the option-card selected fill maps to `--fill-whisper`,
   not `--fill-ghost`.
4. Row 7 `--grad-card` (`#1a1610` to `#14110c`) is distinct from both
   the panel lift and creation-card gradient pairs; three separate
   gradient tokens.

## E1. App-wide propagation checklist

Order law: shared token and recipe layer first, then kit, then pages,
so shared packages land before the pages that compose them. G1 is
serial and first. G2 and G3 are disjoint and may run in parallel
after G1. G4, G5, G6, G7 are disjoint from one another after G2.
Every group runs under the standing constraints: one package one
commit, pilot-and-stop per the parallelism law, verification per
FRONTEND-SOP section 8 (390 then 1440, emulate not resize, production
build exit 0), contract law (a restyle that appears to need a
contract change stops and escalates), no em dashes, never sed or awk
on markup or CSS.

### G1. Token and law layer (serial, first)

Files: `app/theme.css`, `app/design-system.css`, and the four law
documents per section B (token and doc edits pair in the same commit
per the maintenance law).

- Mint every token in section A item 6 and 7, dark values from the
  ruled exhibits, light values per the F1 interim rule, each with its
  DESIGN-TOKENS row in the same commit.
- Swap the `--focus-ring` recipe at `app/theme.css:357`; delete the
  `.cf-field:focus-visible` rule (design-system.css:175 block), the
  `.kit-focus:focus-visible` rule (:188 block), and the search-field
  suppression block (:194 on); keep the global `:focus-visible`
  selector as is.
- `.cf-btn--secondary` (design-system.css:379): weight 300, bed
  `--fill-ghost`.
- `.cf-btn--primary:hover` (design-system.css:375): the B9 recipe.
- New modal-confirm danger CTA recipe per B5; `.cf-btn--danger`
  (:405) rest state unchanged; `.cf-btn--danger-filled` (:414)
  superseded by the new recipe.
- `--status-success` revision to `oklch(.76 .08 135)`.
- File CR-054 and execute every CONTRACT-REQUESTS edit in section B.
- Verification: production build exit 0; render one editor page, one
  v2 browse page, and one modal at 390 and 1440; focus-ring
  legibility spot check on `--surface-1` through `--surface-4` plus
  a gradient card surface; regenerate the contrast matrix; em dash
  grep on every touched doc.

This one group cascades the ratified system into every surface that
consumes tokens and cf- classes, which is most of the app: 228
consumer files inherit with zero edits, including the legacy v1
studio tree, the story-rooms chat tree, and the character-creation
modals.

### G2. Modal family kit

Files: `components/kit/modal-frame/`, `components/kit/picker-modal/`,
`components/kit/asset-detail-popup/` (and its nested
`components/kit/credits/` modal), `components/kit/dropdown/` (sheet
mode only), `components/kit/ingredient-picker/`,
`components/kit/save-ingredient-preset/`,
`components/ui/modal-shell/`,
`components/studio/create/npc-registry/modal-shell/` (wraps
KitModalFrame; verify inheritance, edit only if it overrides).

- Bottom-anchor content-height law under 700px (section C), blurred
  context strip above, unsaved-dismiss confirm routing, 44px floors.
- Panel surface to the lift gradient token; veil unchanged
  (`--scrim-strong` plus `--blur-panel`).
- Fade dividers (`--line-fade`, `.tight` variant in compact
  contexts), never edge-to-edge; two-button footers align to the
  fade line's ends (B8).
- Sort surface note (B2): the app has no desktop sort sheet today
  (sort is a KitDropdown popover, sheet only under 700px per
  2.16(d)); verify B2 is already satisfied on every sort surface and
  apply the centered-modal form wherever a desktop sheet is actually
  found. Mobile keeps the sheet.
- Contract bump flags: `KitModalFrame` and `ModalShell` (ui) bump
  minor only if a prop is added; behavior-only changes need no bump.
  READMEs record the ruling regardless.
- Verification: preview routes for each package at 390 and 1440,
  every fixture state, plus the stacked-picker-over-modal lock case.

### G3. Viewer family

Executed and landed (commits b2b4096, 3b2310d, bumps ruled 22 Aug
2026); this section is kept for its design record, it no longer
describes deferred or follow-on work.

Files: `components/kit/image-overlay/`,
`components/studio/media/media-lightbox/`,
`components/studio/media/media-tile-quick-actions/`.

- B7 viewer final: chromeless surface; veil at the `--chrome-wash`
  color with `--blur-panel` 2px; two-line glass header
  (`--panel-glass`), title centered, icon row delete, report,
  details, download, bookmark, like in quiet ink; close outside
  top-right on desktop, floating 44px glass control bottom-right at
  390; bottom bar Generate Variant, Reassign Asset, Share in
  `--gold-action` ink with `--gold-bright` hover, width-matched to
  the header; zoom/pan/reset per (r) unchanged.
- Delete routes through the B5 confirm recipe with type-aware copy
  and the CR-054 "[X] days" placeholder.
- Contract bumps: `image-overlay` and `media-lightbox` gain action
  callbacks (delete, report, details, download, generate-variant,
  reassign); real version bumps with fixtures in the same commits.
  Reassign Asset ships as an honest stub and files CR-055.
- This group substantially answers the standing OPEN item 28
  viewer-reconciliation hold (the parity list's single
  highest-leverage item); the parity echo is updated when it lands.

### G4. Character-creation modal family

Files: `components/studio/create/character/` modal packages (trait,
multi-trait, personality, hair, hair-eyes, eye-color, skin-tone,
kibbe-preset, character-color-palette, character-template-picker,
voice-module-picker) plus the look/story/world creator stops that
share the option-card grammar.

- Option-card fills: selected `--fill-whisper`, rest the new
  rest-fill token; trait modal no-footer and warm-selected form per
  B4; fade dividers per B1.
- Contract law watchpoint: presentation only; every option card keeps
  reporting the same selection to the same handler.

### G5. v2 pages and chat verification

Files: the nine v2 pages (`app/studio/v2/home|stories|adventures|
studio|images|vault|community|creators|lore`; four are packaged,
five are single-file `*V2Mockup.jsx`), `app/studio/v2/account/`,
`app/studio/v2/editor/` plus `editor/[id]/image-library`,
`app/studio/v2/creators/[handle]` and its connections sub-page,
chat C1-C5 packages (`components/studio/chat/*`) and
`app/studio/v2/stories/[id]`.

- Mostly verification renders at 390 and 1440 after G1/G2 cascade,
  plus cleanup of any local literal that fights a ratified token
  (the five mockup files are the likely offenders; they have no
  contract file, so contract law does not bind their internals, but
  the token-first directive does).
- Chat inherits through shared packages and the token cascade; no
  chat-specific redesign in this pass (the dedicated-sitting rule
  stands).
- A3 ring legibility check on every surface depth each page actually
  renders.

### G6. Mirrors

Files: `ds-bundle/tokens/theme.css`, `ds-bundle/tokens/
design-system.css`, `ds-bundle/tokens/token-bridge.css`,
`ds-bundle/_ds_bundle.css`, `.design-sync/` refs as needed.

- Regenerate, never hand-edit (the `_ds_needs_recompile` marker is
  the signal); confirm byte-identity of the token mirrors after
  regeneration.

### G7. Legacy surface verification

Files: none edited. v1 studio routes, the story-rooms tree, the
character-creation modals beyond G4's scope, and the public
marketing pages inherit the token cascade automatically.
Verification-only sweep: render, PASS or FLAG per the QA gate, no
per-file restyle. `app/globals.css` legacy variables stay under the
standing T4/T2 queue items, out of scope here.

### Contract-bump summary

| Package | Bump | Why |
|---|---|---|
| `components/kit/image-overlay` | YES | B7 action callbacks added |
| `components/studio/media/media-lightbox` | YES | B7 action set reconciled |
| `components/kit/modal-frame` | Only if a prop is added | A4 is behavior-first |
| `components/ui/modal-shell` | Only if a prop is added | Same |
| `components/kit/creation-card` | YES, 3.4.0 | Resolved by NEW LAW A (22 Aug 2026, BUILD-BLUEPRINT 2.16(aa)), superseding the F2 gate; Archive shipped as an honest disabled stub, CR-056 filed |

### Honesty rule: the cut line for today

G1, G2, and the G5 verification sweep are realistic for Sonnet today
and are what the Nick review needs: every page renders the ratified
token system and the modal family is conformant. G3 is a real rebuild
with contract bumps: it ships today only if G1 and G2 land clean
early; otherwise it is the first follow-on. G4, G6, and G7 follow
after the review. This is a scope cut, not a rigor cut: nothing in
G1, G2, or G5 is compressed to fit the day, and section E2 below
discloses exactly what Nick will see as still open.

## E2. PARITY STATUS FOR NICK REVIEW

Sourced from `docs/PARITY-ECHO-FULL.md` v1.1.0 and its ranked
remaining-parity list; not re-audited by this pass. Across the eight
echoed pages, 407 rows disposed: **285 Present, 29 Flagged, 93
Deliberately excluded (ruling cited).** Per-page detail lives in that
document. Lane markings follow FE-REVIEW-01: Crestfall-fe is Views,
Kit, tokens, fixtures, and page composition; chassis routes and
application logic remain in Crestfall.

**Present:** the full browse skeleton on all eight echoed pages, the
Creators profile-detail and connections pages, the Vault edit tree
(87 of its 97 held rows), the editor image-library, and the Images
composer at full parity.

**Flagged (29 rows), top remaining items by rank:**

- FE lane, small (ranked items 1 to 10): Adventures builder-open
  fixture and loading state; Stories "Start Room Soon", delete-error
  banner, "Open Latest Room"; Vault error-banner interpolation,
  mobile density toggle, Create New; Community popup error banner,
  media-grid pagination, media-tile lightbox wiring.
- Chassis/data lane: items 11, 12, 16, 20 and the standing data
  waits CR-033, CR-034, CR-035, CR-036, CR-037, CR-042 (server-side
  filter/sort/search is the true scale ceiling).
- Docs lane: items 13 and 14, the CSV inventory gaps for
  `/studio/v2/adventures` and the `/lore` route.
- Brian ruling: item 17, two Community sort options (Recently
  Updated, Most Used) and the type-facet value set flagged for veto.
- Highest leverage: item 21, viewer reconciliation (OPEN item 28),
  which this plan's G3 now substantially answers by design (B7);
  the build remains.
- Owed and disclosed: the Studio hub (`/studio/v2/studio`) has never
  had its own parity echo pass; that audit is still open.

**Deliberately excluded:** 93 rows, every one citing its ruling
(chat-room 45-row block, archive fold-at-go-live blocks, Sprint E
library disposition, OPEN item 28, and kin).

Propagation passes do not pick up parity items unless a ratified law
touches the same file.

## F. Items still needing a Brian ruling (held out of propagation)

1. **Light-theme values for every new visual token**: the panel lift
   gradient, creation-card gradient, option-card rest fill,
   `--panel-glass`, `--bed-deep`, `--grad-card` and `--grad-rail`,
   `--chrome-wash`, `--ink-typed`, `--fill-ghost`. Every Gate exhibit
   is dark-theme. Interim in G1: each new token declares the same
   value in both themes, explicitly marked interim in its
   DESIGN-TOKENS row, per the scrims-do-not-flip precedent; real
   light values need a render sitting.
2. **Creation-card ruling scope (B6)**: RESOLVED by NEW LAW A (22 Aug
   2026, BUILD-BLUEPRINT 2.16(aa)); this question is kept for its
   design record. The lighter gradient, on-card Save toggle, and
   glass kebab menu (Share, Archive, then Delete) apply to
   `KitCreationCard` app-wide, superseding card law 2.16(a) and (v)
   (exactly three overlay icons; share and delete live inside the
   open destination). Archive shipped as an honest disabled stub
   (CR-056 filed).
3. **Glass menu scope**: RESOLVED by the Final Ruling Render (GO 2B),
   landed in `docs/DESIGN-TOKENS.md:230` and `KitDropdown`; this
   question is kept for its design record. All menus and popovers
   app-wide moved from `--surface-4` plus `--shadow-popover` to
   `--panel-glass` with the 2px blur, not only the kebab menus the
   ruling demonstrated.

Standing open items restated for completeness, no action this pass:
the economy-fixture sub-item of CR-052; the tooltip component design
(CR-047, which also gates `--blur-glass` gaining its first consumer);
the soft-delete window number (CR-054, Nick); the captures still
wanted (quick-create step indicators, live viewer chrome, story
modals).
