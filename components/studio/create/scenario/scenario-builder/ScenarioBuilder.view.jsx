"use client";

import { Save, ShieldCheck, X } from "lucide-react";
import CrestfallSelect from "@/components/ui/CrestfallSelect";

export default function ScenarioBuilderView({
  form = {},
  circle = {},
  enabledModules = {},
  completion = 0,
  storyCircleSteps = [],
  middlewareModules = [],
  toneOptions = [],
  participantModeOptions = [],
  visibilityOptions = [],
  contentRatingOptions = [],
  referenceFields = [],
  referenceLoadError = "",
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  onUpdateField = null,
  onUpdateCircle = null,
  onToggleModule = null,
  onSave = null,
} = {}) {
  return (
    <>
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.42fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Scenario Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">
          {form.title || "Untitled Scenario"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--muted)]">
          A Scenario is the reusable story structure. Stories later
          package scenarios with characters, narrators, display media, and room
          settings.
        </p>

        <div className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Draft Progress
          </p>

          <p className="mt-2 font-display text-4xl">{completion}%</p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Story Circle fields are optional, but filling them helps create a
            scenario that can resolve instead of drifting forever.
          </p>
        </div>

        <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Enabled Middleware
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(enabledModules)
              .filter(([, enabled]) => enabled)
              .map(([moduleId]) => (
                <span
                  key={moduleId}
                  className="rounded-full border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)]"
                >
                  {moduleId.replaceAll("_", " ")}
                </span>
              ))}
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

      <div className="space-y-6">
        <BuilderSection
          eyebrow="Overview"
          title="Scenario Identity"
          body="Define what this scenario is, who it is for, and how it should appear when reused later."
        >
          <div className="grid gap-5">
            <TextField
              label="Title"
              value={form.title}
              onChange={(value) => onUpdateField?.("title", value)}
              placeholder="e.g., The Cat Warmech Built"
            />

            <TextAreaField
              label="Public Description"
              value={form.public_description}
              onChange={(value) =>
                onUpdateField?.("public_description", value)
              }
              placeholder="Player-facing description for this scenario."
              rows={5}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <CrestfallSelect
                label="Tone"
                value={form.tone}
                onChange={(value) => onUpdateField?.("tone", value)}
                options={toneOptions}
              />

              <CrestfallSelect
                label="Participant Mode"
                value={form.participant_mode}
                onChange={(value) =>
                  onUpdateField?.("participant_mode", value)
                }
                options={participantModeOptions}
              />

              <CrestfallSelect
                label="Content Rating"
                value={form.content_rating}
                onChange={(value) => onUpdateField?.("content_rating", value)}
                options={contentRatingOptions}
              />
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Story Circle"
          title="Scenario Structure"
          body="Use the story circle to help the scenario move from hook to consequence to meaningful change."
        >
          <div className="grid gap-4">
            {storyCircleSteps.map((step) => (
              <StoryCircleCard
                key={step.id}
                step={step}
                value={circle[step.id]}
                onChange={(value) => onUpdateCircle?.(step.id, value)}
              />
            ))}
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Cast & Requirements"
          title="Cast, Location, Narrator, and Registries"
          body="Define cast recommendations and attach authoritative Faction and Organization Registries. Stories may apply or skip recommendations, while attached registries are inherited automatically."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {(Array.isArray(referenceFields) ? referenceFields : []).map((field) => (
              <ReferenceSelectorField
                key={field.id}
                label={field.label}
                description={field.description}
                selectedItems={field.selectedItems}
                onOpen={field.onOpen}
                onRemove={field.onRemove}
              />
            ))}
          </div>

          {referenceLoadError ? (
            <p className="mt-4 text-sm text-red-200">{referenceLoadError}</p>
          ) : null}
        </BuilderSection>

        <BuilderSection
          eyebrow="Middleware"
          title="Scenario Add-ons"
          body="These are future platform-level supports. For now they define intent; later they can become structured middleware rules."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {middlewareModules.map((module) => {
              const Icon = module.icon;
              const active = enabledModules[module.id];

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => onToggleModule?.(module.id)}
                  className={`rounded-[var(--radius-md)] border p-4 text-left transition ${
                    active
                      ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      size={20}
                      className={
                        active
                          ? "text-[var(--muted-gold)]"
                          : "text-[var(--muted)]"
                      }
                    />

                    <div>
                      <p className="text-sm font-medium">{module.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                        {module.body}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Opening & Runtime"
          title="Opening Scene and Private Guidance"
          body="This is where power users can add richer setup logic. Casual creators can leave most of this blank."
        >
          <div className="grid gap-5">
            <TextAreaField
              label="Opening Scene"
              value={form.opening_scene}
              onChange={(value) => onUpdateField?.("opening_scene", value)}
              placeholder="The opening scene or starting moment."
              rows={5}
            />

            <TextAreaField
              label="Opening Messages"
              value={form.opening_messages}
              onChange={(value) => onUpdateField?.("opening_messages", value)}
              placeholder="Optional opening messages by narrator or selected characters."
              rows={5}
            />

            <TextAreaField
              label="Private Runtime Guidance"
              value={form.private_runtime_guidance}
              onChange={(value) =>
                onUpdateField?.("private_runtime_guidance", value)
              }
              placeholder="Hidden scenario guidance for the AI/runtime. Later, structured middleware should replace common repeated instructions."
              rows={7}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextAreaField
                label="Drift Fixes"
                value={form.drift_fixes}
                onChange={(value) => onUpdateField?.("drift_fixes", value)}
                placeholder="Optional corrections if the scenario starts drifting."
                rows={5}
              />

              <TextAreaField
                label="Failure Handling"
                value={form.failure_handling}
                onChange={(value) =>
                  onUpdateField?.("failure_handling", value)
                }
                placeholder="Optional guidance for setbacks, failed attempts, or alternate resolution paths."
                rows={5}
              />
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Publishing"
          title="Draft Settings"
          body="Scenarios start private by default. Public review and canon submission should happen later from My Creations."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CrestfallSelect
              label="Visibility"
              value={form.visibility}
              onChange={(value) => onUpdateField?.("visibility", value)}
              options={visibilityOptions}
            />

            <TextField
              label="Tags"
              value={form.tags}
              onChange={(value) => onUpdateField?.("tags", value)}
              placeholder="e.g., quest, unlock, mystery, romance"
            />
          </div>

          <div className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-[var(--muted-gold)]" size={19} />
              <div>
                <p className="text-sm text-[var(--foreground)]">
                  Future Scenario State
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Later, active rooms can track current story-circle step,
                  completed gates, locked rewards, known facts, and unlocked
                  media as structured state instead of relying on giant prompt
                  blocks.
                </p>
              </div>
            </div>
          </div>
        </BuilderSection>
      </div>
    </section>
    </>
  );
}

function BuilderSection({ eyebrow, title, body, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 font-display text-4xl">{title}</h2>

      <p className="mt-3 max-w-4xl leading-7 text-[var(--muted)]">{body}</p>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function StoryCircleCard({ step, value, onChange }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="grid gap-4 lg:grid-cols-[0.35fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {step.label}
          </p>

          <h3 className="mt-2 font-display text-3xl">{step.title}</h3>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {step.helper}
          </p>
        </div>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Optional story-circle notes..."
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
        />
      </div>
    </div>
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
        onChange={(event) => onChange(event.target.value)}
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function ReferenceSelectorField({
  label,
  description,
  selectedItems = [],
  onOpen,
  onRemove,
}) {

  return (
    <div className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>

      <button
        type="button"
        onClick={onOpen}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-4 text-left transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/50"
      >
        <span className="block text-sm text-[var(--foreground)]">
          {selectedItems.length
            ? `${selectedItems.length} selected`
            : "Select creations..."}
        </span>

        {description ? (
          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
            {description}
          </span>
        ) : null}
      </button>

      {selectedItems.length ? (
        <div className="mt-3 grid gap-2">
          {selectedItems.map((item) => (
            <SelectedReferenceChip
              key={item.id}
              item={item}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          No references selected.
        </p>
      )}
    </div>
  );
}

function SelectedReferenceChip({ item, onRemove }) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-lg">
            {item.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-display text-lg leading-none text-[var(--foreground)]">
          {item.title}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
          {item.type}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[var(--status-danger)] transition hover:bg-white/5"
        aria-label={`Remove ${item.title}`}
      >
        <X size={14} />
        Remove
      </button>
    </article>
  );
}