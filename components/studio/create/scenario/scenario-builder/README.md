# Scenario Builder LOOM feature

## Boundary

```text
ScenarioBuilderShell                         Binding Shell
  → useScenarioBuilderViewModel              ViewModel / Chassis
  → ScenarioBuilderView                      Portable View / Skin
  → scenarioClient                           client adapter
  → creationClient                           shared frontend client
  → /api/creations                           frontend API proxy
```

The Shell preserves the existing public import and keeps the application-owned
`ScenarioReferencePickerModal` outside the portable View.

## View ownership

The View owns the existing Scenario Builder presentation, including identity,
story-circle, reference selector cards, middleware controls, runtime guidance,
publishing fields, progress, and save-state presentation.

It receives semantic state and callbacks only. It does not load creation
references, normalize registry bindings, construct `creation.data`, save,
navigate, or import another feature's Binding Shell.

## ViewModel ownership

The ViewModel owns:

- form, story-circle, middleware, picker, loading, and save state;
- owned-creation loading and Player Character exclusion;
- Scenario reference normalization and filtering;
- Faction and Organization Registry binding state;
- the existing `SCENARIO` creation payload;
- draft creation and redirect to Creation Edit.

## Preserved storage contract

The patch preserves `builder: "SCENARIO_BUILDER"`, `builder_version: "1.0"`,
`creation_kind: "SCENARIO"`, Story Circle values, middleware intent, cast and
location references, narrator and NPC Registry recommendations, and canonical
`boundRegistries` / `boundRegistryLinks` data.
