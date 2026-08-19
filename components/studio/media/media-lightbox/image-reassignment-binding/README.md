# Media Lightbox ↔ Image Reassignment binding

Status: **WIRED**.

W20 closes the accepted Image Reassignment seam in the shared Media Lightbox
and Creation Image Library.

The live Media Lightbox ViewModel owns current Chassis-equivalent application
orchestration:

- source Creation identity resolution;
- reassignment-context loading;
- destination selection state;
- reassignment POST mutation;
- success/error state;
- source-detail invalidation;
- post-success callback.

The accepted
`media_lightbox_image_reassignment_binding_v1`
is now the actual display projection used by the ViewModel. It owns the
display-ready action/dialog model: ownership copy, move-not-copy semantics,
Coin cost, loading/submitting/success/error states, empty-target messaging, and
submit/close labels.

The FE-owned Media Lightbox View renders that model without importing media
clients or persistence logic.

`MediaLightbox` advances from contract `1.0.0` to `1.1.0` for the reassignment
action/dialog surface.

Chassis remains authoritative for eligibility, owned target discovery,
transaction enforcement, Coin spend, reassignment persistence, and source
featured/reference clearing.
