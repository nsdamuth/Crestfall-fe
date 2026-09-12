# MOBILE-SHELLS, Part 1 inventory

Package MOBILE-SHELLS, branch fe/css, base d1674e07. Read-only survey
completed before any edit, per gate G1.

Breakpoint: `md` = `48rem` (768px), Tailwind v4 default. No
`--breakpoint-*` override exists in `app/globals.css` (`@theme inline`
at line 25 declares only color and font tokens), so the framework
default in `node_modules/tailwindcss/theme.css:328` is the authority.
Every rule below applies at every width under 768px.

Gutter: `var(--space-5)` (20px) per side. It lives at one place for
signed-in routes, `components/studio/studio-shell/StudioShell.view.jsx:24`,
and is duplicated for the signed-out gate at `app/studio/layout.js:47`.

Reference viewport: 390 by 844. Content box at that width is 350px.

## Route to shell map

Every route under `app/studio` renders through one layout,
`app/studio/layout.js:103`, into `StudioShell` and
`components/studio/studio-shell/StudioShell.view.jsx`. There is no
nested layout file anywhere under `app/studio`, so no route opts out at
the router level. Two route families opt out inside the shell through
`components/studio/studio-shell/studioShellPathPolicy.js:1`: the story
chat paths `/studio/story-rooms/[id]/**` and
`/studio/v2/stories/[id]/**` suppress the bottom dock and its 96px
reserve.

## Inventory table

