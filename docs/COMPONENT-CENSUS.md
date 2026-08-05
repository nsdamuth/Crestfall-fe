# Component census

Generated from docs/COMPONENT-CENSUS.csv by a script. Do not edit by hand;
regenerate after editing the CSV. No fact appears here that is absent from the CSV.

Totals: 399 component packages. 220 carry the full view/contract/fixtures split. 75 carry behavior (data access); the rest are presentation only. 30 are used by no real page.

## Shared foundation (Phase 3 build list, top 20 by page usage)

| Package | Pages | What it does | Contract | Fixtures | Preview |
|---|---|---|---|---|---|
| components/studio/studio-account-provider | 54 | Provides authenticated studio account context with coin balance and profile data to child components. | yes | yes | /dev/ui-preview/studio-account-provider |
| components/studio/studio-economy-widget | 54 | Displays user's coin balance with buy and notification info panels. | yes | yes | /dev/ui-preview/studio-economy-widget |
| components/studio/studio-mobile-nav | 54 | Mobile navigation drawer with primary links, utility links, social links, and user account display. | yes | yes | /dev/ui-preview/studio-mobile-nav |
| components/studio/studio-sidebar | 54 | Desktop sidebar navigation with collapsed/expanded layout and embedded economy widget. | yes | yes | /dev/ui-preview/studio-sidebar |
| components/studio/studio-top-bar | 54 | Header bar with branding and user account icon link. | yes | yes | /dev/ui-preview/studio-top-bar |
| components/studio/StudioShell.jsx | 54 | Main layout wrapper providing studio-wide context (account) and routing structure. | no | no | none |
| components/studio/studio-page-header | 48 | Page header with eyebrow, title, description, and slot for actions. | yes | yes | /dev/ui-preview/account-stub-page |
| components/studio/studio-back-link | 32 | Breadcrumb link for navigating back in the studio. | yes | yes | /dev/ui-preview/account-stub-page |
| components/ui/CrestfallSelect.jsx | 23 | Dropdown select component with keyboard escape handling and click-outside detection. | no | no | /dev/ui-preview/asset-builder |
| components/SiteHeader.jsx | 14 | Main site navigation header with Crestfall logo, title, and navigation links. | no | no | none |
| components/ScrollControls.jsx | 13 | Fixed-position scroll-to-top and scroll-to-bottom buttons. | no | no | none |
| components/SiteShell.jsx | 13 | Main layout wrapper with background image, gradient scrim, and scroll controls. | no | no | none |
| components/studio/create/structured-registry/registry-linked-creation-picker | 13 | Modal for picking creations by type with search and selection callbacks. | yes | yes | /dev/ui-preview/actor-mechanics-profile-builder |
| components/studio/create/structured-registry/RegistryLinkedCreationPickerModal.jsx | 13 | Modal for selecting and filtering creations to link into registry entries. | no | no | /dev/ui-preview/actor-mechanics-profile-builder |
| components/studio/registries/structuredRegistryConfigs.js | 11 | Configuration constants for registry types, field definitions, and default values. | no | no | none |
| components/studio/registries/structuredRegistryUtils.js | 11 | Utility functions for registry entry normalization, validation, and data transformation. | no | no | none |
| components/ui/ModalShell.jsx | 11 | Reusable modal container with backdrop and escape key handling. | no | no | /dev/ui-preview/actor-mechanics-profile-builder |
| components/blocks/CalloutBlock.jsx | 9 | Renders a callout box with title and paragraph body. | no | no | /dev/ui-preview/lore-builder |
| components/blocks/DividerBlock.jsx | 9 | Renders a decorative divider line. | no | no | /dev/ui-preview/lore-builder |
| components/blocks/ExcerptBlock.jsx | 9 | Renders a bordered excerpt section with optional title and italic body. | no | no | /dev/ui-preview/lore-builder |

## Behavior packages (data access lives here; a redesign must not detach these)

