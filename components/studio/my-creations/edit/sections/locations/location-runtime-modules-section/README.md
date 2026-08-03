# Location Runtime Modules Section

## Portable LOOM boundary

`LocationRuntimeModulesSection.jsx` is the application Binding Shell. It owns composition with the existing Mechanics, Registry Attachments, and Weather application components.

`LocationRuntimeModulesSection.view.jsx` is the portable Skin. It renders the section introduction, a visible Weather card, semantic composition slots, and the Time / Calendar controls. It does not receive a Creation form, inspect JSONB, perform engine-module requests, or persist values.

`useLocationRuntimeModulesSectionViewModel.js` is the Chassis. It owns:

- `engine_module_bindings` normalization and writes
- Weather binding discovery, enable/disable state, and modal-open orchestration
- the saved Weather-module binding callback path
- Time / Calendar binding discovery and upsert behavior
- legacy camelCase and snake_case calendar-profile reads
- canonical `data.calendarProfile` writes
- default profile values and display labels
- inheritance-mode and calendar-authority mapping
- numeric fallback behavior

## Visible Weather integration

The portable View now renders an **In-World Weather** card between Mechanics and Time / Calendar. The card shows the Weather binding status and bound module title, exposes **Configure Weather** or **Edit Weather**, and allows an existing Weather binding to be enabled or disabled.

The application-owned `WeatherModuleConfigModal` is still mounted exactly once by the Binding Shell. Saving the modal writes the resulting `core.inWorldWeather.v1` binding back through `updateDataField("engine_module_bindings", ...)`; the normal Location save remains responsible for persisting that binding with the Location.

## Preserved application composition

The Binding Shell injects exactly one of each:

- `RuntimeMechanicsModulesSection`
- `LocationRegistryAttachmentsSection`
- `WeatherModuleConfigModal`

This hotfix does not decompose Mechanics Module editing or move Weather API work into the portable View.

## Preview

Development only:

`/dev/ui-preview/location-runtime-modules-section`

The preview renders fixture-driven Weather and calendar states with inert stand-ins for the application-owned Mechanics and Registry composition slots.

## Diagnostics

```bash
npm run diagnostics:loom:location-runtime-modules-section
```
