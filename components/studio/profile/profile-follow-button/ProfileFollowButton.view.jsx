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
      className="cf-btn cf-btn--primary"
    >
      {isSaving ? "Saving..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
