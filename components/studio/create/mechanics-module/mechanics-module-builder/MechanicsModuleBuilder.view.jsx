"use client";

import { Activity, Save } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

function EditorCard({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 5 }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function RuntimeFieldsFixtureFallback() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-sm leading-6 text-[var(--muted)]">
      The live Binding Shell supplies the Crestfall mechanics fields editor here.
      Fixture previews keep this application-owned editor disconnected from
      persistence and runtime state.
    </div>
  );
}

export default function MechanicsModuleBuilderView({
  title = "",
  description = "",
  visibility = "PRIVATE",
  contentRating = "SFW",
  visibilityOptions = [],
  contentRatingOptions = [],
  moduleId = "core.trackers.v1",
  contractVersion = "trackers_instance_data.v0_2",
  runtimeStorageNote = "",
  runtimeFieldsContent = null,
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  onUpdateField = null,
  onSave = null,
} = {}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.38fr_1fr]">
      <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Mechanics Module Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">
          {title || "Untitled Mechanics Module"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--muted)]">
          Create reusable runtime mechanics that can be attached to rooms,
          locations, characters, scenarios, or narrators.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Runtime Contract
          </p>
          <p className="mt-3">
            Module ID:{" "}
            <span className="text-[var(--foreground)]">{moduleId}</span>
          </p>
          <p>
            Contract:{" "}
            <span className="text-[var(--foreground)]">
              {contractVersion}
            </span>
          </p>
          <p className="mt-3">
            This asset stores reusable dehydrated mechanics. Live values are
            stored per room/session at runtime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSave?.()}
          disabled={saveDisabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="grid gap-6">
        <EditorCard eyebrow="Mechanics Module" title="Identity">
          <div className="grid gap-5">
            <TextField
              label="Name"
              value={title}
              onChange={(value) => onUpdateField?.("title", value)}
              placeholder="e.g., Boundary Safety Mechanics"
            />

            <TextAreaField
              label="Description"
              value={description}
              onChange={(value) => onUpdateField?.("description", value)}
              placeholder="Describe what this reusable mechanics module controls."
              rows={4}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <CrestfallSelect
                label="Visibility"
                value={visibility}
                onChange={(value) => onUpdateField?.("visibility", value)}
                options={visibilityOptions}
              />

              <CrestfallSelect
                label="Content Rating"
                value={contentRating}
                onChange={(value) => onUpdateField?.("contentRating", value)}
                options={contentRatingOptions}
              />
            </div>
          </div>
        </EditorCard>

        <EditorCard
          eyebrow="Runtime Fields"
          title="Meters, Commands, Status Blocks, and Guards"
        >
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-5">
            <Activity className="mt-1 text-[var(--muted-gold)]" size={20} />
            <div>
              <p className="text-sm text-[var(--foreground)]">
                Define the full reusable mechanics package before first save.
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {runtimeStorageNote}
              </p>
            </div>
          </div>

          {runtimeFieldsContent || <RuntimeFieldsFixtureFallback />}
        </EditorCard>
      </div>
    </section>
  );
}
