# V2 Home — live restoration

`/studio/v2/home` is restored as the main signed-in guidepost. It is not the
creation workspace: `/studio` remains authoritative for Quick Start, Guided
Build and Full Studio.

## Live sources

Home intentionally composes existing sources rather than adding a monolithic
Home API:

- `getStoriesPageData()` — active Story rooms + current Community/owned source
- `getCommunityCreatorsPageData()` — creator discovery + viewer follow context
- `projectStoryRoomToContinueItem()` — Continue hero
- `projectCommunityCreations()` — creation rails
- `projectCommunityCreators()` — creator rail
- `useCreationEngagementState()` — persisted Like/Save state
- `setProfileFollowByUsername()` — persisted Follow state

No backend or persistence authority moves into the Home View.

## Navigation

Home returns as the first item under PLAY on desktop and mobile. The Crestfall
Studio brand link also returns to Home on V2 surfaces. `/studio` remains under
CREATE as `Studio`.
