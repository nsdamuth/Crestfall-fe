# Actor Mechanics Profile JSON Editor LOOM Feature

**Contract:** `actor_mechanics_profile_json_editor_view_contract_v1`

## Purpose

Provides a bounded JSON authoring companion for the existing Actor Mechanics
Profile visual editor. It supports complete-object copy, format, reset, AI-guide
download, validation, normalization, and atomic application.

## Boundary

```text
ActorMechanicsProfileEditorView
→ ActorMechanicsProfileJsonEditorModal
→ useActorMechanicsProfileJsonEditorViewModel
→ actorMechanicsProfileJsonEditor.validation
→ existing Actor Mechanics Profile normalizer and validator
```

Validate & Apply replaces only the controlled editor value. It never calls an
API, saves a creation, mutates actor state, creates references, or bypasses the
existing page Save action.

## Authority boundary

The modal may author reusable bindings, activation policy, capability policy,
owner attachment, and exact existing references. It rejects mutable actor values,
XP/levels, balances, inventory contents, active effects, cooldowns, unlocks, and
state revisions.

## Development preview

```text
/dev/ui-preview/actor-mechanics-profile-json-editor
```

The preview is blocked in production with `notFound()`.
