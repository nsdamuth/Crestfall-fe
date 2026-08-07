# Crestfall Loom Pattern

**Status:** Pilot validated

**Pattern version:** 0.1

**Validated feature:** Kibbe Preset Modal

**Architecture direction:** Nicholas S. Damuth

**Purpose:** Separate UI ownership from Crestfall application behavior without weakening Crestfall's existing MVVM, service, PostGraphile, or database boundaries.

## 1. Summary

The Crestfall Loom Pattern is a Chassis–Skin architecture adapted to Crestfall's existing frontend and service boundaries.

A feature is divided into three explicit parts:

```text
Portable View / Skin
        ↓ semantic props and callbacks
Binding Shell
        ↓
ViewModel / Chassis
        ↓
client API module
        ↓
Next.js API proxy
        ↓
services-api
        ↓
PostGraphile
        ↓
database
```

The View may be redesigned independently. The ViewModel owns application behavior. The Shell binds them together.

This pattern does **not** authorize direct data access from Views or ViewModels. Crestfall's existing data path remains authoritative.

## 2. Why Crestfall Is Using It

The pattern supports:

- independent UI/UX ownership
- fixture-driven visual development
- safer Figma-to-code iteration
- smaller AI or human change scopes
- reduced risk that a visual redesign alters persistence or business behavior
- direct testing of application logic without rendering the full interface
- eventual publication of UI Views from a separate repository or package

The initial Kibbe modal pilot proved that:

1. the View can be edited and visually updated without changing behavior
2. the same View can render from fixtures outside the character builder
3. create, edit, preset application, and saving continue to work through the ViewModel
4. the visual change can be reverted without touching application logic

## 3. Canonical Feature Structure

For a feature named `FeatureName`, use the following shape when the feature is complex enough to benefit from separation:

```text
FeatureName.jsx                         # Binding Shell
feature-name/
  FeatureName.view.jsx                  # Portable View / Skin
  useFeatureNameViewModel.js            # ViewModel / Chassis
  FeatureName.contract.js               # Shared prop/callback contract
  FeatureName.fixtures.js               # Isolated visual states
  README.md                              # Feature-specific UI handoff
```

A preview route may also be added during development:

```text
app/dev/ui-preview/feature-name/
  page.jsx
  FeatureNamePreviewClient.jsx
```

Preview routes must not be available in production.

## 4. Layer Responsibilities

### 4.1 Portable View / Skin

The View owns presentation:

- JSX and visual hierarchy
- Tailwind classes and theme-token usage
- responsive layout
- typography and spacing
- visual selection, warning, empty, loading, and disabled states
- accessible labels and semantic HTML
- safe invocation of semantic callbacks
- presentation-only calculations needed to render supplied data

The View must not own Crestfall application behavior.

The View must not:

- call `fetch`, Axios, Supabase, PostGraphile, or service endpoints
- import Crestfall client API modules
- import form persistence logic
- know database column names or JSONB storage rules
- know mutation modes such as how Crestfall maps a preset into stored fields
- directly update a character, creation, profile, registry, room, or media record
- infer authorization, publication, lifecycle, moderation, or ownership rules

Presentation-only local state may be used when it does not change application truth. Examples include a purely visual tooltip, disclosure, tab, or animation state. Application-relevant state belongs in the ViewModel.

### 4.2 ViewModel / Chassis

The ViewModel owns frontend application behavior:

- React application state
- effects and lifecycle synchronization
- validation
- transformations from Crestfall models into View props
- API-client calls through `/lib/client`
- mutation orchestration
- status, error, loading, and disabled-state decisions
- compatibility handling for legacy fields
- semantic callbacks exposed to the View

The ViewModel must not contain JSX, Tailwind classes, or visual layout.

The ViewModel must preserve the Crestfall path:

```text
ViewModel
→ client API module
→ frontend API proxy
→ services-api
→ PostGraphile
→ database
```

### 4.3 Binding Shell

The Shell is intentionally small and explicit:

