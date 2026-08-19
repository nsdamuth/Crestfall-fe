# Location Registry Builder Split binding

Status: **VISUALLY WIRED; PROTECTED EDIT-ID BRIDGE PENDING**.

W12 closes the unprotected FE presentation portion of creator-confirmed
Location Registry splitting on top of W9's application foundation.

The edit-mode Registry Summary now exposes `Analyze Split` whenever Chassis
application state reports that the saved Registry is eligible.

The split dialog presents deterministic authored-containment candidates,
source-integrity issues, non-overlapping creator selection, server-authoritative
plan validation, source/plan fingerprints, preservation checks, commit blockers,
explicit destructive confirmation, and the atomic commit guard.

During commit, the close control is disabled and the action reads:

```text
Applying Atomic Split...
```

The View does not analyze, plan, mutate, fingerprint, or commit Registry state.
Those responsibilities remain Chassis/application-owned.

The FE Creation Edit lane still does not pass:

```text
currentCreationId={form.id || ""}
```

through the protected `my-creations/edit/**` bridge.

Therefore:

```text
Split visual wiring: WIRED
Saved-edit end-to-end availability: BLOCKED_BY_PROTECTED_EDIT_ID_BRIDGE
```
