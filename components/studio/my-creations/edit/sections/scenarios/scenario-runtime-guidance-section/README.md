# Scenario Runtime Guidance Section

## Portable LOOM boundary

```text
ScenarioRuntimeGuidanceSection.jsx                  Binding Shell
        ↓
useScenarioRuntimeGuidanceSectionViewModel.js       ViewModel / Chassis
        ↓
ScenarioRuntimeGuidanceSection.view.jsx             Portable View / Skin
```

The portable View owns only the opening/runtime guidance form layout and
semantic text-change callbacks. It does not inspect the Creation form, know
Scenario storage keys, or call persistence helpers.

## Application-owned behavior

The ViewModel reads and writes the existing Scenario fields:

- `form.data.opening_scene`
- `form.data.opening_messages`
- `form.data.private_runtime_guidance`
- `form.data.drift_fixes`
- `form.data.failure_handling`

Persistence remains owned by the standard Creation Edit ViewModel through the
existing `updateDataField` callback.

## Preview

Development-only preview:

```text
/dev/ui-preview/scenario-runtime-guidance-section
```

The preview renders populated, empty, long-copy, and missing-callback states
without loading or saving a Scenario creation.
