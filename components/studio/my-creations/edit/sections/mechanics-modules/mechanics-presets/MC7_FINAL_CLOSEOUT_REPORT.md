# Crestfall MC7G Final Closeout Report

**Phase:** MC7G — Final Preset and Extension Freeze  
**Status:** FROZEN  
**Core freeze manifest:** `mechanics_preset_freeze_manifest_v1`  
**Extension freeze manifest:** `mechanics_preset_extension_freeze_manifest_v1`

## Closeout decision

MC7 and the bounded MC7X advancement/observability extension line are complete.
No new Mechanics behavior is introduced by this closeout package. It adds only a
separate extension freeze manifest, a final aggregate audit, and this report.

The original MC7 core freeze remains unchanged at **20 presets**. The live Preset
Library closes at **22 presets**:

- 20 frozen core MC7 presets;
- `module.character_advancement_curve.v1`;
- `module.character_advancement_readout.v1`.

The legacy lookup alias `module.character_advancement_5e.v1` remains supported but
is not a separate library entry.

## Frozen MC7X contracts and baselines

- `mechanics_character_advancement_preset_v4`
- `mechanics_progression_profile_v1`
- `mechanics_progression_profile_service_v1`
- `mechanics_effect_value_binding_v1`
- `mechanics_command_state_readout_v1`
- `mechanics_applicator_v1_2`
- Preset Library UI baseline `MC7X.2.3`
- Layout diagnostic `mc7_preset_library_layout_diagnostics_v4`

## Character advancement freeze

The frozen reference implementation retains:

- generated, generated-with-overrides, and explicit-table progression profiles;
- deterministic monotonic threshold generation;
- `/award_xp <amount>` with aliases `/grant_xp` and `/add_xp`;
- `/progress` with aliases `/level`, `/xp_status`, and `/advancement_status`;
- `/advancement_on` and `/advancement_off`;
- authoritative pending-patch-aware `PROGRESSION_RECONCILE` processing;
- derived proficiency and advancement-count reconciliation;
- read-only state presentation without narrative continuation or time advancement;
- atomic preset application and serialized-size rejection boundaries.

The default generated curve reaches level 5 at 4,200 XP and level 20 at 361,400
XP. The progression diagnostics prove XP, rank, proficiency, and advancement
count update in one accepted application and do not count an already-earned rank
a second time.

## Builder and UI freeze

The Preset Library retains one explicit modal-body scrollbar, a fixed header and
action footer, responsive internal content, visible scrollbar styling, background
scroll locking, and a non-overlapping search icon/input layout.

Preset application remains clone-first, compliance-validated, atomic, and staged
in the open builder. The ordinary page Save action remains the only persistence
boundary.

## Architecture boundaries

- Frontend Views remain API-free and persistence-free.
- No direct frontend Supabase or PostGraphile access is introduced.
- Runtime Mechanics mutation remains authoritative in `services-api`.
- No database, PostGraphile, package, or engine-middleware migration is required.
- The core `mechanics_preset_freeze_manifest_v1` is not modified.

## Final aggregate gate

`mc7FinalCloseoutAudit.mjs` verifies the frozen manifests, catalog counts,
extension identities, progression contracts, generated curve, aliases, runtime
reconciliation markers, UI baseline, architecture boundaries, and report markers.
It then executes these existing diagnostics:

1. `mc7ProductionHardeningAudit.mjs`
2. `mc7BuilderLiveValidationDiagnostics.mjs`
3. `mc7PresetApplicationDiagnostics.mjs`
4. `mc7xCharacterAdvancementDiagnostics.mjs`
5. `mc7PresetLibraryLayoutDiagnostics.mjs`

All five must exit successfully before the closeout gate passes.

## Operator validation

The final MC7X build completed with zero build errors. The live Preset Library
scrollbar and modal layout were confirmed working, and the current advancement and
observability extension was confirmed operational.

## Freeze rule

MC7 and MC7X are frozen after this closeout. Future preset additions, progression
behavior changes, contract changes, catalog changes, or layout-baseline changes
must intentionally advance the relevant version and update the extension freeze
manifest and final closeout audit. Silent drift is prohibited.

## Next phase

Proceed to **MC8 — Regression, Migration, Diagnostics, and Production Hardening**.
