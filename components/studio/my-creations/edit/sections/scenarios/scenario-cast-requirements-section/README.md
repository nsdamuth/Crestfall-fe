# Scenario Cast Requirements Section

## LOOM boundary

```text
ScenarioCastRequirementsSection.jsx              Binding Shell
        ↓
useScenarioCastRequirementsSectionViewModel      ViewModel / Chassis
        ↓
ScenarioCastRequirementsSectionView               Portable View / Skin
```

The Binding Shell also retains application ownership of the existing
`ScenarioReferencePickerModal` Shell. The portable section View never imports or
renders that application Shell.

## View ownership

The portable View owns only:

- the section heading and responsive field layout;
- selected-reference chips and fallback initials;
- empty and reference-load-error presentation;
- semantic open-picker and remove-reference callbacks.

It does not know Scenario form storage, creation API responses, registry binding
shape, allowed creation types, Player Character exclusion, or persistence.

## ViewModel ownership

The ViewModel owns:

- loading owner creations through `fetchOwnedCreations`;
- normalization into Scenario reference options;
- exclusion of `PLAYER_CHARACTER` references;
- picker configuration and allowed-type filtering;
- reads and writes for `required_characters`, `optional_characters`,
  `suggested_location`, `suggested_narrator`, and
  `suggested_npc_registries`;
- faction and organization registry binding normalization through the existing
  `scenarioRegistryBindings` helpers;
- display-ready field and chip props;
- application props passed to the existing Scenario reference picker Shell.

## Persistence boundary

All changes continue through the supplied Creation Edit `updateDataField`
callback. This feature does not save independently and does not alter the
Creation Edit persistence path.

## Preview

The development-only route is:

```text
/dev/ui-preview/scenario-cast-requirements
```

It renders the portable View directly from fixtures and does not load creations
or update a Scenario.
