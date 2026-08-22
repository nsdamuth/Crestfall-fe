"use client";

// Presentation-only replacement for components/studio/StudioTopBar.jsx.
// The only Next dependency in the real wrapper is next/link for the
// account avatar; everything else (the demo notifications state, the
// mock notifications module) is already portable and reused verbatim
// here. The account link renders as a plain "a", same classes.
import StudioTopBarView from "@/components/studio/studio-top-bar/StudioTopBar.view";
import { useStudioTopBarViewModel } from "@/components/studio/studio-top-bar/useStudioTopBarViewModel";
import { STUDIO_TOP_BAR_MOCK_NOTIFICATIONS } from "@/components/studio/studio-top-bar/studioTopBarNotifications.mock";
import { useStudioTopBarNotificationsDemoState } from "@/components/studio/studio-top-bar/studioTopBarNotificationsDemoState";

export default function StudioTopBarShim({ user, onOpenMenu, ...props }) {
  const demoNotifications = useStudioTopBarNotificationsDemoState(
    STUDIO_TOP_BAR_MOCK_NOTIFICATIONS,
  );
  const viewProps = useStudioTopBarViewModel({
    user,
    notifications: demoNotifications.notifications,
    onOpenMenu,
    ...props,
  });

  return (
    <StudioTopBarView
      {...viewProps}
      onDismissNotification={demoNotifications.onDismissNotification}
      onClearAllNotifications={demoNotifications.onClearAllNotifications}
      accountLinkSlot={
        <a
          href={viewProps.accountHref}
          className="hidden h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:flex"
          aria-label={viewProps.accountAriaLabel}
        >
          {viewProps.accountInitial}
        </a>
      }
    />
  );
}
