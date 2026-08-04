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

---

# Phase A addendum — eight rulings from review

These close eight items the extension above left under **OPEN**. Each is a ruling made for this repo, not always a literal draft trace — where a ruling extends past what the draft shows, that's called out. Nothing below is applied to any package yet.

## Ruling 1 — Modal chrome: one unified frame

Source basis: `picker.css` `.pkveil`/`.picker` (10–22) and `shell.css` `.sheetveil`/`.sheet` (174–182) already share one identical frame — the divergence was only `.cmodal` (`modal.css` 15–38), which used a different fill and never docked to the bottom edge on phone. This ruling extends the `.picker`/`.sheet` frame to `.cmodal` too, so every floating surface (creator panel, picker, sheet) becomes one frame with different contents inside.

| Element | Property | Value | Token |
|---|---|---|---|
| Scrim (all three) | fill | `background: var(--scrim-strong)`, `backdrop-filter: blur(2px)` — already identical across `.cmveil`/`.pkveil`/`.sheetveil`, unchanged | `--scrim-strong` |
| Frame, phone width | dock | fixed to the bottom edge: `left: 0; right: 0; bottom: 0` | — |
| Frame, phone width | shape | `border-radius: var(--radius-lg) var(--radius-lg) 0 0` (top corners only) | `--radius-lg` |
| Frame, phone width | border | `1px solid var(--line)`, `border-bottom: 0` | `--line` |
| Frame, ≥700px | shape | centers: `top/left: 50%`, `translate(-50%,-50%)`, full `border-radius: var(--radius-lg)` on all corners, border restored on all four edges | `--radius-lg`, `--line` |
| Frame | fill | `background: var(--surface-4)` — this is the one change from `.cmodal`'s old recipe (a `--surface-2`/`--canvas` color-mix plus a `--fill-whisper` wash); it now matches `.picker`/`.sheet` exactly | `--surface-4` |
| Frame | shadow | `box-shadow: var(--shadow-modal)` | `--shadow-modal` |
| Close control | position | top-right of the header, `margin-left: auto` — already consistent across all three | — |
| Close control | shape | circular `--iconbtn`: `var(--control-md)`, `radius-full`, `--surface-2` fill, `1px solid var(--line-whisper)` border | `--control-md`, `--radius-full`, `--surface-2`, `--line-whisper` |
| Close behavior | interaction | X, scrim click, and Escape all close in place; work is kept, never a navigation | — |
| Scroll lock | behavior | each layer locks independently (`body.cm-locked` / `.pk-locked` / `.pv-locked`, one class per layer) so closing an inner picker over an open modal can't unlock the modal's own hold — keep the per-layer classes, don't collapse them into one | — |
| Contents | — | unchanged — the stepper, search field, tile grid, form fields, etc. inside each surface stay exactly what they were; only the frame around them unifies | — |

**Width/height stay per-surface**, not unified — the modal's near-square `min(46rem, …)` sizing and the picker's narrower `min(42rem, …)` sizing serve different content and aren't part of what this ruling asks to unify.

## Ruling 2 — Danger button: new destructive variant (token proposed, not applied)

Geometry is identical to the standard `.btn` documented above — same height, padding, radius, gap, type scale. Only the fill and text color change.

**Superseded 3 Aug 2026:** this ruling originally proposed a standalone `--red-action: #b8503c` token. When the status color set was minted (below), the danger button was folded into it — `--status-danger` is now the one and only red in the system, covering both the destructive button and the danger status state. `--red-action` never shipped to any token file and is retired; nothing referenced it.

