"use client";

// The circular geometric Crestfall mark (fe/chat-studio brief 3 items 4
// and 5, 13 Sep 2026): symbol i-59 in public/assets/icons/icons-v7.svg,
// the same drawing the primary sidebar's header lockup uses, never the
// six-petal rosette. One file for the story gallery placeholder and the
// story list row placeholders so the two never drift. Ornament gold,
// sized by the caller.
export default function StoryRoomMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`shrink-0 text-[var(--gold-ornament)] ${className}`}
    >
      <use href="/assets/icons/icons-v7.svg#i-59" />
    </svg>
  );
}
