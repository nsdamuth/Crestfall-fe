# Wallet Profile FE package

Status: **LIVE FUNCTIONAL ABSORPTION — W35**.

W35 follows the explicit protected-lane unlock for the current integration branch.
The accepted Wallet semantic contracts and richer FE fixtures remain intact, while
the current Crestfall Wallet authoring implementation is mirrored into FE so the
live editor can function before a later visual-normalization pass.

The user explicitly authorized carrying the older working styling on this branch
for now, with normalization where it is low-risk. W35 therefore prioritizes
functional parity over immediate redesign.

## Product distinction

A Wallet Profile is a reusable gameplay-currency definition asset for the Actor
Mechanics `WALLET` domain. It is not Crestfall Studio/account Coins.

Wallet Profiles define creator-authored in-game currency identity, symbol, enabled
state, starting balance, minimum balance, maximum balance, tags, and metadata.
Actor-owned mutable balances remain Story runtime state.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence;
- application behavior and save semantics;
- Wallet normalization and validation;
- reusable currency mutation semantics;
- actor-owned live Wallet balances;
- runtime Wallet operations;
- Studio/account Coin economy policy.

Crestfall-fe owns presentation. Mirrored application ViewModels in FE are deployment
mirrors of Chassis behavior; they do not transfer product authority out of Crestfall.

## W35 live surface

FE now contains the current:

- Wallet Profile Builder shell/View/ViewModel;
- Wallet Profile editor shell/View/ViewModel;
- JSON Editor & AI Guide shell/View/ViewModel;
- JSON validation and complete-replacement AI authoring guide;
- local editor diagnostics.

The core Wallet Profile editor contract remains byte-compatible with Chassis:

```text
wallet_profile_contract_v0
```

The FE builder contract retains its behavior-neutral explicit `.js` import needed by
standalone Node diagnostics. Its public constants and draft/title behavior remain
semantically identical to Chassis.

The accepted FE presentation binding is preserved and now reports both the profile
editor and JSON Editor & AI Guide as:

```text
WIRED_LEGACY_PRESENTATION
```

## Deferred from W35

W35 deliberately does not modify:

- `components/studio/my-creations/edit/**`;
- the Creation Edit Binding Shell;
- Actor Mechanics editor family;
- Creation Studio mechanics-profile catalog exposure;
- Image Studio / Kit;
- chat;
- `/app/studio/v2/**`.

Saved-edit registration remains in the later protected `my-creations/edit`
convergence package, after all editor targets exist in FE.
