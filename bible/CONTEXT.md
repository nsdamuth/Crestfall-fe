# CONTEXT: the Crestfall glossary

Drafted 26 Aug 2026 from the documents listed at the end. One line per
term. CONFLICT marks a term two documents define differently; those
are open for Brian, not resolved here.

## Product units and display names

The front end shows ruled display names; the data layer keeps its
built names. The one mapping file is
`lib/shared/presentation/terminology.js`.

| Term | Meaning | Source |
|---|---|---|
| Story | The single playable unit, one chat. Displays over the data-layer entity ROOM_TEMPLATE (backend rename is CR-024, later, non-blocking) | CRESTFALL-PRODUCT-MODEL-UXUI.md section 1 |
| Adventure | A series of linked Stories with continuous cast, world state, and memory. Displays over the data-layer entity STORYLINE (CR-025/CR-039) | same |
| Scenario | The narrative logic attached to a Story. Its category value named like the Adventure unit displays as "Scenario" to avoid the collision | same; terminology.js |
| Character / Location / Outfit / Wardrobe / Narrator | Same name in both layers | CRESTFALL-PRODUCT-MODEL-UXUI.md section 1 |
| Quest | Proposed display alias for one Scenario category value, pending GO | same |
| Vault | The personal management hub page: everything owned plus everything saved | same, section 4.6 |
| Canon | Work officially accepted into Crestfall Chronicles; gold badge; creator relinquishes edit rights | same, section 5 |

## Ratings display

| Term | Meaning | Source |
|---|---|---|
| Everyone | Display word for the backend value SFW | terminology.js; CR-027 |
| Young Adult | Display word for the backend value MATURE (was Teen; word superseded 23 Aug 2026, display layer only; internal tier id TEEN unchanged) | terminology.js; CR-027; HANDOFF-NICK-2026-08-23.md |
| Adult | Display word for the backend value EXPLICIT | terminology.js; CR-027 |
| Rating gate | Existing MATURE and EXPLICIT content must be audited before live data ships under these labels | CR-027 |

Description lines RULED by Brian 26 Aug 2026, full record:
`bible/decisions/2026-08-26-ratings-display.md`.

## Retired words

Retired from all UI copy in both layers (CRESTFALL-PRODUCT-MODEL-UXUI.md
section 1): **Arc**, **Codex**, **Sessions**. The one creation type
whose display label contained the second word (RULES_CODEX in
terminology.js) was RULED 26 Aug 2026 to display as **Rulebook**;
the backend value is untouched. Retired TOKEN names are a separate
table in `docs/DESIGN-TOKENS.md` "Retired names".

## Lanes and boundary

