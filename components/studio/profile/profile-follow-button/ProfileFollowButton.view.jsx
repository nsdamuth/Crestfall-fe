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
      className="rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSaving ? "Saving..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
