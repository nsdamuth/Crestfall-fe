"use client";

function Field({ label, children }) {
  return <div><label className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">{label}</label>{children}</div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]/50";

export default function AbilitySpellProfileBuilderView({
  title = "", description = "", visibility = "PRIVATE", contentRating = "SFW",
  visibilityOptions = [], contentRatingOptions = [], editor = null,
  saveDisabled = false, saveStatus = "idle", saveMessage = "", errorCount = 0, warningCount = 0,
  onUpdateIdentity = null, onSave = null,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Create Ability & Spell Profile</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Create reusable ability and magic definitions. Actor knowledge, current mastery, cooldowns, charges, and resource balances are intentionally not stored here.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Creation title"><input className={inputClass} value={title} onChange={(event) => onUpdateIdentity?.("title", event.target.value)} /></Field>
          <Field label="Visibility"><select className={inputClass} value={visibility} onChange={(event) => onUpdateIdentity?.("visibility", event.target.value)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <Field label="Description"><textarea rows={3} className={inputClass} value={description} onChange={(event) => onUpdateIdentity?.("description", event.target.value)} /></Field>
          <Field label="Content rating"><select className={inputClass} value={contentRating} onChange={(event) => onUpdateIdentity?.("contentRating", event.target.value)}>{contentRatingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
        </div>
      </section>
      {editor}
      <section className="sticky bottom-4 rounded-2xl border border-white/10 bg-[#100f0d]/95 p-4 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted)]">{errorCount} errors · {warningCount} warnings{saveMessage ? <span className="ml-3">{saveMessage}</span> : null}</div>
          <button type="button" disabled={saveDisabled} onClick={() => onSave?.()} className="rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/15 px-6 py-3 text-sm font-semibold text-[var(--muted-gold)] disabled:cursor-not-allowed disabled:opacity-40">{saveStatus === "saving" ? "Saving…" : "Save Draft"}</button>
        </div>
      </section>
    </div>
  );
}
