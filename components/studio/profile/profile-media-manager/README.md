# ProfileMediaManager LOOM Boundary

## Public entry point

```text
components/studio/profile/ProfileMediaManager.jsx
```

The public component remains a small Binding Shell accepting the existing
`profile` prop.

## Portable View

```text
components/studio/profile/profile-media-manager/ProfileMediaManager.view.jsx
```

The View owns the bounded Profile Media panel, explanatory copy, the existing
disabled `Choose Soon` controls, and composition of the portable ProfileAvatar
and ProfileBanner Views.

It does not know profile storage fields or own media selection, generation,
upload, persistence, permissions, moderation, API calls, or profile editing.

## ViewModel

```text
components/studio/profile/profile-media-manager/useProfileMediaManagerViewModel.js
```

The ViewModel translates the raw profile into the display name used by the
avatar and supplies the current fixed future-facing media copy. It deliberately
preserves the existing stub behavior: the active avatar and banner are not yet
read from profile media and both selection actions remain disabled.

## Live caller

```text
components/studio/account/StudioAccountProfile.jsx
```

## Preview

```text
/dev/ui-preview/profile-media-manager
```

The preview renders contract-shaped fixture states only. It does not load a
profile, upload or generate media, call an API, or persist profile media.
