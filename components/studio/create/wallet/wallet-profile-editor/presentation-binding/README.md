# Wallet Profile authoring presentation binding

Status: additive FE presentation binding only.

This package is the next step after the accepted Wallet Profile semantic
migration.

The semantic contract is already present in the FE lane:

```text
wallet_profile_contract_v0
```

The binding consumes Chassis-normalized:

```text
profile
errors
warnings
metrics
```

and defines the display-ready model for the eventual FE-owned Wallet Profile
editor.

It does not own normalization, validation, mutation, JSON application, save, or
runtime balance mutation.

## Current presentation model

### Header

```text
Gameplay Wallet Definition
Wallet Profile
```

Current boundary copy is preserved:

```text
Author reusable currencies and their starting and allowed balance bounds.
Live balances remain isolated actor-owned Story state.
Crestfall Studio Coins are not part of this profile.
```

### Profile

The binding carries:

- title
- description
- enabled state

### Validation

Presentation states:

```text
VALID
WARNING
ERROR
```

Current valid copy:

```text
Wallet Profile definitions are valid.
```

### Currency Definitions

Per currency:

- typed definition version
- ID
- title
- symbol
- description
- enabled state
- tags
- starting balance
- minimum balance
- maximum balance

Current maximum:

```text
32 currencies
```

Balance values remain safe integers.

## Debt-like gameplay values

A negative `minimumBalance` is a supported creator-authored gameplay rule.

The binding presents it explicitly as:

```text
Debt-like balance allowed
```

with copy explaining that negative balances are permitted down to the authored
minimum.

This does **not** turn Wallet into a generic platform economy.

## Economy boundary

The source editor's boundary is preserved:

```text
A negative minimum balance is allowed when the creator intends a debt-like
wallet. Purchases, prices, exchange rates, escrow, and reserved funds are
separate economy layers and are not authored here.
```

The FE binding additionally makes the already-accepted product boundary explicit:

```text
Crestfall Studio Coins are not part of this profile.
```

So the Wallet Profile remains a reusable, creator-authored **gameplay** mechanic.

## Runtime state

The authored profile defines currency rules.

It does not contain:

- current actor balances
- spent balances
- account Coin balances
- purchase history
- platform wallet state

Those remain runtime/application state.

## JSON Editor & AI Guide

The source provides:

```text
JSON Editor & AI Guide
```

The ruled FE version remains:

```text
PENDING_FE_VISUAL_EXTENSION
```

while Chassis retains JSON validation/application authority.

## Main editor visual status

The main Wallet editor remains:

```text
PENDING_FE_VISUAL_BUILD
```

The semantic and presentation contracts are now ready for FE implementation
without copying the source legacy editor.

## One-line ESM correction

Like Skills, the accepted Wallet builder contract used an extensionless local
ESM import.

This patch changes:

```text
../wallet-profile-editor/WalletProfileEditor.contract
```

to:

```text
../wallet-profile-editor/WalletProfileEditor.contract.js
```

This is behavior-neutral under Next.js and allows the standalone Node diagnostic
to import the builder contract directly.

## Permanent boundary

Crestfall owns:

- profile normalization
- validation
- currency editor mutation
- JSON validation/application
- creation payload
- save/persistence
- actor current balances
- runtime Wallet mutation
- platform Studio Coin economy

Crestfall-fe owns:

- Wallet editor visual composition
- balance-bound presentation
- debt-like balance treatment
- validation presentation
- future JSON editor visual treatment
- semantic callbacks back into Chassis

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
