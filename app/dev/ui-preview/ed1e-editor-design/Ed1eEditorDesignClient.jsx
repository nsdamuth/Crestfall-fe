"use client";

// ED1e exemplar renders. Every value resolves to an existing token
// (docs/DESIGN-TOKENS.md). Fixture values are copied from the ED1d
// Character Template fixture, not imported, so this harness has zero
// coupling to shipped editor components.
// Views: three Gate 1 grammar variants of the full exemplar page,
// three Gate 2 hero variants, the field specimen sheet, the standard
// modal, and the rail plus mobile sheet.

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  SquarePen,
  X,
} from "lucide-react";

const ART = encodeURI(
  "/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"
);

const FIX = {
  title: "Vermillion Coast Rogue Template",
  type: "Character Template",
  visibility: "Unlisted",
  description:
    "A reusable rogue archetype seeded for Vermillion Coast player characters.",
  defaultName: "Fen Ashgrove",
  defaultTitle: "Coldwater Smuggler",
  species: "Human",
  gender: "Androgynous",
  roleArchetype: "Dock-born smuggler with court connections",
  bodyNotes:
    "The scribe's testimony ran across four sealed scrolls, each annotated by a different hand of the Court Archive, and no two agreed entirely on the order of events.",
};

// Gate 1 grammar variants. Only the field-label treatment changes;
// everything else is identical across A, B, C by design.
const GRAMMAR = {
  a: {
    name: "Option A: Quiet",
    recommended: true,
    label:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]",
    focusLabel:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]",
  },
  b: {
    name: "Option B: Gilded",
    recommended: false,
    label:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]",
    focusLabel:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]",
  },
  c: {
    name: "Option C: Blended",
    recommended: false,
    label:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]",
    focusLabel:
      "text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]",
  },
};

const DISPLAY = "font-[family-name:var(--font-display)]";
const BED =
  "w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]";
const HELPER =
  "text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]";
const COUNTER =
  "text-[length:var(--text-label)] leading-[var(--lh-label)] tabular-nums text-[var(--ink-faint)]";

function Eyebrow({ children }) {
  return (
    <span className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
      {children}
      <span
        aria-hidden
        className="h-px w-[var(--space-8)]"
        style={{ background: "var(--grad-rule)" }}
      />
    </span>
  );
}

function GroupLabel({ children }) {
  return (
    <div className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      {children}
      <span
        aria-hidden
        className="h-px w-[var(--space-6)]"
        style={{ background: "var(--grad-rule)" }}
      />
    </div>
  );
}

function LabelRow({ label, counter, grammar, focused }) {
  const cls = focused ? grammar.focusLabel : grammar.label;
  return (
    <div className="mb-[var(--space-1)] flex items-baseline justify-between gap-[var(--space-3)]">
      <span className={cls}>{label}</span>
      {counter ? <span className={COUNTER}>{counter}</span> : null}
    </div>
  );
}

function TextFieldDemo({ label, value, grammar, focused, placeholder }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} focused={focused} />
      <div
        className={`${BED} flex items-center ${
          focused ? "border-[var(--gold-action)]" : ""
        }`}
      >
        <span
          className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
          style={{
            maskImage:
              "linear-gradient(90deg, black calc(100% - var(--space-6)), transparent)",
          }}
        >
          {value ? (
            value
          ) : (
            <span className="text-[var(--ink-faint)]">{placeholder}</span>
          )}
        </span>
      </div>
    </div>
  );
}

function SelectDemo({ label, value, grammar, open }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} />
      <div
        className={`${BED} flex items-center justify-between gap-[var(--space-3)] ${
          open ? "border-[var(--gold-action)]" : ""
        }`}
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--ink-dim)] ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open ? (
        <div className="mt-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-1)] shadow-[var(--shadow-popover)]">
          {["Human", "Elf", "Tiefling", "Custom"].map((opt) => (
            <div
              key={opt}
              className={`flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
                opt === value
                  ? "text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)]"
              }`}
            >
              <span className="w-[var(--space-4)]">
                {opt === value ? <Check size={14} /> : null}
              </span>
              {opt}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Picker field: the modal-backed trait control as a FIELD, not a
// bordered panel. The edit glyph says "opens a dialog".
function PickerDemo({ label, value, grammar, placeholder }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} />
      <div className={`${BED} flex items-center justify-between gap-[var(--space-3)]`}>
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-[var(--ink-faint)]">
            {placeholder || "Not chosen"}
          </span>
        )}
        <SquarePen size={15} className="shrink-0 text-[var(--ink-dim)]" />
      </div>
    </div>
  );
}

