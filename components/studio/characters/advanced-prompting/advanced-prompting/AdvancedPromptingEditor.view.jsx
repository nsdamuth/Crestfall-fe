"use client";

import {
  ChevronDown,
  ChevronRight,
  Eraser,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

function getSecurityPresentation(
  securityStatus = "INACTIVE",
  subjectLabel = "character"
) {
  const status = String(securityStatus || "INACTIVE").toUpperCase();

  const presentations = {
    APPROVED: {
      label: "Approved",
      detail: "The current directives passed server validation and safety review.",
      className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
    },
    APPROVED_WITH_SANITIZATION: {
      label: "Approved with protected instructions removed",
      detail:
        "Crestfall removed instructions that attempted to override platform or engine authority.",
      className: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    },
    NEEDS_RESCAN: {
      label: "Needs security check",
      detail: `Save the ${subjectLabel} to scan and compile the latest changes.`,
      className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
    },
    REVIEW_REQUIRED: {
      label: "Review required",
      detail:
        "The safety classifier could not approve these directives. They remain inactive until rescanned or revised.",
      className: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    },
    BLOCKED: {
      label: "Needs revision",
      detail:
        "The directives were rejected by Crestfall safety rules and are not active.",
      className: "border-red-300/30 bg-red-300/10 text-red-100",
    },
    INACTIVE: {
      label: "Inactive",
      detail: "Advanced Prompting is optional and currently has no runtime effect.",
      className: "border-white/10 bg-black/25 text-[var(--ink-dim)]",
    },
  };

  return presentations[status] || presentations.NEEDS_RESCAN;
}

function Counter({ value = 0, limit = 0 }) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 0;
  const nearLimit = safeLimit > 0 && safeValue >= safeLimit * 0.9;

  return (
    <span className={nearLimit ? "text-amber-200" : "text-[var(--ink-dim)]"}>
      {safeValue.toLocaleString()} / {safeLimit.toLocaleString()}
    </span>
  );
}

export default function AdvancedPromptingEditorView({
  enabled = false,
  sections = [],
  totalCharacters = 0,
  totalLimit = 0,
  securityStatus = "INACTIVE",
  sanitizedFragmentCount = 0,
  onSetEnabled = null,
  onToggleSection = null,
  onUpdateSection = null,
  onClearSection = null,
  eyebrow = "Advanced Prompting · Optional",
  title = "Creator Directives",
  description =
    "Add nuanced portrayal, conditional behavior, and anti-drift guidance only when the standard character fields and modules are not enough. Crestfall safety, verified state, modules, registries, meters, and guards always take precedence.",
  inactiveDescription =
    "Standard character fields, modules, registries, and mechanics remain a complete character definition. Advanced Prompting adds nothing unless enabled.",
  authorityNotice = "",
  subjectLabel = "character",
}) {
  const safeSections = Array.isArray(sections) ? sections : [];
  const securityPresentation = getSecurityPresentation(
    securityStatus,
    subjectLabel
  );

  return (
    <section className="min-w-0 max-w-full rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
            <SlidersHorizontal size={18} />
            <p className="text-xs uppercase tracking-[0.22em]">
              {eyebrow}
            </p>
          </div>

          <h3 className="mt-3 font-display text-3xl">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onSetEnabled?.(!enabled)}
          className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
            enabled
              ? "border-[var(--gold-ornament)]/50 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
              : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30"
          }`}
        >
          {enabled ? "Enabled" : "Enable Advanced Prompting"}
        </button>
      </div>

      {authorityNotice ? (
        <div className="mt-5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
          {authorityNotice}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[var(--gold-ornament)]" />
          <span className="uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            Combined Budget
          </span>
        </div>
        <Counter value={totalCharacters} limit={totalLimit} />
      </div>

      <div
        className={`mt-3 rounded-xl border px-4 py-3 text-sm ${securityPresentation.className}`}
      >
        <p className="font-medium">{securityPresentation.label}</p>
        <p className="mt-1 text-xs leading-5 opacity-85">
          {securityPresentation.detail}
        </p>
        {Number(sanitizedFragmentCount || 0) > 0 ? (
          <p className="mt-2 text-xs">
            Protected fragments removed: {sanitizedFragmentCount}
          </p>
        ) : null}
      </div>

      {enabled ? (
        <div className="mt-5 space-y-3">
          {safeSections.map((section) => {
            const hasText = Boolean(section.value);
            const ToggleIcon = section.expanded ? ChevronDown : ChevronRight;

            return (
              <article
                key={section.id}
                className="min-w-0 max-w-full rounded-xl border border-white/10 bg-black/25"
              >
                <button
                  type="button"
                  onClick={() => onToggleSection?.(section.id)}
                  className="flex min-w-0 w-full items-start justify-between gap-4 px-4 py-4 text-left"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <ToggleIcon
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--gold-ornament)]"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {section.label}
                        </p>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.13em] text-[var(--ink-dim)]">
                          {section.activation === "ALWAYS"
                            ? "Broadly active"
                            : "Contextual"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs">
                    <Counter
                      value={section.characterCount}
                      limit={section.maxLength}
                    />
                  </span>
                </button>

                {section.expanded ? (
                  <div className="border-t border-white/10 px-4 py-4">
                    <textarea
                      value={section.value || ""}
                      onChange={(event) =>
                        onUpdateSection?.(section.id, event.target.value)
                      }
                      placeholder={section.placeholder}
                      rows={8}
                      className="min-w-0 max-w-full w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
                    />

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                      <Counter
                        value={section.characterCount}
                        limit={section.maxLength}
                      />

                      {hasText ? (
                        <button
                          type="button"
                          onClick={() => onClearSection?.(section.id)}
                          className="cf-btn cf-btn--danger"
                        >
                          <Eraser size={13} />
                          Clear section
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--ink-dim)]">
          {inactiveDescription}
        </div>
      )}
    </section>
  );
}
