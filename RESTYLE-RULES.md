# Restyle rules — extracted from the proof draft

Source: `~/dev/crestfall-main/Crestfall/design-system/proof/` (read-only reference, never written to). Canonical page-head recipe lives in `library.css` (`.pagehead`, `.pagehead h1`/`.h1like`, `.pagehead .lede`) and `proof.css` (`.eyebrow`, `.eyebrow--ruled`). `library.css` explicitly states this is the one shared recipe; older per-page copies (e.g. `studio.html`'s local `.pagehead` override) are earlier/retired duplicates and were not used as the source of truth.

Every value below already exists as a token in this repo's `app/theme.css` — nothing new was added.

## Page-head element rules

| Element | Property | Value | Token |
|---|---|---|---|
| Eyebrow | font family | inherited (Inter / `--font-sans`, no override) | — |
| Eyebrow | font size | 0.8125rem (13px) | `--text-eyebrow` (→ `--text-ui`) |
| Eyebrow | line height | 1.25rem (20px) | `--lh-eyebrow` (→ `--lh-ui`) |
| Eyebrow | font weight | 500 | `--weight-medium` |
| Eyebrow | letter spacing | .16em | `--track-eyebrow` |
| Eyebrow | text transform | uppercase | (literal, not tokenized) |
| Eyebrow | color | gold | `--gold-ornament` |
| Eyebrow rule mark | position | to the right of the text, `gap: var(--space-3)`, vertically centered via flex `align-items: center` | `--space-3` |
| Eyebrow rule mark | size | 1px tall, `var(--space-8)` (2rem/32px) wide | `--space-8` |
| Eyebrow rule mark | fill | solid gold at the text edge fading to transparent outward | `--grad-rule` |
| Title | font family | display face | `--font-display` (Cormorant Garamond) |
| Title | font size | 2.0625rem (33px) | `--text-title` |
| Title | line height | 2.5rem (40px) | `--lh-title` |
| Title | font weight | 500 | `--weight-medium` |
| Title | letter spacing | -.01em | `--track-tight` |
| Description (lede) | font family | inherited (Inter / `--font-sans`, no override) | — |
| Description (lede) | font size | 0.8125rem (13px) | `--text-ui` |
| Description (lede) | line height | 1.25rem (20px) | `--lh-ui` |
| Description (lede) | color | dim ink | `--ink-dim` |
| Description (lede) | max width | 44rem | (literal in the draft itself, not tokenized there) |

## Spacing between the three

- Eyebrow → title: `var(--space-2)` (0.5rem/8px) — from the title's top margin, mirroring the draft's `.titlerow` wrapper margin.
- Title → description: `var(--space-2)` (0.5rem/8px) — from the title's bottom margin, same source.
- Whole page-head block → following content: `var(--space-5)` (1.25rem/20px) in the draft's `.pagehead` (not applied here — this component's outer header framing, divider, and side-action layout are unchanged; only the eyebrow/title/description text and the eyebrow rule mark were touched, per task scope).

## Notes

- The eyebrow rule mark only renders when eyebrow text is present, sits to the right of the text (never left), and has no arrow or caret — matches the draft's "eyebrow law, ruled 2 Aug 2026."
- Legacy bridge variable names (`--muted-gold`, `--muted`) were replaced with their real design-system tokens (`--gold-ornament`, `--ink-dim`) directly in this pass, since that migration is the point of the per-package restyle sequence.
- No new hex value, font family, or token name was introduced. Every value above resolves through a token already defined in this repo's `app/theme.css`.

---

# Phase A extension — thirteen more element families

Additional sources consulted: `proof.css` (buttons, tags/badges, engagement stats, sidebar active state), `shell.css` (sidebar rail, topbar, dock, sheets, credits widget), `modal.css` (creator modal chrome), `picker.css` (bottom-sheet picker chrome). Every table below cites the exact source lines it was read from. Where the draft is silent or shows more than one competing recipe, the gap is logged under **OPEN** at the end of that family's section rather than resolved by guessing.

## Buttons

Source: `proof.css` `.btn` / `.btn--sm` / `.btn--lg` / `.btn--ghost` (lines 82–119); the one-off heavier ghost used in the session log, `.rowbtns .btn--ghost` (line 345).

