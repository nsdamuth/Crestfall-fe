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
  <div className="p-[var(--space-6)]">
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

// Viewer-variant content (R2/R5; refreshed 10 Aug 2026 review gate,
// find D-1: the phase-1 "empty shell" placeholder rendered a text
// block and never exercised the chromeless surface). A synthetic
// image inside the gold hairline recipe, plus a pointer-events-auto
// wrapper matching the click-transparent panel contract (R3).
const viewerImageSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960"><rect width="720" height="960" fill="#1d1a15"/><circle cx="360" cy="400" r="180" fill="#d9bd82" opacity="0.75"/></svg>'
)}`;

const viewerContent = (
  <div className="pointer-events-none flex h-full w-full items-center justify-center">
    <div className="pointer-events-auto overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={viewerImageSrc}
        alt="Viewer fixture"
        className="block h-auto max-h-[78dvh] w-auto max-w-full"
      />
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
  {
    id: "viewer",
    label: "Viewer (chromeless, R2/R5)",
    props: {
      variant: "viewer",
      panelClassName: "",
      ariaLabel: "Viewer fixture",
      children: viewerContent,
    },
  },
];
