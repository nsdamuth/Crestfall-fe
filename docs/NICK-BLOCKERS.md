# Nick blockers

Backend-blocked issues found during frontend work. Record only, not fixed here.

---

## 1. `app/stories/[...slug]/page.js` is a 0-byte file

The story detail route has no implementation at all. File exists but is empty,
no default export, no UI. Confirmed by direct file read.

## 2. `/studio/profile` crashes into the Next.js dev error overlay on mobile

The mobile render for this route shows a raw Next.js dev runtime-error overlay
instead of the profile hub, indicating an unrelated route crash. Desktop render
shows the standard sign-in gate. Needs backend/runtime investigation before this
route can be verified or redesigned.
