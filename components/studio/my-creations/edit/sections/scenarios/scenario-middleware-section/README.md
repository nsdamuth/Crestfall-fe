# Scenario Middleware Section LOOM boundary

## Portable LOOM boundary

```text
ScenarioMiddlewareSection.jsx                    Binding Shell
scenario-middleware-section/
  ScenarioMiddlewareSection.view.jsx             Portable View / Skin
  useScenarioMiddlewareSectionViewModel.js       ViewModel / Chassis
  ScenarioMiddlewareSection.contract.js          Semantic UI contract
  ScenarioMiddlewareSection.fixtures.js          Isolated visual states
```

The public `ScenarioMiddlewareSection.jsx` import remains unchanged for Creation
Edit callers.

## Application behavior

The ViewModel owns:

- normalization of `form.data.middleware_modules`;
- the six supported middleware module definitions;
- the historical default enabled state;
- immutable toggle payload construction; and
- mapping semantic toggles back through `updateDataField`.

The portable View receives display-ready module cards and invokes only
`module.onToggle()`.

## Persistence boundary

This feature writes only through the existing parent callback:

```text
updateDataField("middleware_modules", nextModules)
```

The feature does not save a Creation directly and does not call any API.

## Preview

Development-only fixture preview:

```text
/dev/ui-preview/scenario-middleware-section
```

The route is unavailable in production.
