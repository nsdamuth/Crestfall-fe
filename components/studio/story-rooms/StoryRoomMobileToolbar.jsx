"use client";

export default function StoryRoomMobileToolbar({
  room,
  onOpenCast,
  onOpenState,
}) {
  return (
    <div className="mb-3 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4 xl:hidden">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          Story
        </p>

        <h1 className="mt-1 font-display text-3xl">{room.title}</h1>

        <p className="mt-1 text-xs text-[var(--muted)]">
          {room.scenario} · {room.roomMode}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenCast}
          className="rounded-xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
        >
          Cast / Room
        </button>

        <button
          type="button"
          onClick={onOpenState}
          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
        >
          State
        </button>
      </div>
    </div>
  );
}