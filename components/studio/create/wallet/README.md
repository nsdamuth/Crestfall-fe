# Wallet Profile LOOM Authoring

`WALLET_PROFILE` is the reusable gameplay-currency definition asset for the
Actor Mechanics Profile `WALLET` domain.

## Boundaries

- The profile owns currency identity, title, symbol, enabled state, starting
  balance, minimum balance, maximum balance, tags, and definition metadata.
- Actor-owned mutable balances are Story runtime state and are never stored in
  the profile.
- Crestfall Studio/account Coins are product currency and are never reused as
  gameplay Wallet state.
- The visual editor and JSON editor do not call product APIs.
- The builder ViewModel saves through
  `lib/client/studio/wallet/walletClient.js`, which reuses the standard Creation
  client path.

## Route

`/studio/create/wallet-profile`

Saved Wallet Profiles are edited through the normal Creation Edit shell.
