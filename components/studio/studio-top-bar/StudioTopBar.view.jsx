"use client";

import { Bell, Menu, Moon, Sun } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function StudioTopBarView({
  searchValue = "",
  searchPlaceholder = "Search characters, stories, and adventures",
  searchAutoFocus = false,
  notifications = [],
  notificationsStatus = "idle",
  notificationsLoadError = "",
  notificationsLabel = "Notifications",
  notificationsView = null,
  bellRef = null,
  themeMode = "dark",
  themeToggleAriaLabel = "Switch to Eggshell theme",
  accountHref = "/studio/account",
  accountAriaLabel = "Account",
  accountInitial = "?",
  accountLinkSlot = null,
  openMenuAriaLabel = "Open menu",
  onSearchChange = () => {},
  onOpenNotifications = () => {},
  onToggleTheme = () => {},
  onCloseNotifications = () => {},
  onOpenMenu = () => {},
}) {
  const hasNotifications = notifications.length > 0;
  const isOpen = notificationsView === "compact";
  const isLoading = notificationsStatus === "loading";
  const hasLoadError = notificationsStatus === "error";

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center gap-[var(--space-3)] border-b border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] backdrop-blur-[var(--blur-chrome)] px-[var(--space-5)] py-[var(--space-3)]">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={openMenuAriaLabel}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          autoFocus={searchAutoFocus}
          className="ml-auto h-[var(--control-md)] w-full max-w-[26rem] touch-manipulation rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] font-sans text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[color:var(--ink)] placeholder:text-[length:var(--text-label)] placeholder:font-[var(--weight-regular)] placeholder:text-[color:var(--ink-faint)] focus-visible:border-[var(--gold-action)]"
        />

        <button
          ref={bellRef}
          type="button"
          onClick={onOpenNotifications}
          aria-label={notificationsLabel}
          aria-expanded={isOpen}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
        >
          <Bell size={17} />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={themeToggleAriaLabel}
          title={themeToggleAriaLabel}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,background-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line-strong)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
        >
          {themeMode === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {accountLinkSlot || (
          <a
            href={accountHref}
            aria-label={accountAriaLabel}
            className="hidden h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:flex"
          >
            {accountInitial}
          </a>
        )}
      </header>

      {isOpen ? (
        <KitModalFrame
          onClose={onCloseNotifications}
          ariaLabelledBy="studio-notif-title"
          panelClassName="w-full max-w-[29rem] p-[var(--space-5)]"
        >
          <div className="mb-[var(--space-4)] pr-[var(--space-10)]">
            <h2
              id="studio-notif-title"
              className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-[var(--weight-medium)]"
            >
              {notificationsLabel}
            </h2>
            <p className="mt-1 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
              Recent public releases and Coins received.
            </p>
          </div>

          {isLoading ? (
            <NotificationMessage>Loading recent activity…</NotificationMessage>
          ) : hasLoadError ? (
            <NotificationMessage>
              {notificationsLoadError || "Notifications could not be loaded."}
            </NotificationMessage>
          ) : hasNotifications ? (
            <ul className="max-h-[62dvh] overflow-y-auto divide-y divide-[var(--line-whisper)] pr-1">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
          ) : (
            <NotificationMessage>
              No recent public releases or Coin gifts yet.
            </NotificationMessage>
          )}
        </KitModalFrame>
      ) : null}
    </>
  );
}

function NotificationMessage({ children }) {
  return (
    <p className="py-[var(--space-5)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[color:var(--ink-faint)]">
      {children}
    </p>
  );
}

function NotificationRow({ notification = {} }) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-[var(--radius-full)] bg-[var(--gold-action)]"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-medium)] text-pretty text-[var(--ink)]">
          {notification.title}
        </h3>
        {notification.body ? (
          <p className="mt-1 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-dim)]">
            {notification.body}
          </p>
        ) : null}
        <p className="mt-1 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
          {notification.supportingLine}
        </p>
      </div>
    </>
  );

  if (notification.href) {
    return (
      <li>
        <a
          href={notification.href}
          className="flex items-start gap-[var(--space-3)] py-[var(--space-3)] transition-colors hover:text-[var(--gold-action)]"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-[var(--space-3)] py-[var(--space-3)]">
      {content}
    </li>
  );
}
