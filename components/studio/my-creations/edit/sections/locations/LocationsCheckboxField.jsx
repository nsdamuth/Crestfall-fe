import { Check } from "lucide-react";

// CheckboxField, RULED 22 Aug 2026 (Ruling 2, checkbox grammar, ED1G
// SW6). Shared inside the locations/ subtree by every native checkbox
// chip row this lane owns (WeatherModuleConfigModal,
// TrackersModuleConfigModal, LocationIdentitySection,
// LocationRuntimeModulesSection). Checked state is a gold check mark
// on a light gold wash (--fill-whisper) with a --gold-action border;
// rest state is a quiet bordered square (--line) at the control-size
// floor (--control-editor-sm, 28px, the smallest ruled control step).
// Row label sits beside the box, --ink-dim at rest, --ink checked.
// The native checkbox stays the input of record (keyboard/AT
// behavior); its default box is painted transparent and a Check glyph
// is layered on top, driven by the peer-checked state.
export default function LocationsCheckboxField({
  label,
  checked = false,
  onChange = () => {},
  disabled = false,
}) {
  return (
    <label
      className={`flex items-center gap-[var(--space-3)] ${
        disabled ? "pointer-events-none opacity-[var(--state-disabled-opacity)]" : "cursor-pointer"
      }`}
    >
      <span className="relative inline-flex h-[var(--control-editor-sm)] w-[var(--control-editor-sm)] flex-none items-center justify-center">
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent outline-none transition-colors checked:border-[var(--gold-action)] checked:bg-[var(--fill-whisper)]"
        />
        <Check
          size={14}
          strokeWidth={2.5}
          aria-hidden="true"
          className="pointer-events-none relative text-[var(--gold-action)] opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      <span
        className={`text-[length:var(--text-body)] leading-[var(--lh-body)] ${
          checked ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
