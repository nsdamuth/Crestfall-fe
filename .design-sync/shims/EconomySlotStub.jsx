"use client";

// Honest stub, not a reimplementation. The real economySlot
// (components/studio/StudioEconomyWidget) reads live coin-balance
// data from StudioAccountProvider (components/studio/StudioAccountProvider.jsx),
// which is Chassis-owned account state per FE-REVIEW-01 and out of
// scope for a presentation-only sync. Rather than fabricate account
// data, this renders a plainly-labeled placeholder slot so previews
// are honest about what is real (the sidebar/top-bar/mobile-nav
// chrome) and what is not (the live coin balance).
export default function EconomySlotStub({ variant = "sidebar" }) {
  return (
    <div
      className="flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]"
      data-stub="economy-widget"
      data-variant={variant}
    >
      Economy widget (live data, out of sync scope)
    </div>
  );
}