| Shell | Routes | file:line | Declaration | Why it overflows or holds fixed layout below md |
|---|---|---|---|---|
| StudioShell.view | all /studio | components/studio/studio-shell/StudioShell.view.jsx:24 | `min-w-0 w-full flex-1 px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]` | The single content column for every route. No x-clamp, no scroll container. Any child wider than 350px scrolls the document body. |
| StudioShell.view | all /studio | components/studio/studio-shell/StudioShell.view.jsx:16 | `flex min-h-screen` | Root flex row, no wrap. Safe only because the sidebar is hidden below lg. |
| StudioTopBar.view | all /studio | components/studio/studio-top-bar/StudioTopBar.view.jsx:35 | `sticky top-0 flex w-full ... px-[var(--space-5)]` | Width is 100% already, gate 8 satisfied. Flex row with no wrap: three shrink-0 44px controls plus gaps and gutters take 208px of the 390. |
| StudioTopBar.view | all /studio | components/studio/studio-top-bar/StudioTopBar.view.jsx:51 | `ml-auto w-full max-w-[26rem]` on the search slot | Flex item with no `min-w-0` of its own. Shrinks only because the inner input carries `min-w-0`. |
| StudioSidebar.view | all /studio, painted at lg and up | components/studio/studio-sidebar/StudioSidebar.view.jsx:97 | `w-56` unconditional | 224px fixed track held by a bare `hidden`, not scoped to lg. The only unconditional fixed layout width in the chrome. |
| StudioSidebar.view | all /studio | components/studio/studio-sidebar/StudioSidebar.view.jsx:258, 277, 287, 324, 342 | `h-[var(--control-sm)] w-[var(--control-sm)]` | Five interactive icon links at 32px, under the 44px floor, with no coarse pointer bump. |
| StudioSidebar.view | all /studio | components/studio/studio-sidebar/StudioSidebar.view.jsx:357, 370 | logout and Terms links, no `min-h` | Interactive text links about 16px tall. |
| StudioMobileNav.view | all /studio below lg | components/studio/studio-mobile-nav/StudioMobileNav.view.jsx:125 | `w-[min(20rem,86vw)]` drawer | 320px at 390 viewport. Clamped by 86vw so it never exceeds the viewport. Inner box 296px. |
| StudioMobileNav.view | all /studio below lg except story chat | components/studio/studio-mobile-nav/StudioMobileNav.view.jsx:269 | `fixed bottom-0 left-0 right-0 grid grid-cols-5` | Five tracks at every width below lg. Tracks are `minmax(0,1fr)` so they shrink, but tiles carry no `min-w-0` or truncate, so a long label sets the floor and pushes the fixed bar past the viewport. |
| StudioMobileNav.view | all /studio below lg | components/studio/studio-mobile-nav/StudioMobileNav.view.jsx:370, 383 | `h-[var(--control-sm)] w-[var(--control-sm)]` | Two 32px interactive links on a phone-only surface. |
| StudioMobileNav.view | all /studio below lg | components/studio/studio-mobile-nav/StudioMobileNav.view.jsx:208, 402, 410, 472 | buttons and links with no `min-h` | Four interactive targets between 16px and 40px. |
| StudioPageHeader.view | every page that renders it | components/studio/studio-page-header/StudioPageHeader.view.jsx:38 | `flex flex-col ... lg:flex-row` | Already single column below lg. This is the pattern the other shells lack. |
| StudioPageHeader.view | same | components/studio/studio-page-header/StudioPageHeader.view.jsx:49 | h1 `text-[length:var(--text-title)]`, 33px, no wrap guard | No mobile type pair and no `overflow-wrap`. A long unbroken title overflows the 350px box. |
| StudioPageHeader.view | same | components/studio/studio-page-header/StudioPageHeader.view.jsx:60 | actions slot `shrink-0` | Cannot compress. Safe below lg only because the parent is a column there. |
| layout gate | all /studio signed out | app/studio/layout.js:65 | `text-[clamp(2.5rem,7vw,5rem)]` h1 | 40px floor with no wrap guard in a 342px text box. |
| StorylineBuilderShell.view | /studio/create/storyline | components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx:38 | `grid gap-6 xl:grid-cols-[0.34fr_1fr]` with children at :39 and :137 carrying no `min-w-0` | KNOWN FAILURE 1 enabling declaration. The implicit base column is floored at subtree min-content, measured 352px against 350px available. |
| StorylineNodeListEditor.view | /studio/create/storyline | components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx:195 | `flex gap-2`, no wrap, no `min-w-0` on the dropdown wrapper at :196 | KNOWN FAILURE 1 root cause, outside the shell file, inside the node editor the shell renders. Pairs a dropdown trigger with a nowrap `cf-btn`. Forcing wrap on this row drops the floor from 352 to 350. |
| StorylineNodeListEditor.view | /studio/create/storyline | components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx:230, 245 | bare inputs with no `min-w-0` | UA intrinsic width near 198px each establishes a 344px floor on its own. |
| ActorMechanicsProfileBuilder.view | /studio/create/actor-mechanics-profile, /studio/create/mechanics-loadout by redirect | components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view.jsx:61 | `mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]` with children at :62 and :124 carrying no `min-w-0` | KNOWN FAILURE 2 enabling declaration. Measured min-content floor 895px against 350px available. Setting `min-width:0` on the two children drops it to 224px. |
| SharedFields TextAreaField | every create route that renders a collapsed textarea | components/studio/my-creations/edit/sections/SharedFields.jsx:328 | `min-w-0 flex-1 truncate` preview span | KNOWN FAILURE 2 root cause, outside the shell. `truncate` expands to `whitespace-nowrap`, so the span min-content equals the whole single-line value, measured 819px. Three instances feed this route: ActorMechanicsProfileBuilder.view.jsx:141, ActorMechanicsProfileEditor.view.jsx:383, ActorMechanicsProfileEditor.view.jsx:578. |
| Create builder shells, shared defect | 22 create routes | ActorMechanicsProfileBuilder.view.jsx:61, StorylineBuilderShell.view.jsx:38, TimelineBuilder.view.jsx:236, RoomTemplateBuilder.view.jsx:62, ScenarioBuilder.view.jsx:29, AssetBuilder.view.jsx:52, LocationBuilder.view.jsx:46, LoreBuilder.view.jsx:47, RulesCodexBuilder.view.jsx:61, ProgressionProfileBuilder.view.jsx:62, StatsPoolsBuilder.view.jsx:61, MechanicsModuleBuilder.view.jsx:68, NarratorBuilder.view.jsx:66, MechanicsActionSetBuilderShell.jsx:40, MechanicsActionBuilderShell.jsx:67, CharacterCreator.view.jsx:93, CharacterTemplateBuilder.view.jsx:46, StructuredRegistryBuilder.view.jsx:306, ItemRegistryBuilder.view.jsx:316, WardrobeBuilder.view.jsx:278, NpcRegistryBuilder.view.jsx:57, LocationRegistryBuilder.view.jsx:108 | root `grid ... xl:grid-cols-[...]` with no `min-w-0` or `minmax(0,...)` on either child | The single systemic cause. At base the grid is one column sized by `min-width:auto`, so any nowrap descendant becomes the page scroll width. |
| NpcRegistryBuilder.view, LocationRegistryBuilder.view | /studio/create/npc-registry, /studio/create/location-registry | NpcRegistryBuilder.view.jsx:57, LocationRegistryBuilder.view.jsx:108 | `xl:grid-cols-[1fr_380px]` | Hard 380px track. xl scoped, so not a sub-768 failure, but it is the only fixed px track in a create root grid. |
| TimelineBuilder.view | /studio/v2/editor/new?type=TIMELINE, /studio/v2/editor/[id] | components/studio/create/timeline/timeline-builder/TimelineBuilder.view.jsx:85 | `grid shrink-0 gap-2 sm:grid-cols-[12rem_10rem_auto]` | Fixed 192px plus 160px tracks active from 640px, inside md. Worst fixed-track declaration in the package. |
| TimelineBuilder.view | same | components/studio/create/timeline/timeline-builder/TimelineBuilder.view.jsx:49 | checkbox `h-5 w-5` | 20px interactive input. |
| RoomTemplateBuilder.view | /studio/create/room-template, /studio/v2/editor/new?type=ROOM_TEMPLATE | components/studio/create/room-template/room-template-builder/RoomTemplateBuilder.view.jsx:304 | `grid grid-cols-4 gap-2` at base | Four aspect-square tiles at 390px, about 80px each. |
| CharacterCreator.view | /studio/create/character, /studio/create/player-character | components/studio/create/character/character-creator/CharacterCreator.view.jsx:114 | `mt-8 flex items-center justify-between gap-3` | Step nav row, no wrap, no md prefix, holding two or three nowrap `cf-btn` controls. |
| CharacterCreator.view | same | components/studio/create/character/character-creator/CharacterCreator.view.jsx:66 | `mt-5 grid gap-2 sm:grid-cols-4 xl:grid-cols-5` | Four step tiles from 640px, inside md. |
| LoreBuilder.view | /studio/create/lore | components/studio/create/lore/lore-builder/LoreBuilder.view.jsx:102 | `flex gap-2 rounded-xl p-2` tab row | No wrap, no md prefix. |
| Lore.view | /studio/v2/lore | app/studio/v2/lore/lore/Lore.view.jsx:65 | `grid min-h-36 grid-cols-[7rem_1fr]` | Fixed 112px art track at base with no fallback. Text track gets about 206px at 390. |
| Home.view | /studio/v2/home | app/studio/v2/home/home/Home.view.jsx:33 | `absolute left-[var(--space-5)] top-[var(--space-5)]` welcome block | Absolute with a horizontal offset and unconstrained width, over a hero at :22 that has no `overflow-hidden`. A long welcome name paints past the banner right edge. |
| StudioModePanels.view | /studio/v2/studio, /studio | app/studio/v2/studio/studio/StudioModePanels.view.jsx:38 | `min-w-[14rem]` on the progress meter | 224px hard floor on a header aside. |
| StudioModePanels.view | same | app/studio/v2/studio/studio/StudioModePanels.view.jsx:440 | Back button `min-h-[var(--control-sm)]`, no coarse bump | 32px interactive control. |
| Editor.view | /studio/v2/editor/[id] | app/studio/v2/editor/editor/Editor.view.jsx:434 | `fixed bottom-[...] left-[var(--space-3)] right-[var(--space-3)] flex ... lg:hidden` | Existing mobile action bar. Left and right both pinned so it is fluid. Non-wrapping row of three controls in about 326px. This is the closest existing analogue to the sticky action bar this package adds. |
| Editor.view | same | app/studio/v2/editor/editor/Editor.view.jsx:88, 98 | `cf-btn cf-btn--sm` | Two 32px buttons. |
| ImagesV2Live | /studio/v2/images | app/studio/v2/images/ImagesV2Live.jsx:370 | `w-[24rem] flex-none`, hidden below 1100px | 384px fixed panel, correctly suppressed below the breakpoint. |
| StoriesV2Live | /studio/v2/stories | app/studio/v2/stories/StoriesV2Live.jsx:433 | `absolute left-[var(--space-2)] top-[var(--space-2)] h-[var(--control-sm)] w-[var(--control-sm)]` | 32px interactive control, absolutely positioned with a horizontal offset. |
| CreatorsV2Mockup, live shell | /studio/v2/creators | app/studio/v2/creators/CreatorsV2Mockup.jsx:146, 151, 155 | `flex flex-none` pair with `min-w-[7rem]` twice | 224px plus gap inside a box that cannot shrink or wrap. |
| CreatorProfile.view | /studio/v2/creators/[handle] | app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx:44 | tab buttons `min-h-[var(--control-sm)]`, no coarse bump | 32px interactive controls. |
| CreatorProfile.view | same | app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx:245 | checkbox `h-[var(--space-4)] w-[var(--space-4)]` | 16px interactive input. |
| CreatorConnections.view | /studio/v2/creators/[handle]/connections | app/studio/v2/creators/creator-connections/CreatorConnections.view.jsx:36 | `inline-flex w-fit` tablist | Two tabs on one non-wrapping line, widened by live counts. |
| AccountV2Live.view | /studio/v2/account | app/studio/v2/account/account-live/AccountV2Live.view.jsx:565 | `cf-btn cf-btn--secondary cf-btn--sm` | 32px button. |
| AccountSettingsPage | six /studio/v2/account subroutes | app/studio/v2/account/account-settings/AccountSettingsPage.jsx:42 | Back link `min-h-[var(--control-sm)]`, no coarse bump | 32px interactive link on six routes. |
| StoryRoomChatShell.view | /studio/story-rooms/[id], /studio/v2/stories/[id] | components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx:106 | `-mx-[var(--space-5)] -mt-[var(--topbar-h)] ... sm:-mx-[var(--space-8)] lg:mx-0` | The only negative horizontal margins in the chrome path. Deliberate full-bleed, paired one to one with the shell gutter, contained by `overflow-hidden` on the same element, and asserted by storyRoomMobileImmersiveV2Diagnostics.mjs:33 and :36. Compensated, not offending. |
| CommunityHub.view | /studio/community | components/studio/community/community-hub/CommunityHub.view.jsx:112 | tab row, no wrap, no scroller | Compare GamesHub.view.jsx:289 and StoryRoomsHub.view.jsx:305 which use `overflow-x-auto` correctly. |
| PublicProfileTabs.view | /studio/profile/[username] | components/studio/profile/public-profile-tabs/PublicProfileTabs.view.jsx:18, 25 | `flex gap-2 p-1` tab group with no wrap, buttons with no `min-h` | Three tabs near 300px, each about 34px tall. |
| connections page | /studio/profile/[username]/connections | app/studio/profile/[username]/connections/page.js:43 | `flex rounded-xl p-1` tab pair, no wrap | Same pattern. |
| CreationEditShell.view | /studio/my-creations/[id]/edit | components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx:75 | section tabs `px-4 py-2 text-xs`, no `min-h` | About 34px tall. The row itself wraps correctly at :65. |
| CreationEditStickyActionBar.view | /studio/my-creations/[id]/edit | components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.view.jsx:50, 86, 104 | `sticky bottom-4` bar, two `min-h-[var(--control-sm)]` controls | Existing sticky bar, fluid width, with two 32px controls in it. |
| CreationImageLibraryPage.view | /studio/my-creations/[id]/image-library, /studio/v2/editor/[id]/image-library | components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx:191, 520 | `min-h-[var(--control-sm)]`, no coarse bump | 32px interactive controls. |
| Hub shells, shared | /studio/community, /studio/games, /studio/story-rooms, /studio/my-creations | CommunityHub.view.jsx:10, GamesHub.view.jsx:653, StoryRoomsHub.view.jsx:588, MyCreationsHub.view.jsx:110 | filter pills and tabs at `min-h-[var(--control-sm)]` or with no `min-h` | 30px to 34px interactive controls. |
| CreationProfilePage.view | /studio/creations/[id] | components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx:313 | tab button `px-4 py-2 text-xs`, no `min-h` | About 34px. |
| StoryCharacterConfiguration.view | /studio/story-rooms/[id]/character-configuration, /studio/v2/stories/[id]/character-configuration | components/studio/story-rooms/story-character-configuration/StoryCharacterConfiguration.view.jsx:862 | back link, no `min-h` | About 38px. |

