const standardBody = (
  <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-5 text-[var(--ink)]">
    <p className="text-sm leading-6 text-[var(--ink-dim)]">
      Modal panel content is supplied entirely by the caller through
      children; ModalShell owns only the overlay, scrim, and dialog frame.
    </p>
  </div>
);

const longBody = (
  <div className="grid gap-4">
    {Array.from({ length: 10 }, (_, index) => (
      <article
        key={index}
        className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-4"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Panel Section {index + 1}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          This repeated content verifies the caller-owned panel scrolls
          independently while the overlay stays fixed.
        </p>
      </article>
    ))}
  </div>
);

export const modalShellFixtures = [
  {
    id: "default",
    label: "Default",
    props: {
      panelClassName:
        "relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-4)] p-5 shadow-[var(--shadow-modal)]",
      ariaLabelledBy: "modal-shell-fixture-title",
      children: standardBody,
      onClose: null,
    },
  },
  {
    id: "no-close",
    label: "No Close Callback",
    props: {
      panelClassName:
        "relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-4)] p-5 shadow-[var(--shadow-modal)]",
      children: (
        <p className="text-sm leading-6 text-[var(--ink-dim)]">
          The overlay remains safe to render when no close handler is
          supplied; the backdrop dismiss is a no-op.
        </p>
      ),
      onClose: null,
    },
  },
  {
    id: "empty",
    label: "Empty Panel",
    props: {
      panelClassName:
        "relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-4)] p-5 shadow-[var(--shadow-modal)]",
      children: null,
      onClose: null,
    },
  },
  {
    id: "scrolling",
    label: "Scrollable Panel",
    props: {
      panelClassName:
        "relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-4)] p-5 shadow-[var(--shadow-modal)]",
      children: longBody,
      onClose: null,
    },
  },
];
