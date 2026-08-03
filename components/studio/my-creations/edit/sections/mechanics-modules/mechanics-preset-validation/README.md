# Mechanics Preset Validation Panel LOOM Feature

**Contract version:** `1.0.0`

This bounded panel appears after a Mechanics preset is applied to the open
builder. It presents a display-ready smoke-test guide without persisting
validation state or bypassing the normal creation Save path.

```text
MechanicsPresetValidationPanel.jsx
        ↓
useMechanicsPresetValidationPanelViewModel.js
        ↓ semantic contract
MechanicsPresetValidationPanel.view.jsx
```

The View owns layout and accessible presentation. The ViewModel owns clipboard
interaction and display normalization. The parent Mechanics builder owns the
transient applied-preset guide and dismissal.
