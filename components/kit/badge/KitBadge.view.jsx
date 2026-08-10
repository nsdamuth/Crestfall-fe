const BASE_CLASSES =
  "inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-[var(--weight-medium)] uppercase tracking-[var(--track-label)]";

function getBadgeClasses(variant, surface) {
  const onArt = surface === "art";

  const bed = onArt
    ? "border border-[var(--line)] bg-[var(--tag-bed-art)]"
    : "border-0 bg-[var(--tag-bed-canvas)]";

  // Recipe default: gold-bright on canvas, plain ink over art. Canon
  // overrides back to gold-bright even over art (the one badge with an
  // art-context override); status is quiet ink-dim on canvas only, the
  // art default already reads as plain ink so it needs no override.
  let text = onArt ? "text-[var(--ink)]" : "text-[var(--gold-bright)]";
  if (variant === "canon") {
    text = "text-[var(--gold-bright)]";
  } else if (variant === "status" && !onArt) {
    text = "text-[var(--ink-dim)]";
  }

  const meta = variant === "meta" ? "backdrop-blur-[var(--blur-3)]" : "";

  return [BASE_CLASSES, bed, text, meta].filter(Boolean).join(" ");
}

export default function KitBadgeView({
  label = "",
  variant = "status",
  surface = "canvas",
}) {
  if (!label) return null;

  return <span className={getBadgeClasses(variant, surface)}>{label}</span>;
}
