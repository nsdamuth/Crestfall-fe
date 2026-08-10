# Mockup decisions register

Written 9 Aug 2026 on branch `design/kit-revision`. Every surface in
`docs/_legacy-reference/` was read this session (five read-only
extraction passes covering: browse, community, my-vault; creators,
creator-profile, following, image-studio; home, studio-home, lore,
lore-article, adventures, sessions; chat, guest-chat, the-cast,
modal.css, picker.css; proof.css, shell.css, create-hub,
create-character, studio, codex, arcs, account, feedback-updates,
terms-policies, and the two baseline files). This file is the ruling
register: every reusable pattern found, marked ADOPT, ADAPT, or SKIP,
each with one line of reasoning against the current token system
(`docs/DESIGN-TOKENS.md`, `app/theme.css`).

Vocabulary: ADOPT means the structure carries as found, re-expressed
in current tokens. ADAPT means the structure carries with a named
change. SKIP means it does not carry, with the reason. Raw literals
are never copied in any verdict; a legacy value is cited only as
evidence.

Archive caveats that apply to every entry: the proof's JS files
(`shell.js`, `cbar.js`, `modal.js`, `picker.js`) are absent, so
behavior is reconstructed from CSS, ARIA, and inline scripts; the
proof's token files disagree with each other in places (button
radius, glow strength, focus-ring gold), and `app/theme.css` in THIS
repo is the only value authority.

## Card treatments

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| `.lcard` image-first card: 3/4 art edge to edge, bottom fade, title/meta over art, hover lift + 1.04 image scale | library.css:83-110 | ADOPT | Already ratified as the 2.6 base template; the raw `rgba(6,5,4,...)` fade converts to a `--canvas`-to-transparent composition |
| Actions absent from browse/community card faces; one overlay icon (edit pen) on vault cards only; full action set inside the preview modal | my-vault.html:38-44, 374-387 | ADOPT | This is the ruled no-bottom-action-bar law: small overlay icons on the face, everything wordy inside the destination |
| Bottom action bar on cards | none found in any proof file | ADOPT (its absence) | The legacy never had one; the kit-batch card's bottom bar was our invention and is now removed |
| Per-type card variants (story, character, asset, place, outfit, lore) differing only in tag word and meta line | browse.html:155-209, community.html:148-247 | ADOPT | One template, content varies by fields, matching the 2.6 one-base-template rule |
| Sessions deepened scrim + italic snippet chip for text-heavy cards | sessions.html:43-54 | SKIP for Community | Community cards are art-first; a per-page scrim variant would fork the template without a ruling |
| `.lcard.ph` flower-of-life placeholder card on `--surface-1` | library.css:112-123 | ADAPT | No-image fallback keeps the flat quiet bed; the sigil art asset is not shipped, so the words "No image" stand in until Brian rules an emblem |
| `.shot` bare image tile, no chrome at all | image-studio.html:53-60 | ADOPT | Confirms the image asset kind needs no title furniture; the Community grid still uses the full template for mixed content |
| Gold-ring picked state + gradient check badge for bulk select | library.css:386-393 | SKIP this pass | Bulk selection is a Vault concern; logged for the Vault page build, nothing in Community needs it |
| Corner-arrow hover affordance with sheen sweep | library.css:355-368 | SKIP | Markup never shipped it in the proof; the whole card is already the click target, a second affordance adds noise |
| Card `data-facets` / numeric sort keys self-declared on markup | creators.html:142 | SKIP | Fixture filtering lives in page state; real filtering is a ViewModel concern, never card markup |

