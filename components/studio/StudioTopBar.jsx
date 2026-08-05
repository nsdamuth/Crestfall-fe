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
          className="rounded-full border border-[var(--gold-ornament)]/25 p-2.5 text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/50 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          aria-label={viewProps.accountAriaLabel}
        >
          <UserRound size={17} />
        </Link>
      }
    />
  );
}
