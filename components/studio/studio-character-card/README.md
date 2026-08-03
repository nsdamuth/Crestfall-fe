# Studio Character Card

`StudioCharacterCard` is the bounded official-character card used by the Studio
Official Characters browser.

## Files

```text
components/studio/StudioCharacterCard.jsx
components/studio/studio-character-card/
  StudioCharacterCard.view.jsx
  useStudioCharacterCardViewModel.js
  StudioCharacterCard.contract.js
  StudioCharacterCard.fixtures.js
  README.md
```

The existing public file remains the Binding Shell. The ViewModel translates a
raw official-character record into display-ready image, identity, summary, and
route props. The portable View owns only card presentation.

## Public application API

```jsx
<StudioCharacterCard character={character} />
```

The public API is unchanged.

The current disabled `Start` action remains a presentation-only placeholder.
This feature does not create a Story Room, start a session, call an API, or save
data.

## Preview

```text
/dev/ui-preview/studio-character-card
```

The preview renders contract-shaped fixtures. The Details action targets a
preview hash, and Start remains disabled. The route returns `notFound()` in
production.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.
