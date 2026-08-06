"use client";

import { Activity, Save, ShieldCheck } from "lucide-react";

import StatsPoolsEditorView from "@/components/studio/create/stats-pools/stats-pools-editor/StatsPoolsEditor.view";

function FieldLabel({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function SelectInput({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0907] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function StatsPoolsBuilderView({
  title = "",
  description = "",
  visibility = "PRIVATE",
  contentRating = "SFW",
  visibilityOptions = [],
  contentRatingOptions = [],
  editorViewProps = {},
  saveDisabled = true,
  saveStatus = "idle",
  saveMessage = "",
  errorCount = 0,
  warningCount = 0,
  onUpdateIdentity = null,
  onSave = null,
}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
          <Activity size={18} />
          <p className="text-xs uppercase tracking-[0.22em]">
            Stats & Pools Profile
          </p>
        </div>

        <h2 className="mt-3 font-display text-4xl">
          {title.trim() || "Untitled Stats & Pools Profile"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
          Define reusable attributes, HP, Stamina, Mana, modifiers, and
          conditions. Mutable values remain isolated to each actor after this
          profile is attached through an Actor Mechanics Profile.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              This asset stores definitions only. It does not create actor state,
              execute formulas, or mutate runtime values by itself.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Errors</p>
            <p className="mt-2 text-lg">{errorCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Warnings</p>
            <p className="mt-2 text-lg">{warningCount}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.()}
          disabled={saveDisabled}
          className="cf-btn cf-btn--primary mt-6 w-full"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save draft"}
        </button>

        {saveMessage ? (
          <p className={`mt-3 text-sm ${saveStatus === "error" ? "text-red-200" : "text-emerald-200"}`}>
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <div className="space-y-6">
        <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Asset Identity</p>
          <h2 className="mt-2 font-display text-3xl">Name and access</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <FieldLabel>Creation name</FieldLabel>
              <TextInput
                value={title}
                onChange={(value) => onUpdateIdentity?.("title", value)}
                placeholder="Name this Stats & Pools Profile..."
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(event) => onUpdateIdentity?.("description", event.target.value)}
                rows={4}
                placeholder="Describe the actors, genres, or mechanics this profile is intended to support..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Visibility</FieldLabel>
                <SelectInput
                  value={visibility}
                  options={visibilityOptions}
                  onChange={(value) => onUpdateIdentity?.("visibility", value)}
                />
              </div>
              <div>
                <FieldLabel>Content rating</FieldLabel>
                <SelectInput
                  value={contentRating}
                  options={contentRatingOptions}
                  onChange={(value) => onUpdateIdentity?.("contentRating", value)}
                />
              </div>
            </div>
          </div>
        </section>

        <StatsPoolsEditorView {...editorViewProps} />
      </div>
    </section>
  );
}
