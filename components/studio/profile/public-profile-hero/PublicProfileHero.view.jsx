export default function PublicProfileHeroView({
  creatorEyebrow = "Crestfall Creator",
  bannerPlaceholderEyebrow = "Banner Slot",
  bannerPlaceholderDescription =
    "Generated profile banner will appear here.",
  username = "crestfallen_creator",
  displayName = "Crestfallen_creator",
  bannerUrl = null,
  bio = "No public bio yet.",
  stats = [],
  avatarSlot = null,
  followersLinkSlot = null,
  followingLinkSlot = null,
  engagementActionsSlot = null,
} = {}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--muted-gold)]/20 bg-black/30 shadow-2xl shadow-black/30">
      <div
        className="relative min-h-[280px] bg-[radial-gradient(circle_at_top_left,rgba(214,184,111,0.22),transparent_36%),linear-gradient(135deg,rgba(38,27,21,0.95),rgba(6,6,8,0.98))]"
        style={
          bannerUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.86)), url(${bannerUrl})`,
                backgroundPosition: "40% 38%",
              }
            : undefined
        }
      >
        {!bannerUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/30 px-6 py-4 text-center backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
                {bannerPlaceholderEyebrow}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {bannerPlaceholderDescription}
              </p>
            </div>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="relative flex min-h-[280px] flex-col justify-end p-5 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="-mb-12 shrink-0">{avatarSlot}</div>

              <div className="pb-1">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
                  {creatorEyebrow}
                </p>

                <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)] md:text-5xl">
                  {displayName}
                </h1>

                <p className="mt-2 text-sm text-[var(--muted)]">@{username}</p>

                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    {followersLinkSlot}
                    {followingLinkSlot}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 [&_*]:!mt-0 [&_a]:!inline-flex [&_a]:!h-11 [&_a]:!items-center [&_a]:!justify-center [&_a]:!py-0 [&_a]:!leading-none [&_button]:!inline-flex [&_button]:!h-11 [&_button]:!items-center [&_button]:!justify-center [&_button]:!py-0 [&_button]:!leading-none [&_svg]:shrink-0">
                    {engagementActionsSlot}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:min-w-[440px]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center backdrop-blur"
                >
                  <p className="font-serif text-2xl text-[var(--foreground)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 pt-16 md:px-8">
        <p className="max-w-4xl text-sm leading-7 text-[var(--muted)]">
          {bio}
        </p>
      </div>
    </section>
  );
}
