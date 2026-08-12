"use client";

import { BookOpenText, Save, ShieldCheck } from "lucide-react";

import RulesCodexEditorView from "@/components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.view";
import {
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

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

export default function RulesCodexBuilderView({
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
          <BookOpenText size={18} />
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            Rules Codex
          </p>
        </div>

        <h2 className="mt-3 font-display text-4xl">
          {title.trim() || "Untitled Rules Codex"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
          Explain how verified mechanics should be interpreted. The Codex cannot
          mutate state, replace registries, bypass guards, or control a Player Character.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              Authority is fixed to interpretation only. Deterministic state and
              platform safety remain authoritative.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
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
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <div className="space-y-6">
        <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 sm:p-6">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            Codex Identity
          </p>
          <h2 className="mt-2 font-display text-3xl">Name and access</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={title}
                onChange={(value) => onUpdateIdentity?.("title", value)}
                placeholder="Name this Rules Codex..."
              />
            </div>

            <div>
              <TextAreaField
                label="Description"
                value={description}
                onChange={(value) => onUpdateIdentity?.("description", value)}
                placeholder="Describe the rules and interpretation domains this Codex supports."
                maxLength={SHORT_LONGFORM_MAX_LENGTH}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

        <RulesCodexEditorView {...editorViewProps} />
      </div>
    </section>
  );
}
