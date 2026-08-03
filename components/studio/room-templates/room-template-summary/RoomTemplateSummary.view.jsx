export default function RoomTemplateSummaryView({
  eyebrow = "Story",
  summaryRows = [],
} = {}) {
  const safeRows = Array.isArray(summaryRows) ? summaryRows : [];

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
        {safeRows.map((row, index) => (
          <p key={row?.id || `${row?.label || "summary"}-${index}`}>
            {row?.label || "Summary"}: {row?.value ?? ""}
          </p>
        ))}
      </div>
    </div>
  );
}
