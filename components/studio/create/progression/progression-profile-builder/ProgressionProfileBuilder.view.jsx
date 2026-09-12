"use client";

import { Activity, Save, ShieldCheck } from "lucide-react";

import ProgressionProfileEditorView from "@/components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.view";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

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
      className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function SelectInput({ value, options, onChange }) {
  return (
    <div className="mt-2 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
      <KitDropdownView
        options={options}
        selectedValues={value ? [value] : []}
        isMultiSelect={false}
        onToggleOption={(nextValue) => onChange?.(nextValue)}
      />
    </div>
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
      {/* MOBILE-SHELLS: min-w-0 on both grid children. Without it the
          implicit base column is sized by min-width:auto, so any nowrap
          descendant becomes the page's horizontal scroll width. This is
          the single-column rule for this shell: one column in DOM order
          below xl, each child free to shrink to the gutter. */}
      <aside className="min-w-0 self-start rounded-2xl border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 xl:sticky xl:top-24">
        <SectionTitle
          eyebrow={
            <>
              <Activity size={18} />
              Progression Profile
            </>
          }
          title={title.trim() || "Untitled Progression Profile"}
          body="Define reusable cumulative-experience thresholds and level tiers. Actor experience, current level, and point balances remain isolated to actor-owned runtime state."
        />

        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p className="leading-6">
              This asset stores definitions only. It does not create actor state,
              award experience, execute level guards, or inject provider context.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 sm:divide-x sm:divide-[var(--line-whisper)]">
          <div className="sm:pr-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
              Errors
            </p>
            <p className="mt-2 text-lg">{errorCount}</p>
          </div>
          <div className="sm:pl-3">
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
            <TextAreaField
              label="Creation description"
              value={description}
              onChange={(value) => onUpdateIdentity?.("description", value)}
              placeholder="Describe where this progression curve is intended to be used."
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
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

      <div className="min-w-0">
        <ProgressionProfileEditorView {...editorViewProps} />
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
