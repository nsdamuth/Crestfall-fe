export default function StudioAccountMetricsView({
  className = "grid grid-cols-2 gap-3 text-center",
  errorMessage = "",
  metricItems = [],
}) {
  return (
    <>
      {errorMessage ? (
        <p className="mb-3 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
          {errorMessage}
        </p>
      ) : null}

      <div className={className}>
        {metricItems.map((item, index) => (
          <div
            key={item?.id || item?.label || index}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          >
            <p className="font-display text-2xl">{item?.value ?? "0"}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              {item?.label || "Metric"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