function ProseDemo({ label, value, grammar, expanded, counter, helper, danger }) {
  return (
    <div>
      <LabelRow
        label={label}
        grammar={grammar}
        focused={expanded}
        counter={
          counter ? (
            <span className={danger ? "text-[var(--status-danger)]" : ""}>
              {counter}
              {danger ? " limit" : ""}
            </span>
          ) : null
        }
      />
      {expanded ? (
        <div
          className={`${BED} border-[var(--gold-action)]`}
          style={{ minHeight: "7.5rem" }}
        >
          {value}
        </div>
      ) : (
        <div className={`${BED} flex items-center justify-between gap-[var(--space-3)]`}>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {value || (
              <span className="text-[var(--ink-faint)]">Add notes</span>
            )}
          </span>
          <ChevronDown size={15} className="shrink-0 text-[var(--ink-faint)]" />
        </div>
      )}
      {helper ? <p className={`mt-[var(--space-2)] ${HELPER}`}>{helper}</p> : null}
    </div>
  );
}

function ReadOnlyDemo({ label, value, grammar }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} />
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {value}
      </p>
    </div>
  );
}

function ToggleDemo({ label, on, word, grammar }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} />
      <div className="flex min-h-[var(--control-md)] items-center gap-[var(--space-3)]">
        <span
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-[var(--radius-full)] border ${
            on
              ? "border-[var(--gold-action)] bg-[var(--gold-action)]"
              : "border-[var(--line)] bg-[var(--surface-1)]"
          }`}
        >
          <span
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-[var(--radius-full)] ${
              on
                ? "right-1 bg-[var(--tag-fill-ink)]"
                : "left-1 bg-[var(--ink-faint)]"
            }`}
          />
        </span>
        <span className={HELPER}>{word}</span>
      </div>
    </div>
  );
}

function DisabledDemo({ label, value, grammar }) {
  return (
    <div>
      <div className="mb-[var(--space-1)] flex items-baseline justify-between gap-[var(--space-3)]">
        <span className={grammar.label}>{label}</span>
        <span className={COUNTER}>Soon</span>
      </div>
      <div className={`${BED} cursor-not-allowed opacity-[var(--state-disabled-opacity)]`}>
        {value}
      </div>
    </div>
  );
}

function ErrorDemo({ label, value, grammar }) {
  return (
    <div>
      <LabelRow label={label} grammar={grammar} />
      <div className={`${BED} border-[var(--status-danger-border)]`}>{value}</div>
      <p className="mt-[var(--space-2)] flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
        <span className="h-1.5 w-1.5 rounded-[var(--radius-full)] bg-[var(--status-danger)]" />
        This name is already in use. Pick another.
      </p>
    </div>
  );
}

function InsetRule() {
  return (
    <div className="mt-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]" />
  );
}

