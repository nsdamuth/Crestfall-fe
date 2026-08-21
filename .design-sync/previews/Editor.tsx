// Editor previews. Editor.view.jsx is a pure, data-agnostic View — it never
// imports a Creation client or Next.js — so these stories hand-compose real
// EditorViewProps rather than reusing Editor.fixtures.js (which holds
// creation RECORDS, not view props; see .design-sync/NOTES.md). `groups`
// comes from the REAL resolver (resolveEditorPageGroups, creationEditConstants.js,
// pure data + lucide-react, no Next dependency) for creationType CHARACTER,
// filtered the same way useEditorViewModel filters it (the media group drops
// once artwork moves into the hero). `sectionNodes` are composed from the
// real, shipped field-grammar primitives (SharedFields, KitFormField) with
// ED1e-voice fixture content standing in for the live character sections
// (CharacterIdentitySection and kin), which are data-coupled and out of
// this sync's scope. SectionBox, TocList, SaveBlock, and SwitcherBlock are
// module-internal to Editor.view.jsx — not separately exported — so they
// are covered as labeled regions of these stories, not faked as standalone
// components.
import { useState } from "react";
import { ImageIcon } from "lucide-react";

import Editor from "@/app/studio/v2/editor/editor/Editor.view";
import {
  resolveEditorPageGroups,
  CHARACTER_EDIT_SECTIONS,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import KitBadge from "@/components/kit/KitBadge";
import {
  TextField,
  SelectField,
  NumberField,
  TextAreaField,
  ReadOnlyField,
  ActionPanel,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

// Mirrors useEditorViewModel's own group build exactly (app/studio/v2/editor/editor/useEditorViewModel.js):
// resolveEditorPageGroups returns {id, label, sectionIds, hostsMedia?}; the
// real ViewModel joins sectionIds against the section catalogue (there,
// shell.viewProps.activeSections; here, the same real CHARACTER_EDIT_SECTIONS
// catalogue), then drops any group left with no sections (artwork moved into
// the hero, so the media group disappears here exactly as it does live).
const SECTIONS_BY_ID = new Map(CHARACTER_EDIT_SECTIONS.map((section) => [section.id, section]));
const GROUPS = resolveEditorPageGroups("CHARACTER")
  .map((group) => ({
    id: group.id,
    label: group.label,
    sections: (group.sectionIds || []).map((id) => SECTIONS_BY_ID.get(id)).filter(Boolean),
  }))
  .filter((group) => group.sections.length > 0);

const FIX = {
  name: "Fen Ashgrove",
  title: "Coldwater Smuggler",
  species: "Human",
  gender: "Androgynous",
  roleArchetype: "Dock-born smuggler with court connections",
  bodyNotes:
    "Lean and travel-worn, with a coastal weather-tan and a scar along one forearm from a childhood net accident.",
  behaviorNotes:
    "Quick with a joke to defuse a room, slower to trust; keeps a level head under pressure.",
};

function sectionNodeFor(id: string) {
  switch (id) {
    case "overview":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <TextField label="Name" value={FIX.name} helperText="Shown across the site." />
          <TextField label="Title" value={FIX.title} />
          <ReadOnlyField label="Creation type" value="Character" />
        </div>
      );
    case "identity":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <SelectField
            label="Species"
            value={FIX.species}
            options={["Human", "Elf", "Half-Orc", "Other"]}
          />
          <SelectField
            label="Gender"
            value={FIX.gender}
            options={["Feminine", "Masculine", "Androgynous"]}
          />
          <TextAreaField
            label="Role / archetype"
            value={FIX.roleArchetype}
            maxLength={600}
            helperText="One or two sentences."
          />
        </div>
      );
    case "appearance":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <ActionPanel
            title="Trait pickers"
            body="Eye color, hair, skin tone, and build open in their own modal, backed by the modal frame."
            button="Choose eye color"
            disabled={false}
          />
          <TextAreaField label="Appearance notes" value="" placeholder="Anything the picker fields miss" maxLength={600} />
        </div>
      );
    case "body":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <TextAreaField label="Body notes" value={FIX.bodyNotes} maxLength={600} />
          <NumberField label="Height (cm)" value="178" />
        </div>
      );
    case "behavior":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <TextAreaField label="Behavior notes" value={FIX.behaviorNotes} maxLength={2000} />
        </div>
      );
    case "mechanicsProfile":
    case "runtimeModules":
      return (
        <ActionPanel
          title="Mechanics profile"
          body="Stats, pools, and progression attach here once a profile is assigned."
          button="Assign profile"
          disabled={false}
        />
      );
    case "advanced":
      return <TextAreaField label="Advanced prompting notes" value="" maxLength={32000} mono />;
    case "publishing":
      return (
        <div className="flex flex-col gap-[var(--space-4)]">
          <div className="flex items-center gap-[var(--space-2)]">
            <KitBadge label="Private" variant="status" surface="canvas" />
          </div>
          <SelectField label="Visibility" value="Private" options={["Private", "Unlisted", "Public"]} />
        </div>
      );
    case "danger":
      return (
        <ActionPanel
          title="Archive this character"
          body="Removes it from active play without deleting its history."
          button="Archive"
        />
      );
    default:
      return null;
  }
}