- components/studio/studio-account-provider (54 pages): Provides authenticated studio account context with coin balance and profile data to child components. [Imports fetchCurrentStudioAccount from lib/client; owns data-fetching lifecycle in useEffect]
- components/studio/create/structured-registry/registry-linked-creation-picker (13 pages): Modal for picking creations by type with search and selection callbacks. [behavior_signal: true; confirmed by fetchOwnedCreations import in view model]
- components/studio/create/structured-registry/RegistryLinkedCreationPickerModal.jsx (13 pages): Modal for selecting and filtering creations to link into registry entries. [View model imports fetchOwnedCreations from lib/client; fetches data on mount]
- components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker (6 pages): Mechanics module picker modal with search filtering and selection callbacks. [behavior_signal: true; confirmed by data-fetching view model]
- components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModulePickerModal.jsx (6 pages): Modal for searching and selecting mechanics modules from owned or community creations. [View model imports fetchCommunityCreations and fetchOwnedCreations; fetches data on type change]
- components/studio/create/structured-registry/structured-registry-builder (5 pages): Builder interface for creating/editing structured registries with tab navigation and linked creation picker. [Uses useStructuredRegistryBuilder hook which calls createCreationDraft]
- components/studio/my-creations/edit/sections/locations/location-parent-picker (5 pages): Modal for selecting a parent location to create hierarchical location relationships. [View model imports fetchOwnedCreations; fetches locations on mount]
- components/studio/my-creations/edit/sections/locations/LocationParentPickerModal.jsx (5 pages): Modal component that lets users search and select a parent location from their owned locations, fetching the list on mount. [Fetches owned locations via fetchOwnedCreations in the view model.]
- components/studio/my-creations/edit/sections/locations/weather-module-config-modal (5 pages): Modal for configuring in-world weather conditions, climate behavior, and composer guidance. [View model imports createEngineModuleInstance, fetchEngineModuleInstance, updateEngineModuleInstance from lib/client]
- components/studio/registries/hooks/useStructuredRegistryBuilder.js (5 pages): Hook managing structured registry entry CRUD, state, and persistence. [behavior_signal: true; imports createCreationDraft from lib/client; mutates data on save]
- components/studio/create/lore/lore-editor (4 pages): Comprehensive lore editor that fetches owned/liked characters and locations, manages document structure and validation [Fetches owned/community creations and reactions via fetchOwnedCreations, fetchCommunityCreations, fetchCreationReactions]
- components/studio/create/wardrobe/outfit-picker (4 pages): Modal that fetches and displays owned outfit creations for selection with search filtering [Fetches outfit creations via fetchOwnedCreations]
- components/studio/create/assets/asset-builder (3 pages): Visual asset builder form that saves drafts and manages image generation candidates [Creates asset draft via createVisualAssetDraft]
- components/studio/creations/creation-card (3 pages): Card component displaying creation with preview modal, chat start, and default character set options [Fetches creation preview, starts story chat, sets default player character via fetchCreationPreview, startStoryFromCreation, setDefaultPlayerCharacter]
- components/studio/creations/creation-preview-modal (3 pages): Modal displaying creation details with chat and default character actions [Starts story chat and sets default player character via startStoryFromCreation, setDefaultPlayerCharacter]
- components/studio/engagement/hooks/useCreationEngagementState.js (3 pages): Hook that fetches creation reaction states and manages like/bookmark mutations [Fetches and mutates engagement data via fetchCreationReactions, setCreationLike, setCreationBookmark]
- components/studio/media/media-lightbox (3 pages): Lightbox viewer for media with details panel, report form, and engagement tracking [Fetches image details and creates media reports via fetchImageOutputDetails, createMediaReport]
- components/studio/account/default-player-character-picker (2 pages): Modal that fetches owned player characters for selection as default [Fetches owned player characters via fetchOwnedCreations]
- components/studio/create/location-registry/location-registry-builder (2 pages): Full-featured location registry builder with data fetching, form management, and save functionality for creation drafts. [Imports and uses lib/client functions (createCreationDraft, fetchOwnedCreations, updateCreationDraft) for data persistence and remote operations.]
- components/studio/engagement/hooks/useProfileEngagementState.js (2 pages): Hook that fetches profile reaction states and manages like/bookmark/follow mutations [Fetches and mutates profile engagement via fetchProfileReactions, setProfileLike, setProfileBookmark, setProfileFollow]
- components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel.js (2 pages): Manages creation image library state including fetching, filtering, sorting, and updating featured image assignments.
- components/studio/registries/hooks/useLocationRegistryBuilder.js (2 pages): Custom hook managing location registry data state, tab navigation, save sessions, and API calls for creation drafts. [Imports and calls lib/client functions (createCreationDraft, fetchOwnedCreations, updateCreationDraft) and manages remote save operations with session tracking.]
- components/studio/room-templates/hooks/useMutualPlayers.js (2 pages): Fetches list of mutual players following the current user via client library.
- components/studio/room-templates/hooks/useRoomTemplateReferenceData.js (2 pages): Fetches reference data for room templates including characters, scenarios, narrators, and locations.
- components/studio/storylines/hooks/useStorylineReferenceOptions.js (2 pages): Fetches reference data for storylines including available room templates and scenarios.
- components/studio/account/studio-account-coins (1 pages): Fetches and displays current coin balance with purchase info modal capability.
- components/studio/account/studio-account-metrics (1 pages): Fetches and displays studio account metrics including characters, canon, interactions, likes, and images.
- components/studio/account/studio-account-profile (1 pages): Fetches current studio profile and mutates profile fields including username, display name, contact email, and content preferences.
- components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder (1 pages): Creates and saves actor mechanics profiles to the database with bindings and identity metadata.
- components/studio/create/character-template/character-template-builder (1 pages): Multi-step builder for creating character templates that collects template metadata and character attribute fields, then saves the template via API. [Calls createCharacterTemplateDraft and mutates product data via router navigation after save.]
- components/studio/create/character/character-creator (1 pages): Saves character drafts to the database with form data, templates, and progress tracking.
- components/studio/create/creation-studio (1 pages): Displays three creation modes (Quick Start, Guided Build, Full Studio) with progress tracking and chapter navigation. [Fetches owned creations via fetchOwnedCreations from lib/client; behavior_signal flip.]
- components/studio/create/CreationStudioExperience.jsx (1 pages): Main experience component that renders the creation studio interface, fetching owned creations from API. [View model fetches owned creations via fetchOwnedCreations.]
- components/studio/create/item-registry/item-registry-builder (1 pages): Multi-step builder for creating item registries that manages item entries, starting assignments, and saves the registry via API. [Calls createCreationDraft to persist item registry data.]
- components/studio/create/location/location-builder (1 pages): Multi-step builder for creating locations that collects location metadata, sensory environment, runtime modules, and registry attachments, then saves via API. [Calls createLocationDraft to persist location data.]
- components/studio/create/location/LocationBuilderShell.jsx (1 pages): Container component that orchestrates location builder sections and passes props from the location builder view model to child components. [Calls behavior view model that saves location data.]
- components/studio/create/lore/lore-builder (1 pages): Builder for creating lore documents with text editing, rendering preview, JSON editing, and saving via API. [View model has data mutation via API calls.]
- components/studio/create/lore/lore-engine-use (1 pages): Displays lore engine use submission status with mode selection, reference selection, status badge, and action buttons; fetches submission state from loreEngineUseClient. [Imports from lib/client loreEngineUseClient; owns fetch and state management for engine use submissions]
- components/studio/create/lore/lore-publication-readiness (1 pages): Displays lore validation status with readiness checks, validation badges, error/warning issue lists, and submission/refresh/cancel action buttons; fetches validation state from loreValidationClient. [Imports from lib/client loreValidationClient; owns fetch and state management via useCallback hooks]
- components/studio/create/lore/LoreBuilderShell.jsx (1 pages): Container component that orchestrates lore editor and renderer sections with optional JSON editor modal. [Calls behavior view model that manages lore document mutations.]
- components/studio/create/mechanics-module/mechanics-module-builder (1 pages): Builder for creating mechanics modules with configurable fields and save functionality via API. [View model handles module creation and API calls.]
- components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx (1 pages): Container component that renders mechanics module builder with fields section. [Calls behavior view model for mechanics module creation.]
- components/studio/create/narrator/narrator-builder (1 pages): Builder for creating narrator profiles with tone, pacing, detail level, guidance, and visibility settings, then saves via API. [View model handles narrator creation and data persistence.]
- components/studio/create/narrator/NarratorBuilderShell.jsx (1 pages): Container component that renders the narrator builder interface from a view model. [Calls behavior view model for narrator creation.]
- components/studio/create/npc-registry/npc-registry-builder (1 pages): Builder for creating NPC registries with entry management, relationship rules, knowledge rules, and alias rules, saving to API. [View model handles registry creation and mutation of NPC data.]
- components/studio/create/player-character/player-character-creator (1 pages): Multi-step form (Identity, Appearance, Body, Profile, Review) to create a player character draft with save functionality. [Calls createPlayerCharacterDraft from lib/client to persist form data.]
- components/studio/create/progression/progression-profile-builder (1 pages): Form to create and edit a progression profile with validation, profile editor, and draft save. [Calls createProgressionProfileDraft from lib/client.]
- components/studio/create/room-template/room-template-builder (1 pages): Complex builder for room templates with scenario selection, character management, opening messages, and recommendations. [Calls useRoomTemplateReferenceData and useMutualPlayers for data; calls createRoomTemplateDraft from lib/client.]
- components/studio/create/rules-codex/rules-codex-builder (1 pages): Form to create and edit a rules codex with validation, section management, and draft save. [Calls createRulesCodexDraft from lib/client; behavior_signal flip.]
- components/studio/create/scenario/scenario-builder (1 pages): Creates scenario drafts and fetches owned creations to populate reference options in a scenario builder form. [Imports createScenarioDraft and fetchOwnedCreations from lib/client; runs useEffect to load references and calls createDraft on save.]
- components/studio/create/stats-pools/stats-pools-builder (1 pages): Manages building and saving stats and pools profile definitions with client-side validation and backend persistence. [Viewmodel creates drafts via lib/client and handles save lifecycle with error messaging.]
- components/studio/create/stats-pools/StatsPoolsBuilderShell.jsx (1 pages): Connects a stats pools builder view to its viewmodel, which manages draft creation and validation. [Shell component that calls useStatsPoolsBuilderViewModel, which uses createStatsPoolsProfileDraft from lib/client.]
- components/studio/create/wardrobe/wardrobe-builder (1 pages): Manages wardrobe item editing with local form state and backend draft saving, supporting entry management and outfit selection. [Uses createCreationDraft from lib/client to persist wardrobe definitions.]
- components/studio/creations/creation-profile-page (1 pages): Loads and displays creation media with reactions, enabling likes and bookmarks while supporting story launches from creations. [Calls fetchMediaReactions, setMediaLike, setMediaBookmark from lib/client; calls startStoryFromCreation to initiate chat.]
- components/studio/games/games-hub (1 pages): Loads and displays playable games, enabling story template launches and game filtering. [Uses fetchGames and playStoryTemplate from lib/client; manages game list and play state.]
- components/studio/image-studio/hooks/useImageGenerationHistory.js (1 pages): Fetches and manages image generation history with pagination, active job polling, and local pending state. [Calls fetchImageGenerationHistory. Polls for active jobs.]
- components/studio/image-studio/hooks/useImageGenerationJob.js (1 pages): Submits image generation jobs to the server and tracks their loading/error state. [Calls createImageGenerationJob from imageStudioClient.]
- components/studio/image-studio/hooks/useImageStudioIngredientOptions.js (1 pages): Fetches available image studio ingredients (characters, outfits, locations, poses, presets) for ingredient picker. [Calls fetchImageStudioIngredientCreations from imageStudioClient.]
- components/studio/image-studio/image-studio-workbench (1 pages): Manages Image Studio workbench state including ingredient selection, custom prompts, image generation job submission, and history. [Imports creationClient (createCreationDraft), useImageGenerationHistory, and useImageGenerationJob. Mutates product data.]
- components/studio/image-studio/media-history-grid (1 pages): Grid display of generated images with reactions, bookmarks, deletes, and lazy-loading. [Imports mediaReactionClient (fetchMediaReactions, setMediaBookmark, setMediaLike) and imageOutputClient (deleteImageOutput).]
- components/studio/my-creations/creation-edit-shell (1 pages): Shell component for creation edit UI with section navigation and featured media management. [Calls setDefaultPlayerCharacter API to set default player character when user selects it.]
- components/studio/my-creations/edit/hooks/useCreationEditViewModel.js (1 pages): Manages creation edit form state including field updates, save/archive/delete operations, and featured media slots. [Imports creationClient with archiveCreation, deleteCreation, updateCreationDraft, fetchOwnedCreation functions.]
- components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section (1 pages): UI for selecting scenario cast requirements (character roles) and registry bindings (factions, organizations). [Calls fetchOwnedCreations from creationClient to load available characters and references for cast selection.]
- components/studio/my-creations/edit/sections/visual-references-section (1 pages): UI for selecting anime and realistic reference images from creation's image library. [Calls useCreationImageLibraryViewModel which fetches creation image library data. Signal was false but flipped to behavior.]
- components/studio/my-creations/image-library/creation-featured-image-picker (1 pages): Modal interface for browsing and selecting featured images from a creation's image library. [Calls fetchCreationImageLibrary and setCreationFeaturedImageSlot from lib/client]
- components/studio/my-creations/image-library/creation-image-library-page (1 pages): Full-page library of a creation's images with filtering, pagination, likes/bookmarks, and deletion. [Calls fetchMediaReactions, setMediaLike, setMediaBookmark, and deleteImageOutput from lib/client]
- components/studio/my-creations/image-library/creation-reference-image-picker (1 pages): Modal UI for browsing and selecting eligible images from creation's image library as visual references. [Calls useCreationImageLibraryViewModel which fetches library data and image reactions. Signal was false but flipped to behavior.]
- components/studio/my-creations/image-library/CreationFeaturedImagePickerModal.jsx (1 pages): Modal interface for browsing and selecting featured images from a creation's image library. [Calls fetchCreationImageLibrary and setCreationFeaturedImageSlot from lib/client]
- components/studio/my-creations/my-creations-hub (1 pages): Main hub displaying a searchable, filterable grid of owned creations with engagement indicators. [Uses useCreationEngagementState which provides toggle callbacks for like/bookmark]
- components/studio/profile/profile-follow-button (1 pages): Button to toggle follow state for a profile with loading and error states. [Calls setProfileFollowByUsername from lib/client]
- components/studio/profile/public-profile-donate-button (1 pages): Modal interface for donating coins to a profile with amount input and balance checking. [Calls donateProfileCoins and refreshAccount from lib/client]
- components/studio/profile/public-profile-engagement-actions (1 pages): Action row for liking, bookmarking, and following a profile with engagement state. [Uses useProfileEngagementState which provides toggle callbacks for like/bookmark/follow]
- components/studio/registries/hooks/useNpcRegistryEditor.js (1 pages): Manages NPC registry editing with character option loading and entry/relationship/knowledge/alias draft management. [Calls fetchNpcRegistryCharacterOptions from registryClient to load available characters.]
- components/studio/story-rooms/hooks/useStoryRoomChat.js (1 pages): Manages story room state including messages, participants, and NPC registry; fetches room data and sends messages via storyRoomClient
- components/studio/storylines/storyline-builder-shell (1 pages): Manages storyline creation with reference loading and draft persistence to the backend. [Uses createStorylineDraft from lib/client; loads storyline references and persists form state.]

## Unused by any real page

- components/content/EntryCard.jsx: Empty file with no implementation
- components/PageShell.jsx: Renders a page wrapper with header and centered content container
- components/PublicHomeFooter.jsx: Renders footer with brand description and navigation links to legal pages
- components/SectionHeader.jsx: Renders a section header with optional eyebrow, title, and descriptive text
- components/SourebookPanel.jsx: Renders a sidebar panel with eyebrow, heading, and rich text content
- components/studio/character-templates/hooks/useCharacterTemplateBuilder.js: Wrapper hook that exports step definitions and adapts the character template builder view model
- components/studio/characters/hooks/useCharacterCreator.js: Compatibility adapter hook that wraps character creator view model and flattens props for legacy callers
- components/studio/create/RegistryStubPanel.jsx: Renders a stub panel for planned registry builders with focus areas and coming-soon button
- components/studio/create/room-template/BuilderSection.jsx: Renders a section container for builder forms with eyebrow, title, description, and children
- components/studio/create/room-template/InvitedPlayersPanel.jsx: Not examined; based on naming and import pattern, likely renders invited players list
- components/studio/create/room-template/OpeningMessageCard.jsx: Not examined; based on naming and import pattern, likely renders opening message editor
- components/studio/create/room-template/RoomTemplatePickerModal.jsx: Not examined; based on naming and import pattern, likely renders modal for selecting room templates
- components/studio/create/room-template/RoomTemplateSummary.jsx: Not examined; based on naming and import pattern, likely renders summary view of room template
- components/studio/create/room-template/ScenarioRecommendationsPanel.jsx: Not examined; based on naming and import pattern, likely renders scenario recommendations
- components/studio/create/wardrobe/hooks/useWardrobeBuilder.js: Adapter hook that wraps wardrobe builder view model and exports data management functions
- components/studio/my-creations/CreationReferenceImagePickerModal.jsx: Not examined; based on naming and import pattern, likely renders modal for picking reference images
- components/studio/my-creations/edit/creationEditLifecycle.js: Empty file with no implementation
- components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx: Not examined; based on naming and import pattern, likely renders modal for configuring trackers module
- components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline: Renders a development-only inventory of frozen document shapes and replacement boundaries for mechanics modules
- components/studio/my-creations/edit/sections/mechanics-modules/mechanics-saved-asset-migration/mechanicsSavedAssetMigration.js: Not examined; based on naming and import pattern, likely utility for migrating saved mechanics assets
- components/studio/my-creations/edit/sections/MediaSection.jsx: Not examined; based on naming and import pattern, likely renders media editing section
- components/studio/my-creations/edit/sections/VisualAssetPromptSection.jsx: Not examined; based on naming and import pattern, likely renders prompt editor for visual assets
- components/studio/my-creations/edit/sections/VisualAssetSettingsSection.jsx: Not examined; based on naming and import pattern, likely renders settings editor for visual assets
- components/studio/navigation-portability/NavigationPortability.targets.mjs: Exports a data structure defining component navigation targets with view, shell, and preview paths
- components/studio/registries/hooks/useItemRegistryBuilder.js: Not examined; based on naming and import pattern, likely hook for building item registry
- components/studio/registries/hooks/useNpcRegistryBuilder.js: Not examined; based on naming and import pattern, likely hook for building NPC registry
- components/studio/room-templates/hooks/useRoomTemplateBuilder.js: Not examined; based on naming and import pattern, likely hook for building room templates
- components/studio/story-rooms/StoryRoomMobileToolbar.jsx: Renders mobile toolbar with room info and buttons to open cast and state panels
- components/studio/storylines/hooks/useStorylineBuilderViewModel.js: Re-exports storyline builder view model and utilities from storyline-builder-shell
- components/studio/storylines/hooks/useStorylinesHubViewModel.js: Re-exports storylines hub view model and utilities from storylines-hub subdirectory

