"use client";

// Fixture-mode action notice for the v2 staging mockups (R4, 10 Aug
// 2026 review gate: nothing on these surfaces may feel dead). Every
// control whose real behavior waits on live wiring opens this
// non-persisting stub instead of doing nothing: the press is
// acknowledged, what the control WILL do is stated honestly, and
// nothing is saved, posted, or navigated (HIDE/STUB law,
// docs/FRONTEND-SOP.md section 5). Shared staging scaffolding for
// the mockups only, never composed by a shipped kit package; real
// persistence and navigation stay with live wiring at cutover.
import KitModalFrame from "@/components/kit/KitModalFrame";

export default function FixtureActionNotice({ notice = null, onClose = null }) {
  if (!notice) return null;

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-md"
      onClose={onClose}
      ariaLabel={notice.label || "Preview action"}
    >
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {notice.label || "Preview action"}
        </p>
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
          {notice.message ||
            "This action is wired when the page goes live. Nothing happens in this preview."}
        </p>
        <div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="cf-btn cf-btn--secondary"
          >
            Close
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
