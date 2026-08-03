# Video Tools Panel Loom Feature

## Public Binding Shell

```text
components/studio/image-studio/VideoToolsPanel.jsx
```

The Shell preserves the existing public props:

```text
videoDuration
setVideoDuration
videoAspectRatio
setVideoAspectRatio
videoMotionStyle
setVideoMotionStyle
prompt
setPrompt
```

## Portable View

```text
components/studio/image-studio/video-tools-panel/
  VideoToolsPanel.view.jsx
```

The View owns the future-video notice, tool cards, controlled selectors,
direction textarea, disabled generation button, and future media-library note.
It receives display-ready values and emits semantic control-edit intent.

The View does not know Image Studio state ownership, composer mode switching,
option registries, future video-generation request construction, API behavior,
media storage, or persistence.

The current View retains `CrestfallSelect` as a documented host visual
dependency. A future extracted UI package may replace it with a shared package
primitive.

## ViewModel

```text
components/studio/image-studio/video-tools-panel/
  useVideoToolsPanelViewModel.js
```

The ViewModel translates the existing controlled component props into the View
contract. It normalizes the current video option/card registries and maps
semantic View callbacks back to the existing Image Studio setters.

## Contract and Fixtures

```text
components/studio/image-studio/video-tools-panel/
  VideoToolsPanel.contract.js
  VideoToolsPanel.fixtures.js
```

Current View contract version:

```text
VIDEO_TOOLS_PANEL_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures are direct View props and contain no Image Studio workbench state,
request payload, API behavior, media record, or persistence logic.

## Development Preview

```text
/dev/ui-preview/video-tools-panel
```

The preview is development-only and returns `notFound()` in production. All
selector and direction changes update preview-local state only. The preview
does not generate a video, call an API, create media, or save Image Studio
state.

## Live Validation

Validate the panel through its existing caller:

```text
components/studio/image-studio/ImageStudioComposer.jsx
```

Switch Image Studio into Video mode, change every selector, edit the direction
text, switch back to Image mode and then return to Video mode, and confirm the
current placeholder notice and disabled Generate Video button remain unchanged.
No video request should be sent because generation remains intentionally
stubbed.
