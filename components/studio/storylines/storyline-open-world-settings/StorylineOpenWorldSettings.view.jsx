import { Globe2 } from "lucide-react";

export default function StorylineOpenWorldSettingsView({
  title = "Open-World Interludes",
  description = "",
  defaultTransitionLabel = "Default Transition",
  defaultTransitionValue = "OPEN_WORLD_UNTIL_TRIGGER",
  defaultTransitionOptions = [],
  defaultTransitionHelp = "",
  continuityEyebrow = "Continuity Always Preserved",
  continuityDescription = "",
  guidanceLabel = "Open-World Guidance",
  guidanceValue = "",
  guidancePlaceholder = "",
  pressureCadenceLabel = "Pressure Cadence Guidance",
  pressureCadenceValue = "",
  pressureCadencePlaceholder = "",
  onChangeDefaultTransition = null,
  onChangeGuidance = null,
  onChangePressureCadence = null,
} = {}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Globe2 size={22} className="mt-1 text-[var(--muted-gold)]" />
        <div>
          <h3 className="font-display text-3xl">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {defaultTransitionLabel}
          </span>
          <select
            value={defaultTransitionValue}
            onChange={(event) =>
              onChangeDefaultTransition?.(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
          >
            {defaultTransitionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {defaultTransitionHelp}
          </p>
        </label>

        <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {continuityEyebrow}
          </p>
          <p className="mt-2">{continuityDescription}</p>
        </div>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          {guidanceLabel}
        </span>
        <textarea
          rows={4}
          value={guidanceValue}
          onChange={(event) => onChangeGuidance?.(event.target.value)}
          placeholder={guidancePlaceholder}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          {pressureCadenceLabel}
        </span>
        <textarea
          rows={3}
          value={pressureCadenceValue}
          onChange={(event) => onChangePressureCadence?.(event.target.value)}
          placeholder={pressureCadencePlaceholder}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>
    </div>
  );
}
