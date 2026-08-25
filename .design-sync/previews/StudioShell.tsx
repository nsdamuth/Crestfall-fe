// The exported "StudioShell" is the shim (../shims/StudioShellShim), which
// composes the sidebar/top-bar/mobile-nav shims exactly as the real Binding
// Shell does (see .design-sync/NOTES.md).
import StudioShell from "../shims/StudioShellShim";

function PageBody() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-6)]">
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        Studio
      </p>
      <h1 className="mt-2 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
        Page content renders here
      </h1>
      <p className="mt-2 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        StudioShell owns the canvas background and the sidebar/content flex
        layout only; it does not own what mounts inside it.
      </p>
    </div>
  );
}

export function Default() {
  return (
    <StudioShell user={{ email: "lilith@vermillioncoast.example" }} pathname="/studio">
      <PageBody />
    </StudioShell>
  );
}
