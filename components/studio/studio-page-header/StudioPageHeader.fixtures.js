const actionFixture = (
  <button
    type="button"
    className="rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
  >
    Page Action
  </button>
);

export const studioPageHeaderFixtures = [
  {
    id: "standard",
    label: "Standard",
    props: {
      eyebrow: "Studio",
      title: "Community",
      description:
        "Browse public creations, discover storytellers, and follow the work that interests you.",
    },
  },
  {
    id: "with-action",
    label: "With Action",
    props: {
      eyebrow: "My Studio",
      title: "My Creations",
      description: "Manage drafts, published work, and creator tools.",
      children: actionFixture,
    },
  },
  {
    id: "title-only",
    label: "Title Only",
    props: {
      title: "Account",
    },
  },
  {
    id: "no-eyebrow",
    label: "No Eyebrow",
    props: {
      title: "Official Characters",
      description: "Explore Crestfall's official canon cast.",
    },
  },
  {
    id: "no-description",
    label: "No Description",
    props: {
      eyebrow: "Create",
      title: "Choose a Creation Type",
      children: actionFixture,
    },
  },
  {
    id: "long-content",
    label: "Long Content",
    props: {
      eyebrow: "Responsive Stress Test",
      title: "A Deliberately Long Studio Page Heading for Narrow Viewports",
      description:
        "This fixture verifies that an unusually long title, supporting description, and optional action continue to wrap cleanly without changing the established Studio page-header hierarchy.",
      children: actionFixture,
    },
  },
];
