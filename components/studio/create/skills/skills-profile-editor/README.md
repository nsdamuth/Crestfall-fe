# Skills Profile Editor

Portable LOOM editor for reusable `SKILLS_PROFILE` definitions.

The View owns presentation only. The ViewModel normalizes edits, rebuilds complete rank tables, opens the JSON editor, and emits a validated profile to the parent. Persistence remains owned by the create builder or Creation Edit page.

The editor never stores actor ranks, unspent Progression points, namespaces, or mutation history.
