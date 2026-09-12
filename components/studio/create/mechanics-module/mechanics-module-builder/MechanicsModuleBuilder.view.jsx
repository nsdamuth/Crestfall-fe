"use client";

import { Activity, Save } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../../my-creations/edit/sections/SharedFields";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]";

function EditorCard({ eyebrow, title, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-6">
      <p className={EYEBROW_CLASS}>{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function RuntimeFieldsFixtureFallback() {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-white/15 bg-[var(--surface-1)] p-6 text-sm leading-6 text-[var(--ink-dim)]">
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
      {/* MOBILE-SHELLS: min-w-0 on both grid children. Without it the
          implicit base column is sized by min-width:auto, so any nowrap
          descendant becomes the page's horizontal scroll width. This is
          the single-column rule for this shell: one column in DOM order
          below xl, each child free to shrink to the gutter. */}
      <aside className="min-w-0 self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 xl:sticky xl:top-24">
        <p className={EYEBROW_CLASS}>Mechanics Module Builder</p>

        <h2 className="mt-2 font-display text-4xl">
          {title || "Untitled Mechanics Module"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--ink-dim)]">
          Create reusable runtime mechanics that can be attached to rooms,
          locations, characters, scenarios, or narrators.
        </p>

        <div className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-1)] p-4 text-sm leading-6 text-[var(--ink-dim)]">
          <p className={EYEBROW_CLASS}>Runtime Contract</p>
          <p className="mt-3">
            Module ID:{" "}
            <span className="text-[var(--ink)]">{moduleId}</span>
          </p>
          <p>
            Contract:{" "}
            <span className="text-[var(--ink)]">
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
          className="cf-btn cf-btn--primary mt-6 w-full"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save draft"}
        </button>

        {saveMessage ? (
          <span
            role={saveStatus === "error" ? "alert" : undefined}
            aria-live="polite"
            className={`mt-3 inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] ${
              saveStatus === "error"
                ? "text-[var(--status-danger)]"
                : "text-[var(--status-success)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                saveStatus === "error"
                  ? "bg-[var(--status-danger)]"
                  : "bg-[var(--status-success)]"
              }`}
            />
            <span className="inline">{saveMessage}</span>
          </span>
        ) : null}
      </aside>

      <div className="min-w-0 grid gap-6">
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
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
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
          <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-1)] p-5">
            <Activity className="mt-1 text-[var(--gold-ornament)]" size={20} />
            <div>
              <p className="text-sm text-[var(--ink)]">
                Define the full reusable mechanics package before first save.
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                {runtimeStorageNote}
              </p>
            </div>
          </div>

          {runtimeFieldsContent || <RuntimeFieldsFixtureFallback />}
        </EditorCard>
      </div>
      {/* MOBILE-SHELLS: the aside's Save draft is a full scroll away on a
          phone, so the same action docks to the bottom edge below md. The
          aside button is untouched and is what renders on desktop. */}
      <CreateActionBar
        label={saveStatus === "saving" ? "Saving..." : "Save draft"}
        onAction={onSave}
        disabled={saveDisabled}
      />
    </section>
  );
}
