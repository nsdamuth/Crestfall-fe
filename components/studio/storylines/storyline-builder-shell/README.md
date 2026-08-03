# Storyline Builder Shell LOOM package

## Boundary

- **Binding Shell:** `../StorylineBuilderShell.jsx`
- **ViewModel / Chassis:** `useStorylineBuilderShellViewModel.js`
- **Portable Skin:** `StorylineBuilderShell.view.jsx`

The Binding Shell composes the application-owned `StorylineNodeListEditor` and
`StorylineOpenWorldSettings` as semantic slots. The Portable Skin owns only the
builder layout and field controls.

The ViewModel owns Storyline form normalization, reference loading, authoring
validation, payload construction, `createStorylineDraft`, save state, response
normalization, and navigation to the saved Creation Edit route.

## Preserved behavior

- Title and description authoring
- `PRIVATE` and `UNLISTED` visibility
- SFW content rating
- One-tag-per-line input
- Full node/transition editor
- Open-world settings
- Story and Scenario reference loading
- Validation before persistence
- Draft creation through the existing Storyline client
- Navigation to `/studio/my-creations/<id>/edit`
- Existing `useStorylineBuilderViewModel` compatibility export

## Preview and diagnostics

- Preview: `/dev/ui-preview/storyline-builder-shell`
- Diagnostics: `npm run diagnostics:loom:storyline-builder-shell`

The preview is development-only and uses fixtures without persistence.

Mechanics Module field decomposition remains deferred until the final cumulative
reassessment.
