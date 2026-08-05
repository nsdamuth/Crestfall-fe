export default function ProfileAvatarView({
  displayName = "Creator",
  avatarUrl = null,
  size = "md",
}) {
  const initial = (displayName || "C").slice(0, 1).toUpperCase();

  const sizeClass =
    size === "lg"
      ? "h-24 w-24 text-4xl"
      : size === "sm"
        ? "h-12 w-12 text-xl"
        : "h-16 w-16 text-2xl";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 font-display text-[var(--gold-ornament)] ${sizeClass}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${displayName} avatar`}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
}
