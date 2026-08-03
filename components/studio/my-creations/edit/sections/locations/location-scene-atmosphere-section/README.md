# Location Scene / Atmosphere Section LOOM package

## Portable LOOM boundary

`LocationSceneAtmosphereSection.view.jsx` is the portable Skin. It renders display-ready scene and atmosphere fields and emits semantic callbacks. It does not receive the Creation Edit `form`, inspect JSONB, normalize legacy fields, or persist data.

`useLocationSceneAtmosphereSectionViewModel.js` is the Chassis. It normalizes the Location payload and maps edits to the established Creation data fields:

- `mood`
- `lighting`
- `time_of_day`
- `weather`
- `activity_level`
- `population_presence`
- `sensory_notes`
- `sensoryProfile`

Historical payload compatibility is preserved for reads:

- `atmosphere` falls back into the displayed Mood / Atmosphere value when `mood` is absent.
- `conditions` falls back into the displayed Weather / Conditions value when `weather` is absent.
- `sensory_profile` falls back into the structured sensory editor when `sensoryProfile` is absent.

Edits continue writing only to the established canonical fields, matching the previous component behavior.

`LocationSceneAtmosphereSection.jsx` is the thin Binding Shell. It owns composition of `LocationSensoryEnvironmentFields` and supplies that application-integrated editor to the portable View through `sensoryEnvironmentSlot`.

## Development preview

Open:

`/dev/ui-preview/location-scene-atmosphere-section`

The route is unavailable in production and renders fixture-driven complete, legacy-fallback, sparse, and empty states without hydrating or saving a Creation.

## Focused diagnostics

Run:

`npm run diagnostics:loom:location-scene-atmosphere-section`