## Redirects and re-exports, no shell of their own

- `app/studio/create/page.js:6` redirects to `/studio?mode=full`.
- `app/studio/create/mechanics-loadout/page.js:1` redirects to the actor mechanics profile route.
- `app/studio/create/timeline/page.jsx` and `app/studio/create/timeline/[id]/page.jsx` redirect to `/studio/v2/editor`.
- `app/studio/page.js` re-exports the v2 Studio shell.
- `app/studio/story-rooms/[id]/page.js` and its character configuration sibling are one line bindings.
- The five `app/studio/account/*` stub routes share `components/studio/account/account-stub-page/AccountStubPage.view.jsx`.

## Kit overflow candidates, logged and left

Kit components are not edited by this package.

| file:line | Declaration | Note |
|---|---|---|
| components/kit/dropdown/KitDropdown.view.jsx:209 | `absolute w-max min-w-[13rem] max-w-[19rem]` | 208px floor, 304px ceiling, no viewport clamp. Inert under 700px because useAnchoredPanel swaps in the sheet, live in the 700 to 767 band. |
| components/kit/dropdown/KitDropdown.view.jsx:181 | trigger label `min-w-0 truncate` | The measured min-content driver of known failure 1. |
| components/kit/dropdown/KitDropdown.view.jsx:165 | root `relative inline-flex flex-none` | Forces every consumer to patch width. The one consumer that forgets is StorylineNodeListEditor.view.jsx:195. |
| components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx:1441 | `grid-cols-[8.25rem_minmax(0,1fr)]` at base | 132px fixed label track at every width, reached on /studio/v2/images. |
| components/kit/rail/KitRail.view.jsx:32 | `creator: w-[16rem] min-w-[15rem] max-w-[18rem]` | 256px fixed cell, 240px floor. Inside the `overflow-x-auto` scroller at :161 so it scrolls rather than overflows. |
| components/kit/creation-card/KitCreationCard.view.jsx:206 | `fixed z-[3] w-[12rem]` | 192px menu placed from a computed coordinate, can land off screen at narrow widths. |
| components/kit/image-viewer/KitImageViewer.view.jsx:142 | `min-w-[14rem]` | 224px floor on an absolute menu. |
| components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx:147 | negative horizontal margins paired with the shell gutter | Same compensated full-bleed contract as the chat shell. Filter row is `overflow-x-auto` under 700px at :156. |
| app/design-system.css:492 | `.cf-dropdown { min-width: 13rem }` | 208px floor in the shared menu recipe. |
