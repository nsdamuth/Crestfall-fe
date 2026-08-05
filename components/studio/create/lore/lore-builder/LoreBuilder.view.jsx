"use client";

import { BookOpenText, Eye, Pencil, Save, ShieldCheck } from "lucide-react";
import LoreEditorView from "@/components/studio/create/lore/lore-editor/LoreEditor.view";
import LoreDocumentRendererView from "@/components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function LoreBuilderView({
  title = "",
  description = "",
  visibility = "PRIVATE",
  contentRating = "SFW",
  visibilityOptions = [],
  contentRatingOptions = [],
  activeMode = "EDIT",
  editorViewProps = {},
  rendererViewProps = {},
  saveDisabled = true,
  saveStatus = "idle",
  saveMessage = "",
  errorCount = 0,
  warningCount = 0,
  onUpdateIdentity,
  onSetActiveMode,
  onSave,
  LinkComponent = "a",
}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
          <BookOpenText size={18} />
          <p className="text-xs uppercase tracking-[0.22em]">Lore Asset</p>
        </div>
        <h2 className="mt-3 font-display text-4xl">{title.trim() || "Untitled Lore Asset"}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
          Build a structured sourcebook draft. Save it, submit the saved revision for
          security validation, and publish only an immutable snapshot that passes.
        </p>

        <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              The working draft remains private from the public reader. Public release
              is available only from a saved revision that passes security validation.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Errors</p><p className="mt-2 text-lg">{errorCount}</p></div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">Warnings</p><p className="mt-2 text-lg">{warningCount}</p></div>
        </div>

        <button type="button" onClick={() => onSave?.()} disabled={saveDisabled} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50">
          <Save size={15} />{saveStatus === "saving" ? "Saving…" : "Save Draft"}
        </button>
        {saveMessage ? <p className={`mt-3 text-sm ${saveStatus === "error" ? "text-red-200" : "text-emerald-200"}`}>{saveMessage}</p> : null}
      </aside>

      <div className="space-y-6">
        <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Publication Identity</p>
          <h2 className="mt-2 font-display text-3xl">Name and draft access</h2>
          <div className="mt-5 grid gap-5">
            <Field label="Title"><input className={inputClass} value={title} onChange={(event) => onUpdateIdentity?.("title", event.target.value)} placeholder="Name this Lore Asset…" /></Field>
            <Field label="Description"><textarea className={`${inputClass} min-h-28 resize-y leading-6`} value={description} onChange={(event) => onUpdateIdentity?.("description", event.target.value)} placeholder="Describe this public lore publication." /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Draft visibility"><select className={inputClass} value={visibility} onChange={(event) => onUpdateIdentity?.("visibility", event.target.value)}>{visibilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
              <Field label="Content rating"><select className={inputClass} value={contentRating} onChange={(event) => onUpdateIdentity?.("contentRating", event.target.value)}>{contentRatingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
            </div>
          </div>
        </section>

        <div className="flex gap-2 rounded-xl border border-white/10 bg-black/30 p-2">
          <button type="button" onClick={() => onSetActiveMode?.("EDIT")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${activeMode === "EDIT" ? "bg-[var(--gold-ornament)]/15 text-white" : "text-[var(--ink-dim)]"}`}><Pencil size={14} /> Edit Document</button>
          <button type="button" onClick={() => onSetActiveMode?.("PREVIEW")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${activeMode === "PREVIEW" ? "bg-[var(--gold-ornament)]/15 text-white" : "text-[var(--ink-dim)]"}`}><Eye size={14} /> Preview</button>
        </div>

        {activeMode === "EDIT" ? <LoreEditorView {...editorViewProps} /> : <LoreDocumentRendererView
            {...rendererViewProps}
            LinkComponent={LinkComponent}
          />}
      </div>
    </section>
  );
}
