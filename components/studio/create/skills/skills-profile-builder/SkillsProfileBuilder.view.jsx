"use client";

import { SelectField } from "@/components/studio/my-creations/edit/sections/SharedFields";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]/50";

export default function SkillsProfileBuilderView({
  title = "",
  description = "",
  visibility = "PRIVATE",
  contentRating = "SFW",
  visibilityOptions = [],
  contentRatingOptions = [],
  editor = null,
  saveDisabled = false,
  saveStatus = "idle",
  saveMessage = "",
  errorCount = 0,
  warningCount = 0,
  onUpdateIdentity = null,
  onSave = null,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-[var(--surface-2)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Create Skills Profile
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Create reusable Skill and Proficiency definitions. Actor ranks and point balances remain Story state.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Creation title">
            <input className={inputClass} value={title} onChange={(event) => onUpdateIdentity?.("title", event.target.value)} />
          </Field>
          <SelectField label="Visibility" value={visibility} onChange={(value) => onUpdateIdentity?.("visibility", value)} options={visibilityOptions} />
          <Field label="Description">
            <textarea rows={3} className={inputClass} value={description} onChange={(event) => onUpdateIdentity?.("description", event.target.value)} />
          </Field>
          <SelectField label="Content rating" value={contentRating} onChange={(value) => onUpdateIdentity?.("contentRating", value)} options={contentRatingOptions} />
        </div>
      </section>

      {editor}

      <section className="sticky bottom-4 rounded-2xl border border-white/10 bg-[var(--surface-3)] p-4 shadow-2xl backdrop-blur max-[47.99rem]:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted)]">
            {errorCount} errors · {warningCount} warnings
            {saveMessage ? <span className="ml-3">{saveMessage}</span> : null}
          </div>
          <button
            type="button"
            disabled={saveDisabled}
            onClick={() => onSave?.()}
            className="rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/15 px-6 py-3 text-sm font-semibold text-[var(--muted-gold)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saveStatus === "saving" ? "Saving…" : "Save Draft"}
          </button>
        </div>
      </section>

      {/* MOBILE-SHELLS: this shell already docked its primary action, but as
          an in-flow sticky panel that scrolls away at the end of the page
          and whose control carried no height floor. Below md that panel is
          hidden and the same action renders in the bottom-docked bar, full
          width minus the page gutter with the 44px floor. At md and up the
          panel renders exactly where it does today and the bar is
          display:none. */}
      <CreateActionBar
        label={saveStatus === "saving" ? "Saving..." : "Save Draft"}
        onAction={onSave}
        disabled={saveDisabled}
      />
    </div>
  );
}
