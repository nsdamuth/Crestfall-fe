"use client";

export default function StoryRoomMobileToolbar({
  room,
  onOpenCast,
  onOpenState,
}) {
  return (
    <div className="mb-3 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-4 xl:hidden">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Story
        </p>

        <h1 className="mt-1 font-display text-3xl">{room.title}</h1>

        <p className="mt-1 text-xs text-[var(--ink-dim)]">
          {room.scenario} · {room.roomMode}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenCast}
          className="rounded-xl border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
        >
          Cast / Room
        </button>

        <button
          type="button"
          onClick={onOpenState}
          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
        >
          State
        </button>
      </div>
    </div>
  );
}