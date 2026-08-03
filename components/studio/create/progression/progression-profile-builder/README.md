# Progression Profile Builder LOOM

Persistence-aware create surface for `PROGRESSION_PROFILE`.

```text
ProgressionProfileBuilderShell
→ useProgressionProfileBuilderViewModel
→ ProgressionProfileBuilderView
→ ProgressionProfileEditorView
```

The View remains portable. The ViewModel calls the client adapter, which follows:

```text
ViewModel
→ lib/client
→ FE API proxy
→ services-api
→ PostGraphile
→ DB
```

Stored definition key:

```text
creation.data.progression_profile
```

Development preview:

```text
/dev/ui-preview/progression-profile-builder
```

Creation-title behavior:

```text
explicit Creation title
→ otherwise use Progression Profile title
→ otherwise keep Save Draft disabled
```

This prevents the reusable profile title and the creation wrapper title from
creating an unnecessary save blocker while still allowing an explicit wrapper
title override.
