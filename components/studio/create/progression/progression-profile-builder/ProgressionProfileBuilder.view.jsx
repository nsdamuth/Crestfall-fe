"use client";

import { Activity, Save, ShieldCheck } from "lucide-react";

import ProgressionProfileEditorView from "@/components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.view";

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

export default function ProgressionProfileBuilderView({
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
      <aside className="self-start rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
          <Activity size={18} />
          <p className="text-xs uppercase tracking-[0.22em]">
            Progression Profile
          </p>
        </div>

        <h2 className="mt-3 font-display text-4xl">
          {title.trim() || "Untitled Progression Profile"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
          Define reusable cumulative-experience thresholds and level tiers.
          Actor experience, current level, and point balances remain isolated to
          actor-owned runtime state.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              This asset stores definitions only. It does not create actor state,
              award experience, execute level guards, or inject provider context.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
              Errors
            </p>
            <p className="mt-2 text-lg">{errorCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
              Warnings
            </p>
            <p className="mt-2 text-lg">{warningCount}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <FieldLabel>Creation title</FieldLabel>
            <TextInput
              value={title}
              onChange={(value) => onUpdateIdentity?.("title", value)}
              placeholder="Adventurer Progression"
            />
          </div>
          <div>
            <FieldLabel>Creation description</FieldLabel>
            <textarea
              rows={4}
              value={description}
              onChange={(event) =>
                onUpdateIdentity?.("description", event.target.value)
              }
              placeholder="Describe where this progression curve is intended to be used."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
            />
          </div>
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

        <button
          type="button"
          disabled={saveDisabled}
          onClick={() => onSave?.()}
          className="cf-btn cf-btn--primary mt-6 w-full"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save draft"}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error" ? "text-rose-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <ProgressionProfileEditorView {...editorViewProps} />
    </section>
  );
}
