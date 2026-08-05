"use client";

import { BookOpen, Save, Sparkles } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import NarratorModuleSelectorView from "@/components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.view";

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

export default function NarratorBuilderView({
  name = "",
  description = "",
  tone = "",
  narratorGuidance = "",
  avoidGuidance = "",
  tags = "",
  visibility = "PRIVATE",
  contentRating = "SFW",
  toneOptions = [],
  visibilityOptions = [],
  contentRatingOptions = [],
  moduleSummaryItems = [],
  moduleSelectorViewProps = {},
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  onUpdateField = null,
  onSave = null,
} = {}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.46fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Narrator Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">
          {name || "Unnamed Narrator"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--muted)]">
          Narrators define the voice, pacing, detail level, and story style used
          inside rooms and scenarios.
        </p>

        <div className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <BookOpen className="text-[var(--muted-gold)]" size={28} />

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview
          </p>

          <p className="mt-3 leading-7 text-[var(--muted)]">
            {description ||
              "Narrator preview text will appear here once description and guidance are added."}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Selected Modules
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {(Array.isArray(moduleSummaryItems) ? moduleSummaryItems : []).map(
              (item) => (
                <span
                  key={item?.id || item?.label}
                  className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]"
                >
                  {item?.label || "Module"}
                </span>
              )
            )}
          </div>
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

      <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Narrator Profile
        </p>

        <h2 className="mt-2 font-display text-4xl">Story Voice</h2>

        <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
          A narrator is not a character. It is the storytelling lens used to
          frame scenes, pacing, description, and transitions.
        </p>

        <div className="mt-6 grid gap-5">
          <TextField
            label="Name"
            value={name}
            onChange={(value) => onUpdateField?.("name", value)}
            placeholder="e.g., Dark Fairytale Narrator"
          />

          <TextAreaField
            label="Description"
            value={description}
            onChange={(value) => onUpdateField?.("description", value)}
            placeholder="Briefly describe what this narrator is for."
            rows={4}
          />

          <NarratorModuleSelectorView {...moduleSelectorViewProps} />

          <div className="max-w-xl">
            <CrestfallSelect
              label="Broad Tone"
              value={tone}
              onChange={(value) => onUpdateField?.("tone", value)}
              options={toneOptions}
            />
          </div>

          <TextAreaField
            label="Narrator Guidance"
            value={narratorGuidance}
            onChange={(value) => onUpdateField?.("narratorGuidance", value)}
            placeholder="Optional guidance for prose style, scene framing, transitions, tension, and how much the narrator should intervene."
            rows={7}
          />

          <TextAreaField
            label="Avoid Guidance"
            value={avoidGuidance}
            onChange={(value) => onUpdateField?.("avoidGuidance", value)}
            placeholder="Optional: describe narration habits to avoid."
            rows={4}
          />

          <TextField
            label="Tags"
            value={tags}
            onChange={(value) => onUpdateField?.("tags", value)}
            placeholder="e.g., cinematic, gothic, slow-burn"
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

          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 text-[var(--muted-gold)]" size={18} />
              <div>
                <p className="text-sm text-[var(--foreground)]">
                  Future room integration
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Later, this narrator can be selected when creating scenarios,
                  stories, or active story rooms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
