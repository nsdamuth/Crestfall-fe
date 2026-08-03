"use client";

export default function CreationTagFilterRowView({
  tags = [],
  activeTag = "ALL",
  onTagChange = null,
  label = "Tags",
  allValue = "ALL",
}) {
  if (!tags.length) return null;

  const pills = [
    { label: "All", value: allValue },
    ...tags.map((tag) => ({ label: tag, value: tag })),
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => {
          const isActive =
            activeTag.toLowerCase() === pill.value.toLowerCase();

          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => onTagChange?.(pill.value)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                isActive
                  ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/20 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
