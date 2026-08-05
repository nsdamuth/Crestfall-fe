"use client";

import { Save, ShieldCheck, UserRoundCog } from "lucide-react";

import ActorMechanicsProfileEditorView from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view";

function FieldLabel({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
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
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
    />
  );
}

function SelectInput({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0907] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function ActorMechanicsProfileBuilderView({
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
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-[var(--muted-gold)]">
          <UserRoundCog size={18} />
          <p className="text-xs uppercase tracking-[0.22em]">
            Actor Mechanics Profile
          </p>
        </div>

        <h2 className="mt-3 font-display text-4xl">
          {title.trim() || "Untitled Actor Mechanics Profile"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Package reusable definitions for an actor while keeping every mutable
          stat, unlock, balance, cooldown, and inventory value owner-scoped.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              Shared definitions are allowed. Shared mutable state remains
              forbidden. This asset does not activate runtime mechanics by itself.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
              Errors
            </p>
            <p className="mt-2 text-lg">{errorCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
              Warnings
            </p>
            <p className="mt-2 text-lg">{warningCount}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.()}
          disabled={saveDisabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save Draft"}
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
        <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Asset Identity
          </p>
          <h2 className="mt-2 font-display text-3xl">Name and access</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <FieldLabel>Creation name</FieldLabel>
              <TextInput
                value={title}
                onChange={(value) => onUpdateIdentity?.("title", value)}
                placeholder="Name this Actor Mechanics Profile..."
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(event) =>
                  onUpdateIdentity?.("description", event.target.value)
                }
                rows={4}
                placeholder="Describe the actor types and mechanics domains this profile supports..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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
                  onChange={(value) =>
                    onUpdateIdentity?.("contentRating", value)
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <ActorMechanicsProfileEditorView {...editorViewProps} />
      </div>
    </section>
  );
}
