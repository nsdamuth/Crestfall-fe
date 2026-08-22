import { Clock, CloudSun, Settings } from "lucide-react";

import {
  NumberField,
  SectionTitle,
  SelectField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

// CLEANUP fix: SlotFallback drops the bordered/backgrounded panel for
// plain helper text (the same helper is duplicated at
// location-scene-atmosphere-section/LocationSceneAtmosphereSection.view.jsx,
// fixed there too).
function SlotFallback({ children }) {
  return (
    <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
      {children}
    </p>
  );
}

// 4.9 toggle: pill track, --control-sm thumb, gold on-state, a state
// word beside the track. Replaces the native checkbox chip rows for
// boolean enable toggles in this section (weather enable, calendar
// enable, exact-clock visibility).
function Toggle({ checked, onChange, onLabel, offLabel, children }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center gap-[var(--space-4)] text-left"
    >
      <span
        className={`relative inline-flex h-[var(--control-sm)] w-[calc(var(--control-sm)*1.8)] flex-none items-center rounded-[var(--radius-full)] border transition-colors ${
          checked
            ? "border-[var(--gold-action)] bg-[var(--gold-action)]"
            : "border-[var(--line)] bg-[var(--surface-1)]"
        }`}
      >
        <span
          className={`inline-block h-[calc(var(--control-sm)-4px)] w-[calc(var(--control-sm)-4px)] rounded-full bg-[var(--tag-fill-ink)] transition-transform ${
            checked ? "translate-x-[calc(var(--control-sm)*0.8)]" : "translate-x-[2px]"
          }`}
        />
      </span>

      <span className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
        {children || (checked ? onLabel : offLabel)}
      </span>
    </button>
  );
}

