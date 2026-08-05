import Link from "next/link";

const playActions = [
  {
    id: "official-games",
    title: "Play Official Crestfall",
    body: "Start with authored Crestfall stories, canon characters, official rooms, and continuity-aware world events.",
    href: "/studio/games",
    cta: "Browse Games",
  },
  {
    id: "community",
    title: "Play Community Stories",
    body: "Explore public characters, scenarios, rooms, templates, and reusable story assets made by other creators.",
    href: "/studio/community",
    cta: "Browse Community",
  },
  {
    id: "storylines",
    title: "Follow Storylines",
    body: "Browse official and community storylines built around characters, choices, rooms, and persistent continuity.",
    href: "/studio/storylines",
    cta: "View Storylines",
  },
];

const creatorActions = [
  {
    id: "create",
    title: "Create Assets",
    body: "Build characters, player characters, outfits, poses, scenarios, narrators, templates, locations, and registries.",
    href: "/studio/create",
    cta: "Open Creation Studio",
  },
  {
    id: "my-creations",
    title: "Manage My Creations",
    body: "Return to your drafts, templates, registries, visual assets, and published creations.",
    href: "/studio/my-creations",
    cta: "View My Work",
  },
  {
    id: "image-studio",
    title: "Build Images",
    body: "Compose images from characters, player characters, outfits, poses, locations, and rendering presets.",
    href: "/studio/image-studio",
    cta: "Open Image Studio",
  },
];

export default async function StudioPage() {
  return (
    <>
      <header className="flex flex-col gap-6 border-b border-[var(--muted-gold)]/15 pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted-gold)]">
            Crestfall Interactive
          </p>

          <h1 className="mt-4 font-display text-5xl tracking-[0.04em]">
            Play AI Story Games in Crestfall
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-[var(--muted)]">
            Start an official Crestfall story, explore community-created rooms
            and scenarios, or build your own characters, worlds, and continuity
            systems in the Studio.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/studio/games"
              className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/15 px-5 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-[var(--muted-gold)]/25"
            >
              Browse Games
            </Link>

            <Link
              href="/studio/community"
              className="rounded-[var(--radius-md)] border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.2em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            >
              Community Stories
            </Link>

            <Link
              href="/studio/create"
              className="rounded-[var(--radius-md)] border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.2em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            >
              Create Something
            </Link>
          </div>
        </div>

        <input
          type="search"
          placeholder="Search games, rooms, characters..."
          className="w-full rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/50 px-5 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)]/60 focus:border-[var(--muted-gold)]/60 lg:max-w-sm"
        />
      </header>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-gold)]">
            Start Playing
          </p>

          <h2 className="mt-4 font-display text-4xl">
            Choose an Official or Community Story
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-[var(--muted)]">
            Crestfall is built around playable AI story sessions: official canon
            experiences, community-made rooms, reusable scenarios, persistent
            characters, and continuity-aware worlds.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {playActions.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5 transition hover:border-[var(--muted-gold)]/40 hover:bg-[var(--muted-gold)]/10"
              >
                <h3 className="font-display text-2xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {card.body}
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  {card.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-gold)]">
            Continue
          </p>

          <h2 className="mt-4 font-display text-3xl">Your Story State</h2>

          <p className="mt-4 leading-7 text-[var(--muted)]">
            Persistent player state, active rooms, and ongoing story sessions
            will live here as the runtime comes online.
          </p>

          <Link
            href="/studio/my-creations"
            className="mt-8 inline-flex rounded-[var(--radius-md)] border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-5 py-3 text-sm uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            View My Stuff
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/35 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted-gold)]">
            Create Your Own
          </p>

          <h2 className="mt-4 font-display text-3xl">
            Build Characters, Rooms, Images, and Worlds
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-[var(--muted)]">
            The Studio is where creators build the assets that power playable
            stories: characters, player personas, scenarios, narrators, visual
            ingredients, stories, and continuity registries.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {creatorActions.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5 transition hover:border-[var(--muted-gold)]/40 hover:bg-[var(--muted-gold)]/10"
              >
                <h3 className="font-display text-2xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {card.body}
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  {card.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}