# Stats & Pools Profile JSON Editor LOOM Feature

**Contract:** `stats_pools_json_editor_view_contract_v1`

## Purpose

Provides a bounded JSON authoring companion for the existing Stats & Pools
Profile visual editor. It supports complete-object copy, format, reset, AI-guide
download, validation, normalization, and atomic application.

## Boundary

```text
StatsPoolsEditorView
→ StatsPoolsJsonEditorModal
→ useStatsPoolsJsonEditorViewModel
→ statsPoolsJsonEditor.validation
→ existing Stats & Pools normalizer and validator
```

Validate & Apply replaces only the controlled editor value. It never calls an
API, saves a creation, mutates actor state, or bypasses the existing page Save
action.

## Definition-only authority

The modal may author reusable Stat, Pool, Formula, Modifier, and Condition
definitions. It rejects actor-owned values, active Modifier/Condition instances,
ownership, binding namespaces, and state revisions.

## Development preview

```text
/dev/ui-preview/stats-pools-json-editor
```

The preview is blocked in production with `notFound()`.