| Element | Property | Value | Token |
|---|---|---|---|
| Primary (`.btn`) | layout | inline-flex, centered, `gap: var(--space-2)` | `--space-2` |
| Primary | height | `var(--control-md)` (44px) | `--control-md` |
| Primary | padding | `0 var(--space-6)` | `--space-6` |
| Primary | radius | `var(--radius-md)` | `--radius-md` |
| Primary | fill | solid `--gold-action` under a `--grad-gold` image (both declared, never shorthanded, so a variant can swap the image without wiping the color) | `--gold-action`, `--grad-gold` |
| Primary | text color | ink-on-gold | `--tag-fill-ink` |
| Primary | text | `--font-sans`, `--text-cta`/`--lh-cta`, weight `--weight-bold` | `--text-cta`, `--lh-cta`, `--weight-bold` |
| Primary | hover | `box-shadow: var(--glow-hover)`, `var(--dur-hover)`/`var(--ease-hover)` | `--glow-hover` |
| Small (`.btn--sm`) | height / padding / text | `--control-sm`, `0 var(--space-3)`, `--text-label`/`--lh-label` | `--control-sm`, `--space-3`, `--text-label` |
| Large (`.btn--lg`) | height / padding | `--control-lg`, `0 var(--space-8)` | `--control-lg`, `--space-8` |
| Ghost (`.btn--ghost`) | fill | transparent, no image | — |
| Ghost | text color | `--gold-action` | `--gold-action` |
| Ghost | border | `1px solid var(--line-strong)` | `--line-strong` |
| Ghost | hover | `border-color: var(--gold-action)`, `box-shadow: var(--glow-hover)` | `--gold-action`, `--glow-hover` |
| Ghost, heavy (`.rowbtns .btn--ghost`, session log only) | border | `2px solid var(--gold-action)` | `--gold-action` |

**OPEN:** no destructive/danger button variant exists anywhere in the draft CSS. Do not invent a red button — flag it back for a ruling before Phase B touches a delete/danger action.

## Badges

Source: `proof.css` `.tag` (121–176), `library.css` `.tag--canon` (217–221).

Badges are not a separate component. They are the `.tag` recipe — pill-shaped, uppercase, label-size — with an optional color-only modifier. The recipe is keyed to what's underneath (canvas vs. artwork), never to category: the label text already reads the category in words.

| Element | Property | Value | Token |
|---|---|---|---|
| Tag | shape | inline-flex, `height: var(--space-6)`, `padding: 0 var(--space-3)`, `border-radius: var(--radius-full)` (pill — tags are labels, not controls, so they skip the radius-12 controls rule) | `--space-6`, `--space-3`, `--radius-full` |
| Tag | text | `--text-label`/`--lh-label`, `--track-label`, uppercase, weight `--weight-medium` | `--text-label`, `--track-label`, `--weight-medium` |
| Tag, on canvas (default) | fill / border / text | `--tag-bed-canvas`, no border, `--gold-bright` | `--tag-bed-canvas`, `--gold-bright` |
| Tag, on artwork (inside `.pic`, `.cf-art`, `.herocard`) | fill / border / text | `--tag-bed-art`, `1px solid var(--line)`, `--ink` | `--tag-bed-art`, `--line`, `--ink` |
| Canon badge (`.tag--canon`) | text color only | `--gold-bright` (no fill/border change) | `--gold-bright` |
| Meta tag (`.tag--meta`) | material | `backdrop-filter: blur(4px)` — a legibility property, not a category signal | — |

**OPEN:** the draft only names one badge (Canon). Every other category hook "survives as a markup hook and carries no color" (proof.css:171–176) — if `CreationStatusBadges` needs distinct visual states (draft / published / pending review, etc.), that distinction isn't in the draft. Don't invent colors for those states; flag it back.

## Stat rows

Source: `proof.css` `.st` (415–421), reused at `library.css` `.crt p.st` (247–248).

| Element | Property | Value | Token |
|---|---|---|---|
| Row | layout | inline-flex, centered, `gap: 3px`, no wrap | (literal, not tokenized — see OPEN) |
| Icon | size | `12px × 12px`, `opacity: .85` | (literal, not tokenized — see OPEN) |
| Icon set | order | plays, hearts, saves, followers — same set and order on every surface, cards and profile alike | — |
| Count | numerals | `font-variant-numeric: tabular-nums` (same treatment used on `.fchip .n` and `.coins b`) | — |

**OPEN:** the row gap (`3px`) and icon size (`12px`) are literal pixel values that don't land on the 4px spacing scale or the 16/20/24 icon scale in `app/theme.css`. The nearest tokens would be `--space-1` (4px) and `--icon-sm` (16px), but the draft is explicit about `3px`/`12px`, so rounding up is a judgment call, not a trace — flag it back rather than silently rounding.

