# V2 Home, live restoration

`/studio/v2/home` is restored as the main signed-in guidepost. It is not the
creation workspace: `/studio` remains authoritative for Quick Start, Guided
Build and Full Studio.

## Composition (contract 4.0.0, Home fine-tuning batch 1, 6 Sep 2026)

1. Continue/cold-start hero (Eden confrontation art on cold start).
2. One list per sidebar section, in sidebar order: Stories, Adventures,
   Studio, Images, Vault, Community, Creators, Lore. Each list has its own
   Sort control (Most plays, Most likes, Most saved, Newest) and offers only
   the options its data carries; a list with no items renders nothing.
   Studio and Images have no list data source anywhere in the app today and
   are reported as data gaps.
3. Bottom banner routing to the next section in the journey loop (Stories).

## Live sources

Home intentionally composes existing sources rather than adding a monolithic
Home API. Every list reads the same data its section page reads:

- `getStoriesPageData()`: active Stories in progress plus the owned and
  Community creation sources (Stories, Adventures, Vault, Community lists)
- `getCommunityCreatorsPageData()`: creator discovery plus viewer follow
  context (Creators list)
- `getLoreV2PageData()`: public lore publications plus owned lore (Lore list)
- `projectStoryRoomToContinueItem()`: Continue hero
- `projectCreationsToStoryStartables()`, `projectCommunityCreations()`,
  `projectCreationsToVaultItems()`, `projectPublicLoreCreations()`,
  `projectOwnedLoreCreations()`, `projectCommunityCreators()`: list
  projections
- `useCreationEngagementState()`: persisted Like/Save state
- `setProfileFollowByUsername()`: persisted Follow state

Sorting is client side on every list; no section page sorts on the server
(CR-042 remains open).

No backend or persistence authority moves into the Home View.

## Navigation

Home returns as the first item under PLAY on desktop and mobile. The Crestfall
Studio brand link also returns to Home on V2 surfaces. `/studio` remains under
CREATE as `Studio`.
