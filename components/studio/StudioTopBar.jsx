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
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          aria-label={viewProps.accountAriaLabel}
        >
          <UserRound size={17} />
        </Link>
      }
    />
  );
}