## The filter line

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| One-line sticky control bar: search, filter dropdowns, sort, end cluster; canvas 88% mix + 12px blur; full-bleed margin trick | library.css:290-353 | ADOPT | This is the ruled filter-line law; blur re-expressed as `--blur-chrome`, tint composed from `--canvas` |
| "Every category is a dropdown on one line", loose chip rows retired | library.css:314-317 (Sprint 6.1 note) | ADOPT | The legacy ruled exactly what manifest item 4b rules; chips survive only inside dropdown panels as rows |
| Trigger grammar: category label + gold value + caret, never a middot | library.css:318-322 | ADOPT | Reads the selection without opening; gold value maps to `--gold-bright` |
| Multi-select trigger shows a selection count | manifest 4b; legacy carried counts on rows only | ADAPT | The count moves onto the trigger for multi-selects (new law); single-selects keep the legacy gold-value grammar |
| Sort trigger differentiated by a filled `--surface-2` bed | library.css:322 | SKIP | With every filter now a branded dropdown, a per-control bed variant re-introduces a second chrome recipe for no information gain |
| In-page search field distinct from topbar global search | community.html:79 vs :95 | ADOPT | Matches the product model: global search (3.2) and local filter bar (3.1) are separate organs |
| Search at `--control-sm` height in the bar | library.css:304-307 | ADAPT | Kit search keeps `--control-md`: the touch floor is law and the bar has the room |
| Coarse-pointer bumps: search text to `--text-body` (iOS zoom guard), rows to `--control-md` | library.css:419-427 | ADOPT | Both are accessibility floors the current system already mandates |
| Mobile search treatment: legacy wraps the flex row | library.css:300-303 | ADAPT | Ruled this pass: at 390 search takes its own full-width row inside the sticky block; a deliberate row beats accidental wrapping, and the always-visible field beats icon-expand for the highest-frequency control |
| Disabled chip honesty state (`opacity:.45`, no hover) | library.css:197-201 | ADOPT | Maps to the ruled Soon treatment on dropdown rows; a filter the backend cannot answer reads disabled, never pretends |

## Dropdown styling

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| Panel: `--surface-4`, 1px line, radius-md, popover shadow, `--space-2` pad, min 13rem, max 19rem scroll, opens below trigger | library.css:333-337 | ADOPT | Byte-identical to the blueprint 2.9 menu recipe; every value already has a token |
| Row: 32px min (44 coarse), radius-sm, ink-dim, hover fill-whisper, selected gold-bright | library.css:341-347 | ADOPT | Matches 2.9 verbatim |
| Selected mark: trailing gold check | library.css:347 | ADAPT | Check moves to a leading slot: filter rows now carry trailing counts and the two would collide |
| Group heading `h5` uppercase ink-faint rows | library.css:338-340 | ADOPT | Straight token mapping; used when a facet groups (the rating tiers do not need it yet) |
| Phone: filter panels dock to the bottom edge | RESTYLE-RULES Ruling 7; chat.html:200-218 (cmdpop sheet transform) | ADOPT | The dropdown package renders a bottom-docked sheet under 700px with `--scrim-strong` + `--blur-panel`, popover above 700px |
| Menus positioned via JS `getBoundingClientRect` appended to body | chat.html:1055-1066 | SKIP | The kit dropdown is anchored inside its own relative wrapper; escaping stacking contexts is not needed on the filter line |
| `cbar:change` custom event contract | lore.html:277 | SKIP | React callbacks replace DOM events; the semantic callback shape already exists on the contract |

## Popup modals and overlays

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| One veil recipe everywhere: `--scrim-strong` + 2px blur, veil is a button with aria-label | modal.css:15-17 and four copies | ADOPT | Already law (`--blur-panel` pairing); the veil-as-button detail carries into the dropdown sheet veil |
| Bottom sheet under 700px, centered panel above | shell.css:177-185, picker.css:14-22 | ADOPT | This is the modal law the dropdown sheets and the future modal-frame both follow |
| Image preview: gold hairline frame hugging the image, no letterbox, actions as circles beneath, tooltip labels | modal.css:355-393 | ADAPT later | Logged for the batch-2 image-overlay conversion; the interim KitImageOverlay stays as built this batch |
| Preview action set = the actions removed from card faces | my-vault.html:428-434 | ADOPT | Confirms the destination-carries-the-actions law; share/download/delete live in the open destination |
| Per-layer scroll locks (`cm-locked`, `pk-locked`, `pv-locked`) | proof.css:433-439 | ADOPT later | Belongs to the modal-frame build (2.5), noted so it is not lost |
| Step-node progress rail in modal header | modal.css:60-76 | SKIP this pass | Creator-modal concern (T12 queue); nothing in the Community scope opens a stepped modal |
| No-selects law: creators use tiles/chips/swatches, never a dropdown | modal.css:118-119 | ADOPT (scope note) | Dropdowns are a filter-surface organ; creation flows keep visual selection |