## Credits

Source: `shell.css` `.coins` (112–117, 283–284).

| Element | Property | Value | Token |
|---|---|---|---|
| Widget | position | `margin-top: auto` (pins to the bottom of the sidebar) | — |
| Widget | box | `background: var(--surface-2)`, `border-radius: var(--radius-md)`, `padding: var(--space-2) var(--space-3)` | `--surface-2`, `--radius-md`, `--space-2`, `--space-3` |
| Label (`p`) | text | `--text-label`/`--lh-label`, `--track-label`, uppercase, `--ink-faint` | `--text-label`, `--track-label`, `--ink-faint` |
| Amount (`b`) | text | `--font-display`, `--text-subhead`/`--lh-subhead`, `--gold-bright`, weight `--weight-medium`, tabular-nums | `--font-display`, `--text-subhead`, `--gold-bright`, `--weight-medium` |
| Top-up affordance | position | widget is `position: relative`; `.topup` sits `position: absolute; right: var(--space-3); top: 50%` (centered) | `--space-3` |

**OPEN:** this only covers the sidebar balance widget. The draft has no second recipe for a standalone "credits cost" chip (e.g. inside a create flow) — if `CreationCredits`/`StudioAccountCoins` need that, it isn't sourced here.

## Share controls

Source: `creator-profile.html` (line 136, markup only — no dedicated CSS class); `modal.css` (56–58, comment).

Share has no dedicated visual recipe in the draft. The one instance found reuses the button family outright: `<button class="btn btn--ghost btn--sm" id="shareBtn">Share</button>`. Modal chrome explicitly retired a favorite/save/share/archive row from in-progress creator footers — that ruling states those actions "belong on published and browse surfaces, not mid-creation," which is where the one styled instance lives (the public creator profile).

| Element | Property | Value | Token |
|---|---|---|---|
| Share button | recipe | `.btn--ghost.btn--sm` — see **Buttons** above, no override | (see Buttons) |

**OPEN:** no distinct visual treatment (e.g. icon-only) exists for share beyond "it's a small ghost button." Don't invent an icon-only recipe for `ProfileShareButton`/`CreationShareButton` — trace to the button family as-is.

## Tag and filter chips

Source: `library.css` `.fchip` family (59–76, 197–201, 314–353).

| Element | Property | Value | Token |
|---|---|---|---|
| Chip (`.fchip`) | box | `background: var(--surface-1)`, `border: 1px solid var(--line-whisper)`, `border-radius: var(--radius-md)` (control radius, not pill — chips are controls, tags are labels) | `--surface-1`, `--line-whisper`, `--radius-md` |
| Chip | sizing | `min-height: var(--control-sm)`, `padding: 0 var(--space-4)` | `--control-sm`, `--space-4` |
| Chip | text | `--text-ui`/`--lh-ui`, `--ink-dim` | `--text-ui`, `--ink-dim` |
| Chip | hover | `border-color: var(--line)`, `color: var(--ink)` | `--line`, `--ink` |
| Chip, selected (`.sel`) | state | `border-color: var(--gold-action)`, `color: var(--gold-bright)`, `box-shadow: inset 0 0 0 1px var(--gold-action)` | `--gold-action`, `--gold-bright` |
| Count badge (`.n`) | text | `--text-label`, `--ink-faint` (`--gold-ornament` when selected) | `--text-label`, `--ink-faint`, `--gold-ornament` |
| Disabled | state | `opacity: .45`, `cursor: default` | — |
| Sort variant (`.fchip--sort`) | fill | `background: var(--surface-2)`, `border-color: var(--line)` (filled bed so it reads apart from filter dropdowns) | `--surface-2`, `--line` |
| Select-toggle (`.fchip--selecttoggle`) | idle | `border-style: dashed`, `border-color: var(--line)` | `--line` |
| Select-toggle, armed (`.on`) | state | `background-image: var(--grad-gold)`, `color: var(--tag-fill-ink)`, solid transparent border | `--grad-gold`, `--tag-fill-ink` |
| Dropdown trigger (`.cbdrop > .fchip`) | expanded | `border-color: var(--gold-action)`, `color: var(--gold-bright)`; bold value text `--gold-bright` | `--gold-action`, `--gold-bright` |
| Touch floor | `(pointer: coarse)` | `min-height` bumps to `var(--control-md)` | `--control-md` |

**OPEN:** none — this family is fully specified.

## Cards