```jsx
"use client";

import FeatureNameView from "./feature-name/FeatureName.view";
import { useFeatureNameViewModel } from "./feature-name/useFeatureNameViewModel";

export default function FeatureName(props) {
  const viewProps = useFeatureNameViewModel(props);

  return <FeatureNameView {...viewProps} />;
}
```

The Shell:

- preserves the existing public import path where practical
- invokes the ViewModel
- passes the View contract to the View
- may adapt route-level or parent-level inputs
- must not become a second business-logic layer

Crestfall currently uses explicit Shells rather than generated binding files. Generated weaving may be reconsidered later only if it provides a clear operational benefit.

## 5. Contract Rules

The contract is the stable agreement between Crestfall application logic and UI-owned Views.

A contract must define:

- every value passed to the View
- every callback emitted by the View
- default and nullable behavior
- array item shapes
- a contract version

Contract rules:

1. Use semantic names rather than database or form-field names.
2. Views invoke callbacks safely, such as `onClose?.()`.
3. Views provide defensive defaults for all props.
4. A callback must describe user intent, not implementation details.
5. Contract-breaking changes require coordination and a version change.
6. Adding an optional prop is usually backward-compatible.
7. Removing or renaming a prop or callback is contract-breaking.
8. Changing callback arguments or semantic meaning is contract-breaking.

Example:

```text
Preferred: onReplaceBodyTraits()
Avoid:     updateField("body_type", value)
```

The View should not know that Crestfall stores fields such as `body_type`, `build`, `height`, `proportions`, or `kibbe_identity`.

## 6. Fixture Rules

Fixtures are representative View-contract objects used for isolated visual development.

Fixtures should cover meaningful states, such as:

- closed/default trigger
- open with a selected item
- open with no selection
- loading
- disabled
- validation or error
- unusually long labels or descriptions
- empty arrays
- mobile and desktop stress cases

Fixtures must:

- use the same shape defined by the contract
- contain no production secrets or real private user data
- use no-op or preview-safe callbacks
- not call APIs or save data
- remain understandable to a UI developer without backend knowledge

Fixture callbacks may simulate local behavior in a preview harness. They do not replace live ViewModel integration tests.

## 7. Preview Route Rules

A fixture preview route exists so the actual React View can be developed without loading the full Crestfall workflow.

Current pilot route:

```text
http://localhost:3000/dev/ui-preview/kibbe-preset
```

The current route renders:

```text
KibbePresetModal.fixtures.js
→ KibbePresetModal.view.jsx
```

It does not:

- authenticate a user
- load a creation
- call an API
- run the Crestfall preset resolver
- persist data

The route returns `notFound()` when `NODE_ENV === "production"`.

## 8. Import Boundary

A portable View should prefer imports from:

- React when needed
- general visual dependencies such as `lucide-react`
- a future shared Crestfall UI package
- local presentation helpers

A portable View should avoid imports from:

- `@/lib/client`
- `@/lib/server`
- API routes
- ViewModels
- creation or profile persistence helpers
- Crestfall domain constants that expose storage behavior
- service or database modules

The current pilot still relies on Crestfall's global Tailwind configuration, fonts, and CSS variables, including:

```text
--muted-gold
--foreground
--muted
font-display
```

Before the View moves to a separate repository, these visual dependencies should be provided through a shared theme package, stylesheet, or documented host contract.

## 9. Ownership Model

### UI/UX-owned surface

Normally safe for independent UI changes:

- `*.view.jsx`
- view-local presentation helpers
- Storybook stories or preview-only visual harnesses
- fixture additions that do not change the contract
- CSS, Tailwind, icons, layout, responsive behavior, and accessibility

### Crestfall application-owned surface

Requires application review:

- `use*ViewModel.js`
- Shell files
- client API modules
- frontend API proxy routes
- `services-api`
- PostGraphile queries/functions
- DB migrations, permissions, functions, or triggers
- lifecycle and publication rules
- persistence payloads

### Shared boundary

Requires coordination:

