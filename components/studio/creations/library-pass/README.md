# Creation Library Pass presentation semantics

Status: semantic presentation contract and realistic fixtures only.

This package brings current Library Pass functionality into the FE lane without
copying the legacy public/owner Views or application ViewModels.

## Permanent boundary

Crestfall owns:

- Library Pass state loading
- purchase idempotency
- account balance refresh
- authoritative Coin debit
- purchase mutation
- entitlement creation/restoration
- owner sales enable/pause mutation
- API routes and client orchestration

Crestfall-fe owns presentation of the display-ready state.

This package therefore contains **pure projection helpers only**. It has no
React hooks, no client/API imports, no persistence, and no business mutation.

## Current product semantics represented

Policy defaults represented by the filled fixtures:

```text
Public previews: 4
Standard price: 250 Coins
Expanded price: 1,000 Coins
Expanded threshold: 100 eligible images
Creator reward: 10%
Future eligible additions: included
```

Presentation states covered:

- public preview plus locked media
- active pass access
- owner access
- sales paused
- insufficient balance
- purchase modal ready state
- expanded-tier owner state
- owner sales action labels

## Visual integration ruling

The FE review ruled:

- public status uses a quiet in-page status treatment;
- purchase uses `KitModalFrame`;
- modal owns success/error state rather than a toast;
- owner sales controls land in the advanced editor Publishing section;
- the V2 View is never replaced wholesale with the legacy View.

Those visual integrations are intentionally not part of this patch.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
