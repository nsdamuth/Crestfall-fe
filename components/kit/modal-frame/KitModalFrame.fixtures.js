// Fixture states per docs/SPRINT-A-PLAN.md section 1.4. The phone
// dock is not a separate fixture; it is the "default" fixture
// verified at 390 (bottom-docked) then 1440 (centered).

const standardContent = (
  <div className="p-[var(--space-6)]">
    <p
      id="kit-modal-frame-default-title"
      className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]"
    >
      Default frame
    </p>
    <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
      Panel content is supplied entirely by the caller through
      children; the frame owns only the veil, panel anatomy, and the
      close control.
    </p>
  </div>
);

const scrollingContent = (
  <div className="p-[var(--space-6)]">
    <p
      id="kit-modal-frame-scrolling-title"
      className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]"
    >
      Scrolling frame
    </p>
    <div className="mt-[var(--space-4)] grid gap-[var(--space-4)]">
      {Array.from({ length: 10 }, (_, index) => (
        <article
          key={index}
          className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]"
        >
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Section {index + 1}
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            This repeated content proves internal scroll inside the
            92dvh cap while the overlay stays fixed.
          </p>
        </article>
      ))}
    </div>
  </div>
);

const sheetContent = (
  <div className="p-[var(--space-6)] pr-[calc(var(--control-md)+var(--space-6))]">
    <p
      id="kit-modal-frame-sheet-title"
      className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]"
    >
      Sort
    </p>
    <div className="mt-[var(--space-3)] flex flex-col gap-[var(--space-1)]">
      {["Newest", "Most played", "Most saved"].map((label) => (
        <button
          key={label}
          type="button"
          className="kit-focus flex min-h-[var(--control-md)] items-center rounded-[var(--radius-sm)] px-[var(--space-3)] text-left text-[length:var(--text-ui)] text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

const noCloseContent = (
  <div className="p-[var(--space-6)]">
    <p
      id="kit-modal-frame-no-close-title"
      className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]"
    >
      No close callback
    </p>
    <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
      With no onClose supplied, backdrop click, Escape, and the close
      control are all safe no-ops.
    </p>
  </div>
);

export const kitModalFrameFixtures = [
  {
    id: "default",
    label: "Default",
    props: {
      variant: "modal",
      panelClassName: "max-w-lg",
      ariaLabelledBy: "kit-modal-frame-default-title",
      children: standardContent,
    },
  },
  {
    id: "scrolling",
    label: "Scrolling",
    props: {
      variant: "modal",
      panelClassName: "max-w-2xl",
      ariaLabelledBy: "kit-modal-frame-scrolling-title",
      children: scrollingContent,
    },
  },
  {
    id: "sheet",
    label: "Sheet",
    props: {
      variant: "sheet",
      panelClassName: "max-w-none",
      ariaLabelledBy: "kit-modal-frame-sheet-title",
      children: sheetContent,
    },
  },
  {
    id: "noClose",
    label: "No close",
    props: {
      variant: "modal",
      panelClassName: "max-w-lg",
      ariaLabelledBy: "kit-modal-frame-no-close-title",
      children: noCloseContent,
      onClose: null,
    },
  },
  {
    id: "stacked",
    label: "Stacked (picker over modal)",
    props: {
      variant: "modal",
      panelClassName: "max-w-lg",
      ariaLabelledBy: "kit-modal-frame-default-title",
      children: standardContent,
    },
  },
];
