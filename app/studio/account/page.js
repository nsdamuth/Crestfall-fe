import Link from "next/link";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import StudioAccountProfile from "@/components/studio/account/StudioAccountProfile";
import StudioAccountCoins from "@/components/studio/account/StudioAccountCoins";
import StudioAccountMetrics from "@/components/studio/account/StudioAccountMetrics";

const accountRows = [
  {
    title: "Subscription",
    body: "Plan, billing, renewal, and future premium access controls.",
    href: "/studio/account/subscription",
  },
  {
    title: "Preferences",
    body: "Language, creator workflow defaults, discovery preferences, and page-level display settings.",
    href: "/studio/account/preferences",
  },
  {
    title: "Appearance",
    body: "Theme, density, list/grid defaults, and future Studio display controls.",
    href: "/studio/account/appearance",
  },
  {
    title: "Notifications",
    body: "Email preferences, product updates, room activity, creator alerts, and review notifications.",
    href: "/studio/account/notifications",
  },
  {
    title: "Privacy",
    body: "Profile visibility, public activity, blocked users, and account discoverability controls.",
    href: "/studio/account/privacy",
  },
  {
    title: "Safety & Content Settings",
    body: "Future SFW / mature filters, comfort settings, content boundaries, and moderation controls.",
    href: "/studio/account/safety",
  },
];

export default async function AccountPage() {
  return (
    <>
      <StudioPageHeader eyebrow="Account" title="Profile & Preferences">
        Manage your private account settings, Studio preferences, subscription
        status, and public creator profile.
      </StudioPageHeader>

      <section className="mt-8 space-y-6">
        <StudioAccountProfile />

        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
            <StudioAccountCoins />

            <div className="mt-6">
              <StudioAccountMetrics />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {accountRows.map((row) => (
              <Link
                key={row.title}
                href={row.href}
                className="group rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-5 transition hover:border-[var(--muted-gold)]/55 hover:bg-[var(--muted-gold)]/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-[var(--foreground)]">
                      {row.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                      {row.body}
                    </p>
                  </div>

                  <span className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] opacity-70 transition group-hover:opacity-100">
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="pt-2 text-center">
          <a
            href="/logout"
            className="text-sm uppercase tracking-[0.2em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Sign Out
          </a>
        </div>
      </section>
    </>
  );
}