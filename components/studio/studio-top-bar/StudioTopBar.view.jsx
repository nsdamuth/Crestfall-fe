"use client";

import { useState } from "react";
import { Bell, Search, UserRound } from "lucide-react";

export default function StudioTopBarView({
  searchValue = "",
  searchPlaceholder = "Search tools and builders",
  searchAutoFocus = false,
  notifications = [],
  notificationsLabel = "Notifications",
  initialNotificationsOpen = false,
  accountHref = "/studio/account",
  accountAriaLabel = "Account",
  accountLinkSlot = null,
  onSearchChange = () => {},
  onOpenNotifications = () => {},
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(
    initialNotificationsOpen,
  );
  const hasNotifications = notifications.length > 0;

  function closeNotifications() {
    setNotificationsOpen(false);
  }

  function toggleNotifications() {
    setNotificationsOpen((open) => {
      const next = !open;
      if (next) onOpenNotifications?.();
      return next;
    });
  }

  function handleNotificationsKeyDown(event) {
    if (event.key === "Escape") closeNotifications();
  }

  return (
    <header className="mb-[var(--space-8)] hidden items-center gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] px-[var(--space-5)] py-[var(--space-3)] lg:flex">
      <div className="relative ml-auto flex w-full max-w-[26rem] items-center">
        <Search
          size={16}
          className="pointer-events-none absolute left-[var(--space-4)] text-[var(--ink-faint)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          autoFocus={searchAutoFocus}
          className="h-[var(--control-md)] w-full touch-manipulation rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] pl-[var(--space-9)] pr-[var(--space-4)] font-sans text-[var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
        />
      </div>

      <div
        className="relative shrink-0"
        onKeyDown={handleNotificationsKeyDown}
      >
        <button
          type="button"
          onClick={toggleNotifications}
          aria-label={notificationsLabel}
          aria-expanded={notificationsOpen}
          className={`flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-full)] border bg-[var(--surface-2)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] ${
            hasNotifications
              ? "border-[var(--line-strong)] text-[var(--gold-action)] shadow-[var(--glow-hover)]"
              : "border-[var(--line)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          }`}
        >
          <Bell size={17} />
        </button>

        {notificationsOpen ? (
          <>
            <button
              type="button"
              aria-label={`Close ${notificationsLabel.toLowerCase()}`}
              onClick={closeNotifications}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="cf-dropdown absolute right-0 top-[calc(100%+var(--space-2))] z-50 w-72">
              {hasNotifications ? (
                <ul className="divide-y divide-[var(--line-whisper)]">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="px-[var(--space-3)] py-[var(--space-3)]"
                    >
                      <p className="text-[var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] text-pretty">
                        {notification.title}
                      </p>
                      {notification.timeAgo ? (
                        <p className="mt-1 text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
                          {notification.timeAgo}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-[var(--space-3)] py-[var(--space-4)] text-center text-[var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
                  No notifications yet.
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>

      {accountLinkSlot || (
        <a
          href={accountHref}
          aria-label={accountAriaLabel}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
        >
          <UserRound size={17} />
        </a>
      )}
    </header>
  );
}
