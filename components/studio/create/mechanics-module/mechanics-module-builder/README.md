# Mechanics Module Builder LOOM Surface

## Public binding

```text
components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx
```

The public Shell preserves the existing import used by the Create Mechanics
Module page. It binds the ViewModel to the portable builder frame and injects
the existing application-owned `MechanicsModuleFieldsSection` into the View's
runtime-fields presentation slot.

## LOOM boundary

```text
MechanicsModuleBuilderShell.jsx
  → useMechanicsModuleBuilderViewModel.js
  → MechanicsModuleBuilder.view.jsx
```

The ViewModel owns:

- identity and mechanics authoring state;
- default tracker-module initialization;
- creation-payload normalization through the shared Mechanics Document Core;
- preservation of unknown forward-compatible Mechanics metadata;
- single-field mechanics updates;
- atomic `replaceData(nextData)` replacement used by preset application;
- save status and error handling;
- client-layer creation calls;
- redirecting to Creation Edit after successful creation.

The portable View owns only JSX, layout, form presentation, runtime-contract
display, save-state presentation, and semantic callback invocation. It does not
import the application mechanics editor or know how mechanics data is persisted.

## Existing mechanics editor boundary

`MechanicsModuleFieldsSection` remains application-owned in this bounded patch.
The Shell injects it through `runtimeFieldsContent` with these controlled props:

```text
form
updateDataField(field, value)
replaceData(nextData)
```

This preserves the existing preset library, live-validation guide, JSON editor,
composition builder, progression tools, and atomic whole-data replacement.
The large fields surface remains a later decomposition target.

## Persistence path

```text
Portable View
→ Mechanics Module Builder ViewModel
→ mechanicsModuleClient.js
→ creationClient.js
→ /api/creations
→ services-api
→ PostGraphile
→ public.creations
```

## Stored contract preserved

The create payload remains `type: MECHANICS_MODULE` and preserves:

- `builder: MECHANICS_MODULE_BUILDER`;
- `builder_version: 0.3`;
- `moduleDefinitionId` and `moduleId`;
- `contractVersion: trackers_instance_data.v0_2` by default;
- priority and operation triggers;
- tags;
- trackers, commands, defaults, status blocks, and guards under
  `data.instanceData`;
- unknown root, operation-trigger, instance-data, and defaults metadata from
  the complete normalized document.

## Preview

```text
/dev/ui-preview/mechanics-module-builder
```

The development-only preview renders the portable frame from fixtures. It uses
a fixture placeholder instead of mounting the application-owned mechanics
fields editor.
