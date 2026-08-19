# Public Studio Anonymous Access presentation semantics

Status: semantic shell/access presentation contract and realistic fixtures only.

This package brings the current anonymous public-Studio behavior into the FE
lane without moving routing, authentication, account loading, or media
visibility authority out of Crestfall.

## Current Chassis contract

Current anonymous public Studio surfaces are:

```text
/studio/community
/studio/creations/[id]
/studio/profile/[username]
```

Those routes are Chassis authority. They are listed here only as the current
product behavior that the presentation package must be able to render.

All other Studio routes remain protected by default.

## Anonymous public shell

When an anonymous visitor is on an eligible public Studio surface, the current
shell presentation is:

```text
Crestfall
Studio
Community
Sign In
```

Private Studio chrome is hidden:

- Studio Sidebar
- Studio Mobile Nav
- Studio Top Bar

Anonymous public presentation must not depend on private Studio account state.

## Authenticated shell

Authenticated users continue to receive the normal private Studio shell even
when viewing a public Community/Creation/Profile surface.

## Public media

Public media authentication is not a frontend visibility rule.

The current Chassis/API contract allows public-media file requests to proceed
without an authenticated user, while services-api remains authoritative for
whether the image is actually viewable.

Therefore this FE package deliberately represents:

```text
ALLOW_SERVICE_AUTHORITY_TO_DECIDE_VISIBILITY
```

It does not hide otherwise-public media merely because the viewer is anonymous.

## Permanent boundary

Crestfall owns:

- Next route groups
- protected Studio redirect to `/login`
- optional Supabase session lookup on public Studio routes
- `StudioAccountProvider` enable/disable behavior
- private account loading
- optional media-file authentication forwarding
- services-api image visibility authorization

Crestfall-fe owns:

- anonymous vs authenticated shell presentation
- public header presentation
- Sign In CTA presentation
- private-chrome suppression in anonymous public mode

The FE package does not perform redirects and does not determine whether a URL
is actually public.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
