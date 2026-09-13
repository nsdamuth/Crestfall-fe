import { Globe2 } from "lucide-react";

import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";

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
        <Globe2 size={22} className="mt-1 text-[var(--gold-ornament)]" />
        <div>
          <h3 className="font-display text-3xl">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            {defaultTransitionLabel}
          </span>
          <div className="mt-2 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
            <KitDropdownView
              options={defaultTransitionOptions}
              selectedValues={defaultTransitionValue ? [defaultTransitionValue] : []}
              isMultiSelect={false}
              onToggleOption={(nextValue) => onChangeDefaultTransition?.(nextValue)}
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            {defaultTransitionHelp}
          </p>
        </label>

        <div className="rounded-xl border border-white/10 bg-[var(--surface-2)] p-4 text-sm leading-6 text-[var(--ink-dim)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            {continuityEyebrow}
          </p>
          <p className="mt-2">{continuityDescription}</p>
        </div>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          {guidanceLabel}
        </span>
        <textarea
          rows={4}
          value={guidanceValue}
          onChange={(event) => onChangeGuidance?.(event.target.value)}
          placeholder={guidancePlaceholder}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          {pressureCadenceLabel}
        </span>
        <textarea
          rows={3}
          value={pressureCadenceValue}
          onChange={(event) => onChangePressureCadence?.(event.target.value)}
          placeholder={pressureCadencePlaceholder}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>
    </div>
  );
}
