# design-sync NOTES

Repo-specific gotchas and known warns for the Crestfall Editor DS sync
(design/ds1-claude-design-sync). Read this before any re-sync.

## Shape

No Storybook. No standalone design-system package (no dist, no .d.ts).
This is a Next.js app; the scoped components are plain JSX under
`components/kit/`, `components/studio/`, and
`app/studio/v2/editor/editor/`. Converter runs in synth-entry mode
against `.design-sync/entry.jsx`. `.d.ts` props are hand-written in
`config.json` `dtsPropsFor`, transcribed strictly from each real
`*.contract.js` file (a JSDoc `@typedef`, not TypeScript) — nothing
invented.

## Scope (Project 1, per Brian's ruling)

Frame: StudioShell, StudioSidebar, StudioTopBar, StudioMobileNav (via
shims replacing Next bindings with `InternalLinkComponent="a"` and a
static `economySlot`/`drawerEconomySlot`).
Editor: `app/studio/v2/editor/editor/Editor.view.jsx`, exported as
`Editor`. Its fixtures are creation records, not view props — the
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
anywhere in the v2 editor's real render tree — this is a genuine gap,
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
synced component files — never docs/, mirroring the app's own scanner
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

## Re-sync risks

- **`process.env` polyfill is a standing fork, not a config value.**
  `.design-sync/shims/processPolyfill.js` (imported for its side effect
  by StudioSidebarShim.jsx) hardcodes `NODE_ENV: "production"` so
  `lib/shared/flags/sidebarV2Preview.js`'s `isSidebarV2PreviewEnabled()`
  doesn't throw `process is not defined` outside Next.js. If the repo
  ever adds a SECOND `process.env.*` reader reachable from this sync's
  scope, it needs the same treatment (esbuild's define only covers the
  literal keys package-build.mjs's bundle.mjs sets, `process.env.NODE_ENV`
  — anything else throws at the point it's actually read, not at build
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
  no error) — worth a periodic `ls` check against the docsMap paths.
- **`@types/react` is not installed** anywhere `--node-modules` can see,
  so `[DTS_REACT]` fires on every build. Harmless here only because
  every one of the 18 components has an explicit `dtsPropsFor` override
  (never relies on ts-morph's own prop extraction) — if a future
  component is added WITHOUT a `dtsPropsFor` entry, its `.d.ts` will
  emit an empty body silently unless this is fixed first
  (`npm i -D @types/react` in `.ds-sync/`, or a dedicated `--node-modules`
  target that has it).
- **8 of 18 components ship without an authored preview**
  (TextField, SelectField, NumberField, TextAreaField, ReadOnlyField,
  ActionPanel, KitFilterChip, StudioTopBar). All render cleanly via
  smartDefaultProps (not literal floor cards, `fallbackCard: false` for
  all eight) — genuinely usable, just generic. Authoring real previews
  for these is the natural next incremental pass; they carry forward at
  zero cost until then.
