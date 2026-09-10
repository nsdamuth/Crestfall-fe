"use client";

// ONE "Soon" chip for every control the backend cannot serve yet:
// the composer's footer button on a stage the Chassis cannot run, the
// viewer's Upscale and Assign, the download menu's Extra Large row. Lifted out
// of KitImageViewer.view.jsx (FE/MEDIA-STUDIO session 4, 10 Sep 2026)
// the way InfoTip and MenuRow were lifted in session 3, so the chip is
// shared by construction rather than by copy. The disabled control
// itself carries title "Not available yet"; this chip is the label.
export const SOON_LABEL = "Soon";

export function SoonChip({ inline = false }) {
  return (
    <span
      className={`flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)] ${
        inline ? "" : "ml-[var(--space-2)]"
      }`}
    >
      {SOON_LABEL}
    </span>
  );
}
