"use client";

export default function ProfileFollowButtonView({
  isVisible = false,
  isFollowing = false,
  isSaving = false,
  onToggleFollow = null,
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onToggleFollow?.()}
      disabled={isSaving}
      className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSaving ? "Saving..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