| Term | Meaning | Source |
|---|---|---|
| Chassis | Crestfall proper (Nick's side): routes, application logic, application ViewModels, authoritative Binding Shells, contracts, data | CLAUDE.md FE-REVIEW-01; CRESTFALL-DESIGN-CONTEXT.md |
| Crestfall-fe | This repo (Brian's side): Views, Kit, tokens, fixtures, page composition only | same |
| FE-REVIEW-01 | The standing boundary rule between the two, closed 15 Aug 2026 | CLAUDE.md; docs/reviews/FE-REVIEW-01.md |
| Sol | Nick's ChatGPT instance. Reads documents Nick hands it; never edits this repo | this bible |
| CR | Contract request: the one mechanism for anything blocked on the Chassis; numbered CR-NNN in docs/CONTRACT-REQUESTS.md | CONTRACT-REQUESTS.md |

## Component shape

| Term | Meaning | Source |
|---|---|---|
| LOOM | The five-file component shape plus a Shell one level up | docs/architecture/CRESTFALL_LOOM_PATTERN.md; FRONTEND-SOP.md section 1 |
| Binding Shell | The outer component owning navigation, application state, wiring; Chassis-owned when authoritative | Crestfall-FE-README.md; FE-REVIEW-01 |
| ViewModel | Prepares props for the View; presentation-only ones are FE-owned, application ones are Chassis-owned | FE-REVIEW-01 |
| Portable View | Presentation only; no data access, no routing, no business rules | Crestfall-FE-README.md |
| Contract | The versioned prop-shape document, version on line 1 | FRONTEND-SOP.md section 1 |
| Fixtures | Deterministic local states for previews; always include a filled, value-carrying variant | FRONTEND-SOP.md; FE-REVIEW-01 standing rule |
| Kit | The shared component vocabulary under components/kit/ | BUILD-BLUEPRINT.md chapter 2 |
| HIDE / STUB | The two lawful dispositions for a View with no live backend: hide the promise, or show an honest placeholder; never fake state | FRONTEND-SOP.md section 5 |
| Preview route | The fixture-driven page under /dev/ui-preview/ used for all verification; agents never sign in | FRONTEND-SOP.md; CRESTFALL-DESIGN-CONTEXT.md |

## Tokens and design law

| Term | Meaning | Source |
|---|---|---|
| Token | A named design value declared once in app/theme.css, the only declaring file | DESIGN-TOKENS.md Authority |
| locked / provisional / proposed | Token statuses: writable by an execution run / readable only / named only | DESIGN-TOKENS.md Status vocabulary |
| Token-first directive | Every color and typography value pulls from a token; a missing token stops the work, it is never invented | FRONTEND-SOP.md section 17 |
| Contrast law (X1) | The checkable text-contrast pairing rules, ruled 12 Aug 2026 | DESIGN-TOKENS.md Contrast law |
| Container law | Every /studio page's content column caps at the 1200px container, ruled 23 Aug 2026 | DESIGN-TOKENS.md |
| Focus treatment | One global ring for every focusable control (A3, 22 Aug 2026; confirmed by Brian 26 Aug 2026). The stale kit-only paragraph in CRESTFALL-DESIGN-CONTEXT.md regenerates away | DESIGN-TOKENS.md; BUILD-BLUEPRINT.md 2.16(e) |

## Process

| Term | Meaning | Source |
|---|---|---|
| Nine-page model | Play (Home, Stories, Adventures), Create (Studio, Images, Vault), Explore (Community, Creators, Lore) | CRESTFALL-PRODUCT-MODEL-UXUI.md section 2 |
| Journey loop | Each page's bottom banner routes to the next page in the loop | same |
| Visibility | The four-state enum: Private, Internal, Public, Canon | same, section 5 |
| Strangler build | New pages build alongside old ones at /studio/v2/, old pages untouched until cutover | same, section 6 |
| Cutover sequence | Build all nine, prove 100 percent coverage, Nick sign-off, freeze and merge, stage, go live; never per page | same |
| Parity echo | Every function-map row per page accounted for: present, deliberately excluded with a ruling, or flagged | BUILD-BLUEPRINT.md 3.4 |
| Function map | docs/APP-FUNCTION-MAP.csv, the ledger of what every control reports | FRONTEND-SOP.md section 13 |
| Render sitting | Brian looking at the running pages and ruling; nothing visual is settled without one | ROADMAP.md; DESIGN-TOKENS.md (F1) |
| Ultrareview | The deep multi-agent review pass named in the roadmap phases | ROADMAP.md |
| Reply vocabulary | GO, NO, HOLD, /HANDOFF and nothing else | PROJECT-INSTRUCTIONS.md; FRONTEND-SOP.md section 9 |
| Pre-carried | A recommendation already drafted into the next artifact, never executed before GO | PROJECT-INSTRUCTIONS.md |
| Three-option gate | Every real choice: exactly three options, one recommended with reasons, costs stated | PROJECT-INSTRUCTIONS.md; FRONTEND-SOP.md section 9 |
| Model lanes | Opus rules and synthesizes; Sonnet propagates ruled patterns; and per the 26 Aug 2026 ruling both process docs carry: "Fable plans, reviews, and rules at strategy gates, and designs novel components in plan mode; it never executes edits." | PROJECT-INSTRUCTIONS.md; FRONTEND-SOP.md section 11 |
| Silence is never approval | An unruled question stays open; work routes around it | CLAUDE.md; FRONTEND-SOP.md |
| Verification law | Rendered at 390 then 1440, production build exit 0, zero em dashes in touched docs, report echoes the manifest | FRONTEND-SOP.md section 8 |
| Sidebar v2 preview | The flag-gated preview nav for the nine pages; not the real cutover | FRONTEND-SOP.md section 18 |

## Source documents

CLAUDE.md; docs/DESIGN-TOKENS.md; docs/FRONTEND-SOP.md;
docs/CRESTFALL-PRODUCT-MODEL-UXUI.md; docs/PROJECT-INSTRUCTIONS.md;
docs/CRESTFALL-DESIGN-CONTEXT.md; docs/BUILD-BLUEPRINT.md;
docs/ROADMAP.md; docs/CONTRACT-REQUESTS.md; docs/RESTYLE-RULES.md;
docs/handoffs/HANDOFF-NICK-2026-08-23.md; Crestfall-FE-README.md;
lib/shared/presentation/terminology.js.
