"use client";

import { ChevronRight } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

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
  const hasValue = Boolean(triggerSummary) && triggerSummary !== "Not chosen";

  return (
    <div className="md:col-span-2">
      <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {triggerLabel}
      </span>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="mt-[var(--space-1)] flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left transition-colors hover:border-[var(--state-hover-line)]"
      >
        <span
          className={`truncate text-[length:var(--text-body)] leading-[var(--lh-body)] ${hasValue ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
        >
          {triggerSummary || "Not chosen"}
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-[var(--ink-faint)]"
          aria-hidden="true"
        />
      </button>

      {open ? (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-4xl"
          onClose={onClose}
          ariaLabel={modalTitle}
        >
          <div className="flex max-h-[92dvh] flex-col p-[var(--space-6)] pt-[var(--space-8)]">
            <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
              {modalTitle}
            </h2>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            <div className="min-h-0 flex-1 overflow-y-auto pb-[var(--space-2)] pr-1">
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
            </div>

            <div className="mt-[var(--space-5)] flex justify-end">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="cf-btn cf-btn--primary"
              >
                Done
              </button>
            </div>
          </div>
        </KitModalFrame>
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
    <div className="mt-[var(--space-6)] first:mt-0">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {section?.title || "Hair"}
      </p>

      <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] sm:grid-cols-3 lg:grid-cols-7">
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
              className={`rounded-[var(--radius-md)] border p-[var(--space-2)] transition-colors ${
                active
                  ? "border-[var(--gold-ornament)]/60 bg-[var(--fill-whisper)]"
                  : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] hover:border-[var(--gold-ornament)]/35"
              }`}
              title={option?.label || "Not chosen"}
            >
              <div
                className="h-10 rounded-[var(--radius-md)] border border-[var(--line-whisper)]"
                style={option?.swatchStyle || {}}
              />
              <p className="mt-[var(--space-2)] text-center text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
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
    <div className="mt-[var(--space-6)] first:mt-0">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {section?.title || "Hair"}
      </p>

      <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] sm:grid-cols-2 lg:grid-cols-4">
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
              className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left text-[length:var(--text-body)] transition-colors ${
                active
                  ? "border-[var(--gold-ornament)]/60 bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
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
    <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)]">
      <label className="block">
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {title}
        </span>
        <input
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-[var(--space-2)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)]"
        />
      </label>
      <div className="mt-[var(--space-2)] flex items-start justify-between gap-[var(--space-4)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
        <p>{helperText}</p>
        <span className="shrink-0 tabular-nums">
          {String(value || "").length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
