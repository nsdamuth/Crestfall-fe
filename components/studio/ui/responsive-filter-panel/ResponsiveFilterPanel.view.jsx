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
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>

          {body ? (
            <p
              className={`mt-2 max-w-3xl leading-7 text-[var(--ink-dim)] ${
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
            className="cf-btn cf-btn--secondary md:hidden"
          >
            <SlidersHorizontal size={14} />
            {mobileOpen ? "Hide filters" : "Show filters"}
          </button>

          <button
            type="button"
            onClick={() => onToggleDesktopFilters?.()}
            className="hidden cf-btn cf-btn--secondary md:inline-flex"
          >
            <SlidersHorizontal size={14} />
            {desktopOpen ? "Hide filters" : "Show filters"}
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
