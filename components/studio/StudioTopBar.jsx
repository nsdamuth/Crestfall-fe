"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import StudioTopBarView from "./studio-top-bar/StudioTopBar.view";
import { useStudioTopBarViewModel } from "./studio-top-bar/useStudioTopBarViewModel";

export default function StudioTopBar({ onOpenMenu, ...props }) {
  const pathname = usePathname();
  const router = useRouter();
  const viewProps = useStudioTopBarViewModel({
    pathname,
    onOpenMenu,
    // Global search rows navigate through the app router; the Kit and
    // the top bar View never import next/navigation themselves.
    navigate: (href) => router.push(href),
    ...props,
  });

  return (
    <StudioTopBarView
      {...viewProps}
      accountLinkSlot={
        <Link
          href={viewProps.accountHref}
          className="hidden h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:flex"
          aria-label={viewProps.accountAriaLabel}
        >
          {viewProps.accountInitial}
        </Link>
      }
    />
  );
}
