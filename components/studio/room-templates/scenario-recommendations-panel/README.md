# Scenario Recommendations Panel LOOM boundary

## Public Shell

```text
components/studio/room-templates/ScenarioRecommendationsPanel.jsx
```

The Shell preserves the existing application-facing props used by Story create
and Story edit workflows:

```text
recommendations
onApplyAll
onApplyRequired
onApplyOptional
onApplyLocation
onApplyNarrator
onApplyNpcRegistries
onSkip
```

## Portable View

```text
ScenarioRecommendationsPanel.view.jsx
```

The View receives display-ready recommendation titles, booleans controlling
which category actions are available, and semantic callbacks. It does not know
scenario payload fields, creation/reference IDs, room package storage, registry
attachment rules, or persistence behavior.

## ViewModel

```text
useScenarioRecommendationsPanelViewModel.js
```

The ViewModel translates the existing recommendation object into the versioned
View contract. It preserves the original public API and maps application callback
names into semantic View callbacks.

## Fixtures and preview

```text
ScenarioRecommendationsPanel.fixtures.js
app/dev/ui-preview/scenario-recommendations-panel/
```

The preview renders the View directly from contract-shaped fixtures and keeps
all actions local. It does not load a Scenario, modify a Story package, attach a
registry, or persist data.

## Live callers

```text
components/studio/create/room-template/RoomTemplateBuilderShell.jsx
components/studio/my-creations/edit/sections/room-templates/RoomTemplatePackageSection.jsx
```

Both live callers must be regression-tested. Applying all or individual
recommendation groups, skipping recommendations, saving, and refreshing must
retain the same application behavior.

## Same-name legacy file

The repository also contains:

```text
components/studio/create/room-template/ScenarioRecommendationsPanel.jsx
```

The current live callers do not import that file. This conversion does not
merge, remove, relocate, or otherwise modify it.