| Element | Property | Value | Token |
|---|---|---|---|
| Danger button | geometry | identical to `.btn` — height `--control-md`, padding `0 var(--space-6)`, radius `--radius-md`, `--font-sans`, `--text-cta`/`--lh-cta`, weight `--weight-bold` | (see Buttons) |
| Danger button | fill | `--status-danger` | `--status-danger` |
| Danger button | text color | `--ink` (light text — `--status-danger` is a mid-value red, it doesn't hold dark text the way bright gold does) | `--ink` |
| Danger button, hover | | `box-shadow: var(--glow-hover)` — reuse the existing hover glow token, no new red glow | `--glow-hover` |

Still **not applied anywhere** — no package in this repo uses it yet.

**Not applied anywhere.** No package in this sweep uses it.

## Ruling 3 — Badges: Canon stays special, status badges go neutral

Source basis: `library.css` `.tag--canon,.lcard .tag--canon{color:var(--gold-bright)}` (217–221) — the *second* selector in that rule is the real point: over artwork, the base art recipe already recolors every tag to plain `--ink` (Recipe 1), and Canon is the one modifier that overrides back to `--gold-bright` so it keeps its gold read even on a photo. That's what "the only special one" means in the draft — Canon is the sole badge with an art-context override at all. This ruling extends that same two-recipe system with a second, deliberately quiet modifier for Private/Internal/Public, rather than inventing new shapes.

| Element | Property | Value | Token |
|---|---|---|---|
| Canon badge (`.tag--canon`) | unchanged | gold text everywhere, including the art-context override that beats Recipe 1's plain ink | `--gold-bright` |
| Status badge (new modifier, e.g. `.tag--status`, covers Private/Internal/Public alike) | shape | same `.tag` pill base — no shape change | (see Badges) |
| Status badge, on canvas | text color | `--ink-dim` (replaces the base recipe's `--gold-bright` — this is the one override the modifier makes) | `--ink-dim` |
| Status badge, on artwork | text color | no override needed — Recipe 1's default `--ink` is already neutral, so the art context needs nothing extra (unlike Canon, which needs the extra rule to stay gold) | `--ink` (inherited) |
| Status label text | — | Private / Internal / Public are distinguished by their word, never by color — same "no color-only meaning" principle the draft already applies to every other tag category | — |

## Ruling 4 — Stat rows: literal values rounded to the token scale

Source basis: `proof.css` `.st` (415–421), documented above as off-scale.

| Literal value | Rounds to | Token | Why |
|---|---|---|---|
| `gap: 3px` | `4px` | `--space-1` | nearest step on the 4px spacing scale; there is no 3px step to preserve |
| icon `12px × 12px` | `16px × 16px` | `--icon-sm` | smallest step on the icon scale (16/20/24); there is no smaller icon token |

Everything else in `.st` (inline-flex layout, `.85` icon opacity, tabular-nums, the fixed plays/hearts/saves/followers order) is unchanged from the family table above.

## Ruling 5 — Credits: the existing per-render cost line is the recipe (no chip invented)

Source: `image-studio.html` — CSS at lines 112–125 (`.tipdot`, `.wallet`, `.wallet .costline`, `.wallet p`, `.wallet b`), markup at line 242. This is a different recipe from the sidebar `.coins` balance widget documented earlier — that one is the persistent nav-rail balance; this one is the per-action cost readout that sits under a primary generate/create button.

| Element | Property | Value | Token |
|---|---|---|---|
| Wallet row (`.wallet`) | layout | flex, `justify-content: space-between`, `align-items: baseline`, `gap: var(--space-3)` | `--space-3` |
| Wallet row | placement | `margin-top: var(--space-4)`, `border-top: 1px solid var(--line-whisper)`, `padding-top: var(--space-3)` — sits directly below the primary button | `--space-4`, `--line-whisper`, `--space-3` |
| Cost line label (`.wallet p`, small-caps "Coins") | text | `--text-label`/`--lh-label`, `--track-label`, uppercase, `--ink-faint` | `--text-label`, `--track-label`, `--ink-faint` |
| Cost line (`.wallet .costline`) | position | `margin-right: auto` — sits at the left, balance sits at the right | — |
| Info icon (`.tipdot`) | shape | inline, `cursor: help`, `color: var(--gold-ornament)`, `font-size: var(--text-label)`, no fixed height (`min-height: auto`) | `--gold-ornament`, `--text-label` |
| Info icon | tooltip | uses the same `[data-tip]::after` tooltip mechanism as the rest of the app, anchored right (`left: auto; right: 0`) so it doesn't clip against the panel's right edge | — |
| Balance (`.wallet b`) | text | `--font-display`, `--text-lead`, `--gold-bright`, weight `--weight-medium`, tabular-nums, right-aligned (default flex end since `.costline` takes the margin-right:auto seat) | `--font-display`, `--text-lead`, `--gold-bright`, `--weight-medium` |
| Related, inside the button itself | | the CTA's own label can carry a cost suffix (e.g. "Generate · 5 coins"), styled `.btn .cost { font-weight: var(--weight-medium); opacity: .75 }` — a button-copy detail, not part of the wallet recipe, kept separate | `--weight-medium` |

## Ruling 6 — Share controls: icon plus the word "Share", never icon-only

Extends the Share controls family above (which already found the one styled instance is `.btn.btn--ghost.btn--sm` with a Share icon *and* the word "Share"). This ruling makes that a hard requirement rather than an incidental fact: every share control, at every density (including any "compact" mode), must render the Share2 icon **and** the label text "Share" together. No icon-only share affordance, on any surface, at any width.

## Ruling 7 — Filter panels on phone: dock to the bottom edge

Reuses Ruling 1 exactly. At phone width, a filter panel that needs to expand past the sticky chip bar (the `.cbmenu` dropdown, or any phone-only filter surface) docks to the bottom edge using the same unified frame as modal chrome: `border-radius: var(--radius-lg) var(--radius-lg) 0 0`, `border: 1px solid var(--line)` with no bottom border, `background: var(--surface-4)`, `box-shadow: var(--shadow-modal)`, scrim `--scrim-strong` + `blur(2px)`. This is not a new recipe — it's Ruling 1's frame applied to a new surface type. The sticky top bar (`.cbar`/`.filters`) itself is unchanged; only its overflow menu adopts the docked shape on phone.

## Ruling 8 — Hub layouts: library pages only, layout frozen, home page out of scope

Confirms and narrows the Hub layouts family above. `library.css`'s six-page library template (adventures, sessions, arcs, my-vault, community, the-cast, plus the browse/community/creators hubs built on the same skeleton) is in scope for this sweep: colors and type update to the token system, but the skeleton order (page head → action row → banner → filter bar → grid → endcap → ladder) and its grid breakpoints do not change. `studio-home.html`'s dashboard shape (`.hero`, `.craftdoors`, `.shelf`/`.poster`, `.vista`, `.ladder--steps`) is explicitly **out of scope** for this sweep — it is a different template and isn't touched by this ruling.

---

# Status color tokens (3 Aug 2026)

Three tokens, minted fresh for this repo — not copied or approximated from any color already in the fe app (checked against every hex in `app/theme.css` and against the ad hoc Tailwind reds/ambers/emeralds/skys already scattered through `components/studio/**`). Declared in `app/theme.css`, in the token file itself alongside every other design-system color — **not** in `app/token-bridge.css`. The bridge is temporary scaffolding for the legacy `--muted`/`--muted-gold`/`--foreground` names; these are new, real tokens and have no legacy name to bridge from.

| Token | Value | Role |
|---|---|---|
| `--status-success` | `#7D9B6A` (warm sage) | success state |
| `--status-warning` | `#C97B35` (burnt amber) | warning state |
| `--status-danger` | `#C2634D` (brick red) | danger state — also the danger button fill (Ruling 2) |
| `--status-success-bed` / `-border` | `rgba(125, 155, 106, .14)` / `rgba(125, 155, 106, .40)` | quiet chip bed / border |
| `--status-warning-bed` / `-border` | `rgba(201, 123, 53, .14)` / `rgba(201, 123, 53, .40)` | quiet chip bed / border |
| `--status-danger-bed` / `-border` | `rgba(194, 99, 77, .14)` / `rgba(194, 99, 77, .40)` | quiet chip bed / border |

Each bed/border pair is composed from its own base color at low opacity, following the same pattern as `--fill`/`--line-strong` (a translucent wash plus a more-opaque edge on the same hue) — not a new pattern, the same one the gold family already uses.

**No info color, deliberately.** This is a rule, not a gap: there are exactly three status states. Neutral and informational UI reads through the existing `--ink`/`--ink-dim`/`--ink-faint` family, the same as every other non-status line of text in the system. A fourth "info blue" was considered and rejected — informational copy is not a status, it doesn't need a color to prove it.

**Usage law** (verbatim, applies to all three tokens):

- State only. Never decoration, charts, card accents, or hover effects.
- Every use ships with a word beside it. Color alone never carries meaning.
- Warning is reserved. It sits close to the gold accent, so it is used only where no other signal works.
- `--status-danger` is the same token as the danger button variant. One red, not two.

Defined here only — **applied nowhere in this pass.** No package in this repo consumes any of the six tokens above yet.

## Ruling 9 — Icon tiles: all or nothing within a group

An option-tile group (the choice-tile grid in `crestfall-option-modal` and anything built the same way) either gives every option in the group an icon, or gives none of them one. If the icon sprite has no matching symbol for even one option in a group, no option in that group gets an icon — never a mixed grid of some tiles with an icon and some without. This is why the Fantasy group (Adventurer/Artificer/Bard/Scholar) reads inconsistently today: Artificer and Scholar have sprite matches, Adventurer and Bard don't, and per this ruling the group should render with no icons at all rather than two-out-of-four. Flagged here for correction in a future pass — not fixed in this document.

---

# Rulings — today

## Symbols, ruled by job

Symbols are ruled by job. Functional marks (check, cross, chevron)
belong in the icon sprite so they take token color at a controlled
weight and render identically on every platform. Decorative flourishes
stay typographic glyphs, inside display type only. No bare glyph ever
carries meaning.

## Status colors: now applied, not merely defined

Status colors are now APPLIED, not merely defined. This supersedes the
earlier "defined not applied" note. Raw red, emerald, amber, rose, sky
and pink for state are replaced by the three minted tokens. There is no
info color; any sky-blue info state is removed, not converted.

## Banner composition

**SUPERSEDED 4 Aug 2026** — see **Rulings — 4 Aug 2026 → Banner
taxonomy**. The open settings matrix below (veil style, copy anchor,
veil strength) is retired in favor of three named treatments; kept
here for history only.

The uniform veil law covers bottom banners and endcaps only. Heroes and
doors carry composition freedom through two settings: veil style
(uniform, fade from bottom, left, right, top, or none) and copy anchor
(the nine-box grid). A third setting, veil strength, has three steps.
Defaults per surface are pending a banner lab in the draft repo and are
NOT to be guessed.

## Sweep scope

In scope: player-facing surfaces and the standard builders. Deferred,
each owed a design before go-live and recorded as a named gap, never
silently skipped: JSON and code editor modals, data tables, progression
and mechanics registries, the `components/blocks` sourcebook prose
family, carousels, masonry grids, and the donate and pink accent family.
Chat surfaces are excluded from the mechanical sweep entirely and get a
dedicated sitting.

## Themes

Token conversion serves both themes at once and is never skipped.
Light-mode tuning and light-mode review are deferred until dark mode is
signed off.

## Review widths

Review widths are 390 and 1440. 768 is retired from review.

## Open gaps — recorded not solved, blocking nothing

Off-scale radii (16px `rounded-2xl`) have no token. Opacity washes
(`bg-black/45`) have no token. Destructive button geometry is undefined.
These need minting before the next batch and are Brian's to rule.

**RESOLVED 4 Aug 2026** — all three closed below, under **Rulings — 4
Aug 2026**. See Corners, Wash, and Destructive.

---

# Rulings — 4 Aug 2026

Law pass only. Nothing below is applied to any package in this pass —
these are rulings to convert against in batch two, not edits made now.
Closes the three items logged under **Open gaps** above, and corrects
**Banner composition** under Rulings — today.

## Corners: two tiers only

Two tiers, no third:

| Tier | Value | Token | Applies to |
|---|---|---|---|
| Standard | 12px | `--radius-md` | every control (buttons, inputs, chips) **and** every content surface (cards, tiles, rows) |
| Large | 20px | `--radius-lg` | large panels only — modals, sheets, large containers |

The 16px off-scale value (`rounded-2xl`, seen in `StoryRoomCastPanel`,
`LocationBuilder`, `GamesHub`, and elsewhere per `docs/HARVEST-GAPS.md`
§5) is retired. It resolves **down** to `--radius-md` (12px), not up to
`--radius-lg` — an off-scale panel was never meant to read as large, it
drifted there ad hoc.

Small nested art thumbnails keep the tight radius: `--radius-sm` (8px),
unchanged from the draft (`.cf-art`, `.crtworks a`, `.crtworks .phw`) —
this is the one standing exception, for small art nested inside a
larger standard- or large-radius card, not a third general tier.

No new token minted — `--radius-sm`/`--radius-md`/`--radius-lg` already
exist in `app/theme.css`. This ruling is a consolidation of usage, not
a new value.

## Shape law: fully rounded belongs to labels, not actions

`--radius-full` (pill) is reserved for **tags and icon buttons only**.
Every button in the app — every clickable action, regardless of
surface or density — is a soft-cornered rectangle at `--radius-md`
(the Corners standard tier above), with no exception carved out for
any surface. This explicitly includes **Follow** and **View profile**
on the creators page, which currently read as pills and must move to
the standard button rectangle.

This is the load-bearing distinction: shape alone tells the eye
"label" (pill, `--radius-full`, non-interactive-reading, e.g. a tag or
badge) from "action" (rectangle, `--radius-md`, a button). A button
that borrows a tag's pill shape reads as a label and undersells that
it does something. No package is touched by this ruling yet — it is
recorded so batch two knows which shape is correct before converting
any pill-shaped button it finds.

## Wash: lighter tier where a tag carries its own bed (PROVISIONAL)

Full covers (bottom promo banners, hero, endcap-style payoff banners)
keep the heavy screen at `.70` — `--scrim-strong` / `--veil-screen`,
unchanged from `docs/HARVEST-GAPS.md` §2.

Where a tag sitting over the same artwork already carries its own dark
bed (`--tag-bed-art`, also `.70`), the wash on the artwork underneath
that tag comes **down** — the bed already does the legibility work, so
stacking two full-strength washes on top of each other is redundant.

The lighter tier is `--scrim`, already defined in `app/theme.css` at
`rgba(0, 0, 0, .40)` (currently used once, in the draft's `home.html`
`.castcard::after` caption fade) — no new token name is needed, this
existing token is now assigned the role.

**PROVISIONAL: the exact value is not settled.** `.40` is the
placeholder pending Brian's eye on a real render; it may move. What is
settled and not provisional: which token plays this role (`--scrim`),
and the rule that governs when it applies (under a tag's own bed, not
elsewhere). Tag beds themselves are unaffected and stay `.70` — this
ruling only touches the wash on the artwork *underneath* a tag that
already has its own bed, never the bed itself.

## Blur: one strength, panels only

One blur strength in the whole system: `blur(2px)`, paired with the
`.70` screen (`--scrim-strong`). Applies **only** to floating panels —
modals, sheets, pickers (`.cmveil`/`.pkveil`/`.railveil`/`.sheetveil`,
per `docs/HARVEST-GAPS.md` §3). Never on tile art, never on banners,
never on tag beds — none of those blur at all.

Panels never stack (Ruling 1's per-layer scroll lock already prevents
two floating panels being open at once in a way that would composite
their scrims), so blurred layers never stack either — there is no
"two blurs deep" case to define.

Token minted, not yet applied: **`--blur-panel: 2px`** — proposed here
per the same pattern as Ruling 2's danger button (named in this
document first, added to `app/theme.css` in a later, separate commit).
Not added to `app/theme.css` in this pass; not consumed by any package.

Note for clarity, not a change: the sticky filter bar's `blur(12px)`
(`--canvas`-tinted translucency, not a black scrim) and `.tag--meta`'s
`blur(4px)` are different mechanisms entirely and are untouched by
this one-strength law, which governs floating-panel scrims only.

## Destructive: new law, no precedent in the draft

The draft has no destructive control at all (`docs/HARVEST-GAPS.md`
§4: two `Delete` buttons, both plain `.btn--ghost`, no red anywhere,
no confirm step). This ruling has no trace to cite — it is written
from first principles for this app, superseding Ruling 2's plan where
the two disagree.

**Geometry is always ordinary.** Same height, radius, and padding as
any other button of the same size (`--control-md`/`--control-sm`,
`--radius-md`, the same padding scale). A destructive control never
gets its own shape, never a wider hit area than its neighbors, and is
never isolated alone on a footer edge away from its siblings.

**Two distinct treatments, not one:**

| Where | Fill | Text | Notes |
|---|---|---|---|
| In-page delete trigger (row action, list item, card action) | none — quiet, same as `.btn--ghost` | `--status-danger` ("brick lettering") | Ordinary ghost button geometry; only the label color signals danger |
| Confirming button, inside a confirm step | `--status-danger` | `--ink` | The **only** filled red anywhere in the app |

**Filled brick appears in exactly one place**: the confirming button
inside a confirm step. An in-page trigger that opens that confirm step
is never itself filled — it is quiet, text-colored `--status-danger`
on the ordinary button shape. This narrows Ruling 2 above, which
proposed a filled variant for the trigger itself; that plan is
superseded by this two-step split.

**Every destructive control ships with the word beside it** — same
"no color-only meaning" principle the draft already applies to every
tag and status badge. A trash icon alone, in any color, is never
sufficient.

No new token minted — both treatments reuse `--status-danger` (already
defined) and `--ink` (already defined). Not applied to any package in
this pass; `docs/HARVEST-GAPS.md` §5's "missing destructive-button
geometry" occurrences (`SmallDangerAction` in
`LocationRegistryBuilder`, `MediaHistoryGrid`'s Delete Selected chip,
and the raw-red manage-mode states in `StoryRoomsHub`) are the
converting-against list for batch two, per the scope note below.

