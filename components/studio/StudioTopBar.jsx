"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

import StudioTopBarView from "./studio-top-bar/StudioTopBar.view";
import { useStudioTopBarViewModel } from "./studio-top-bar/useStudioTopBarViewModel";

export default function StudioTopBar(props) {
  const viewProps = useStudioTopBarViewModel(props);

  return (
    <StudioTopBarView
      {...viewProps}
      accountLinkSlot={
        <Link
          href={viewProps.accountHref}
          className="rounded-full border border-[var(--muted-gold)]/25 p-2.5 text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/50 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
          aria-label={viewProps.accountAriaLabel}
        >
          <UserRound size={17} />
        </Link>
      }
    />
  );
}
