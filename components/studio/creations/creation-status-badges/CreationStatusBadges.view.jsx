function formatLabel(value) {
  if (!value) return null;
  return String(value).replaceAll("_", " ");
}

function badgeClass(value) {
  const key = String(value || "").toUpperCase();

  if (["PRIVATE", "DRAFT", "NONE"].includes(key)) {
    return "border-white/10 bg-black/35 text-[var(--muted)]";
  }

  if (["UNLISTED", "PENDING_REVIEW", "IN_REVIEW"].includes(key)) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  }

  if (["PUBLIC", "APPROVED", "ACCEPTED", "CANON"].includes(key)) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (["REJECTED", "SUSPENDED", "EXPLICIT"].includes(key)) {
    return "border-red-400/25 bg-red-400/10 text-red-200";
  }

  if (["MATURE"].includes(key)) {
    return "border-purple-400/25 bg-purple-400/10 text-purple-200";
  }

  if (["SFW"].includes(key)) {
    return "border-sky-400/25 bg-sky-400/10 text-sky-200";
  }

  return "border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]";
}

export default function CreationStatusBadgesView({
  badges = [],
  compact = false,
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.id}
          className={`rounded-full border uppercase tracking-[0.14em] ${badgeClass(
            badge.value
          )} ${compact ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]"}`}
        >
          {formatLabel(badge.value)}
        </span>
      ))}
    </div>
  );
}
