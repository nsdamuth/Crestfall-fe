# Room Template Package Section

Portable LOOM boundary for the Story Package section used by Creation Edit.

## Public Shell

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplatePackageSection.jsx
```

The Shell preserves the existing public API:

```jsx
<RoomTemplatePackageSection
  form={form}
  updateDataField={updateDataField}
/>
```

## Responsibilities

### ViewModel

- reads the existing room-template data from `form.data`
- loads creation references through the existing
  `useRoomTemplateReferenceData()` boundary
- does not call `/api/creations` directly
- preserves selected Character, Scenario, Narrator, and Location resolution
- preserves add/remove/toggle behavior for selected characters
- W46 adds saved-edit Story Character lifecycle authoring through the accepted
  `storyCharacterLifecycleAuthoring` helper
- W46 adds saved-edit fixed/player-select opening Location authoring through the
  accepted `storyOpeningLocationAuthoring` helper and picker
- preserves all existing package writes:
  - `selected_characters`
  - `selected_scenario`
  - `scenario_id`
  - `selected_narrator`
  - `narrator_id`
  - `selected_location`
  - `location_id`
  - `scenario_recommendations_dismissed_for`
  - `opening_location`
  - selected-character lifecycle metadata inside `selected_characters`
  - `boundRegistries`
  - `boundRegistryLinks`
- preserves scenario recommendation application, dismissal, and NPC Registry
  merging
- composes the existing child ViewModels for the selected-character panel,
  recommendation panel, and package picker
- preserves the fixed `selected_location` / `location_id` path while suppressing
  that single-location card in `PLAYER_SELECT` mode

### Portable View

- renders the Story Package heading
- composes only child portable Views, never their Binding Shells
- renders display-ready character, recommendation, and selection-card props
- presents reference-load errors
- presents the display-ready package picker
- emits semantic callbacks supplied by the ViewModel

The View does not know creation payloads, room-template JSON fields, API routes,
reference normalization, recommendation merge rules, registry storage, save
behavior, services, PostGraphile, or database semantics.

## Data Boundary

The previous direct request in this section is removed. Reference loading uses
Crestfall's existing path through:

```text
useRoomTemplateReferenceData
→ roomTemplateClient
→ frontend API proxy
→ services-api
→ PostGraphile
→ DB
```

No new client path is introduced by this conversion.

## Preview

```text
/dev/ui-preview/room-template-package-section
```

The preview renders direct View-contract fixtures only and returns `notFound()`
in production.
