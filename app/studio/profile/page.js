import StudioPageHeader from "@/components/studio/StudioPageHeader";

const featuredItems = [
  {
    title: "Chronicle Update: New Crestfall City Arc",
    type: "Announcement",
    body: "A featured creator update, event notice, or campaign announcement can live here.",
  },
  {
    title: "Featured Story: The Glass Tower Invitation",
    type: "Story",
    body: "Public or invite-visible rooms can be promoted here instead of being hidden in chat history.",
  },
  {
    title: "Updated Character: Lilith",
    type: "Character Update",
    body: "Character revisions, new scenes, lore additions, or major behavior updates can be surfaced.",
  },
];

const tabs = [
  "Featured",
  "Characters",
  "Storys",
  "Images & Presets",
  "Updates",
  "Activity",
];

export default async function PublicProfilePage() {
  return (
    <>
      <StudioPageHeader eyebrow="Public Profile" title="@crestfallen">
        Preview how your creator page may appear to other Crestfall users.
      </StudioPageHeader>

      <section className="mt-8 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 font-display text-4xl text-[var(--muted-gold)]">
              C
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-4xl">crestfallen</h2>
                <span className="rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                  Chronicler
                </span>
              </div>

              <p className="mt-2 text-sm text-[var(--muted)]">
                0 characters · 0 rooms · 0 updates - 0 likes - 0 chats
              </p>

              <p className="mt-4 max-w-4xl leading-7 text-[var(--muted)]">
                A public creator profile for announcements, featured characters,
                Storys, image presets, events, updates, and community-facing
                activity.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] opacity-60"
          >
            Edit Soon
          </button>
        </div>

        <nav className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              disabled
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                index === 0
                  ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        {featuredItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[var(--muted-gold)]/15 bg-black/35 p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {item.type}
            </p>
            <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
            <p className="mt-3 leading-7 text-[var(--muted)]">{item.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}