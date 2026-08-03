# MC7B — Command-Level Starter Presets

MC7B extends the Mechanics preset catalog with complete command configurations.

## Contract

- Command starter contract: `mechanics_command_starter_presets_v1`
- Preset catalog contract: `mechanics_preset_catalog_v1`
- Command contract: `mechanics_command_contract_v1`
- Resolution contract: `mechanics_command_resolution_v6`
- Composition contract: `mechanics_command_composition_v1`

## Included starters

1. `command.resource_check.v1`
   - Meter requirement and attempt cost
   - Standard d20 threshold resolution
   - Success/failure routing
   - Attempt and success counters

2. `command.social_probe.v1`
   - Present Character argument
   - Opposed d20 resolution
   - Trust attempt cost
   - Target-scoped success state
   - Attempt and success counters

3. `command.give_item.v1`
   - Held Item and present Character arguments
   - Deterministic resolution
   - Authoritative `ITEM_GIVE` domain action

4. `command.apply_condition.v1`
   - Present Character and remaining-text condition arguments
   - Focus requirement and attempt cost
   - Threshold resolution
   - Authoritative `PARTICIPANT_CONDITION_APPLY` domain action

5. `command.travel_connected.v1`
   - Connected Location argument
   - Deterministic resolution
   - Final `LOCATION_TRANSITION` domain action

## Application boundary

Each starter declares `REPLACE_COMMAND`. MC7B builds complete command payloads but does not yet mutate a selected command in the live builder. Safe apply, replace, and merge orchestration remains MC7D.

Replacing one command preserves the rest of the Mechanics Module, including trackers, defaults, guards, status blocks, and all other commands.

## Safety

Every starter:

- passes the existing Mechanics JSON compliance validator;
- uses the frozen MC5 and MC6 contracts;
- keeps legacy single-domain actions disabled;
- uses at most one action per runtime patch lane;
- keeps Location actions final;
- contains no API, persistence, database, PostGraphile, or runtime execution coupling.
