# Eyebrow LOOM package

**Status:** Loom-separated, 7 Aug 2026 (Sprint 3 Phase 1 follow-up)

**View contract:** `1.0.0`

## Purpose

The studio-wide eyebrow label: small gold uppercase text at the ruled
eyebrow type scale (`--text-eyebrow` / `--lh-eyebrow` / `--track-eyebrow`),
with a trailing `--grad-rule` mark. Ruled design law 6 Aug 2026, first
shipped in `components/studio/create/character/creator-stops/shared/Controls.jsx`
(commit `11c0779`). Promoted here so every studio surface pulls the same
treatment instead of re-implementing it.

## Structure

```text
Eyebrow.jsx
  Binding Shell
eyebrow/
  Eyebrow.view.jsx
    Portable Skin
  useEyebrowViewModel.js
    Chassis (defensive pass-through)
  Eyebrow.contract.js
  Eyebrow.fixtures.js
  README.md
```

## Public contract

`children` (the label text), `showRuleMark` (boolean, defaults `true`).
The default renders byte-identically to the original creator-stops
treatment. `showRuleMark` is a backward-compatible optional addition for
callers with no trailing content.

## Origin caller

`components/studio/create/character/creator-stops/shared/Controls.jsx`
now re-exports this global as its `Eyebrow` named export, so all seven
creator stops keep their existing import path
(`../shared/Controls`) and render unchanged.

## Preview

Development only:

```text
/dev/ui-preview/eyebrow
```
