"use client";

import Link from "next/link";

import StudioTopBarView from "./studio-top-bar/StudioTopBar.view";
import { useStudioTopBarViewModel } from "./studio-top-bar/useStudioTopBarViewModel";
import { STUDIO_TOP_BAR_MOCK_NOTIFICATIONS } from "./studio-top-bar/studioTopBarNotifications.mock";

export default function StudioTopBar(props) {
  const viewProps = useStudioTopBarViewModel({
    notifications: STUDIO_TOP_BAR_MOCK_NOTIFICATIONS,
    ...props,
  });

  return (
    <StudioTopBarView
      {...viewProps}
      accountLinkSlot={
        <Link
          href={viewProps.accountHref}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          aria-label={viewProps.accountAriaLabel}
        >
          {viewProps.accountInitial}
        </Link>
      }
    />
  );
}