## Banner treatments

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| Uniform `--scrim-strong` screen on every banner-scale surface, never a bottom fade on banners | proof.css:423-431, library.css:12-20 | ADOPT | Already law via the promo-banner `bottom` treatment; card fades stay a separate card-tier device |
| Endcap copy formula: ruled gold eyebrow, display headline with a period, one dim line max 30rem, exactly one CTA | library.css:155-168 | ADOPT | This is the 4f hierarchy law found already ruled in the proof; spacing re-lands on the ladder |
| One decision per hero: primary CTA plus a quietlink, never two buttons | studio-home.html:24-27, 256-259 | ADOPT | Sharpest form of one-primary-CTA-emphasized; the banner contract stays single-CTA |
| Description de-emphasis: `--art-ink-dim`, measure-capped | home.html:161-175, library.css:166 | ADOPT | Direct token mapping (`--art-ink-dim`, max-width on the line) |
| Galaxy top banner: `--atm-constellation` starfield, drift + twinkle, layered between art and veil | proof.css:247-254, home.html:60-73 | ADOPT | The mechanism already lives in this repo as `.cf-galaxy` with `--anim-galaxy`/`--anim-twinkle` and reduced-motion kill; the top treatment gains an opt-in galaxy layer |
| Canvas particle constellation with linking lines | studio-home.html:395-439, baseline v5 | SKIP | A JS canvas dependency for an ambient effect the CSS token layer already delivers; not worth the runtime |
| Hero sheen sweep on hover | studio-home.html:38-45 | SKIP | Decorative motion outside the sanctioned gradient jobs; nothing in the current law asks for it |
| Ruled eyebrow: gold caps, one rule to the right, never line-left | proof.css:188-205 | ADOPT | Already the system's eyebrow; banners recolor it `--art-gold` over art |
| Continue card (treatment b) centered copy | library.css:40-57 | ADOPT | Already shipped in KitPromoBanner; the proof confirms the centered ruling |