## Banner taxonomy (corrects "Banner composition")

The single-treatment ruling under **Rulings — today → Banner
composition** — which deferred veil style, copy anchor, and veil
strength defaults to an unrun "banner lab" — is corrected and closed
by this taxonomy. Three treatments, not a settings matrix:

| Treatment | Where | Veil | Copy/CTA position |
|---|---|---|---|
| (a) Bottom promo banner | full width, at page end (e.g. an endcap) | uniform screen (`.70`, `--scrim-strong`) | centered, both axes |
| (b) Banner card | in-flow, mid-page (e.g. a continue card) | fade from the **left** | bottom-left |
| (c) Top banner | page head (e.g. a hero) | fade from the **bottom** | bottom-left |

This replaces the prior "veil style: uniform / fade from bottom, left,
right, top, or none" plus "copy anchor: nine-box grid" plus "veil
strength: three steps" open matrix — that matrix is retired. Only
these three named treatments exist; nothing else is a valid banner
shape. Fade direction and copy position are fixed per treatment, not
independently configurable per instance.

## Creator card

New ruling, not from the draft — the creator card as currently built
does not match this. Two changes, both applying at every width:

- Both actions (Follow, View profile) move **below** the image strip —
  neither sits inside or overlapping the artwork.
- The header becomes a single non-wrapping line: avatar, handle,
  stats, in that order, never wrapping to a second line at any width.

