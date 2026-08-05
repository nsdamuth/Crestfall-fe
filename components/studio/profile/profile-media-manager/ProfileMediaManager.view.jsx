import ProfileAvatarView from "@/components/studio/profile/profile-avatar/ProfileAvatar.view";
import ProfileBannerView from "@/components/studio/profile/profile-banner/ProfileBanner.view";

export default function ProfileMediaManagerView({
  eyebrow = "Profile Media",
  description = "",
  avatar = {},
  banner = {},
}) {
  const {
    displayName = "Crestfall Creator",
    avatarUrl = null,
    size = "md",
    title: avatarTitle = "Active Profile Picture",
    description: avatarDescription = "",
    actionLabel: avatarActionLabel = "Choose Soon",
  } = avatar;

  const {
    bannerUrl = null,
    bannerTitle = "Profile Banner",
    compact = true,
    title: bannerSectionTitle = "Active Profile Banner",
    description: bannerDescription = "",
    actionLabel: bannerActionLabel = "Choose Soon",
  } = banner;

  return (
    <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/25 p-4">
          <ProfileAvatarView
            displayName={displayName}
            avatarUrl={avatarUrl}
            size={size}
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm text-[var(--foreground)]">{avatarTitle}</p>
            {avatarDescription ? (
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                {avatarDescription}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            disabled
            className="rounded-xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
          >
            {avatarActionLabel}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <ProfileBannerView
            bannerUrl={bannerUrl}
            title={bannerTitle}
            compact={compact}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--foreground)]">
                {bannerSectionTitle}
              </p>
              {bannerDescription ? (
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {bannerDescription}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              disabled
              className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
            >
              {bannerActionLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
