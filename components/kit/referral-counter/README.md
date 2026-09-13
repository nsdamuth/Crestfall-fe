# KitReferralCounter

The referral bonus counter (fe/share-og follow-up 1, item 7, RULED 13
Sep 2026). One row on the signed-in account page
(`/studio/v2/account`, the page the sidebar's account control opens,
not the public creator profile), directly under the coins block.
Contract 1.0.0.

## What it shows

- Label "Referral bonus" with an "i" InfoTip carrying one sentence:
  "Earn coins when someone who opened your share link subscribes."
- The count from `referral.creditedCount` on the account snapshot
  (`/api/profile/me`, CR-073). Rendered 0 until served, never hidden.
  A missing, null, or malformed field folds to 0 in the ViewModel.
- No coin number anywhere. No policy link yet: it lands when a
  referral policy page exists (logged in bible/STATUS.md).

## Boundary

```text
AccountV2Live.view.jsx (the coins section, under the balance row)
  -> KitReferralCounter (Binding Shell, components/kit/KitReferralCounter.jsx)
       -> useKitReferralCounterViewModel   the fold to 0, the copy, the number format
       -> KitReferralCounter.view.jsx      presentation only
            -> ../form-field/InfoTip       the shared "i" tip recipe (44px at coarse pointers)
useAccountV2LiveViewModel.js
  -> studioAccountClient.normalizeStudioAccountPayload   referral: { creditedCount } (additive, 13 Sep 2026)
```

## Mounting

```jsx
<KitReferralCounter referral={account.referral} />
```

The shell accepts either `referral` (the snapshot's object) or a bare
`creditedCount`.

## Fixtures

zero, served, missing, longest. `kitReferralCounterDiagnostics.mjs`
asserts the three snapshot states fold correctly
(`npm run diagnostics:loom:referral-counter`).

## Layout law

One row inside the single column at 390; the tip anchors to the row
(the positioned ancestor) and opens above it, left-aligned, inside the
viewport; the "i" resolves to `--control-md` at coarse pointers.
