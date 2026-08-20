# Ability and Spell Profile FE package

Status: **LIVE FUNCTIONAL ABSORPTION — W33**.

W33 uses the explicit protected-lane unlock for the current integration branch.
The accepted semantic contracts and fixtures remain intact, while the current
Crestfall Ability & Spell authoring implementation is now mirrored into FE so
the live editor can function before a later visual-normalization pass.

The user explicitly authorized carrying the older working styling on this
branch for now, with normalization toward the newer FE visual system where it
is low-risk. W33 therefore prioritizes functional parity over redesign.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence;
- application behavior and save semantics;
- Ability & Spell normalization and validation rules;
- runtime authorization/execution;
- actor-owned cooldown, charge, mastery, knowledge, and resource state.

Crestfall-fe owns the presentation copy deployed by the integration branch.
The mirrored ViewModels are deployment mirrors of Chassis behavior; they do not
move product authority out of Crestfall.

## W33 live surface

FE now contains the current:

- Ability & Spell Profile Builder shell/View/ViewModel;
- Ability & Spell Profile editor shell/View/ViewModel;
- JSON Editor & AI Guide shell/View/ViewModel;
- JSON validation and complete-replacement AI authoring guide;
- local editor diagnostics.

The existing FE semantic contract remains byte-compatible with Chassis:

```text
ability_spell_profile_contract_v0
```

The accepted FE presentation binding remains as a semantic/display regression
contract and now reports the editor and JSON surface as
`WIRED_LEGACY_PRESENTATION`.

## Deferred from W33

W33 deliberately does not modify:

- `components/studio/my-creations/edit/**`;
- the Creation Edit Binding Shell;
- Skills, Wallet, or Actor Mechanics editor families;
- Creation Studio mechanics-profile catalog exposure;
- Image Studio / Kit;
- chat;
- `/app/studio/v2/**`.

Saved-edit registration is handled in the later protected
`my-creations/edit` convergence package, after the editor target exists in FE.
