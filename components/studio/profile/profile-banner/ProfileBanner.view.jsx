export default function ProfileBannerView({
  bannerUrl = null,
  title = "Profile Banner",
  compact = false,
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 ${
        compact ? "h-24" : "h-44"
      }`}
    >
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/75 to-[var(--gold-ornament)]/10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold-ornament)]">
              Banner Slot
            </p>
            <p className="mt-2 text-sm text-[var(--ink-dim)]">
              Generated profile banner will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
