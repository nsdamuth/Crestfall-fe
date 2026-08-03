# Mechanics Preset Application LOOM Feature

**Contract:** `1.0.0`  
**Application service:** `mechanics_preset_application_v1`

```text
MechanicsPresetApplicationModal.jsx
        ↓
useMechanicsPresetApplicationViewModel.js
        ↓ semantic props and callbacks
MechanicsPresetApplicationModal.view.jsx
```

The View owns only presentation and semantic user actions. The ViewModel owns
catalog filtering, target selection, preview state, confirmation, and applying
the pure application service. The service applies to a cloned Mechanics Module,
rejects merge conflicts atomically, and validates the complete result through
the existing Mechanics JSON compliance validator before returning replacement
data to the live builder.

No API, Supabase, PostGraphile, services-api, or persistence calls occur inside
this feature. The page-level Save workflow remains authoritative.

## MC7F live-validation integration

The modal contract advances to `1.1.0` by exposing display-ready validation
metadata for each preset. Applying a preset may return a transient live
validation guide to the parent Mechanics builder. The modal and guide do not
save the creation or mutate runtime state.