## Full census

| Package | Pages | View | VM | Contract | Fixtures | Kind | What it does |
|---|---|---|---|---|---|---|---|
| components/studio/studio-account-provider | 54 | no | yes | yes | yes | behavior | Provides authenticated studio account context with coin balance and profile data to child components. |
| components/studio/studio-economy-widget | 54 | yes | yes | yes | yes | presentation | Displays user's coin balance with buy and notification info panels. |
| components/studio/studio-mobile-nav | 54 | yes | yes | yes | yes | presentation | Mobile navigation drawer with primary links, utility links, social links, and user account display. |
| components/studio/studio-sidebar | 54 | yes | yes | yes | yes | presentation | Desktop sidebar navigation with collapsed/expanded layout and embedded economy widget. |
| components/studio/studio-top-bar | 54 | yes | yes | yes | yes | presentation | Header bar with branding and user account icon link. |
| components/studio/StudioShell.jsx | 54 | no | no | no | no | presentation | Main layout wrapper providing studio-wide context (account) and routing structure. |
| components/studio/studio-page-header | 48 | yes | no | yes | yes | presentation | Page header with eyebrow, title, description, and slot for actions. |
| components/studio/studio-back-link | 32 | yes | no | yes | yes | presentation | Breadcrumb link for navigating back in the studio. |
| components/ui/CrestfallSelect.jsx | 23 | no | no | no | no | presentation | Dropdown select component with keyboard escape handling and click-outside detection. |
| components/SiteHeader.jsx | 14 | no | no | no | no | presentation | Main site navigation header with Crestfall logo, title, and navigation links. |
| components/ScrollControls.jsx | 13 | no | no | no | no | presentation | Fixed-position scroll-to-top and scroll-to-bottom buttons. |
| components/SiteShell.jsx | 13 | no | no | no | no | presentation | Main layout wrapper with background image, gradient scrim, and scroll controls. |
| components/studio/create/structured-registry/registry-linked-creation-picker | 13 | yes | yes | yes | yes | behavior | Modal for picking creations by type with search and selection callbacks. |
| components/studio/create/structured-registry/RegistryLinkedCreationPickerModal.jsx | 13 | no | no | no | no | behavior | Modal for selecting and filtering creations to link into registry entries. |
| components/studio/registries/structuredRegistryConfigs.js | 11 | no | no | no | no | presentation | Configuration constants for registry types, field definitions, and default values. |
| components/studio/registries/structuredRegistryUtils.js | 11 | no | no | no | no | presentation | Utility functions for registry entry normalization, validation, and data transformation. |
| components/ui/ModalShell.jsx | 11 | no | no | no | no | presentation | Reusable modal container with backdrop and escape key handling. |
| components/blocks/CalloutBlock.jsx | 9 | no | no | no | no | presentation | Renders a callout box with title and paragraph body. |
| components/blocks/DividerBlock.jsx | 9 | no | no | no | no | presentation | Renders a decorative divider line. |
| components/blocks/ExcerptBlock.jsx | 9 | no | no | no | no | presentation | Renders a bordered excerpt section with optional title and italic body. |
| components/blocks/HeadingBlock.jsx | 9 | no | no | no | no | presentation | Renders a heading at level 2 or 3 with styled typography. |
| components/blocks/ImageBlock.jsx | 9 | no | no | no | no | presentation | Renders an image with optional caption and size/alignment control. |
| components/blocks/InlineQuoteBlock.jsx | 9 | no | no | no | no | presentation | Renders an inline quote with attribution in smaller format. |
| components/blocks/PullQuoteBlock.jsx | 9 | no | no | no | no | presentation | Renders a pull quote with optional attribution. |
| components/blocks/QuoteBlock.jsx | 9 | no | no | no | no | presentation | Renders a centered block quote with optional attribution. |
| components/blocks/SidebarBlock.jsx | 9 | no | no | no | no | presentation | Renders a sidebar block with title, body text, and item list. |
| components/blocks/StatBlock.jsx | 9 | no | no | no | no | presentation | Renders a definition list of stats/references with labels and values. |
| components/blocks/StoryExcerptBlock.jsx | 9 | no | no | no | no | presentation | Renders a story excerpt with optional image positioned left/right/top/bottom and text. |
| components/blocks/TextBlock.jsx | 9 | no | no | no | no | presentation | Renders paragraphed text with optional title, drop cap, and indentation. |
| components/blocks/TwoColumnBlock.jsx | 9 | no | no | no | no | presentation | Renders a two-column grid layout containing nested block renderer components. |
| components/LoreBlockRenderer.jsx | 9 | no | no | no | no | presentation | Renders an array of content blocks (text, headings, quotes, images, etc.) with type switching. |
| components/studio/creations/creation-share-button | 7 | yes | yes | yes | yes | presentation | Button that copies a creation's share URL to clipboard with visual feedback. |
| components/LoreCard.jsx | 6 | no | no | no | no | presentation | Card component displaying lore entry with image, eyebrow, title, and text. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker | 6 | yes | yes | yes | yes | behavior | Mechanics module picker modal with search filtering and selection callbacks. |
| components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModulePickerModal.jsx | 6 | no | no | no | no | behavior | Modal for searching and selecting mechanics modules from owned or community creations. |
| components/Breadcrumbs.jsx | 5 | no | no | no | no | presentation | Renders navigation breadcrumbs with path segments and current title. |
| components/DetailPage.jsx | 5 | no | no | no | no | presentation | Page template rendering a lore entry with blocks, breadcrumbs, back button, and related records. |
| components/filterable-index | 5 | yes | yes | yes | yes | presentation | Index page with filter controls, search, and grid of lore cards for entries. |
| components/FloatingBackButton.jsx | 5 | no | no | no | no | presentation | Fixed-position button that navigates back using Next router. |
| components/RelatedRecords.jsx | 5 | no | no | no | no | presentation | Renders a list of related lore records as linked cards. |
| components/studio/account/account-stub-page | 5 | yes | no | yes | yes | presentation | Placeholder account settings page with notice that controls are not yet functional. |
| components/studio/create/structured-registry/structured-registry-builder | 5 | yes | yes | yes | yes | behavior | Builder interface for creating/editing structured registries with tab navigation and linked creation picker. |
| components/studio/creations/pickers/creation-picker-panel | 5 | yes | no | yes | yes | presentation | Renders a searchable grid of creation items with selection, disabled, and recommended states |
| components/studio/my-creations/edit/sections/locations/location-parent-picker | 5 | yes | yes | yes | yes | behavior | Modal for selecting a parent location to create hierarchical location relationships. |
| components/studio/my-creations/edit/sections/locations/location-registry-attachments-section | 5 | yes | yes | yes | yes | presentation | Section for attaching event, quest, NPC, item, location, faction, and organization registries to a location. |
| components/studio/my-creations/edit/sections/locations/location-runtime-modules-section | 5 | yes | yes | yes | yes | presentation | Section for attaching and configuring runtime modules (weather, time/calendar) to a location. |
| components/studio/my-creations/edit/sections/locations/LocationParentPickerModal.jsx | 5 | no | no | no | no | behavior | Modal component that lets users search and select a parent location from their owned locations, fetching the list on mount. |
| components/studio/my-creations/edit/sections/locations/weather-module-config-modal | 5 | yes | yes | yes | yes | behavior | Modal for configuring in-world weather conditions, climate behavior, and composer guidance. |
| components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx | 5 | no | no | no | no | presentation | Section for attaching and managing runtime mechanics modules with priority and scope controls. |
| components/studio/my-creations/edit/sections/SharedFields.jsx | 5 | no | no | no | no | presentation | Shared form field components (SectionTitle, TextField, TextAreaField) for edit sections. |
| components/studio/registries/hooks/useStructuredRegistryBuilder.js | 5 | no | no | no | no | behavior | Hook managing structured registry entry CRUD, state, and persistence. |
| components/studio/create/assets/assetBuilderConfigs.js | 4 | no | no | no | no | presentation | Configuration constants for asset builder types and their properties |
| components/studio/create/character/constants/characterColorPalettes.js | 4 | no | no | no | no | presentation | Constants file with character color palette definitions |
| components/studio/create/character/constants/constants.js | 4 | no | no | no | no | presentation | Constants file exporting option arrays for character creation (species, gender, roles, traits, etc.) |
| components/studio/create/character/skin-tone | 4 | yes | yes | yes | yes | presentation | Modal for selecting character skin tone |
| components/studio/create/character/SkinToneModal.jsx | 4 | no | no | no | no | presentation | Wrapper component for skin tone picker modal |
| components/studio/create/character/trait | 4 | yes | yes | yes | yes | presentation | Modal for selecting character traits with custom trait entry option |
| components/studio/create/character/TraitModal.jsx | 4 | no | no | no | no | presentation | Wrapper component that delegates to nested trait modal implementation |
| components/studio/create/lore/lore-document-renderer | 4 | yes | yes | yes | yes | presentation | Renders formatted lore documents with chapters, sections, and content blocks |
| components/studio/create/lore/lore-editor | 4 | yes | yes | yes | yes | behavior | Comprehensive lore editor that fetches owned/liked characters and locations, manages document structure and validation |
| components/studio/create/wardrobe/outfit-picker | 4 | yes | yes | yes | yes | behavior | Modal that fetches and displays owned outfit creations for selection with search filtering |
| components/studio/create/wardrobe/OutfitPickerModal.jsx | 4 | no | no | no | no | presentation | Wrapper component for outfit picker modal |
| components/studio/creations/creation-stats-row | 4 | yes | yes | yes | yes | presentation | Renders engagement stats row (likes, messages, images, videos) from creation stats object |
| components/studio/creations/creation-status-badges | 4 | yes | yes | yes | yes | presentation | Displays status badges (visibility, approval, canon status, rating) derived from creation data |
| components/ui/crestfall-option-modal | 4 | yes | yes | yes | yes | presentation | Modal dialog for selecting from grouped/searchable options with custom entry support |
| components/studio/create/assets/asset-builder | 3 | yes | yes | yes | yes | behavior | Visual asset builder form that saves drafts and manages image generation candidates |
| components/studio/create/assets/AssetBuilderShell.jsx | 3 | no | no | no | no | presentation | Wrapper shell component for asset builder implementation |
| components/studio/create/character/character-color-palette | 3 | yes | yes | yes | yes | presentation | Modal for selecting and customizing character color palette |
| components/studio/create/character/CharacterColorPaletteModal.jsx | 3 | no | no | no | no | presentation | Wrapper component for character color palette picker |
| components/studio/create/character/hair-eyes | 3 | yes | yes | yes | yes | presentation | Modal for selecting character hair and eye appearance options |
| components/studio/create/character/HairEyesModal.jsx | 3 | no | no | no | no | presentation | Wrapper component for hair and eye feature picker |
| components/studio/create/character/kibbe-preset | 3 | yes | yes | yes | yes | presentation | Modal for selecting Kibbe silhouette identity with body trait suggestions |
| components/studio/create/character/KibbePresetModal.jsx | 3 | no | no | no | no | presentation | Wrapper component for Kibbe body type preset picker |
| components/studio/create/character/multi-trait | 3 | yes | yes | yes | yes | presentation | Modal for selecting multiple character traits simultaneously |
| components/studio/create/character/MultiTraitModal.jsx | 3 | no | no | no | no | presentation | Wrapper component for multi-trait selector |
| components/studio/create/character/personality | 3 | yes | yes | yes | yes | presentation | Modal for selecting character personality archetype with custom option |
| components/studio/create/character/PersonalityModal.jsx | 3 | no | no | no | no | presentation | Wrapper component for personality trait picker |
| components/studio/creations/buildModalCreationFromPreviewGraph.jsx | 3 | no | no | no | no | presentation | Utility function transforming creation preview graph data into modal display format |
| components/studio/creations/creation-card | 3 | yes | yes | yes | yes | behavior | Card component displaying creation with preview modal, chat start, and default character set options |
| components/studio/creations/creation-credits | 3 | yes | no | yes | yes | presentation | Renders creation credits section with creator attribution links |
| components/studio/creations/creation-preview-modal | 3 | yes | yes | yes | yes | behavior | Modal displaying creation details with chat and default character actions |
| components/studio/engagement/hooks/useCreationEngagementState.js | 3 | no | no | no | no | behavior | Hook that fetches creation reaction states and manages like/bookmark mutations |
| components/studio/media/media-lightbox | 3 | yes | yes | yes | yes | behavior | Lightbox viewer for media with details panel, report form, and engagement tracking |
| components/studio/media/media-tile-quick-actions | 3 | yes | yes | yes | yes | presentation | Quick action buttons for media tiles (like, bookmark, expand) |
| components/studio/profile/profile-avatar | 3 | yes | no | yes | yes | presentation | Displays user profile avatar with fallback initial |
| components/studio/account/default-player-character-picker | 2 | yes | yes | yes | yes | behavior | Modal that fetches owned player characters for selection as default |
| components/studio/account/DefaultPlayerCharacterPickerModal.jsx | 2 | no | no | no | no | presentation | Wrapper component for default player character picker modal |
| components/studio/characters/actor-mechanics-profile-attachment | 2 | yes | yes | yes | yes | presentation | Section view for displaying and managing attached actor mechanics profiles with add/remove and domain configuration UI. |
| components/studio/characters/ActorMechanicsProfileAttachmentSection.jsx | 2 | no | no | no | no | presentation | Section component for attaching reusable mechanics profiles to actors with a linked-creation picker modal. |
| components/studio/characters/advanced-prompting/advanced-prompting | 2 | yes | yes | yes | yes | presentation | Editor for character advanced prompting and system instruction customization |
| components/studio/characters/advanced-prompting/AdvancedPromptingEditor.jsx | 2 | no | no | no | no | presentation | Wrapper component for advanced prompting editor |
| components/studio/community/creator-engagement-actions | 2 | yes | yes | yes | yes | presentation | Action row displaying engagement buttons (like, bookmark, follow) for creators |
| components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor | 2 | yes | yes | yes | yes | presentation | Editor interface for character actor mechanics profile data |
| components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor | 2 | yes | yes | yes | yes | presentation | JSON code editor for actor mechanics profile with validation and AI authoring guide |
| components/studio/create/character/constants/voiceModules.js | 2 | no | no | no | no | presentation | Constants file defining available voice module options and configurations |
| components/studio/create/character/default-clothing-selector | 2 | yes | yes | yes | yes | presentation | Selector component for character default clothing outfit |
| components/studio/create/character/eye-color | 2 | yes | yes | yes | yes | presentation | Modal dialog for selecting character eye color from predefined options or custom input with validation. |
| components/studio/create/character/EyeColorModal.jsx | 2 | no | no | no | no | presentation | Bridge component that wraps eye color modal view with its viewmodel to manage eye color selection state. |
| components/studio/create/character/hair | 2 | yes | yes | yes | yes | presentation | Modal dialog for selecting character hair color, length, and texture with predefined options and custom input support. |
| components/studio/create/character/HairModal.jsx | 2 | no | no | no | no | presentation | Wrapper component for hair style picker modal |
| components/studio/create/character/voice-module-picker | 2 | yes | yes | yes | yes | presentation | Modal for selecting character voice module from available options |
| components/studio/create/character/VoiceModulePickerModal.jsx | 2 | no | no | no | no | presentation | Wrapper component for voice module picker modal |
| components/studio/create/location-registry/location-registry-builder | 2 | yes | yes | yes | yes | behavior | Full-featured location registry builder with data fetching, form management, and save functionality for creation drafts. |
| components/studio/create/lore/lore-json-editor | 2 | yes | yes | yes | yes | presentation | Modal dialog for editing raw lore JSON with validation, copy-to-clipboard, guide download, and error reporting. |
| components/studio/create/narrator/narrator-module-selector | 2 | yes | yes | yes | yes | presentation | Interface for selecting official prebuilt narrator style and behavior modules with response direction and ensemble controls. |
| components/studio/create/narrator/narratorModulePresets.js | 2 | no | no | no | no | presentation | Preset definitions for narrator modules including prose style, detail level, pacing, response direction, and ensemble options. |
| components/studio/create/npc-registry/alias-rule | 2 | yes | yes | yes | yes | presentation | Renders a form modal for creating alias rules with name and target character identity fields. |
| components/studio/create/npc-registry/AliasRuleModal.jsx | 2 | no | no | no | no | presentation | Wrapper component that delegates to a viewmodel to compose the alias rule modal view. |
| components/studio/create/npc-registry/knowledge-rule | 2 | yes | yes | yes | yes | presentation | Renders a form modal for defining knowledge rules with subject, knowledge level, and character identities that know or suspect the knowledge. |
| components/studio/create/npc-registry/KnowledgeRuleModal.jsx | 2 | no | no | no | no | presentation | Bridge component wrapping knowledge rule modal view with its viewmodel for managing NPC knowledge definitions. |
| components/studio/create/npc-registry/modal-actions | 2 | yes | no | yes | yes | presentation | Action button row for NPC registry modals with save/cancel or confirm/cancel operations. |
| components/studio/create/npc-registry/modal-shell | 2 | yes | no | yes | yes | presentation | Modal wrapper component providing title, close button, and scrollable content container for NPC registry dialogs. |
| components/studio/create/npc-registry/npc-entry | 2 | yes | yes | yes | yes | presentation | Modal dialog for creating/editing lightweight NPC entries with character linking option and mechanics profile attachment. |
| components/studio/create/npc-registry/NpcEntryModal.jsx | 2 | no | no | no | no | presentation | Wrapper component composing NPC entry modal view with optional actor mechanics profile attachment section. |
| components/studio/create/npc-registry/RegistryUtils.jsx | 2 | no | no | no | no | presentation | Reusable form input components (TextInput, TextArea, SelectInput) for NPC registry modal dialogs. |
| components/studio/create/npc-registry/relationship-rule | 2 | yes | yes | yes | yes | presentation | Modal dialog for editing NPC relationship rules including relationship type, history, and dynamic bond variables. |
| components/studio/create/npc-registry/RelationshipModal.jsx | 2 | no | no | no | no | presentation | Bridge component wrapping relationship rule modal view with its viewmodel for managing NPC relationship definitions. |
| components/studio/create/progression/progression-json-editor | 2 | yes | yes | yes | yes | presentation | Modal for directly editing progression profile JSON with validation and AI authoring guidance. |
| components/studio/create/progression/progression-profile-editor | 2 | yes | yes | yes | yes | presentation | Comprehensive editor for progression curves with support for generated curves, explicit tables, tier definitions, and experience thresholds. |
| components/studio/create/room-template/room-registry-attachments-section | 2 | yes | yes | yes | yes | presentation | Renders a section for attaching room registry items to room templates with reference selection UI. |
| components/studio/create/room-template/story-rules-codex-attachments-section | 2 | yes | yes | yes | yes | presentation | Renders a section for attaching story rules and codex items to room templates with reference selection UI. |
| components/studio/create/rules-codex/rules-codex-editor | 2 | yes | yes | yes | yes | presentation | Visual editor for rules codex with support for rule definitions, optional JSON editor, and validation. |
| components/studio/create/rules-codex/rules-codex-json-editor | 2 | yes | yes | yes | yes | presentation | Modal for directly editing rules codex JSON with validation and AI authoring guidance. |
| components/studio/create/scenario/scenario-reference-picker | 2 | yes | yes | yes | yes | presentation | Modal for selecting existing scenario references with fixture data support. |
| components/studio/create/scenario/ScenarioReferencePickerModal.jsx | 2 | no | no | no | no | presentation | Wrapper component that delegates to a viewmodel to compose the scenario reference picker modal. |
| components/studio/create/scenario/scenarioRegistryBindings.js | 2 | no | no | no | no | presentation | Pure utility functions for managing scenario registry bindings and normalizing registry references. |
| components/studio/create/stats-pools/stats-pools-editor | 2 | yes | yes | yes | yes | presentation | Visual editor for stats pool configuration with threshold management and validation. |
| components/studio/create/stats-pools/stats-pools-json-editor | 2 | yes | yes | yes | yes | presentation | Modal for directly editing stats pools JSON with validation and AI authoring guidance. |
| components/studio/create/wardrobe/wardrobeUtils.js | 2 | no | no | no | no | presentation | Utility functions for wardrobe operations. |
| components/studio/creations/creation-tag-filter-row | 2 | yes | no | yes | yes | presentation | Horizontal row of tag filter buttons for filtering creations |
| components/studio/engagement/hooks/useProfileEngagementState.js | 2 | no | no | no | no | behavior | Hook that fetches profile reaction states and manages like/bookmark/follow mutations |
| components/studio/my-creations/edit/creationEditConstants.js | 2 | no | no | no | no | presentation | Constants for creation edit functionality. |
| components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields | 2 | yes | yes | yes | yes | presentation | Form fields for editing location sensory environment properties including vision, hearing, and scent scales with descriptive guidance. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core | 2 | yes | yes | yes | yes | presentation | Editor for core command properties including name, description, domain lane assignment, and basic metadata. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions | 2 | yes | yes | yes | yes | presentation | Editor for domain-specific actions executed during command phases across different mechanical domains (combat, social, etc). |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects | 2 | yes | yes | yes | yes | presentation | Editor for command effects defining state changes (meter deltas, counters, status blocks) applied after command resolution. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes | 2 | yes | yes | yes | yes | presentation | Editor for command possible outcomes and success/failure narrative branches with result descriptions. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements | 2 | yes | yes | yes | yes | presentation | Editor for command progression requirements defining which advancement tiers unlock or enable command execution. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution | 2 | yes | yes | yes | yes | presentation | Editor for command resolution phase defining outcome logic, probability, and result handling after execution. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder | 2 | yes | yes | yes | yes | presentation | Builder interface for composing command effects, conditions, and multi-step domain actions with reordering and scope management. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core | 2 | yes | yes | yes | yes | presentation | Displays mechanics document compatibility validation results with contract version, phase, and fixture selection for testing. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults | 2 | yes | yes | yes | yes | presentation | Editor for mechanics module default values and fallback settings applied when commands do not specify explicit values. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration | 2 | yes | yes | yes | yes | presentation | Interface providing access to preset library, JSON editor, and validation for mechanics document bulk operations. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards | 2 | yes | yes | yes | yes | presentation | Editor for mechanics guard rules with operations to add, remove, and edit conditions controlling command prerequisites. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor | 2 | yes | yes | yes | yes | presentation | Modal dialog for editing raw mechanics document JSON with validation, copy-to-clipboard, and AI authoring guide generation. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly | 2 | yes | yes | yes | yes | presentation | Orchestrator rendering mechanics document sections (core, guards, defaults, trackers, commands, presets) as tabs. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application | 2 | yes | yes | yes | yes | presentation | Modal for selecting and applying mechanics presets (modules, commands, resolution) with scope filtering and preview. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation | 2 | yes | yes | yes | yes | presentation | Panel displaying live validation results and smoke test commands after applying a mechanics preset to verify runtime behavior. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets | 2 | no | no | yes | no | presentation | Preset library, catalog, application service, and validation logic for mechanics module starter templates and legacy compatibility. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile | 2 | yes | yes | yes | yes | presentation | Form fields for editing character advancement progression including tier definitions and ability unlocks. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks | 2 | yes | yes | yes | yes | presentation | Editor for status effect blocks defining persistent conditions and how they modify character state and combat mechanics. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers | 2 | yes | yes | yes | yes | presentation | Editor for game state trackers (meters, flags, counters, stages) and their initial values and progression rules. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsCommandCompositionBuilder.js | 2 | no | no | no | no | presentation | Builder module providing constants, creation functions, and normalization for command composition (conditions, phases, effects). |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsCommandResolutionBuilder.js | 2 | no | no | no | no | presentation | Builder module providing utilities for constructing command resolution phase definitions and outcome calculations. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsCommandStateReadoutBuilder.js | 2 | no | no | no | no | presentation | Constants and utility functions defining how command state is formatted and displayed (AUTO, NUMBER, BOOLEAN, TEXT formats). |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsEffectValueBindingBuilder.js | 2 | no | no | no | no | presentation | Constants and utility functions for binding effect values (fixed or argument-derived) with rounding and missing-value policies. |
| components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx | 2 | no | no | no | no | presentation | Wrapper component coordinating the mechanics module assembly and replacing mechanics data through a unified interface. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsProgressionProfileBuilder.js | 2 | no | no | no | no | presentation | Builder constants and utility functions for character progression profiles and advancement tier definitions. |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanicsProgressionRequirementAuthoring.js | 2 | no | no | no | no | presentation | Utility functions for normalizing and parsing progression tier IDs in command requirement specifications. |
| components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel.js | 2 | no | yes | no | no | behavior | Manages creation image library state including fetching, filtering, sorting, and updating featured image assignments. |
| components/studio/registries/hooks/locationRegistrySaveSession.mjs | 2 | no | no | no | no | presentation | Session manager tracking save state (inflight, pending) and creation IDs for coordinating location registry save operations. |
| components/studio/registries/hooks/useLocationRegistryBuilder.js | 2 | no | no | no | no | behavior | Custom hook managing location registry data state, tab navigation, save sessions, and API calls for creation drafts. |
| components/studio/registries/item-starting-assignment-editor | 2 | yes | yes | yes | yes | presentation | Form fields editor for assigning item starting placement, holder type, and location-specific placement steps. |
| components/studio/registries/itemRegistryUtils.js | 2 | no | no | no | no | presentation | Utility module providing constants and helper functions for item registry configuration, normalization, and validation. |
| components/studio/registries/locationRegistryUtils.js | 2 | no | no | no | no | presentation | Utility module providing constants, builders, and normalization functions for location registry structure and validation. |
| components/studio/registries/npcRegistryUtils.js | 2 | no | no | no | no | presentation | Utility functions for NPC registry entries including actor ID generation, mechanics profile attachment management, and normalization. |
| components/studio/room-templates/hooks/useMutualPlayers.js | 2 | no | no | no | no | behavior | Fetches list of mutual players following the current user via client library. |
| components/studio/room-templates/hooks/useRoomTemplateReferenceData.js | 2 | no | no | no | no | behavior | Fetches reference data for room templates including characters, scenarios, narrators, and locations. |
| components/studio/room-templates/roomTemplateUtils.js | 2 | no | no | no | no | presentation | Pure utility functions for normalizing and building room template payloads, reference filtering, and scenario recommendation data. |
| components/studio/room-templates/scenario-recommendations-panel | 2 | yes | yes | yes | yes | presentation | Displays scenario recommendations including required/optional characters, locations, and NPC registries with action callbacks. |
| components/studio/storylines/hooks/useStorylineReferenceOptions.js | 2 | no | no | no | no | behavior | Fetches reference data for storylines including available room templates and scenarios. |
| components/studio/storylines/storyline-node-list-editor | 2 | yes | yes | yes | yes | presentation | Renders list editor for storyline nodes with add/remove/reorder capabilities. |
| components/studio/storylines/storyline-open-world-settings | 2 | yes | yes | yes | yes | presentation | Renders editor for storyline open-world settings configuration. |
| components/studio/storylines/storyline-reference-picker | 2 | yes | yes | yes | yes | presentation | Modal for selecting existing storyline references with fixture data support. |
| components/studio/storylines/StorylineReferencePickerModal.jsx | 2 | no | no | no | no | presentation | Wrapper component that delegates to a viewmodel to compose the storyline reference picker modal. |
| components/studio/ui/responsive-filter-panel | 2 | yes | yes | yes | yes | presentation | Responsive filter panel that toggles visibility on mobile and desktop independently |
| components/studio/usePersistentViewMode.js | 2 | no | no | no | no | presentation | Hook that persists view mode preference (grid/list) to browser localStorage with responsive defaults. |
| components/studio/view-mode-toggle | 2 | yes | no | yes | yes | presentation | Renders toggle buttons to switch between grid and list view modes. |
| components/InsertedStory.jsx | 1 | no | no | no | no | presentation | Renders a styled inserted story section with eyebrow, title, and body content. |
| components/LoreArcAccordion.jsx | 1 | no | no | no | no | presentation | Renders expandable accordion sections for lore arcs with timeline cards and localStorage state persistence. |
| components/PaginatedCardGrid.jsx | 1 | no | no | no | no | presentation | Generic reusable grid wrapper with intersection-observer-triggered lazy loading. |
| components/policies/PolicyIndex.jsx | 1 | no | no | no | no | presentation | Renders an index of policy documents as a grid of linked cards |
| components/policies/PolicyPage.jsx | 1 | no | no | no | no | presentation | Renders a single policy document with header, sections, and footer disclaimer |
| components/SiteFooter.jsx | 1 | no | no | no | no | presentation | Renders site footer with navigation links to lore, characters, locations, factions, and legal pages. |
| components/studio/account/studio-account-coins | 1 | yes | yes | yes | yes | behavior | Fetches and displays current coin balance with purchase info modal capability. |
| components/studio/account/studio-account-metrics | 1 | yes | yes | yes | yes | behavior | Fetches and displays studio account metrics including characters, canon, interactions, likes, and images. |
| components/studio/account/studio-account-profile | 1 | yes | yes | yes | yes | behavior | Fetches current studio profile and mutates profile fields including username, display name, contact email, and content preferences. |
| components/studio/character-templates/characterTemplateUtils.js | 1 | no | no | no | no | presentation | Utility module exporting form schemas, field group definitions, and helper functions for character template creation and manipulation. |
| components/studio/characters/characterUtils.js | 1 | no | no | no | no | presentation | Pure utility functions for building character creation payloads and extracting creation responses. |
| components/studio/community/community-hub | 1 | yes | yes | yes | yes | presentation | Filters and displays community creations and creators with support for tags, types, ratings, and sorting. |
| components/studio/community/creator-card | 1 | yes | yes | yes | yes | presentation | Renders a creator profile card with tagline, description, stats, and engagement actions. |
| components/studio/community/creator-list-row | 1 | yes | yes | yes | yes | presentation | Renders a creator as a horizontal list row with stats and engagement action buttons. |
| components/studio/community/CreatorDisplay.js | 1 | no | no | no | no | presentation | Pure utility functions for extracting and formatting creator handle and display name. |
| components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder | 1 | yes | yes | yes | yes | behavior | Creates and saves actor mechanics profiles to the database with bindings and identity metadata. |
| components/studio/create/actor-mechanics-profile/ActorMechanicsProfileBuilderShell.jsx | 1 | no | no | no | no | presentation | Wrapper component that renders the actor mechanics profile builder view and linked creation picker modal. |
| components/studio/create/character-template/character-template-builder | 1 | yes | yes | yes | yes | behavior | Multi-step builder for creating character templates that collects template metadata and character attribute fields, then saves the template via API. |
| components/studio/create/character-template/CharacterTemplateBuilderEditor.jsx | 1 | no | no | no | no | presentation | Form component that renders individual form fields for all character template attributes across appearance, behavior, and identity sections. |
| components/studio/create/character/AppearanceStep.jsx | 1 | no | no | no | no | presentation | Form section for defining character appearance including skin tone, eye color, hair, ethnic heritage reference, and default clothing. |
| components/studio/create/character/BehaviorStep.jsx | 1 | no | no | no | no | presentation | Form section for defining character behavior including personality, speech style, movement style, zodiac signs, verbosity level, interests, and philosophy. |
| components/studio/create/character/BodyStep.jsx | 1 | no | no | no | no | presentation | Form section for defining a character's physical traits including body type, height, build, proportions, and body notes. |
| components/studio/create/character/character-creator | 1 | yes | yes | yes | yes | behavior | Saves character drafts to the database with form data, templates, and progress tracking. |
| components/studio/create/character/character-preview | 1 | yes | yes | yes | yes | presentation | Component that displays character information (name, title, species, gender, clothing style) transformed from form field values into readable labels. |
| components/studio/create/character/character-template-picker | 1 | yes | yes | yes | yes | presentation | Modal that displays and filters built-in character templates for users to apply to their character creation, managing tab and search state locally. |
| components/studio/create/character/CharacterCreatorUtils.jsx | 1 | no | no | no | no | presentation | Reusable presentation utility components for character creator steps including summary items and text fields. |
| components/studio/create/character/CharacterTemplateModal.jsx | 1 | no | no | no | no | presentation | Modal for browsing and applying character templates with search and tabbed interface. |
| components/studio/create/character/constants/form.js | 1 | no | no | no | no | presentation | Default character form field definitions and initial values. |
| components/studio/create/character/IdentityStep.jsx | 1 | no | no | no | no | presentation | Renders identity step for character creation with name, species, gender, and role archetype fields. |
| components/studio/create/character/review-step | 1 | yes | yes | yes | yes | presentation | Renders review step for character creation with summary items, select fields, and advanced options. |
| components/studio/create/create-type-card | 1 | yes | no | yes | yes | presentation | Renders a clickable card for each creation type with title, description, image, and disabled state. |
| components/studio/create/creation-studio | 1 | yes | yes | no | no | behavior | Displays three creation modes (Quick Start, Guided Build, Full Studio) with progress tracking and chapter navigation. |
| components/studio/create/CreationStudioExperience.jsx | 1 | no | no | no | no | behavior | Main experience component that renders the creation studio interface, fetching owned creations from API. |
| components/studio/create/item-registry/item-registry-builder | 1 | yes | yes | yes | yes | behavior | Multi-step builder for creating item registries that manages item entries, starting assignments, and saves the registry via API. |
| components/studio/create/location/location-builder | 1 | yes | yes | yes | yes | behavior | Multi-step builder for creating locations that collects location metadata, sensory environment, runtime modules, and registry attachments, then saves via API. |
| components/studio/create/location/LocationBuilderShell.jsx | 1 | no | no | no | no | behavior | Container component that orchestrates location builder sections and passes props from the location builder view model to child components. |
| components/studio/create/lore/lore-builder | 1 | yes | yes | yes | yes | behavior | Builder for creating lore documents with text editing, rendering preview, JSON editing, and saving via API. |
| components/studio/create/lore/lore-engine-use | 1 | yes | yes | yes | yes | behavior | Displays lore engine use submission status with mode selection, reference selection, status badge, and action buttons; fetches submission state from loreEngineUseClient. |
| components/studio/create/lore/lore-publication-readiness | 1 | yes | yes | yes | yes | behavior | Displays lore validation status with readiness checks, validation badges, error/warning issue lists, and submission/refresh/cancel action buttons; fetches validation state from loreValidationClient. |
| components/studio/create/lore/LoreBuilderShell.jsx | 1 | no | no | no | no | behavior | Container component that orchestrates lore editor and renderer sections with optional JSON editor modal. |
| components/studio/create/mechanics-module/mechanics-module-builder | 1 | yes | yes | yes | yes | behavior | Builder for creating mechanics modules with configurable fields and save functionality via API. |
| components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx | 1 | no | no | no | no | behavior | Container component that renders mechanics module builder with fields section. |
| components/studio/create/narrator/constants.js | 1 | no | no | no | no | presentation | Constants module exporting dropdown options and initial form values for narrator builder fields. |
| components/studio/create/narrator/narrator-builder | 1 | yes | yes | yes | yes | behavior | Builder for creating narrator profiles with tone, pacing, detail level, guidance, and visibility settings, then saves via API. |
| components/studio/create/narrator/NarratorBuilderShell.jsx | 1 | no | no | no | no | behavior | Container component that renders the narrator builder interface from a view model. |
| components/studio/create/npc-registry/npc-registry-builder | 1 | yes | yes | yes | yes | behavior | Builder for creating NPC registries with entry management, relationship rules, knowledge rules, and alias rules, saving to API. |
| components/studio/create/player-character/player-character-creator | 1 | yes | yes | yes | yes | behavior | Multi-step form (Identity, Appearance, Body, Profile, Review) to create a player character draft with save functionality. |
| components/studio/create/progression/progression-profile-builder | 1 | yes | yes | yes | yes | behavior | Form to create and edit a progression profile with validation, profile editor, and draft save. |
| components/studio/create/progression/ProgressionProfileBuilderShell.jsx | 1 | no | no | no | no | presentation | Wrapper component that composes ProgressionProfileBuilder view with its viewmodel. |
| components/studio/create/room-template/constants.js | 1 | no | no | no | no | presentation | Exports form constants: visibility/content rating/room mode options and initial form state. |
| components/studio/create/room-template/room-template-builder | 1 | yes | yes | yes | yes | behavior | Complex builder for room templates with scenario selection, character management, opening messages, and recommendations. |
| components/studio/create/room-template/room-template-package-picker | 1 | yes | yes | yes | yes | presentation | Modal UI for browsing and selecting room template packages during creation. |
| components/studio/create/room-template/RoomTemplateBuilderShell.jsx | 1 | no | no | no | no | presentation | Wrapper component that composes RoomTemplateBuilder with attachments sections and picker modal. |
| components/studio/create/room-template/RoomTemplateFields.jsx | 1 | no | no | no | no | presentation | Exports reusable TextField and TextAreaField form input components. |
| components/studio/create/room-template/roomTemplateUtils.js | 1 | no | no | no | no | presentation | Utility functions for normalizing and processing room template data. |
| components/studio/create/room-template/selected-characters-panel | 1 | yes | yes | yes | yes | presentation | Panel displaying selected characters for the room template with remove actions. |
| components/studio/create/room-template/selection-card | 1 | yes | no | yes | yes | presentation | Card component for displaying and selecting individual room template packages. |
| components/studio/create/rules-codex/rules-codex-builder | 1 | yes | yes | yes | yes | behavior | Form to create and edit a rules codex with validation, section management, and draft save. |
| components/studio/create/rules-codex/RulesCodexBuilderShell.jsx | 1 | no | no | no | no | presentation | Wrapper component that composes RulesCodexBuilder view with its viewmodel. |
| components/studio/create/scenario/constants.js | 1 | no | no | no | no | presentation | Exports UI text constants, story circle step definitions, and form field options for scenario creation. |
| components/studio/create/scenario/scenario-builder | 1 | yes | yes | yes | yes | behavior | Creates scenario drafts and fetches owned creations to populate reference options in a scenario builder form. |
| components/studio/create/scenario/ScenarioBuilderShell.jsx | 1 | no | no | no | no | presentation | Wrapper component that composes ScenarioBuilder view with its viewmodel and reference picker modal. |
| components/studio/create/stats-pools/stats-pools-builder | 1 | yes | yes | yes | yes | behavior | Manages building and saving stats and pools profile definitions with client-side validation and backend persistence. |
| components/studio/create/stats-pools/StatsPoolsBuilderShell.jsx | 1 | no | no | no | no | behavior | Connects a stats pools builder view to its viewmodel, which manages draft creation and validation. |
| components/studio/create/wardrobe/wardrobe-builder | 1 | yes | yes | yes | yes | behavior | Manages wardrobe item editing with local form state and backend draft saving, supporting entry management and outfit selection. |
| components/studio/creations/creation-profile-page | 1 | yes | yes | yes | yes | behavior | Loads and displays creation media with reactions, enabling likes and bookmarks while supporting story launches from creations. |
| components/studio/creations/lore/LorePublicCreationPage.jsx | 1 | no | no | no | no | presentation | Renders a lore publication display from a creation prop with share button and status badges. |
| components/studio/games/games-hub | 1 | yes | yes | yes | yes | behavior | Loads and displays playable games, enabling story template launches and game filtering. |
| components/studio/image-studio/custom-ingredient-editor | 1 | yes | yes | yes | yes | presentation | UI for editing custom prompt text for image studio ingredients with optional preset save action. |
| components/studio/image-studio/FilterPill.jsx | 1 | no | no | no | no | presentation | Renders a styled button pill for filtering media history by type. |
| components/studio/image-studio/hooks/useImageGenerationHistory.js | 1 | no | no | no | no | behavior | Fetches and manages image generation history with pagination, active job polling, and local pending state. |
| components/studio/image-studio/hooks/useImageGenerationJob.js | 1 | no | no | no | no | behavior | Submits image generation jobs to the server and tracks their loading/error state. |
| components/studio/image-studio/hooks/useImageStudioIngredientOptions.js | 1 | no | no | no | no | behavior | Fetches available image studio ingredients (characters, outfits, locations, poses, presets) for ingredient picker. |
| components/studio/image-studio/image-studio-composer | 1 | yes | yes | yes | yes | presentation | Transforms image studio workbench props into UI props for the image/video composition editor. |
| components/studio/image-studio/image-studio-workbench | 1 | yes | yes | yes | yes | behavior | Manages Image Studio workbench state including ingredient selection, custom prompts, image generation job submission, and history. |
| components/studio/image-studio/imageStudioData.js | 1 | no | no | no | no | presentation | Exports ingredient slots and UI option constants for image studio (camera presets, wardrobe themes, aspect ratios). |
| components/studio/image-studio/imageStudioUtils.js | 1 | no | no | no | no | presentation | Utility functions for normalizing and filtering image studio ingredient options. |
| components/studio/image-studio/ingredient-picker | 1 | yes | yes | yes | yes | presentation | Modal UI for browsing and selecting ingredients from saved creations or using custom prompts. |
| components/studio/image-studio/ingredient-slot | 1 | yes | yes | yes | yes | presentation | Renders a single ingredient slot display with title and selection/clear actions. |
| components/studio/image-studio/IngredientPickerModal.jsx | 1 | no | no | no | no | presentation | Wrapper component that renders modal for selecting or creating custom ingredients. |
| components/studio/image-studio/media-history-grid | 1 | yes | yes | yes | yes | behavior | Grid display of generated images with reactions, bookmarks, deletes, and lazy-loading. |
| components/studio/image-studio/save-ingredient-preset | 1 | yes | yes | yes | yes | presentation | Modal UI for naming, describing, and tagging custom image studio ingredient presets. |
| components/studio/image-studio/SaveIngredientPresetModal.jsx | 1 | no | no | no | no | presentation | Wrapper component that renders modal for saving custom ingredient presets with local form state. |
| components/studio/image-studio/video-tools-panel | 1 | yes | yes | yes | yes | presentation | Renders video generation tool options with duration, aspect ratio, and motion style selectors. |
| components/studio/my-creations/creation-edit-media-panel | 1 | yes | yes | yes | yes | presentation | Sidebar panel displaying featured image slots and providing navigation to the image library. |
| components/studio/my-creations/creation-edit-shell | 1 | yes | yes | yes | yes | behavior | Shell component for creation edit UI with section navigation and featured media management. |
| components/studio/my-creations/edit/creation-edit-sticky-action-bar | 1 | yes | yes | yes | yes | presentation | Displays and manages save, publish, and review lifecycle controls for a creation being edited. |
| components/studio/my-creations/edit/creationEditPayloads.js | 1 | no | no | no | no | presentation | Utility functions for building creation edit form fallback state and extracting/merging creation data. |
| components/studio/my-creations/edit/hooks/useCreationEditViewModel.js | 1 | no | yes | no | no | behavior | Manages creation edit form state including field updates, save/archive/delete operations, and featured media slots. |
| components/studio/my-creations/edit/sections/AdvancedSection.jsx | 1 | no | no | no | no | presentation | Thin wrapper that composes CharacterAdvancedSectionView with an AdvancedPromptingEditor control passed as a prop. |
| components/studio/my-creations/edit/sections/AppearanceSection.jsx | 1 | no | no | no | no | presentation | Wrapper that assembles CharacterAppearanceSectionView with skin tone, eye color, hair, visual heritage modals and outfit/wardrobe picker modals. |
| components/studio/my-creations/edit/sections/BehaviorSection.jsx | 1 | no | no | no | no | presentation | Wrapper that assembles CharacterBehaviorSectionView with personality modals, trait modals (MBTI, zodiac, speech/movement style), voice module picker, and interests picker. |
| components/studio/my-creations/edit/sections/BodySection.jsx | 1 | no | no | no | no | presentation | Wrapper that assembles CharacterBodySectionView with Kibbe preset modal, body type/height/build/proportions trait modals. |
| components/studio/my-creations/edit/sections/character-advanced-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for advanced character guidance including greeting, scenario, backstory, relationship to player, and appearance/personality/runtime notes. |
| components/studio/my-creations/edit/sections/character-appearance-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for character appearance including skin tone, eye color, hair, visual heritage, and selected default clothing card with outfit/wardrobe selection. |
| components/studio/my-creations/edit/sections/character-behavior-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for character behavior including personality frameworks, speech style, movement style, voice modules, verbosity level, and philosophy. |
| components/studio/my-creations/edit/sections/character-body-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for character body properties including Kibbe preset, body type, height, build, proportions, and custom body notes. |
| components/studio/my-creations/edit/sections/character-identity-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for character identity including name, title, species, custom species, rendering style, age, gender presentation, color palette, and role archetype. |
| components/studio/my-creations/edit/sections/character-template-fields-section | 1 | yes | yes | yes | yes | presentation | UI for editing character template identity and mechanics profiles. |
| components/studio/my-creations/edit/sections/character-templates/CharacterTemplateFieldsSection.jsx | 1 | no | no | no | no | presentation | Renders character template builder UI for edit mode. |
| components/studio/my-creations/edit/sections/creation-danger-section | 1 | yes | yes | yes | yes | presentation | Renders destructive action panels for archiving or deleting creations with status messages and conditionally gated delete requirements. |
| components/studio/my-creations/edit/sections/creation-overview-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for creation overview including title, public description, and disabled preview button. |
| components/studio/my-creations/edit/sections/creation-publishing-section | 1 | yes | yes | yes | yes | presentation | Renders form fields and action panels for creation publishing including visibility, content rating, template operations, and public/canon review submission. |
| components/studio/my-creations/edit/sections/DangerSection.jsx | 1 | no | no | no | no | presentation | Thin wrapper that composes CreationDangerSectionView with archive and delete confirmation state from viewmodel. |
| components/studio/my-creations/edit/sections/IdentitySection.jsx | 1 | no | no | no | no | presentation | Wrapper that assembles CharacterIdentitySectionView with character color palette modal and role archetype option modal. |
| components/studio/my-creations/edit/sections/image-presets/image-preset-identity-section | 1 | yes | yes | yes | yes | presentation | Maps image preset form data to identity editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/image-presets/image-preset-prompt-stack-section | 1 | yes | yes | yes | yes | presentation | Maps image preset form data to prompt-stack editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/image-presets/image-preset-rendering-notes-section | 1 | yes | yes | yes | yes | presentation | Maps image preset form data to rendering-notes editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/image-presets/image-preset-style-medium-section | 1 | yes | yes | yes | yes | presentation | UI for editing image preset style attributes (medium, art style, artist influence, texture, color palette). |
| components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section | 1 | yes | yes | yes | yes | presentation | UI for editing item registry (inventory/signature objects) identity, entries, and associations. |
| components/studio/my-creations/edit/sections/location-registries/LocationRegistryFieldsSection.jsx | 1 | no | no | no | no | presentation | Renders location registry builder UI for edit mode. |
| components/studio/my-creations/edit/sections/locations/location-identity-section | 1 | yes | yes | yes | yes | presentation | Maps location form data to identity editor section view props and manages parent-location picker state. |
| components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section | 1 | yes | yes | yes | yes | presentation | Maps location form data to prompt-guidance editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section | 1 | yes | yes | yes | yes | presentation | Maps location form data to scene and atmosphere editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/locations/location-visual-description-section | 1 | yes | yes | yes | yes | presentation | Maps location form data to visual-description editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/narrators/narrator-guidance-section | 1 | yes | yes | yes | yes | presentation | UI for editing narrator guidance (system prompt, character voice, narrative instructions). |
| components/studio/my-creations/edit/sections/narrators/narrator-identity-section | 1 | yes | yes | yes | yes | presentation | UI for editing narrator identity (name, description, visual identity). |
| components/studio/my-creations/edit/sections/narrators/narrator-modules-section | 1 | yes | yes | yes | yes | presentation | UI for selecting narrator module preferences (prose style, pacing, dialogue, knowledge, atmosphere). |
| components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section | 1 | yes | yes | yes | yes | presentation | UI for editing NPC registry entries, relationships, knowledge rules, and aliases. |
| components/studio/my-creations/edit/sections/outfits/outfit-garment-design-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for outfit garment design properties including silhouette, fit, coverage, style language, and clothing pieces. |
| components/studio/my-creations/edit/sections/outfits/outfit-identity-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for outfit identity metadata including name, type/category, intended use, and tags. |
| components/studio/my-creations/edit/sections/outfits/outfit-materials-details-section | 1 | yes | yes | yes | yes | presentation | Renders form fields for outfit material properties including main colors, accent colors, materials, accessories, and armor notes. |
| components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section | 1 | yes | yes | yes | yes | presentation | Maps outfit form data to prompt-guidance editor section view props with clothing-mode options and update callbacks. |
| components/studio/my-creations/edit/sections/OverviewSection.jsx | 1 | no | no | no | no | presentation | Thin wrapper that composes CreationOverviewSectionView with creation title and description state from viewmodel. |
| components/studio/my-creations/edit/sections/poses/pose-body-position-section | 1 | yes | yes | yes | yes | presentation | Maps pose form data to body-position editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/poses/pose-identity-section | 1 | yes | yes | yes | yes | presentation | Maps pose form data to identity editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/poses/pose-motion-staging-section | 1 | yes | yes | yes | yes | presentation | Maps pose form data to motion and staging editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/poses/pose-prompt-guidance-section | 1 | yes | yes | yes | yes | presentation | Maps pose form data to prompt-guidance editor section view props and update callbacks. |
| components/studio/my-creations/edit/sections/PublishingSection.jsx | 1 | no | no | no | no | presentation | Thin wrapper that composes CreationPublishingSectionView with publishing and review state from viewmodel. |
| components/studio/my-creations/edit/sections/room-templates/room-template-identity-section | 1 | yes | yes | yes | yes | presentation | UI for editing room template identity (title, description, mode, player character mode, tags). |
| components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section | 1 | yes | yes | yes | yes | presentation | UI for editing room template multiplayer settings (group dynamics, narrative flow). |
| components/studio/my-creations/edit/sections/room-templates/room-template-opening-section | 1 | yes | yes | yes | yes | presentation | UI for editing room template opening narration and initial narrative state. |
| components/studio/my-creations/edit/sections/room-templates/room-template-package-section | 1 | yes | yes | yes | yes | presentation | UI for selecting and managing room template packages (thematic collections). |
| components/studio/my-creations/edit/sections/room-templates/room-template-runtime-section | 1 | yes | yes | yes | yes | presentation | UI for editing room template runtime behavior (knowledge rules, travel rules, mechanics modules). |
| components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section | 1 | yes | yes | yes | yes | presentation | UI for editing story/room template narrator, narrative guidance, and runtime configuration. |
| components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section | 1 | yes | yes | yes | yes | behavior | UI for selecting scenario cast requirements (character roles) and registry bindings (factions, organizations). |
| components/studio/my-creations/edit/sections/scenarios/scenario-identity-section | 1 | yes | yes | yes | yes | presentation | UI for editing scenario identity (name, description, continuity, tags). |
| components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section | 1 | yes | yes | yes | yes | presentation | UI for managing scenario middleware modules and runtime modifications. |
| components/studio/my-creations/edit/sections/scenarios/scenario-runtime-guidance-section | 1 | yes | yes | yes | yes | presentation | UI for editing scenario runtime guidance and narrator instructions. |
| components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section | 1 | yes | yes | yes | yes | presentation | UI for editing scenario's story circle (exposition, rising action, climax, etc). |
| components/studio/my-creations/edit/sections/storylines/storyline-fields-section | 1 | yes | yes | yes | yes | presentation | UI for editing storyline overview, chapters, and branching scenarios. |
| components/studio/my-creations/edit/sections/structured-registries/StructuredRegistryFieldsSection.js | 1 | no | no | no | no | presentation | Renders structured registry (faction, organization) builder UI for edit mode. |
| components/studio/my-creations/edit/sections/visual-references-section | 1 | yes | yes | yes | yes | behavior | UI for selecting anime and realistic reference images from creation's image library. |
| components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section | 1 | yes | yes | yes | yes | presentation | UI for editing wardrobe identity, outfit entries, and selection rules. |
| components/studio/my-creations/image-library/creation-featured-image-picker | 1 | yes | yes | yes | yes | behavior | Modal interface for browsing and selecting featured images from a creation's image library. |
| components/studio/my-creations/image-library/creation-image-library-page | 1 | yes | yes | yes | yes | behavior | Full-page library of a creation's images with filtering, pagination, likes/bookmarks, and deletion. |
| components/studio/my-creations/image-library/creation-reference-image-picker | 1 | yes | yes | yes | yes | behavior | Modal UI for browsing and selecting eligible images from creation's image library as visual references. |
| components/studio/my-creations/image-library/CreationFeaturedImagePickerModal.jsx | 1 | no | no | no | no | behavior | Modal interface for browsing and selecting featured images from a creation's image library. |
| components/studio/my-creations/image-library/CreationReferenceImagePickerModal.jsx | 1 | no | no | no | no | presentation | Wrapper component that renders reference image picker modal. |
| components/studio/my-creations/my-creations-hub | 1 | yes | yes | yes | yes | behavior | Main hub displaying a searchable, filterable grid of owned creations with engagement indicators. |
| components/studio/official-characters-grid | 1 | yes | yes | yes | yes | presentation | Searchable grid displaying official Crestfall characters with name, faction, and tag filtering. |
| components/studio/profile/profile-back-button | 1 | yes | yes | yes | yes | presentation | Navigation button that goes back in history or routes to a fallback destination. |
| components/studio/profile/profile-banner | 1 | yes | no | yes | yes | presentation | Renders profile banner image or placeholder with optional compact height styling. |
| components/studio/profile/profile-follow-button | 1 | yes | yes | yes | yes | behavior | Button to toggle follow state for a profile with loading and error states. |
| components/studio/profile/profile-media-manager | 1 | yes | yes | yes | yes | presentation | Placeholder UI for managing profile media selection (avatar and banner) with deferred functionality. |
| components/studio/profile/profile-share-button | 1 | yes | yes | yes | yes | presentation | Button to copy a profile URL to clipboard with success/failure feedback. |
| components/studio/profile/public-profile-activity-feed | 1 | yes | yes | yes | yes | presentation | Renders a timeline feed of creation releases and donation activities |
| components/studio/profile/public-profile-badges | 1 | yes | yes | yes | yes | presentation | Renders a grid of achievement badges with optional empty state |
| components/studio/profile/public-profile-creation-grid | 1 | yes | yes | yes | yes | presentation | Renders a grid layout of creation cards with engagement message and empty state |
| components/studio/profile/public-profile-donate-button | 1 | yes | yes | yes | yes | behavior | Modal interface for donating coins to a profile with amount input and balance checking. |
| components/studio/profile/public-profile-engagement-actions | 1 | yes | yes | yes | yes | behavior | Action row for liking, bookmarking, and following a profile with engagement state. |
| components/studio/profile/public-profile-hero | 1 | yes | yes | yes | yes | presentation | Profile header section displaying avatar, bio, follower counts, and engagement action slots. |
| components/studio/profile/public-profile-tabs | 1 | yes | yes | yes | yes | presentation | Tab navigation for profile sections displaying creations, activity feed, and badges. |
| components/studio/registries/hooks/useNpcRegistryEditor.js | 1 | no | no | no | no | behavior | Manages NPC registry editing with character option loading and entry/relationship/knowledge/alias draft management. |
| components/studio/room-templates/BuilderSection.jsx | 1 | no | no | no | no | presentation | Layout component that wraps builder section content with eyebrow, title, body, and children slots. |
| components/studio/room-templates/invited-players-panel | 1 | yes | yes | yes | yes | presentation | Displays a panel of invited players with avatars and remove buttons. |
| components/studio/room-templates/opening-message-card | 1 | yes | yes | yes | yes | presentation | Renders and manages editable opening message cards with speaker and body text fields. |
| components/studio/room-templates/room-template-picker | 1 | yes | yes | yes | yes | presentation | Modal for picking characters, scenarios, narrators, or locations with search and recommended item highlighting. |
| components/studio/room-templates/room-template-summary | 1 | yes | yes | yes | yes | presentation | Renders a summary row display of characters, scenario, narrator, and location selections. |
| components/studio/room-templates/RoomTemplateFields.jsx | 1 | no | no | no | no | presentation | Exports reusable TextField and TextAreaField form input components. |
| components/studio/room-templates/RoomTemplatePickerModal.jsx | 1 | no | no | no | no | presentation | Wrapper component that composes RoomTemplatePickerModal view with its viewmodel. |
| components/studio/room-templates/selected-characters-panel | 1 | yes | yes | yes | yes | presentation | Displays selected characters in a panel with remove buttons and character picker trigger. |
| components/studio/room-templates/selection-card | 1 | yes | no | yes | yes | presentation | Renders a clickable card button for selecting an item with optional icon and subtitle. |
| components/studio/story-rooms/hooks/useStoryRoomChat.js | 1 | no | no | no | no | behavior | Manages story room state including messages, participants, and NPC registry; fetches room data and sends messages via storyRoomClient |
| components/studio/story-rooms/story-room-cast-panel | 1 | yes | yes | yes | yes | presentation | Renders featured media, room title, narrator info, cast member cards, and action buttons for player character and deletion |
| components/studio/story-rooms/story-room-chat-shell | 1 | yes | yes | yes | yes | presentation | Renders the main layout container for a story room with panels and composer area; behavior_signal true but contains only UI layout logic |
| components/studio/story-rooms/story-room-composer | 1 | yes | yes | yes | yes | presentation | Renders message input textarea with autocomplete suggestions for mentions, commands, and locations; desktop and mobile variants |
| components/studio/story-rooms/story-room-message | 1 | yes | yes | yes | yes | presentation | Renders a single story room message with speaker info, body content, and delivery status |
| components/studio/story-rooms/story-room-mobile-drawer | 1 | yes | no | yes | yes | presentation | Renders a full-screen modal drawer container for mobile views |
| components/studio/story-rooms/story-room-npc-participant-manager | 1 | yes | yes | yes | yes | presentation | Renders an expandable panel for managing registry-based NPCs with load/unload actions |
| components/studio/story-rooms/story-room-runtime-mechanics-panel | 1 | yes | yes | yes | yes | presentation | Renders a panel for managing runtime mechanics module attachment to a story room |
| components/studio/story-rooms/story-room-state-panel | 1 | yes | yes | yes | yes | presentation | Renders a sidebar panel displaying chronicle state data organized in collapsible sections |
| components/studio/story-rooms/story-room-transcript | 1 | yes | yes | yes | yes | presentation | Renders scrollable message list with load-earlier button and status indicators; uses local state for pagination |
| components/studio/story-rooms/story-rooms-hub | 1 | yes | yes | yes | yes | presentation | Renders a story rooms library with search, filtering, grid/list view modes, manage mode for bulk deletion |
| components/studio/storylines/storyline-builder-shell | 1 | yes | yes | yes | yes | behavior | Manages storyline creation with reference loading and draft persistence to the backend. |
| components/studio/storylines/storylines-hub | 1 | yes | yes | yes | yes | presentation | Renders a collection of storyline cards with create button, loading and empty states |
| components/studio/studio-action-card | 1 | yes | no | yes | yes | presentation | Navigation card for studio actions rendering as a Next.js Link to a destination. |
| components/studio/studio-character-card | 1 | yes | yes | yes | yes | presentation | Card component displaying character preview with image, title, eyebrow, and description. |
| components/studio/studio-coming-soon | 1 | yes | no | yes | yes | presentation | Renders a placeholder section for features in development with title and item list |
| components/studio/templates/character-template-gallery | 1 | yes | no | yes | yes | presentation | Renders a gallery of character templates with sidebar info and disabled action buttons |
| components/TimelineCard.jsx | 1 | no | no | no | no | presentation | Renders a single timeline card for lore entries with era, realm, and title information. |
| components/content/EntryCard.jsx | 0 | no | no | no | no | presentation | Empty file with no implementation |
| components/PageShell.jsx | 0 | no | no | no | no | presentation | Renders a page wrapper with header and centered content container |
| components/PublicHomeFooter.jsx | 0 | no | no | no | no | presentation | Renders footer with brand description and navigation links to legal pages |
| components/SectionHeader.jsx | 0 | no | no | no | no | presentation | Renders a section header with optional eyebrow, title, and descriptive text |
| components/SourebookPanel.jsx | 0 | no | no | no | no | presentation | Renders a sidebar panel with eyebrow, heading, and rich text content |
| components/studio/character-templates/hooks/useCharacterTemplateBuilder.js | 0 | no | no | no | no | presentation | Wrapper hook that exports step definitions and adapts the character template builder view model |
| components/studio/characters/hooks/useCharacterCreator.js | 0 | no | no | no | no | presentation | Compatibility adapter hook that wraps character creator view model and flattens props for legacy callers |
| components/studio/create/RegistryStubPanel.jsx | 0 | no | no | no | no | presentation | Renders a stub panel for planned registry builders with focus areas and coming-soon button |
| components/studio/create/room-template/BuilderSection.jsx | 0 | no | no | no | no | presentation | Renders a section container for builder forms with eyebrow, title, description, and children |
| components/studio/create/room-template/InvitedPlayersPanel.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders invited players list |
| components/studio/create/room-template/OpeningMessageCard.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders opening message editor |
| components/studio/create/room-template/RoomTemplatePickerModal.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders modal for selecting room templates |
| components/studio/create/room-template/RoomTemplateSummary.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders summary view of room template |
| components/studio/create/room-template/ScenarioRecommendationsPanel.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders scenario recommendations |
| components/studio/create/wardrobe/hooks/useWardrobeBuilder.js | 0 | no | no | no | no | presentation | Adapter hook that wraps wardrobe builder view model and exports data management functions |
| components/studio/my-creations/CreationReferenceImagePickerModal.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders modal for picking reference images |
| components/studio/my-creations/edit/creationEditLifecycle.js | 0 | no | no | no | no | presentation | Empty file with no implementation |
| components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders modal for configuring trackers module |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline | 0 | yes | yes | yes | yes | presentation | Renders a development-only inventory of frozen document shapes and replacement boundaries for mechanics modules |
| components/studio/my-creations/edit/sections/mechanics-modules/mechanics-saved-asset-migration/mechanicsSavedAssetMigration.js | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely utility for migrating saved mechanics assets |
| components/studio/my-creations/edit/sections/MediaSection.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders media editing section |
| components/studio/my-creations/edit/sections/VisualAssetPromptSection.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders prompt editor for visual assets |
| components/studio/my-creations/edit/sections/VisualAssetSettingsSection.jsx | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely renders settings editor for visual assets |
| components/studio/navigation-portability/NavigationPortability.targets.mjs | 0 | no | no | no | no | presentation | Exports a data structure defining component navigation targets with view, shell, and preview paths |
| components/studio/registries/hooks/useItemRegistryBuilder.js | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely hook for building item registry |
| components/studio/registries/hooks/useNpcRegistryBuilder.js | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely hook for building NPC registry |
| components/studio/room-templates/hooks/useRoomTemplateBuilder.js | 0 | no | no | no | no | presentation | Not examined; based on naming and import pattern, likely hook for building room templates |
| components/studio/story-rooms/StoryRoomMobileToolbar.jsx | 0 | no | no | no | no | presentation | Renders mobile toolbar with room info and buttons to open cast and state panels |
| components/studio/storylines/hooks/useStorylineBuilderViewModel.js | 0 | no | yes | no | no | presentation | Re-exports storyline builder view model and utilities from storyline-builder-shell |
| components/studio/storylines/hooks/useStorylinesHubViewModel.js | 0 | no | yes | no | no | presentation | Re-exports storylines hub view model and utilities from storylines-hub subdirectory |
