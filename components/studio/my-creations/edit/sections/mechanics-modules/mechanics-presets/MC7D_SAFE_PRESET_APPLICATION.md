# MC7D — Safe Preset Application and Merge Behavior

MC7D connects the MC7 catalog to the live Mechanics Module builder through a
LOOM preset library.

## Application modes

- `REPLACE_BLOCK` replaces only `command.resolution` or `command.composition`.
- `REPLACE_COMMAND` replaces one selected command as a complete unit.
- `MERGE_COMMAND` preserves selected command identity, invocation name,
  presentation, and existing triggers while installing the preset operational
  blocks and typed arguments.
- `REPLACE_MODULE` replaces the complete authored Mechanics Module data object.
- `MERGE_MODULE` appends a complete preset module only when IDs, command
  invocations, defaults, and module definitions do not conflict.

Every application occurs against a clone and passes through the existing
Mechanics JSON compliance validator. Conflict or compliance failure returns no
replacement data, so the open builder remains unchanged.

`REPLACE_COMMAND` and `REPLACE_MODULE` require explicit confirmation in the UI.
The page-level Save action remains the only persistence action.

No services-api, database, PostGraphile, or engine-middleware production files are changed.
