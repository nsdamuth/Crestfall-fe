# Wallet Profile authoring presentation binding

Status: **WIRED — W35 legacy presentation**.

This binding remains the accepted display/semantic seam for the Wallet Profile
editor. W35 does not replace it with a second model; it wires the current working
Crestfall editor and JSON Editor & AI Guide into FE and updates the binding status
to describe the live branch state.

The semantic contract remains:

```text
wallet_profile_contract_v0
```

The binding consumes normalized `profile / errors / warnings / metrics` and carries:

- Wallet Profile title/description/tags/enabled state;
- VALID / WARNING / ERROR presentation;
- reusable currency identity/title/symbol/description;
- starting/minimum/maximum balances;
- tags and metadata boundaries;
- current limits;
- the explicit separation between gameplay Wallet currencies and Crestfall Studio Coins.

Actor-owned current Wallet balances remain runtime Story state and are not stored in
the authored profile.

## Current presentation status

```text
profileEditor: WIRED_LEGACY_PRESENTATION
jsonEditor:    WIRED_LEGACY_PRESENTATION
```

The live legacy Wallet form exposes the reusable currency-definition surface. The
complete JSON Editor & AI Guide is also wired for complete-object authoring and
validation.

A future FE restyle may normalize these visuals, but presentation redesign is no
longer a functional synchronization blocker on this branch.

## Builder ESM compatibility

The FE Wallet builder contract keeps the behavior-neutral explicit `.js` import:

```text
../wallet-profile-editor/WalletProfileEditor.contract.js
```

Its public contract/version/options/draft behavior remain semantically identical to
Chassis while staying directly importable by standalone Node diagnostics.

## Permanent boundary

Crestfall remains authority for normalization, validation, editor mutation, JSON
validation/application, payload construction, persistence, actor-owned Wallet
balances, runtime Wallet operations, and Studio/account Coin economy policy.

Crestfall-fe owns editor visual composition and presentation. Mirrored ViewModels in
this branch are deployment mirrors; they do not move product authority out of
Crestfall.

Saved-edit shell registration remains deferred to the dedicated protected edit
convergence package.
