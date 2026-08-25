const placeholderSlot = (label) => (
  <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-3)] p-4 text-[var(--text-label)] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
    {label}
  </div>
);

const shortContent = (
  <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-8 text-[var(--ink)]">
    Page content renders here.
  </div>
);

const longContent = (
  <div className="grid gap-4">
    {Array.from({ length: 8 }, (_, index) => (
      <article
        key={index}
        className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Section {index + 1}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          Stress content verifying the content column scrolls independently
          of the persistent chrome.
        </p>
      </article>
    ))}
  </div>
);

export const studioShellFixtures = [
  {
    id: "default",
    label: "Default",
    props: {
      sidebarSlot: placeholderSlot("Sidebar Slot"),
      mobileNavSlot: placeholderSlot("Mobile Nav Slot"),
      topBarSlot: placeholderSlot("Top Bar Slot"),
      children: shortContent,
    },
  },
  {
    id: "empty",
    label: "Empty Content",
    props: {
      sidebarSlot: placeholderSlot("Sidebar Slot"),
      mobileNavSlot: placeholderSlot("Mobile Nav Slot"),
      topBarSlot: placeholderSlot("Top Bar Slot"),
      children: null,
    },
  },
  {
    id: "longest-content",
    label: "Longest Content",
    props: {
      sidebarSlot: placeholderSlot("Sidebar Slot"),
      mobileNavSlot: placeholderSlot("Mobile Nav Slot"),
      topBarSlot: placeholderSlot("Top Bar Slot"),
      children: longContent,
    },
  },
];
