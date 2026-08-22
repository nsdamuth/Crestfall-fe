# design-sync NOTES

Repo-specific gotchas and known warns for the Crestfall Editor DS sync
(design/ds1-claude-design-sync). Read this before any re-sync.

## Session close, 21 Aug 2026

Gate 1 (Field Grammar) is closed: Brian ruled a direct pick, 1b "Tall
Rail" (Etched Ledger field anatomy, sections rail risen to hero top,
hero boxed into the form column as a floating panel; 1a and 1c
rejected). The ruled grammar is captured as nine DD-NN entries in
`docs/plans/ED1F-DESIGN-DELTAS.md`, and CR-047 through CR-053 are
filed in `docs/CONTRACT-REQUESTS.md` (tooltip component, chrome blur
tokens, bottom save bar vs. saved-pill deferred to Gate 2, the "+1"
save bloom, the saved-state success-hue adjustment, the sidebar
deviations bundle, and the four Gate 1 token candidates), both
committed at `539cdad`. Ground truth (real brand/icon assets, 12
live-app screenshots, and `GROUND-TRUTH.md`) is pushed into the
"Crestfall Editor DS" Claude Design project (projectId
`1e49c5d8-6ad8-4426-911d-2462c6e73642`). Gate 2 (hero architecture) is
open in that project awaiting Brian's ruling; nothing has been
proposed for it yet.

Branch: `design/ds1-claude-design-sync`, commit `539cdad`, working
tree clean, not pushed to any remote.

**Next action for a successor session:** once Brian rules Gate 2,
capture that ruling as the next wave of DD-NN entries in
`docs/plans/ED1F-DESIGN-DELTAS.md` (same format: family, ruling basis,
checkable conditions, token mapping against `app/theme.css` directly,
contract impact, propagation targets), following the same discipline
used for Gate 1: cite an existing locked token wherever one matches,
record a token candidate wherever none does, and never write a ruled
value as a silent literal.

## Shape

No Storybook. No standalone design-system package (no dist, no .d.ts).
This is a Next.js app; the scoped components are plain JSX under
`components/kit/`, `components/studio/`, and
`app/studio/v2/editor/editor/`. Converter runs in synth-entry mode
against `.design-sync/entry.jsx`. `.d.ts` props are hand-written in
`config.json` `dtsPropsFor`, transcribed strictly from each real
`*.contract.js` file (a JSDoc `@typedef`, not TypeScript); nothing
invented.

## Scope (Project 1, per Brian's ruling)

Frame: StudioShell, StudioSidebar, StudioTopBar, StudioMobileNav (via
shims replacing Next bindings with `InternalLinkComponent="a"` and a
static `economySlot`/`drawerEconomySlot`).
Editor: `app/studio/v2/editor/editor/Editor.view.jsx`, exported as
`Editor`. Its fixtures are creation records, not view props: the
Editor previews hand-compose `EditorViewProps` from the real
`resolveEditorPageGroups`/`typeMeta` shape and SharedFields/KitFormField
primitives, not the fixtures module directly.
Kit: KitFormField, KitDropdown, KitModalFrame, KitBadge, KitFilterChip.
Field grammar: SharedFields.jsx named exports (TextField, SelectField,
NumberField, TextAreaField, ReadOnlyField, SectionTitle, ActionPanel).
Supporting: ModalShell (components/ui/modal-shell).

Deferred (do not sync, logged with reason): data-coupled section
containers (CharacterIdentitySection etc.), character modals
(EyeColorModal, HairModal, TraitModal, etc.), the legacy
CreationEditShell view, StudioPageHeader. No tooltip component exists
anywhere in the v2 editor's real render tree; this is a genuine gap,
not an oversight; Claude Design designs one from scratch and it is
logged as CR-047.

## Fonts

Cormorant Garamond (400-700) + Inter load via next/font/google in
app/layout.js; --font-logo names Cinzel but the app never actually
loads it (falls back to Cormorant Garamond). No font files ship in
public/. The bundle ships a Google Fonts @import for all three
families (Cinzel included, since it's named in the token law even
though unused today) rather than omitting Cinzel.

