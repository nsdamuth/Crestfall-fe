"use client";

import { ChevronDown } from "lucide-react";

export default function HairModalView({
  open = false,
  triggerLabel = "Hair",
  triggerSummary = "Not chosen",
  modalTitle = "Select Hair",
  sections = [],
  customValueMaxLength = 240,
  onOpen = null,
  onClose = null,
  onChooseOption = null,
  onChangeCustomValue = null,
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition md:col-span-2 ${
        open
          ? "border-[var(--gold-ornament)]/45 bg-black/25"
          : "border-white/10 bg-black/35"
      }`}
    >
      <button
        type="button"
        onClick={() => (open ? onClose?.() : onOpen?.())}
        aria-expanded={open}
        aria-label={modalTitle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:border-[var(--gold-ornament)]/35"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {triggerLabel}
          </span>
          <span className="mt-1 block text-[var(--ink)]">
            {triggerSummary || "Not chosen"}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--ink-dim)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="border-t border-[var(--line-whisper)] px-4 py-4">
            {sections.map((section) =>
              section?.layout === "swatches" ? (
                <ColorSection
                  key={section.id}
                  section={section}
                  customValueMaxLength={customValueMaxLength}
                  onChooseOption={onChooseOption}
                  onChangeCustomValue={onChangeCustomValue}
                />
              ) : (
                <OptionSection
                  key={section.id}
                  section={section}
                  customValueMaxLength={customValueMaxLength}
                  onChooseOption={onChooseOption}
                  onChangeCustomValue={onChangeCustomValue}
                />
              )
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="cf-btn cf-btn--primary"
              >
                Done
              </button>
            </div>
        </div>
      ) : null}
    </div>
  );
}

function ColorSection({
  section,
  customValueMaxLength,
  onChooseOption,
  onChangeCustomValue,
}) {
  return (
    <div className="mt-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        {section?.title || "Hair"}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
        {(section?.options || []).map((option) => {
          const active = option?.isCustom
            ? Boolean(section?.customActive)
            : !section?.customActive &&
              option?.id === section?.selectedOptionId;

          return (
            <button
              key={option?.id || "none"}
              type="button"
              onClick={() => onChooseOption?.(section?.id, option?.id || "")}
              className={`rounded-xl border p-2 transition ${
                active
                  ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15"
                  : "border-white/10 bg-black/30 hover:border-[var(--gold-ornament)]/35"
              }`}
              title={option?.label || "Not chosen"}
            >
              <div
                className="h-10 rounded-lg border border-white/10"
                style={option?.swatchStyle || {}}
              />
              <p className="mt-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
                {option?.label || "Not chosen"}
              </p>
            </button>
          );
        })}
      </div>

      {section?.customActive ? (
        <CustomValueInput
          title={
            section?.customInputTitle ||
            `Custom ${section?.title || "Value"}`
          }
          value={section?.customValue || ""}
          onChange={(nextValue) =>
            onChangeCustomValue?.(section?.id, nextValue)
          }
          placeholder={section?.customPlaceholder || ""}
          helperText={section?.customHelperText || ""}
          maxLength={customValueMaxLength}
        />
      ) : null}
    </div>
  );
}

function OptionSection({
  section,
  customValueMaxLength,
  onChooseOption,
  onChangeCustomValue,
}) {
  return (
    <div className="mt-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        {section?.title || "Hair"}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {(section?.options || []).map((option) => {
          const active = option?.isCustom
            ? Boolean(section?.customActive)
            : !section?.customActive &&
              option?.id === section?.selectedOptionId;

          return (
            <button
              key={option?.id || "none"}
              type="button"
              onClick={() => onChooseOption?.(section?.id, option?.id || "")}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
              }`}
            >
              {option?.label || "Not chosen"}
            </button>
          );
        })}
      </div>

      {section?.customActive ? (
        <CustomValueInput
          title={
            section?.customInputTitle ||
            `Custom ${section?.title || "Value"}`
          }
          value={section?.customValue || ""}
          onChange={(nextValue) =>
            onChangeCustomValue?.(section?.id, nextValue)
          }
          placeholder={section?.customPlaceholder || ""}
          helperText={section?.customHelperText || ""}
          maxLength={customValueMaxLength}
        />
      ) : null}
    </div>
  );
}

function CustomValueInput({
  title,
  value,
  onChange,
  placeholder,
  helperText,
  maxLength,
}) {
  return (
    <div className="mt-3 rounded-xl border border-[var(--gold-ornament)]/25 bg-black/30 p-4">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          {title}
        </span>
        <input
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />
      </label>
      <div className="mt-2 flex items-start justify-between gap-4 text-xs leading-5 text-[var(--ink-dim)]">
        <p>{helperText}</p>
        <span className="shrink-0 tabular-nums">
          {String(value || "").length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
