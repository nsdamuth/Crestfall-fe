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

(populated during the self-heal loop; none yet)

## Re-sync risks

(populated at close-out; none yet — first sync in progress)
