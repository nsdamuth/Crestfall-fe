# Narrator Presentation Module Scope binding

Status: additive FE semantic/presentation binding only.

Current FE still exposes six Narrator Story Presentation groups:

```text
Prose Style
Detail Level
Pacing
Dialogue Style
Knowledge Behavior
Atmosphere
```

Current Crestfall intentionally narrows that to four:

```text
Prose Style
Detail Level
Pacing
Atmosphere
```

## Dialogue Style

`dialogue_style` is no longer a Narrator Presentation module.

Narrator presentation shapes non-dialogue rendering. Named Character dialogue
remains governed by Character voice and Character Voice Modules.

Persisted legacy values may be observed for compatibility, but are ignored by
the canonical four-group projection.

## Knowledge Behavior

`knowledge_behavior` is no longer a Narrator Presentation module.

Knowledge boundaries are authoritative registry/runtime state and cannot be
loosened or tightened by a Narrator style setting.

## Pacing

Pacing is compositional pressure inside material already authorized for the
current post.

It cannot create, delay, skip, or override Scenario, Storywheel, beats, phases,
mechanics, or deterministic progression.

## Detail Level

Detail Level controls descriptive density for actions, environment, sensory
detail, posture, visible reactions, and staging.

It is not a word-count target and does not control Character speech length.

## Canonical persistence

`selected_modules` is the canonical module map:

```text
prose_style
detail_level
pacing
atmosphere
```

The old top-level mirrors:

```text
pacing
detail_level
```

are no longer required by the current payload contract.

Payload construction remains Chassis-owned.

## Response Direction

Response Direction remains separate from presentation modules and retains:

```text
ADAPTIVE_CAST / NARRATOR_PRIMARY
SCENE_ONLY / ENSEMBLE
ensemble_character_limit
```

The binding also carries the current source labels:

```text
Scene Narration Only — Default
Ensemble Narration — Opt In
```

## Wiring state

The existing `1.0.0` Module Selector View can already render the canonical
display-ready groups:

```text
canonicalFourGroupSelector = READY_FOR_FE_WIRING
```

The current FE ViewModel still imports the six-group preset, so removal of the
deprecated controls is recorded as:

```text
deprecatedGroupRemoval = PENDING_FE_VIEWMODEL_WIRING
```

No current FE-owned View/ViewModel is modified here.

## Permanent boundary

Crestfall owns application state, payload construction, persistence, runtime
interpretation, Character voice authority, knowledge authority, and
deterministic progression.

Crestfall-fe owns the presentation-module catalog/copy, grouping, selector
visual composition, and summary presentation.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