## Lore list treatment

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| Lore entries are written records: row cards, two-up at 900px, text left, 4/5 thumb right | lore.html:34-77 | ADOPT for the Lore page | The ruled row species for text-first content; logged now, built when Lore (build order #9) lands |
| Row anatomy: source tag, display title, italic subtitle, era-date-realm meta, 2-line clamped summary, ref pills, by-line + read link | lore.html:159-169 | ADOPT for Lore | Field-for-field aligned with the lore document contract; nothing to invent |
| Visibility and approval states never on entry faces, only in filters | lore.html:29, 296 | ADAPT | Carried, amended by the 4c tag economy: visibility badges may appear in own-work contexts; approval still lives in filters |
| Parchment reading view via scoped `data-theme="light"` island | lore-article.html:54-63 | ADOPT for Lore | Every value resolves from existing theme tokens; a genuinely clever zero-new-value mechanism |
| 13-block authoring set (text, quote, stat block, dividers, two-col) | lore-article.html:119-193 | ADOPT for Lore | Logged for the Lore build; out of Community scope |

## Chat-view patterns worth carrying

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| Typeset stream, not bubbles: four voices (quiet narration, italic gold action, small-caps speaker dialogue, whisper-bed player turn) | chat.html:94-149 | ADOPT for the chat sitting | The strongest identity pattern in the proof; chat has its own dedicated sitting, logged so it survives |
| Locked-viewport chat frame: only the stream scrolls, composer in flow | chat.html:65-67, 172-178 | ADOPT for chat | The later ruling (vs guest-chat's sticky blur); prevents content under the composer |
| Mode chips driving placeholder + syntax auto-detect | chat.html:293-303, 892-914 | ADOPT for chat | Selection-on-aria-pressed is the correct control idiom |
| Turn divider with outward-fading rules | chat.html:107-113 | ADOPT for chat | Composes `--grad-rule-soft`; the scaleX(-1) mirror detail is the fix worth keeping |
| Off-record dashed cards (Note, Direct) | chat.html:138-149 | ADOPT for chat | Dashed = not-the-record is a system-wide signal worth formalizing |
| Per-message hover actions, 45% opacity at coarse pointers | chat.html:425-435 | ADAPT for chat | The touch fallback idea carries, but overlay actions in the new kit are fully visible at coarse pointers (mobile law: comfortable, not half-hidden) |
| Palette role variables per conversation | chat.html:115-122, 749-790 | ADOPT the mechanism for chat | Semantic role tokens overridable per conversation; the 13 hex sets stay data, never tokens |
| Cast row with initial-letter gold avatar; selectable next-responder row with reserved check space | chat.html:220-234, 358-363 | ADOPT for chat | The npick row is the cleanest single-select list row in the proof |

## Chrome, states, and cross-cutting

| Pattern | Witness | Verdict | Reasoning |
|---|---|---|---|
| Focus ring outside the whole control, gold border change as secondary cue | proof.css:46-50, 362-371 | ADOPT | This is the 4e focus law; the kit search suppresses the inner ring and lifts `--focus-ring` to the control border via focus-within |
| Empty state: dashed `--line-strong`, radius-lg, diagnosis + recovery copy, ghost CTA | library.css:143-153 | ADOPT | Already close to the built one; dashed border and the "Nothing matches / clear filters" copy carry |
| Explicit `[hidden]{display:none}` beside any authored display | library.css:152-153 and five copies | ADOPT | A real UA-cascade gotcha; carried into every kit component using flex/grid roots |
| Shimmer loading (100deg, 250%, 1.1s recipe) | library.css:374-379 | ADAPT | The loading grid keeps the current pulse placeholder this pass; unifying on one shimmer primitive is logged, not silently shipped |
| Load-more centered button; infinite lazy-load | library.css:253 vs 370-382 | ADOPT load-more | The product model rules load-more (3.4); the legacy infinite scroll is overruled by the newer product model |
| Stat atom: one icon set, one order (plays, hearts, saves, followers), tabular numerals | proof.css:415-421 | ADOPT | Already Ruling 4; the kit card and creator card both follow it |
| Tag recipes keyed to background, never category; Canon gold text only | proof.css:121-176, library.css:217-221 | ADOPT | Already law (badge 2.10); the 4c tag economy adds WHEN a badge may appear at all |
| No rating badge on card faces, ratings live in filters | community.html:92-93 | ADOPT | Exactly the 4c economy: never a badge restating a filter |
| Buttons never pills; pill reserved for tags and icon buttons | proof.css:82-119, corners ruling | ADOPT | Already law; the proof's own `--radius-pill` button variant is the superseded copy |
| Soon tag + disabled honesty on unbuilt things | library.css:197-207, create-hub:172-173 | ADOPT | Matches the Views-never-fake-state law; the Teen rating stub uses exactly this |
| Redirect-stub convention for retired pages | following.html:1, the-cast.html:1 | ADOPT later | The strangler cutover (route law 3.3) will want exactly this shape |
| Icon law: lucide-shaped strokes at 16/20/24, currentColor, sprite-or-component | proof.css:259-271 | ADOPT | The kit uses lucide-react at the same three sizes; functional marks never bare glyphs |
| Review-mode annotation harness | studio.html:323-448 | SKIP | Prototype tooling, not product UI |
| Two-panel sticky composer layouts, node relocation on breakpoint | image-studio.html:128-151 | SKIP this pass | Images-page concern; logged for that build |

## Placement questions shipped for Brian's pick

Two grid-card overlay-action placements are genuinely credible and
both ship side by side in fixtures (KitCreationCard
`actionPlacement`):

1. **overlay-top**: icons top-right over the art, clear of the title
   block, always visible on touch.
2. **scrim-row**: icons bottom-right inside the scrim band, beside
   the title, one visual zone for everything the card says.

The legacy witness (my-vault edit pen, bottom-right overlay) supports
scrim-row; the live MediaTileQuickActions practice supports
overlay-top. Not decided here; both render in the preview and on the
mirror page.
