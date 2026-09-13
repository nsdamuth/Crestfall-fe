// Breadcrumb row, RULED 12 Sep 2026 (eight-fix package, FIX 4).
// Portable presentation only: no router, no pathname, no route tree.
// The caller hands over display-ready items; the last one is the
// current page and renders as text.
//
// One line at every width. Link crumbs are `flex-none` up to a
// capped width and truncate past it; the current crumb is `flex-1
// min-w-0` and truncates with an ellipsis, so the row never wraps
// and never widens the page. Every crumb resolves to `--control-md`
// (44px) tall so each is a full tap target, per the standing
// touch-target law.
import { ChevronRight } from "lucide-react";

const CRUMB_BASE =
  "inline-flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] text-[length:var(--text-ui)] leading-[var(--lh-ui)]";

export default function KitBreadcrumbsView({
  items = [],
  ariaLabel = "Breadcrumb",
  LinkComponent = "a",
}) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label={ariaLabel} className="min-w-0 max-w-full">
      <ol className="flex min-w-0 max-w-full flex-nowrap items-center gap-[var(--space-1)]">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;
          const key = `${item?.href || item?.label}-${index}`;

          return (
            <li
              key={key}
              className={`flex min-w-0 items-center gap-[var(--space-1)] ${
                isCurrent ? "flex-1" : "flex-none max-w-[12rem]"
              }`}
            >
              {isCurrent || !item?.href ? (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={`${CRUMB_BASE} min-w-0 max-w-full ${
                    isCurrent ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"
                  }`}
                >
                  <span className="block min-w-0 truncate">{item?.label}</span>
                </span>
              ) : (
                <LinkComponent
                  href={item.href}
                  className={`${CRUMB_BASE} min-w-0 max-w-full text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--gold-bright)]`}
                >
                  <span className="block min-w-0 truncate">{item.label}</span>
                </LinkComponent>
              )}
              {!isCurrent ? (
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  className="flex-none text-[var(--ink-faint)]"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
