## Crestfall Editor DS: conventions for building with these components

This bundle is a curated slice of a live Next.js app (Crestfall), not a
standalone design-system package. Everything here is real, shipped code;
nothing is a lookalike. Read this before composing a new design with it.

### Styling idiom

Every value is a CSS custom property (a token), consumed as a Tailwind
arbitrary value: `text-[length:var(--text-body)]`, `bg-[var(--surface-2)]`,
`rounded-[var(--radius-md)]`, `border-[var(--line-whisper)]`. There is no
separate "theme" object and no CSS-in-JS. Compose new layout with the same
pattern: pick a token, wrap it in the matching Tailwind arbitrary-value
utility. Never write a raw hex, a raw pixel size, or a bare `rounded-lg`.

Key families (see `tokens/theme.css` for the full, authoritative list):
- Surfaces: `--canvas`, `--surface-1` through `--surface-4` (darkest to
  lightest panel depth). One bordered depth per page column: the section
  box is `--surface-2`; a field bed inside it is `--surface-1`. Never
  nest a second bordered panel inside a section box.
- Ink: `--ink` (entered values), `--ink-dim` / `--ink-faint` (labels,
  helper text, placeholders — never for a value the user typed).
- Gold: `--gold-ornament` (decoration: eyebrows, dividers), `--gold-action`
  (interactive: focus rings, selected states), `--gold-bright` (the
  brightest accent, used sparingly for a selected value).
- Status: `--status-success` / `--status-warning` / `--status-danger` plus
  their `-bed`/`-border` variants. State only, never decoration; always
  pair the color with a word (never color alone).
- Lines: `--line-whisper` (quiet, rest state) → `--line` (open/hover) →
  `--line-strong` (a stronger boundary need). One consistent step per
  interaction, never a heavy or doubled border.
- Type scale: `--text-label` (11px, the floor) through `--text-display`
  (40px), each with a matching `--lh-*` line-height token. Weights stop at
  `--weight-medium` (500) for anything but the display faces.
- Spacing/radius/control sizing: `--space-1` through `--space-20` (strict
  4px multiples), `--radius-xs/sm/md/lg/full`, `--control-sm/md/lg` (44px
  is the touch-target floor, `--control-md`).
- Fonts: `--font-display` (Cormorant Garamond, headings), `--font-sans`
  (Inter, everything else), `--font-logo` (Cinzel, brand only). Loaded via
  a Google Fonts `@import` in `styles.css` — no local font files ship.

### Field grammar

`KitFormField` is the whole field anatomy in one component: label, input
bed, helper line, error line, success line, an optional character counter,
and an optional fold (disclosure header over a nested field group). Pick a
`variant` ("text" | "textarea" | "select" | "number") rather than composing
raw `<input>`/`<select>` elements. The "select" variant composes
`KitDropdown` internally (a popover at 700px and up, a bottom sheet below
it) — never build a custom dropdown.

The `TextField` / `SelectField` / `NumberField` / `TextAreaField` /
`ReadOnlyField` primitives are the same grammar pre-wired for the advanced
editor's own voice (they're thin wrappers most of which delegate straight
to `KitFormField`). Use these when composing an editor-style section;
use `KitFormField` directly for anything outside that context.

`ReadOnlyField` has no bed at all — a bed always means "editable"; its
absence always means "read-only." Never fake a read-only field with a
disabled input.

### Structural pieces

`Editor` is the accordion-of-section-boxes-plus-sticky-rail page shell
(hero slot, one open section at a time, a right rail on desktop carrying
the creation switcher + always-visible save block + table of contents,
collapsing to a bottom bar and sheet on mobile). Compose a new page inside
it by supplying `groups` (id/label/sections) and `sectionNodes` (one
ReactNode per section id) — never rebuild the accordion/rail chrome by
hand.

`StudioShell` / `StudioSidebar` / `StudioTopBar` / `StudioMobileNav` are
the persistent app frame (sidebar nav, top bar with search/notifications,
mobile drawer + bottom dock). Compose a new studio page inside
`StudioShell`'s children slot; never rebuild sidebar/top-bar navigation
from scratch.

`KitModalFrame` is the one modal/sheet/viewer frame in the system —
three variants (`"modal"`, `"sheet"`, `"viewer"`), picking the smallest
tier that fits the content. `ModalShell` underneath it is the raw
behavioral primitive (overlay, scrim, escape, scroll lock); build new
overlays on `KitModalFrame`, not directly on `ModalShell`.

`KitBadge` is a non-interactive label (canon/status/meta on canvas/art).
`KitFilterChip` is the interactive, clickable equivalent — a badge is
never clickable; a chip always can be.

### Where the truth lives

Read `tokens/theme.css`, `tokens/token-bridge.css`, and
`tokens/design-system.css` directly before styling anything new — they are
the complete, real token law this bundle ships against, copied verbatim.
Each component's own `.d.ts` and `.prompt.md` (in its `components/<group>/
<Name>/` folder) documents its real prop contract.

### One idiomatic build snippet

```jsx
<Editor
  groups={[{ id: "identity", label: "Identity", sections: [{ id: "overview", label: "Overview" }] }]}
  openSectionId="overview"
  onOpenSection={setOpenSectionId}
  sectionNodes={{
    overview: (
      <div className="flex flex-col gap-[var(--space-4)]">
        <TextField label="Name" value={name} onChange={setName} helperText="Shown across the site." />
        <SelectField label="Species" value={species} onChange={setSpecies} options={["Human", "Elf"]} />
      </div>
    ),
  }}
  isDirty={isDirty}
  saveStatus={saveStatus}
  onSave={handleSave}
  onDiscard={handleDiscard}
  onOpenSwitcher={handleOpenSwitcher}
  backLabel="My Creations"
  onBack={handleBack}
  hero={<MyHero />}
  mobileNavOpen={mobileNavOpen}
  onToggleMobileNav={handleToggleMobileNav}
/>
```

### Known gaps (not fabricated, logged instead)

- **No tooltip component exists anywhere in this bundle's real source
  tree.** `KitDropdown` options carry an optional `tooltip` string
  rendered via the native `title` attribute as a documented interim (see
  its own `.d.ts`), not a designed tooltip pattern. Logged as CR-047 in
  `docs/CONTRACT-REQUESTS.md`.
- Buttons are the `.cf-btn` / `.cf-btn--primary` / `.cf-btn--secondary`
  CSS utility family in `tokens/design-system.css`, not a JS component —
  compose them as plain `<button className="cf-btn cf-btn--primary">`.
