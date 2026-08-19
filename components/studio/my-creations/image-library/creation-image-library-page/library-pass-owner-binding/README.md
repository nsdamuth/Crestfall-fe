# Creation Image Library ↔ Library Pass owner binding

Status: **WIRED**.

W19 closes the creator/owner Library Pass surface in the Creation Image Library.

The live page now consumes the accepted
`creation_image_library_library_pass_owner_binding_v1` projection.

The dedicated owner application ViewModel is an exact Chassis deployment mirror
and owns state loading, sales pause/resume mutation, success/error state, and
post-mutation refresh.

The main Image Library ViewModel composes that owner state through the accepted
binding rather than duplicating owner-pricing semantics.

The FE-owned page renders the binding's metrics/action/tier/warning model:
current price, eligible images, public previews, creator reward, standard vs
expanded tier, sales-paused purchaser retention, public/approved enablement
guard, and loading/saving/success/error states.

The Image Library contract advances `1.0.0 -> 1.1.0` for the owner panel and
toggle callback only.

W19 intentionally does not absorb the separate current-source image reassignment
changes. Existing FE styling and `showBackLink` behavior remain authoritative.
