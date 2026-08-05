# Redesign order

Ranked furthest from the draft's pattern first. Written from the saved renders in
docs/review-artifacts/ (390 and 1440), not from file reads. Draft pattern reference:
docs/RESTYLE-RULES.md and docs/CRESTFALL-DESIGN-CONTEXT.md.

71 real pages, component preview gallery excluded.

---

## 1. `/stories/example-slug` - distance 10/10

**Purpose:** Intended to present a single inserted-fiction story entry to a reader, mirroring the lore detail page.

**Structural blocks (top to bottom):**

- page component (inline) - app/stories/[...slug]/page.js is a 0-byte file with no default export, so the route has no implementation at all

**Distance from draft:** The route's page.js is completely empty (confirmed by file read, 0 bytes), so there is no composition to compare against the draft pattern at all; both renders only surfaced the unrelated login gate.

## 2. `/studio/profile` - distance 10/10

**Purpose:** Should show the signed-in user's own profile hub, but the mobile render is a raw Next.js dev runtime-error overlay from an unrelated route crash, and the desktop render is the same shared sign-in gate as the other pages.

**Structural blocks (top to bottom):**

- Next.js dev error overlay (mobile) (inline) - framework devtool chrome, not app design system at all -- not a real page state
- sign-in modal card (desktop) (reusable) - identical shared auth-gate markup as /studio/play

**Distance from draft:** Mobile capture is not the app at all (a raw Next.js runtime-error toast with square corners and system red), sharing none of the corner, banner, or badge laws; this route needs a re-render, its distance cannot be judged from the app's own design language here.

## 3. `/factions/aethelgard/ironmere-tribes` - distance 9/10

**Purpose:** Present the full lore record for a single faction so players can read its detailed background and jump to related records.

**Structural blocks (top to bottom):**