Source: `proof.css` `.cf-card` base (52–61) + art-bleed variants `.cf-card.adv` / `.cf-card.asset` (375–398); `library.css` `.crt` creator card (233–249) and `.lcard` library/wall card (83–137).

| Element | Property | Value | Token |
|---|---|---|---|
| Base card (`.cf-card`) | box | `background: var(--surface-2)`, `border: 1px solid var(--line)`, `border-radius: var(--radius-md)`, `padding: var(--space-3)` | `--surface-2`, `--line`, `--radius-md`, `--space-3` |
| Base card | depth | border only, no shadow — in-flow surfaces separate by border per the theme's elevation ruling | — |
| Art-bleed variant (`.cf-card.adv`, `.cf-card.asset`) | padding | `0` (picture reaches the card edge) | — |
| Art-bleed variant | seam | bottom fade `linear-gradient(to top, var(--canvas), transparent)` replaces a hairline where the picture meets the body | `--canvas` |
| Creator card (`.crt`) | box | flex row, `background: var(--surface-1)` (one step quieter than the base card surface), `border: 1px solid var(--line)`, `radius: var(--radius-md)`, `padding: var(--space-4)` | `--surface-1`, `--line`, `--radius-md`, `--space-4` |
| Creator card | avatar | `3rem` circle, `border: 1px solid var(--line-strong)` | `--line-strong` |
| Wall card (`.lcard`) | box | `border-radius: var(--radius-md)`, `aspect-ratio: 3/4` | `--radius-md` |
| Wall card | hover | `transform: translateY(-2px)`, `box-shadow: var(--glow-hover)` | `--glow-hover` |
| Wall card | focus | `var(--focus-ring)` | `--focus-ring` |
| Wall card | legibility | bottom-to-top veil gradient under card copy | — |

**OPEN:** several card sub-species exist (plain, art-bleed, creator, wall) with no single unified card token set. Phase B should match each component to its correct sub-species rather than applying one generic card recipe everywhere.

## Filter panels

Source: `library.css` `.filters`/`.cbar` container chrome (61–64, 300–336).

| Element | Property | Value | Token |
|---|---|---|---|
| Sticky bar (`.filters`, `.cbar`) | position | `position: sticky; top: calc(var(--control-md) + var(--space-6)); z-index: 30` | `--control-md`, `--space-6` |
| Sticky bar | bleed | `margin-inline: calc(var(--space-5) * -1)` so it runs full-width, `padding: var(--space-2) var(--space-5)` | `--space-5`, `--space-2` |
| Sticky bar | fill | `background: color-mix(in srgb, var(--canvas) 88%, transparent)`, `backdrop-filter: blur(12px)` | `--canvas` |
| Dropdown menu (`.cbmenu`) | box | `background: var(--surface-4)`, `border: 1px solid var(--line)`, `radius: var(--radius-md)`, `box-shadow: var(--shadow-popover)`, `padding: var(--space-2)` | `--surface-4`, `--line`, `--radius-md`, `--shadow-popover`, `--space-2` |
| Dropdown menu | sizing | `min-width: 13rem`, `max-height: 19rem`, scrolls | — |
| Menu row (`.cbmenu button`) | sizing | `min-height: var(--control-sm)`, `radius: var(--radius-sm)` | `--control-sm`, `--radius-sm` |
| Menu row | states | idle `--ink-dim`; hover `background: var(--fill-whisper)`, `color: var(--ink)`; selected `color: var(--gold-bright)` with a ✓ mark | `--ink-dim`, `--fill-whisper`, `--ink`, `--gold-bright` |
| Menu section label (`.cbmenu h5`) | text | `--text-label`/`--lh-label`, `--track-label`, uppercase, `--ink-faint` | `--text-label`, `--track-label`, `--ink-faint` |

**OPEN:** this is the desktop sticky-bar chrome only. The draft has no distinct bottom-sheet/drawer filter-panel shape for phones — it falls back to the generic `.picker`/`.sheet` chrome documented under **Modal chrome**. If `ResponsiveFilterPanel` needs a phone-specific panel, the draft doesn't specify one; flag it back rather than inventing one.

## Hub layouts

Source: `library.css` header comment and skeleton (1–10, 22–38, 78–153): "SPRINT 2 LIBRARY TEMPLATE — shared skeleton for the six library skins: adventures, sessions, arcs, my-vault, community, the-cast."

