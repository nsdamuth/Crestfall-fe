import { Sparkles } from "lucide-react";

export function SectionTitle({ eyebrow, title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

export function TextField({ label, value = "", onChange = () => {} }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value = "",
  onChange = () => {},
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

export function ReadOnlyField({ label, value = "" }) {
  return (
    <div className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
        {value || "Not set"}
      </div>
    </div>
  );
}

export function ActionPanel({
  title,
  body,
  button,
  onClick,
  disabled = true,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <Sparkles className="text-[var(--gold-ornament)]" size={20} />
      <h3 className="mt-3 font-display text-3xl">{title}</h3>
      <p className="mt-2 leading-7 text-[var(--ink-dim)]">{body}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="cf-btn cf-btn--secondary mt-5"
      >
        {button}
      </button>
    </div>
  );
}