- site nav header (reusable) - SiteHeader
- floating back button (reusable) - FloatingBackButton, fixed left-mid position, standard-radius
- page head on full-bleed background (reusable) - SiteShell, same non-standard banner treatment as the index page
- breadcrumb trail (reusable) - Breadcrumbs component, but styled with raw hardcoded hex colors (#7b5525, #a88957, #17120d) instead of design tokens
- sourcebook article body (flourish divider, centered eyebrow/title/subtitle, lore content blocks) (reusable) - DetailPage + LoreBlockRenderer, bespoke 'sourcebook page' texture/decoration not part of either draft template
- related records grid (reusable) - RelatedRecords component, raw hex colors and zero corner-radius on its link cards

**Distance from draft:** Breadcrumbs and Related Records ship raw hardcoded hex colors instead of tokens and unrounded cards, and the whole page is a bespoke 'sourcebook article' template that matches neither the draft's library skeleton nor its dashboard template.

## 4. `/intro` - distance 9/10

**Purpose:** Present the campaign's introductory lore article so new players/readers get oriented before entering the archive.

**Structural blocks (top to bottom):**

- site nav header (reusable) - SiteHeader
- floating back button (reusable) - FloatingBackButton
- page head on full-bleed background (reusable) - SiteShell, non-standard banner treatment
- breadcrumb trail (reusable) - Breadcrumbs, raw hardcoded hex colors
- sourcebook article body (reusable) - DetailPage + LoreBlockRenderer, same bespoke article texture as other detail pages
- related records grid (reusable) - RelatedRecords, raw hex colors, zero corner-radius cards

**Distance from draft:** Same DetailPage composition as the faction/location detail pages: raw hardcoded hex colors in Breadcrumbs and Related Records instead of tokens, unrounded related-record cards, and a bespoke sourcebook-article shell that matches neither draft template.

## 5. `/locations/crestfall/sun-hee-domain` - distance 9/10

**Purpose:** Present the full lore record for a single location so players can read its detailed background and jump to related records.

**Structural blocks (top to bottom):**

- site nav header (reusable) - SiteHeader
- floating back button (reusable) - FloatingBackButton
- page head on full-bleed background (reusable) - SiteShell
- breadcrumb trail (reusable) - Breadcrumbs, raw hardcoded hex colors
- sourcebook article body (reusable) - DetailPage + LoreBlockRenderer, bespoke article texture/decoration
- related records grid (reusable) - RelatedRecords, raw hex colors, zero corner-radius cards

**Distance from draft:** Identical DetailPage composition to the faction/intro detail pages: raw hardcoded hex colors instead of tokens in Breadcrumbs and Related Records, unrounded related-record cards, and a bespoke sourcebook-article shell outside either draft template.

## 6. `/lore/alderbrook/alderbrook-becomes-a-township` - distance 9/10

**Purpose:** Present a single lore codex entry's full narrative content (an in-world historical record) to a reader.

**Structural blocks (top to bottom):**

- SiteShell outer page head (reusable) - same shared shell as /lore, duplicates eyebrow/title above the article
- sourcebook article header (breadcrumbs, flourish, eyebrow, title, subtitle) (inline) - components/DetailPage.jsx builds a second, nested eyebrow/title block inside "sourcebook-page" styling, not the shared page-head pattern
- LoreBlockRenderer body content (reusable) - components/LoreBlockRenderer.jsx, dedicated shared renderer for lore content blocks
- RelatedRecords footer (reusable) - components/RelatedRecords.jsx
- FloatingBackButton (reusable) - components/FloatingBackButton.jsx

**Distance from draft:** Render actually loaded (login gate shown, since detail routes require auth) confirming an unstyled auth wall rather than page content; code shows a doubled page-head (SiteShell's header plus DetailPage's own centered sourcebook header) which directly conflicts with the single page-head recipe, plus legacy "sourcebook-" class names that predate the token system entirely.

## 7. `/factions` - distance 8/10

**Purpose:** Let players browse and filter the roster of factions, orders, and powers active in the Crestfall world.

**Structural blocks (top to bottom):**

- site nav header (reusable) - SiteHeader, used across ~10 routes
- full-bleed atmospheric background + page head (eyebrow/title/lede) (reusable) - SiteShell, used across 9 routes, but wraps head in a full-page cover image + strong scrim, a fourth banner treatment outside the draft's three
- filter bar: search input, realm select, scrollable tag-pill rail (reusable) - FilterableIndex/FilterableIndexView, shared by ~7 index routes; not sticky
- card grid (LoreCard tiles) (reusable) - LoreCard has zero corner-radius class, square corners on a grid sibling
- Return Home footer link (reusable) - SiteShell footer button, class name sourcebook-button

**Distance from draft:** Grid cards (LoreCard) and tag-filter pills ship with no rounded corners at all, violating both the standard-radius grid law and the pill law for tags, and the page head sits inside a full-bleed background-image/scrim treatment that is a fourth banner pattern outside the draft's three.

## 8. `/locations` - distance 8/10

**Purpose:** Let players browse and filter the roster of locations recorded across Crestfall.

**Structural blocks (top to bottom):**

- site nav header (reusable) - SiteHeader
- full-bleed atmospheric background + page head (reusable) - SiteShell, non-standard banner treatment
- filter bar: search, realm/faction/theme selects, tag-pill rail (reusable) - FilterableIndex, shared with /factions and other index routes; not sticky
- card grid (LoreCard tiles) (reusable) - LoreCard, zero corner-radius
- Return Home footer link (reusable) - SiteShell footer button

**Distance from draft:** Same shared FilterableIndex/LoreCard composition as /factions: square-cornered grid cards and standard-radius (not pill) tag filters, plus a full-page background-image head treatment outside the draft's three banner types.

## 9. `/lore` - distance 8/10

**Purpose:** Serve as the entry index into Crestfall's lore codex, letting a reader browse historical/cosmological arcs as a timeline.

**Structural blocks (top to bottom):**

- SiteShell page head (eyebrow/title/lede) (reusable) - components/SiteShell.jsx, shared across lore, stories, chronicle, characters, factions, locations, terms
- background cover image + scrim (reusable) - built into SiteShell, not this page specifically
- LoreArcAccordion content list (reusable) - components/LoreArcAccordion.jsx, dedicated shared component
- Return Home footer link (reusable) - part of SiteShell, styled as "sourcebook-button"

**Distance from draft:** Render artifact for this key was corrupted/mismatched (showed an unrelated dev-preview page), so judged from code: this is the legacy SiteShell/sourcebook template shared across many old pages, entirely different skeleton from the six-page library/BROWSE pattern (no action row, no sticky filter bar, no content grid, no payoff endcap banner), and its eyebrow lacks the ruled mark called for in the draft page-head recipe.

## 10. `/stories` - distance 8/10

**Purpose:** Serve as the entry index into Crestfall's inserted-fiction archive of recovered narrative fragments, letters, and vignettes.

**Structural blocks (top to bottom):**

- SiteShell page head (reusable) - same shared shell as /lore
- FilterableIndex content list (reusable) - components/FilterableIndex.jsx and components/filterable-index/*, dedicated shared filterable component, currently fed an empty array
- "Coming Soon" inline banner block (inline) - hand-built div with its own eyebrow/title/copy, not one of the three defined banner treatments

**Distance from draft:** Mobile render for this key came back solid black (failed capture) and desktop render showed the login gate, so judged from code: the page is functionally empty (stories array is hardcoded to []) and its "Coming Soon" block is a bespoke fourth banner treatment (in-flow, centered, no fade/image) that matches none of the draft's three permitted banner types.

## 11. `/studio/story-rooms` - distance 8/10

**Purpose:** Per app/studio/story-rooms/page.js, this should be the library page for continuing active rooms and starting new sessions from templates via StudioPageHeader + StoryRoomsHub, but the saved render instead shows an unrelated dev fixture-preview harness ("Crestfall Option Modal" preview states).

**Structural blocks (top to bottom):**

- fixture-preview page head (inline) - belongs to app/dev/ui-preview/crestfall-option-modal/CrestfallOptionModalPreviewClient.jsx, a dev-only harness, not the story-rooms page
- preview-state pill row (inline) - dev-tool state switcher (CLOSED TRIGGER / GROUPED OPTIONS / etc.), not part of the shipped story-rooms UI
- interactive trigger card (inline) - dev harness demo of the option-modal trigger, unrelated to StoryRoomsHub
- contract boundary note card (inline) - developer-facing documentation block, not user-facing product surface

**Distance from draft:** The captured render does not reflect app/studio/story-rooms/page.js at all (a dev-only fixture harness was captured instead of StudioPageHeader + StoryRoomsHub), so it fails the library-template skeleton wholesale; this route needs a re-capture before it can be judged against the draft pattern on its actual merits.

## 12. `/studio` - distance 7/10

**Purpose:** The Studio home dashboard, letting a player either jump into official/community play or open the creator tools to build characters, rooms, and images.

**Structural blocks (top to bottom):**

- header (eyebrow, display title, lede, action links, search input) (inline) - bespoke header block on this page, not built from StudioPageHeader or the hero/craft-doors dashboard pattern
- Start Playing panel with 3-card action grid (inline) - one-off panel with inline card links, no shared card component
- Continue / Your Story State panel (inline) - placeholder panel, bespoke markup
- Create Your Own panel with 3-card action grid (inline) - same inline card pattern repeated a second time on the page

**Distance from draft:** Skips the page-head recipe (no eyebrow-with-ruled-mark plus Cormorant title plus tight lede via StudioPageHeader) and the hero/craft-doors/shelf-rows dashboard skeleton entirely, replacing both with bespoke stacked panels of ad hoc card grids.

## 13. `/characters/crestfall/crash-santosa` - distance 6/10

**Purpose:** Show a single character's detail profile within the archive (content gated behind sign-in at capture time).

**Structural blocks (top to bottom):**

- sign-in gate card (Continue with Google, email magic link, close X) (reusable) - app/login/page.js, shared across every gated route in this batch

**Distance from draft:** Only the auth gate rendered so the real detail page composition is unverifiable, and the gate itself violates the floating-chrome law: it behaves like a dismissible overlay (has a close X, floats centered over blank background) but is built with standard --radius-md instead of the required large radius for anything that floats above the page.

## 14. `/chronicle/arc-1/chapter-1` - distance 6/10

**Purpose:** Present a single chronicle chapter's narrative content (content gated behind sign-in at capture time).

**Structural blocks (top to bottom):**

- sign-in gate card (Continue with Google, email magic link, close X) (reusable) - identical app/login/page.js gate as the character detail route

**Distance from draft:** Real chapter content is unverifiable behind the auth gate, and the gate reuses the same floating-chrome violation: a dismissible-looking overlay built at standard --radius-md rather than the large radius the draft mandates for floating surfaces.

## 15. `/studio/create` - distance 6/10

**Purpose:** Gives creators an entry point to start a new creation, either via a handful of quick-start types, a guided multi-step build path toward a full story foundation, or the complete unsorted toolkit of every creation type.

**Structural blocks (top to bottom):**

- page head (eyebrow/title/lede) (reusable) - StudioPageHeader, on-pattern
- sticky mode-selector bar (inline) - bespoke 3-way segmented panel, uses hardcoded rounded-2xl rather than a radius token, and its sticky/floating treatment has no equivalent in the draft's banner/panel taxonomy
- quick-start type-card grid (reusable) - CreateTypeCard, shared card also used across every /studio/create/* sub-route gallery
- guided-build step/chapter list (inline) - bespoke accordion (details/summary) steps and chapters with progress badges, not used anywhere else in the app
- recommended-next / core-complete panels (inline) - bespoke highlighted panels, closest thing to a banner card but not built on the shared banner component
- full-studio collapsible sections (inline) - bespoke details/summary grouping of CreateTypeCard grids by category
- secondary pill-shaped buttons/links (inline) - 'View all tools', chapter 'Open/Close' toggle, and optional-asset links are real clickable controls built with rounded-full

**Distance from draft:** Several real clickable controls (View all tools, optional-asset links) are built as full pills, breaking the shape law that only non-interactive labels may be pill-shaped, and the whole page is a bespoke mode-selector/guided-journey composition that matches neither the library skeleton nor the dashboard template.

## 16. `/studio/create/room-template` - distance 6/10

**Purpose:** Let a Studio creator assemble characters, scenario, narrator, opening messages, and room settings into one reusable playable room setup.

**Structural blocks (top to bottom):**

- sign-in gate panel (eyebrow + display title + auth form) (reusable) - this is app/login/page.js rendered as the auth wall; identical render across all five pages in this batch confirms it blocks every /studio/create/* route
- page head (eyebrow/title/lede) + builder shell (reusable) - StudioPageHeader + RoomTemplateBuilderShell per app/studio/create/room-template/page.js, but not visible in the render, content sits behind the auth gate

**Distance from draft:** the visible surface is the /login panel, styled as a closeable overlay (has an X) yet built with --radius-md (STANDARD) instead of the --radius-lg the draft's floating-chrome law requires for anything that floats above the page; the actual room-template composition is unverifiable from this render.

## 17. `/studio/create/rules-codex` - distance 6/10

**Purpose:** Let a Studio creator author scoped interpretive guidance that explains verified mechanics without overriding deterministic state, guards, registries, safety, or player agency.

**Structural blocks (top to bottom):**

- sign-in gate panel (eyebrow + display title + auth form) (reusable) - same shared /login component intercepting the route, identical render to the other four pages in this batch
- page head (eyebrow/title/lede) + RulesCodexBuilderShell (reusable) - present in source (app/studio/create/rules-codex/page.js) but not visible in the render, sits behind the auth gate

**Distance from draft:** same login-panel radius violation as its sibling pages (--radius-md on a closeable overlay instead of --radius-lg), and the real page body cannot be judged from this render evidence.

## 18. `/studio/create/scenario` - distance 6/10

**Purpose:** Let a Studio creator build a reusable story setup from a structured story circle plus optional runtime guidance.

**Structural blocks (top to bottom):**

- sign-in gate panel (eyebrow + display title + auth form) (reusable) - same shared /login component intercepting the route
- page head (eyebrow/title/lede) + ScenarioBuilderShell (reusable) - present in source (app/studio/create/scenario/page.js) but not visible in the render

**Distance from draft:** identical login-panel radius violation as the rest of the batch; underlying scenario-builder composition is unverifiable from render evidence.

## 19. `/studio/create/stats-pools-profile` - distance 6/10

**Purpose:** Let a Studio creator define reusable Stats, HP, Stamina, Mana, modifiers, and conditions later attached through an Actor Mechanics Profile.

**Structural blocks (top to bottom):**

- sign-in gate panel (eyebrow + display title + auth form) (reusable) - same shared /login component intercepting the route
- page head (eyebrow/title/lede) + StatsPoolsBuilderShell (reusable) - present in source (app/studio/create/stats-pools-profile/page.js) but not visible in the render

**Distance from draft:** identical login-panel radius violation as the rest of the batch; underlying stats-pools composition is unverifiable from render evidence.

## 20. `/studio/create/storyline` - distance 6/10

**Purpose:** Let a Studio creator link Stories and Scenarios into an authored continuity path where completed nodes return to open-world chat until the next trigger fires.

**Structural blocks (top to bottom):**

- sign-in gate panel (eyebrow + display title + auth form) (reusable) - same shared /login component intercepting the route
- page head (eyebrow/title/lede) + StorylineBuilderShell (reusable) - present in source (app/studio/create/storyline/page.js) but not visible in the render

**Distance from draft:** identical login-panel radius violation as the rest of the batch; underlying storyline-builder composition is unverifiable from render evidence.

## 21. `/terms/terms-of-service` - distance 6/10

**Purpose:** Display a single legal/policy document (terms of service) with its section text for players to read.

**Structural blocks (top to bottom):**

- site header/nav (reusable) - SiteHeader component shared across app
- page head (eyebrow + display title) (reusable) - SiteShell.jsx supplies eyebrow-over-title recipe, shared by terms, lore, stories, locations, factions, characters, chronicle, not-found
- back link chip (inline) - PolicyPage.jsx bespoke ArrowLeft link, standard radius, not a shared button component
- in-article policy header (category eyebrow + h1 + summary + status badge) (inline) - PolicyPage.jsx renders a second eyebrow/title block nested inside SiteShell's own eyebrow/title, duplicating the page-head recipe within one page
- draft-placeholder notice box (inline) - raw amber-300 literal colors and its own bordered box, not one of the three sanctioned banner treatments
- status pill (ShieldCheck + status word) (reusable) - rounded-full pill with word beside icon, matches badge/pill law
- section card list (inline) - PolicyPage.jsx maps policy.sections into bordered rounded-md boxes, bespoke to this component, not a shared card grid
- footer disclaimer box (inline) - bespoke bordered note box in PolicyPage.jsx
- Return Home button (reusable) - sourcebook-button class used across SiteShell pages

**Distance from draft:** The page stacks two separate eyebrow-title page heads (SiteShell's own plus PolicyPage's nested category/title/summary block), directly violating the single tight page-head recipe, and the amber draft-placeholder box is a fourth, unsanctioned banner treatment built from raw literal colors instead of the three approved banner patterns and design tokens.

## 22. `/studio/image-studio` - distance 5/10

**Purpose:** Give a creator a workbench for generating and managing AI character/scene artwork.

**Structural blocks (top to bottom):**

- auth gate sign-in modal (reusable) - same shared modal as the other four pages
- page head (inline) - source hand-writes just an eyebrow label with no display-font title or lede, not using StudioPageHeader at all
- image studio workbench (inline) - ImageStudioWorkbench component, dedicated to this route, could not be rendered

**Distance from draft:** Page head in source skips the draft's eyebrow-title-lede recipe entirely, shipping only a bare eyebrow line with no Cormorant Garamond display title, the largest structural gap of this batch.

## 23. `/terms` - distance 5/10

**Purpose:** An index of Crestfall's draft legal, privacy, safety, and platform-trust policy placeholders, linking out to individual policy pages.

**Structural blocks (top to bottom):**

- site header (reusable) - SiteHeader
- full-bleed background image + scrim wrapping the whole page (inline) - SiteShell applies a page-wide cover image and scrim behind the entire content column
- eyebrow + display title + lede (inline) - hand-built inside SiteShell, a separate implementation from StudioPageHeader
- draft-legal-placeholder notice banner (inline) - uses literal amber-300 Tailwind classes instead of the status-warning token
- policy card grid (reusable) - PolicyIndex
- return-home button (inline)

**Distance from draft:** The full-page watermark background and scrim sit behind the entire page rather than as one of the three sanctioned banner treatments, and the placeholder notice uses hardcoded amber-300 literal colors instead of the status-warning token the badge/status law requires.

## 24. `/login` - distance 4/10

**Purpose:** Let a visitor authenticate into Crestfall Studio via Google OAuth or an emailed magic link.

**Structural blocks (top to bottom):**

- floating auth card (inline) - bespoke max-w-xl bordered card built directly in app/login/page.js, not a shared modal/sheet component
- eyebrow + title header (inline) - "Crestfall Studio" uppercase label and "Sign in" display title hand-built inline, no ruled mark beside the eyebrow
- close (X) icon button (inline) - circular pill icon button, consistent with the law that pills are allowed for icon buttons
- OAuth button + divider + email form (inline) - Continue with Google button, OR divider, email input, Send login link button, all bespoke to this page

**Distance from draft:** Render artifact for this key was corrupted/mismatched (showed an unrelated dev-preview page), so judged from code: card uses --radius-md consistently and CSS tokens correctly, but the page-head is missing the eyebrow's ruled mark and the lede is not tightly grouped with title (Google button intervenes before the descriptive sentence).

## 25. `/studio/account/preferences` - distance 4/10

**Purpose:** A placeholder settings page collecting future default-behavior toggles for filter panels, browse view, Image Studio, creator workflow, and discovery.

**Structural blocks (top to bottom):**

- back link (StudioBackLink) (reusable)
- page head (StudioPageHeader) (reusable)
- Page Defaults panel with 6-card grid of disabled option buttons (inline) - bespoke PreferenceCard defined locally in this page file, not the shared AccountStubPage card
- footer disclosure note (inline)

**Distance from draft:** Breaks shape law on its option buttons: PreferenceCard renders disabled choice buttons as clickable-styled rectangles with `rounded-xl` (an un-tokenized radius outside the two-tier --radius-md/--radius-lg system) instead of the standard control radius used everywhere else on the sibling stub pages.

## 26. `/studio/create/actor-mechanics-profile` - distance 4/10

**Purpose:** Lets a studio creator compose a reusable actor-mechanics profile package for Player Characters, Characters, and NPCs.

**Structural blocks (top to bottom):**

- auth gate (login card) (reusable) - app/login/page.js; every /studio/create/* route redirects unauthenticated visitors here, so this is the only content the render captured
- page head (StudioPageHeader) (reusable) - confirmed in source (components/studio/StudioPageHeader.jsx -> studio-page-header contract/view/fixtures); not visible behind the auth gate
- back link (StudioBackLink) (reusable) - shared across all studio/create pages; not visible behind the auth gate
- ActorMechanicsProfileBuilderShell (inline) - page-specific builder shell, no contract/view/fixtures split found; content not visible behind the auth gate

**Distance from draft:** The floating auth card (a modal-class surface) is built with --radius-md (STANDARD) instead of the LARGE radius the floating-chrome law requires, and on the mobile render it sits centered with dead space below rather than docking to the bottom edge as the law specifies.

## 27. `/studio/create/character` - distance 4/10

**Purpose:** Lets a studio creator build a new character record from scratch through a guided creator flow.

**Structural blocks (top to bottom):**

- auth gate (login card) (reusable) - same shared /login redirect as the rest of the batch
- back link (StudioBackLink) (reusable) - not visible behind the auth gate
- CharacterCreator (reusable) - has a full contract/view/fixtures split (character-creator/CharacterCreator.contract.js, .view.jsx, .fixtures.js); content not visible behind the auth gate

**Distance from draft:** Same floating auth-card violation as the rest of the batch: STANDARD radius on a modal-class surface and no bottom-dock on mobile, both required by the floating-chrome law.

## 28. `/studio/create/character-template` - distance 4/10

**Purpose:** Lets a studio creator define a reusable character template that can prefill fields during later character creation.

**Structural blocks (top to bottom):**

- auth gate (login card) (reusable) - mobile render matches the shared /login gate; the desktop render captured an unrelated public 'Chronicles' character-detail page, almost certainly a capture-tooling artifact rather than this route's real desktop output, so it is disregarded for scoring
- page head (StudioPageHeader) (reusable) - confirmed in source with eyebrow 'Reusable Blueprint' / title 'Character Template'; not visible behind the auth gate
- back link (StudioBackLink) (reusable) - not visible behind the auth gate
- CharacterTemplateBuilder (reusable) - has a full contract/view/fixtures split; content not visible behind the auth gate

**Distance from draft:** Judged on the trustworthy mobile capture only: same STANDARD-radius, non-docked floating auth card violation shared by this whole batch.

## 29. `/studio/create/event-registry` - distance 4/10

**Purpose:** Lets a studio creator build a reusable event ledger for incidents, scandals, holidays, conflicts, and world history.

**Structural blocks (top to bottom):**

- auth gate (login card) (reusable) - same shared /login redirect
- page head (StudioPageHeader) (reusable) - confirmed in source with eyebrow 'Continuity Ledger' / title 'Event Registry'; not visible behind the auth gate
- back link (StudioBackLink) (reusable) - not visible behind the auth gate
- StructuredRegistryBuilder (registryType=EVENT_REGISTRY) (reusable) - shared builder component parameterized by registryType, has full contract/view/fixtures split; content not visible behind the auth gate

**Distance from draft:** Same batch-wide floating auth-card violation: STANDARD radius instead of LARGE on a modal-class surface, and no bottom-dock treatment on the phone render.

## 30. `/studio/create/faction-registry` - distance 4/10

**Purpose:** Lets a studio creator build a reusable faction-continuity spine covering alliances, rivalries, territory, and influence.

**Structural blocks (top to bottom):**

- auth gate (login card) (reusable) - same shared /login redirect
- page head (StudioPageHeader) (reusable) - confirmed in source with eyebrow 'Power Spine' / title 'Faction Registry'; not visible behind the auth gate
- back link (StudioBackLink) (reusable) - not visible behind the auth gate
- StructuredRegistryBuilder (registryType=FACTION_REGISTRY) (reusable) - same shared builder as event-registry, different registryType prop; content not visible behind the auth gate

**Distance from draft:** Same batch-wide floating auth-card violation: STANDARD radius instead of LARGE on a modal-class surface, and no bottom-dock treatment on the phone render.

## 31. `/studio/create/item-registry` - distance 4/10

**Purpose:** Lets a creator define a reusable item-continuity record (inventory objects, wardrobe, equipment, quest props) that stays consistent across generations.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- item registry builder (form) (inline) - dedicated ItemRegistryBuilder component, not the shared AssetBuilderShell used by image-preset/location

**Distance from draft:** Captured render shows an unrelated dev/ui-preview fixture page (a capture mismatch, not this route's real content) rather than the authenticated builder, so the actual form composition can't be visually verified against banner/badge/shape law; code confirms the shared page-head recipe is used but the builder itself is a bespoke component, not the shared AssetBuilderShell.

## 32. `/studio/create/location-registry` - distance 4/10

**Purpose:** Lets a creator build a reusable location-continuity spine describing story rooms, narrators, districts, and place relationships.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- location registry builder (form) (inline) - thin 10-line LocationRegistryBuilder wrapper, bespoke to this asset type

**Distance from draft:** Desktop render only reached the sign-in gate and mobile render shows a mismatched dev-preview fixture, so the actual registry-builder composition (attachments section etc.) is unverified against banner and shape law from renders alone.

## 33. `/studio/create/organization-registry` - distance 4/10

**Purpose:** Lets a creator build a reusable organization spine (companies, factions, institutions) with entries, relationships, rules, and prompt guidance for later attachment to story rooms.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- builder head panel with inline Save Draft action (reusable) - StructuredRegistryBuilder, generic and reused for organization/faction/location/item/event/quest registries via registryType prop
- tab row (reusable) - same tab pattern as other builders but styled with raw white/10, black/25, muted-gold/NN opacity literals rather than the --line/--surface tokens used in npc-registry
- entries list + entry editor split panel (reusable) - shared across all structured-registry types
- linked-creation cards (reusable) - consistent radius-md card, but image thumbnail uses rounded-xl literal instead of token
- delete entry control (reusable) - ghost outline button, visible 'Delete Entry' word beside Trash2 icon, matches destructive-control law

**Distance from draft:** Composition and page-head recipe match the draft pattern, but nearly every surface (tabs, inputs, panels, linked-creation cards) uses raw literal colors and rounded-xl/rounded-lg arbitrary values instead of the --surface/--line/--radius-md tokens the sibling npc-registry and mechanics-module builders already use, the clearest token-drift gap in this batch.

## 34. `/studio/create/progression-profile` - distance 4/10

**Purpose:** Lets a creator define reusable cumulative-experience thresholds and level tiers to attach later to an Actor Mechanics Profile.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (reusable) - StudioPageHeader.view
- progression tier builder (inline) - ProgressionProfileBuilder.view, bespoke to this page
- JSON editor modal (inline) - ProgressionJsonEditorModal via shared ModalShell, but panelClassName hardcodes rounded-[var(--radius-md)] instead of the large radius floating chrome uses elsewhere

**Distance from draft:** The JSON editor is a floating panel (modal) but ships with STANDARD 12px radius instead of the LARGE radius the corner law reserves for anything that floats above the page, and its scrim (via shared ModalShell) carries no blur(2px).

## 35. `/studio/feedback` - distance 4/10

**Purpose:** Give creators a hub to follow the Crestfall roadmap, report bugs, submit suggestions, and reach the community Discord while formal feedback tooling is built.

**Structural blocks (top to bottom):**

- auth gate sign-in modal (reusable) - same shared modal as the other four pages
- page head (reusable) - StudioPageHeader, per source, not visible behind the gate
- development hub panel with card grid (inline) - bespoke 2x2 'Coming Soon' card grid, per source uses rounded-[var(--radius-md)] tokens correctly
- Discord/back-to-studio sidebar CTAs (inline) - per source these buttons use literal rounded-xl, not the two-tier radius tokens the draft law defines

**Distance from draft:** Visible render is only the shared modal, but the underlying source shows CTA buttons styled with a raw rounded-xl class instead of the standard --radius-md token, a token-law gap the render can't surface.

## 36. `/studio/games` - distance 4/10

**Purpose:** Let a creator start official Crestfall game experiences, resume active sessions, or browse curated playable rooms.

**Structural blocks (top to bottom):**

- auth gate sign-in modal (reusable) - same shared modal as the other four pages
- page head (desktop/mobile variants) (inline) - source hand-rolls a separate mobile eyebrow/title block instead of reusing StudioPageHeader for both breakpoints
- games hub content (inline) - GamesHub component, dedicated to this route, could not be rendered

**Distance from draft:** Source duplicates the page-head recipe by hand for mobile instead of letting the shared StudioPageHeader component handle both breakpoints, splitting one canonical pattern into two implementations.

## 37. `/studio/my-creations/example-id/image-library` - distance 4/10

**Purpose:** Let a creator manage the pool of generated images tied to one creation, assigning featured slots and hiding or deleting unwanted images.

**Structural blocks (top to bottom):**

- page head (custom card header) (inline) - does NOT use StudioPageHeader; builds its own eyebrow/title/description inside a bordered card, missing the ruled-mark eyebrow treatment of the shared recipe
- featured slots grid (inline) - bespoke FeaturedSlotCard, tokens (--radius-md, --surface-2, --line) used consistently
- filter/sort row (eligibility filter + sort select) (inline) - bespoke pill-style filter buttons using --radius-md, correct token usage
- image masonry grid with per-image slot/hide/delete actions (inline) - LibraryImageCard, HiddenImageCard bespoke; destructive Delete button is quiet ghost with visible word, matches destructive-control law
- delete confirmation (inline) - uses native window.confirm() dialog, not the unified floating-chrome modal frame the draft requires for any confirm step
- hidden images section (inline) - same card pattern repeated

**Distance from draft:** Page head bypasses the shared StudioPageHeader recipe entirely, and the destructive delete flow confirms via a native browser window.confirm() instead of the draft's unified floating-chrome confirm step.

## 38. `/studio/storylines` - distance 4/10

**Purpose:** Lets a creator link their existing Stories and Scenarios into an ordered continuing storyline with defined transition triggers.

**Structural blocks (top to bottom):**

- page head (eyebrow, display title, lede) (reusable) - StudioPageHeader
- heading + create action row (inline) - built directly in StorylinesHub.view.jsx
- loading / error state banner (inline)
- empty state panel (inline) - uses --radius-md (standard) though the draft rule reserves large radius for empty states
- storyline card grid (inline) - grid pattern local to this hub, not a shared card-grid component

**Distance from draft:** Missing the sticky filter bar, banner card, and endcap that define the six-page library skeleton, and the empty state uses standard --radius-md instead of the large radius the draft reserves for empty states.

## 39. `/studio/account` - distance 3/10

**Purpose:** The account hub, giving a signed-in creator a profile summary and links out to subscription, preferences, appearance, notifications, privacy, and safety settings.

**Structural blocks (top to bottom):**

- page head (StudioPageHeader) (reusable) - shared component, used in 50+ places
- profile summary (StudioAccountProfile) (reusable) - dedicated component with contract, view, viewmodel, README
- coins panel (StudioAccountCoins) (reusable) - same componentized pattern
- metrics panel (StudioAccountMetrics) (reusable) - same componentized pattern
- settings link grid (6 rows: subscription/preferences/appearance/notifications/privacy/safety) (inline) - cards built directly in the page, standard radius, matches shape law
- sign out link (inline)

**Distance from draft:** Page-head recipe and componentized sub-panels are correctly reused, but this settings-hub layout has no equivalent in the six-page library skeleton or the dashboard template, so its composition is judged on its own merits rather than matched to a named target pattern.

## 40. `/studio/create/image-preset` - distance 3/10

**Purpose:** Lets a creator build a reusable AI image-generation preset (style/medium, prompt stack, identity, rendering notes) that other studio assets can draw on.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink component, shared across all studio/create pages
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader.view.jsx, shared contract-driven component
- asset builder shell (form sections) (reusable) - AssetBuilderShell driven by assetBuilderConfigs.imagePreset, same shell used by location page

**Distance from draft:** Actual authenticated builder content could not be captured (render fell through to the auth sign-in gate at both widths), but the sign-in floating panel itself is compliant (large radius, standard-radius buttons, no pills) and code shows the page head follows the eyebrow/title/lede recipe via a shared component.

## 41. `/studio/create/location` - distance 3/10

**Purpose:** Lets a creator build a reusable location asset (rooms, districts, sublocations) for use across scenarios and lore.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- location builder shell (form) (reusable) - LocationBuilderShell, structurally parallel to AssetBuilderShell pattern

**Distance from draft:** Desktop render only reached the sign-in gate (compliant floating-chrome radius and rectangular buttons) and mobile render shows a mismatched dev-preview fixture rather than the real page, so the builder body is unverified visually; code shows the compliant shared page-head recipe is in place.

## 42. `/studio/create/lore` - distance 3/10

**Purpose:** Lets a creator author a structured, shareable lore sourcebook page with chapters, character references, and selected images.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- lore builder shell (form) (inline) - LoreBuilderShell, bespoke component for chapters/character refs/images

**Distance from draft:** Both renders reached only the sign-in gate, which is compliant with floating-chrome law (large radius panel, standard-radius rectangular buttons, no pill actions), and the underlying page code confirms the shared eyebrow/title/lede page-head recipe is used, but the lore builder body itself is unverified.

## 43. `/studio/create/wardrobe` - distance 3/10

**Purpose:** Let a signed-in creator build a reusable wardrobe of outfit presets to use as a character's default clothing source in chat and image generation.

**Structural blocks (top to bottom):**

- auth gate sign-in modal (reusable) - identical floating card rendered in place of page content on every unauthenticated studio route (app/login/page.js pattern)
- back link (reusable) - StudioBackLink component, used across studio create sub-pages, not visible behind the gate
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader, used in ~50 places app-wide, not visible behind the gate
- wardrobe builder body (inline) - WardrobeBuilder is bespoke to this route, could not be rendered

**Distance from draft:** Only the shared sign-in modal rendered; on mobile it floats centered with margin on all sides instead of docking to the bottom edge as the floating-chrome law requires.

## 44. `/studio/creations/example-id` - distance 3/10

**Purpose:** Show a public creation's profile (character or lore item) as a shareable detail page for browsing and engagement.

**Structural blocks (top to bottom):**

- auth gate sign-in modal (reusable) - same shared modal as the other four pages in this batch
- creation profile page body (inline) - CreationProfilePage component, dedicated to this route, could not be rendered (fixture id, and/or gate)

**Distance from draft:** Same shared modal renders; mobile placement again floats free instead of docking to the bottom edge per the floating-chrome law.

## 45. `/studio/story-rooms/example-id` - distance 3/10

**Purpose:** The live story-room chat workspace where a player converses inside an active scenario alongside cast and world-state context panels.

**Structural blocks (top to bottom):**

- story room header (title, scenario/mode, panel toggles, status pills) (inline) - built directly in StoryRoomChatShell.view.jsx, not the shared StudioPageHeader
- cast panel (left column) (reusable) - CastPanelComponent injected as a prop, componentized separately
- transcript / message list (reusable) - TranscriptComponent injected as a prop
- composer (message input) (reusable) - ComposerComponent injected as a prop
- state / runtime-mechanics panel (right column) (reusable) - StatePanelComponent + RuntimeMechanicsPanelComponent injected as props
- panel-reveal button (collapsed side panel toggle) (inline) - hand-built in StoryRoomChatShellView, uses rounded-2xl on a sticky inline control
- composer help modal (commands/quick help) (inline) - hand-built floating dialog inside the view rather than a shared Modal/Sheet component
- mobile cast/state drawer (reusable) - MobileDrawerComponent injected as a prop

**Distance from draft:** Panel-reveal toggle uses large-tier rounded-2xl on an inline sticky control rather than the standard radius the corner law reserves for controls, and the composer help dialog is a bespoke floating frame rather than the shared modal chrome, though radius tokens and page-head structure are otherwise close to target.

## 46. `/studio/templates/characters` - distance 3/10

**Purpose:** Lets a creator browse built-in and creator-made character templates to reuse when building a new character.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow, display title, lede) (reusable) - StudioPageHeader
- template card grid (inline) - CharacterTemplateGallery, local grid with disabled use/duplicate action buttons
- sticky sidebar (template-library blurb + create-template CTA) (inline)

**Distance from draft:** Cards and controls correctly use --radius-md/standard-rectangle geometry (never pill), but the page has no filter bar or endcap banner from the library skeleton and the create-template CTA uses a literal rounded-xl rather than the radius token.

## 47. `/studio/account/appearance` - distance 2/10

**Purpose:** A placeholder settings page reserving space for future theme, density, card-display, and motion preference controls.

**Structural blocks (top to bottom):**

- page head + back link (AccountStubPage/StudioPageHeader/StudioBackLink) (reusable) - shared AccountStubPage wrapper used by 7 settings pages
- placeholder card grid (4 cards: Theme, Density, Cards, Motion) (reusable) - rendered by the shared AccountStubPage.view, not bespoke per page
- placeholder notice strip (reusable) - shared ACCOUNT_STUB_NOTICE text and treatment

**Distance from draft:** Fully built from the shared AccountStubPage/StudioPageHeader components with standard-radius cards, but as a stub settings page it has no banner, filter bar, or grid-of-clickables to test against the library skeleton, so most of the draft's pattern surface is simply absent rather than violated.

## 48. `/studio/account/notifications` - distance 2/10

**Purpose:** A placeholder settings page reserving space for future email, room-activity, creator-alert, and moderation notification controls.

**Structural blocks (top to bottom):**

- page head + back link (AccountStubPage/StudioPageHeader/StudioBackLink) (reusable) - same shared wrapper as appearance/preferences
- placeholder card grid (4 cards: Email, Rooms, Creator, Moderation) (reusable)
- placeholder notice strip (reusable)

**Distance from draft:** Same shared AccountStubPage composition as the other stub settings pages, correct page-head recipe and standard-radius cards; distance is only nonzero because the stub has no banner or content-grid payoff to compare against the target's richer library skeleton.

## 49. `/studio/account/privacy` - distance 2/10

**Purpose:** Lets a creator manage profile visibility, public activity exposure, discoverability, and blocked-user settings for their account (currently a stub of forthcoming controls).

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLinkView, shared with every account sub-page
- page head (eyebrow/title/lede) (reusable) - StudioPageHeaderView, matches the eyebrow-plus-ruled-mark -> display title -> lede recipe exactly
- 2-col info card grid (reusable) - AccountStubPageView, shared by privacy/safety/subscription, radius-md on cards
- notice strip (reusable) - same shared component, optional text block
- return-to-account link (reusable) - shared footer link but styled with hardcoded rounded-xl instead of the --radius-md token

**Distance from draft:** Page-head recipe and card-grid radius are correct, but the return-link is built on a literal rounded-xl class instead of the shared radius token, and the page is an inert placeholder stub with no live controls yet.

## 50. `/studio/account/safety` - distance 2/10

**Purpose:** Lets a creator manage content-rating comfort settings, discovery filters, and future moderation/report tools for their account (currently a stub of forthcoming controls).

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLinkView
- page head (eyebrow/title/lede) (reusable) - StudioPageHeaderView, on-pattern
- 2-col info card grid (reusable) - AccountStubPageView, identical structure to privacy/subscription
- notice strip (reusable)
- return-to-account link (reusable) - same hardcoded rounded-xl instead of --radius-md token

**Distance from draft:** Same shared AccountStubPage composition as privacy/subscription: correct page-head and card radius, only flaw is the literal rounded-xl on the return link instead of the standard-radius token.

## 51. `/studio/account/subscription` - distance 2/10

**Purpose:** Lets a creator view plan tier, billing/renewal, premium feature access, and purchase history for their account (currently a stub of forthcoming controls).

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLinkView
- page head (eyebrow/title/lede) (reusable) - StudioPageHeaderView, on-pattern
- 2-col info card grid (reusable) - AccountStubPageView, identical structure to privacy/safety
- notice strip (reusable)
- return-to-account link (reusable) - same hardcoded rounded-xl instead of --radius-md token

**Distance from draft:** Same shared AccountStubPage composition as its siblings: page-head and card radius are correct, only flaw is the literal rounded-xl on the return link instead of the standard-radius token.

## 52. `/studio/community` - distance 2/10

**Purpose:** Lets creators browse and search public creations and public creator profiles across Crestfall, with tag/type/rating filters and a creations-vs-creators mode toggle.

**Structural blocks (top to bottom):**

- page head (eyebrow/title/lede) (reusable) - StudioPageHeader, on-pattern
- sticky filter bar (reusable) - ResponsiveFilterPanel, shared filter chrome with search input, tag/type/rating pills, sort selects
- mode toggle (Creations/Creators) (reusable) - segmented control inside the filter panel, radius-md, not a pill
- content grid (creation cards or creator cards/list) (reusable) - CreationCard, CreatorCard, CreatorListRow all shared components used elsewhere
- empty state (reusable) - dashed radius-lg panel, correct large-tier corner for a full-width empty state
- load-more control (reusable) - radius-md button, centered
- error banner (inline) - raw red border/bg, explicitly flagged in code comments as an intentional out-of-scope exception to the token system

**Distance from draft:** This is close to a textbook instance of the six-page library skeleton (head -> filter bar -> grid), with correct radius tiers throughout; the only deviation is the hand-picked red error banner that bypasses the status-danger token.

## 53. `/studio/create/mechanics-module` - distance 2/10

**Purpose:** Lets a creator build a reusable mechanics module (meters, counters, flags, stages, triggers, effects, guards) that can be attached to characters or rooms.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink shared across studio/create pages
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader, used in 25+ studio/create pages, matches eyebrow -> display title -> lede recipe exactly
- tabbed builder shell (tabs + panel + summary aside) (reusable) - MechanicsModuleBuilderShell -> view/viewmodel/contract split shared with narrator and npc-registry builders, radius-md on all panel/tab/control siblings via tokens
- runtime fields section (reusable) - MechanicsModuleFieldsSection is imported from a shared my-creations/edit sections folder, used 40+ places

**Distance from draft:** Uses the shared page-head recipe and a token-driven radius-md builder shell throughout; only gap is this is a create/editor template (not the library/browse or dashboard skeleton) so it sits outside those two named templates by category, not by violation.

## 54. `/studio/create/narrator` - distance 2/10

**Purpose:** Lets a creator author a reusable narrator voice/persona to attach to story rooms, scenarios, and roleplay sessions.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader, identical recipe to mechanics-module and npc-registry pages
- tabbed builder shell (reusable) - NarratorBuilderShell delegates to a dedicated view/viewmodel pair under narrator-builder/, same architecture pattern as the other two builders

**Distance from draft:** Same shared page-head and tab/panel scaffold as the other create pages, token-driven radius-md throughout; deviation is only that it's an editor template rather than the library or dashboard skeleton.

## 55. `/studio/create/npc-registry` - distance 2/10

**Purpose:** Lets a creator build a reusable NPC relationship, alias, faction, and knowledge continuity registry that story rooms attach.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (eyebrow/title/lede) (reusable) - StudioPageHeader
- tab row (reusable) - radius-md, gold-action active state, token-driven; same pattern reused across builder shells
- tab content panel (overview/entries/relationships/knowledge/aliases) (reusable) - consistent radius-md article cards for each entry, SectionHeader subcomponent reused per tab
- sticky summary aside with Save action (reusable) - gold gradient CTA button, radius-md, status-success/status-danger tokens for save feedback text, matches badge/status law of word-plus-token
- row delete controls (reusable) - SmallDangerAction: ordinary rectangular geometry, ghost/outline styling, visible 'Delete' word beside Trash2 icon, no filled danger-red outside a confirm step, matches destructive-control law

**Distance from draft:** Follows the page-head recipe and destructive-control law closely (quiet ghost delete with visible word); minor gap is raw rounded-xl/black/35/white-10 literals on text inputs instead of surface/radius tokens used elsewhere on the same page.

## 56. `/studio/create/outfit` - distance 2/10

**Purpose:** Lets a creator define a reusable outfit asset (name, tags, source images) that can later be attached to characters or generation prompts.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink shared across all /studio/create/* pages
- page head (eyebrow + title + lede) (reusable) - StudioPageHeader.view, matches draft page-head recipe exactly
- asset builder shell (form panel, sticky aside, upload/gallery grid) (reusable) - AssetBuilderShell + assetBuilderConfigs.outfit, same shell reused by pose/wardrobe/image-preset etc.

**Distance from draft:** Page head and builder shell both use --radius-md consistently on grid-sibling cards/controls with no pill-shaped buttons, closely tracking the draft's corner and shape law; only render evidence available is the auth gate, so composition judged from a well-token-disciplined shared component.

## 57. `/studio/create/player-character` - distance 2/10

**Purpose:** Lets a user build a player-identity profile (name, description, portrait) to bring into stories, rooms, and future image generation.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (reusable) - StudioPageHeader.view
- identity/portrait form with sticky preview aside (inline) - PlayerCharacterCreator.view is bespoke to this page, not shared with the asset-builder shell

**Distance from draft:** Page head recipe intact and all panels/controls use --radius-md/rounded-xl consistently with no pill misuse, but the builder itself is a one-off inline component rather than the reusable asset-builder shell used elsewhere.

## 58. `/studio/create/pose` - distance 2/10

**Purpose:** Lets a creator define a reusable pose asset (reference images, tags) for later attachment to character generation.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (reusable) - StudioPageHeader.view
- asset builder shell (reusable) - same AssetBuilderShell + assetBuilderConfigs.pose as /studio/create/outfit

**Distance from draft:** Identical shared shell to outfit; same tight token discipline on corners and no pill-shaped interactive controls, only the config differs.

## 59. `/studio/create/quest-registry` - distance 2/10

**Purpose:** Lets a creator assemble a reusable quest spine (hooks, tasks, leads, requirements, branches, rewards) for later attachment to stories.

**Structural blocks (top to bottom):**

- back link (reusable) - StudioBackLink
- page head (reusable) - StudioPageHeader.view, eyebrow 'Objective Spine'
- structured registry builder (entry list, editor, linked-creation groups) (reusable) - StructuredRegistryBuilder is a generic shell parameterized by registryType, likely reused by npc-registry/item-registry/etc.
- linked-creation picker modal (reusable) - RegistryLinkedCreationPickerModal correctly uses --radius-lg for its floating panel, but the scrim has no blur
- delete-entry control (inline) - quiet ghost button, status-danger text with visible 'Delete Entry' word beside it, matches destructive-control law

**Distance from draft:** Floating picker modal correctly takes the LARGE radius and destructive delete control is properly quiet-ghost-with-word, the only gap being the missing blur(2px) on the scrim shared by all modals in the app.

## 60. `/studio/my-creations` - distance 2/10

**Purpose:** Let a creator browse, filter, and manage all of their own drafts, private, and shared creations from one library hub.

**Structural blocks (top to bottom):**

- page head (StudioPageHeader) (reusable) - components/studio/StudioPageHeader.jsx used across studio pages, matches eyebrow+ruled-mark, display title, lede recipe
- filter panel (search + tag filter + status tabs) (reusable) - ResponsiveFilterPanel, CreationTagFilterRow shared components
- action row (grid toggle + Create New) (inline) - built inline in MyCreationsHub.view.jsx, buttons use hardcoded rounded-xl instead of --radius-md token
- creation card grid (reusable) - CreationCard shared component, used context=owner
- empty state (inline) - bespoke dashed-border block inside MyCreationsHubView
- load more control (inline) - rounded-xl button, not a shared CTA component

**Distance from draft:** Page head and card grid match the target closely; only gap is action-row and load-more buttons using hardcoded rounded-xl instead of the --radius-md token, a minor corner-law slip.

## 61. `/studio/my-creations/example-id/edit` - distance 2/10

**Purpose:** Give a creator a single editing workspace to revise a creation's media, sections, and metadata before publishing.

**Structural blocks (top to bottom):**

- page head (StudioPageHeader) (reusable) - same shared header as my-creations
- media panel + mechanics quick nav column (inline) - layout composed directly in CreationEditShell.view.jsx
- editing summary card (title, ID, Set Default PC, section tabs) (inline) - bespoke card, uses --radius-md correctly but action button is rounded-xl not token
- section content panel (inline) - wraps whatever section is active; --radius-md token used correctly
- sticky action bar / featured image picker (reusable) - passed in as slots, likely shared floating controls, not directly rendered by this view

**Distance from draft:** Page head and card corners follow the token system correctly; the one deviation is the Set-Default-PC button using rounded-xl instead of the --radius-md token.

## 62. `/studio/official-characters` - distance 2/10

**Purpose:** Let players browse and search Crestfall's official canon character roster to find characters usable in canon-aware play and story rooms.

**Structural blocks (top to bottom):**

- page head (StudioPageHeader) (reusable) - shared header component, correct recipe
- search/result-count bar (inline) - bespoke row in OfficialCharactersGrid.view.jsx; search input uses rounded-full (pill) styling on an input field, not a control governed by the pill-vs-rectangle shape law but a stylistic outlier vs. the rest of the app's --radius-md inputs
- character card grid (reusable) - PaginatedCardGrid + StudioCharacterCardView, both shared components
- empty state (inline) - bespoke centered message block using --radius-md correctly

**Distance from draft:** Page head and card grid are fully shared components matching the target closely; the only deviation is the pill-shaped search input, which breaks from the app's standard --radius-md input styling.

## 63. `/studio/play` - distance 2/10

**Purpose:** Entry point that should route a visitor into active gameplay, but the render captured is the shared sign-in gate blocking unauthenticated access.

**Structural blocks (top to bottom):**

- sign-in modal card (reusable) - matches app/login/page.js markup 1:1 (CRESTFALL STUDIO eyebrow, Sign in title, Continue with Google, divider, email field, Send login link) -- shared auth gate, not bespoke to this route
- close (X) control (reusable) - circular icon button, consistent across all four gated renders in this batch

**Distance from draft:** The gate itself already carries the page-head recipe (gold eyebrow, Cormorant title) and standard-radius controls correctly, but the modal card uses --radius-lg on a floating panel that is centered rather than docked to the bottom edge on the mobile render, a minor floating-chrome law deviation.

## 64. `/studio/profile/crestfallen` - distance 2/10

**Purpose:** Should show a public/own creator profile page (bio, banner, stats) for the user 'crestfallen', but the auth gate renders instead of the profile content.

**Structural blocks (top to bottom):**

- sign-in modal card (reusable) - identical shared component as /studio/play, confirms this is the global auth gate, not a page-specific block

**Distance from draft:** Only the shared gate is visible so the actual profile/creator-card composition cannot be judged here; the gate itself is on-pattern except its floating panel does not dock to the bottom edge on phone width as the unified floating-chrome law requires.

## 65. `/studio/profile/crestfallen/connections` - distance 2/10

**Purpose:** Should list a creator's followers/following connections, but again only the shared sign-in gate rendered for this unauthenticated capture.

**Structural blocks (top to bottom):**

- sign-in modal card (reusable) - identical shared component, third repeat in this batch -- confirms one central auth gate rather than per-page bespoke gates

**Distance from draft:** Same as the other gated captures: the actual connections-list composition (likely a card grid) is unverifiable from this render, and the only flaw visible on the gate itself is the non-bottom-docked panel at phone width.

## 66. `/studio/submit-canon` - distance 2/10

**Purpose:** A placeholder landing page describing the future curated review process for submitting standout characters, rooms, events, or storylines to canon.

**Structural blocks (top to bottom):**

- page head (eyebrow, display title, lede) (reusable) - StudioPageHeader
- coming-soon panel with feature-item chips (reusable) - StudioComingSoon, a shared placeholder component with its own contract/fixtures

**Distance from draft:** Correct page-head recipe and consistent --radius-md tokens throughout; only gap is that as a stub page it has no content grid or banner treatment to compare against the library skeleton at all.

## 67. `/` - distance 1/10

**Purpose:** Site entry hero introducing the Crestfall lore archive and routing visitors into the archive, chronicle, or studio.

**Structural blocks (top to bottom):**

- top nav / crest wordmark (reusable) - shared header appears identically across all sampled pages
- hero (eyebrow + display title + lede) (reusable) - matches the page-head recipe used on browse pages
- CTA button row (inline) - three bordered buttons, standard-radius rectangles, correctly non-pill

**Distance from draft:** Hero follows the eyebrow -> display-font title -> lede recipe closely with standard-radius CTA buttons; only minor deviation is the desktop CTA row being page-specific rather than a named shared hero component.

## 68. `/characters` - distance 1/10

**Purpose:** Browse and filter the full character roster of the Crestfall archive.

**Structural blocks (top to bottom):**

- top nav / crest wordmark (reusable)
- page head (eyebrow + display title + lede) (reusable) - identical recipe to chronicle and root
- search + filter bar (search input, realm/gender/race/era dropdowns, clear) (reusable) - same filter bar shape reused on /chronicle
- tag/chip scroller (ALL, ACADEMIA, ADMINISTRATION...) (reusable) - pill-shaped chips, correct per pill law since these are non-interactive category labels
- card grid (character portrait tiles) (reusable) - standard-radius grid siblings
- scroll-to-top / dev issue badge (floating corner controls) (inline)

**Distance from draft:** Matches the library/browse skeleton (page head -> filter bar -> card grid) closely with correct pill-vs-standard radius usage throughout.

## 69. `/chronicle` - distance 1/10

**Purpose:** Browse the living chronicle, i.e. the ongoing story record filterable by realm and faction, with an endcap for unreleased content.

**Structural blocks (top to bottom):**

- top nav / crest wordmark (reusable)
- page head (eyebrow + display title + lede) (reusable)
- search + filter bar (search, realm/faction dropdowns, clear) (reusable) - same shape as /characters filter bar
- tag scroller (ALL) (reusable)
- empty-state / coming-soon endcap banner (reusable) - large-radius bordered panel, matches endcap treatment for full-width empty states

**Distance from draft:** Full library skeleton present and correctly composed, with the empty-state endcap using the large radius the draft reserves for full-width banners.

## 70. `/studio/my-creations/example-id/preview` - distance 1/10

**Purpose:** Show a Lore creation's owner a read-only preview of their saved draft exactly as the published document renderer will present it, before it goes live.

**Structural blocks (top to bottom):**

- back link + owner-only draft badge row (inline) - bespoke top row; badge uses rounded-full pill for a non-interactive status label, correct pill usage per shape law
- lore document renderer (reusable) - components/studio/create/lore/LoreDocumentRenderer.jsx, shared between owner preview and public read paths via publicHref/testBanner props
- test/draft banner (reusable) - passed as showTestBanner prop into the shared renderer, not a bespoke banner build

**Distance from draft:** Composition is almost entirely the shared LoreDocumentRenderer with a thin bespoke top bar; the only note is the owner-only badge being pill-shaped, which is correct since it is a non-interactive label, not a control.

## 71. `/studio/create/mechanics-loadout` - distance 0/10

**Purpose:** Legacy URL that exists only to redirect creators to the current actor-mechanics-profile builder.

**Structural blocks (top to bottom):**

- redirect (no render) (inline) - page.js body is a single Next.js redirect() call to /studio/create/actor-mechanics-profile, no UI of its own

**Distance from draft:** Not a rendered surface at all, a server-side redirect stub, so there is no composition to score against the draft pattern.
