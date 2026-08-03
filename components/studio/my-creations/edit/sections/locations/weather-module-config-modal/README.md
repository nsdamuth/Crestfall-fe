# Weather Module Config Modal LOOM package

## Portable LOOM boundary

`WeatherModuleConfigModal.jsx` is the thin Binding Shell. It connects the
application-owned ViewModel to `WeatherModuleConfigModal.view.jsx`.

The View is a portable Skin. It renders normalized module identity, current
weather, weather-library cards, and presentation controls. It does not import
engine-module clients, fetch or persist data, interpret response envelopes, or
construct the runtime payload.

`useWeatherModuleConfigModalViewModel.js` is the Chassis. It owns:

- existing module-instance loading;
- create-versus-update orchestration;
- response-envelope and legacy instance-data normalization;
- recommended and custom weather-condition management;
- allowed, blocked, current, and weighted condition state;
- sensory-note parsing and display mapping;
- canonical `weather_instance_data.v0` payload construction;
- the `get_weather_context` operation trigger; and
- the binding summary returned to Location Edit after save.

The modal remains application-owned by `LocationRuntimeModulesSection`. Saving
this modal persists the Weather module instance immediately; the Location must
still be saved to persist a newly returned module binding.

## Diagnostics

```bash
npm run diagnostics:loom:weather-module-config-modal
```

## Development preview

```text
/dev/ui-preview/weather-module-config-modal
```

The preview is fixture-driven and unavailable in production.

Mechanics Module field decomposition remains outside this package and is still
deferred until the final cumulative reassessment.