function Hero({ dirty = false }: { dirty?: boolean }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)] sm:flex-row">
      <div className="flex h-32 w-32 flex-none items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-faint)]">
        <ImageIcon size={28} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
          Character
        </p>
        <h1 className="mt-1 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
          {FIX.name}
        </h1>
        <p className="mt-1 flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {FIX.title}
          {dirty ? (
            <span className="h-[6px] w-[6px] rounded-[var(--radius-full)] bg-[var(--gold-action)]" aria-hidden="true" />
          ) : null}
        </p>
      </div>
    </div>
  );
}

function useEditorHarness(initial: { openSectionId?: string; sectionMarks?: Record<string, "dirty" | "saved"> } = {}) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    initial.openSectionId ?? GROUPS[0].sections[0].id,
  );
  const sectionNodes = Object.fromEntries(
    GROUPS.flatMap((group) => group.sections).map((section) => [section.id, sectionNodeFor(section.id)]),
  );
  return { groups: GROUPS, openSectionId, onOpenSection: setOpenSectionId, sectionNodes };
}

// Rest: first section open, rail clean, nothing dirty.
export function Rest() {
  const harness = useEditorHarness();
  return (
    <Editor
      {...harness}
      isDirty={false}
      saveStatus="idle"
      onSave={() => {}}
      onDiscard={() => {}}
      onOpenSwitcher={() => {}}
      backLabel="My Creations"
      onBack={() => {}}
      hero={<Hero />}
      mobileNavOpen={false}
      onToggleMobileNav={() => {}}
    />
  );
}

// Dirty: identity section open and edited, save/discard live in the rail.
export function Dirty() {
  const harness = useEditorHarness({ openSectionId: "identity" });
  return (
    <Editor
      {...harness}
      sectionMarks={{ identity: "dirty" }}
      isDirty
      saveStatus="idle"
      onSave={() => {}}
      onDiscard={() => {}}
      onOpenSwitcher={() => {}}
      backLabel="My Creations"
      onBack={() => {}}
      hero={<Hero dirty />}
      mobileNavOpen={false}
      onToggleMobileNav={() => {}}
    />
  );
}

// Saving: rail shows the in-flight spinner + word.
export function Saving() {
  const harness = useEditorHarness({ openSectionId: "identity" });
  return (
    <Editor
      {...harness}
      sectionMarks={{ identity: "dirty" }}
      isDirty
      saveStatus="saving"
      onSave={() => {}}
      onDiscard={() => {}}
      onOpenSwitcher={() => {}}
      backLabel="My Creations"
      onBack={() => {}}
      hero={<Hero dirty />}
      mobileNavOpen={false}
      onToggleMobileNav={() => {}}
    />
  );
}

// Error: save failed, plain-language copy in the rail and the mobile bar.
export function SaveError() {
  const harness = useEditorHarness({ openSectionId: "identity" });
  return (
    <Editor
      {...harness}
      sectionMarks={{ identity: "dirty" }}
      isDirty
      saveStatus="error"
      saveErrorCopy="Your changes could not be saved. Please try again."
      onSave={() => {}}
      onDiscard={() => {}}
      onOpenSwitcher={() => {}}
      backLabel="My Creations"
      onBack={() => {}}
      hero={<Hero dirty />}
      mobileNavOpen={false}
      onToggleMobileNav={() => {}}
    />
  );
}

// Loading: the skeleton state, before hero and sections mount.
export function Loading() {
  return (
    <Editor
      groups={[]}
      openSectionId={null}
      onOpenSection={() => {}}
      sectionNodes={{}}
      isDirty={false}
      saveStatus="idle"
      onSave={null}
      onDiscard={null}
      onOpenSwitcher={null}
      backLabel="My Creations"
      onBack={() => {}}
      hero={null}
      isLoading
      mobileNavOpen={false}
      onToggleMobileNav={() => {}}
    />
  );
}

// Mobile sections sheet open: switcher + save block + ToC in one sheet.
export function MobileSheetOpen() {
  const harness = useEditorHarness({ openSectionId: "identity" });
  return (
    <Editor
      {...harness}
      sectionMarks={{ identity: "dirty" }}
      isDirty
      saveStatus="idle"
      onSave={() => {}}
      onDiscard={() => {}}
      onOpenSwitcher={() => {}}
      backLabel="My Creations"
      onBack={() => {}}
      hero={<Hero dirty />}
      mobileNavOpen
      onToggleMobileNav={() => {}}
    />
  );
}
