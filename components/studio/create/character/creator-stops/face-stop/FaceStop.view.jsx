"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import InfoTip from "../InfoTip";
import {
  CUSTOM_VALUE_MAX_LENGTH,
  ETHNIC_APPEARANCE_OPTIONS,
  EYE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_STYLE_OPTIONS,
  HAIR_TEXTURE_OPTIONS,
  SKIN_OPTIONS,
} from "./FaceStop.contract";

function SectionLabel({ children }) {
  return (
    <p className="mb-[var(--space-2)] text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      {children}
    </p>
  );
}

function SwatchGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-[var(--space-2)] sm:grid-cols-4 lg:grid-cols-6">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
            title={option.label}
            className={`rounded-[var(--radius-md)] border p-[var(--space-2)] transition ${
              active
                ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
            }`}
          >
            <div
              className="h-10 rounded-[var(--radius-sm)] border border-[var(--line-whisper)]"
              style={{
                background: option.color || "var(--fill)",
              }}
            />
            <p className="mt-[var(--space-2)] text-center text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
              {option.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      {options.map((option) => {
        const active = option === value;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(option)}
            className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-2)] text-sm transition ${
              active
                ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Fold({ title, sub, open, onToggle, children }) {
  return (
    <div className="mt-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle?.()}
        className="flex w-full items-center justify-between gap-[var(--space-3)] text-left"
      >
        <span>
          <span className="block font-display text-lg text-[var(--ink)]">
            {title}
          </span>
          <span className="block text-xs text-[var(--ink-dim)]">{sub}</span>
        </span>
        <span className="text-lg text-[var(--gold-ornament)]">
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? <div className="mt-[var(--space-4)] space-y-[var(--space-4)]">{children}</div> : null}
    </div>
  );
}

/* Rule 1: long select lists become inline dropdowns anchored to their own
   field, contained by the frame, scrolling internally, closing on choose,
   Escape, or click away. At 390 they expand in flow rather than
   overlaying, which this already does since the option list is a normal
   child of the field, not a positioned overlay. */
function EthnicAppearanceDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = ETHNIC_APPEARANCE_OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <SectionLabel>Ethnic Appearance</SectionLabel>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left text-sm transition ${
          open
            ? "border-[var(--gold-action)]"
            : "border-[var(--line-whisper)] hover:border-[var(--line)]"
        }`}
      >
        <span className="text-[var(--ink)]">
          {selected?.label || "Unspecified"}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--ink-dim)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="mt-[var(--space-2)] max-h-64 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)]">
          {ETHNIC_APPEARANCE_OPTIONS.map((option) => (
            <div
              key={option.value || "unspecified"}
              className={`flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] transition ${
                option.value === value
                  ? "bg-[var(--gold-ornament)]/15 text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)]"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className="flex-1 text-left text-sm"
              >
                {option.label}
              </button>
              <InfoTip
                label={`About ${option.label}`}
                text={option.description}
                flip
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CustomValueField({ label, value, onChange, placeholder }) {
  return (
    <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/20 p-[var(--space-3)]">
      <label className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-3)] text-[var(--text-label)] uppercase text-[var(--gold-ornament)]">
        <span>{label}</span>
        <span className="font-normal tabular-nums text-[var(--ink-faint)]">
          {(value || "").length}/{CUSTOM_VALUE_MAX_LENGTH}
        </span>
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={CUSTOM_VALUE_MAX_LENGTH}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
      />
    </div>
  );
}

export default function FaceStopView({
  skinTone = "",
  eyeColor = "",
  hairColor = "",
  hairLength = "",
  hairTexture = "",
  hairStyle = "",
  ethnicAppearance = "",
  skinCustomValue = "",
  eyeCustomValue = "",
  hairCustomValue = "",
  onChangeSkinTone = null,
  onChangeEyeColor = null,
  onChangeHairColor = null,
  onChangeHairLength = null,
  onChangeHairTexture = null,
  onChangeHairStyle = null,
  onChangeEthnicAppearance = null,
  onChangeSkinCustomValue = null,
  onChangeEyeCustomValue = null,
  onChangeHairCustomValue = null,
  moreHairOpen = false,
  onToggleMoreHair = null,
} = {}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-6">
      <h2 className="font-display text-3xl text-[var(--ink)]">
        Skin, eyes, and hair
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The face the portrait will carry.
      </p>

      <div className="mt-6">
        <SectionLabel>Skin</SectionLabel>
        <SwatchGrid
          options={SKIN_OPTIONS}
          value={skinTone}
          onChange={onChangeSkinTone}
        />
        {skinTone === "CUSTOM" ? (
          <CustomValueField
            label="Custom Skin Tone"
            value={skinCustomValue}
            onChange={onChangeSkinCustomValue}
            placeholder="Describe the skin tone"
          />
        ) : null}
      </div>

      <div className="mt-6">
        <SectionLabel>Eyes</SectionLabel>
        <SwatchGrid
          options={EYE_OPTIONS}
          value={eyeColor}
          onChange={onChangeEyeColor}
        />
        {eyeColor === "CUSTOM" ? (
          <CustomValueField
            label="Custom Eye Color"
            value={eyeCustomValue}
            onChange={onChangeEyeCustomValue}
            placeholder="Describe the eye color"
          />
        ) : null}
      </div>

      <div className="mt-6">
        <SectionLabel>Hair</SectionLabel>
        <SwatchGrid
          options={HAIR_COLOR_OPTIONS}
          value={hairColor}
          onChange={onChangeHairColor}
        />
        {hairColor === "CUSTOM" ? (
          <CustomValueField
            label="Custom Hair Color"
            value={hairCustomValue}
            onChange={onChangeHairCustomValue}
            placeholder="Describe the hair color"
          />
        ) : null}
      </div>

      <div className="mt-6">
        <EthnicAppearanceDropdown
          value={ethnicAppearance}
          onChange={onChangeEthnicAppearance}
        />
      </div>

      <Fold
        title="More hair"
        sub="Length, texture, and style"
        open={moreHairOpen}
        onToggle={onToggleMoreHair}
      >
        <div>
          <SectionLabel>Length</SectionLabel>
          <ChipRow
            options={HAIR_LENGTH_OPTIONS}
            value={hairLength}
            onChange={onChangeHairLength}
          />
        </div>

        <div>
          <SectionLabel>Texture</SectionLabel>
          <ChipRow
            options={HAIR_TEXTURE_OPTIONS}
            value={hairTexture}
            onChange={onChangeHairTexture}
          />
        </div>

        <div>
          <SectionLabel>Style</SectionLabel>
          <ChipRow
            options={HAIR_STYLE_OPTIONS}
            value={hairStyle}
            onChange={onChangeHairStyle}
          />
        </div>
      </Fold>
    </div>
  );
}