function SectionBox({ title, open, mark, children }) {
  return (
    <section
      className={`rounded-[var(--radius-lg)] border bg-[var(--surface-2)] ${
        open ? "border-[var(--line)]" : "border-[var(--line-whisper)]"
      }`}
    >
      <div className="flex min-h-[var(--control-lg)] items-center justify-between gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-2)]">
        <span
          className={`${DISPLAY} flex items-center gap-[var(--space-2)] text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]`}
        >
          {title}
          {mark === "dirty" ? (
            <span className="h-1.5 w-1.5 rounded-[var(--radius-full)] bg-[var(--gold-action)]" />
          ) : null}
          {mark === "saved" ? (
            <Check size={14} className="text-[var(--status-success)]" />
          ) : null}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-[var(--ink-dim)]" />
        ) : (
          <ChevronDown size={16} className="text-[var(--ink-dim)]" />
        )}
      </div>
      {open ? (
        <div className="px-[var(--space-5)] pb-[var(--space-6)] pt-[var(--space-4)]">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function IdentityDefaultsBody({ grammar }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 sm:items-start">
        <TextFieldDemo
          label="Default name"
          value={FIX.defaultName}
          grammar={grammar}
          focused
        />
        <TextFieldDemo
          label="Default title"
          value={FIX.defaultTitle}
          grammar={grammar}
        />
        <SelectDemo label="Species" value={FIX.species} grammar={grammar} />
        <SelectDemo
          label="Gender presentation"
          value={FIX.gender}
          grammar={grammar}
        />
      </div>
      <PickerDemo
        label="Role archetype"
        value={FIX.roleArchetype}
        grammar={grammar}
      />
      <InsetRule />
      <GroupLabel>Optional frameworks</GroupLabel>
      <p className={HELPER}>
        Soft narrative flavor when the composer needs more
        characterization. Explicit choices always take priority.
      </p>
      <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 sm:items-start">
        <PickerDemo label="Personality type" value="ISTP" grammar={grammar} />
        <PickerDemo label="Western zodiac" value="Scorpio" grammar={grammar} />
      </div>
    </div>
  );
}

function SecondaryBtn({ children, full, fullMobile }) {
  return (
    <span
      className={`inline-flex min-h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-4)] text-[length:var(--text-ui)] font-medium leading-[var(--lh-ui)] text-[var(--gold-action)] ${
        full ? "w-full" : fullMobile ? "w-full sm:w-auto" : ""
      }`}
    >
      {children}
    </span>
  );
}

function PrimaryBtn({ children }) {
  return (
    <span
      className="inline-flex min-h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-5)] text-[length:var(--text-ui)] font-bold leading-[var(--lh-ui)] text-[var(--tag-fill-ink)]"
      style={{ background: "var(--grad-gold)" }}
    >
      {children}
    </span>
  );
}

function VisibilityChip() {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--line)] px-[var(--space-3)] py-[2px] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]">
      {FIX.visibility}
    </span>
  );
}

function Filmstrip({ overArt }) {
  const thumbBase =
    "relative aspect-[3/4] w-[56px] overflow-hidden rounded-[var(--radius-sm)] border";
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <span className={`${thumbBase} border-[var(--gold-action)]`}>
        <img src={ART} alt="" className="h-full w-full object-cover" />
      </span>
      <span className={`${thumbBase} border-[var(--line-whisper)]`}>
        <img
          src={ART}
          alt=""
          className="h-full w-full object-cover object-[center_80%]"
        />
      </span>
      <span
        className={`${thumbBase} flex items-center justify-center border-dashed ${
          overArt ? "border-[var(--art-ink-dim)]" : "border-[var(--line-strong)]"
        }`}
      >
        <Plus
          size={16}
          className={overArt ? "text-[var(--art-ink-dim)]" : "text-[var(--ink-dim)]"}
        />
      </span>
    </div>
  );
}

function HeroA() {
  return (
    <div className="flex flex-col gap-[var(--space-5)] sm:flex-row sm:items-start">
      <div className="flex shrink-0 flex-col gap-[var(--space-3)]">
        <div className="aspect-[3/4] w-[148px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] sm:w-[232px]">
          <img src={ART} alt={FIX.title} className="h-full w-full object-cover" />
        </div>
        <Filmstrip />
      </div>
      <div className="w-full sm:min-w-0 sm:flex-1">
        <Eyebrow>{FIX.type}</Eyebrow>
        <h1
          className={`${DISPLAY} mt-[var(--space-2)] text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--ink)] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]`}
          style={{ textWrap: "balance" }}
        >
          {FIX.title}
        </h1>
        <div className="mt-[var(--space-2)] flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          <VisibilityChip />
          <span>Updated 14 Aug 2026</span>
        </div>
        <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:flex-wrap">
          <SecondaryBtn fullMobile>Replace image</SecondaryBtn>
          <SecondaryBtn fullMobile>Generate more</SecondaryBtn>
          <SecondaryBtn fullMobile>Image library</SecondaryBtn>
        </div>
      </div>
    </div>
  );
}

