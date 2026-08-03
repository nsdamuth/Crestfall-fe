# Mechanics Command Resolution LOOM Package

Contract: `crestfall.loom.mechanics-command-resolution.v1`

This package owns the authoring boundary for `instanceData.commands[].resolution`.
It extracts command resolution from the Mechanics Module parent without changing
runtime execution or the complete-document save boundary.

## Ownership

The package owns:

- no-roll, threshold, and opposed resolution modes;
- actor and opposition dice and roll policies;
- target numbers;
- fixed modifiers;
- authoritative modifier sources;
- target property and target Mechanics evidence;
- tie policy and natural critical/fumble behavior;
- degree-of-success margin bands;
- safe reference configuration replacement.

The package does not own command identity, requirements, effects, outcomes,
domain actions, Advanced Composition, service execution, or persistence.

## Compatibility

Normalization delegates to the existing `mechanicsCommandResolutionBuilder.js`
authority while preserving unknown metadata at the resolution root, die,
opposed, opposed die, and degree-of-success levels. Existing modifier and source
normalizers already preserve unknown item metadata.

## Parent boundary

`MechanicsModuleFieldsSection.jsx` remains the command-record owner and writes the
complete normalized `resolution` object through the existing command patch path.
