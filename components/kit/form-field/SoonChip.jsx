"use client";

// ONE "Soon" chip for every control the backend cannot serve yet:
// the composer's footer button on a stage the Chassis cannot run, the
// viewer's Upscale and Assign, the download menu's Extra Large row. Lifted out
// of KitImageViewer.view.jsx (FE/MEDIA-STUDIO session 4, 10 Sep 2026)
// the way InfoTip and MenuRow were lifted in session 3, so the chip is
// shared by construction rather than by copy. The disabled control
// itself carries title "Not available yet"; this chip is the label.
// The composer's mode toggle (session 5) renders the same chip on its
// Video option through the optional `label`, which defaults to the
// one word every other consumer shows.
export const SOON_LABEL = "Soon";

export function SoonChip({ inline = false, label = SOON_LABEL }) {
  return (
    <span
      className={`flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)] ${
        inline ? "" : "ml-[var(--space-2)]"
      }`}
    >
      {label || SOON_LABEL}
    </span>
  );
}
