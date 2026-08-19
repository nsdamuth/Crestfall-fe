# Wallet Profile semantic package

Status: semantic contract and filled fixtures only.

This package is the third bounded Crestfall to Crestfall-fe functional
absorption slice for `WALLET_PROFILE`.

It intentionally does not add a production View, page entrypoint, application
ViewModel, API call, persistence path, JSON-editor presentation, or
editor-family integration.

## Product distinction

A Wallet Profile is a reusable **gameplay-currency definition asset** for the
Actor Mechanics `WALLET` domain.

It is not Crestfall Studio/account Coins.

Wallet Profiles define creator-authored in-game values such as:

- currency identity
- title and symbol
- enabled state
- starting balance
- minimum balance
- maximum balance
- tags
- definition metadata

Actor-owned mutable balances are Story runtime state and are never stored in
the authored Wallet Profile.

Studio/account Coins remain platform economy currency and are never reused as
gameplay Wallet state.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence
- application ViewModels and Binding Shells
- authoritative validation at save and commit boundaries
- actor-owned live Wallet balances
- mechanics execution and balance mutation
- Studio/account Coin economy policy

Crestfall-fe owns the eventual portable presentation contract, presentation
ViewModel, fixtures, and ruled V2 visual treatment.

## Included in this slice

- current Wallet Profile semantic contract
- builder identity/options contract
- empty fixture
- filled value-carrying fixture
- filled builder wrapper fixture
- semantic diagnostic

The filled fixture covers:

- ordinary positive gameplay currency
- a tightly bounded gameplay value
- an authored negative/debt floor
- starting/minimum/maximum balances
- symbols
- tags
- metadata
- multiple enabled currencies

Mutable actor balances and account Coin balances are intentionally absent.

## Deliberately not included yet

- `WalletProfileEditor.view.jsx`
- builder View
- presentation ViewModel
- JSON editor presentation
- `/app/studio/v2/**` changes
- `components/studio/my-creations/edit/**` changes
- Kit or design-system changes

The user-facing placement/name for this profile type remains a product/FE
ruling after the editor IA is finalized.