| Element | Property | Value | Token |
|---|---|---|---|
| Skeleton order | structure | page head → action row (`.librow`) → optional banner (`.continuecard`) → sticky filter bar (`.filters`/`.cbar`) → content grid (`.wall` or `.crtgrid`) → payoff banner (`.endcap`) → optional teaching strip (`.ladder`) | — |
| Action row (`.librow`) | layout | flex, `gap: var(--space-3)`, wrap, `margin-bottom: var(--space-5)` | `--space-3`, `--space-5` |
| Banner (`.continuecard`) | box | `border-radius: var(--radius-lg)`, `min-height: 16rem` | `--radius-lg` |
| Content grid (`.wall`) | layout | 2-column grid, `gap: var(--space-3)`, `margin-top: var(--space-5)` | `--space-3`, `--space-5` |
| Content grid (`.crtgrid`) | layout | 1 col → 2 col at 700px → 3 col at 1100px, `gap: var(--space-3)` | `--space-3` |
| Payoff banner (`.endcap`) | box | `border-radius: var(--radius-lg)`, `min-height: 20rem` | `--radius-lg` |
| Section head inside a hub (`.sechead`) | layout | flex, `align-items: flex-end`, `justify-content: space-between`; `h2` in `--font-display`/`--text-heading`; trailing link `--track-label` uppercase `--text-label` | `--font-display`, `--text-heading`, `--track-label`, `--text-label` |

**OPEN:** this is the six-page *library/browse* template. Dashboard-style hubs (`studio-home.html`) compose a different set of primitives (`.hero`, `.craftdoors`, `.shelf`/`.poster`, `.vista`, `.ladder--steps`) that are not part of this template. If a Crestfall-fe "hub" component is a dashboard rather than a browse/library page, it should trace to those blocks instead — check which shape a given hub actually is before applying this table.

## Modal chrome

Source: `modal.css` `.cmodal` family (1–54). Two sibling floating chromes exist and are **not** the same recipe: `picker.css` `.picker` (bottom sheet) and `shell.css` `.sheet` (slide-up drawer, documented under Mobile/Sidebar nav sources).

