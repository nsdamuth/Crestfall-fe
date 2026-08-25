"use client";

import { Eyebrow } from "./Controls";

// The one reusable takeover pattern for a field that needs more room
// than a fold: it fills the creator's own content area (the frame
// around it, chrome and dialog, never changes), and the caller swaps
// its footer for Cancel/Apply. See CreatorStops.view.jsx for how the
// rail dims and the footer swaps while this is open.
export default function SecondaryPanel({ eyebrow, title, description, children }) {
  return (
    <>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">{title}</h2>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </>
  );
}
