import { SlidersHorizontal } from "lucide-react";

export default function ResponsiveFilterPanelView({
  eyebrow = "",
  body = "",
  actions = null,
  children = null,
  showMobileBody = false,
  mobileOpen = false,
  desktopOpen = true,
  onToggleMobileFilters = null,
  onToggleDesktopFilters = null,
}) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>

          {body ? (
            <p
              className={`mt-2 max-w-3xl leading-7 text-[var(--muted)] ${
                showMobileBody ? "block" : "hidden md:block"
              }`}
            >
              {body}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {actions}

          <button
            type="button"
            onClick={() => onToggleMobileFilters?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] md:hidden"
          >
            <SlidersHorizontal size={14} />
            {mobileOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            type="button"
            onClick={() => onToggleDesktopFilters?.()}
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] md:inline-flex"
          >
            <SlidersHorizontal size={14} />
            {desktopOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div
        className={`${mobileOpen ? "block" : "hidden"} ${
          desktopOpen ? "md:block" : "md:hidden"
        }`}
      >
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
