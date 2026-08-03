const standardBody = (
  <div className="grid gap-4">
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      Display Name
      <input
        type="text"
        defaultValue="Captain Elian Voss"
        className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--foreground)] outline-none"
      />
    </label>

    <label className="grid gap-2 text-sm text-[var(--muted)]">
      Registry Notes
      <textarea
        defaultValue="A trusted harbor captain who knows the eastern trade routes."
        className="min-h-32 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--foreground)] outline-none"
      />
    </label>
  </div>
);

const longBody = (
  <div className="grid gap-4">
    {Array.from({ length: 10 }, (_, index) => (
      <article
        key={index}
        className="rounded-xl border border-white/10 bg-black/25 p-4"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Registry Section {index + 1}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          This repeated content verifies that the modal body remains independently
          scrollable without allowing the full viewport overlay to drift.
        </p>
      </article>
    ))}
  </div>
);

export const npcRegistryModalShellFixtures = [
  {
    id: "standard",
    label: "Standard Entry",
    props: {
      title: "NPC Entry",
      children: standardBody,
      onClose: null,
    },
  },
  {
    id: "relationship",
    label: "Relationship Rule",
    props: {
      title: "Relationship Rule",
      children: (
        <div className="rounded-xl border border-white/10 bg-black/25 p-5">
          <p className="text-sm leading-6 text-[var(--muted)]">
            Define the source NPC, target NPC, relationship type, and private
            notes inside the modal content area.
          </p>
        </div>
      ),
      onClose: null,
    },
  },
  {
    id: "empty",
    label: "Empty Body",
    props: {
      title: "Empty Modal",
      children: null,
      onClose: null,
    },
  },
  {
    id: "long-title",
    label: "Long Title",
    props: {
      title:
        "A Deliberately Long NPC Registry Modal Title for Responsive Stress Testing",
      children: standardBody,
      onClose: null,
    },
  },
  {
    id: "scrolling",
    label: "Scrollable Body",
    props: {
      title: "Large Registry Form",
      children: longBody,
      onClose: null,
    },
  },
  {
    id: "missing-action",
    label: "Missing Close Handler",
    props: {
      title: "Defensive Callback State",
      children: (
        <p className="text-sm leading-6 text-[var(--muted)]">
          The close control remains safe when no callback is supplied.
        </p>
      ),
      onClose: null,
    },
  },
];
