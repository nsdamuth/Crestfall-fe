# App function map

Generated from docs/APP-FUNCTION-MAP.csv by a script. Do not edit by hand;
regenerate after editing the CSV. No fact appears here that is absent from the CSV.

Coverage: 63 surfaces, 844 controls. Status counts: working 782, gated 5, stubbed 48, broken 9.

## Flags (everything not plainly working)

- **BROKEN** `/ (site shell)` / footer / Terms of Service link: Links to /terms/service (Target slug service does not exist in data/policies.js (real slug is terms-of-service); this link 404s via notFound() in app/terms/[slug]/page.js)
- **BROKEN** `/ (site shell)` / footer / Contact link: Links to /contact (No app/contact route found in repo listing seen so far; unverified, flagged as risk)
- **STUBBED** `/studio/* (studio shell)` / top bar (desktop) / Search: Presentation-only global search field, not yet wired to a search operation. (No search contract or endpoint exists yet; onSearchChange is a safe no-op until a CR is answered. See docs/CONTRACT-REQUESTS.md.)
- **STUBBED** `/studio/* (studio shell)` / top bar (desktop) / Notifications: Opens a popup panel listing notifications; idle icon with a gold-glow state when notifications exist. (No notification data source exists yet; the viewmodel defaults to an empty list. Real data needs a services-api contract (CR pending). See docs/CONTRACT-REQUESTS.md.)
- **BROKEN** `/stories/[...slug]` / page component / (none - file is empty): app/stories/[...slug]/page.js is a literal 0-byte file with no default export; Next.js has no valid page module for this route (Confirmed via wc -l returning 0 and ls -la showing 0 bytes; matches docs/REDESIGN-ORDER.md item 1 which already flags this as a dead route)
- **STUBBED** `/studio/profile` / page head / Edit Soon: Nothing; the button is rendered with the disabled attribute and no onClick handler. (Entire page is hardcoded fixture markup (featuredItems array, hand-typed stats string, static 'crestfallen' identity); no server/client data fetch exists anywhere in this file.)
- **STUBBED** `/studio/profile` / tab bar / Featured / Characters / Storys / Images & Presets / Updates / Activity tabs: Nothing; every tab button is rendered with the disabled attribute and no onClick handler, only the first is visually 'active'. (Tab labels are a hardcoded array; no tab switching logic exists.)
- **STUBBED** `/studio/profile` / featured items grid / Featured item cards (Chronicle Update / Featured Story / Updated Character): Renders three hardcoded fixture articles; not connected to any real content. (This is the /studio/profile route (signed-in user's own hub), distinct from the working /studio/profile/[username] public profile route below.)
- **STUBBED** `/stories` / filter bar / Search / Realm / Faction filter controls: FilterableIndex rendered against a hardcoded empty stories=[] array declared in the page component, so search/filter/tag controls render but always operate on zero entries (let stories = [] hardcoded in app/stories/page.js with no data source wired at all; a real stories dataset (like data/characters.js) does not exist yet, see nick[])
- **STUBBED** `/stories` / coming soon panel / The fragments are still being catalogued. (coming soon block): Static explanatory copy indicating stories content is not yet populated
- **STUBBED** `/studio/story-rooms` / mobile toolbar drawer / Start Room Soon: Disabled placeholder for a future direct room-start action. (Always disabled, no handler.)
- **BROKEN** `/studio` / page head / Search games, rooms, characters...: Renders a text/search input with a placeholder; has no onChange, no state, no submit handler of any kind. (Not wired to anything at all: typing does nothing, no results, no navigation.)
- **BROKEN** `/studio/create/room-template` / Multiplayer section / Add Player: Sets picker state to 'players', intending to open a mutual-followers picker so an invitee can be toggled into invitedPlayers. (useRoomTemplatePickerViewModel's PICKER_CONFIGS map has no 'players' entry, so opening this picker silently falls back to the empty 'reference' config: items is always [], and onToggleCharacter/onSelectScenario/etc are called instead of the passed onTogglePlayer, which is never wired into chooseItem. The modal opens showing 'No references found' and mutual followers can never actually be selected, even though /api/profile/mutuals is fetched successfully on page load.)
- **STUBBED** `/studio/create/room-template` / Display Media section / Choose From Media Library Soon: Permanently disabled button; no handler. (Explicit disabled coming-soon placeholder; page copy says media library selection ships later.)
- **STUBBED** `/studio/create/scenario` / Middleware section / Middleware module toggle tiles (phase_gates, reward_gates, knowledge_boundaries, hidden_media_unlocks, time_weather, recap_support): Toggles enabledModules[moduleId] boolean; described as 'future platform-level supports' with no runtime effect yet. (middlewareModules list from constants.js; values are saved into creation payload.data.middleware_modules but the copy itself says these are intent-only placeholders.)
- **STUBBED** `/studio/create/storyline` / builder sidebar / Content Rating: Native <select> bound to form.contentRating; only SFW option exists. (CONTENT_RATING_OPTIONS is a single-entry array (SFW only), so this control offers no real choice yet.)
- **STUBBED** `/studio/image-studio` / composer (video mode) / Duration / Video Aspect / Motion Style selects: Local-state-only selects for a future video generation configuration. (Panel text says explicitly: 'these controls are placeholders only and do not call an API yet.')
- **STUBBED** `/studio/image-studio` / composer (video mode) / Video Direction textarea: Local-state-only text field for future video motion direction.
- **STUBBED** `/studio/image-studio` / composer (video mode) / Generate Video Soon: Disabled button, no handler, no API call. (There is no video generation client function anywhere in lib/client/studio/image-studio/imageStudioClient.js.)
- **STUBBED** `/studio/image-studio` / media lightbox / Remix Soon: Disabled placeholder button, no handler.
- **STUBBED** `/studio/image-studio` / media lightbox / Use as Reference Soon: Disabled placeholder button, no handler.
- **STUBBED** `/studio/image-studio` / media lightbox / More Soon: Disabled placeholder button, no handler.
- **STUBBED** `/studio/account/preferences` / page defaults card grid / Community/My Creations/Browsing/Image Studio/Creation Flow/Discovery option buttons (bespoke PreferenceCard, 6 cards x 3 options each): All option buttons render with the disabled attribute and no onClick handler; they are non-interactive visual placeholders for future default settings, one option per card visually highlighted as the current default. (Bespoke PreferenceCard defined locally in this page file, distinct from the shared AccountStubPage card used by the other 5 stub pages. Every button element has disabled prop.)
- **STUBBED** `/studio/create/character` / character template modal / Built-In / My Templates / Community: Switches template source tab; only Built-In renders a real grid. (My Templates and Community tabs render a static "Templates Soon" placeholder regardless of any real saved/community templates – intentional coming-soon stub, no fetch attempted.)
- **STUBBED** `/studio/create/location-registry` / Runtime Rules tab / Middleware Intent list: Read-only bullet list of registry.middlewareHints.intendedUse strings; no control to edit it in this builder. (data seeded by createStarterLocationRegistry/normalizer defaults, not user-editable in this builder)
- **STUBBED** `/studio/feedback` / development hub panel - card grid / Public Roadmap / Bug Reports / Suggestions / Release Notes (all 'Coming Soon'): Static, non-interactive 2x2 card grid built from a hardcoded feedbackCards array; no clicks, no links, no data source.
- **STUBBED** `/studio/my-creations/[id]/image-library` / lightbox (modal) / Remix Soon / Use as Reference Soon / More Soon: Nothing; rendered permanently disabled as coming-soon placeholders. (StubToolbarButton, disabled=true, no onClick wired. Not mentioned in REDESIGN-ORDER entry for this route.)
- **GATED** `/studio/account` / profile summary form / Content Preference: Selects SFW/Mature/Explicit content rating preference; choosing Mature or Explicit opens an age-verification-required notice modal and the value is NOT applied (only SFW commits directly). (Uses shared components/ui/CrestfallSelect. Mature/Explicit options are visible/selectable but functionally blocked pending age verification.)
- **STUBBED** `/studio/account` / profile summary form / Age Verification Required modal (OK / X): Informational modal explaining Mature/Explicit preferences are inactive pending age verification; both OK and X close it without changing content_rating_preference. (Intentional placeholder pending age verification feature.)
- **STUBBED** `/studio/account` / profile media manager / Choose Soon (Avatar): Disabled placeholder for selecting an active avatar image; no handler wired. (avatarUrl is hardcoded null in the viewmodel; button has disabled attribute, no onClick. Shared with public profile edit surfaces (out of this assignment).)
- **STUBBED** `/studio/account` / profile media manager / Choose Soon (Banner): Disabled placeholder for selecting an active profile banner image; no handler wired. (bannerUrl is hardcoded null; disabled button with no onClick.)
- **STUBBED** `/studio/account` / coins panel / Buy Coins Soon: Opens an informational modal stating coin purchases are not yet available; admins can manually add coins during testing. (Intentional placeholder, purchases not built.)
- **STUBBED** `/studio/account` / coins panel / Buy Coins info modal (Got it / X): Closes the coin-purchase-not-available modal.
- **BROKEN** `/studio/account` / coins panel / Characters / Canon / Messages / Likes stat tiles (inside Coins panel): Renders a 4-tile stat grid, but the values are a hardcoded local constant that always reads "0" regardless of the account fetched; it is never populated from fetchCurrentStudioAccount or any metrics call. (STAT_ITEMS is a static array of zero values in useStudioAccountCoinsViewModel.js; dead display, always shows 0/0/0/0 while the correct live metrics render just below in the separate StudioAccountMetrics panel.)
- **BROKEN** `/studio/create/image-preset` / Builder sidebar / Location-only panels (Parent Location, Runtime Inheritance, Runtime Modules): Dead code path: AssetBuilder.view.jsx contains full LOCATION-branch UI (LocationParentPanel, RuntimeInheritancePanel, weather runtime slot), gated on creationType === 'LOCATION', but no route ever mounts AssetBuilderShell with a LOCATION config (the Location route uses the separate LocationBuilderShell). This code is unreachable through the app's current routing. (Not a user-facing hazard today (nothing routes to it), but flagged since redesign work could waste effort restyling unreachable markup, or a future route change could accidentally activate it.)
- **STUBBED** `/studio/create/location` / Cover Image card / Candidate cover tiles / Rendering Style / Number of Test Images: Same placeholder cover-candidate mechanism as the AssetBuilderShell routes (selects a fake candidate id, no real image generation). (Placeholder tiles labeled 'Placeholder'; matches the stubbed pattern noted on /studio/create/outfit.)
- **GATED** `/studio/story-rooms/[id]` / cast panel / Set Player Character: Opens the Default Player Character picker; only visible while turnCount is 0 (room not yet started). (Gated by canSetPlayerCharacter = turnCount === 0.)
- **STUBBED** `/studio/story-rooms/[id]` / composer / Scene Image Soon / Use Current Scene: Disabled placeholders for future scene-image generation and scene-context reuse. (Desktop composer only.)
- **STUBBED** `/studio/story-rooms/[id]` / composer (mobile tools drawer) / Scene Image / Current Scene / Export / Share: Disabled placeholders mirroring the desktop stub buttons plus export/share.
- **STUBBED** `/studio/story-rooms/[id]` / state panel / Export Chat Soon / Share Snapshot Soon: Disabled placeholders for future export/share of the room state.
- **STUBBED** `/studio/templates/characters` / template card grid / Use Template Soon: Disabled placeholder button, no handler. (button disabled=true, intentional placeholder per label copy.)
- **STUBBED** `/studio/templates/characters` / template card grid / Duplicate Soon: Disabled placeholder button, no handler. (button disabled=true, intentional placeholder per label copy.)
- **STUBBED** `/studio/account/appearance` / placeholder card grid / Theme Mode / Display Density / Card Display / Motion & Effects cards: Renders 4 static informational cards from a hardcoded array; no interactive controls. (Same AccountStubPage wiring as notifications/privacy/safety/subscription. Cards array is passed as a page.js prop, fixture data.)
- **STUBBED** `/studio/account/notifications` / whole page / Back to Account / card grid / Return to Account: Same AccountStubPage composition as appearance: back link, 4 static info cards (Email, Rooms, Creator, Moderation), placeholder notice, return link. No interactive/data-bound controls. (same AccountStubPage wiring)
- **STUBBED** `/studio/account/privacy` / whole page / Back to Account / card grid / Return to Account: Same AccountStubPage composition: back link, 4 static info cards (Profile, Activity, Discovery, Blocking), placeholder notice, return link. (same AccountStubPage wiring)
- **STUBBED** `/studio/account/safety` / whole page / Back to Account / card grid / Return to Account: Same AccountStubPage composition: back link, 4 static info cards (Content Rating, Comfort, Discovery, Moderation), placeholder notice, return link. (same AccountStubPage wiring)
- **STUBBED** `/studio/account/subscription` / whole page / Back to Account / card grid / Return to Account: Same AccountStubPage composition: back link, 4 static info cards (Plan, Billing, Premium, History), placeholder notice, return link. (same AccountStubPage wiring)
- **STUBBED** `/studio/create/outfit` / Builder sidebar / Generate Test Images Soon: Nothing; button is permanently disabled. (Hardcoded disabled attribute in JSX; intentional coming-soon placeholder.)
- **STUBBED** `/studio/create/outfit` / Cover image panel / Candidate cover tiles (Candidate 1..N): Selects a placeholder candidate id as the chosen cover; tile count driven by the Number of Test Images select. (No actual image generation happens; tiles are inert placeholders labeled 'Candidate N'. Selected value is only stored client-side as selected_cover in the save payload, never used for a real image.)
- **BROKEN** `/studio/my-creations/[id]/edit` / shell chrome / editor header / Set Default PC: For PLAYER_CHARACTER creations, calls setDefaultPlayerCharacter to mark this creation as the user's default player character. (Success/error message (defaultPcStatus/defaultPcError) is computed in the viewmodel but never passed to the view or rendered -- user gets no feedback after clicking.)
- **BROKEN** `/studio/my-creations/[id]/edit` / media panel / Chat Media section (for chat-capable types: Character, Player Character, etc.): Intended to show chat avatar/identity media context; currently renders only the literal text '...'. (ChatMediaSlot component is defined in the file but never rendered; supportsChatMedia branch outputs literal '...' text.)
- **STUBBED** `/studio/my-creations/[id]/edit` / overview section / Preview Soon: Intended to open an owner preview; currently a no-op, permanently disabled. (previewDisabled hardcoded true in the view's defaults.)
- **STUBBED** `/studio/my-creations/[id]/edit` / publishing section / Convert To Template Soon / Duplicate Template Soon / Use Template Soon: Placeholder template-management actions; all permanently disabled, no onClick handler at all. (getTemplateActions() hardcodes disabled:true and no click handler is even wired in the view.)
- **GATED** `/studio/my-creations/[id]/edit` / sticky action bar / Public: Displays whether the creation is currently PUBLIC; permanently disabled, cannot be set directly by the owner. (Hardcoded disabled:true; title text explains public visibility is granted only via review approval.)
- **GATED** `/studio/my-creations/[id]/edit` / identity section (Character-like types) / Custom Species: Free-text species value, shown only when Species select = Custom. (Conditionally rendered field.)
- **GATED** `/studio/my-creations/[id]/edit` / identity section (Character-like types) / Custom Gender Presentation: Free-text gender presentation value, shown only when select = Custom.
- **STUBBED** `/studio/official-characters` / character card grid / Start: Disabled placeholder button, no handler, no route to start a chat/session with this character. (button disabled with opacity-45, no comment marking intent but visually a placeholder.)
- **STUBBED** `/studio/play` / card grid / Start Canon Session: StudioActionCard rendered with disabled=true; card renders as a non-interactive div (not a link), footer text reads 'Coming Soon' instead of an action label. (No href passed to StudioActionCard at all; permanently disabled regardless of any future data.)
- **STUBBED** `/studio/play` / card grid / Continue Chronicle: Same disabled StudioActionCard pattern as Start Canon Session; resumes active storylines once wired.
- **STUBBED** `/studio/play` / card grid / Current Events: Same disabled StudioActionCard pattern; would follow active world developments/faction conflicts/seasonal Chronicle events.
- **STUBBED** `/studio/submit-canon` / coming-soon panel / What this section will support (Feature one/Feature two/Feature three chips): Renders StudioComingSoon with a hardcoded items array whose entries are still literally placeholder strings 'Feature one', 'Feature two', 'Feature three'; no real feature descriptions, no controls of any kind. (Copy 'Backend behavior will be connected later' confirms this is an intentional stub with unfinished placeholder copy, not just unconnected UI.)

## Pages

### `/ (site shell)`

Shared public chrome (header, footer, scroll controls) rendered across public lore pages.

**top nav**

- Crestfall wordmark / crest logo (link): Links to / (home)
- Intro / Lore / Characters / Locations / Factions / Stories / Chronicle / Studio (link): Static nav links to their respective routes; hidden below md breakpoint (no mobile nav in this component)

**footer**

- Lore / Characters / Locations / Factions / Stories / Chronicle nav links (link): Static footer nav links to archive sections
- Privacy Policy link (link): Links to /terms/privacy-policy
- Terms of Service link (link): Links to /terms/service; **BROKEN**
- Policies link (link): Links to /terms
- Contact link (link): Links to /contact; **BROKEN**

**floating corner controls**

- Scroll to top (button): window.scrollTo top, smooth; data: local_state
- Scroll to bottom (button): window.scrollTo document.body.scrollHeight, smooth; data: local_state


### `/studio/* (studio shell)`

Shared chrome (sidebar, mobile nav, top bar, account/economy) mounted around every authenticated studio page.

**sidebar - brand/collapse**

- Collapse sidebar / Expand sidebar (button): Toggles sidebar between 56-wide expanded and 16-wide icon-only collapsed layout; pure client state, no persistence.; data: local_state

**sidebar - primary nav**

- Lore Archive, Studio Home, Create, Games, Stories, Image Studio, Official Characters, Storylines, My Creations, Community (link): Next.js Link navigation to the corresponding studio/site routes; active route highlighted via usePathname match.; data: fixture

**sidebar - utility nav**

- Feedback & Updates, Account, Terms & Policies (link): Next.js Link navigation to utility routes.; data: fixture

**sidebar - community links**

- Community Links (expand/collapse) / Discord (toggle): Toggles visibility of external social links section; Discord is an external anchor (target=_blank) to a fixed Discord channel URL.; data: local_state

**sidebar - account footer**

- Log out (link): Anchor to /logout which calls supabase.auth.signOut() server-side and redirects to site root.; wired to `GET /logout`; missing states: empty/loading/error

**sidebar card / mobile header - economy widget**

- Coin balance display (display): Shows coin balance loaded from account snapshot. Buy Coins is no longer offered from shared chrome (removed from the top bar Phase 2; not replaced elsewhere).; wired to `fetchCurrentStudioAccount GET /api/profile/me`; missing states: empty/error

**top bar (desktop)**

- Search (input): Presentation-only global search field, not yet wired to a search operation.; data: none; **STUBBED**
- Notifications (button): Opens a popup panel listing notifications; idle icon with a gold-glow state when notifications exist.; data: local_state; **STUBBED**

**top bar (desktop) / mobile header**

- Account (link): Navigates to /studio/account.

**mobile nav - top header**

- Open menu / Close menu (button): Opens/closes the full-screen mobile drawer navigation.; data: local_state

**mobile nav - bottom tab bar**

- 5 bottom nav icons (link): Fixed bottom nav Link icons for quick route switching on phone width.; data: fixture


### `/stories/[...slug]`

Intended to present a single inserted-fiction story detail page; the route has no implementation.

**page component**

- (none - file is empty) (display): app/stories/[...slug]/page.js is a literal 0-byte file with no default export; Next.js has no valid page module for this route; **BROKEN**


### `/studio/profile`

Static, non-live self-profile placeholder showing the signed-in user's own creator page shell.

**page head**

- Edit Soon (button): Nothing; the button is rendered with the disabled attribute and no onClick handler.; **STUBBED**

**tab bar**

- Featured / Characters / Storys / Images & Presets / Updates / Activity tabs (tabs): Nothing; every tab button is rendered with the disabled attribute and no onClick handler, only the first is visually 'active'.; data: fixture; **STUBBED**

**featured items grid**

- Featured item cards (Chronicle Update / Featured Story / Updated Character) (display): Renders three hardcoded fixture articles; not connected to any real content.; data: fixture; **STUBBED**


### `/stories`

Intended entry index into the inserted-fiction archive; currently ships as an empty, unfinished placeholder.

**page head**

- Stories (title/eyebrow/lede) (display): Static header text; data: fixture

**filter bar**

- Search / Realm / Faction filter controls (display): FilterableIndex rendered against a hardcoded empty stories=[] array declared in the page component, so search/filter/tag controls render but always operate on zero entries; data: fixture; **STUBBED**

**coming soon panel**

- The fragments are still being catalogued. (coming soon block) (display): Static explanatory copy indicating stories content is not yet populated; data: fixture; **STUBBED**


### `/studio/story-rooms`

Library hub for continuing active Story rooms and starting new sessions from templates.

**mobile toolbar drawer**

- Room Controls toggle (button): Expands/collapses the mobile filter drawer (search, filters, view toggle).; data: local_state
- Search rooms... (mobile) (input): Filters the room list client-side by title, subtitle, scenario, narrator, location, cast.; data: local_state
- Active / Templates / Private / Archived filter pills (tabs): Switches which status/visibility bucket of rooms is shown.; data: local_state
- View (grid/list) (toggle): Switches room list between grid card and compact list layout, persisted to localStorage.; data: local_state
- Start Room Soon (button): Disabled placeholder for a future direct room-start action.; **STUBBED**
- New Template (link): Navigates to /studio/create/room-template to build a new room template.

**desktop toolbar**

- New Template (link): Navigates to /studio/create/room-template.
- Open Latest Room / No Rooms Yet (link): Links into the most recently loaded room's chat workspace; renders a disabled button instead when the room list is empty.; wired to `storyRoomClient.fetchStoryRooms GET /api/studio/story-rooms`; missing states: loading/error
- Manage / Cancel Manage (button): Toggles bulk-select (manage) mode for deleting rooms; clears selection and delete error on exit.; data: local_state
- Delete Selected (n) (button): After a window.confirm, deletes every selected room one by one and removes them from the local list.; wired to `storyRoomClient.deleteStoryRoom DELETE /api/studio/story-rooms/[id]`; missing states: empty
- Search rooms, scenarios, narrators, cast... (input): Client-side filters the loaded room list by text.; data: local_state
- Active / Templates / Private / Archived filter pills (tabs): Same filter logic as the mobile pills, desktop copy.; data: local_state
- View (grid/list) (toggle): Same as mobile ViewModeToggle, desktop copy.; data: local_state

**room list surface**

- Load error banner (display): Shows the error message when fetchStoryRooms fails.; wired to `storyRoomClient.fetchStoryRooms GET /api/studio/story-rooms`; missing states: empty/loading
- Delete error banner (display): Shows the error message when a bulk delete request fails.; wired to `storyRoomClient.deleteStoryRoom DELETE /api/studio/story-rooms/[id]`; missing states: empty/loading
- Room grid / list (display): Renders each fetched room as a card or row; clicking navigates to the room's chat workspace, or (in manage mode) toggles its selection checkmark for bulk delete instead.; wired to `storyRoomClient.fetchStoryRooms GET /api/studio/story-rooms`
- No rooms found (empty state) (display): Shown when the filtered room list is empty and not loading.; data: local_state


### `/studio`

Studio home dashboard letting a player jump into play or open creator tools.

**page head**

- Browse Games (link): Link to /studio/games.
- Community Stories (link): Link to /studio/community.
- Create Something (link): Link to /studio/create.
- Search games, rooms, characters... (input): Renders a text/search input with a placeholder; has no onChange, no state, no submit handler of any kind.; **BROKEN**

**Start Playing panel - card grid**

- Play Official Crestfall / Browse Games (link): Card links to /studio/games.; data: fixture
- Play Community Stories / Browse Community (link): Card links to /studio/community.; data: fixture
- Follow Storylines / View Storylines (link): Card links to /studio/storylines.; data: fixture

**Continue / Your Story State panel**

- View My Stuff (link): Link to /studio/my-creations.

**Create Your Own panel - card grid**

- Create Assets / Open Creation Studio (link): Card link to /studio/create.; data: fixture
- Manage My Creations / View My Work (link): Card link to /studio/my-creations.; data: fixture
- Build Images / Open Image Studio (link): Card link to /studio/image-studio.; data: fixture


### `/studio/create`

Landing hub for choosing how to start creating: quick-start cards, a guided step-by-step build path, or the full builder toolkit.

**Mode selector**

- Quick Start / Guided Build / Full Studio (tabs): Switches the active view mode and persists the choice to localStorage.; data: local_state

**Quick Start view**

- Character / Player Character / Location / Outfit-Clothing cards (link): Navigates to the respective /studio/create/* builder route.; data: fixture
- Build a Complete Story / View Every Tool (button): Switches mode to GUIDED or FULL.; data: local_state

**Guided Build view**

- Guided milestone progress counter (display): Shows how many of 4 core / 25 total guided milestones are complete, computed from the user's owned creation counts by type.; wired to `fetchOwnedCreations GET /api/creations`; missing states: empty
- View all tools (button): Switches mode to FULL.; data: local_state
- Open My Creations (link): Navigates to /studio/my-creations.
- Chapter accordion (Chapter 1-6) (toggle): Expands/collapses a <details> element listing that chapter's guided steps; auto-opens the current chapter, auto-closes completed ones.; data: local_state
- Create <Asset Title> / Create Another / Create Second Story (link): Navigates to the target creation-type's builder route for the recommended or available guided step.; data: fixture
- Optional enhancement chips (link): Navigates to an optional related asset builder (e.g. Outfit while on the Location step), showing an owned-count badge if any exist.; wired to `fetchOwnedCreations GET /api/creations`; missing states: empty/loading/error

**Full Studio view**

- Section accordion (Characters & Visual Assets, Stories & Sessions, Worlds & Continuity, Rules & Mechanics, Templates & Generation) (toggle): Expands/collapses a <details> grouping of CreateTypeCard links for that category.; data: local_state
- Every builder/registry card (link): Navigates to each of the ~30 creation-type builder routes.; data: fixture


### `/studio/create/room-template`

Let a Studio creator assemble characters, a scenario, narrator, opening messages, multiplayer invitees, registry attachments, and room settings into a Story (room template) draft.

**page head**

- Back to Create (link): Static nav link back to /studio/create.

**builder sidebar**

- Save Draft (button): Builds the full room template creation payload (form, characters, scenario/narrator/location, opening messages, invited players) and POSTs a ROOM_TEMPLATE creation draft, then routes to the edit page.; wired to `roomTemplateClient.createRoomTemplateDraft -> createCreationDraft POST /api/creations`; missing states: empty
- Draft Progress percent + Story summary rows (Characters/Scenario/Narrator/Location) (display): Shows a derived completion percentage and a small read-out of current selections.; data: local_state

**Story Identity section**

- Title (input): Text field bound to form.title.; data: local_state
- Public Description (textarea): Textarea bound to form.public_description.; data: local_state
- Story Mode (select): CrestfallSelect bound to form.room_mode from constants.roomModeOptions.; data: fixture
- Player Character (select): CrestfallSelect bound to form.player_character_mode from constants.playerCharacterOptions.; data: fixture
- Content Rating (select): CrestfallSelect bound to form.content_rating from constants.contentRatingOptions.; data: fixture

**Story Package section**

- Add Character (button): Opens the shared RoomTemplatePickerModal in 'characters' mode, listing owned CHARACTER creations to toggle into selectedCharacters.; wired to `roomTemplateClient.fetchRoomTemplateCreationReferences -> creationClient.fetchOwnedCreations GET /api/creations`; missing states: empty
- Remove (per selected character chip) (button): Removes a character from selectedCharacters by id.; data: local_state
- Apply All / Skip (Scenario Recommendations banner) (button): Apply All merges the selected scenario's recommended characters/location/narrator/NPC registries into the form and dismisses the banner; Skip just dismisses it for this scenario.; data: local_state
- Apply / Use (per-recommendation-group buttons: Required Characters, Optional Characters, Suggested Location, Suggested Narrator, Suggested NPC Registries) (button): Applies one specific scenario recommendation group into the form/selectedCharacters without dismissing the whole banner.; data: local_state
- Scenario / Narrator / Location selection cards (modal-trigger): Each opens RoomTemplatePickerModal filtered to SCENARIO, NARRATOR, or LOCATION options; selecting sets form.scenario_id/narrator_id/location_id (single-select, closes picker).; wired to `creationClient.fetchOwnedCreations GET /api/creations (same load as character options)`; missing states: empty/loading/error

**Multiplayer section**

- Turn-Based Story toggle tile (toggle): Toggles form.turn_based; effectiveTurnBased is forced true whenever invitedPlayers.length > 0 regardless of this toggle.; data: local_state
- Add Player (modal-trigger): Sets picker state to 'players', intending to open a mutual-followers picker so an invitee can be toggled into invitedPlayers.; wired to `roomTemplateClient.fetchMutualPlayers GET /api/profile/mutuals`; **BROKEN**; missing states: empty
- Remove (per invited player chip) (button): Removes a player from invitedPlayers by id.; data: local_state

**picker modal (shared: characters/scenario/narrator/location/players)**

- Creation/player card grid (display): Grid of selectable items rendered by CreationPickerPanel inside RoomTemplatePickerModalView; search input filters, clicking an item calls the picker's onChooseItem.; data: local_state

**Opening section**

- Public Opening Context (textarea): Textarea bound to form.public_opening_context.; data: local_state
- Opening Message card (Speaker select + Message textarea + Remove) (display): One card per openingMessages entry; Speaker select offers Narrator/selected-character names/Player Prompt, Message is free text, Remove deletes the message (disabled when it is the only one).; data: local_state
- Add Opening Message (button): Appends a new opening message entry (Narrator speaker, empty body) to openingMessages.; data: local_state

**Display Media section**

- Slot 1-4 selector buttons (button): Sets local displayMediaSlot index (0-3) used only to label the preview panel.; data: local_state
- Choose From Media Library Soon (button): Permanently disabled button; no handler.; **STUBBED**

**Private Runtime section - Rules Codex Attachments**

- Attach Rules Codex (modal-trigger): Opens RegistryLinkedCreationPickerModal filtered to RULES_CODEX creations; selecting attaches a rulesCodexLinks entry to the Story.; wired to `creationClient.fetchOwnedCreations GET /api/creations?type=RULES_CODEX`
- Remove (per attached Rules Codex) / notes textarea (both): Remove deletes the attachment link; textarea edits a free-text notes field stored per link.; data: local_state

**Private Runtime section - Story Registry Attachments**

- Attach Registry (per group: Event/Quest/NPC/Item/Location/Faction/Organization Registries, 7 groups) (modal-trigger): Opens RegistryLinkedCreationPickerModal filtered to that group's registry type; selecting attaches a registry link into boundRegistries/boundRegistryLinks for that group.; wired to `creationClient.fetchOwnedCreations GET /api/creations?type=<REGISTRY_TYPE>`
- Remove (per attached registry) / notes textarea (both): Remove deletes a registry attachment; textarea edits per-attachment notes.; data: local_state

**Private Runtime section**

- Private Story Guidance (textarea): Hidden runtime notes bound to form.private_room_guidance.; data: local_state

**Publishing section**

- Visibility (select): CrestfallSelect bound to form.visibility.; data: fixture
- Tags (input): Comma-separated tags text input.; data: local_state


### `/studio/create/rules-codex`

Create scoped guidance that explains what verified mechanics mean and when world-specific rules apply, without carrying deterministic authority.

**page head**

- Back to Create (link): Navigates back to /studio/create

**codex header**

- JSON Editor (modal-trigger): Opens RulesCodexJsonEditorModal for raw JSON editing of the whole codex; data: local_state
- Codex Enabled / Enable Codex (toggle): Flips the codex's enabled flag; when disabled, sections stay authored but none may be selected at runtime; data: local_state

**header stat cards**

- Authority / Sections / Guidance budget cards (display): Read-only display of fixed authority label, section count vs limit, and total body character budget vs limit; data: local_state

**summary and selection budget**

- Codex Summary / Sections per turn / Context characters (textarea): Codex Summary is a textarea for the overall description; Sections per turn and Context characters are number inputs capping how much guidance the context planner may select per turn; data: local_state

**rules sections list**

- Add Section / Add First Section (button): Appends a new rules section up to sectionLimit; data: local_state

**rules section card**

- Expand/collapse, Move up/down, Remove (button): Toggles a section open, reorders it, or deletes it; data: local_state

**rules section card (expanded)**

- Section Title / Identifier / Activation / Signal Matching / Priority / Availability toggle / Interpretive Guidance (input): Edits section title, id, activationMode select (Always/Contextual/Explicit only), matchMode select (Any/All), priority number input, enabled toggle, and body textarea; data: local_state
- Clear Section (button): Clears the section's title/body content (shown only when the section has content); data: local_state

**rules section card (expanded, contextual)**

- Contextual Activation Signal fields (input): Comma-separated routing identifier text inputs (per activationSignalFields) shown only when activationMode is CONTEXTUAL, plus read-only Known domains/scopes reference chips; data: local_state

**aside identity/save panel**

- Creation name / Description / Visibility / Content rating / Save Draft (input): Sets the wrapping creation's identity fields; Save Draft POSTs the creation; wired to `rulesCodexClient.createRulesCodexDraft (creationClient.createCreationDraft) POST /api/creations`; missing states: empty


### `/studio/create/scenario`

Let a Studio creator build a reusable Scenario draft using a story circle, cast/registry references, middleware toggles, and runtime guidance, then save it as a creation.

**page head**

- Back to Create (link): Static nav link back to /studio/create.

**builder sidebar**

- Save Draft (button): Submits the current form/circle/enabledModules as a SCENARIO creation draft, then routes to /studio/my-creations/[id]/edit on success.; wired to `scenarioClient.createScenarioDraft -> createCreationDraft POST /api/creations`; missing states: empty
- Draft Progress percent + Enabled Middleware chip list (display): Shows a derived completion percentage across form+circle fields, and a chip list of currently-enabled middleware modules.; data: local_state

**Scenario Identity section**

- Title (input): Text field bound to form.title.; data: local_state
- Public Description (textarea): Textarea bound to form.public_description.; data: local_state
- Tone (select): CrestfallSelect bound to form.tone from constants.toneOptions.; data: fixture
- Participant Mode (select): CrestfallSelect bound to form.participant_mode from constants.participantModeOptions.; data: fixture
- Content Rating (select): CrestfallSelect bound to form.content_rating from constants.contentRatingOptions.; data: fixture

**Story Circle section**

- Story Circle notes textarea (one per step) (textarea): Textarea per storyCircleSteps entry bound to circle[step.id]; optional narrative-structure notes.; data: local_state

**Cast & Requirements section**

- Required Characters / Optional Characters / Suggested Location / Suggested Narrator / Suggested NPC Registries / Attached Faction Registries / Attached Organization Registries (7 reference fields) (modal-trigger): Button opens ScenarioReferencePickerModal filtered by allowedTypes; selecting sets the field or registry binding on form.; wired to `creationClient.fetchOwnedCreations GET /api/creations`; missing states: loading
- Remove (chip) for each selected reference (button): Removes a selected reference item from the field's array or clears a single-select field.; data: local_state

**scenario reference picker modal**

- Search references... (input): Client-side filters the picker's option list by title/subtitle/type/contentRating substring match.; data: local_state
- Creation card (grid item) (button): Clicking toggles/selects the creation into the target field; single-select closes the modal.; data: local_state
- Done / Close (X) (button): Closes the reference picker modal.; data: local_state

**Middleware section**

- Middleware module toggle tiles (phase_gates, reward_gates, knowledge_boundaries, hidden_media_unlocks, time_weather, recap_support) (toggle): Toggles enabledModules[moduleId] boolean; described as 'future platform-level supports' with no runtime effect yet.; data: local_state; **STUBBED**

**Opening & Runtime section**

- Opening Scene / Opening Messages / Private Runtime Guidance / Drift Fixes / Failure Handling (textarea): Five free-text fields bound to form fields of the same names.; data: local_state

**Publishing section**

- Visibility (select): CrestfallSelect bound to form.visibility from visibilityOptions.; data: fixture
- Tags (input): Comma-separated tags text input, parsed into an array on save via parseTags().; data: local_state


### `/studio/create/stats-pools-profile`

Define reusable Stats, HP, Stamina, Mana, modifiers, and conditions for later attachment through an Actor Mechanics Profile.

**page head**

- Back to Create (link): Navigates back to /studio/create

**aside identity panel**

- Creation name / Description / Visibility / Content rating / Save Draft (input): Sets the wrapping creation's title/description/visibility/contentRating; Save Draft POSTs the creation; wired to `statsPoolsClient.createStatsPoolsProfileDraft (creationClient.createCreationDraft) POST /api/creations`; missing states: empty

**profile header**

- JSON Editor (modal-trigger): Opens StatsPoolsJsonEditorModal for raw JSON editing of the whole Stats & Pools profile; data: local_state
- Profile Enabled / Enable Profile (toggle): Flips the profile's enabled flag; data: local_state

**profile identity fields**

- Profile Title / Profile Mode / Description (input): Sets profile title (input), profileMode select (FULL vs partial), description (textarea); data: local_state

**capability policy panel**

- Capability Mode / Numeric Resolution / Working Mode Profile / Capability Notes (select): Sets capabilityPolicy.mode, .numericResolutionPolicy (disabled unless BEYOND_SCALE), .workingModeProfile (text, disabled unless BEYOND_SCALE), .notes (textarea); data: local_state

**definitions panel tab bar**

- Stats / Pools / Modifiers / Conditions tabs (tabs): Switches activePanel between the four definition-type panels, each showing a live count badge; data: local_state

**Stats panel**

- Add Stat / StatDefinitionCard (expand, move up/down, remove, value type, scale mode, formula builder) (button): Adds a new stat definition up to limits.maxStats; each StatDefinitionCard edits id/title/valueType/scaleMode and an operand-based derived-value formula referencing other stats/pools; data: local_state

**Pools panel**

- Add Pool / PoolDefinitionCard (expand, move up/down, remove, maximum mode, default-current, formula builder) (button): Adds a new pool definition (HP/Stamina/Mana/custom) up to limits.maxPools; each PoolDefinitionCard edits id/title/valueType/maximumMode/defaultCurrent and a derived-value formula; data: local_state

**Modifiers panel**

- Add Modifier / ModifierCard (expand, move up/down, remove, target type, operation, stack policy, duration policy) (button): Adds a reusable numeric-effect modifier definition up to limits.maxModifierDefinitions; each ModifierCard targets a stat/pool with an operation, stacking, and duration policy; data: local_state

**Conditions panel**

- Add Condition / ConditionCard (expand, move up/down, remove, activated modifiers, stack policy) (button): Adds a named actor-state condition up to limits.maxConditionDefinitions; each ConditionCard selects which Modifiers it activates and a stack policy; data: local_state

**header stat cards**

- Profile Mode / Definitions / Effects / Validation cards (display): Read-only counts of stat/pool/derived/modifier/condition definitions and validation error/warning status; data: local_state


### `/studio/create/storyline`

Let a Studio creator link Stories and Scenarios into an authored continuity path (Storyline) with per-node transitions/triggers and open-world defaults, then save it as a draft.

**page head**

- Back to Create (link): Static nav link back to /studio/create.

**builder sidebar**

- Title (input): Text field bound to form.title; required before Save Draft will succeed.; data: local_state
- Description (textarea): Text field bound to form.description.; data: local_state
- Visibility (select): Native <select> bound to form.visibility; only Private/Unlisted options exist.; data: fixture
- Content Rating (select): Native <select> bound to form.contentRating; only SFW option exists.; data: fixture; **STUBBED**
- Tags (textarea): Free-text tags field bound to form.tags (one tag per line placeholder).; data: local_state
- Save Draft (button): Validates title/node data client-side (validateStorylineData), builds the STORYLINE creation payload, POSTs the draft, then routes to /studio/my-creations/[id]/edit.; wired to `storylineClient.createStorylineDraft -> createCreationDraft POST /api/creations`; missing states: empty

**Narrative Sequence (node list editor)**

- Add Story or Scenario (modal-trigger): Opens StorylineReferencePickerModal (portal-rendered) listing owned ROOM_TEMPLATE and SCENARIO creations under Stories/Scenarios tabs; selecting appends a new node to the sequence.; wired to `storylineClient.fetchStorylineReferences -> creationClient.fetchOwnedCreations GET /api/creations?type=ROOM_TEMPLATE and GET /api/creations?type=SCENARIO`; missing states: loading
- Storyline reference picker: Stories/Scenarios tabs, search input, reference card (display): Tabs switch which reference type is browsed; search filters by title/subtitle; clicking a non-selected card calls onSelectItem which appends the node and closes the picker. Already-added references show disabled with 'Already in this Storyline'.; data: local_state
- Move node up / Move node down (per node) (button): Reorders the node array by swapping the node's array position; disabled at the first/last position respectively.; data: local_state
- Remove (per node) (button): Removes the node from the sequence.; data: local_state

**Node Transitions (per node)**

- Completion Guidance (textarea): Optional free-text describing what proves a node concluded, bound per-node.; data: local_state
- Transition After Completion (select): Picks the node's transitionPolicy (e.g. IMMEDIATE, MANUAL, OPTIONAL, OPEN_WORLD_UNTIL_TRIGGER); disabled and forced to COMPLETE_STORYLINE on the final node.; data: fixture

**Next-Node Triggers (per node, shown when policy needs a trigger)**

- Trigger mode select + Add Trigger (both): Trigger mode select picks ANY/ALL-style evaluation from STORYLINE_TRIGGER_MODES; Add Trigger appends a new trigger row to that node.; data: fixture

**Next-Node Triggers (per trigger row)**

- Trigger type select / Trigger label input / Trigger description input / Remove (both): Edits a single trigger's type (from STORYLINE_TRIGGER_TYPES), label text, description text, or removes the trigger.; data: local_state

**Open-World Guidance (per node, shown when policy is OPEN_WORLD_UNTIL_TRIGGER and node is not last)**

- Open-World Guidance / Consequence-Pressure Guidance (textarea): Two optional free-text fields describing what stays available and what pressure surfaces during the open-world interlude after this node.; data: local_state

**Narrative Sequence / Node Transitions**

- Storyline authoring errors / Draft readiness notes (display): Lists validateStorylineData() errors and warnings computed from the current node data (e.g. missing nodes, missing triggers).; data: local_state

**Open-World Interludes section**

- Default Transition (select): Sets the Storyline-wide default transition policy applied to nodes that don't specify their own.; data: local_state
- Open-World Guidance (textarea): Storyline-wide default open-world guidance text.; data: local_state
- Pressure Cadence Guidance (textarea): Storyline-wide default consequence/pressure cadence guidance text.; data: local_state
- Continuity Always Preserved (info panel) (display): Static explanatory copy panel, no data binding.; data: fixture


### `/terms/[slug]`

Display a single legal/policy document with its section text.

**back link**

- Terms & Policies (back chip) (link): Links to /terms

**policy header**

- Policy title/category/summary/status badge (display): Renders policy.category, title, summary, and status pill for the matched policy; wired to `getPolicyBySlug (data/policies.js)`

**draft placeholder notice**

- Draft Placeholder notice box (display): Static warning that policy text is not final legal language; data: fixture

**section list**

- Policy section cards (heading + body per section) (display): Maps policy.sections into bordered cards; data: fixture


### `/studio/image-studio`

Give a creator a workbench for generating and managing AI character/scene artwork.

**page head**

- Image Studio eyebrow (display): Static hand-written eyebrow label, does not use StudioPageHeader.

**composer**

- Image / Video mode toggle (tabs): Switches composer between Image build mode and Video build mode (local state only).; data: local_state
- Composer options toggle (sliders icon) (toggle): Opens/closes the Options panel (render style, camera, wardrobe, aspect ratio, image count, negative prompt) inside the composer.; data: local_state
- Ingredient slot (Character, Player Character, Pose, Outfit, Location, Rendering Preset) (button): Opens the Ingredient Picker modal for that slot; shows an X to clear the slot once a value is chosen.; data: local_state
- Prompt textarea (textarea): User's image generation prompt text.; data: local_state
- Negative Prompt textarea (textarea): Text describing what to avoid in the generated image, sent as prompt.negativePrompt.; data: local_state
- Render Style / Camera-Framing / Wardrobe Theme / Aspect Ratio / Output Count selects (select): Five CrestfallSelect dropdowns controlling generation settings sent in the job payload's settings/composition blocks.; data: local_state
- Generate Image (button): Submits the assembled generation payload as a job, prepends a pending placeholder to the media grid, then resolves/fails it with the returned outputs and updates the coin balance.; wired to `createImageGenerationJob POST /api/studio/image-generation/jobs`; missing states: empty
- Coins balance readout (display): Shows current coin balance and the generation cost; shows an insufficient-coins warning when balance < cost.; wired to `fetchImageStudioAccountStatus-equivalent via StudioAccountProvider GET /api/profile/me`; missing states: empty

**ingredient picker modal**

- Ingredient item card (grid) (display): Lists the creator's owned creations matching that slot's allowed type(s) to choose as the ingredient; selecting one closes the modal and fills the slot.; wired to `fetchImageStudioIngredientCreations -> fetchOwnedCreations GET /api/creations?type={type} (one call per allowed type)`
- Use Once (custom) (button): Switches the slot into one-time custom-text mode instead of picking a saved creation.; data: local_state
- New Preset (create preset) (button): Only shown for slots with allowCreatePreset; starts a custom ingredient and opens the Save Preset modal.; data: local_state

**composer / custom ingredient editor**

- Custom Guidance textarea (textarea): Free text prompt fragment used for a slot in custom mode.; data: local_state
- Back to Presets (button): Re-opens the ingredient picker for that slot.; data: local_state
- Save as Preset (button): Opens the Save Ingredient Preset modal for slots where allowCreatePreset is true.; data: local_state
- Clear custom ingredient (X) (button): Clears the custom text and removes the ingredient from the selected set for that slot.; data: local_state

**save ingredient preset modal**

- Preset Name / Description / Prompt / Tags fields (input): Collects fields for a reusable preset creation draft (pose/outfit/location/image preset type).; data: local_state
- Save as Preset (submit) (button): Builds a creation draft payload (POSE/OUTFIT/LOCATION/IMAGE_PRESET) and persists it as a private creation, then fills the ingredient slot with the saved preset.; wired to `createCreationDraft POST /api/creations`; missing states: empty
- Use Once (button): Closes the save-preset modal without persisting, keeping the custom text as a one-time ingredient.

**composer (video mode)**

- Duration / Video Aspect / Motion Style selects (select): Local-state-only selects for a future video generation configuration.; data: local_state; **STUBBED**
- Video Direction textarea (textarea): Local-state-only text field for future video motion direction.; data: local_state; **STUBBED**
- Generate Video Soon (button): Disabled button, no handler, no API call.; **STUBBED**

**mobile composer sheet**

- Composer bottom sheet open/close + Gen quick-action (modal-trigger): Below xl breakpoint, opens/closes the composer as a bottom sheet, and offers a 'Gen' quick button that calls the same generate handler.; wired to `createImageGenerationJob POST /api/studio/image-generation/jobs (via quick generate)`

**media history grid**

- Image Library grid (display): Shows the creator's generated image history, paginated by cursor, plus in-flight pending jobs merged in as placeholders and polled every 3s while jobs are active.; wired to `fetchImageGenerationHistory GET /api/studio/image-generation/jobs?limit=12&cursor=...`
- All / Images / Videos / Liked / Bookmarked filter pills (tabs): Client-side filters the already-loaded media list by type/liked/bookmarked flags.; data: local_state
- Filters toggle (mobile) (toggle): Shows/hides the filter pill row on narrow viewports.; data: local_state
- Large/Grid mobile density toggle (toggle): Switches the mobile grid between 2-col compact and 1-col large card layout.; data: local_state
- Select / Done (selection mode toggle) (toggle): Enters/exits bulk-selection mode for deleting multiple images at once.; data: local_state
- Generated image card (open) (button): Opens the media lightbox for that item when it has a resolved image and is not pending/error.; data: local_state
- Load More (history pagination) (button): Fetches the next cursor page of image generation history and appends it.; wired to `fetchImageGenerationHistory GET /api/studio/image-generation/jobs?limit=12&cursor=...`; missing states: empty/error

**media history grid (selection mode)**

- Select All Visible / Clear Visible (button): Selects or deselects every currently-filtered selectable image.; data: local_state
- Clear (button): Clears the current selection set.; data: local_state
- Delete Selected (N) (button): After a window.confirm, deletes every selected image output with 3-way concurrency, removing successes from the grid and leaving failures selected with an error summary.; wired to `deleteImageOutput DELETE /api/media/images/[imageOutputId] (one call per selected id, 3 concurrent workers)`; missing states: empty

**media history grid card quick actions**

- Like (heart) (toggle): Toggles a LIKE reaction on hover/focus for a card without opening the lightbox.; wired to `setMediaLike POST /api/media/reactions`; missing states: empty/loading
- Bookmark (toggle): Toggles a BOOKMARK reaction on a card.; wired to `setMediaBookmark POST /api/media/reactions`; missing states: empty/loading
- Expand (button): Opens the lightbox for that card (same as clicking the image).; data: local_state

**media lightbox**

- Media strip thumbnails (sidebar + mobile) (display): Lets the user switch which media item is active inside the lightbox.; data: local_state
- Like / Bookmark (header icons) (toggle): Same like/bookmark reaction toggle as the grid quick actions, scoped to the active lightbox item.; wired to `setMediaLike / setMediaBookmark POST /api/media/reactions`; missing states: empty/loading/error
- Share (button): Uses navigator.share if available, otherwise copies the current page URL to the clipboard, and shows a status message.
- Download (link): Native browser download of the full-size image via an anchor with the download attribute.
- Generate Variant (link): Links back to /studio/image-studio (this same route).
- Details (modal-trigger): Opens a dialog fetching and showing public generation detail rows, plus private prompt/settings rows if the viewer is permitted.; wired to `fetchImageOutputDetails GET /api/media/images/[imageOutputId]/details`; missing states: empty
- Report (modal-trigger): Opens a moderation report dialog with a reason dropdown and optional note, and submits a report record for the active image.; wired to `createMediaReport POST /api/media/reports`; missing states: empty
- Remix Soon (button): Disabled placeholder button, no handler.; **STUBBED**
- Use as Reference Soon (button): Disabled placeholder button, no handler.; **STUBBED**
- More Soon (button): Disabled placeholder button, no handler.; **STUBBED**
- Delete Image (button): After window.confirm, deletes this single image output and closes the lightbox.; wired to `deleteImageOutput DELETE /api/media/images/[imageOutputId]`; missing states: empty/loading
- Close (X) (button): Closes the lightbox back to the grid.; data: local_state


### `/terms`

Index of Crestfall's draft legal, privacy, safety, and platform-trust policy placeholders.

**page head**

- Terms & Policies (title/eyebrow/lede) (display): Static header text plus disclaimer sentence that these are draft placeholders; data: fixture

**draft notice banner**

- Draft Legal Placeholder notice (display): Static amber warning banner explaining copy is placeholder; data: fixture

**policy card grid**

- Policy cards (Terms of Service, Privacy Policy, Content Policy, Content Removal Policy, Moderation Policy, Screening Policy, Complaint Policy, Underage Policy, Anti-Fraud Policy, Sex Trafficking Policy) (link): Each card links to /terms/[policy.slug], rendering title/summary/category/status from the fixture array; data: fixture


### `/login`

Let a visitor authenticate into Crestfall Studio via Google OAuth or an emailed magic link.

**page head**

- Close (X) icon button (button): Links to / (Link component styled as circular icon button)

**auth card**

- Continue with Google (button): Calls supabase.auth.signInWithOAuth(provider: google) with redirectTo NEXT_PUBLIC_SITE_URL/auth/callback; disabled while isSubmitting; on error sets message state and re-enables; wired to `supabase.auth.signInWithOAuth (Supabase JS client, browser SDK call, not a /api route)`; missing states: empty
- Email (input) (input): Controlled input bound to email state, type=email, required; data: local_state
- Send login link (button): Submits form, calls supabase.auth.signInWithOtp(email, redirectTo) to send a magic login link; disabled while submitting, label switches to Sending... while isSubmitting; wired to `supabase.auth.signInWithOtp (Supabase JS client)`; missing states: empty


### `/studio/account/preferences`

Placeholder settings page collecting future default-behavior toggles for filter panels, browse view, Image Studio, creator workflow, and discovery, with save support not yet built.

**header**

- Back to Account (link): Back link to /studio/account, built inline (this page does NOT use AccountStubPage).

**page defaults card grid**

- Community/My Creations/Browsing/Image Studio/Creation Flow/Discovery option buttons (bespoke PreferenceCard, 6 cards x 3 options each) (button): All option buttons render with the disabled attribute and no onClick handler; they are non-interactive visual placeholders for future default settings, one option per card visually highlighted as the current default.; data: fixture; **STUBBED**


### `/studio/create/actor-mechanics-profile`

Compose a reusable actor mechanics profile that binds domain definitions (stats, progression, etc) to an actor while keeping mutable state isolated.

**page head**

- Back to Create (link): Navigates back to /studio/create

**asset identity sidebar**

- Creation name (input): Sets draft.title; data: local_state
- Description (textarea): Sets draft.description; data: local_state
- Visibility (select): Sets draft.visibility (PRIVATE/UNLISTED); data: local_state
- Content rating (select): Sets draft.contentRating (SFW/MATURE/EXPLICIT); data: local_state

**aside summary panel**

- Save Draft (button): Validates and POSTs the creation draft; on success routes to /studio/my-creations/[id]/edit; wired to `actorMechanicsProfileClient.createActorMechanicsProfileDraft (creationClient.createCreationDraft) POST /api/creations`; missing states: empty
- Errors / Warnings counters (display): Shows validation error/warning counts computed from validateActorMechanicsProfileEditorValue; data: local_state

**profile editor header**

- JSON Editor (modal-trigger): Opens ActorMechanicsProfileJsonEditorModal for raw-JSON authoring of the whole profile; data: local_state
- Profile Enabled / Enable Profile (toggle): Flips profile.enabled; data: local_state

**profile editor stat cards**

- Owner Scope / Bindings / References / Validation stat cards (display): Read-only rollup of owner type, enabled binding count, reference count, and validation status; data: local_state

**profile preset panel**

- Profile Preset select (select): Chooses a preset id to stage for application (CUSTOM, FULL_PLAYER_CHARACTER, NARRATIVE_ONLY, BEYOND_SCALE, STATTED_NPC etc); data: fixture
- Apply Preset (button): Replaces the current binding structure with the selected preset's bindings/capability policy, preserving owner where compatible; data: local_state

**profile identity fields**

- Profile Title (input): Sets profile.title; data: local_state
- Profile Summary (textarea): Sets profile.summary; data: local_state

**actor owner section**

- Binding Mode / Owner Type / Owner Display Name / Owner Reference (select): Sets owner.bindingMode, owner.ownerType (selects); Owner Display Name and Owner Reference are text inputs for owner.ownerTitle/ownerId. Disabled entirely when ownerContext.locked is true.; data: local_state

**fixed state policy panel**

- Isolation / Namespace / Shared Definitions / Shared Mutable State cards (display): Shows the contract-fixed, non-editable state isolation policy values; data: local_state

**capability policy section**

- Capability Mode / Opposed Resolution / Working-Mode Profile / Capability Notes (select): Sets capabilityPolicy.mode and .opposedResolutionPolicy (selects), Working-Mode Profile (text input, shown conditionally) and Capability Notes (textarea); data: local_state

**domain bindings list**

- Add Binding (button): Appends a new domain binding (choosing an unused domain) up to the configured limit; data: local_state

**domain binding card**

- Expand/collapse binding, Enabled/Disabled toggle, Move up/down, Remove (button): Toggles the card open, flips binding.enabled, reorders binding.order, or removes the binding; data: local_state

**domain binding card (expanded)**

- Binding ID / Domain / Display Title / Activation Mode / Activation Domains / Required binding / Binding Notes (input): Edits binding.id, domain (select), title, activation.mode (select), activation.domains (comma text), required (checkbox), notes (textarea); data: local_state

**domain binding card - reusable definitions**

- Select/Replace Stats & Pools Profile (modal-trigger): Opens RegistryLinkedCreationPickerModal filtered to STATS_POOLS_PROFILE creations and attaches the chosen creation as a reference on the STATS binding; wired to `creationClient.fetchOwnedCreations GET /api/creations`
- Select/Replace Progression Profile (modal-trigger): Opens RegistryLinkedCreationPickerModal filtered to PROGRESSION_PROFILE creations and attaches the chosen creation as a reference on the PROGRESSION binding; wired to `creationClient.fetchOwnedCreations GET /api/creations`
- Add Reference / Remove Reference (button): For non-managed (generic) domains, adds or removes a generic reference row with Reference Type / Source ID / Display Title / Definition Version fields; data: local_state

**JSON editor modal**

- Copy JSON / Download AI Guide / Format JSON / Reset from Builder / Cancel / Validate & Apply / Close (X) (button): Clipboard-copies the JSON, downloads a static authoring guide file, pretty-prints the textarea JSON, resets the textarea to the builder's current value, closes without applying, or parses+validates+applies the edited JSON back into the builder as one replacement; data: local_state
- Authored Actor Mechanics Profile JSON (textarea): Freeform JSON text the creator edits directly before Validate & Apply; data: local_state


### `/studio/create/character`

Guided multi-step flow to draft a new AI-controlled Crestfall character.

**page head**

- Back to Create (link): Navigates back to /studio/create.

**draft progress bar**

- Save Draft → / Finish Draft → (button): Builds the creation payload from form state and POSTs it as a new CHARACTER creation; on success routes to /studio/my-creations/[id]/edit.; wired to `createCharacterDraft (createCreationDraft) POST /api/creations`; missing states: empty
- Identity / Appearance / Body / Behavior / Review (tabs): Jumps directly to any step; visited/active state is tracked locally.; data: local_state

**editor footer**

- Back (button): Moves to previous step id; disabled on first step.; data: local_state
- Next (button): Advances to next step id (hidden on Review step, replaced by Finish Draft).; data: local_state

**preview panel**

- Character preview (initial, name, subtitle, species, gender presentation, clothing style) (display): Renders a live-updating summary card from current form state as fields are filled in.; data: local_state

**identity step – templates**

- Use Template (modal-trigger): Opens the Character Template picker modal.

**character template modal**

- Built-In / My Templates / Community (tabs): Switches template source tab; only Built-In renders a real grid.; data: fixture; **STUBBED**
- Search templates... (input): Client-side filters the Built-In template grid by title/category/description.; data: local_state
- Built-in template grid / Apply Template (display): Lists built-in templates from a static fixture array; each card's Apply Template button merges template.data.fields into the creator form and closes the modal.; data: fixture

**identity step**

- Name (input): Sets form.name.; data: local_state
- Title (input): Sets form.title.; data: local_state
- Species (+ Custom Species when CUSTOM chosen) (select): Sets form.species from a fixed option list; reveals a text input for custom_species when CUSTOM is chosen.; data: fixture
- Gender Presentation (+ Custom) (select): Sets form.gender_presentation; reveals custom text field when CUSTOM.; data: fixture
- Role Archetype (modal-trigger): Opens CrestfallOptionModal grouped by Fantasy/Modern/Sci-Fi to set form.short_concept.; data: fixture
- Character Color Palette (modal-trigger): Opens a swatch picker to set form.character_color_palette_id.; data: fixture

**appearance step**

- Skin Tone (modal-trigger): Opens a swatch/option modal to set form.skin_tone.; data: fixture
- Eye Color (modal-trigger): Opens option modal to set form.eye_color.; data: fixture
- Hair (modal-trigger): Opens a sectioned option modal to set hair-related field(s), plus a bounded custom-value text input inside the modal.; data: fixture
- Ethnic Appearance (modal-trigger): TraitModal picker setting form.visual_heritage_reference from visualHeritageReferenceOptions.; data: fixture
- Default Clothing (modal-trigger): Opens Outfit/Wardrobe picker; loads the user's own OUTFIT creations and, on selection, writes default_clothing_mode plus default_outfit_* fields into the character form.; wired to `fetchOwnedCreations GET /api/creations?type=OUTFIT`

**body step**

- Kibbe-Inspired Body Identity (modal-trigger): Opens preset picker; selecting a Kibbe identity and one of three apply modes (Save Identity Only, Fill Empty Fields, Replace Body Traits) writes kibbe_identity and optionally body_type/build/height/proportions.; data: fixture
- Body Type (modal-trigger): TraitModal picker over bodyTypeOptions.; data: fixture
- Height (modal-trigger): TraitModal picker over heightOptions.; data: fixture
- Build (modal-trigger): TraitModal picker over buildOptions.; data: fixture
- Proportions (modal-trigger): MultiTraitModal, allows selecting multiple compatible proportion traits into form.proportions array.; data: fixture
- Custom Body Notes (textarea): Free-text notes stored in form.body_notes.; data: local_state

**behavior step**

- Outward Personality / Internal Personality (modal-trigger): PersonalityModal pickers writing outward_personality and internal_personality.; data: fixture
- MBTI / Western Zodiac / East Asian Zodiac (optional frameworks) (modal-trigger): Three TraitModal pickers writing mbti_type, western_zodiac_sign, east_asian_zodiac_sign, labelled as supplemental flavor only.; data: fixture
- Speech Style / Movement Style (modal-trigger): TraitModal pickers writing speech_style and movement_style.; data: fixture
- Voice Modules (choose/clear) (modal-trigger): Multi-select modal to toggle voice_module_ids on/off, plus Clear All / Done actions inside the modal.; data: fixture
- Verbosity (select): Sets form.verbosity_level to a 1-5 scale.; data: local_state
- Interests (modal-trigger): TraitModal picker writing form.interests.; data: fixture
- Philosophy (textarea): Free-text writing to form.philosophy.; data: local_state

**review step**

- Visibility / Content Rating / Default Rendering Style (select): Three CrestfallSelect controls writing visibility, content_rating, rendering_style.; data: fixture
- Age (input): Number input for form.age; onBlur clamps any value under 18 up to 18.; data: local_state
- Advanced Creator Guidance (expand/collapse) (toggle): Shows/hides 7 advanced narrative textareas (Greeting, Scenario, Relationship to Player, Backstory, Appearance Notes, Personality Notes, Extra Runtime Notes) plus the Advanced Prompting editor.; data: local_state
- Draft Summary (display): Read-only recap of name/species/role/personality/MBTI/zodiac/Kibbe/body type/rendering/color palette pulled from live form state.; data: local_state

**review step – advanced prompting**

- Enable Advanced Prompting (toggle): Turns on Creator Directives (form.creator_directives.enabled) and marks security status NEEDS_RESCAN.; data: local_state
- Core Identity / Voice & Verbal Texture / Relationship / Combat / Romance (and remaining sections) (textarea): Per-section expand/collapse plus a character-limited textarea writing into creator_directives.source[sectionId]; each has a Clear Section button.; data: local_state


### `/studio/create/character-template`

Build a reusable character template whose default field values can prefill Character Creator later.

**page head**

- Back to Create (link): Navigates to /studio/create.

**summary aside**

- Clear Template Draft (button): Resets the whole form back to EMPTY_CHARACTER_TEMPLATE_FORM and returns to the Template step.; data: local_state
- Completion / Defaults Filled / Applies To (display): Live percentage complete and filled-field count computed from form state.; data: local_state

**builder header**

- Browse Templates (link): Navigates to /studio/templates/characters.
- Save Template (button): POSTs a CHARACTER_TEMPLATE creation from the current form; on success routes to /studio/my-creations.; wired to `createCharacterTemplateDraft (createCreationDraft) POST /api/creations`; missing states: empty

**builder**

- Template / Identity / Appearance / Body / Behavior / Review (tabs): Jumps between the 6 builder steps.; data: local_state

**builder footer**

- Back / Next (button): Step navigation identical in behaviour to the Character Creator flow.; data: local_state

**template step**

- Template Name / Category / Tags / Short Description (input): Four fields (3 text inputs + 1 textarea) writing form.title, form.category, form.tags, form.description.; data: local_state

**identity defaults step**

- Default Name / Default Title / Species / Gender Presentation / Role Archetype (modal-trigger): Same field set as the Character Creator identity step, but writing template defaults instead of a live character (Role Archetype via CrestfallOptionModal, others via input/select).; data: fixture

**appearance defaults step**

- Skin Tone / Eye Color / Hair Color / Hair Style / Clothing Style (modal-trigger): SkinToneModal plus three HairEyesModal instances (eye_color, hair_color, hair_style) and a free-text Clothing Style input.; data: fixture

**body defaults step**

- Kibbe Preset / Body Type / Height / Build / Proportions / Custom Body Notes (modal-trigger): Same body picker set as Character Creator's Body step, writing template defaults.; data: fixture

**behavior defaults step**

- Outward/Internal Personality, MBTI/Zodiac frameworks, Speech/Movement Style, Verbosity, Interests, Philosophy (modal-trigger): Same behavior picker set as Character Creator's Behavior step, writing template defaults.; data: fixture

**review step**

- Template Name / Category / Completion / Defaults Filled / Filled Sections (display): Read-only recap of the template plus a per-section "Has defaults / No defaults set" status grid.; data: local_state


### `/studio/create/event-registry`

Build a reusable structured event registry (entries, relationships, rules, prompt guidance) via the shared StructuredRegistryBuilder.

**page head**

- Back to Create (link): Navigates back to /studio/create

**builder head panel**

- Save Draft (button): Builds the structured registry creation payload and POSTs a new draft creation, then redirects to its edit page.; wired to `createCreationDraft POST /api/creations`; missing states: empty
- Overview / Entries / Relationships / Rules / Prompt Guidance / Review (tabs): Switches the active builder section; entirely local state, no fetch per tab.; data: local_state

**Overview tab**

- Registry title (input): Sets registry title, held in local state.; data: local_state
- Registry scope (input): Sets registry.scope field in local state.; data: local_state
- Description (textarea): Sets registry description in local state.; data: local_state

**Entries tab**

- Add {entryLabel} (button): Appends a new empty entry to registry.entries and selects it, switches to Entries tab.; data: local_state
- entry list rows (display): Lists all entries as selectable rows showing name and category; selecting sets active entry.; data: local_state

**Entries tab / entry editor**

- {entryLabel} name (input): Updates active entry's name field.; data: local_state
- {categoryLabel} (select): Sets active entry's category from registryType-specific categoryOptions.; data: fixture
- Aliases / alternate names, one per line (textarea): Updates entry.aliases (parsed list) via normalizeListText.; data: local_state
- Summary (textarea): Updates entry.summary.; data: local_state
- Public description (textarea): Updates entry.publicDescription.; data: local_state
- Hidden / restricted notes (textarea): Updates entry.hiddenNotes.; data: local_state
- Visual identity (textarea): Updates entry.visualIdentity.; data: local_state
- Delete Entry (button): Removes active entry from registry.entries; selects next entry if any.; data: local_state

**Relationships tab**

- Relationship notes (textarea): Updates entry.relationshipNotes for each entry.; data: local_state

**Relationships tab / linked-creation group**

- Link Creation (per relationship group, e.g. Participants, Event Locations, Organizations, Related Event/Quest Registries) (modal-trigger): Opens the linked-creation picker modal scoped to the group's allowedTypes.; data: local_state

**Relationships tab / linked-creation picker modal**

- Search creations... (input): Filters the fetched owned creations of the allowed types by title/description/type/name/category etc.; data: local_state
- creation result cards (display): Shows the owned creations for the group's allowedTypes (one fetchOwnedCreations call per type, deduped); clicking selects/links it to the entry.; wired to `fetchOwnedCreations GET /api/creations?type={TYPE}`

**Relationships tab / linked-creation card**

- Remove (button): Removes the linked creation from the entry's relationship group array.; data: local_state
- Optional link notes... (textarea): Updates the notes field on the individual link object.; data: local_state

**Rules tab**

- Rules notes / Access-requirements / Knowledge-visibility / Consequences-outcomes (textarea): Updates entry.rulesNotes, accessRules, knowledgeRules, consequences per entry - four separate textareas.; data: local_state

**Prompt Guidance tab**

- Registry summary / Usage notes / Negative prompt notes (textarea): Updates registry.prompt_guidance.summary / usageNotes / negativePromptNotes.; data: local_state

**Review tab**

- Structured payload preview (display): Shows JSON.stringify of the full registry data as a live read-only preview of what will be saved.; data: local_state


### `/studio/create/faction-registry`

Build a reusable structured faction-continuity registry via the shared StructuredRegistryBuilder, parameterized registryType=FACTION_REGISTRY.

**whole page**

- (identical control set to event-registry) (display): Same StructuredRegistryBuilder composition as event-registry: header/Save Draft, tabs, entries CRUD, relationships (Linked Characters/People, Linked Locations, Linked Organizations/Factions/Systems groups only - no event/quest registry link groups), rules, prompt guidance, review.; wired to `createCreationDraft POST /api/creations; fetchOwnedCreations GET /api/creations?type=`


### `/studio/create/item-registry`

Build a reusable item/inventory continuity registry with bespoke tabs for objects, associations, tracking and prompt guidance.

**page head**

- Back to Create (link): Navigates back to /studio/create

**builder head panel**

- Open Draft (link): Appears after a successful save; links to /studio/my-creations/{id}/edit.; data: local_state
- Save Draft (button): Builds the item registry payload and POSTs a new draft creation; on success either calls onCreated callback or redirects to /studio/my-creations. Button becomes permanently disabled once saved (no re-save).; wired to `createCreationDraft POST /api/creations`; missing states: empty
- Overview / Entries / Associations / Tracking / Prompt Guidance / Review (tabs): Switches active builder section, local state only.; data: local_state

**Overview tab**

- Registry title / Registry scope / Description (input): Sets title, scope, description fields in local state (title/scope inputs, description textarea).; data: local_state

**Entries tab**

- Add Entry (button): Creates a new empty item entry, selects it, switches to Entries tab.; data: local_state
- entry list rows (display): Lists item entries showing name, role, category; click selects for editing.; data: local_state

**Entries tab / entry editor**

- Name / Category / Role / Default placement (input): Name text input; Category, Role, Default placement are CrestfallSelect dropdowns from fixed option arrays.; data: fixture
- Aliases / Description / Visual description / Symbolic-memory meaning (textarea): Updates entry.aliases (list), description, visualDescription, symbolicMeaning.; data: local_state
- Delete Entry (button): Removes the active entry from the registry.; data: local_state

**Associations tab**

- Ownership notes / Location notes (textarea): Per-entry free-text ownership and location notes; no structured picker to Character/PC/Location creations.; data: local_state

**Tracking tab / Starting Assignment**

- Starting Holder (select): Chooses holder type: Unassigned, Story Inventory, Character, Player Character, Location.; data: local_state
- Select Character / Select Player Character / Select Location (Change/Clear) (modal-trigger): Opens RegistryLinkedCreationPickerModal scoped to CHARACTER, PLAYER_CHARACTER, or LOCATION depending on holder type; Clear removes the selected holder.; wired to `fetchOwnedCreations GET /api/creations?type={TYPE}`

**Tracking tab / Nested Starting Placement**

- Placement Specificity (select): Toggles between Explicit path and Unspecified narrative staging.; data: local_state
- Add New Level / Move Up / Move Down / Delete (per placement level) / Level Type / Label (button): Adds, reorders, deletes, and edits nested placement path steps (kind + label) for the item's starting location.; data: local_state
- Placement Note (textarea): Free-text note attached to the placement.; data: local_state

**Tracking tab**

- Quantity mode / Starting quantity / Consumption / Durability / Condition percent / Availability rule (input): Sets item runtime-tracking metadata fields per entry (mix of select and text inputs).; data: local_state
- Runtime systems should not assume this item is available... (checkbox): Toggles entry.doNotHallucinateAvailability flag.; data: local_state

**Prompt Guidance tab**

- Registry summary / Usage notes / Negative prompt notes (textarea): Registry-level prompt guidance fields.; data: local_state
- Entry prompt guidance / Entry negative prompt notes (textarea): Per-entry prompt guidance and negative-prompt fields for image generation.; data: local_state

**Review tab**

- Structured payload preview (display): Read-only JSON preview of the full item registry payload to be saved.; data: local_state


### `/studio/create/location-registry`

Build a reusable location-continuity registry with places, connections, presence bindings, and weather scopes.

**page head**

- Back to Create (link): Navigates back to /studio/create

**tab row**

- Overview / Locations / Connections / People & Presence / Weather Scope / Runtime Rules (tabs): Switches active builder section.; data: local_state

**summary aside**

- Save Registry (button): Builds the location registry payload and POSTs (or PATCHes, in a shared save-session) a creation draft, redirects to its edit page on success.; wired to `createCreationDraft POST /api/creations (or updateCreationDraft PATCH /api/creations/[id] on a retried save)`; missing states: empty
- Registry Summary counters (display): Shows title, description, and live counts for Scope/Locations/Connections/People & Presence/Weather Scopes/Mutation.; data: local_state

**Overview tab**

- Registry Title / Scope / Description / Runtime Summary / Usage Notes (input): Sets registry title/scope (inputs) and description/promptGuidance.summary/usageNotes (textareas).; data: local_state

**Locations tab**

- Add Location (button): Opens the Location Entry modal with a fresh empty draft.; data: local_state
- location entry cards (Edit / Delete) (display): Lists each location entry with kind/category/scale, parent, weather scope, region, mood, structured-people count, and summary; Edit opens the modal, Delete removes the entry and cascades removal from connections/presence bindings.; data: local_state

**Location Entry modal**

- Basic / Ad-Hoc Location vs Link Existing Location (toggle): Switches entry kind between AD_HOC (freeform name) and CREATION_REF (linked to an existing LOCATION creation).; data: local_state
- location asset search/select panel (display): When kind=CREATION_REF, shows a searchable card grid of the user's LOCATION creations (fetched once on builder mount); selecting one applies its name/description onto the entry draft.; wired to `fetchLocationRegistryLocationOptions -> fetchOwnedCreations GET /api/creations?type=LOCATION`; missing states: loading
- Name (ad-hoc only) (input): Freeform location name when not linked to a creation.; data: local_state
- Category / Location Scale / Space Type / Parent Location / Weather Scope (select): 5 dropdowns: category/scale/space-type from fixed option constants, Parent Location from other entries in this registry, Weather Scope from this registry's weather scopes.; data: local_state
- Region/Area Label / Mood (input): Two freeform text fields.; data: local_state
- Aliases / Summary / Public Description / Hidden Notes / Atmosphere / Sensory Notes / Place Function / Themes / Scene Affordances / Access Rules / Knowledge Rules / Rules Notes / Prompt Guidance (textarea): 13 descriptive/rules/prompt textareas on the location entry draft.; data: local_state
- Save Location / Cancel (button): Save Location upserts the entry draft into registry.entries (requires name) and closes; Cancel discards the draft.; data: local_state

**Connections tab**

- Add Connection (button): Opens the Connection modal with a fresh draft; disabled until at least 2 locations exist.; data: local_state
- connection cards (Edit / Delete) (display): Lists each connection with relation, route type, from/to location names, distance estimate, available methods, physical distance, bidirectional flag, and notes.; data: local_state

**Connection modal**

- From Location / To Location / Relationship / Distance Estimate (select): 4 dropdowns; Relationship changing auto-suggests a Distance Estimate default via DEFAULT_DISTANCE_MODE_BY_RELATION.; data: local_state
- Available Travel Methods (checkbox): Multi-select checkbox group of route types this connection supports; also auto-syncs the Default Travel Method dropdown options.; data: local_state
- Default Travel Method / Optional Physical Distance (Meters) / Bidirectional (input): Default Travel Method is a select constrained to the chosen Available Travel Methods; Distance is a text input; Bidirectional is a checkbox.; data: local_state
- Access Rules / Route Notes (textarea): Two freeform text fields on the connection.; data: local_state
- Save Connection / Cancel (button): Save Connection upserts the draft (requires from/to location) and closes; Cancel discards.; data: local_state

**People & Presence tab**

- Add Presence Binding (button): Opens the Presence Binding modal; disabled until at least one Location exists.; data: local_state
- presence binding cards (Edit / Delete) (display): Lists each binding with relationship role, frequency, person name, location, automatic-presence/opportunity badges, cooldown/absence turns, guidance.; data: local_state

**Presence Binding modal**

- Location / Relationship to Location / Presence Frequency / Automatic Presence Enabled (select): 3 selects plus 1 checkbox configuring the binding's location, role, frequency, and automatic-arrival flag.; data: local_state
- NPC Registry Person search/select panel (display): Card grid of NPC Registry entries (fetched once on builder mount from all owned NPC_REGISTRY creations); selecting one applies displayName/registry linkage onto the binding draft's person field.; wired to `fetchOwnedCreations GET /api/creations?type=NPC_REGISTRY`; missing states: loading
- Eligible Arrival Opportunities (checkbox): Multi-select checkbox group of opportunity trigger tags.; data: local_state
- Cooldown Turns / Minimum Absent Turns (input): Two numeric text fields governing automatic re-appearance timing.; data: local_state
- Presence/Arrival Guidance / Allowed Dayparts / Required Scene Tags / Excluded Scene Tags / Required Runtime Flags (textarea): 5 freeform/list textareas describing when/how the binding's automatic presence should trigger.; data: local_state
- Save Presence Binding / Cancel (button): Save upserts the binding (requires location + selected NPC person, and blocks exact duplicates) and closes; Cancel discards.; data: local_state

**Weather Scope tab**

- Add Weather Scope (button): Opens the Weather Scope modal with a fresh draft.; data: local_state
- weather scope cards (Edit / Delete) (display): Lists weather scopes with type/name/behavior-or-notes; Delete also clears weatherScopeId off any entries that referenced it.; data: local_state

**Weather Scope modal**

- Name / Scope Type (input): Two freeform text fields on the weather scope.; data: local_state
- Default Weather Behavior / Notes (textarea): Two freeform text fields.; data: local_state
- Save Weather Scope / Cancel (button): Save upserts the weather scope draft (requires name) and closes; Cancel discards.; data: local_state

**Runtime Rules tab**

- Movement Resolver Notes / Ad-Hoc Location Policy (textarea): Two freeform textareas describing future movement-resolver and ad-hoc-location behavior; no runtime consumer wired yet.; data: local_state
- Middleware Intent list (display): Read-only bullet list of registry.middlewareHints.intendedUse strings; no control to edit it in this builder.; data: local_state; **STUBBED**


### `/studio/create/organization-registry`

Build a reusable structured organization-continuity registry via the shared StructuredRegistryBuilder, parameterized registryType=ORGANIZATION_REGISTRY.

**whole page**

- (identical control set to event-registry) (display): Same StructuredRegistryBuilder composition as event-registry: header/Save Draft, tabs, entries CRUD, relationships (same default 3-group set as faction: Linked Characters/People, Linked Locations, Linked Organizations/Factions/Systems), rules, prompt guidance, review.; wired to `createCreationDraft POST /api/creations; fetchOwnedCreations GET /api/creations?type=`


### `/studio/create/progression-profile`

Define reusable cumulative-experience thresholds and level tiers for later attachment through an Actor Mechanics Profile.

**page head**

- Back to Create (link): Navigates back to /studio/create

**profile definition card**

- Profile title / Tags / Description / Profile enabled (input): Sets profile.title, profile.tags (comma text), profile.description (textarea), profile.enabled (checkbox); data: local_state
- JSON Editor (modal-trigger): Opens ProgressionJsonEditorModal for raw JSON editing of the whole progression profile; data: local_state

**progression curve card**

- Curve mode / Maximum-level XP behavior / Minimum level / Level cap (select): Sets curve.mode (GENERATED_CURVE, GENERATED_CURVE_WITH_OVERRIDES, EXPLICIT_TABLE), curve.maximumExperiencePolicy (select), curve.minimumLevel/maximumLevel (number inputs); data: local_state
- Generated Threshold Preview (display): Collapsible read-only table of a bounded first-and-last-level preview of the deterministically computed XP table (generated rows are not persisted); data: local_state

**progression curve card - algorithmic settings**

- Curve type / Requirement interpretation / Starting requirement / Linear increase / Growth multiplier / Power exponent / Minimum increase / Rounding increment / Rounding policy (input): Configures the deterministic generation parameters for a generated curve (shown only when curve.mode is not EXPLICIT_TABLE); data: local_state

**progression curve card - level overrides**

- Add override / Remove / Override ID / Level / Replacement cost or XP (button): Adds, edits, or removes a per-level override to the generated curve (shown when mode is GENERATED_CURVE_WITH_OVERRIDES); data: local_state

**progression curve card - explicit table**

- Cumulative experience per level (input): Edits curve.thresholds[level].cumulativeExperience directly, row per level (shown when curve.mode is EXPLICIT_TABLE); data: local_state

**tier definitions card**

- Add tier / Remove / Tier ID / Title / Minimum level / Maximum level / Description / Tags / Tier enabled (input): Adds, edits, or removes a level-band tier definition (id, title, level range, description, tags, enabled checkbox); data: local_state

**metrics row**

- Levels / Stored rows / Overrides / Tiers (display): Read-only counts of resolved levels, stored table rows, overrides, and tiers; data: local_state

**validation panel**

- Validation errors/warnings list (display): Lists validateProgressionProfileEditorValue issues or a ready-state message; data: local_state

**aside identity/save panel**

- Creation name / Description / Visibility / Content rating (input): Sets draft.title, draft.description, draft.visibility, draft.contentRating for the wrapping creation record; data: local_state
- Save Draft (button): Validates and POSTs the creation draft; on success routes to /studio/my-creations/[id]/edit; wired to `progressionClient.createProgressionProfileDraft (creationClient.createCreationDraft) POST /api/creations`; missing states: empty


### `/studio/feedback`

Hub for following the Crestfall roadmap, reporting bugs, submitting suggestions, and reaching Discord while formal feedback tooling is built.

**page head**

- Roadmap, Feedback & Updates (title only) (display): Static StudioPageHeader copy.

**development hub panel - card grid**

- Public Roadmap / Bug Reports / Suggestions / Release Notes (all 'Coming Soon') (display): Static, non-interactive 2x2 card grid built from a hardcoded feedbackCards array; no clicks, no links, no data source.; data: fixture; **STUBBED**

**sidebar aside - community link**

- Open Discord (link): External anchor (target=_blank) to a fixed Discord channel URL.

**sidebar aside - navigation**

- Back to Studio (link): Next.js Link back to /studio.


### `/studio/games`

Games hub letting a creator start official games, resume active sessions, or browse curated playable rooms.

**page head**

- Games (title) / desktop and mobile eyebrow-title blocks (display): Two separately hand-built header blocks (desktop uses StudioPageHeader, mobile is a bespoke inline p/h1) toggled by responsive hidden/md:block classes.

**filter bar - search**

- Search games, scenarios, narrators, cast... (input): Free-text search that client-side filters the loaded games list by title/subtitle/description/scenario/narrator/badge/contentRating/canonRelationship/cast.; data: local_state

**filter bar - pills**

- All / Continue / Official / Canon-Compatible / Community / Featured (tabs): Sets activeFilter which client-filters the games list by canonRelationship/playState/featured.; data: local_state

**filter bar - view mode**

- Grid / List (toggle): Switches games layout between grid cards and list rows; persisted via usePersistentViewMode (desktop default grid, mobile default list, storage key crestfall.games.viewMode).; data: local_state

**mobile - browse controls drawer**

- Browse Controls (expand/collapse) (toggle): Opens/closes a mobile-only drawer containing the same search, view toggle, filter pills, Continue and Featured Starts lists.; data: local_state

**Continue panel (desktop) / drawer**

- Active Chronicle continue-game rows (display): Lists games whose playState is CONTINUE (i.e. have a continueRoomId), each clickable to resume; shows a placeholder sentence when empty.; wired to `gamesClient.fetchGames GET /api/studio/games`; missing states: loading/error

**Continue panel row / list row / grid card**

- Continue / Play (per game) (button): For CONTINUE games, routes directly to /studio/story-rooms/[roomId]; for new games, calls playStoryTemplate with the game's templateId then routes to the returned room id. Button disables and shows 'Starting...' while in flight.; wired to `storyRoomClient.playStoryTemplate POST /api/studio/story-rooms/from-template`; missing states: empty

**featured rail**

- Curated Starts cards (button): Shows up to 3 featured games (only visible when filter is ALL and query empty); clicking triggers the same handleGameAction play flow.; wired to `storyRoomClient.playStoryTemplate POST /api/studio/story-rooms/from-template`; missing states: empty/loading/error

**main grid/list**

- Games grid or list (filteredGames) (display): Renders the filtered/searched games as cards (grid) or rows (list); each item shows canon badge, content rating, title, description, scenario/narrator/cast, last-active, message count, and a Play/Continue button.; wired to `gamesClient.fetchGames GET /api/studio/games`

**canon legend**

- Official Canon / Canon-Compatible / Community Sandbox legend cards (display): Static explanatory legend, no data binding.; data: fixture


### `/studio/my-creations/[id]/image-library`

Let a creator manage the pool of generated images tied to one creation, assigning featured slots and hiding, showing, or deleting unwanted images.

**page head**

- Refresh (button): Re-fetches the creation's image library from the server.; wired to `fetchCreationImageLibrary GET /api/creations/{id}/image-library`; missing states: empty
- Back to Editor (link): Navigates to /studio/my-creations/{id}/edit (falls back to /studio/my-creations if no id).

**featured slots grid**

- Primary / Alt 1 / Alt 2 / Alt 3 slot cards (display): Shows the four featured-slot images (or empty placeholder); clicking an image opens the lightbox at that image.; wired to `fetchCreationImageLibrary GET /api/creations/{id}/image-library`; missing states: loading/error

**visible library / filter row**

- Eligibility filter (All / Eligible / Blocked) (tabs): Filters visible images client-side by whether they are eligible to be used as a featured image (moderation-cleared).; data: local_state
- Sort select (Newest / Oldest / Eligible First / Needs Review First) (select): Sorts the visible image list client-side.; data: local_state

**visible library**

- Character Images masonry grid (display): Shows the visible (non-hidden) images for this creation with moderation/content-rating pills; clicking an image opens the lightbox.; wired to `fetchCreationImageLibrary GET /api/creations/{id}/image-library`; missing states: error

**visible library / image card**

- Slot assignment buttons (Primary / Alt 1 / Alt 2 / Alt 3) (button): Assigns this image to the chosen featured slot for the creation, replacing whatever image currently holds that slot; reloads the library on success. Disabled entirely if the image is not moderation-eligible (canUseAsFeatured false).; wired to `setCreationFeaturedImageSlot PUT /api/creations/{id}/featured-image-slots/{slotKey}`; missing states: empty
- Hide (button): Sets the image's libraryVisibility to HIDDEN, moving it to the Hidden section; reloads the library on success.; wired to `updateCreationImageLibraryEntry PATCH /api/creations/{id}/image-library/{entryId} (body libraryVisibility HIDDEN)`; missing states: empty/error

**hidden library / image card**

- Show (button): Sets the image's libraryVisibility back to VISIBLE, moving it out of the Hidden section.; wired to `updateCreationImageLibraryEntry PATCH /api/creations/{id}/image-library/{entryId} (body libraryVisibility VISIBLE)`; missing states: empty/error

**visible/hidden library / image card**

- Delete Image (button): Confirms via window.confirm(), then permanently deletes the image output (removes it from featured slots and character libraries) and reloads the library.; wired to `deleteImageOutput DELETE /api/media/images/{imageOutputId} (body deleteReason: owner_deleted_from_character_library)`; missing states: empty

**image card / featured slot**

- Like (heart, hover quick action) (button): Toggles a LIKE reaction on the underlying image output.; wired to `setMediaLike -> POST /api/media/reactions (reactionType LIKE); fetchMediaReactions GET /api/media/reactions on load`; missing states: empty/loading
- Bookmark (hover quick action) (button): Toggles a BOOKMARK reaction on the underlying image output.; wired to `setMediaBookmark -> POST /api/media/reactions (reactionType BOOKMARK)`; missing states: empty/loading
- Expand (maximize icon, hover quick action) (button): Opens MediaLightbox on this image.; data: local_state

**lightbox (modal)**

- Generate Variant (link): Navigates to /studio/image-studio?creation={id} to start a new generation from this image's context.
- Download (link): Downloads the currently displayed full-resolution image (native <a download>).
- Details (modal-trigger): Opens a dialog fetching and showing this image's generation details (prompt/settings), with private rows gated to the image creator or linked-creation owner.; wired to `fetchImageOutputDetails GET /api/media/images/{imageOutputId}/details`
- Report (modal-trigger): Opens a form to submit a moderation report against the image (reason dropdown + optional note).; wired to `createMediaReport POST /api/media/reports`; missing states: empty
- Remix Soon / Use as Reference Soon / More Soon (button): Nothing; rendered permanently disabled as coming-soon placeholders.; **STUBBED**
- Delete Image (lightbox toolbar) (button): Same delete flow as the card Delete Image button (window.confirm then deleteImageOutput), reachable from inside the lightbox.; wired to `deleteImageOutput DELETE /api/media/images/{imageOutputId}`; missing states: empty/loading/error
- Share (button): Uses navigator.share() if available, else copies the current page URL to clipboard; shows a transient status message.; data: local_state

**lightbox (modal) / report dialog**

- Reason select (select): Chooses a moderation report reason code from a fixed list (sexual_content, violence_gore, underage_concern, copyright_likeness, harassment_hate, spam_misleading, other).; data: fixture
- Optional note (textarea): Free-text context for the moderation report, max 2000 chars.; data: local_state


### `/studio/storylines`

Let a creator browse their existing Storylines and start creating a new one that sequences Stories and Scenarios in order.

**page head**

- Continuing Narrative Paths eyebrow/title/lede (display): Static page head text, no data binding.

**hub header row**

- Create Storyline (link): Navigates to /studio/create/storyline to start a new storyline draft.

**hub body**

- Loading Storylines... (display): Loading banner shown while fetchOwnedStorylines is in flight.; wired to `fetchOwnedStorylines (fetchOwnedCreations) GET /api/creations?type=STORYLINE`; missing states: empty/error
- Storylines could not be loaded. (error banner) (display): Shows the caught error message when the fetch fails.; wired to `fetchOwnedStorylines (fetchOwnedCreations) GET /api/creations?type=STORYLINE`; missing states: empty/loading
- No Storylines Yet (empty state) (display): Shown when the load succeeds with zero storylines.; wired to `fetchOwnedStorylines (fetchOwnedCreations) GET /api/creations?type=STORYLINE`; missing states: loading/error

**storyline card grid**

- Storyline card (title, description, node count) (display): Each card is a link to /studio/my-creations/{id}/edit and shows node count derived from storyline.data.nodes/ordered_nodes.; wired to `fetchOwnedStorylines (fetchOwnedCreations) GET /api/creations?type=STORYLINE`


### `/studio/account`

Account hub showing the signed-in creator's profile summary, coin balance, activity metrics, and links out to subscription/preferences/appearance/notifications/privacy/safety settings.

**page head**

- Profile & Preferences (eyebrow/title) (display): Static page title and description text, no data binding.

**profile summary form**

- View Public Profile (link): Links to /studio/profile/[username] when the creator has a username set; hidden otherwise.; wired to `studioAccountClient.fetchCurrentStudioAccount GET /api/profile/me`; missing states: empty
- Save Profile (top and bottom buttons) (button): Submits the profile form (username, display name, contact email, content rating preference, default player character id, tagline, description, announcement) to update the account.; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`; missing states: empty
- Login Email (display): Shows the Supabase login email as a read-only value; explicitly non-editable.; wired to `studioAccountClient.fetchCurrentStudioAccount GET /api/profile/me`; missing states: empty
- Contact Email (input): Editable contact email field, separate from Supabase login email, saved on Save Profile.; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`; missing states: empty
- Username (input): Editable username, drives whether the public profile link/media manager show, saved on Save Profile.; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`; missing states: empty
- Display Name (input): Editable display name shown next to the profile avatar and used as fallback profile heading, saved on Save Profile.; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`; missing states: empty
- Content Preference (select): Selects SFW/Mature/Explicit content rating preference; choosing Mature or Explicit opens an age-verification-required notice modal and the value is NOT applied (only SFW commits directly).; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`; **GATED**; missing states: empty
- Age Verification Required modal (OK / X) (modal-trigger): Informational modal explaining Mature/Explicit preferences are inactive pending age verification; both OK and X close it without changing content_rating_preference.; data: local_state; **STUBBED**
- Choose Default PC (modal-trigger): Opens the Default Player Character picker modal.; data: local_state
- Clear (default PC) (button): Clears the selected default player character id in local form state only; the clear is persisted only when Save Profile is subsequently submitted.; wired to `studioAccountClient.updateCurrentStudioAccount PATCH /api/profile/me`

**default player character picker modal**

- Search your player characters... (input): Filters the loaded PLAYER_CHARACTER creations list client-side by title/description/name/alias/short_concept/role_archetype/personality_summary.; data: local_state
- Player character grid (display): Lists the creator's own PLAYER_CHARACTER creations as selectable cards; clicking one sets it as the default (local state, committed on Save Profile).; wired to `creationClient.fetchOwnedCreations GET /api/creations?type=PLAYER_CHARACTER`
- Close (X) (button): Closes the picker modal without committing a change beyond what was already clicked into local form state.; data: local_state

**profile media manager**

- Choose Soon (Avatar) (button): Disabled placeholder for selecting an active avatar image; no handler wired.; data: local_state; **STUBBED**
- Choose Soon (Banner) (button): Disabled placeholder for selecting an active profile banner image; no handler wired.; data: local_state; **STUBBED**

**profile summary form (embedded metrics)**

- Characters / Canon / Interactions / Likes / Images stat tiles (display): Shows the creator's activity counts, fetched live from account metrics endpoint.; wired to `studioAccountClient.fetchStudioAccountMetrics GET /api/account/metrics`; missing states: empty/loading

**coins panel**

- Buy Coins Soon (modal-trigger): Opens an informational modal stating coin purchases are not yet available; admins can manually add coins during testing.; data: local_state; **STUBBED**
- Buy Coins info modal (Got it / X) (button): Closes the coin-purchase-not-available modal.; data: local_state; **STUBBED**
- Crestfall Coins balance (display): Shows the creator's live coin balance.; wired to `studioAccountClient.fetchCurrentStudioAccount GET /api/profile/me`; missing states: empty
- Characters / Canon / Messages / Likes stat tiles (inside Coins panel) (display): Renders a 4-tile stat grid, but the values are a hardcoded local constant that always reads "0" regardless of the account fetched; it is never populated from fetchCurrentStudioAccount or any metrics call.; data: fixture; **BROKEN**

**metrics panel (below coins)**

- Characters / Canon / Interactions / Likes / Images stat tiles (display): Second, independently-fetching instance of the same live metrics tiles rendered directly under the Coins panel.; wired to `studioAccountClient.fetchStudioAccountMetrics GET /api/account/metrics`; missing states: empty/loading

**settings link grid**

- Subscription (link): Navigates to /studio/account/subscription.
- Preferences (link): Navigates to /studio/account/preferences.
- Appearance (link): Navigates to /studio/account/appearance.
- Notifications (link): Navigates to /studio/account/notifications.
- Privacy (link): Navigates to /studio/account/privacy.
- Safety & Content Settings (link): Navigates to /studio/account/safety.

**page footer**

- Sign Out (link): Plain anchor to /logout, which is a real app route.


### `/studio/create/image-preset`

Create a reusable Image Preset for style, mood, framing, and generation consistency.

**Builder sidebar**

- Preset Family / Default Aspect (extraFields selects) (select): Config-driven classification dropdowns unique to Image Preset.; data: fixture
- Location-only panels (Parent Location, Runtime Inheritance, Runtime Modules) (display): Dead code path: AssetBuilder.view.jsx contains full LOCATION-branch UI (LocationParentPanel, RuntimeInheritancePanel, weather runtime slot), gated on creationType === 'LOCATION', but no route ever mounts AssetBuilderShell with a LOCATION config (the Location route uses the separate LocationBuilderShell). This code is unreachable through the app's current routing.; **BROKEN**

**Builder sidebar + Cover image panel**

- All other AssetBuilderShell controls (display): Identical wiring to /studio/create/outfit, save payload type is IMAGE_PRESET.; wired to `createVisualAssetDraft (createCreationDraft) POST /api/creations`; missing states: empty


### `/studio/create/location`

Build a Location / Scene asset with identity, classification, sensory detail, parent hierarchy, runtime modules, registry attachments, and cover image.

**Builder sidebar**

- Save Draft (button): Builds the LOCATION creation payload from form + locationData and POSTs it, then routes to the edit page.; wired to `createLocationDraft (createCreationDraft) POST /api/creations`; missing states: empty
- Summary / Runtime pills (display): Shows locationScale, space_type, mood, parent title, weather/time inheritance and module-configured status, and attached-registry count, all derived from local form state.; data: local_state

**Location Profile card**

- Name / Description / Tags / Visibility / Content Rating (input): Sets base identity fields (Description via textarea, Visibility/Content Rating via CrestfallSelect).; data: local_state

**Location Guidance card**

- Location Guidance / Standalone Image Prompt / Negative Prompt (textarea): Prompt guidance text plus optional image/negative prompt fields capped at 2000 chars each.; data: local_state

**Classification card**

- Space Type / Location Scale / Mood (select): Config-driven classification dropdowns from assetBuilderConfigs.location.extraFields.; data: fixture

**Sensory Environment card**

- Light Level / Visual Obstruction / Glare Level / Ambient Noise / Sound Obstruction / Echo Level / Scent Masking / Scent Dispersal (input): Numeric 1-10 scale fields for vision, hearing, and scent environment intensity.; data: local_state
- Add Scent Note / Remove / Scent Note label / Strength / Tags (input): CRUD for a list of named scent notes (label, 1-10 strength, free-text tags added via Enter or plus-button).; data: local_state

**Parent Location card**

- Select Parent / Change / Clear (modal-trigger): Opens LocationParentPickerModal to choose a parent LOCATION creation, or clears the current selection.; data: local_state

**Parent Location picker modal**

- Search locations / location grid (input): Loads the current user's owned LOCATION creations and lets the user filter and pick one as parent.; wired to `fetchOwnedCreations GET /api/creations?type=LOCATION`

**Runtime Inheritance card**

- Inherit Weather / Time-Calendar / Knowledge Rules / Travel Rules (checkbox): Toggles whether this location inherits each kind of runtime context from its parent.; data: local_state

**Runtime Modules card**

- Configure/Edit Weather (modal trigger) (modal-trigger): Opens WeatherModuleConfigModal to define or edit the location's in-world weather module binding.; data: local_state
- Weather enabled checkbox (checkbox): Toggles whether the bound weather module is active, once one has been configured.; data: local_state
- Time/Calendar enable checkbox, Inheritance Mode select, Turn Advance / Day Length / Year Length / Start Day / Start Minutes numeric fields, Day Label Prefix text, Show Exact Clock checkbox (input): Configures a full in-world calendar and clock system for the location.; data: local_state
- Runtime Mechanics slot (RuntimeMechanicsModulesSection) (display): Embeds a nested mechanics-module binding editor for this location; not independently traced in this pass.; data: local_state

**Registry Attachments card**

- Add (per-group link picker, e.g. NPC/Item/Event/Quest/Faction/Organization/Location Registry) (modal-trigger): Opens RegistryLinkedCreationPickerModal to attach an existing registry creation to this location, grouped by registry type.; wired to `fetchOwnedCreations GET /api/creations (picker load)`; missing states: loading/error
- Remove / Notes textarea per attached registry card (button): Removes an attached registry link, or edits its free-text notes.; data: local_state

**Cover Image card**

- Candidate cover tiles / Rendering Style / Number of Test Images (button): Same placeholder cover-candidate mechanism as the AssetBuilderShell routes (selects a fake candidate id, no real image generation).; data: local_state; **STUBBED**


### `/studio/create/lore`

Author a structured Lore Asset sourcebook publication with chapters, sections, content blocks, and character/location references.

**Builder sidebar**

- Save Draft (button): POSTs the LORE creation payload (title, description, visibility, content_rating, lore_document) and routes to the edit page.; wired to `createLoreDraft (createCreationDraft) POST /api/creations`; missing states: empty
- Errors / Warnings counters (display): Shows the count of blocking and non-blocking issues from validateLoreDocument.; data: local_state

**Publication Identity card**

- Title / Description / Draft visibility / Content rating (input): Sets top-level identity fields (Description via textarea; visibility/rating via select).; data: local_state

**Mode switch**

- Edit Document / Preview (tabs): Toggles between the structured LoreEditorView and the rendered LoreDocumentRendererView.; data: local_state

**Lore Document editor**

- Publication subtitle / Archive eyebrow / Era / Display date / Realm / Publication summary (input): Sets document-level metadata fields.; data: local_state
- JSON Editor (modal trigger) (modal-trigger): Opens LoreJsonEditorModal to view/edit the entire lore_document as raw JSON, with format/reset/copy/download-AI-guide/validate-and-apply actions.; data: local_state
- Chapter/Section/Block issue list (display): Shows up to 8 validation errors/warnings inline above the document editor.; data: local_state

**Asset-level Character/Location Tags**

- Owned/Liked toggle, search input, reference chips, remove (X) (input): Attaches up to N Character or Location creations (owned or publicly liked) as document-level references; also drives which Character image libraries are eligible for the image picker.; wired to `fetchOwnedCreations GET /api/creations?type=CHARACTER|LOCATION; fetchCommunityCreations GET /api/community/creations?type=CHARACTER|LOCATION plus fetchCreationReactions for the LIKE filter`

**Chapters**

- Add Chapter (button): Appends a new empty chapter, capped at limits.maxChapters.; data: local_state
- Chapter row expand/collapse, move up/down, remove (button): Toggles the chapter's expanded editor, reorders it in the chapters array, or deletes it.; data: local_state

**Chapter editor (expanded)**

- Chapter title / subtitle / eyebrow / display date / era / summary (input): Edits per-chapter metadata (summary via textarea).; data: local_state

**Sections**

- Add Section (button): Appends a new empty section to the current chapter, capped at limits.maxSectionsPerChapter.; data: local_state
- Section row expand/collapse, move up/down, remove (button): Same reorder/expand/delete pattern as chapters, scoped to sections within a chapter.; data: local_state

**Content blocks**

- Add content block (modal trigger, opens BlockPickerModal) (modal-trigger): Opens a searchable library of block types (text, heading, quote/inline-quote/pull-quote, excerpt, story-excerpt, sidebar, stat-block, two-column, callout, image, divider) grouped by category, and appends the chosen type to a section.; data: fixture
- Per-block-type fields (title/body/text/level/attribution/items/stat rows/columns/alt/caption/size/align, plus move up/down/remove per block) (input): Edits the fields specific to each block's type; stat-block and two-column blocks additionally support nested add/remove/move for stat rows and column sub-blocks.; data: local_state

**Content blocks / image block**

- Select from Character library (modal trigger, opens ImagePickerModal) (modal-trigger): Lets the user pick one of the tagged owned Characters, then choose one of that character's approved, visible library images to place into the block.; wired to `fetchCreationImageLibrary GET /api/creations/[id]/image-library`

**Preview mode**

- Rendered document (headings, chapters, sections, blocks, character/location link chips) (display): Renders the current draft document as the public reader would see it, using LoreBlockRenderer, with anchor share-link buttons per section.; data: local_state
- Copy link (per-section share button) (button): Copies an anchor deep-link to the clipboard via CreationShareButton.; data: local_state


### `/studio/create/wardrobe`

Build a reusable wardrobe made of outfit entries, selection rules, and prompt guidance.

**Header**

- Save Draft (button): Builds the WARDROBE creation payload from title/description/entries/rules and POSTs it, then routes to the edit page.; wired to `createCreationDraft POST /api/creations`; missing states: empty
- Overview / Entries / Rules tabs (tabs): Switches which panel is shown below.; data: local_state

**Overview tab**

- Wardrobe title / Scope / Description (input): Sets wardrobe identity fields.; data: local_state

**Entries tab**

- Add Entry (button): Appends a new empty wardrobe entry, selects it, and switches to the Entries tab.; data: local_state
- Entry list row (button): Selects an entry to edit in the Entry Editor pane.; data: local_state

**Entries tab / Entry editor**

- Entry label / Role / Priority / Context tags / Notes (input): Edits the selected entry's metadata fields (Role via CrestfallSelect, Context tags and Notes via textarea).; data: local_state
- Select Outfit / Change Outfit (modal trigger) (modal-trigger): Opens the OutfitPickerModal to attach an existing OUTFIT creation to this entry.; data: local_state
- Enabled checkbox (checkbox): Marks the entry enabled/disabled for future default wardrobe selection.; data: local_state
- Delete Entry (button): Removes the entry from the wardrobe entries array; clears selection/picker state if it was active.; data: local_state

**Outfit picker modal**

- Search outfits (input): Filters the loaded owned-outfit list by title/description/rating/category/style client-side.; data: local_state
- Outfit grid (display): Lists the current user's owned OUTFIT creations as selectable tiles.; wired to `fetchOwnedCreations GET /api/creations?type=OUTFIT`
- Outfit tile (button): Selects the outfit and writes its id/title/description/imageUrl/contentRating onto the active wardrobe entry, then closes the modal.; data: local_state
- Close (X) (button): Closes the modal without a selection.; data: local_state

**Rules tab**

- Fallback mode (select): Sets the wardrobe's selectionRules.fallbackMode.; data: local_state
- Allow random selection (checkbox): Sets selectionRules.allowRandom.; data: local_state
- Summary / Usage notes / Standalone Image Prompt / Negative Prompt (textarea): Sets promptGuidance.summary, promptGuidance.usageNotes, image_prompt (max 2000 chars), negative_prompt (max 2000 chars).; data: local_state


### `/studio/creations/[id]`

Public shareable detail page for a single creation (character/asset or lore publication): media gallery, description, stats, and engagement actions.

**page-level**

- Route resolution (creation vs lore) (display): Fetches the creation as a general catalogue item; if not found or type is LORE, re-fetches from the lore publication endpoint instead; 404s via notFound() if neither returns a creation.; wired to `getPublicCreationProfilePageData -> GET /api/creations/[id]/preview; getPublicLorePublicationPageData -> GET /api/lore/[id]/publication (both server-side, proxy services-api)`; missing states: empty/loading
- Load error banner (display): Shows the loadError message in place of the whole page body when the creation fetch fails.; data: fe_api_route; missing states: empty/loading

**header**

- Chat button (button): Starts a story room from this creation (chat-capable types only) and navigates to it.; wired to `storyRoomClient.startStoryFromCreation POST /api/studio/story-rooms or /api/studio/story-rooms/from-template`; missing states: empty
- Generate link (link): Navigates to /studio/image-studio scoped to this creation.
- Share button (button): Copies the creation's public catalogue URL to the clipboard.; data: local_state
- Creator handle link (link): Navigates to the creation creator's public profile.
- Description Show more / Show less toggle (button): Expands/collapses a long description (>420 chars truncated by default).; data: local_state
- Status badges / stats row (display): Displays status/canon badges and creation stat counts (likes, messages, etc).; wired to `(inherits from page-level creation fetch)`; missing states: empty/loading/error

**media panel**

- Media tabs (Images/Videos/Liked/Bookmarked/All) (tabs): Filters the media grid by type or by this viewer's own reaction state.; data: local_state
- Sort select (Newest/Oldest/Top/Liked First) (select): Client-side sorts the media grid.; data: local_state
- Search this creation's media (input): Client-side text filter across media title/type/rating.; data: local_state
- Media tile grid (display): Renders filtered/sorted/paginated media as image tiles; clicking opens the lightbox.; wired to `(media array from page-level GET /api/creations/[id]/preview)`; missing states: loading/error
- Media tile Like / Bookmark quick actions (button): Toggle LIKE/BOOKMARK on a specific media image output, keyed by imageOutputId.; wired to `mediaReactionClient.setMediaLike/setMediaBookmark POST /api/media/reactions`; missing states: empty/loading
- Load More (media) (button): Increases the visible media slice by 12.; data: local_state
- Media lightbox (open/close/navigate/like/bookmark/download) (modal-trigger): Full-screen viewer for a media item with prev/next navigation and studio actions.; wired to `mediaReactionClient.setMediaLike/setMediaBookmark POST /api/media/reactions`; missing states: empty/loading/error

**lore publication branch**

- Community back link, status badges, share button, lore document renderer (display): When creation.type === LORE, renders an entirely separate lore-publication layout (LorePublicCreationPage) instead of the standard media-gallery layout.; wired to `getPublicLorePublicationPageData -> GET /api/lore/[id]/publication`; missing states: empty/loading


### `/studio/story-rooms/[id]`

The live Story chat workspace: converse with cast, manage NPCs and player character, view world/scenario state, and configure runtime mechanics.

**room header (desktop)**

- Cast Open / Show Cast (toggle): Shows/hides the left cast panel.; data: local_state
- State Open / Show State (toggle): Shows/hides the right state + runtime mechanics column.; data: local_state
- Content rating / visibility status pills (display): Shows the room's content rating and visibility as read-only chips.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`; missing states: empty/loading/error

**collapsed panel rail**

- Show Cast / Show State reveal button (button): Re-opens the left or right panel when it has been collapsed.; data: local_state

**cast panel**

- Hide cast panel (button): Closes the left cast panel (desktop only, when open).; data: local_state
- Featured room media (display): Shows the last visual speaker's image, derived from the latest character/narrator message, or an empty placeholder.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`; missing states: loading/error
- Cast member card (select responder) (display): Lists all active participants; clicking a selectable Character/Narrator card sets it as the next responder for the composer.; data: local_state
- Set Player Character (modal-trigger): Opens the Default Player Character picker; only visible while turnCount is 0 (room not yet started).; data: local_state; **GATED**
- Random Liked (button): Loads a random Character the player has liked into the room as a new participant.; wired to `storyRoomClient.loadRandomLikedStoryRoomCharacter POST /api/studio/story-rooms/[id]/random-liked`; missing states: empty
- Delete Story (button): After a window.confirm, deletes this Story room and its messages, then routes back to /studio/story-rooms.; wired to `storyRoomClient.deleteStoryRoom DELETE /api/studio/story-rooms/[id]`; missing states: empty
- ← Room List (link): Navigates back to /studio/story-rooms.

**cast panel / player character picker modal**

- Search your player characters... (input): Client-side filters the owned PLAYER_CHARACTER creations shown in the picker.; wired to `creationClient.fetchOwnedCreations GET /api/studio/creations?type=PLAYER_CHARACTER`
- Player character card (button): Selects a PC and calls setPlayerCharacter for the room, closing the modal on success.; wired to `storyRoomClient.setStoryRoomPlayerCharacter POST /api/studio/story-rooms/[id]/player-character`; missing states: empty
- Close (player character picker) (button): Closes the picker modal without changing the player character.; data: local_state

**cast panel / NPC participant manager**

- Manage Registry NPCs (toggle): Expands/collapses the registry NPC lifecycle manager (loaded / narrative target / available / previously loaded sections).; wired to `storyRoomClient.fetchStoryRoomRegistryNpcs GET /api/studio/story-rooms/[id]/registry-npcs`; missing states: empty
- Load / Load Now / Reload NPC entry (button): Loads an available, pending-target, or previously-unloaded registry NPC into the room as an active participant.; wired to `storyRoomClient.loadStoryRoomRegistryNpc POST /api/studio/story-rooms/[id]/registry-npcs`; missing states: empty
- Unload NPC entry (button): Removes an active registry-managed NPC from the room.; wired to `storyRoomClient.unloadStoryRoomRegistryNpc DELETE /api/studio/story-rooms/[id]/registry-npcs/[participantId]`; missing states: empty

**transcript**

- Load Earlier (button): Reveals 10 more older messages from the already-fetched snapshot into the visible window.; data: local_state
- Message transcript (display): Renders the room's message history (player, character, narrator turns) and auto-scrolls to the newest message.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`

**composer**

- Next Speaker buttons (Auto / cast / Random) (button): Chooses which participant should respond next; clicking a character with an empty draft sends a yield-turn action immediately instead of requiring a message.; wired to `storyRoomClient.sendStoryRoomMessage POST /api/studio/story-rooms/[id]/messages`; missing states: empty/error
- Message textarea (textarea): Composes the outgoing message; supports Enter-to-send, Shift+Enter newline, @ character mentions, # location mentions, and / slash commands with autocomplete.; data: local_state
- @ mention suggestion list (display): Shows active-character autocomplete matches for an in-progress @mention and inserts the chosen mention text on select.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`; missing states: empty/loading/error
- / command suggestion list (display): Shows matching slash commands (e.g. /help, /commands) as the user types after '/'.; data: fixture
- # location suggestion list (display): Shows registered-location autocomplete matches for an in-progress #mention.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`; missing states: empty/loading/error
- Input Mode (select): Sets the outgoing message mode (Dialogue / Action / OOC-Note / Direct-GM).; data: local_state
- Send / Continue Scene (button): Sends the drafted message (or, with an empty draft and Auto speaker, triggers an auto-continuation turn); recognized slash commands open the help modal locally instead of sending.; wired to `storyRoomClient.sendStoryRoomMessage POST /api/studio/story-rooms/[id]/messages`; missing states: empty
- Scene Image Soon / Use Current Scene (button): Disabled placeholders for future scene-image generation and scene-context reuse.; **STUBBED**

**composer (mobile)**

- Open tools (toggle): Expands the mobile room-tools drawer above the composer.; data: local_state

**composer (mobile tools drawer)**

- Cast / Room, State (button): Opens the mobile cast or state drawer over the chat.; data: local_state
- Scene Image / Current Scene / Export / Share (button): Disabled placeholders mirroring the desktop stub buttons plus export/share.; **STUBBED**

**composer help modal**

- Close composer help (button): Closes the /commands or quick-help dialog.; data: local_state
- Available Commands / Quick Help content (display): Shows the static command reference (typing /help or /commands and pressing Enter opens this).; data: fixture

**state panel**

- Scenario / World / Knowledge / Memory sections (display): Shows scenario phase, location/time/weather, knowledge-boundary rules, and memory summary for the room.; wired to `storyRoomClient.fetchStoryRoom GET /api/studio/story-rooms/[id]`; missing states: empty/loading/error
- Export Chat Soon / Share Snapshot Soon (button): Disabled placeholders for future export/share of the room state.; **STUBBED**
- Hide state panel (button): Closes the right state/mechanics column (desktop only).; data: local_state

**runtime mechanics panel**

- Attach Mechanics / Replace Mechanics (modal-trigger): Opens the Mechanics Module picker to attach a reusable trackers/guards/commands module to the room.; data: local_state
- Enabled (checkbox): Enables/disables the attached mechanics binding without removing it.; wired to `storyRoomClient.upsertStoryRoomEngineModuleBinding POST /api/studio/story-rooms/[id]/engine-module-bindings`; missing states: empty
- Mechanics Scope (select): Sets the binding's scope mode (STORY_ROOM vs BINDING_OWNER).; wired to `storyRoomClient.upsertStoryRoomEngineModuleBinding POST /api/studio/story-rooms/[id]/engine-module-bindings`; missing states: empty
- Priority (input): Sets the binding's numeric priority.; wired to `storyRoomClient.upsertStoryRoomEngineModuleBinding POST /api/studio/story-rooms/[id]/engine-module-bindings`; missing states: empty
- Remove (button): Deletes the room's mechanics-module binding entirely.; wired to `storyRoomClient.deleteStoryRoomEngineModuleBinding DELETE /api/studio/story-rooms/[id]/engine-module-bindings/[moduleId]`; missing states: empty

**runtime mechanics panel / picker modal**

- Mine / Community source tabs (tabs): Switches between the user's own and community mechanics-module creations in the picker.; wired to `creationClient.fetchOwnedCreations / fetchCommunityCreations GET /api/studio/creations`
- Search mechanics modules... (input): Client-side filters the visible module list by title, description, id, tags.; data: local_state
- Mechanics module card (button): Selects a module and attaches it to the room as the (single) room-level mechanics binding.; wired to `storyRoomClient.upsertStoryRoomEngineModuleBinding POST /api/studio/story-rooms/[id]/engine-module-bindings`; missing states: empty
- Close (mechanics picker) (button): Closes the picker without attaching a module.; data: local_state

**mobile cast/state drawer**

- Close panel (X) (button): Closes the mobile Cast or State drawer overlay.; data: local_state


### `/studio/templates/characters`

Let a creator browse built-in (and eventually creator-made) character templates to reuse when building a new character.

**page head**

- Back to Create (link): Navigates back to /studio/create.

**template card grid**

- Template card (Hero, Princess, Warrior, Badass Biker) (display): Renders a static hardcoded array of 4 built-in templates (title/category/description); no fetch of any kind.; data: fixture
- Use Template Soon (button): Disabled placeholder button, no handler.; **STUBBED**
- Duplicate Soon (button): Disabled placeholder button, no handler.; **STUBBED**

**sidebar**

- Create Template (link): Navigates to /studio/create/character-template.


### `/studio/account/appearance`

Placeholder settings page reserving space for future theme, density, card-display, and motion preference controls.

**placeholder card grid**

- Theme Mode / Display Density / Card Display / Motion & Effects cards (display): Renders 4 static informational cards from a hardcoded array; no interactive controls.; data: fixture; **STUBBED**

**footer**

- Return to Account (link): Navigates back to /studio/account.

**header**

- Back to Account (link): Back link to /studio/account.


### `/studio/account/notifications`

Placeholder settings page reserving space for future email, room-activity, creator-alert, and moderation notification controls.

**whole page**

- Back to Account / card grid / Return to Account (display): Same AccountStubPage composition as appearance: back link, 4 static info cards (Email, Rooms, Creator, Moderation), placeholder notice, return link. No interactive/data-bound controls.; data: fixture; **STUBBED**


### `/studio/account/privacy`

Stub settings page reserving space for future profile visibility, public activity, discoverability, and blocked-user controls.

**whole page**

- Back to Account / card grid / Return to Account (display): Same AccountStubPage composition: back link, 4 static info cards (Profile, Activity, Discovery, Blocking), placeholder notice, return link.; data: fixture; **STUBBED**


### `/studio/account/safety`

Stub settings page reserving space for future content-rating, comfort, discovery-filter, and moderation controls.

**whole page**

- Back to Account / card grid / Return to Account (display): Same AccountStubPage composition: back link, 4 static info cards (Content Rating, Comfort, Discovery, Moderation), placeholder notice, return link.; data: fixture; **STUBBED**


### `/studio/account/subscription`

Stub settings page reserving space for future plan/billing/premium/purchase-history controls.

**whole page**

- Back to Account / card grid / Return to Account (display): Same AccountStubPage composition: back link, 4 static info cards (Plan, Billing, Premium, History), placeholder notice, return link.; data: fixture; **STUBBED**


### `/studio/community`

Browse and search public creations and public creator profiles across Crestfall with filters, sort, and a creations-vs-creators mode toggle.

**filter bar**

- Search creations, creators, tags... (input): Free-text query filters the visible creation/creator list client-side against title, description, creator handle, and tags.; data: local_state
- Creations / Creators mode toggle (tabs): Switches the page body between the creation grid and the creator grid/list.; data: local_state
- Mobile grid density toggle (Large/Grid, md:hidden) (button): Toggles between compact 2-column and single-column creation card layout on narrow viewports.; data: local_state
- Popular Tags pills (button): Filters creations by a single tag (All + top community tags, hardcoded list).; data: fixture
- Creation type pills (All/Characters/Scenarios/Rooms/Locations/Outfits/Poses/Narrators/Image Presets) (button): Filters the creation grid by creation type.; data: local_state
- Creation filter pills (All/Featured/Canon/Recently Updated) (button): Filters the creation grid by curation status.; data: local_state
- Sort select (select): Sorts filtered creations (Recommended/Newest/Recently Updated/Most Liked/Most Used).; data: local_state
- Rating select (select): Filters creations by content rating (All/SFW/Mature/Explicit).; data: local_state
- Rendering select (select): Filters creations by rendering style (All/Anime/Realistic/Either).; data: local_state

**filter bar (Creators mode)**

- Creator filter pills (All/Featured/Recently Active/Canon Contributors) (button): Filters the creator list.; data: local_state
- Grid / List view toggle (toggle): Switches creator display between card grid and list rows.; data: local_state

**content grid**

- Creation card grid (display): Renders filtered/paginated public creations as clickable cards (opens preview modal).; wired to `feApiRequest GET /api/community/creations (server-side, proxies services-api /v1/community/creations)`; missing states: loading
- Creation card like button (heart icon) (button): Toggles a LIKE reaction on a creation, optimistic update with rollback on failure.; wired to `creationReactionClient.setCreationLike POST /api/engagement/creation-reactions (proxies services-api)`; missing states: empty/loading
- Creation card bookmark button (button): Toggles a BOOKMARK reaction on a creation.; wired to `creationReactionClient.setCreationBookmark POST /api/engagement/creation-reactions`; missing states: empty/loading
- Creation card Start Chat button (button): Starts a story room from a chat-capable creation (character/room template) and navigates to it.; wired to `storyRoomClient.startStoryFromCreation POST /api/studio/story-rooms or POST /api/studio/story-rooms/from-template`; missing states: empty
- Creation card Generate image link (link): Navigates to /studio/image-studio pre-scoped to the creation.
- Creation card (click card body) preview modal trigger (modal-trigger): Fetches the creation's public preview graph and opens CreationPreviewModal.; wired to `creationClient.fetchCreationPreview GET /api/creations/[id]/preview`; missing states: empty
- Load N More (creations) (button): Increases the visible creation slice by 12 (client-side pagination of already-fetched data).; data: local_state

**content grid (Creators mode)**

- Creator card / list row grid (display): Renders filtered/paginated public creator profiles as cards or list rows.; wired to `feApiRequest GET /api/community/creators (proxies services-api /v1/community/creators)`; missing states: loading
- Creator card Like button (button): Toggles LIKE reaction on a creator profile.; wired to `profileReactionClient.setProfileLike POST /api/engagement/profile-reactions`; missing states: empty/loading
- Creator card Bookmark button (button): Toggles BOOKMARK reaction on a creator profile.; wired to `profileReactionClient.setProfileBookmark POST /api/engagement/profile-reactions`; missing states: empty/loading
- Creator card Follow button (button): Toggles FOLLOW reaction on a creator profile.; wired to `profileReactionClient.setProfileFollow POST /api/engagement/profile-reactions`; missing states: empty/loading
- View Profile link (link): Navigates to the creator's public profile page.
- Load N More (creators) (button): Increases the visible creator slice by 12.; data: local_state

**page head**

- Community creations load-error banner (display): Shows a text error banner when getCommunityPageData fails to load creations or creators.; data: fe_api_route; missing states: empty/loading


### `/studio/create/mechanics-module`

Create a reusable runtime mechanics module (meters/trackers, commands, defaults, status blocks, guards).

**page head**

- Back to Create (link): Navigates back to /studio/create

**identity card**

- Name / Description / Visibility / Content Rating (input): Sets form.title (input), form.description (textarea), form.visibility and form.content_rating (CrestfallSelect); data: local_state

**aside runtime contract panel**

- Save Draft (button): Builds the creation payload and POSTs the mechanics module draft; on success routes to /studio/my-creations/[id]/edit; wired to `mechanicsModuleClient.createMechanicsModuleDraft (creationClient.createCreationDraft) POST /api/creations`; missing states: empty

**runtime fields document controls**

- Preset Library (modal-trigger): Opens MechanicsPresetApplicationModal, a scoped library of static mechanics presets (module/command/resolution/composition scope) that can replace the current mechanics data; data: fixture
- JSON Editor (modal-trigger): Opens MechanicsJsonEditorModal for raw-JSON editing of the whole mechanics document (same copy/download/format/reset/validate&apply pattern as other builders); data: local_state

**runtime fields overview section**

- Collapse All / Expand All (button): Toggles every foldable Runtime Fields section open/closed; data: local_state
- Module Definition ID / Priority / Tags (input): Edits the module's definition id, numeric priority, and comma-separated tags; data: local_state

**trackers / meters section**

- Trackers / Meters (fold section) (display): Foldable section hosting the Trackers builder (add/edit/remove meter fields, display phases, mutation hints) via MechanicsTrackersSection; data: local_state

**commands section**

- Add Command (button): Appends a new empty slash command to instanceData.commands; data: local_state

**commands section - command card**

- Command card (Identity, Invocation, Requirements, Domain Actions, Attempt Effects, Resolution, Outcomes, Composition, Arguments, Triggers, Base Effects) / Remove (display): Each command expands into ~10 sub-builder sections (MechanicsCommandIdentitySection, MechanicsCommandInvocationSection, MechanicsCommandRequirements, MechanicsCommandDomainActions, MechanicsCommandEffects x2, MechanicsCommandResolution, MechanicsCommandOutcomes, MechanicsCompositionBuilder, MechanicsCommandArgumentsSection, MechanicsCommandTriggersSection) for authoring one deterministic slash command; Remove deletes the command; data: local_state

**defaults section**

- Defaults (fold section) (display): Foldable section hosting MechanicsDefaults for authoring initial flag/counter/stage values; data: local_state

**status blocks section**

- Status Blocks (fold section) (display): Foldable section hosting MechanicsStatusBlocks for authoring deterministic public/private status lines; data: local_state

**guards section**

- Guards (fold section) (display): Foldable section hosting MechanicsGuards for authoring hard locks, soft locks, and guidance conditions; data: local_state


### `/studio/create/narrator`

Author a reusable narrator voice/persona to attach to story rooms and scenarios.

**page head**

- Back to Create (link): Navigates to /studio/create.

**aside – preview**

- Narrator preview (name, description) + Selected Modules chips (display): Live-updating name/description preview and a chip list summarizing the currently selected module per group (pacing, detail_level, etc.).; data: local_state
- Save Draft (button): Builds a NARRATOR creation payload (folds selected_modules, response_direction, legacy pacing/detail_level fields) and POSTs it; on success routes to /studio/my-creations/[id]/edit.; wired to `createNarratorDraft (createCreationDraft) POST /api/creations`; missing states: empty

**profile panel**

- Name (input): Sets form.name.; data: local_state
- Description (textarea): Sets form.description, also drives the aside preview text.; data: local_state
- Broad Tone (select): Sets form.tone from toneOptions.; data: fixture
- Narrator Guidance (textarea): Sets form.narrator_guidance (prose style, framing, pacing intervention guidance).; data: local_state
- Avoid Guidance (textarea): Sets form.avoid_guidance.; data: local_state
- Tags (input): Comma-separated tags input, parsed to an array on save (parseTags).; data: local_state
- Visibility / Content Rating (select): Sets form.visibility and form.content_rating, both actually included in the save payload (unlike player-character's Visibility).; data: fixture

**profile panel – module selector**

- Official Starter Module buttons (per group, e.g. pacing, detail level) (button): Selects one module id per group into selectedModules state; used to build selected_modules and legacy pacing/detail_level on save.; data: fixture
- Response Direction options (button): Per-group buttons writing responseDirection state, merged into data.response_direction on save (defaults from narratorResponseDirectionDefaults).; data: fixture
- Ensemble Character Limit (select): Conditionally rendered select for ensemble character limit (only when showEnsembleLimit is true for the relevant module state).; data: fixture


### `/studio/create/npc-registry`

Build a reusable NPC relationship/alias/knowledge continuity registry with linked or lightweight people, relationships, knowledge rules, and alias mappings.

**page head**

- Back to Create (link): Navigates back to /studio/create

**tab row**

- Overview / People Entries / Relationships / Knowledge Rules / Aliases (tabs): Switches active builder section, local state only.; data: local_state

**summary aside**

- Save Registry (button): Builds the NPC registry payload and POSTs a draft creation; on success calls onCreated or router.push('/studio/my-creations').; wired to `createNpcRegistryDraft -> createCreationDraft POST /api/creations`; missing states: empty
- Registry Summary counters (display): Shows title, description, and counts for Scope/People Entries/Relationships/Knowledge Rules/Aliases.; data: local_state

**Overview tab**

- Registry Title / Scope / Description (input): Sets title, scope (inputs) and description (textarea).; data: local_state

**People Entries tab**

- Add Person (button): Opens the NPC Entry modal with a fresh draft.; data: local_state
- entry cards (Edit / Delete) (display): Lists people entries (linked creation vs lightweight NPC), notes, and mechanics-attachment status; Delete cascades reference removal via removeEntryReferences.; data: local_state

**NPC Entry modal**

- Linked Character vs Lightweight NPC mode toggle (toggle): Switches entry.kind between CREATION_REF and AD_HOC.; data: local_state
- character/PC search-select panel (display): When mode=linkedCharacter, shows a searchable card grid of the user's CHARACTER and PLAYER_CHARACTER creations (fetched once on builder mount); selecting one applies name/notes to the entry draft.; wired to `fetchNpcRegistryCharacterOptions -> fetchOwnedCreations GET /api/creations?type=CHARACTER and type=PLAYER_CHARACTER`; missing states: empty/loading
- Name (lightweight NPC only) (input): Freeform name field when not linking a character.; data: local_state
- Registry Notes (textarea): Freeform notes field on the entry draft.; data: local_state
- Save Person Entry / Cancel (button): Save upserts the entry (requires trimmed name) and closes; Cancel discards.; data: local_state

**NPC Entry modal / Actor Mechanics Profile**

- Attach NPC Mechanics Profile (modal-trigger): For lightweight NPCs only, opens a picker to attach an ACTOR_MECHANICS_PROFILE creation; also supports Remove and a notes field on the attachment.; wired to `fetchOwnedCreations GET /api/creations?type=ACTOR_MECHANICS_PROFILE`; missing states: loading

**Relationships tab**

- Add Relationship (button): Opens the Relationship modal; disabled until at least 2 NPC entries exist.; data: local_state
- relationship cards (Edit / Delete) (display): Lists relationships with type/strength, from-to entry names, description.; data: local_state

**Relationship modal**

- From NPC / To NPC / Direction / Strength (select): 4 dropdowns choosing the two related entries, relationship direction, and strength.; data: local_state
- Relationship Type (input): Freeform relationship type text (mentor, rival, etc).; data: local_state
- Relationship Rule (textarea): Freeform description of the relationship.; data: local_state
- Save Relationship / Cancel (button): Save upserts the relationship (requires from+to entry) and closes; Cancel discards.; data: local_state

**Knowledge Rules tab**

- Add Knowledge Rule (button): Opens the Knowledge Rule modal with a fresh draft.; data: local_state
- knowledge rule cards (Edit / Delete) (display): Lists rules with default knowledge level, subject, notes.; data: local_state

**Knowledge Rule modal**

- Subject / Secret (input): Freeform topic text for the knowledge rule.; data: local_state
- Default Knowledge (select): Sets the default knowledge level for entries not explicitly listed.; data: local_state
- Known By / Suspected By (checkbox): Two checkbox groups over all NPC entries, toggling per-entry inclusion in knownByEntryIds/suspectedByEntryIds.; data: local_state
- False Belief Notes / Knowledge Rule Notes (textarea): Two freeform text fields.; data: local_state
- Save Knowledge Rule / Cancel (button): Save upserts the rule (requires trimmed subject) and closes; Cancel discards.; data: local_state

**Aliases tab**

- Add Alias Rule (button): Opens the Alias Rule modal; disabled until at least one NPC entry exists.; data: local_state
- alias cards (Edit / Delete) (display): Lists alias mappings as 'public identity = true NPC name' plus the rule text.; data: local_state

**Alias Rule modal**

- True Identity (select): Chooses which NPC entry the alias resolves to.; data: local_state
- Public Identity / Alias (input): Freeform alias/public-identity text.; data: local_state
- Alias Rule (textarea): Freeform description of when/how the alias applies.; data: local_state
- Save Alias Rule / Cancel (button): Save upserts the alias (requires trueEntryId + trimmed publicIdentity) and closes; Cancel discards.; data: local_state


### `/studio/create/outfit`

Create a reusable Outfit / Clothing visual asset.

**Builder sidebar (AssetBuilderShell / AssetBuilder.view)**

- Name (input): Sets the asset's title.; data: local_state

**Builder sidebar**

- Outfit Guidance (prompt) (textarea): Free-text description of the garment used as generation guidance; label/placeholder vary per config.; data: local_state
- Standalone Image Prompt (textarea): Optional standalone image-generation prompt, capped at 2000 chars, only shown for OUTFIT/LOCATION/IMAGE_PRESET types (not POSE).; data: local_state
- Negative Prompt (textarea): Optional negative-prompt text, capped at 2000 chars, same visibility rule as above.; data: local_state
- Category / Coverage (extraFields selects) (select): Config-driven classification dropdowns; field set and options come from assetBuilderConfigs[type].extraFields (Category, Coverage for Outfit).; data: fixture
- Generate Test Images Soon (button): Nothing; button is permanently disabled.; **STUBBED**
- Description (input): Sets a public/private description string.; data: local_state
- Tags (input): Comma-separated free-text field parsed into a tags array on save.; data: local_state
- Visibility / Content Rating (select): Sets visibility (Private/Unlisted) and content rating (SFW/Mature/Explicit).; data: fixture
- Rendering Style / Number of Test Images (select): Sets generation style and how many cover-image candidates render below.; data: fixture
- Save Draft (button): Builds the creation payload (type OUTFIT/POSE/IMAGE_PRESET, title, description, visibility, content_rating, data blob) and POSTs it, then routes to the edit page for the new creation.; wired to `createVisualAssetDraft (createCreationDraft) POST /api/creations`; missing states: empty

**Cover image panel**

- Candidate cover tiles (Candidate 1..N) (button): Selects a placeholder candidate id as the chosen cover; tile count driven by the Number of Test Images select.; data: local_state; **STUBBED**


### `/studio/create/player-character`

Build a private or public player identity/persona to bring into rooms and future image generation.

**page head**

- Back to Create (link): Navigates to /studio/create.

**draft progress bar**

- Save Draft → / Finish Draft → (button): POSTs a PLAYER_CHARACTER creation (forced visibility PRIVATE, playable/discoverable/searchable/addable_to_rooms/ai_controlled all false) and on success routes to /studio/my-creations/[id]/edit.; wired to `createPlayerCharacterDraft (createCreationDraft) POST /api/creations`; missing states: empty
- Identity / Appearance / Body / Profile / Review (tabs): Step navigation, same pattern as Character Creator.; data: local_state

**draft footer**

- Back / Next (button): Step navigation.; data: local_state

**preview panel**

- Player character preview (initial, name, alias/role, species, gender presentation, personality summary) (display): Live-updating summary card from form state.; data: local_state

**identity step**

- Name / Alias / Age / Species (+Custom) / Gender Presentation (+Custom) / Role Archetype / Character Color Palette (input): Same identity field set as Character Creator (age has an 18+ min and onBlur normalize), writing to player-character form state.; data: fixture

**appearance step**

- Skin Tone / Eye Color / Hair Color / Hair Style / Default Clothing (modal-trigger): SkinToneModal, three HairEyesModal instances, and DefaultClothingSelector (real outfit fetch), writing appearance fields.; wired to `fetchOwnedCreations GET /api/creations?type=OUTFIT (Default Clothing only; the color/skin pickers are fixture-only)`

**body step**

- Body Type / Height / Build / Custom Body Notes (modal-trigger): TraitModal pickers (contract-scoped option lists) plus a free-text body notes textarea.; data: fixture

**profile step**

- Personality Summary / Backstory / Narration Notes (textarea): Three free-text fields writing personality_summary, backstory, narrator_notes.; data: local_state

**review step**

- Visibility / Content Rating / Default Rendering Style (select): Three selects rendered as editable, but Visibility's chosen value is discarded – the save payload hardcodes visibility to PRIVATE.; data: fixture
- Draft Summary (display): Read-only recap of name/age/species/role archetype/personality/rendering/color palette.; data: local_state


### `/studio/create/pose`

Create a reusable Pose visual asset for character cards and image generation.

**Builder sidebar**

- Energy / Orientation (extraFields selects) (select): Config-driven classification dropdowns unique to Pose (Energy, Orientation).; data: fixture

**Builder sidebar + Cover image panel**

- All other AssetBuilderShell controls (Name, prompt, Description, Tags, Visibility, Content Rating, Rendering Style, Test Images, Generate Test Images Soon, Save Draft, cover candidates) (display): Identical wiring to /studio/create/outfit, save payload type is POSE.; wired to `createVisualAssetDraft (createCreationDraft) POST /api/creations`; missing states: empty


### `/studio/create/quest-registry`

Build a reusable structured quest-continuity registry via the shared StructuredRegistryBuilder, parameterized registryType=QUEST_REGISTRY.

**whole page**

- (identical control set to event-registry) (display): Same StructuredRegistryBuilder composition as event-registry, including the same 5 relationship groups (Characters/People, Locations, Organizations/Factions/Systems, Related Event Registries, Related Quest Registries).; wired to `createCreationDraft POST /api/creations; fetchOwnedCreations GET /api/creations?type=`


### `/studio/my-creations`

Let a creator browse, filter, and manage all of their own drafts, private, and shared creations from one library hub.

**filter bar**

- Search your creations... (input): Filters the already-fetched creation list client-side by matching text against title, description, tags, type, status, visibility.; data: local_state
- Your Tags (tag filter pills) (tabs): Selects one of the creator's top 10 most-used tags (or All) to filter the visible creation grid client-side.; data: local_state
- Status/type tabs (ALL, etc.) (tabs): Selects a creation type/status tab to filter the visible grid client-side.; data: local_state
- Grid/Large mobile toggle (toggle): Switches the mobile card grid between compact 2-col and larger 1-col layout.; data: local_state
- Create New (link): Navigates to /studio/create.

**page head / error banner**

- Creations could not be loaded: {error} (display): Shows the server-fetch error message when the initial creations load fails.; wired to `getMyCreationsPageData GET /api/creations?view=summary`; missing states: empty/loading

**card grid**

- Creation card grid (display): Renders the filtered/paginated list of the signed-in user's creations as cards (image, title, subtitle, description, stats, status badges).; wired to `getMyCreationsPageData GET /api/creations?view=summary`; missing states: loading/error
- Card body (open preview) (modal-trigger): Clicking anywhere on the card fetches a fuller creation preview graph and opens CreationPreviewModal; on error for owner context it falls back to showing the summary data already on hand.; wired to `fetchCreationPreview GET /api/creations/{id}/preview`; missing states: empty
- Load {n} More (button): Increases the client-side visible-count of already-loaded, filtered creations by 12.; data: local_state

**card grid / card overlay**

- Like (heart icon) (button): Toggles a LIKE reaction on the creation, optimistic-updates the heart icon, reverts and shows a message on failure.; wired to `setCreationLike POST /api/engagement/creation-reactions (reactionType LIKE); fetchCreationReactions GET /api/engagement/creation-reactions on load`; missing states: empty/loading
- Bookmark icon (button): Toggles a BOOKMARK reaction on the creation, same optimistic pattern as Like.; wired to `setCreationBookmark POST /api/engagement/creation-reactions (reactionType BOOKMARK)`; missing states: empty/loading
- Set as default Player Character (person icon) (button): Sets this creation as the account's default Player Character. Only shown for PLAYER_CHARACTER type creations in owner context.; wired to `setDefaultPlayerCharacter PATCH /api/profile/me (body default_player_character_id)`; missing states: empty
- Start chat (message icon) (button): Starts (or resumes) a Story Room from this creation and navigates to /studio/story-rooms/{roomId}. Only shown for chat-capable creation types.; wired to `startStoryFromCreation -> createStoryRoom POST /api/studio/story-rooms, or playStoryTemplate POST /api/studio/story-rooms/from-template for ROOM_TEMPLATE type`; missing states: empty
- Generate image (image icon) (link): Navigates to /studio/image-studio?creation={id}.
- Edit (pencil icon) (link): Navigates to /studio/my-creations/{id}/edit. Owner context only.


### `/studio/my-creations/[id]/edit`

Edit workspace for a single owned creation (character, location, item registry, mechanics module, etc.), covering type-specific fields, media, publishing/review, and lifecycle actions.

**shell chrome / editor header**

- Set Default PC (button): For PLAYER_CHARACTER creations, calls setDefaultPlayerCharacter to mark this creation as the user's default player character.; wired to `setDefaultPlayerCharacter PATCH /api/profile/me`; **BROKEN**; missing states: empty/error
- ← My Creations (link): Navigates back to /studio/my-creations.
- Section tabs (Overview, Identity, Appearance, Publishing, Danger, etc. -- set varies by creation type) (tabs): Switches activeSection, which CreationEditSectionContent uses to decide which field section to render for the current creation type.; data: local_state

**media panel**

- Featured slot thumbnails (Primary / Alt 1 / Alt 2 / Alt 3) (display): Shows the 4 featured-media slots; clicking a filled or empty slot makes it the active preview slot.; data: local_state
- Replace Slot (modal-trigger): Opens the featured-image picker modal for the currently active slot.
- Go to Library (link): Links to /studio/my-creations/[id]/image-library?slot=[activeSlot].
- Chat Media section (for chat-capable types: Character, Player Character, etc.) (display): Intended to show chat avatar/identity media context; currently renders only the literal text '...'.; **BROKEN**
- Image Studio Ingredient / Storyline Media info card (for non-chat types) (display): Static explanatory copy describing how featured media is used for this creation type when not chat-capable.; data: fixture

**featured image picker modal**

- Refresh (button): Reloads the eligible image list for the active slot.; wired to `fetchCreationImageLibrary GET /api/creations/[id]/image-library`
- Close (button): Closes the picker modal without saving.; data: local_state
- Use as [Slot] (per eligible image tile) (button): Assigns the chosen library image to the active featured slot.; wired to `setCreationFeaturedImageSlot PUT /api/creations/[id]/featured-image-slots/[slotKey]`; missing states: empty
- Load More (button): Reveals more eligible images (client-side pagination over already-fetched list).; data: local_state

**mechanics quick nav (Mechanics Module type, fields section only)**

- Overview / Trackers / Commands / Defaults / Status Blocks / Guards jump links (button): Sets URL hash and dispatches a 'crestfall:mechanics-runtime-navigate' CustomEvent to scroll/highlight the matching subsection; shows live counts for trackers/commands/defaults/statusBlocks/guards read from form.data.instanceData.; data: local_state
- Collapse / Expand (button): Dispatches 'crestfall:mechanics-runtime-fold-all' with expanded true/false to collapse or expand all mechanics runtime subsections.; data: local_state

**overview section**

- Title (input): Edits form.title (and mirrors into data.name for CHARACTER type).; data: local_state
- Public Description (textarea): Edits form.description.; data: local_state
- Preview Soon (button): Intended to open an owner preview; currently a no-op, permanently disabled.; **STUBBED**

**publishing section**

- Visibility (Private / Unlisted) (select): Sets form.visibility via CrestfallSelect.; data: local_state
- Content Rating (SFW / Mature / Explicit) (select): Sets form.contentRating.; data: local_state
- Convert To Template Soon / Duplicate Template Soon / Use Template Soon (button): Placeholder template-management actions; all permanently disabled, no onClick handler at all.; **STUBBED**
- Submit for Public Review (button): Submits the creation into the public review queue.; wired to `submitCreationReview POST /api/creations/[id]/submit-review (reviewType=PUBLIC)`; missing states: empty
- Submit for Canon Review (button): Submits the creation for canon-continuity review.; wired to `submitCreationReview POST /api/creations/[id]/submit-review (reviewType=CANON)`; missing states: empty

**sticky action bar (persists across all sections)**

- Visibility pills (Private / Unlisted) (button): Quick-select alternative to the Publishing select for form.visibility.; data: local_state

**sticky action bar**

- Public (toggle): Displays whether the creation is currently PUBLIC; permanently disabled, cannot be set directly by the owner.; data: local_state; **GATED**
- Review Actions / In Review Queue / Public Live / Review-Resubmit / Archived / Official Canon Locked (button): Jumps to the Publishing section (setActiveSection('publishing')); label reflects current lifecycle state.; data: local_state
- Unlist for Editing (button): Moves a public/approved creation back to internal (owner-editable) status.; wired to `moveCreationToInternalEditing POST /api/creations/[id]/move-to-internal-editing`; missing states: empty
- Save Changes (button): Persists all local form edits (across every section) to the backend.; wired to `updateCreationDraft PATCH /api/creations/[id]`; missing states: empty
- Cancel Review (button): Cancels an in-progress review submission, returning the creation to internal/unlisted editable state.; wired to `cancelCreationReview POST /api/creations/[id]/cancel-review`; missing states: empty

**danger section**

- Canon Locked notice (display): Static warning banner shown when the creation is official canon.; data: local_state
- Archive Creation (button): Archives the creation, removing it from active/discoverable use.; wired to `archiveCreation POST /api/creations/[id]/archive`; missing states: empty/loading
- Delete Creation (button): Permanently deletes the creation after a native window.confirm() prompt, then redirects to /studio/my-creations.; wired to `deleteCreation DELETE /api/creations/[id]`; missing states: empty/loading

**identity section (Character-like types)**

- Character Name (input): Edits form.data.name (mirrors form.title).; data: local_state
- Character Title (input): Edits form.data.title (character subtitle, distinct from creation title).; data: local_state
- Species (select): Sets character species; reveals a Custom Species text field when 'Custom' is selected.; data: local_state
- Custom Species (input): Free-text species value, shown only when Species select = Custom.; data: local_state; **GATED**
- Default Rendering Style (select): Sets the character's default image rendering style (e.g. anime/realistic/either).; data: local_state
- Age (input): Numeric age input (min enforced, e.g. 18+); commits on blur.; data: local_state
- Gender Presentation (select): Sets gender presentation; reveals Custom Gender Presentation text field when Custom is chosen.; data: local_state
- Custom Gender Presentation (input): Free-text gender presentation value, shown only when select = Custom.; data: local_state; **GATED**
- Color Palette control (slot) (display): Optional injected control slot for a color-palette picker; not populated by IdentitySection.jsx wrapper in the reviewed path.; data: local_state
- Role/Archetype control (slot) (display): Optional injected control slot for role/archetype selection.; data: local_state
- Creation Type (display): Read-only display of the creation's type value.; data: local_state

**appearance section (Character-like types)**

- Skin Tone (modal control) (modal-trigger): Opens SkinToneModal to set skin-tone appearance fields.; data: local_state
- Eye Color (modal control) (modal-trigger): Opens EyeColorModal to set eye-color appearance fields.; data: local_state
- Hair (modal control) (modal-trigger): Opens HairModal to set hair appearance fields.; data: local_state
- Visual Heritage (modal control) (modal-trigger): Opens TraitModal to set visual_heritage_reference from a fixture options list.; data: fixture
- Select Outfit (modal-trigger): Opens OutfitPickerModal (creationType=OUTFIT) to choose this character's default clothing source.; wired to `fetchOwnedCreations GET /api/creations?type=OUTFIT`
- Select Wardrobe (modal-trigger): Opens OutfitPickerModal (creationType=WARDROBE) to choose this character's default clothing source.; wired to `fetchOwnedCreations GET /api/creations?type=WARDROBE`
- Clear (default clothing) (button): Clears the selected default outfit/wardrobe from local form state.; data: local_state

**body section (Character-like types)**

- Custom Body Notes (textarea): Free-text body-description notes.; data: local_state

**behavior section (Character-like types)**

- Verbosity (select): Sets chat response verbosity preference for this character.; data: local_state
- Philosophy (textarea): Free-text character philosophy/personality-guidance notes.; data: local_state

**advanced section (Character-like types)**

- Greeting / Scenario / Relationship to Player / Backstory / Appearance Notes / Personality Notes / Extra Runtime Notes (textarea): Seven free-text prompt-engineering fields feeding the character's system prompt (greeting message, scenario framing, player relationship, backstory, extra appearance/personality notes, misc runtime notes).; data: local_state

**visual references section (Character-like types)**

- Refresh Library (button): Reloads the creation's image library for the anime/realistic reference cards.; wired to `(image library fetch, same underlying client as image-library hooks)`; missing states: empty/loading
- Choose (per reference card, e.g. Anime Reference / Realistic Reference) (modal-trigger): Opens CreationReferenceImagePickerModal to pick an eligible image for that reference slot.; wired to `fetchCreationImageLibrary GET /api/creations/[id]/image-library (list); selection written to local form.data`
- Clear (per reference card) (button): Clears the chosen reference image for that card.; data: local_state

**actor mechanics profile attachment (Character-like types, mechanicsProfile tab)**

- Attach Actor Mechanics Profile / Replace Profile (modal-trigger): Opens RegistryLinkedCreationPickerModal to attach/replace a reusable Actor Mechanics Profile creation to this actor.; wired to `(RegistryLinkedCreationPickerModal's own fetch, not individually traced this pass)`; missing states: empty/loading

**actor mechanics profile attachment (Character-like types)**

- Remove (button): Removes the currently attached Actor Mechanics Profile.; data: local_state
- Actor Attachment Notes (textarea): Free-text notes about how this actor uses the attached profile.; data: local_state

**runtime mechanics modules (Character/Scenario/Narrator/RoomTemplate types, runtimeModules tab)**

- Attach Mechanics Module (modal-trigger): Opens MechanicsModulePickerModal to browse and attach a reusable Mechanics Module creation to this asset.; wired to `fetchOwnedCreations GET /api/creations?type=MECHANICS_MODULE and fetchCommunityCreations GET /api/community/creations?type=MECHANICS_MODULE`

**runtime mechanics modules**

- Remove mechanics module (per attached binding) (button): Detaches a bound Mechanics Module from this asset (writes to form.data.engine_module_bindings).; data: local_state
- Enabled (per attached binding) (checkbox): Toggles whether the attached mechanics module binding is active.; data: local_state
- Priority (per attached binding) (input): Numeric precedence value for this mechanics binding (default 65).; data: local_state
- Inheritance Mode (per attached binding: Local only / Inheritable / Override) (select): Controls whether this mechanics binding is inherited by child scopes.; data: local_state
- Mechanics Scope (per attached binding: BINDING_OWNER / STORY_ROOM) (select): Controls whether mechanics values write to this asset's own scope or to the root story-room scope.; data: local_state

**mechanics module picker modal**

- My Mechanics / Public Mechanics tabs (tabs): Switches between the owner's own Mechanics Module creations and publicly available community modules.; wired to `fetchOwnedCreations / fetchCommunityCreations (see Attach Mechanics Module row)`
- Search mechanics modules (input): Client-side filters the loaded modules list by title/tags/creator.; data: local_state
- Module result card (per module) (display): Shows title, description, tracker/guard/command counts, tags for each candidate module; clicking selects and attaches it.; data: fe_api_route; missing states: empty/loading/error


### `/studio/official-characters`

Let players browse and search Crestfall's official canon character roster.

**page head**

- Canon Interactive Cast eyebrow/title/lede (display): Static page head text.

**search/result-count bar**

- Search name, faction, tag, realm... (input): Client-side text search filtering the already-loaded character list by title/eyebrow/subtitle/cardText/realm/race/gender/tags/themes/factions.; data: local_state
- N of M official characters shown (display): Live result/total count derived from filtered vs full character list.; data: fixture

**character card grid**

- Character card image + title + eyebrow + description (display): Displays each official character's card content sourced from markdown content entries.; data: fixture
- Details (link): Navigates to the character's slug-based detail route.; data: fixture
- Start (button): Disabled placeholder button, no handler, no route to start a chat/session with this character.; **STUBBED**
- Load more (button): Reveals 12 more cards from the already-loaded/filtered in-memory list (also auto-triggers via IntersectionObserver near the bottom).; data: local_state
- No characters found (empty state) (display): Shown when the search query matches zero characters.; data: local_state


### `/studio/play`

Official canon-aware story session entry point (currently a placeholder).

**card grid**

- Start Canon Session (button): StudioActionCard rendered with disabled=true; card renders as a non-interactive div (not a link), footer text reads 'Coming Soon' instead of an action label.; **STUBBED**
- Continue Chronicle (button): Same disabled StudioActionCard pattern as Start Canon Session; resumes active storylines once wired.; **STUBBED**
- Current Events (button): Same disabled StudioActionCard pattern; would follow active world developments/faction conflicts/seasonal Chronicle events.; **STUBBED**


### `/studio/profile/[username]`

Public creator profile page: banner/avatar, bio, stats, follow/like/bookmark/donate/share actions, and tabbed creations/activity/badges content.

**page head**

- Back button (button): router.back() if history exists, else navigates to fallbackHref (/studio/community).; data: local_state
- Public profile load-error banner (display): Shows a red inline banner summarizing loadError from profile fetch, engagement summary fetch, or donation events fetch (first non-null).; data: fe_api_route; missing states: empty/loading

**hero**

- Profile hero (banner, avatar, bio, stat tiles) (display): Displays the public profile fetched server-side: username, banner, avatar, bio, and stat tiles.; wired to `feApiRequest GET /api/profiles/[username]/public (server-side, proxies services-api /v1/profiles/[username]/public)`; missing states: empty/loading
- Followers count link (link): Navigates to the connections page with tab=followers.
- Following count link (link): Navigates to the connections page with tab=following.

**hero engagement row**

- Like creator button (button): Toggles LIKE reaction on this profile.; wired to `profileReactionClient.setProfileLike POST /api/engagement/profile-reactions`; missing states: empty/loading
- Bookmark creator button (button): Toggles BOOKMARK reaction on this profile.; wired to `profileReactionClient.setProfileBookmark POST /api/engagement/profile-reactions`; missing states: empty/loading
- Follow creator button (engagement-actions variant) (button): Toggles FOLLOW reaction on this profile via the generic engagement-actions widget (separate code path from ProfileFollowButton).; wired to `profileReactionClient.setProfileFollow POST /api/engagement/profile-reactions`; missing states: empty/loading
- Donate button + donation modal (modal-trigger): Opens a modal to send coins to the creator; amount input, optional message, anonymous checkbox, submit.; wired to `creatorDonationClient.donateProfileCoins POST /api/profile/donations`; missing states: empty
- Donation amount input (input): Numeric coin amount, validated client-side against minimum (100) and current balance before submit.; data: local_state
- Donation message textarea (textarea): Optional message attached to the donation, max 500 chars.; data: local_state
- Donate anonymously checkbox (checkbox): Marks the donation to display sender as 'Mystery Donor' publicly.; data: local_state
- Share button (button): Copies the profile's public URL to the clipboard (Clipboard API with execCommand fallback); label flips to 'Copied'/'Copy Failed'.; data: local_state

**tabs**

- Creations / Activity / Badges tabs (tabs): Switches the lower page body between the creation grid, activity feed, and badges grid.; data: local_state

**tabs > Creations panel**

- Public creation card grid (display): Renders this creator's public creations as CreationCard instances (context="public").; wired to `(inherits creations array from page-level GET /api/profiles/[username]/public)`; missing states: loading
- Creation card like/bookmark buttons (button): Toggle LIKE/BOOKMARK reactions on this creator's individual creations.; wired to `creationReactionClient.setCreationLike/setCreationBookmark POST /api/engagement/creation-reactions`; missing states: empty/loading

**tabs > Activity panel**

- Activity feed (creation releases + donations received) (display): Merges this creator's creations and donation events into a single reverse-chronological timeline.; wired to `getPublicProfileDonationEvents -> GET /api/profile/donations?profileId=... (server-side, proxies services-api); creations from page-level profile fetch`; missing states: loading

**tabs > Badges panel**

- Badge grid (display): Renders this creator's earned badges (label, category, description, image) or an empty state.; wired to `(inherits badges array from page-level GET /api/profiles/[username]/public)`; missing states: loading/error


### `/studio/profile/[username]/connections`

List a creator's followers and following, with a follow toggle per connection.

**page head**

- Back to Profile link (link): Navigates to /studio/profile/[username].

**tab bar**

- Followers / Following tab links (tabs): Server-rendered links that switch the active list via ?tab= query param (full navigation, not client state); shows live counts.; wired to `feApiRequest GET /api/profiles/[username]/connections (server-side, proxies services-api /v1/profiles/[username]/connections)`; missing states: empty/loading/error

**connections list**

- Connection card list (display): Renders each follower/following entry: avatar, handle, tagline, description.; data: fe_api_route; missing states: loading
- View Profile link (per connection) (link): Navigates to that connection's public profile.
- Follow / Following button (per connection) (button): Toggles follow state for the listed connection by username.; wired to `profileFollowClient.setProfileFollowByUsername POST or DELETE /api/profiles/[username]/follow`; missing states: empty


### `/studio/submit-canon`

Placeholder landing page describing the future curated canon-submission review process.

**page head**

- Earn a Place in the Chronicle (title/eyebrow/description only) (display): Static StudioPageHeader copy, no controls.

**coming-soon panel**

- What this section will support (Feature one/Feature two/Feature three chips) (display): Renders StudioComingSoon with a hardcoded items array whose entries are still literally placeholder strings 'Feature one', 'Feature two', 'Feature three'; no real feature descriptions, no controls of any kind.; data: fixture; **STUBBED**


### `/`

Site entry hero introducing the Crestfall lore archive and routing visitors into the archive, chronicle, or studio.

**hero**

- Enter the Archive (link): Links to /lore
- Read the Chronicle (link): Links to /chronicle
- Enter Crestfall (link): Plain anchor tag (not next/link) navigating to /studio

**archive index**

- Featured section cards (Lore, Characters, Locations, Factions, Stories, etc.) (display): Renders featuredSections array as a grid of LoreCard links into archive sub-routes; data: fixture

**inserted story panel**

- Not every story agrees. (field note block) (display): Static decorative narrative panel, no interactivity; data: fixture


### `/characters`

Browse and filter the full character roster of the Crestfall archive.

**page head**

- Characters (title/eyebrow/lede) (display): Static header text; data: fixture

**filter bar**

- Search the archive... (search input) (input): Free-text search over title/eyebrow/cardText/subtitle/realm/race/gender/tags fields; updates ?q= in URL via router.replace; data: local_state
- Clear search (x icon) (button): Clears the q param and active tags; data: local_state
- Realm dropdown (select): Filters entries by realm field, options derived from unique values in the character dataset; data: local_state
- Gender dropdown (select): Filters entries by gender field; data: local_state
- Race dropdown (select): Filters entries by race field; data: local_state
- Active Era dropdown (select): Filters entries by timePeriodActive field; data: local_state
- Clear (filters button) (button): Resets URL to bare pathname, clearing all filters/search/tags; data: local_state

**tag rail**

- Left/right scroll arrows (button): Scrolls the horizontal tag chip rail by 240px via ref.scrollBy; data: local_state
- All (tag chip) (toggle): Clears active tag filters, selecting all; data: local_state
- Individual tag chips (e.g. ACADEMIA, ADMINISTRATION...) (toggle): Toggles a tag on/off in the tags URL param; multi-select AND filter against entry.tags; data: local_state

**card grid**

- Character portrait cards (display): Renders filtered/searched character entries as LoreCard links to /characters/[slug]; wired to `getCharacters (data/characters.js -> lib/content.js getAllMarkdownEntries)`


### `/studio/my-creations/[id]/preview`

Show a Lore creation's owner a read-only preview of their saved draft exactly as the published document renderer will present it, before it goes live.

**top row**

- Back to Lore editor (link): Navigates to /studio/my-creations/{id}/edit.
- Owner-only draft preview (badge) (display): Non-interactive status pill labeling this as the owner-only draft view.

**document body**

- Lore document renderer (title, chapters, sections) (display): Renders the full saved Lore document (title, description, chapters, sections, blocks) exactly as the public revision renderer would, server-loaded once at request time.; wired to `getEditCreationPageData -> feApiRequest GET /api/creations/{id} (+ GET /api/creations/{id}/image-library, fetched but unused by this route's own UI)`; missing states: loading/error
- Contents (table of contents links) (link): In-page anchor links jumping to a chapter/section heading; only rendered when there is more than one titled chapter/section.
- Character/Location reference chips (link): Navigates to /studio/creations/{characterOrLocationId} for a referenced character or location.

**document body / section header**

- Copy section link / Copy chapter link (Share2 icon) (button): Copies an anchor URL (previewHref#chapterOrSectionId) to the clipboard, showing "Link copied" for ~1.6s.; data: local_state

**top of document**

- Development preview / test banner (display): Static warning banner stating this is an owner-only draft preview distinct from the published revision.


### `/studio/create/mechanics-loadout`

Legacy URL that redirects creators to the current Actor Mechanics Profile builder.

**page (server redirect)**

- (automatic redirect to /studio/create/actor-mechanics-profile) (link): Next.js redirect() call in the server component body sends the browser to /studio/create/actor-mechanics-profile with no render of its own

