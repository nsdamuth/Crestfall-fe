# LOOM Pre-Mechanics Closeout

This package is the final non-runtime checkpoint before Crestfall Mechanics Module abstraction.

It does not change a production component, ViewModel, API route, service, stored field, preset, migration, or Mechanics behavior. It adds only:

- a complete registered-LOOM diagnostic runner;
- a versioned Mechanics caller and domain manifest;
- frozen-boundary diagnostics;
- the approved assessment handoff document.

## Commands

Run the complete registered frontend LOOM suite:

```bash
npm run diagnostics:loom:cumulative-validation
```

Run the static Mechanics freeze assessment followed by the complete registered suite:

```bash
npm run diagnostics:loom:pre-mechanics-closeout
```

The cumulative runner intentionally skips aggregate commands that duplicate their leaf diagnostics. Service-dependent diagnostics remain explicitly classified by the repository guardrail exclusions and must be run from the complete multi-service source during the first Mechanics patch.

## Frozen decisions

- `MechanicsModuleFieldsSection.jsx` must not be wrapped wholesale.
- Create and edit must retain atomic whole-`data` replacement.
- Runtime Mechanics attachment is a separate owner-binding domain.
- `TrackersModuleConfigModal.jsx` is unreferenced and quarantined pending classification; it must not be deleted or converted by assumption.
- Saved-asset migration, legacy fixtures, compatibility manifests, and preset freeze evidence are mandatory inputs to abstraction.

## Stop boundary

Passing this closeout means the non-Mechanics LOOM conversion and hardening phase is complete. It does not authorize a Mechanics implementation patch. The next session begins by reviewing the assessment and running the deferred cross-service compatibility baseline.

## Final Mechanics decomposition closeout

After M9 browser validation, run:

```bash
npm run diagnostics:loom:mechanics-repository-extraction-closeout
npm run diagnostics:loom:pre-mechanics-closeout
```

The repository-extraction closeout freezes the portable runtime graph, public consumer contract, host-owned exclusions, external dependencies, the single `ModalShell` UI seam, and the required post-move verification routes. It makes no runtime changes and establishes the clean commit boundary before the UI is physically moved to another repository.