- `*.contract.js`
- prop names and meanings
- callback names, arguments, and meanings
- fixture schema
- shared UI primitives or theme tokens

## 10. Change Classification

### View-only change

Examples:

- rearrange panels
- change spacing
- revise typography
- alter responsive columns
- replace an icon
- improve accessibility
- change card styling

Expected review: UI review plus basic preview regression.

### Backward-compatible contract extension

Examples:

- add an optional helper label
- add an optional visual state
- add an optional callback with a safe default

Expected review: UI and application review.

### Contract-breaking change

Examples:

- rename `onClose`
- change `identityOptions` from an array to an object
- remove `pendingPreset`
- change callback arguments
- change the meaning of an existing action

Expected review: coordinated contract version bump, ViewModel update, fixture update, preview update, and integration regression testing.

### Application behavior change

Examples:

- change what “Replace Body Traits” writes
- change validation or permissions
- add saving or API behavior
- change publication or moderation state

Expected review: Crestfall application architecture workflow. This is not a View-only change.

## 11. Testing Standard

Every separated feature should be tested in two modes.

### Isolated View test

- load each fixture state
- verify callbacks respond in the preview harness
- test desktop and mobile widths
- test keyboard focus and close behavior
- verify long and empty content states
- verify no API request is made

### Live integration test

- load the feature through its normal Crestfall workflow
- verify the ViewModel binds correctly
- exercise every semantic action
- save and reload when persistence is involved
- verify create and edit flows when both use the feature
- verify no change to stored data semantics unless explicitly intended

A View-only redesign is complete only after both modes pass.

## 12. Validated Pilot: Kibbe Preset Modal

Current files:

```text
components/studio/create/character/KibbePresetModal.jsx
components/studio/create/character/kibbe-preset/KibbePresetModal.view.jsx
components/studio/create/character/kibbe-preset/useKibbePresetModalViewModel.js
components/studio/create/character/kibbe-preset/KibbePresetModal.contract.js
components/studio/create/character/kibbe-preset/KibbePresetModal.fixtures.js
app/dev/ui-preview/kibbe-preset/page.jsx
app/dev/ui-preview/kibbe-preset/KibbePresetPreviewClient.jsx
```

Validated behaviors:

- View-only title and layout changes appeared in the running application
- the same changes appeared in the isolated preview route
- reverting the View reverted both surfaces
- character create worked
- character edit worked
- Save Identity Only worked
- Fill Empty Fields worked
- Replace Body Traits worked
- character saving worked
- fixture actions remained local and did not save application data

Current contract version:

```text
KIBBE_PRESET_MODAL_VIEW_CONTRACT_VERSION = "1.0.0"
```

## 13. Adding the Next Loom Feature

Before separating another component:

1. Select a component with meaningful visual and behavioral complexity.
2. Record its current public props and behavior.
3. Separate application logic into a ViewModel.
4. Convert the original component into a small Shell.
5. Make the View defensive and API-free.
6. Define the contract.
7. Add representative fixtures.
8. Add a development-only preview route or Storybook stories.
9. Verify no behavior changed.
10. Make one View-only visual change and confirm it appears in isolated and live modes.
11. Revert or accept the change.
12. Document any new shared pattern discovered during the pilot.

Do not split every small component automatically. Use the pattern where independent visual ownership, testing, or complexity reduction justifies the additional files.

## 14. Future Separate-Repository Direction

The likely long-term model is a versioned UI package rather than an uncontrolled runtime dependency:

```text
Figma
→ UI-owned View and fixtures
→ isolated preview / Storybook
→ reviewed package release
→ Crestfall Shell + ViewModel integration
```

Potential package shape:

```text
crestfall-ui/
  src/
    features/
    primitives/
    theme/
    assets/
```

The Crestfall application would consume a deliberate version:

```js
import { KibbePresetModalView } from "@crestfall/ui";
```

A package release should preserve rollback, review, and contract-version visibility. Repository separation is a later operational step; the current in-repository pilot is the reference implementation.
