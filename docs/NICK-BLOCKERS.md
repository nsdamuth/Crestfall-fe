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

## 3. Character creator save failure, dev database only, live confirmed unaffected

See CR-004 and CR-005 in `docs/CONTRACT-REQUESTS.md` for the full writeup.
Live is confirmed unaffected: a test asset was created and saved successfully
on crestfall.net under a different account. The failure only reproduces
against the dev database, where the signed-in Supabase user has no row in
services-api's `users` table.

## 4. PostGraphile's error log is not visible from either app terminal

While investigating item 3, the real Postgres error was not findable from
either the Crestfall-fe terminal (port 3001) or the services-api terminal
(port 4000). It lives in a separate process: Docker container
`gallant_noyce`, image `crestfall-postgraphile`, the same process
listening on port 5678 that `POSTGRAPHILE_INTERNAL_URL` points to. Read it
with `docker logs gallant_noyce`.

This matters beyond this one bug: PostGraphile masks error text before
either app ever sees it, replacing the real message with a generic
"logged with hash" string and a correlation id. From the 3001 and 4000
terminals alone, a failed write and a successful one are indistinguishable,
both a masked failure and a clean success return without any local error
output. Anyone debugging a creations write that "did nothing" needs to
check this container's log, not either app's own terminal.

## 5. Non-backend items still open, not blocked on Nick

Found during the same investigation, neither is backend-blocked, recorded
here since this is where the rest of the session's findings live:

- Name field character counter reads 0/90 with text entered
  (`name-stop/NameStop.view.jsx`), even though `count={name.length}` looks
  correct on its face. Needs a fresh look at whether `formState.name` is
  actually reaching that prop at the point the stale count was seen.
- Four 404s on placeholder card images (`characters/lux`, `characters/red`,
  `locations/sun-hee-domain`, `images/placeholder-card`), traced to shared
  fixture/sample data (`data/creationAssets.js` and similar) referenced well
  outside the character creator package.