## Tailwind v4

CSS-first config, no tailwind.config.*. The compiled styles.css is
produced by running the app's own `@tailwindcss/cli` against
`.design-sync/tailwind-entry.css`, which @imports app/theme.css,
app/token-bridge.css, app/design-system.css (exact globals.css cascade
order) then `@import "tailwindcss"` with `@source` scoped to only the
synced component files, never docs/, mirroring the app's own scanner
guard in app/globals.css.

## Known render warns

- `ModalShell` [RENDER_THIN] (measured height 0px) and `StudioMobileNav`
  [RENDER_BLANK] (<5KB PNG) both trip package-validate.mjs's mechanical
  render check every build. Confirmed benign by eye (review-grid
  screenshots + the mechanical single-card screenshot): both components'
  interesting content lives inside a `position: fixed` overlay
  (ModalShell's centered panel; StudioMobileNav's drawer), which does not
  contribute to the parent's normal-flow bounding box, so headless
  Chromium measures ~0px height / a tiny cropped PNG even though the DOM
  content is fully present and correctly styled. Re-syncs should expect
  these two warns every time; they are not new regressions to chase.
- The package-capture.mjs REVIEW-grid screenshots for `StudioShell` and
  `StudioSidebar` render blank (their full-viewport chrome apparently
  exceeds the review grid's per-cell capture width/height). The
  MECHANICAL render check's own single-card screenshot
  (`_screenshots/studio-shell__StudioShell.png`,
  `_screenshots/studio-sidebar__StudioSidebar.png`) shows both correctly
  and fully. Grade these two from the mechanical screenshot, not the
  review-grid one.
- Editor's mobile bottom bar (`fixed bottom-0`, `lg:hidden`) is not
  visible in the review-grid screenshots for the Dirty/Saving/SaveError
  stories at the grid's capture width, for the same fixed-position
  reason. The mechanical single-card screenshot of the Rest story (at a
  wider viewport) correctly shows the sticky rail instead (rail is
  `hidden lg:block`, so the two are mutually exclusive by width, not a
  sign one is broken). Worth a manual check of `saveStatus="saving"` and
  `"error"` in the live web-app smoke test to visually confirm the rail
  copy at desktop width and the bottom-bar copy at mobile width.

## Manual step every rebuild: copy the raw token files into ds-bundle/tokens/

`cfg.tokensGlob`/`cfg.tokensPkg` (lib/css.mjs copyTokens) only fire when
`tokensPkg` names a sibling node_modules PACKAGE; they no-op entirely for
plain repo files like ours (theme.css/token-bridge.css/design-system.css
sit directly in `app/`, not in a tokens package), so `ds-bundle/tokens/`
comes out of package-build.mjs EMPTY every time; this was caught only
by checking the output directory by hand, not by any validator warning.
The token VALUES still ship correctly regardless (they're fully baked
into the compiled `styles.css`/`_ds_bundle.css` via
`.design-sync/tailwind-entry.css`'s `@import`s, confirmed by
package-validate.mjs's "tokens: N defined, M referenced" line), so
rendering is never wrong; what's missing without this step is the
raw, commented source files for the design agent to read directly per
the conventions header's "where the truth lives" pointer.

Removed `tokensGlob` from config.json (it was silently inert) rather
than leave a config key that implies automatic handling. Until this
gets a real fix (a tiny postbuild copy step, or a
`.design-sync/overrides/` script), run this after every
`package-build.mjs` and before any upload:

```sh
cp app/theme.css app/token-bridge.css app/design-system.css ds-bundle/tokens/
```

## Next re-sync task (from Brian's web-app smoke test, 21 Aug 2026)

The Claude Design self-check reported two token-metadata warnings on
the pushed project. Both are cosmetic classification nits, not law or
visual problems, confirmed by Brian, not fixed in this pass, not
worth a re-sync on their own. Fold into whichever re-sync happens next:

- Tailwind's own internal `space-y-*` utility custom properties (e.g.
  `--tw-space-y-reverse` and kin, emitted by the compiled styles.css's
  base/utilities layers) are being picked up by the app's self-check as
  if they were design tokens, rather than recognized as Tailwind
  internals. Likely needs an exclusion pattern in whatever reads
  `tokens/*.css` for its token inventory (either upstream in the
  claude.ai/design self-check, or by not shipping Tailwind's generated
  utility CSS under `tokens/` alongside the real token source files;
  worth checking whether `_ds_bundle.css`/`styles.css` is where these
  actually belong instead).
- 38 real tokens (from the copied `tokens/theme.css` /
  `token-bridge.css` / `design-system.css`) are missing a `@kind`
  classification comment the self-check wants for its metadata. Since
  `app/theme.css` is the locked, Brian-owned law file (per
  `docs/DESIGN-TOKENS.md`), adding `@kind` annotations means either (a)
  a small config-side mapping this sync's build step injects without
  touching the real product file, or (b) proposing the annotation
  convention back to the product repo as a genuine doc change, that's
  a real decision, not a mechanical fix, and shouldn't be made
  unilaterally. Surface the 38-token list and both options at the start
  of the next re-sync rather than guessing which one Brian wants.

## Re-sync risks

- **`process.env` polyfill is a standing fork, not a config value.**
  `.design-sync/shims/processPolyfill.js` (imported for its side effect
  by StudioSidebarShim.jsx) hardcodes `NODE_ENV: "production"` so
  `lib/shared/flags/sidebarV2Preview.js`'s `isSidebarV2PreviewEnabled()`
  doesn't throw `process is not defined` outside Next.js. If the repo
  ever adds a SECOND `process.env.*` reader reachable from this sync's
  scope, it needs the same treatment (esbuild's define only covers the
  literal keys package-build.mjs's bundle.mjs sets, `process.env.NODE_ENV`;
  anything else throws at the point it's actually read, not at build
  time, so a re-sync's clean build does not prove this is safe; only the
  render check catching a fresh `ReferenceError` does).
- **The Editor preview's `groups`/`sectionNodes` are hand-composed, not
  pulled from `Editor.fixtures.js`** (which holds creation records, the
  shape `useCreationEditViewModel` hydrates, not `EditorViewProps`). If
  `CHARACTER_EDIT_SECTIONS` or `CREATION_TYPE_EDITOR_PAGE_GROUPS.CHARACTER`
  in `components/studio/my-creations/edit/creationEditConstants.js`
  changes shape, `.design-sync/previews/Editor.tsx`'s `GROUPS` derivation
  (which mirrors `useEditorViewModel.js`'s own group-build logic by hand)
  needs the same update or it silently goes stale.
- **`docsMap` pins 12 of 18 components to READMEs the sibling-match
  heuristic could not find on its own** (Kit pieces live in dirs named
  without their "Kit" prefix, e.g. `components/kit/badge/`, so
  `slug("badge") !== slug("KitBadge")`). If any of those README.md files
  move or get renamed, the docsMap entry silently stops resolving
  (falls through to a synthesized `.prompt.md` from the `.d.ts` alone,
  no error); worth a periodic `ls` check against the docsMap paths.
- **`@types/react` is not installed** anywhere `--node-modules` can see,
  so `[DTS_REACT]` fires on every build. Harmless here only because
  every one of the 18 components has an explicit `dtsPropsFor` override
  (never relies on ts-morph's own prop extraction); if a future
  component is added WITHOUT a `dtsPropsFor` entry, its `.d.ts` will
  emit an empty body silently unless this is fixed first
  (`npm i -D @types/react` in `.ds-sync/`, or a dedicated `--node-modules`
  target that has it).
- **8 of 18 components ship without an authored preview**
  (TextField, SelectField, NumberField, TextAreaField, ReadOnlyField,
  ActionPanel, KitFilterChip, StudioTopBar). All render cleanly via
  smartDefaultProps (not literal floor cards, `fallbackCard: false` for
  all eight), genuinely usable, just generic. Authoring real previews
  for these is the natural next incremental pass; they carry forward at
  zero cost until then.