function HeroB() {
  return (
    <div>
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] sm:aspect-[21/9]">
        <img
          src={ART}
          alt={FIX.title}
          className="h-full w-full object-cover object-[center_18%]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--scrim-strong))",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-[var(--space-4)] p-[var(--space-5)]">
          <div className="min-w-0">
            <span className="text-[length:var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--art-gold)]">
              {FIX.type}
            </span>
            <h1
              className={`${DISPLAY} mt-[var(--space-1)] text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--art-ink)] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]`}
            >
              {FIX.title}
            </h1>
          </div>
          <Filmstrip overArt />
        </div>
      </div>
      <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-3)]">
        <VisibilityChip />
        <SecondaryBtn>Replace image</SecondaryBtn>
        <SecondaryBtn>Generate more</SecondaryBtn>
        <SecondaryBtn>Image library</SecondaryBtn>
      </div>
    </div>
  );
}

function HeroC() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)]">
      <img
        src={ART}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[var(--blur-panel)]"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--scrim-strong)" }}
      />
      <div className="relative flex flex-wrap items-start gap-[var(--space-5)] p-[var(--space-5)]">
        <div className="aspect-[3/4] w-[148px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
          <img src={ART} alt={FIX.title} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[length:var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--art-gold)]">
            {FIX.type}
          </span>
          <h1
            className={`${DISPLAY} mt-[var(--space-2)] text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--art-ink)] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]`}
          >
            {FIX.title}
          </h1>
          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
            <SecondaryBtn>Replace image</SecondaryBtn>
            <SecondaryBtn>Generate more</SecondaryBtn>
            <SecondaryBtn>Image library</SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function RailBlock({ dirty }) {
  const item =
    "flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)]";
  return (
    <div className="flex w-full flex-col gap-[var(--space-4)] lg:w-[264px]">
      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
        {dirty ? (
          <div className="flex flex-col gap-[var(--space-2)]">
            <span className={HELPER}>Unsaved changes</span>
            <div className="flex items-center gap-[var(--space-2)]">
              <PrimaryBtn>Save</PrimaryBtn>
              <SecondaryBtn>Discard</SecondaryBtn>
            </div>
          </div>
        ) : (
          <span className="flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            <Check size={14} className="text-[var(--status-success)]" />
            All changes saved
          </span>
        )}
      </div>
      <SecondaryBtn full>Switch creation</SecondaryBtn>
      <nav className="flex flex-col gap-[var(--space-1)]">
        <div className="px-[var(--space-3)] pb-[var(--space-1)]">
          <GroupLabel>Template</GroupLabel>
        </div>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Overview
          {dirty ? (
            <span className="h-1.5 w-1.5 rounded-[var(--radius-full)] bg-[var(--gold-action)]" />
          ) : null}
        </span>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink)]`}>
          Template Info
          <span className="ml-auto text-[length:var(--text-label)] text-[var(--ink-faint)]">
            hover
          </span>
        </span>
        <span
          className={`${item} ml-[var(--space-3)] bg-[var(--fill)] text-[var(--gold-bright)]`}
        >
          Identity Defaults
        </span>
        <div className="px-[var(--space-3)] pb-[var(--space-1)] pt-[var(--space-3)]">
          <GroupLabel>Defaults</GroupLabel>
        </div>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Appearance Defaults
          <Check size={13} className="text-[var(--status-success)]" />
        </span>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Body Defaults
        </span>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Behavior Defaults
        </span>
        <div className="px-[var(--space-3)] pb-[var(--space-1)] pt-[var(--space-3)]">
          <GroupLabel>Publishing</GroupLabel>
        </div>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Publishing
        </span>
        <span className={`${item} ml-[var(--space-3)] text-[var(--ink-dim)]`}>
          Danger Zone
        </span>
      </nav>
    </div>
  );
}

function ExemplarPage({ grammar, hero }) {
  const Hero = hero === "b" ? HeroB : hero === "c" ? HeroC : HeroA;
  return (
    <div className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-[var(--space-16)] pt-[var(--space-4)] sm:px-[var(--space-6)]">
      <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        &larr; Back
      </span>
      <div className="mt-[var(--space-3)] lg:grid lg:grid-cols-[minmax(0,1fr)_264px] lg:gap-[var(--space-8)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-6)]">
          <Hero />
          <div className="flex flex-col gap-[var(--space-2)]">
            <GroupLabel>Template</GroupLabel>
            <div className="flex flex-col gap-[var(--space-3)]">
              <SectionBox title="Overview" />
              <SectionBox title="Template Info" />
              <SectionBox title="Identity Defaults" open>
                <IdentityDefaultsBody grammar={grammar} />
              </SectionBox>
            </div>
          </div>
          <div className="flex flex-col gap-[var(--space-2)]">
            <GroupLabel>Defaults</GroupLabel>
            <div className="flex flex-col gap-[var(--space-3)]">
              <SectionBox title="Appearance Defaults" mark="saved" />
              <SectionBox title="Body Defaults" />
              <SectionBox title="Behavior Defaults" />
            </div>
          </div>
          <div className="flex flex-col gap-[var(--space-2)]">
            <GroupLabel>Publishing</GroupLabel>
            <div className="flex flex-col gap-[var(--space-3)]">
              <SectionBox title="Publishing" />
              <SectionBox title="Danger Zone" open>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] py-[var(--space-2)]">
                    <p className={HELPER}>
                      Archiving hides this creation from active workflows and
                      keeps the record.
                    </p>
                    <span className="inline-flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-ui)] font-medium text-[var(--status-danger)]">
                      Archive creation
                    </span>
                  </div>
                  <InsetRule />
                  <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] py-[var(--space-2)]">
                    <p className={HELPER}>
                      Deleting is permanent and only available for non-canon
                      drafts.
                    </p>
                    <span className="inline-flex items-center gap-[var(--space-2)]">
                      <span
                        className="inline-flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-ui)] font-bold text-[var(--tag-fill-ink)]"
                        style={{ background: "var(--status-danger)" }}
                      >
                        Delete forever
                      </span>
                      <span className="inline-flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
                        Cancel
                      </span>
                    </span>
                  </div>
                  <p className={`mt-[var(--space-1)] ${COUNTER}`}>
                    The filled red button appears only after arming the
                    confirm step, shown here armed.
                  </p>
                </div>
              </SectionBox>
            </div>
          </div>
        </div>
        <div className="mt-[var(--space-6)] lg:sticky lg:top-[var(--space-4)] lg:mt-0 lg:self-start">
          <RailBlock dirty />
        </div>
      </div>
    </div>
  );
}

function SpecimenCell({ title, children, note }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <span className={COUNTER}>{title}</span>
      {children}
      {note ? (
        <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--gold-ornament)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function SpecimenSheet({ grammar }) {
  return (
    <div className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-[var(--space-16)] sm:px-[var(--space-6)]">
      <div className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]">
        <div className="grid grid-cols-1 gap-x-[var(--space-6)] gap-y-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-3">
          <SpecimenCell title="Short text, empty">
            <TextFieldDemo
              label="Default name"
              grammar={grammar}
              placeholder="Name this default"
            />
          </SpecimenCell>
          <SpecimenCell title="Short text, filled">
            <TextFieldDemo
              label="Default name"
              value={FIX.defaultName}
              grammar={grammar}
            />
          </SpecimenCell>
          <SpecimenCell title="Short text, focused">
            <TextFieldDemo
              label="Default name"
              value={FIX.defaultName}
              grammar={grammar}
              focused
            />
          </SpecimenCell>
          <SpecimenCell title="Long value fades, never clips">
            <TextFieldDemo
              label="Default title"
              value="Coldwater Smuggler of the Vermillion Coast Accord Registry"
              grammar={grammar}
            />
          </SpecimenCell>
          <SpecimenCell title="Number">
            <TextFieldDemo label="Age" value="34" grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Disabled" note="Proposed recipe, awaiting a ruling">
            <DisabledDemo label="Preview" value="Preview" grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Long prose, folded at rest">
            <ProseDemo label="Body notes" value={FIX.bodyNotes} grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Long prose, empty at rest">
            <ProseDemo label="Body notes" grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Long prose, focused with counter">
            <ProseDemo
              label="Body notes"
              value={FIX.bodyNotes}
              grammar={grammar}
              expanded
              counter="171/600"
            />
          </SpecimenCell>
          <SpecimenCell
            title="At the limit"
            note="Red words this small on this bed await a color ruling"
          >
            <ProseDemo
              label="Body notes"
              value={FIX.bodyNotes}
              grammar={grammar}
              expanded
              counter="600/600"
              danger
            />
          </SpecimenCell>
          <SpecimenCell title="Select, closed">
            <SelectDemo label="Species" value={FIX.species} grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Select, open">
            <SelectDemo label="Species" value={FIX.species} grammar={grammar} open />
          </SpecimenCell>
          <SpecimenCell title="Picker field, filled">
            <PickerDemo
              label="Role archetype"
              value={FIX.roleArchetype}
              grammar={grammar}
            />
          </SpecimenCell>
          <SpecimenCell title="Picker field, empty">
            <PickerDemo label="Proportions" grammar={grammar} />
          </SpecimenCell>
          <SpecimenCell title="Read-only, no bed">
            <ReadOnlyDemo
              label="Creation type"
              value="Character Template"
              grammar={grammar}
            />
          </SpecimenCell>
          <SpecimenCell title="Toggle">
            <ToggleDemo
              label="Applies to"
              on
              word="New characters only"
              grammar={grammar}
            />
          </SpecimenCell>
          <SpecimenCell
            title="Field error"
            note="Proposed recipe, awaiting the error and color rulings"
          >
            <ErrorDemo
              label="Default name"
              value={FIX.defaultName}
              grammar={grammar}
            />
          </SpecimenCell>
        </div>
      </div>
    </div>
  );
}

function ModalDemo({ grammar }) {
  const tile =
    "flex flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border p-[var(--space-2)]";
  const swatch = "h-10 w-full rounded-[var(--radius-sm)]";
  const caption =
    "text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink)]";
  return (
    <div className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-[var(--space-16)] sm:px-[var(--space-6)]">
      <div
        className="rounded-[var(--radius-lg)] p-[var(--space-4)] sm:p-[var(--space-10)]"
        style={{ background: "var(--scrim-strong)" }}
      >
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
          <div className="relative flex items-center justify-between px-[var(--space-6)] py-[var(--space-4)] after:absolute after:bottom-0 after:left-[var(--space-6)] after:right-[var(--space-6)] after:h-px after:bg-[var(--line-whisper)]">
            <div>
              <Eyebrow>Body defaults</Eyebrow>
              <h2
                className={`${DISPLAY} mt-[var(--space-1)] text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]`}
              >
                Skin tone
              </h2>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] text-[var(--ink-dim)]">
              <X size={14} />
            </span>
          </div>
          <div className="flex flex-col gap-[var(--space-4)] px-[var(--space-6)] py-[var(--space-5)]">
            <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-4">
              <span className={`${tile} border-[var(--line-whisper)]`}>
                <span className={swatch} style={{ background: "#f2e2cd" }} />
                <span className={caption}>Porcelain</span>
              </span>
              <span className={`${tile} border-[var(--line-whisper)]`}>
                <span className={swatch} style={{ background: "#c98d5a" }} />
                <span className={caption}>Warm tan</span>
              </span>
              <span className={`${tile} border-[var(--line-whisper)]`}>
                <span className={swatch} style={{ background: "#6b4a32" }} />
                <span className={caption}>Deep brown</span>
              </span>
              <span
                className={`${tile} border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]`}
              >
                <span
                  className={`${swatch} flex items-center justify-center border border-[var(--line-whisper)] bg-[var(--surface-1)]`}
                >
                  <span className="text-[length:var(--text-label)] text-[var(--ink-dim)]">
                    Custom
                  </span>
                </span>
                <span className={`${caption} text-[var(--gold-bright)]`}>
                  Custom
                </span>
              </span>
            </div>
            <TextFieldDemo
              label="Custom skin tone"
              value="Weathered olive"
              grammar={grammar}
              focused
            />
            <p className={HELPER}>
              Saved directly as the character&apos;s skin tone.
            </p>
          </div>
          <div className="relative flex items-center gap-[var(--space-3)] px-[var(--space-6)] py-[var(--space-4)] before:absolute before:left-[var(--space-6)] before:right-[var(--space-6)] before:top-0 before:h-px before:bg-[var(--line-whisper)]">
            <span className="flex-1" />
            <SecondaryBtn>Cancel</SecondaryBtn>
            <PrimaryBtn>Done</PrimaryBtn>
          </div>
        </div>
      </div>
      <p className={`mt-[var(--space-3)] ${HELPER}`}>
        Standard size. Swatch sample colors are stand-ins for the real
        palette data; every frame, border, and text value is a token. Below
        700px this maximizes to the full screen with internal scrolling.
      </p>
    </div>
  );
}

function SheetDemo() {
  return (
    <div className="mx-auto w-full max-w-[26rem] px-[var(--space-4)] pb-[var(--space-16)]">
      <div className="overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="relative flex items-center justify-between px-[var(--space-5)] py-[var(--space-4)] after:absolute after:bottom-0 after:left-[var(--space-5)] after:right-[var(--space-5)] after:h-px after:bg-[var(--line-whisper)]">
          <h2
            className={`${DISPLAY} text-[length:var(--text-subhead-m)] leading-[var(--lh-subhead-m)] text-[var(--ink)]`}
          >
            Sections
          </h2>
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] text-[var(--ink-dim)]">
            <X size={14} />
          </span>
        </div>
        <div className="p-[var(--space-4)]">
          <RailBlock dirty />
        </div>
      </div>
      <p className={`mt-[var(--space-3)] ${HELPER}`}>
        The mobile bottom sheet: titled, with the same save block,
        switcher, and table of contents as the desktop rail.
      </p>
    </div>
  );
}

const VIEWS = [
  { id: "exemplar-a", label: "Exemplar A (recommended)" },
  { id: "exemplar-b", label: "Exemplar B" },
  { id: "exemplar-c", label: "Exemplar C" },
  { id: "hero-a", label: "Hero A (recommended)" },
  { id: "hero-b", label: "Hero B" },
  { id: "hero-c", label: "Hero C" },
  { id: "fields", label: "Field specimen" },
  { id: "modal", label: "Modal" },
  { id: "sheet", label: "Mobile sheet" },
];

export default function Ed1eEditorDesignClient() {
  const [view, setView] = useState("exemplar-a");

  const grammar =
    view === "exemplar-b"
      ? GRAMMAR.b
      : view === "exemplar-c"
        ? GRAMMAR.c
        : GRAMMAR.a;

  let body;
  if (view.startsWith("exemplar-")) {
    body = <ExemplarPage grammar={grammar} hero="a" />;
  } else if (view.startsWith("hero-")) {
    body = <ExemplarPage grammar={GRAMMAR.a} hero={view.slice(5)} />;
  } else if (view === "fields") {
    body = <SpecimenSheet grammar={GRAMMAR.a} />;
  } else if (view === "modal") {
    body = <ModalDemo grammar={GRAMMAR.a} />;
  } else {
    body = <SheetDemo />;
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] pb-[var(--space-16)] text-[var(--ink)]">
      <div className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] py-[var(--space-4)] sm:px-[var(--space-6)]">
        <div className="mb-[var(--space-4)] flex flex-wrap gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-3)]">
          <span className="mr-[var(--space-2)] self-center text-[length:var(--text-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            ED1e render
          </span>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`rounded-[var(--radius-full)] border px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                view === v.id
                  ? "border-[var(--gold-action)] text-[var(--gold-bright)]"
                  : "border-[var(--line-whisper)] text-[var(--ink-dim)]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      {body}
    </main>
  );
}
