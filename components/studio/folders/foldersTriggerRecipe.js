// The Folders and Select trigger recipe (ASSET-FOLDERS plan, package
// AF7, 14 Sep 2026): the Filter trigger's own class recipe
// (KitDropdown.view), so Select and Folders read as the controls
// beside it on both Media and Vault; gold while marked, the way the
// Filter trigger turns gold on a non-resting pick. Plain constants,
// no React, shared by app/studio/v2/images/ImagesV2Live.jsx and
// app/studio/v2/vault/VaultV2Mockup.jsx (moved here from a copy in
// each page at AF6).
export const FOLDERS_ROOT_LABEL = "Folders";

export const FOLDERS_TRIGGER_CLASS =
  "inline-flex min-w-0 max-w-[10rem] min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--step-above)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] [@media(pointer:coarse)]:min-h-[var(--control-md)]";
export const FOLDERS_TRIGGER_REST_CLASS =
  "text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]";
export const FOLDERS_TRIGGER_MARKED_CLASS = "text-[var(--gold-bright)]";
