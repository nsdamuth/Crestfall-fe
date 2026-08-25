import { Children } from "react";

// Page heading law hardening (R7, 10 Aug 2026 review gate): the
// children slot is documented as page-level ACTIONS, but many live
// pages pass the page description as bare text children, which
// rendered in the shrink-0 slot BESIDE the H1 (the account title
// collision, Sprint D 0.9(a)). Text-only children now render through
// the description branch (eyebrow, title, description left aligned to
// the content edge, separator full content width), so that misuse can
// no longer produce the drift; the side slot is reserved for element
// children (real actions).
export default function StudioPageHeaderView({
  eyebrow = "",
  title = "",
  description = "",
  children = null,
}) {
  const childList = Children.toArray(children);
  const childrenAreTextOnly =
    childList.length > 0 &&
    childList.every(
      (child) => typeof child === "string" || typeof child === "number"
    );
  const resolvedDescription =
    description || (childrenAreTextOnly ? childList.join(" ") : "");
  const actions = childrenAreTextOnly ? null : children;

  return (
    <header className="flex flex-col gap-6 border-b border-[var(--gold-ornament)]/15 pb-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-[var(--space-2)] mb-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)]">
          {title}
        </h1>

        {resolvedDescription ? (
          <p className="max-w-[44rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
