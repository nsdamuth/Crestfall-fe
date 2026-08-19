# Creation Profile ↔ Library Pass binding

Status: **WIRED**.

W18 closes the live public Creation Profile Library Pass seam.

Exact Chassis deployment mirrors now provide Library Pass client requests and
public application state/purchase orchestration.

The Profile ViewModel merges that behavior into the already accepted W2
opening-Location implementation instead of replacing the whole file with the
older source copy.

The public preview boundary is enforced before reaction actions and lightbox
composition. Locked media routes to the Library Pass purchase flow.

The FE Profile presents the Extended Image Library panel, locked tiles, purchase
dialog, price/balance, insufficient-coins state, owner/entitled/sales-paused
states, one-time purchase semantics, future additions, and purchase feedback.

The Profile View contract advances:

```text
creation-profile-page.view.v1
→ creation-profile-page.view.v2
```

while retaining W2's `openingLocationPicker`.

Chassis remains purchase/state authority; FE remains presentation authority.
