# Mechanics M0 — Compatibility and Cross-Service Baseline

**Contract:** `crestfall.loom.mechanics-compatibility-baseline.v1`

M0 freezes the current frontend Mechanics shapes and replacement boundaries before domain extraction. It changes no production Mechanics UI, payload, preset, JSON, service, runtime, or database behavior.

## Frozen behavior

- Create and edit both expose complete `form.data` replacement.
- JSON and preset application converge on the same atomic replacement helper.
- At the M0 freeze, the create payload projected a documented allowlist and did not promise unknown-key survival. M1 now resolves that frozen gap through the shared Mechanics Document Core while this package remains the historical pre-extraction baseline.
- Existing MC8 legacy fixtures and preset freeze manifests remain authoritative.

## Commands

```bash
npm run diagnostics:loom:mechanics-m0
```

The separate cross-service gate requires explicit repository locations and refuses to claim success when they are absent:

```bash
CRESTFALL_SERVICES_API_ROOT=/path/to/services-api \
CRESTFALL_ENGINE_MIDDLEWARE_ROOT=/path/to/engine-middleware \
npm run diagnostics:mechanics-m0:cross-service
```

## Preview

```text
/dev/ui-preview/mechanics-compatibility-baseline
```

The preview is development-only and read-only.