function RuntimeStatBlock({ rows }) {
  return (
    <div className="grid gap-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
      {rows.map((row) => (
        <p key={row.label}>
          {row.label}: <span className="text-[var(--ink)]">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function LocationRuntimeModulesSectionView({
  sectionBody,
  weatherEyebrow,
  weatherTitle,
  weatherDescription,
  weatherConfigureLabel,
  weatherEditLabel,
  weatherEnableLabel,
  weatherDisabledLabel,
  timeEyebrow,
  timeTitle,
  timeDescription,
  enableLabel,
  enabledLabel,
  inheritanceModeLabel,
  turnAdvanceLabel,
  dayLengthLabel,
  yearLengthLabel,
  startDayLabel,
  startMinutesLabel,
  dayLabelPrefixLabel,
  exactClockLabel,
  weatherModuleId,
  hasWeatherBinding = false,
  weatherEnabled = false,
  weatherModuleTitle,
  weatherStatusLabel,
  moduleId,
  timeCalendarEnabled = false,
  inheritanceMode = "INHERITABLE",
  timeCalendarProfile = {},
  statusLabel,
  runtimeBehaviorLabel,
  runtimeMechanicsSlot = null,
  registryAttachmentsSlot = null,
  runtimeMechanicsFallbackText,
  registryAttachmentsFallbackText,
  onOpenWeatherConfig = () => {},
  onToggleWeather = () => {},
  onToggleTimeCalendar = () => {},
  onChangeInheritanceMode = () => {},
  onChangeTurnAdvance = () => {},
  onChangeDayLength = () => {},
  onChangeYearLength = () => {},
  onChangeStartDay = () => {},
  onChangeStartMinutes = () => {},
  onChangeDayLabelPrefix = () => {},
  onChangeExactClockVisibility = () => {},
}) {
  return (
    <div>
      <SectionTitle body={sectionBody} />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)]">
        {runtimeMechanicsSlot || (
          <SlotFallback>{runtimeMechanicsFallbackText}</SlotFallback>
        )}

        {/* Section 5 de-nesting: inset hairline, tier 4 label, no
            bordered/backgrounded panel. */}
        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <div className="flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-[var(--space-3)]">
              <CloudSun size={18} aria-hidden="true" className="mt-[2px] flex-none text-[var(--gold-ornament)]" />

              <div>
                <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                  {weatherEyebrow}
                </p>
                <h3 className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                  {weatherTitle}
                </h3>
                <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                  {weatherDescription}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWeatherConfig}
              className="cf-btn cf-btn--primary shrink-0"
            >
              <Settings size={14} />
              {hasWeatherBinding ? weatherEditLabel : weatherConfigureLabel}
            </button>
          </div>

          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)]">
            {hasWeatherBinding ? (
              <Toggle
                checked={weatherEnabled}
                onChange={onToggleWeather}
                onLabel={weatherEnableLabel}
                offLabel={weatherDisabledLabel}
              />
            ) : (
              <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                No Weather module is attached. Configure Weather to create and attach the
                location&apos;s in-world weather rules.
              </p>
            )}

            <RuntimeStatBlock
              rows={[
                { label: "Module ID", value: weatherModuleId },
                { label: "Status", value: weatherStatusLabel },
                { label: "Bound module", value: weatherModuleTitle },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <div className="flex items-start gap-[var(--space-3)]">
            <Clock size={18} aria-hidden="true" className="mt-[2px] flex-none text-[var(--gold-ornament)]" />

            <div>
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {timeEyebrow}
              </p>
              <h3 className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                {timeTitle}
              </h3>
              <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                {timeDescription}
              </p>
            </div>
          </div>

          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)]">
            <Toggle
              checked={timeCalendarEnabled}
              onChange={onToggleTimeCalendar}
              onLabel={enabledLabel}
              offLabel={enableLabel}
            />

            <div className="grid gap-[var(--space-4)] md:grid-cols-2">
              <SelectField
                label={inheritanceModeLabel}
                value={inheritanceMode}
                onChange={(value) => onChangeInheritanceMode(value)}
                options={[
                  { value: "INHERITABLE", label: "Inheritable / Parent authority can win" },
                  { value: "OVERRIDE", label: "Local override / This location wins" },
                ]}
              />

              <NumberField
                label={turnAdvanceLabel}
                min={0}
                max={240}
                value={timeCalendarProfile.defaultTurnAdvanceMinutes}
                onChange={onChangeTurnAdvance}
              />

              <NumberField
                label={dayLengthLabel}
                min={60}
                max={10080}
                value={timeCalendarProfile.dayLengthMinutes}
                onChange={onChangeDayLength}
              />

              <NumberField
                label={yearLengthLabel}
                min={1}
                max={10000}
                value={timeCalendarProfile.yearLengthDays}
                onChange={onChangeYearLength}
              />

              <NumberField
                label={startDayLabel}
                min={1}
                value={timeCalendarProfile.startDay}
                onChange={onChangeStartDay}
              />

              <NumberField
                label={startMinutesLabel}
                min={0}
                max={10079}
                value={timeCalendarProfile.startMinutes}
                onChange={onChangeStartMinutes}
              />

              <div className="md:col-span-2">
                <TextField
                  label={dayLabelPrefixLabel}
                  value={timeCalendarProfile.dayLabelPrefix}
                  onChange={onChangeDayLabelPrefix}
                  placeholder="Day"
                />
              </div>
            </div>

            <Toggle
              checked={Boolean(timeCalendarProfile.showExactClockToComposer)}
              onChange={onChangeExactClockVisibility}
              onLabel={exactClockLabel}
              offLabel={exactClockLabel}
            >
              {exactClockLabel}
            </Toggle>

            <RuntimeStatBlock
              rows={[
                { label: "Module ID", value: moduleId },
                { label: "Status", value: statusLabel },
                { label: "Runtime behavior", value: runtimeBehaviorLabel },
                {
                  label: "Current turn pacing",
                  value: `${timeCalendarProfile.defaultTurnAdvanceMinutes} minute(s)`,
                },
              ]}
            />
          </div>
        </div>

        {registryAttachmentsSlot || (
          <SlotFallback>{registryAttachmentsFallbackText}</SlotFallback>
        )}
      </div>
    </div>
  );
}