| Element | Property | Value | Token |
|---|---|---|---|
| Dialog (`.cmodal`) | position | fixed, centered via `left/top: 50%` + `translate(-50%,-50%)` | — |
| Dialog | sizing | `width: min(46rem, calc(100vw - 2*var(--space-3)))` (`2*var(--space-8)` at ≥700px); `height: min(44rem, calc(100dvh - 2*var(--space-3)))` | `--space-3`, `--space-8` |
| Dialog | fill | `color-mix(in srgb, var(--surface-2) 88%, var(--canvas))` plus a `--fill-whisper` wash | `--surface-2`, `--canvas`, `--fill-whisper` |
| Dialog | frame | `border: 1px solid var(--line)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-modal)` | `--line`, `--radius-lg`, `--shadow-modal` |
| Scrim (`.cmveil`) | fill | `background: var(--scrim-strong)`, `backdrop-filter: blur(2px)` | `--scrim-strong` |
| Head (`.cmhead`) | layout | flex, `gap: var(--space-3)`, `padding: var(--space-3) var(--space-4)` | `--space-3`, `--space-4` |
| Head | divider | inset hairline (never full-width), inset at `var(--space-6)`, color `--line-whisper` | `--space-6`, `--line-whisper` |
| Head close button | box | circular `--iconbtn`: `var(--control-md)`, `radius-full`, `--surface-2` fill, `1px solid var(--line-whisper)` border | `--control-md`, `--radius-full`, `--surface-2`, `--line-whisper` |
| Step indicator (`.cmsteps .snode`) | box | `2rem` circle | — |
| Step indicator | states | done: fills `--grad-gold`; current: border `--gold-action`, color `--gold-bright`; seen: border/color `--gold-ornament` | `--grad-gold`, `--gold-action`, `--gold-bright`, `--gold-ornament` |
| Body (`.cmbody`) | scroll | `overflow-y: auto` | — |
| Body eyebrow | spacing only | `margin-bottom: var(--space-1)` (no color override — modal surfaces aren't artwork) | `--space-1` |

**OPEN:** three distinct floating-chrome recipes exist in the draft — centered dialog (`.cmodal`), bottom-sheet picker (`.picker`), slide-up account sheet (`.sheet`) — and they are not unified into one. Confirm which one each Crestfall-fe modal (`CrestfallOptionModal`, `WeatherModuleConfigModal`, `MultiTraitModal`, `TraitModal`) is meant to match before converting — don't assume `.cmodal` covers all of them.

## Sidebar nav

Source: `shell.css` `.rail` family (22–63, 79–126); active-state override at `proof.css` (241–245, 357).

| Element | Property | Value | Token |
|---|---|---|---|
| Rail (`.rail`) | box | flex column, `background: var(--surface-1)`, `border-right: 1px solid var(--line-whisper)`, `padding: var(--space-4)`, `gap: var(--space-3)` | `--surface-1`, `--line-whisper`, `--space-4`, `--space-3` |
| Rail, below 1000px | behavior | off-canvas drawer: fixed, `width: min(20rem, 86vw)`, `transform: translateX(-100%)` closed; `.open` slides in with `box-shadow: var(--shadow-modal)` | `--shadow-modal` |
| Rail, at/above 1000px | behavior | static sticky column, no transform, no shadow | — |
| Brand row (`.brand`) | layout | flex, `gap: var(--space-2)`; sigil `2.5rem` circle, `border: 1px solid var(--line-strong)`; wordmark `--font-display`, first letter enlarged `1.45em` | `--space-2`, `--line-strong`, `--font-display` |
| Nav group label (`.navgroup h2`) | text | `--text-label`/`--lh-label`, `--track-label`, uppercase | `--text-label`, `--track-label` |
| Nav link (`.navgroup a`) | layout | flex row, `gap: var(--space-3)`; icon `--icon-sm` at `.85` opacity | `--space-3`, `--icon-sm` |
| Nav link | hover | `background: var(--surface-2)`, `color: var(--ink)` | `--surface-2`, `--ink` |
| Nav link, active (`[aria-current]`) | state | `background-image: var(--grad-nav-active)`, `color: var(--gold-bright)`, `box-shadow: inset 2px 0 0 var(--gold-action)` (a left accent bar, not a border); the same rule holds on hover of the active item | `--grad-nav-active`, `--gold-bright`, `--gold-action` |
| Profile row (`.you`) | layout | flex, `gap: var(--space-2)`, `min-height: var(--control-md)`; avatar `2rem` circle | `--space-2`, `--control-md` |

**OPEN:** none — well specified.

## Mobile nav

Source: `shell.css` `.dock` (154–166).

| Element | Property | Value | Token |
|---|---|---|---|
| Bar (`.dock`) | position | fixed to viewport bottom, `display: grid`, 5 equal columns, `gap: var(--space-1)` | `--space-1` |
| Bar | fill | `color-mix(in srgb, var(--canvas) 88%, transparent)`, `backdrop-filter: blur(12px)`, `border-top: 1px solid var(--line-whisper)` | `--canvas`, `--line-whisper` |
| Bar | visibility | hidden entirely at ≥1000px — desktop uses the sidebar instead, never both at once | — |
| Tab (`.dock a`) | layout | column flex centered, `gap: var(--space-1)`, `min-height: var(--control-md)`, `radius: var(--radius-sm)` | `--space-1`, `--control-md`, `--radius-sm` |
| Tab | text | `--text-label`/`--lh-label`, idle color `--ink-faint` | `--text-label`, `--ink-faint` |
| Tab, active (`[aria-current]`) | state | `color: var(--gold-bright)` only — no background fill, no accent bar (unlike the sidebar's active state) | `--gold-bright` |

**OPEN:** none.

## Eyebrow rule mark, outside the page head

Source: canonical recipe `proof.css` `.eyebrow`/`.eyebrow--ruled` (188–205, same recipe already documented at the top of this file); color-override sites: `library.css` (51, 164), `browse.html` (87), `create-hub.html` (81), `studio-home.html` (51, 164); spacing-only override: `modal.css` (102, `.cmbody .eyebrow`).

| Element | Property | Value | Token |
|---|---|---|---|
| Eyebrow, everywhere | recipe | identical to the page-head recipe documented above — proof.css owns "the one eyebrow recipe" and no page redeclares size, tracking, weight, or the ruled mark | (see Page-head element rules) |
| Eyebrow, inside a `.body` over artwork (continue cards, endcaps, doors, hero, vista) | color only | `--gold-ornament` → `--art-gold` — the ornament gold doesn't hold contrast over a photo the way the art-constant gold does | `--art-gold` |
| Eyebrow, inside modal body copy (`.cmbody .eyebrow`) | spacing only | `margin-bottom: var(--space-1)`, no color change — modal surfaces aren't artwork, so the default `--gold-ornament` stands | `--space-1` |

**OPEN:** none — the rule and its one exception (artwork vs. non-artwork background) are consistent everywhere the eyebrow appears.
