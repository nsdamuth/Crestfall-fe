# Location Builder LOOM Feature

## Boundary

```text
LocationBuilderShell                    Binding Shell
        ↓
useLocationBuilderViewModel             ViewModel / Chassis
        ↓
LocationBuilderView                     Portable View / Skin
        ↓
locationClient → creationClient         Existing frontend client boundary
```

## Preserved behavior

The conversion preserves the current Create Location workflow:

- private or unlisted draft creation;
- identity, description, tags, content rating, and rendering style;
- location guidance, standalone image prompt, and negative prompt;
- scale, space type, and mood classification;
- sensory-environment authoring;
- parent-location selection and clearing;
- weather, time/calendar, knowledge, and travel inheritance flags;
- runtime-module bindings;
- Event, Quest, NPC, Item, Location, Faction, and Organization Registry links;
- placeholder cover candidate selection;
- redirect to Creation Edit after a successful save.

The stored creation remains a `LOCATION` with `builder: LOCATION_BUILDER` and
keeps the existing compatibility fields used by Creation Edit and runtime
hydration.

## Application-owned slots

The portable View does not import application Binding Shells. The thin parent
Shell injects:

- `LocationSensoryEnvironmentFields`;
- `LocationRuntimeModulesSection`;
- `LocationRegistryAttachmentsSection`;
- `LocationParentPickerModal`.

This keeps those integrated application behaviors outside the portable skin
while preserving their existing props and save semantics.

## Preview

The development-only route is:

```text
/dev/ui-preview/location-builder
```

It renders fixtures directly and does not create database records, load
registries, or query parent locations.