## Batch two scope

**SUPERSEDED 4 Aug 2026** by a full audit of all 299 packages against
this section's rulings, recorded in `docs/BATCH-TWO-SCOPE.md`: ~640
findings across 123 packages, sorted by package, covering Corners,
Shape law, Wash, Blur, Destructive, and Banner taxonomy. That file is
batch two's scope going forward, not the narrower list below, which it
folds in and exceeds. The two items below were the seed for that
audit and are kept for history only.

- The 21 skip-list occurrences recorded in `docs/HARVEST-GAPS.md` §5
  (5 off-scale-radius, 8 opacity-wash, 8 missing-destructive-geometry,
  across 7 files) — converted against the Corners and Destructive
  rulings above.
- The two packages that under-applied the page-head family in batch
  one — `location-parent-picker` and `room-template-package-picker`
  (bridge-var colors were swapped on their eyebrow/title text, but the
  full page-head type-scale table was never applied) — brought to full
  page-head conformance.

## Open questions

Numbered per AGENTS.md §7 — flagged, not guessed at. Brian rules these
before batch two converts the affected packages.

1. **Modal/sheet radius when the surface also reads as a large
   container.** The Corners ruling resolves off-scale 16px DOWN to
   `--radius-md` (12px) as the general case, with `--radius-lg` (20px)
   reserved for "large panels only — modals, sheets, large containers."
   Two independent audit passes over the same file
   (`components/studio/room-templates/room-template-picker`,
   `RoomTemplatePickerModal.view.jsx:30`) reached opposite readings of
   which bucket a modal picker falls into — one resolved it down to
   `--radius-md` per the general retirement rule, the other resolved it
   up to `--radius-lg` because it is a modal. The same ambiguity
   recurs at `story-room-cast-panel`'s sidebar `<aside>`
   (`StoryRoomCastPanel.view.jsx:47`, logged in `docs/BATCH-TWO-SCOPE.md`
   as ambiguous between the two tiers) and other modal/sheet/large
   `<aside>` surfaces throughout `docs/BATCH-TWO-SCOPE.md`. RESTYLE-RULES.md
   as written does not say which property of a surface — "it's a
   modal" vs. "it's not one of the six named modal/sheet/large-panel
   examples" — controls the tier when a 16px surface could plausibly
   read as either. Not resolved here.
