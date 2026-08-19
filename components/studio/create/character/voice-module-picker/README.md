# Voice Module Picker Loom Feature

## Purpose

Separates the reusable character voice-module interface from Crestfall's
voice-module catalog and character form persistence.

## Files

- `../VoiceModulePickerModal.jsx` — Binding Shell and preserved public import path.
- `VoiceModulePickerModal.view.jsx` — Portable, API-free View.
- `useVoiceModulePickerModalViewModel.js` — Crestfall option mapping and selection behavior.
- `VoiceModulePickerModal.contract.js` — Versioned View prop/callback boundary.
- `VoiceModulePickerModal.fixtures.js` — Isolated visual states.

## Behavior ownership

The ViewModel owns:

- importing and grouping Crestfall voice-module options;
- normalizing the selected module-ID array;
- resolving selected labels;
- toggling and clearing module selections;
- returning the updated ID array through the existing `onChange` callback.

The View owns trigger and modal layout, selected-chip presentation, option-card
selection styling, accessibility, and safe invocation of semantic callbacks.

## Preview

Development-only route:

`/dev/ui-preview/voice-module-picker`

The preview uses fixtures only and never reads or writes a character.

## W5 live catalog wiring

The picker now consumes the complete current 41-option Character Voice Module
catalog directly from:

```text
../constants/voiceModules.js
```

No picker View or ViewModel rewrite was required.

The existing presentation ViewModel already:

- imports the live catalog;
- groups options by category;
- resolves selected labels;
- preserves unknown selected IDs;
- returns selected IDs through the parent-owned `onChange` callback.

The portable picker View remains FE presentation authority and was deliberately
not replaced with the stylistically different Chassis source View.
